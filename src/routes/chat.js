import router from 'express';
import { getGeminiResponse } from '../services/gemini.ts';
import { getGroqResponse, getGroqStreamResponse } from '../services/groq.ts';

const chatRouter = router();

chatRouter.post('/chat', async (req, res) => {
    try {
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

chatRouter.post('/chat-stream', async (req, res) => {
    // Set Headers for SEE.
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');


    try {
        const { messages, model } = req.body;

        if (!messages || messages.length === 0) {
            return res.status(400).json({ error: 'messages is required' });
        }

        const send = (data) => {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        };

    await getGroqStreamResponse(messages, model, send);

    } catch (error) {
        console.log("Got the error", error);
        res.write(`data: ${JSON.stringify({ error: 'Internal server error' })}\n\n`);

    } finally {
        res.end();
    }
})

export default chatRouter;