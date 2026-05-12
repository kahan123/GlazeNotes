const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Groq } = require('groq-sdk');
const Note = require('../models/noteModel');

// Initialize Gemini for embeddings (deactivated in favor of real-time Groq semantic ranking)
const genAI = null;

// Initialize Groq for auto-tagging
const groqClient = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

// Server-side cooldown cache to throttle embedding generation on rapid autosave keystrokes (protects API keys from 429 quota exceptions)
const embeddingCooldowns = new Map();

const generateTagsFromAI = async (title, content) => {
    if (!groqClient || !content) return [];
    try {
        const cleanContent = content.replace(/<[^>]*>/g, '').slice(0, 1000).trim(); // strip HTML tags
        
        if (!cleanContent) return [];

        const prompt = `
        Analyze the following note title and content and suggest 2 to 4 highly relevant, concise, single-word tags or categories (e.g. "work", "ideas", "recipes", "javascript").
        Return ONLY a raw JSON array of strings, without markdown formatting or backticks.
        
        Title: "${title}"
        Content: "${cleanContent}"
        `;
        
        const chatCompletion = await groqClient.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 128
        });

        const textResponse = (chatCompletion.choices[0]?.message?.content || "").trim();
        
        // Clean markdown backticks if returned
        const cleanedText = textResponse.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
        const tags = JSON.parse(cleanedText);
        
        if (Array.isArray(tags)) {
            return tags.map(t => t.toLowerCase().trim()).filter(Boolean);
        }
        return [];
    } catch (err) {
        console.error('Failed to auto-generate tags with Groq:', err);
        return [];
    }
};

const generateEmbeddingFromAI = async (title, content) => {
    if (!genAI) return [];
    try {
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const cleanContent = content.replace(/<[^>]*>/g, '').trim(); // strip HTML tags
        const textToEmbed = `Title: ${title}\nContent: ${cleanContent}`;
        
        if (!textToEmbed.trim()) return [];
        
        const result = await model.embedContent(textToEmbed);
        if (result && result.embedding && result.embedding.values) {
            return result.embedding.values;
        }
        return [];
    } catch (err) {
        console.error('Failed to generate embedding:', err);
        return [];
    }
};

// @desc    Get notes (with pagination)
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // 20 notes per page by default
    const skip = (page - 1) * limit;

    const total = await Note.countDocuments({ user: req.user.id });
    const notes = await Note.find({ user: req.user.id })
        .sort({ isPinned: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        notes,
        pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
            hasMore: page * limit < total
        }
    });
};

// @desc    Create note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
    if (!req.body.title && !req.body.content) {
        return res.status(400).json({ message: 'Please add a title or content' });
    }

    const title = req.body.title || 'Untitled';
    const content = req.body.content || '';

    let tags = req.body.tags || [];
    if (tags.length === 0 && content) {
        tags = await generateTagsFromAI(title, content);
    }

    // Generate embedding on save
    const embedding = await generateEmbeddingFromAI(title, content);

    const note = await Note.create({
        user: req.user.id,
        title,
        content,
        contentPreview: req.body.contentPreview || '',
        tags,
        isPinned: req.body.isPinned || false,
        embedding
    });

    res.status(200).json(note);
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }

    // Check for user
    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the note user
    if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    const title = req.body.title !== undefined ? req.body.title : note.title;
    const content = req.body.content !== undefined ? req.body.content : note.content;

    // Auto generate tags if we are saving/updating content and tag array is empty
    let tags = req.body.tags;
    if (req.body.content && (!tags || tags.length === 0)) {
        tags = await generateTagsFromAI(title, content);
        req.body.tags = tags;
    }

    // Update embedding if title or content changed (enforces cooldown to protect API keys from rapid keystroke rate-limits)
    if (req.body.title !== undefined || req.body.content !== undefined) {
        const now = Date.now();
        const lastGenerated = embeddingCooldowns.get(req.params.id) || 0;
        const isManualSave = req.body.isManualSave === true;

        if (isManualSave || (now - lastGenerated > 45000) || !note.embedding || note.embedding.length === 0) {
            req.body.embedding = await generateEmbeddingFromAI(title, content);
            embeddingCooldowns.set(req.params.id, now);
        } else {
            // Re-use previous embedding to avoid hitting free-tier 429 rate limits
            req.body.embedding = note.embedding;
        }
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedNote);
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }

    // Check for user
    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the note user
    if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    await note.deleteOne();

    res.status(200).json({ id: req.params.id });
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
const getNote = async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }

    // Make sure the logged in user matches the note user
    if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    res.status(200).json(note);
};

// @desc    Get a public note by ID
// @route   GET /api/notes/public/:id
// @access  Public
const getPublicNote = async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note || !note.isPublic) {
        return res.status(404).json({ message: 'Note not found or is private' });
    }

    res.status(200).json(note);
};

// @desc    Search notes (Semantic & Full-text)
// @route   GET /api/notes/search
// @access  Private
const searchNotes = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || !q.trim()) {
            return res.status(200).json({ results: [], searchType: 'none' });
        }

        const queryText = q.trim();
        console.log(`\n--- [Groq Search Debug] ---`);
        console.log(`User ID: ${req.user.id}`);
        console.log(`Query: "${queryText}"`);

        // 1. Fetch user's notes
        const notes = await Note.find({ user: req.user.id });
        console.log(`Notes in DB for user: ${notes.length}`);

        if (!notes || notes.length === 0) {
            console.log(`No notes found for user. Exiting.`);
            return res.status(200).json({ results: [], searchType: 'groq-semantic' });
        }

        let searchResults = [];
        let searchType = 'keyword-fallback';

        if (groqClient) {
            try {
                searchType = 'groq-semantic';

                // Format notes into a lightweight payload for Groq context window efficiency
                const notesToRank = notes.map(note => {
                    const cleanText = (note.contentPreview || note.content || '').replace(/<[^>]*>/g, '').trim();
                    return {
                        id: note._id.toString(),
                        title: note.title || 'Untitled',
                        tags: note.tags || [],
                        snippet: cleanText.substring(0, 350) // pass slightly more context
                    };
                });

                const systemPrompt = `You are the high-speed search and semantic relevance ranking engine for GlazeNotes.
Your task is to analyze the user's search query and rank the provided list of notes by semantic relevance.

Calculate a relevance score (similarityScore) between 0.00 and 1.00 for each note based on how conceptually relevant it is to the query.
- 1.00 means perfect semantic match (highly relevant conceptually, even if using different words).
- 0.00 means absolutely zero relevance.
- Be generous with conceptual matches (e.g. query "gym" matches note about "squats", "deadlifts", "hypertrophy" with a score of 0.85; query "coding speed" matches note about "React optimization", "memoization" with 0.85; query "coffee" matches note about "brewing" with 0.85).

You must return ONLY a valid JSON object containing a "rankedNotes" array of objects with "id" (string) and "similarityScore" (number) sorted descending by score. Do not return any other text, conversational sentences, markdown formatting, or backticks.

Example Output format:
{
  "rankedNotes": [
    { "id": "603d2b27f6e8c424a4f89d31", "similarityScore": 0.85 },
    { "id": "603d2b27f6e8c424a4f89d32", "similarityScore": 0.15 }
  ]
}`;

                const userPrompt = `USER QUERY: "${queryText}"

NOTES TO RANK:
${JSON.stringify(notesToRank, null, 2)}`;

                const chatCompletion = await groqClient.chat.completions.create({
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    model: 'llama-3.3-70b-versatile',
                    temperature: 0.1,
                    response_format: { type: "json_object" }
                });

                const responseText = chatCompletion.choices[0]?.message?.content || '{}';
                console.log(`Groq Raw Response:\n`, responseText);

                // Clean markdown block wrappers if Llama included them despite json_object mode
                const cleanedResponse = responseText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
                const parsed = JSON.parse(cleanedResponse);
                const scoreMap = new Map();

                if (parsed.rankedNotes && Array.isArray(parsed.rankedNotes)) {
                    parsed.rankedNotes.forEach(item => {
                        scoreMap.set(item.id, Number(item.similarityScore) || 0);
                    });
                }

                console.log(`Parsed Score Map:`, Array.from(scoreMap.entries()));

                // Map relevance scores back to the original database note records
                searchResults = notes.map(note => {
                    const similarity = scoreMap.get(note._id.toString()) || 0;
                    return {
                        ...note.toObject(),
                        similarityScore: similarity
                    };
                })
                .filter(note => note.similarityScore > 0.1 || note.title.toLowerCase().includes(queryText.toLowerCase()))
                .sort((a, b) => b.similarityScore - a.similarityScore);

                console.log(`Results Returned: ${searchResults.length}`);

            } catch (err) {
                console.error('Groq semantic search failed, falling back to local search:', err);
                searchType = 'keyword-fallback';
            }
        }

        // Fallback local text matching if Groq is misconfigured or hits a limit
        if (searchType === 'keyword-fallback') {
            console.log(`Running Local Keyword Search Fallback...`);
            searchResults = notes.map(note => {
                const titleMatch = note.title.toLowerCase().includes(queryText.toLowerCase());
                const contentText = (note.contentPreview || note.content || '').replace(/<[^>]*>/g, '').toLowerCase();
                const contentMatch = contentText.includes(queryText.toLowerCase());
                const score = (titleMatch ? 1.0 : 0) + (contentMatch ? 0.5 : 0);
                
                return {
                    ...note.toObject(),
                    similarityScore: score
                };
            })
            .filter(note => note.similarityScore > 0)
            .sort((a, b) => b.similarityScore - a.similarityScore);
            console.log(`Local Fallback Results: ${searchResults.length}`);
        }

        console.log(`-------------------------------\n`);
        res.status(200).json({ results: searchResults, searchType });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error performing search' });
    }
};

module.exports = {
    getNotes,
    getNote,
    getPublicNote,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
};
