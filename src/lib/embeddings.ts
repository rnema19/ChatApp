// /*
import OpenAI from "openai"
const openai = new OpenAI(
    {
        apiKey : process.env.OPENAI_API_KEY
    }
);

export async function getEmbeddings(text:string) {
    if (typeof text !== "string" || text.trim().length === 0) {
        throw new Error("Cannot generate embeddings for empty text")
    }

    try {        
        const input = text.replace(/\n/g," ")
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input,
            dimensions : 1536
        });        
        const result = response.data[0].embedding
        return result

    } catch (error) {
        console.log("Error while calling OPENAI api embeddings");
        throw error        
    }
}
// */
