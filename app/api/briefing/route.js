import Groq from "groq-sdk";
import { siteInfo } from "@/lib/nightData";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { analysis, approvedEvents, overrides } = await request.json();

    const prompt = `You are preparing the official morning briefing for ${siteInfo.siteHead}, Site Head of ${siteInfo.name}.

It is 7:55 AM. The briefing starts at ${siteInfo.briefingTime}.

Based on Maya's reviewed and approved analysis below, generate a professional, concise morning briefing document.

ANALYSIS:
${analysis}

APPROVED EVENTS: ${approvedEvents?.join(', ') || 'All events reviewed'}
MAYA'S OVERRIDES/NOTES: ${overrides || 'None'}

Generate a structured briefing with these sections:
1. EXECUTIVE SUMMARY (2-3 sentences max)
2. CRITICAL ITEMS REQUIRING ATTENTION
3. RESOLVED / NO ACTION NEEDED
4. RECOMMENDED ACTIONS
5. OPEN ITEMS FOR FOLLOW-UP

Keep it sharp, factual, and decision-ready. Nisha has 5 minutes to read this.`;

    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000
    });

    const briefing = response.choices[0].message.content;
    return Response.json({ success: true, briefing });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}