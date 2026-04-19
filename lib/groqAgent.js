import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const tools = [
  {
    type: "function",
    function: {
      name: "get_event_details",
      description: "Get detailed information about a specific security event by its ID",
      parameters: {
        type: "object",
        properties: {
          event_id: { type: "string", description: "The event ID like EVT-001" }
        },
        required: ["event_id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_badge_history",
      description: "Get badge swipe history for a specific badge ID or location",
      parameters: {
        type: "object",
        properties: {
          badge_id: { type: "string", description: "Badge ID like EMP-4471" },
          location: { type: "string", description: "Location name" }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_drone_report",
      description: "Get drone patrol report for a specific area or time",
      parameters: {
        type: "object",
        properties: {
          area: { type: "string", description: "Area name like Block C or Gate 3" }
        },
        required: ["area"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "check_weather_conditions",
      description: "Check weather conditions at the time of an event to determine if it was weather-related",
      parameters: {
        type: "object",
        properties: {
          time: { type: "string", description: "Time of the event" },
          location: { type: "string", description: "Location of the event" }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "correlate_events",
      description: "Find correlations between multiple events to determine if they are related",
      parameters: {
        type: "object",
        properties: {
          event_ids: { type: "array", items: { type: "string" }, description: "List of event IDs to correlate" }
        },
        required: ["event_ids"]
      }
    }
  }
];

function executeTool(name, args, events) {
  if (name === "get_event_details") {
    const event = events.find(e => e.id === args.event_id);
    if (!event) return { error: "Event not found" };
    return { event, status: "found" };
  }

  if (name === "get_badge_history") {
    return {
      badge_id: args.badge_id || "EMP-4471",
      history: [
        { date: "2025-04-10", time: "08:12 AM", location: "Gate 1", status: "success" },
        { date: "2025-04-10", time: "06:45 PM", location: "Gate 1", status: "success" },
        { date: "2025-04-16", time: "03:15 AM", location: "Block C", status: "failed" },
        { date: "2025-04-16", time: "03:16 AM", location: "Block C", status: "failed" },
        { date: "2025-04-16", time: "03:17 AM", location: "Block C", status: "failed" }
      ],
      note: "No access history for Block C in past 30 days. Badge last active 6 days ago."
    };
  }

  if (name === "get_drone_report") {
    return {
      area: args.area,
      drone_id: "D-7",
      patrol_time: "04:00 AM - 04:38 AM",
      findings: args.area.toLowerCase().includes("block c")
        ? "No heat signatures detected. Access point door sealed. No signs of forced entry."
        : args.area.toLowerCase().includes("gate 3")
        ? "Fence intact. No structural damage. Wind gusts recorded at 18-22 km/h in area."
        : "Area clear. No anomalies detected during flyover.",
      thermal_imaging: "active",
      coverage: "100%"
    };
  }

  if (name === "check_weather_conditions") {
    return {
      time: args.time,
      location: args.location,
      wind_speed: "18-22 km/h",
      temperature: "19°C",
      humidity: "72%",
      conditions: "Partly cloudy, moderate wind",
      note: "Wind speed sufficient to trigger motion sensors on perimeter fence. False alarm probability: HIGH for fence alerts."
    };
  }

  if (name === "correlate_events") {
    return {
      event_ids: args.event_ids,
      correlations: [
        {
          events: ["EVT-002", "EVT-005"],
          relationship: "LIKELY RELATED",
          reason: "Vehicle movement in Storage Yard B at 02:47 AM preceded power fluctuation at Substation Alpha at 02:58 AM. Distance: 120m. Time gap: 11 minutes.",
          confidence: 0.78
        },
        {
          events: ["EVT-001", "EVT-004"],
          relationship: "INVESTIGATED",
          reason: "Drone D-7 flew over Gate 3 perimeter at 04:05 AM. Fence found intact. Weather likely cause.",
          confidence: 0.91
        },
        {
          events: ["EVT-003"],
          relationship: "UNRESOLVED",
          reason: "Badge EMP-4471 has no prior Block C access history. Requires identity verification.",
          confidence: null
        }
      ]
    };
  }

  return { error: "Unknown tool" };
}

export async function runAgent(events) {
  const steps = [];

  const systemPrompt = `You are an AI security analyst for Ridgeway Industrial Site. 
It is 6:10 AM. You must investigate last night's security events and prepare a morning briefing for Maya, the operations lead.

Your job:
1. Use your tools to investigate each event thoroughly
2. Determine what is noise vs what is serious
3. Correlate related events
4. Surface uncertainty honestly - never guess without data
5. Prepare clear findings for the 8 AM briefing with site head Nisha

Be thorough. Use multiple tools. Think like a detective, not a dashboard.`;

  const userMessage = `Here are last night's events at Ridgeway Site. Investigate all of them using your tools and give me a complete analysis:

${events.map(e => `- ${e.id}: ${e.title} at ${e.location} (${e.time}) - Severity: ${e.severity}`).join('\n')}

Supervisor Raghav's note: "Please check Block C before leadership asks."

Use your tools to investigate. Then provide your complete findings.`;

  const messages = [{ role: "user", content: userMessage }];

  steps.push({ type: "thinking", content: "Starting investigation of overnight events..." });

  let response = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    tools,
    tool_choice: "auto",
    max_tokens: 2048
  });

  let iterations = 0;
  while (response.choices[0].finish_reason === "tool_calls" && iterations < 10) {
    const assistantMessage = response.choices[0].message;
    messages.push(assistantMessage);

    const toolResults = [];
    for (const toolCall of assistantMessage.tool_calls) {
      const args = JSON.parse(toolCall.function.arguments);
      const result = executeTool(toolCall.function.name, args, events);

      steps.push({
        type: "tool_call",
        tool: toolCall.function.name,
        args,
        result
      });

      toolResults.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result)
      });
    }

    messages.push(...toolResults);

    response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      tools,
      tool_choice: "auto",
      max_tokens: 2048
    });

    iterations++;
  }

  const finalAnalysis = response.choices[0].message.content;
  steps.push({ type: "final_analysis", content: finalAnalysis });

  return { steps, finalAnalysis };
}