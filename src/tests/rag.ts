import { loadWebPage } from "../services/documentLoader.ts";
import { splitDocuments } from "../services/documentProcessor.ts";
import { ensureIndexAndUpsertDocs, queryDocs } from "../services/pinecone.ts";


async function test_rag() {

    const docs = await loadWebPage(
      "https://lilianweng.github.io/posts/2023-06-23-agent/",
    );

    console.assert(docs.length === 1);
    console.log(`Total characters: ${docs[0].pageContent.length}`);

    const results = await splitDocuments(docs);

    console.log(`Split into ${results.length} sub-documents.`);

    await ensureIndexAndUpsertDocs(results.slice(0, 30));

    // Query the index.
    const query = "what is the role of AI.";

    await queryDocs(query);
}

test_rag();