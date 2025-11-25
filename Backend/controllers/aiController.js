const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Chat with AI
// @route   POST /api/ai/chat
// @access  Private
const chatAI = async (req, res) => {
    try {
        const { message, context } = req.body;

        console.log('AI Request Received');
        console.log('API Key configured:', !!process.env.GEMINI_API_KEY);

        if (!process.env.GEMINI_API_KEY) {
            console.error('Error: Gemini API Key is missing');
            return res.status(500).json({ message: 'Gemini API Key not configured' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are a helpful, intelligent writing assistant integrated into a note-taking app.
        
        CONTEXT (The user's current note content):
        "${context || 'No context provided'}"

        USER REQUEST:
        "${message}"

        INSTRUCTIONS:
        - Provide a helpful, concise response.
        - If the user asks to rewrite or summarize, use the provided context.
        - Format your response in Markdown.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ message: 'Failed to generate AI response' });
    }
};

module.exports = { chatAI };
