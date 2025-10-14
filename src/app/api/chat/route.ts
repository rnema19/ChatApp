import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import {openai} from "@ai-sdk/openai"

// import OpenAI from "openai"
// const openai = new OpenAI(
//     {
//         apiKey : process.env.OPENAI_API_KEY
//     }
// );

const apiKey = process.env.AI_GATEWAY_API_KEY;
// const client = new Mistral({apiKey:apiKey});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, chatId } = await req.json();
    // console.log("Messages: ", messages);
    let lastMessage
    let convertedMessages : any[] = []
    if (messages && Array.isArray(messages)) {
        convertedMessages = messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content || (msg.parts ? 
                msg.parts.map((p: any) => p.text).join('') : '')
        }));
        
        const lastMsg = convertedMessages[convertedMessages.length - 1];
        lastMessage = lastMsg.content;
    }
    
    try{
        let chatData = await db.select().from(chats).where(eq(chats.id, chatId))
        if (chatData.length!=1) {
            return NextResponse.json(
                {
                    "error": "chat not found"
                },
                {
                    status: 404
                }
            )
        }
        let file_key = chatData[0].fileKey
        let context = await getContext(lastMessage.content,file_key)

        const promptMessage = {
            role : "system",
            content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
                    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
                    AI is a well-behaved and well-mannered individual.
                    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
                    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
                    AI assistant is a big fan of Pinecone and Vercel.
                    START CONTEXT BLOCK
                    ${context}
                    END OF CONTEXT BLOCK
                    AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
                    If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
                    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
                    AI assistant will not invent anything that is not drawn directly from the context.
                    `,
        }

        const result = streamText({
            model: openai("gpt-4.1-mini"),
            messages : [
                promptMessage,
                ...convertedMessages
            ],

        });
        // console.log("Stream chat response: ", result.toUIMessageStreamResponse());
        
        return result.toUIMessageStreamResponse()
    } catch (error) {
        console.log("Error while generating response from the chat...");        
        throw error
    }
}