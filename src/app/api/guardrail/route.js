import { QdrantVectorStore } from "@langchain/qdrant";
import { qdrantClient } from "../../../lib/qdrant";
import { pipeline } from "@xenova/transformers";
import llmGuardrail from "llm_guardrail";

const COLLECTION_NAME = "prompt_injection_examples";
const SIMILARITY_THRESHOLD = 0.7;

// Initialize embedding pipeline (local Hugging Face model)
let embedder = null;

async function getEmbeddingFunction() {
  if (!embedder) {
    console.log("Loading Xenova embedding model...");
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
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
      const output = await embedder(doc, { pooling: 'mean', normalize: true });
      embeddings.push(Array.from(output.data));
    }
    
    return embeddings;
  }

  async embedQuery(query) {
    const embedder = await getEmbeddingFunction();
    const output = await embedder(query, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }
}

// Check vector similarity
async function checkVectorSimilarity(text) {
  try {
    const embeddings = new XenovaEmbeddings();
    const vectorStore = new QdrantVectorStore(embeddings, {
      client: qdrantClient,
      collectionName: COLLECTION_NAME,
    });

    // Search for similar injection examples
    const results = await vectorStore.similaritySearchWithScore(text, 5);
    
    console.log(`Found ${results.length} similar examples for similarity check`);
    
    for (const [doc, score] of results) {
      if (score > SIMILARITY_THRESHOLD) {
        return {
          isSimilar: true,
          similarExample: doc.pageContent,
          similarity: score,
          metadata: doc.metadata
        };
      }
    }
    
    return { isSimilar: false };
  } catch (error) {
    console.error("Vector similarity check error:", error);
    // If vector DB fails, don't block - return safe result
    return { isSimilar: false, error: "Vector similarity check failed" };
  }
}

export async function POST(request) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return Response.json(
        { error: "Content is required and must be a string" },
        { status: 400 },
      );
    }

    console.log("🛡️ Starting two-layer guardrail check...");

    // Layer 1: LLM Guardrail check
    console.log("Layer 1: LLM Guardrail check");
    const guardrailResult = await llmGuardrail.check(content);
    
    if (guardrailResult.isBlocked) {
      console.log("❌ Layer 1: Content blocked by LLM guardrail");
      return Response.json({
        success: true,
        blocked: true,
        layer: "llm_guardrail",
        reason: "Content flagged by primary LLM guardrail",
        details: guardrailResult,
        similarity: null
      });
    }

    console.log("✅ Layer 1: Passed LLM guardrail check");

    // Layer 2: Vector similarity check
    console.log("Layer 2: Vector similarity check");
    const similarityResult = await checkVectorSimilarity(content);
    
    if (similarityResult.isSimilar) {
      console.log("❌ Layer 2: Similar injection pattern found");
      return Response.json({
        success: true,
        blocked: true,
        layer: "vector_similarity",
        reason: "Content similar to known injection patterns",
        details: {
          similarExample: similarityResult.similarExample,
          similarity: similarityResult.similarity,
          metadata: similarityResult.metadata
        },
        llmGuardrail: guardrailResult
      });
    }

    console.log("✅ Layer 2: Passed vector similarity check");
    console.log("🟢 Two-layer check complete: Content is safe");

    return Response.json({
      success: true,
      blocked: false,
      message: "Content passed both guardrail layers",
      layers: {
        llmGuardrail: {
          passed: true,
          details: guardrailResult
        },
        vectorSimilarity: {
          passed: true,
          details: similarityResult
        }
      }
    });

  } catch (error) {
    console.error("Guardrail route error:", error);
    return Response.json(
      {
        error: "Failed to process guardrail check",
        details: error.message,
      },
      { status: 500 },
    );
  }
}