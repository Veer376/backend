import router from 'express';
import { getGeminiResponse } from '../services/gemini.ts';
import { getGroqResponse, getGroqStreamResponse } from '../services/groq.ts';
import { queryDocs } from '../services/pinecone.ts';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import { Document } from "@langchain/core/documents";
import { splitDocuments } from '../services/documentProcessor.ts'
import { ensureIndexAndUpsertDocs } from '../services/pinecone.ts';

const documentRouter = router();

const upload = multer({ });

documentRouter.post('/documents/ingest', upload.single('pdf-file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'PDF file is required' });
        }

        const buffer = req.file.buffer;

        const parser = new PDFParse({ data: buffer});

        const data = await parser.getText();

        const doc = new Document({
            pageContent: data.text,
            metadata: {
                source: "Ingested PDF",
            }
        });

        // We can break down the document into chunks.
        const docs = await splitDocuments([doc]);

        // I will ingest docs into pinecone. 
        await ensureIndexAndUpsertDocs(docs);

        res.status(200).json({ message: 'PDF file ingested successfully' });

    } catch (error) {
        console.log("error: ", error.message);
        res.status(500).json({ error: 'Failed to ingest PDF file' });
    }
});

export default documentRouter;