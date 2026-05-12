require('dotenv').config();
const mongoose = require('mongoose');
const { Groq } = require('groq-sdk');
const Note = require('./models/noteModel');

const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function runTest() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const notes = await Note.find({});
        console.log(`Found ${notes.length} notes total`);

        const queryText = "gym or workout";

        const notesToRank = notes.map(note => {
            const cleanText = (note.contentPreview || note.content || '').replace(/<[^>]*>/g, '').trim();
            return {
                id: note._id.toString(),
                title: note.title || 'Untitled',
                tags: note.tags || [],
                snippet: cleanText.substring(0, 350)
            };
        });

        console.log("Notes sent to Groq:", JSON.stringify(notesToRank, null, 2));

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

        console.log("Sending to Groq...");
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
        console.log("RAW RESPONSE FROM GROQ:\n", responseText);

        const cleanedResponse = responseText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
        const parsed = JSON.parse(cleanedResponse);
        console.log("PARSED JSON:", parsed);

        mongoose.disconnect();
    } catch (e) {
        console.error("Error:", e);
        mongoose.disconnect();
    }
}

runTest();
