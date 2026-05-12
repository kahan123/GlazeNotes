const { Groq } = require('groq-sdk');
const Chat = require('../models/chatModel');

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// @desc    Get chat history for a note
// @route   GET /api/ai/chat/:noteId
// @access  Private
const getChatHistory = async (req, res) => {
    try {
        const { noteId } = req.params;
        const chat = await Chat.findOne({ user: req.user.id, noteId });

        if (!chat) {
            return res.status(200).json({ messages: [] });
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error('Failed to get chat history:', error);
        res.status(500).json({ message: 'Failed to retrieve chat history' });
    }
};

// @desc    Chat with AI (with history)
// @route   POST /api/ai/chat/:noteId
// @access  Private
const chatAI = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        if (!process.env.GROQ_API_KEY) {
            console.error('Error: GROQ_API_KEY is missing');
            return res.status(500).json({ message: 'GROQ_API_KEY not configured. Please add it to your .env file.' });
        }

        // 1. Fetch or create chat history for this note
        let chat = await Chat.findOne({ user: req.user.id, noteId });
        if (!chat) {
            chat = await Chat.create({
                user: req.user.id,
                noteId,
                messages: []
            });
        }

        // Get the last 15 messages for context to keep within reasonable prompt size
        const recentMessages = chat.messages.slice(-15);
        const historyContext = recentMessages.map(msg => 
            `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
        ).join('\n');

        const prompt = `
        You are "GlazeAI", a premium, state-of-the-art AI companion integrated directly inside GlazeNotes (the ultimate glassmorphic note-taking and knowledge base application).
        
        IDENTITY INSTRUCTIONS:
        - Your name is strictly "GlazeAI".
        - When asked who you are, what your purpose is, or who created you, proudly identify yourself as "GlazeAI, the official AI productivity companion for GlazeNotes".
        - You are specialized in editing notes, brainstorming ideas, proofreading, summarizing documents, and organizing thoughts inside GlazeNotes.
        - NEVER say you are just a generic large language model. You are GlazeAI.
        
        CONTEXT (The user's current note content inside the GlazeNotes editor):
        "${context || 'No context provided'}"

        CONVERSATION HISTORY:
        ${historyContext || 'No previous messages.'}

        USER REQUEST:
        "${message}"

        INSTRUCTIONS:
        - Provide a highly helpful, concise, and structured response.
        - If the user asks to rewrite, summarize, or edit, use the provided note context to help them.
        - Format your response beautifully in Markdown. Use clean, professional headings, bullet points, and code blocks where appropriate.
        `;

        // 2. Setup Groq Chat Completion
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1
        });

        const text = chatCompletion.choices[0]?.message?.content || "";

        // 3. Save User and AI messages to History
        chat.messages.push({ role: 'user', text: message });
        chat.messages.push({ role: 'ai', text });
        await chat.save();

        res.status(200).json({ reply: text, chat });
    } catch (error) {
        console.error('AI Chat Error:', error);
        
        const errorMessage = error.message || '';
        if (errorMessage.toLowerCase().includes('rate limit') || error.status === 429) {
            return res.status(429).json({ 
                message: 'GlazeAI rate limit exceeded. Please wait a brief moment and try again!' 
            });
        } else if (errorMessage.toLowerCase().includes('api key') || error.status === 401) {
            return res.status(401).json({ 
                message: 'Invalid or missing GROQ_API_KEY. Please verify your .env file configuration.' 
            });
        }
        
        res.status(500).json({ message: 'Failed to generate AI response' });
    }
};

// @desc    Clear chat history for a note
// @route   DELETE /api/ai/chat/:noteId
// @access  Private
const clearChatHistory = async (req, res) => {
    try {
        const { noteId } = req.params;
        await Chat.findOneAndDelete({ user: req.user.id, noteId });
        res.status(200).json({ message: 'Chat history cleared successfully', messages: [] });
    } catch (error) {
        console.error('Failed to clear chat history:', error);
        res.status(500).json({ message: 'Failed to clear chat history' });
    }
};

// @desc    Summarize note content
// @route   POST /api/ai/summarize
// @access  Private
const summarizeNote = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ message: 'GROQ_API_KEY not configured' });
        }

        const cleanContent = content.replace(/<[^>]*>/g, '').trim();

        const prompt = `
        Summarize the following note text.
        Your summary should be concise, professional, and formatted in clean HTML paragraphs or list items.
        It must be wrapped inside a modern blockquote: <blockquote><strong>TL;DR:</strong> ...text...</blockquote>.
        Only return the raw HTML string, no markdown code blocks.

        Note Text:
        "${cleanContent}"
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 1024,
            top_p: 1
        });

        let summaryHtml = chatCompletion.choices[0]?.message?.content || "";

        // Clean any markdown code block wrap if returned
        summaryHtml = summaryHtml.replace(/^```html\s*/i, '').replace(/```$/, '').trim();

        res.status(200).json({ summary: summaryHtml });
    } catch (error) {
        console.error('AI Summarize Error:', error);
        
        const errorMessage = error.message || '';
        if (errorMessage.toLowerCase().includes('rate limit') || error.status === 429) {
            return res.status(429).json({ 
                message: 'GlazeAI daily free-tier rate limit exceeded. Please try again shortly!' 
            });
        }
        
        res.status(500).json({ message: 'Failed to generate summary' });
    }
};

module.exports = {
    getChatHistory,
    chatAI,
    clearChatHistory,
    summarizeNote
};
