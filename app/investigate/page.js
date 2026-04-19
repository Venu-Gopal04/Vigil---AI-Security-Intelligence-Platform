"use client";
import { useState, useEffect, useRef } from "react";
import { Shield, CheckCircle, AlertCircle, Loader, ChevronRight, Clock, Wrench } from "lucide-react";

const toolIcons = { get_event_details:"🔍", get_badge_history:"🪪", get_drone_report:"🚁", check_weather_conditions:"🌤️", correlate_events:"🔗" };
const toolLabels = { get_event_details:"Fetching event details", get_badge_history:"Checking badge history", get_drone_report:"Pulling drone report", check_weather_conditions:"Checking weather data", correlate_events:"Correlating events" };

export default function InvestigatePage() {
  const [status, setStatus] = useState("idle");
  const [steps, setSteps] = useState([]);
  const [events, setEvents] = useState([]);
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [finalAnalysis, setFinalAnalysis] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { startInvestigation(); }, []);

  useEffect(() => {
    if (steps.length > 0) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < steps.length) { setVisibleSteps(prev => [...prev, steps[i]]); i++; }
        else clearInterval(interval);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [steps]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [visibleSteps]);

  async function startInvestigation() {
    setStatus("loading"); setSteps([]); setVisibleSteps([]); setFinalAnalysis("");
    try {
      const res = await fetch("/api/investigate", { method: "POST" });
      const data = await res.json();
      if (data.success) { setSteps(data.steps || []); setFinalAnalysis(data.finalAnalysis || ""); setEvents(data.events || []); setStatus("done"); }
      else setStatus("error");
    } catch (e) { setStatus("error"); }
  }

  const toolSteps = visibleSteps.filter(s => s && s.type === "tool_call");
  const isDone = status === "done" && visibleSteps.length > 0 && visibleSteps.length === steps.length;

  return (
    <main style={{minHeight:"100vh",background:"#030712",fontFamily:"system-ui,-apple-system,sans-serif",display:"flex",flexDirection:"column"}}>
      
      {/* NAV */}
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 40px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(3,7,18,0.9)",backdropFilter:"blur(20px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
          <a href="/" style={{color:"#475569",fontSize:"13px",textDecoration:"none",display:"flex",alignItems:"center",gap:"6px"}}>← Back</a>
          <span style={{color:"#1e293b"}}>|</span>
          <div style={{width:"28px",height:"28px",borderRadius:"8px",background:"linear-gradient(135deg,#2563eb,#0891b2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Shield size={14} color="white"/>
          </div>
          <span style={{color:"white",fontWeight:700,fontSize:"14px"}}>AI Investigation</span>
          <span style={{color:"#334155",fontSize:"13px"}}>— Agent is working</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"8px",padding:"6px 14px",borderRadius:"99px",border:"1px solid rgba(251,191,36,0.2)",background:"rgba(251,191,36,0.06)"}}>
          <Clock size={11} color="#fbbf24"/>
          <span style={{color:"#fbbf24",fontSize:"11px",fontFamily:"monospace",fontWeight:600}}>6:10 AM · Ridgeway Site</span>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 320px",gap:"0",height:"calc(100vh - 61px)"}}>
        
        {/* LEFT: Terminal */}
        <div style={{padding:"32px 40px",display:"flex",flexDirection:"column",gap:"16px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"8px"}}>
            <div>
              <h2 style={{color:"white",fontSize:"18px",fontWeight:700,margin:0}}>Agent Investigation Log</h2>
              <p style={{color:"#475569",fontSize:"13px",margin:"4px 0 0"}}>AI is autonomously investigating all overnight events</p>
            </div>
            {status==="loading" && <div style={{display:"flex",alignItems:"center",gap:"8px",color:"#3b82f6",fontSize:"13px"}}><Loader size={14} className="animate-spin"/>Running...</div>}
            {isDone && <div style={{display:"flex",alignItems:"center",gap:"8px",color:"#22c55e",fontSize:"13px"}}><CheckCircle size={14}/>Complete</div>}
          </div>

          {/* Terminal window */}
          <div style={{flex:1,borderRadius:"16px",border:"1px solid rgba(255,255,255,0.08)",background:"rgba(0,0,0,0.4)",overflow:"hidden",display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(0,0,0,0.3)"}}>
              <span style={{width:"10px",height:"10px",borderRadius:"50%",background:"#ef4444",opacity:0.7}}></span>
              <span style={{width:"10px",height:"10px",borderRadius:"50%",background:"#f59e0b",opacity:0.7}}></span>
              <span style={{width:"10px",height:"10px",borderRadius:"50%",background:"#22c55e",opacity:0.7}}></span>
              <span style={{color:"#334155",fontSize:"11px",fontFamily:"monospace",marginLeft:"8px"}}>skylark-agent · investigation.log</span>
              {status==="loading" && <Loader size={10} color="#3b82f6" style={{marginLeft:"auto"}} className="animate-spin"/>}
              {isDone && <CheckCircle size={10} color="#22c55e" style={{marginLeft:"auto"}}/>}
            </div>
            <div style={{flex:1,padding:"20px",fontFamily:"'Courier New',monospace",fontSize:"12px",lineHeight:"1.8",overflowY:"auto",maxHeight:"calc(100vh - 280px)"}}>
              {visibleSteps.map((step, i) => {
                if (!step) return null;
                return (
                  <div key={i} style={{marginBottom:"8px"}}>
                    {step.type==="thinking" && <div style={{color:"#60a5fa"}}>▶ {step.content}</div>}
                    {step.type==="tool_call" && (
                      <div>
                        <div style={{color:"#fbbf24"}}>⚡ {toolIcons[step.tool]||"🔧"} {toolLabels[step.tool]||step.tool} <span style={{color:"#334155"}}>({Object.values(step.args||{}).join(", ")})</span></div>
                        <div style={{color:"#4ade80",paddingLeft:"16px",fontSize:"11px"}}>✓ {JSON.stringify(step.result||{}).substring(0,140)}...</div>
                      </div>
                    )}
                    {step.type==="final_analysis" && (
                      <div style={{marginTop:"16px",paddingTop:"16px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
                        <div style={{color:"#4ade80",marginBottom:"10px",letterSpacing:"0.05em"}}>═══ ANALYSIS COMPLETE ═══</div>
                        <div style={{color:"#cbd5e1",whiteSpace:"pre-wrap",fontSize:"11px",lineHeight:1.8}}>{step.content}</div>
                      </div>
                    )}
                  </div>
                );
              })}
              {status==="loading" && visibleSteps.length===0 && <div style={{color:"#3b82f6"}}>Initializing agent...</div>}
              {status==="error" && <div style={{color:"#ef4444"}}>Error running investigation. Please refresh.</div>}
              <div ref={bottomRef}/>
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <div style={{borderLeft:"1px solid rgba(255,255,255,0.06)",padding:"32px 24px",display:"flex",flexDirection:"column",gap:"20px",overflowY:"auto"}}>
          
          {/* Tools used */}
          <div style={{borderRadius:"12px",border:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.02)",padding:"20px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"16px"}}>
              <Wrench size={12} color="#64748b"/>
              <span style={{color:"#64748b",fontSize:"10px",fontWeight:700,letterSpacing:"0.1em"}}>TOOLS USED</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              {toolSteps.length===0 && <span style={{color:"#1e293b",fontSize:"12px"}}>Waiting for agent...</span>}
              {toolSteps.map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <span style={{fontSize:"16px"}}>{toolIcons[s.tool]||"🔧"}</span>
                  <span style={{color:"#94a3b8",fontSize:"12px",flex:1}}>{toolLabels[s.tool]||s.tool}</span>
                  <CheckCircle size={12} color="#22c55e"/>
                </div>
              ))}
            </div>
          </div>

          {/* Events */}
          <div style={{borderRadius:"12px",border:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.02)",padding:"20px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"16px"}}>
              <AlertCircle size={12} color="#64748b"/>
              <span style={{color:"#64748b",fontSize:"10px",fontWeight:700,letterSpacing:"0.1em"}}>EVENTS</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              {(events.length?events:[
                {id:"EVT-001",title:"Fence Alert",severity:"medium"},
                {id:"EVT-002",title:"Vehicle Path",severity:"high"},
                {id:"EVT-003",title:"Badge Fail x3",severity:"high"},
                {id:"EVT-004",title:"Drone Patrol",severity:"info"},
                {id:"EVT-005",title:"Power Anomaly",severity:"low"},
              ]).map(e=>{
                const cols={high:"#ef4444",medium:"#f59e0b",info:"#3b82f6",low:"#475569"};
                return (
                  <div key={e.id} style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <span style={{color:"#334155",fontSize:"10px",fontFamily:"monospace",minWidth:"52px"}}>{e.id}</span>
                    <span style={{color:"#94a3b8",fontSize:"12px",flex:1}}>{e.title}</span>
                    <span style={{color:cols[e.severity]||"#475569",fontSize:"14px"}}>●</span>
                  </div>
                );
              })}
            </div>
          </div>

          {isDone && (
            <a href="/review" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",padding:"14px",borderRadius:"12px",fontWeight:700,color:"white",fontSize:"14px",textDecoration:"none",background:"linear-gradient(135deg,#1d4ed8,#0891b2)",boxShadow:"0 0 30px rgba(59,130,246,0.3)"}}>
              Review Findings <ChevronRight size={16}/>
            </a>
          )}
        </div>
      </div>
    </main>
  );
}