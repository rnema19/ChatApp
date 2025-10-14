"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.splitDocument = exports.loadS3IntoPinecone = exports.pc = void 0;
// Import the Pinecone library
var pinecone_1 = require("@pinecone-database/pinecone");
var s3_server_1 = require("./s3-server");
var pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
var text_splitter_1 = require("langchain/text_splitter");
var documents_1 = require("@langchain/core/documents");
var embeddings_1 = require("./embeddings");
var utils_1 = require("./utils");
// Initialize a Pinecone client with your API key
exports.pc = new pinecone_1.Pinecone({ apiKey: process.env.PINECONE_API_KEY });
function loadS3IntoPinecone(file_key) {
    return __awaiter(this, void 0, void 0, function () {
        var file_name, loader, pages, documents, flatDocs_1, vectorPromises, vectors, validVectors, pineconeIndex, namespace, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    // 1. Download PDF from S3
                    console.log("📥 1. Downloading from S3:", file_key);
                    return [4 /*yield*/, s3_server_1.downloadFromS3(file_key)];
                case 1:
                    file_name = _a.sent();
                    if (!file_name) {
                        throw new Error("Error while downloading file from S3");
                    }
                    console.log("✅ Downloaded to:", file_name);
                    // 2. Load PDF
                    console.log("📄 2. Loading PDF...");
                    loader = new pdf_1.PDFLoader(file_name);
                    return [4 /*yield*/, loader.load()];
                case 2:
                    pages = (_a.sent());
                    console.log("\u2705 Loaded " + pages.length + " pages");
                    // 3. Split and segment the pdf
                    console.log("✂️ 3. Splitting documents...");
                    return [4 /*yield*/, Promise.all(pages.map(function (page) { return splitDocument([page]); }))];
                case 3:
                    documents = _a.sent();
                    flatDocs_1 = documents.flat();
                    console.log("\u2705 Split into " + flatDocs_1.length + " chunks");
                    if (flatDocs_1.length === 0) {
                        throw new Error("No document chunks created");
                    }
                    // 4. Vectorize and embed individual documents
                    console.log("🔢 4. Generating embeddings...");
                    vectorPromises = flatDocs_1.map(function (doc, index) { return __awaiter(_this, void 0, void 0, function () {
                        var error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    console.log("   Embedding chunk " + (index + 1) + "/" + flatDocs_1.length);
                                    return [4 /*yield*/, embedDocument(doc, file_key, index)];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2:
                                    error_2 = _a.sent();
                                    console.error("   \u274C Failed to embed chunk " + (index + 1) + ":", error_2);
                                    return [2 /*return*/, null];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(vectorPromises)];
                case 4:
                    vectors = _a.sent();
                    validVectors = vectors.filter(function (v) { return v !== null; });
                    console.log("\u2705 Successfully embedded " + validVectors.length + "/" + flatDocs_1.length + " chunks");
                    if (validVectors.length === 0) {
                        throw new Error("No valid embeddings generated");
                    }
                    // 5. Upload to pinecone
                    console.log("☁️ 5. Uploading to Pinecone...");
                    pineconeIndex = exports.pc.Index("chat-pdf");
                    namespace = utils_1.convertTOAscii(file_key);
                    console.log("   Namespace: " + namespace);
                    console.log("   Vectors to upload: " + validVectors.length);
                    return [4 /*yield*/, pineconeIndex.namespace(namespace).upsert(validVectors)];
                case 5:
                    _a.sent();
                    console.log("✅ Successfully uploaded all vectors to Pinecone");
                    return [2 /*return*/, documents[0]];
                case 6:
                    error_1 = _a.sent();
                    console.error("❌ Error in loadS3IntoPinecone:", error_1);
                    throw error_1;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.loadS3IntoPinecone = loadS3IntoPinecone;
function embedDocument(doc, file_key, index) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var embeddings, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    // Validate document content
                    if (!doc.pageContent || doc.pageContent.trim().length === 0) {
                        console.warn("   \u26A0\uFE0F Skipping empty document at index " + index);
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, embeddings_1.getEmbeddings(doc.pageContent.trim())];
                case 1:
                    embeddings = _b.sent();
                    console.log(embeddings);
                    return [2 /*return*/, {
                            id: file_key + "-chunk-" + index,
                            values: embeddings,
                            metadata: {
                                text: doc.pageContent,
                                pageNumber: doc.metadata.pageNumber || 1
                            }
                        }];
                case 2:
                    error_3 = _b.sent();
                    console.error("   ❌ Error in embed document:", {
                        error: error_3,
                        docPreview: (_a = doc.pageContent) === null || _a === void 0 ? void 0 : _a.substring(0, 100),
                        pageNumber: doc.metadata.pageNumber
                    });
                    throw error_3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function splitDocument(page) {
    return __awaiter(this, void 0, void 0, function () {
        var splitter, docOutput, validDocs, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
                        chunkSize: 1000,
                        chunkOverlap: 200,
                        separators: ["\n\n", "\n", ".", "!", "?", ",", " ", ""]
                    });
                    return [4 /*yield*/, splitter.splitDocuments(page.map(function (p) {
                            var _a;
                            return new documents_1.Document({
                                pageContent: p.pageContent,
                                metadata: {
                                    pageNumber: ((_a = p.metadata.loc) === null || _a === void 0 ? void 0 : _a.pageNumber) || 1
                                }
                            });
                        }))];
                case 1:
                    docOutput = _a.sent();
                    validDocs = docOutput.filter(function (doc) { return doc.pageContent.trim().length > 10; });
                    console.log("   Split page into " + validDocs.length + " chunks (filtered from " + docOutput.length + ")");
                    return [2 /*return*/, validDocs];
                case 2:
                    error_4 = _a.sent();
                    console.error("   ❌ Error in splitting document:", error_4);
                    throw error_4;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.splitDocument = splitDocument;
