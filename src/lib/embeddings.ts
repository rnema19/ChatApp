// /*
import OpenAI from "openai"
const openai = new OpenAI(
    {
        apiKey : process.env.OPENAI_API_KEY
    }
);

export async function getEmbeddings(text:string) {
    try {        
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text.replace(/\n/g," "),
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
