import router from 'express';
import { getGeminiResponse } from '../services/gemini.ts';
import { getGroqResponse, getGroqStreamResponse } from '../services/groq.ts';
import { queryDocs } from '../services/pinecone.ts';

const chatRouter = router();

chatRouter.post('/chat', async (req, res) => {
    try {
        const { messages, model } = req.body;

        if (!messages || messages.length === 0) {
            return res.status(400).json({ error: 'messages is required' });
        }

        const groqResponse = await getGroqResponse(updatedMessages, model);

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

        const result = await queryDocs(messages[messages.length - 1]?.content);

        let context = "";

        const hits = result.result.hits;

        for (const hit of hits) {
            if (hit._score > 0.3) {
                context += `Context: ${hit.fields.chunk_text}\nSource: ${hit.fields.source}\n\n`;
            }
        }

        // Append context in the messages.
        if (context.trim() === "") {
            context = "No relevant context found.";
        }

        const lastMessage = messages[messages.length - 1];
        const updatedMessages = [...messages.slice(0, messages.length-1), 
            {...lastMessage, content: `${lastMessage.content}\n\nContext:\n${context}`},
            { id: "system-message", 
                role: "system", 
                content: `
                You are a DocuScout AI assistant which answer based on the provided context only.

                Rules & Behaviors:
                1. You must answer based on the provided context only. If there is no context provided, you must respond to the user with the appropriate message.
                2. If you have reference any text from the context provided make sure that you mention that chunk explicity with the source provided in the context.
                3. Never answer based on your own knowledge or any other source outside the context provided.

                Use the context provided to answer the user's question.` 
            }
        ];

        console.log("Updated messages", updatedMessages);

        await getGroqStreamResponse(updatedMessages, model, send);

    } catch (error) {
        console.log("Got the error", error);
        res.write(`data: ${JSON.stringify({ error: 'Internal server error' })}\n\n`);

    } finally {
        res.end();
    }
})

export default chatRouter;