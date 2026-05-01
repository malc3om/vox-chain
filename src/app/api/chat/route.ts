import { NextRequest } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { logChatSession } from "@/lib/firebase";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";
const GEMINI_MODEL = "gemini-2.0-flash";

const SYSTEM_PROMPT = `You are VoxChain, an AI-powered civic education assistant built on the Midnight Network.

YOUR ROLE:
- Answer questions about elections, voting processes, and civic participation
- Explain how government systems work in plain language
- Help users understand their rights and responsibilities as voters
- Explain zero-knowledge proofs and privacy-preserving technology when asked

RULES:
1. NEVER express political opinions or endorse any candidate, party, or policy
2. ALWAYS cite official sources (archives.gov, usa.gov, eac.gov, vote.org)
3. Keep answers concise (150-300 words) with bullet points and bold text
4. End answers with 📚 Source: [url]
5. If asked who to vote for, politely decline
6. If unsure, say so — never fabricate election procedures

TONE: Empowering, educational, non-judgmental, precise.`;

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// Fallback responses when Gemini API key is not configured
function getFallbackResponse(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("electoral college")) {
    return `The **Electoral College** is the system used to elect the US President.\n\n**How it works:**\n• Each state gets electors equal to its total members of Congress\n• There are **538 total** electors\n• A candidate needs **270** to win\n• Most states use winner-take-all\n\nThe Founders created it as a compromise between congressional and popular vote election.\n\n📚 Source: archives.gov/electoral-college`;
  }
  if (q.includes("register")) {
    return `**Voter Registration:**\n\n• **Online:** Available in 40+ states at vote.org/register-to-vote\n• **Deadlines:** Usually 15-30 days before Election Day\n• **Same-day registration:** Available in some states\n• **You need:** State ID/driver's license, proof of citizenship & residency\n\n**Check your status** at vote.org/am-i-registered-to-vote\n\n📚 Source: usa.gov/voter-registration`;
  }
  if (q.includes("zk") || q.includes("zero knowledge") || q.includes("proof")) {
    return `**Zero-Knowledge Proofs in Voting** 🔐\n\nA ZK proof lets you prove something is true without revealing WHY.\n\n**In VoxChain:**\n• Prove you're **18+** without revealing your birthdate\n• Prove **residency** without revealing your address\n• Prove you **haven't voted yet** without revealing your identity\n\n**On Midnight Network:**\n1. Private data stays on YOUR device\n2. A mathematical proof is generated locally\n3. The proof is verified on-chain\n4. Result: "Eligible ✓" — nobody knows WHO\n\n📚 Source: midnight.network/whitepaper`;
  }
  if (q.includes("count") || q.includes("after polls")) {
    return `**After Polls Close:**\n\n**Step 1: Initial Count** (Election Night)\n• Poll workers count at each precinct\n• Results reported to county election offices\n\n**Step 2: Canvassing** (Days After)\n• All ballots verified and reconciled\n• Absentee/provisional ballots counted\n\n**Step 3: Certification** (2-4 Weeks)\n• Official results certified by state boards\n• Recounts triggered if margins are tight\n\n**Step 4: Electoral College** (December)\n• Electors cast official votes\n\n📚 Source: eac.gov/voters/election-process`;
  }
  return `Great civic question! Here's what I can share:\n\nElection processes are built on four principles:\n\n• **Transparency** — Every step should be observable\n• **Privacy** — Your individual vote stays secret\n• **Integrity** — Results are verifiable and accurate\n• **Accessibility** — Everyone eligible can participate\n\nVoxChain uses **Midnight Network's ZK proofs** to make these principles work together.\n\nTry asking about:\n• Registration deadlines\n• The electoral college\n• How votes are counted\n• Zero-knowledge proofs\n\n📚 Source: usa.gov/voting`;
}

export async function POST(request: NextRequest) {
  let message = "";
  try {
    const body = await request.json();
    message = body.message;
    const history = body.history ?? [];

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    // Fallback path — no API key configured
    if (!GEMINI_API_KEY) {
      const fallback = getFallbackResponse(message);
      await logChatSession({ questionsAsked: 1, source: "fallback", sessionId: crypto.randomUUID() });
      return Response.json({ response: fallback, source: "fallback" }, {
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
      });
    }

    // Gemini SDK path
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: SYSTEM_PROMPT,
      safetySettings: SAFETY_SETTINGS,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024, topP: 0.9 },
    });

    const formattedHistory = history.map((h: { role: string; content: string }) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }],
    }));

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(message);
    const text = result.response.text() || getFallbackResponse(message);

    // Log session analytics to Firebase (non-blocking)
    logChatSession({ questionsAsked: 1, source: "gemini", sessionId: crypto.randomUUID() });

    return Response.json({ response: text, source: "gemini" });
  } catch (err) {
    console.error("[VoxChain] Chat API error:", err);
    const fallback = getFallbackResponse(message);
    return Response.json({ response: fallback, source: "fallback" }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  }
}
