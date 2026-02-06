import { QdrantVectorStore } from "@langchain/qdrant";
import { qdrantClient } from "../../../lib/qdrant";
import { Document } from "@langchain/core/documents";
import { pipeline } from "@xenova/transformers";

const COLLECTION_NAME = "prompt_injection_examples";

// Initialize embedding pipeline (local Hugging Face model)
let embedder = null;

async function getEmbeddingFunction() {
  if (!embedder) {
    console.log("Loading Xenova embedding model...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

// Custom embedding class for Xenova
class XenovaEmbeddings {
  constructor() {
    this.modelName = "Xenova/all-MiniLM-L6-v2";
  }

  async embedDocuments(documents) {
    const embedder = await getEmbeddingFunction();
    const embeddings = [];

    for (const doc of documents) {
      const output = await embedder(doc, { pooling: "mean", normalize: true });
      embeddings.push(Array.from(output.data));
    }

    return embeddings;
  }

  async embedQuery(query) {
    const embedder = await getEmbeddingFunction();
    const output = await embedder(query, { pooling: "mean", normalize: true });
    return Array.from(output.data);
  }
}

// Initialize vector store
async function getVectorStore() {
  const embeddings = new XenovaEmbeddings();

  try {
    // Try to get existing collection info
    await qdrantClient.getCollection(COLLECTION_NAME);
    console.log(`✓ Using existing collection: ${COLLECTION_NAME}`);

    return new QdrantVectorStore(embeddings, {
      client: qdrantClient,
      collectionName: COLLECTION_NAME,
    });
  } catch (error) {
    // Collection doesn't exist, create it
    console.log(`Creating new collection: ${COLLECTION_NAME}`);
    await qdrantClient.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 384, // Xenova/all-MiniLM-L6-v2 produces 384-dimensional embeddings
        distance: "Cosine",
      },
    });

    return new QdrantVectorStore(embeddings, {
      client: qdrantClient,
      collectionName: COLLECTION_NAME,
    });
  }
}

export async function POST(request) {
  try {
    const { example, category, description, severity } = await request.json();

    if (!example || typeof example !== "string") {
      return Response.json(
        { error: "Example text is required and must be a string" },
        { status: 400 },
      );
    }

    // Get vector store
    const vectorStore = await getVectorStore();

    // Generate a unique ID for the example
    const exampleId = `injection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create document with metadata
    const document = new Document({
      pageContent: example,
      metadata: {
        id: exampleId,
        category: category || "general",
        description: description || "Prompt injection example",
        severity: severity || "medium",
        dateAdded: new Date().toISOString(),
        type: "prompt_injection",
      },
    });

    // Add document to vector store
    await vectorStore.addDocuments([document]);

    console.log(`✓ Added prompt injection example: ${exampleId}`);

    return Response.json({
      success: true,
      message: "Prompt injection example added successfully",
      id: exampleId,
      added: {
        example,
        category: category || "general",
        description: description || "Prompt injection example",
        severity: severity || "medium",
      },
    });
  } catch (error) {
    console.error("Admin route error:", error);
    return Response.json(
      {
        error: "Failed to add example to vector database",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    return Response.json({
      success: true,
      message: "Admin API is active - using Xenova local embeddings",
      collection: COLLECTION_NAME,
      status: "ready",
      embeddingModel: "Xenova/all-MiniLM-L6-v2",
    });
  } catch (error) {
    console.error("Admin GET route error:", error);
    return Response.json(
      { error: "Failed to access admin API", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return Response.json(
        { error: "Example ID is required" },
        { status: 400 },
      );
    }

    // Note: QdrantVectorStore doesn't have a direct delete by metadata method
    // In a production app, you'd need to implement this differently

    return Response.json({
      success: false,
      message:
        "Delete functionality needs to be implemented with direct Qdrant client calls",
      note: "Use Qdrant's delete API directly for specific document deletion",
    });
  } catch (error) {
    console.error("Admin DELETE route error:", error);
    return Response.json(
      {
        error: "Failed to delete example from vector database",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
