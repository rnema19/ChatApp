import { Pinecone } from "@pinecone-database/pinecone";
import { convertTOAscii } from "./utils"; 
import { getEmbeddings } from "./embeddings";

export const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

type Metadata = {
    text : string,
    pageNumber : number
}

export async function getMatchesFromEmbeddings(embeddings:number[], file_key : string) {
    try {
        const pineconeIndex = pc.Index("chat-pdf")        
        const namespace = convertTOAscii(file_key)

        const queryIndex = await pineconeIndex.namespace(namespace).query({
            topK : 8,
            vector : embeddings,
            includeMetadata : true,
        })
        return queryIndex.matches || []
    } catch (error) {
        console.log("Error querrying embeddings...", error);
        throw error        
    }
}

export async function getContext(query:string, file_key : string) {
    const queryEmbeddingsResponse = await getEmbeddings(query)
    if (!queryEmbeddingsResponse || !Array.isArray(queryEmbeddingsResponse)) {
        throw new Error("Failed to generate embeddings for query");
    }
    // Extract the actual array of embeddings from the response
    const queryEmbeddings = queryEmbeddingsResponse
    const matches = await getMatchesFromEmbeddings(queryEmbeddings,file_key)
    const qualifyingDocs = matches.filter(match => {
        return typeof match.score === "number" && match.score > 0.2
    })

    const sourceMatches = qualifyingDocs.length > 0 ? qualifyingDocs : matches.slice(0,3)
    const docs = sourceMatches
        .map(match => (match.metadata as Metadata | undefined)?.text)
        .filter((text): text is string => typeof text === "string" && text.trim().length > 0)

    return docs.join('\n').substring(0,5000)
}
