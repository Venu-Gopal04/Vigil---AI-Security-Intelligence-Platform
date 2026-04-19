import { fetchRealEvents, siteInfo } from "@/lib/nightData";
import { runAgent } from "@/lib/groqAgent";

export async function POST(request) {
  try {
    // Fetch REAL events from UK Police API
    const events = await fetchRealEvents();
    const { steps, finalAnalysis } = await runAgent(events);
    return Response.json({ 
      success: true, 
      steps, 
      finalAnalysis, 
      events, 
      siteInfo,
      dataSource: "UK Police API - data.police.uk"
    });
  } catch (error) {
    console.error("Agent error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}