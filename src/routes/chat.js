import router from 'express';
import { getGeminiResponse } from '../services/gemini.ts';
import { getGroqResponse } from '../services/groq.ts';

const chatRouter = router();

chatRouter.post('/chat', async (req, res) => {
    try {
        throw new Error("getGroqResponse function is not implemented yet.");
        
        const { messages, model } = req.body;

        if (!messages || messages.length === 0) {
            return res.status(400).json({ error: 'messages is required' });
        }

        const groqResponse = await getGroqResponse(messages, model);

        return res.status(200).json({ response: groqResponse });

    } catch (error) {
        console.log("Got the error", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

export default chatRouter;