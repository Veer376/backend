import router from 'express';
import { getGeminiResponse } from '../services/gemini.ts';

const chatRouter = router();

chatRouter.post('/chat', (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const geminiResponse = getGeminiResponse(prompt);

        return res.status(200).json({ response: geminiResponse });

    } catch (error) {
        console.log("Got the error", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

export default chatRouter;