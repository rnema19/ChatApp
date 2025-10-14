/*
// Import the Pinecone library
import { Pinecone } from '@pinecone-database/pinecone'
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from '@langchain/core/documents';
import { getEmbeddings } from './embeddings';
import { convertTOAscii } from './utils';

// Initialize a Pinecone client with your API key
export const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export async function loadS3IntoPinecone(file_key:string) {
    // 1. obtain the pdf -> download the pdf from S3
    console.log("downloading from S3 into our local file system");
    const file_name = await downloadFromS3(file_key)
    if (!file_name) {
        throw new Error("Error while downloading file from S3.....")
    }
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[]
    // 1. return pdfPages

    // 2. Split and segment the pdf
    const documents = await Promise.all(pages.map(page => splitDocument([page])))

    // 3. vectorize and embed individual documents
    const vectors = await Promise.all(documents.flat().map(doc => embedDocument(doc)))

    // 4. upload to pinecone
    const pineconeIndex = pc.Index("chat-pdf")
    console.log("inserting vectors into pinecone");

    const namespace = convertTOAscii(file_key)
    await pineconeIndex.namespace(namespace).upsert(vectors)

    return documents[0]
}

type PDFPage = {
    pageContent : string,
    metadata : {
        loc : {pageNumber:number}
    }
}

async function embedDocument(doc:Document) {
    try {
        const embeddings = await getEmbeddings(doc.pageContent.trim());
             
        // const hash = md5
        return {
            id : crypto.randomUUID(),
            values : embeddings,
            metadata : {
                text : doc.pageContent,
                pageNumber : doc.metadata.pageNumber
            }
        }
    } catch (error) {
        console.error("Error in embed document:", {
            error: error,
            docPreview: doc.pageContent?.substring(0, 100),
            pageNumber: doc.metadata.pageNumber
        });        
        throw error
    }
}

export async function splitDocument(page:PDFPage[]) {
    // let [metadata] = page
    try {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 50,
            chunkOverlap: 1,
            separators: ["\n"],
        });

        const docOutput = await splitter.splitDocuments(
            page.map(p => new Document({ 
                pageContent: p.pageContent,
                metadata: {
                    pageNumber : p.metadata.loc?.pageNumber
                } }),
            )
        );
        return docOutput
    } catch (error) {
        console.log("Error in splitting document: ", error);
        throw error
        
    }    
} 
*/

// Import the Pinecone library
import { Pinecone } from '@pinecone-database/pinecone'
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from '@langchain/core/documents';
import { getEmbeddings } from './embeddings';
import { convertTOAscii } from './utils';

// Initialize a Pinecone client with your API key
export const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export async function loadS3IntoPinecone(file_key: string) {
    try {
        // 1. Download PDF from S3
        console.log("📥 1. Downloading from S3:", file_key);
        const file_name = await downloadFromS3(file_key);
        
        if (!file_name) {
            throw new Error("Error while downloading file from S3");
        }
        console.log("✅ Downloaded to:", file_name);

        // 2. Load PDF
        console.log("📄 2. Loading PDF...");
        const loader = new PDFLoader(file_name);
        const pages = (await loader.load()) as PDFPage[];
        console.log(`✅ Loaded ${pages.length} pages`);

        // 3. Split and segment the pdf
        console.log("✂️ 3. Splitting documents...");
        const documents = await Promise.all(pages.map(page => splitDocument([page])));
        const flatDocs = documents.flat();
        console.log(`✅ Split into ${flatDocs.length} chunks`);

        if (flatDocs.length === 0) {
            throw new Error("No document chunks created");
        }

        // 4. Vectorize and embed individual documents
        console.log("🔢 4. Generating embeddings...");
        const vectorPromises = flatDocs.map(async (doc, index) => {
            try {
                console.log(`   Embedding chunk ${index + 1}/${flatDocs.length}`);
                return await embedDocument(doc, file_key, index);
            } catch (error) {
                console.error(`   ❌ Failed to embed chunk ${index + 1}:`, error);
                return null;
            }
        });

        const vectors = await Promise.all(vectorPromises);
        const validVectors = vectors.filter(v => v !== null);
        
        console.log(`✅ Successfully embedded ${validVectors.length}/${flatDocs.length} chunks`);

        if (validVectors.length === 0) {
            throw new Error("No valid embeddings generated");
        }

        // 5. Upload to pinecone
        console.log("☁️ 5. Uploading to Pinecone...");
        const pineconeIndex = pc.Index("chat-pdf");
        const namespace = convertTOAscii(file_key);
        
        console.log(`   Namespace: ${namespace}`);
        console.log(`   Vectors to upload: ${validVectors.length}`);
        
        await pineconeIndex.namespace(namespace).upsert(validVectors);
        
        console.log("✅ Successfully uploaded all vectors to Pinecone");

        return documents[0];

    } catch (error) {
        console.error("❌ Error in loadS3IntoPinecone:", error);
        throw error;
    }
}

type PDFPage = {
    pageContent: string,
    metadata: {
        loc: { pageNumber: number }
    }
}

async function embedDocument(doc: Document, file_key: string, index: number) {
    try {
        // Validate document content
        if (!doc.pageContent || doc.pageContent.trim().length === 0) {
            console.warn(`   ⚠️ Skipping empty document at index ${index}`);
            return null;
        }

        const embeddings = await getEmbeddings(doc.pageContent.trim());
        console.log(embeddings);        

        return {
            id: `${file_key}-chunk-${index}`,
            values: embeddings,
            metadata: {
                text: doc.pageContent,
                pageNumber: doc.metadata.pageNumber || 1
            }
        };
    } catch (error) {
        console.error("   ❌ Error in embed document:", {
            error: error,
            docPreview: doc.pageContent?.substring(0, 100),
            pageNumber: doc.metadata.pageNumber
        });
        throw error;
    }
}

export async function splitDocument(page: PDFPage[]) {
    try {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,        // Fix: Increased from 50 (too small!)
            chunkOverlap: 200,      // Fix: Increased overlap
            separators: ["\n\n", "\n", ".", "!", "?", ",", " ", ""], // Fix: Better separators
        });

        const docOutput = await splitter.splitDocuments(
            page.map(p => new Document({
                pageContent: p.pageContent,
                metadata: {
                    pageNumber: p.metadata.loc?.pageNumber || 1
                }
            }))
        );
        
        // Filter out empty or very small chunks
        const validDocs = docOutput.filter(doc => doc.pageContent.trim().length > 10);
        
        console.log(`   Split page into ${validDocs.length} chunks (filtered from ${docOutput.length})`);
        
        return validDocs;
    } catch (error) {
        console.error("   ❌ Error in splitting document:", error);
        throw error;
    }
}
