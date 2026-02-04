import { checkAll } from "llm_guardrail";

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return Response.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Run guardrail checks
    const result = await checkAll(message);

    return Response.json({
      allowed: result.allowed,
      overallRisk: result.overallRisk,
      threatsDetected: result.threatsDetected,
      maxThreatConfidence: result.maxThreatConfidence,
      details: {
        injection: result.injection,
        jailbreak: result.jailbreak,
        malicious: result.malicious
      }
    });

  } catch (error) {
    console.error("Guardrail check error:", error);
    
    // Fail-open: if guardrail check fails, allow the message
    return Response.json({
      allowed: true,
      overallRisk: 'unknown',
      threatsDetected: [],
      maxThreatConfidence: 0,
      error: "Guardrail check failed - allowing message",
      details: error.message
    });
  }
}