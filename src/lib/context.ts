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
            topK : 5,
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
    let queryEmbeddingsResponse = await getEmbeddings(query)
    if (!queryEmbeddingsResponse || !Array.isArray(queryEmbeddingsResponse)) {
        throw new Error("Failed to generate embeddings for query");
    }
    // Extract the actual array of embeddings from the response
    const queryEmbeddings = queryEmbeddingsResponse
    let matches = await getMatchesFromEmbeddings(queryEmbeddings,file_key)
    let qualifyingDocs = matches.filter(match => {
        // considering 70% matching above
        return match.score && match.score > 0.7
    })
    let docs = qualifyingDocs.map(match => {
        return (match.metadata as Metadata).text
    })
    return docs.join('\n').substring(0,5000)
}