import { loadWebPage } from "../services/documentLoader.ts";

async function test_loadWebPage() {
    
    const docs = await loadWebPage(
      "https://lilianweng.github.io/posts/2023-06-23-agent/",
    );

    console.assert(docs.length === 1);
    console.log(`Total characters: ${docs[0].pageContent.length}`);
}

test_loadWebPage();