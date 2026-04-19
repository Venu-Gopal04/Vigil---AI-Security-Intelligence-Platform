"use client";
import { useState, useEffect } from "react";
import { Shield, CheckCircle, Clock, ChevronRight, Edit3, MapPin, AlertTriangle, X } from "lucide-react";

export default function ReviewPage() {
  const [analysis, setAnalysis] = useState("");
  const [events, setEvents] = useState([]);
  const [eventStatuses, setEventStatuses] = useState({});
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchAnalysis(); }, []);

  async function fetchAnalysis() {
    try {
      const res = await fetch("/api/investigate", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.finalAnalysis);
        setEvents(data.events);
        const initial = {};
        data.events.forEach(e => { initial[e.id] = "approve"; });
        setEventStatuses(initial);
        setSelected(data.events[0]);
      }
    } catch(e) {}
    setLoading(false);
  }

  function toggleStatus(id) {
    setEventStatuses(prev => ({ ...prev, [id]: prev[id]==="approve"?"escalate":prev[id]==="escalate"?"dismiss":"approve" }));
  }

  async function generateBriefing() {
    setGenerating(true);
    const approved = Object.entries(eventStatuses).filter(([,v])=>v==="approve").map(([k])=>k);
    const res = await fetch("/api/briefing", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ analysis, approvedEvents: approved, overrides: notes })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("briefing", data.briefing);
      localStorage.setItem("eventStatuses", JSON.stringify(eventStatuses));
      window.location.href = "/briefing";
    }
    setGenerating(false);
  }

  const sevColors = { high:"#ef4444", medium:"#f59e0b", low:"#64748b", info:"#3b82f6" };
  const sevBg = { high:"rgba(239,68,68,0.08)", medium:"rgba(245,158,11,0.08)", low:"rgba(100,116,139,0.08)", info:"rgba(59,130,246,0.08)" };
  const statusCfg = {
    approve:{ label:"✓ Approved", color:"#22c55e", bg:"rgba(34,197,94,0.1)", border:"rgba(34,197,94,0.25)" },
    escalate:{ label:"⚠ Escalate", color:"#ef4444", bg:"rgba(239,68,68,0.1)", border:"rgba(239,68,68,0.25)" },
    dismiss:{ label:"✕ Dismissed", color:"#64748b", bg:"rgba(100,116,139,0.1)", border:"rgba(100,116,139,0.25)" }
  };

  if (loading) return (
    <main style={{minHeight:"100vh",background:"#030712",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{color:"#3b82f6",fontSize:"16px"}}>Loading analysis...</div>
    </main>
  );

  return (
    <main style={{minHeight:"100vh",background:"#030712",fontFamily:"system-ui,-apple-system,sans-serif",display:"flex",flexDirection:"column"}}>

      {/* NAV */}
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 40px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(3,7,18,0.9)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
          <a href="/investigate" style={{color:"#475569",fontSize:"13px",textDecoration:"none"}}>← Back</a>
          <span style={{color:"#1e293b"}}>|</span>
          <div style={{width:"28px",height:"28px",borderRadius:"8px",background:"linear-gradient(135deg,#2563eb,#0891b2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Shield size={14} color="white"/>
          </div>
          <span style={{color:"white",fontWeight:700,fontSize:"14px"}}>Human Review</span>
          <span style={{color:"#334155",fontSize:"13px"}}>— Maya's Control Panel</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"8px",padding:"6px 14px",borderRadius:"99px",border:"1px solid rgba(251,191,36,0.2)",background:"rgba(251,191,36,0.06)"}}>
          <Clock size={11} color="#fbbf24"/>
          <span style={{color:"#fbbf24",fontSize:"11px",fontFamily:"monospace",fontWeight:600}}>6:10 AM · 1h 50m to briefing</span>
        </div>
      </nav>

      <div style={{flex:1,display:"grid",gridTemplateColumns:"300px 1fr",height:"calc(100vh - 61px)"}}>

        {/* LEFT: Events */}
        <div style={{borderRight:"1px solid rgba(255,255,255,0.06)",padding:"24px 20px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"8px"}}>
          <p style={{color:"#334155",fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",marginBottom:"8px"}}>EVENT REVIEW</p>
          {events.map(ev=>{
            const st = statusCfg[eventStatuses[ev.id]||"approve"];
            const isSelected = selected?.id===ev.id;
            return (
              <div key={ev.id} onClick={()=>setSelected(ev)} style={{borderRadius:"12px",padding:"16px",cursor:"pointer",border:`1px solid ${isSelected?"rgba(59,130,246,0.4)":"rgba(255,255,255,0.06)"}`,background:isSelected?"rgba(59,130,246,0.06)":"rgba(255,255,255,0.02)",transition:"all 0.15s"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"6px"}}>
                  <span style={{color:"#334155",fontSize:"10px",fontFamily:"monospace"}}>{ev.id}</span>
                  <span style={{width:"8px",height:"8px",borderRadius:"50%",background:sevColors[ev.severity]||"#64748b"}}></span>
                </div>
                <p style={{color:"white",fontSize:"13px",fontWeight:600,margin:"0 0 4px"}}>{ev.title}</p>
                <div style={{display:"flex",alignItems:"center",gap:"4px",marginBottom:"4px"}}>
                  <MapPin size={10} color="#475569"/>
                  <span style={{color:"#475569",fontSize:"11px"}}>{ev.location}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"4px",marginBottom:"12px"}}>
                  <Clock size={10} color="#475569"/>
                  <span style={{color:"#475569",fontSize:"11px"}}>{ev.time}</span>
                </div>
                <button onClick={(e)=>{e.stopPropagation();toggleStatus(ev.id);}} style={{width:"100%",padding:"8px",borderRadius:"8px",border:`1px solid ${st.border}`,background:st.bg,color:st.color,fontSize:"11px",fontWeight:700,cursor:"pointer"}}>
                  {st.label} · click to change
                </button>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Analysis + Controls */}
        <div style={{padding:"32px 40px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"24px"}}>

          {/* Selected event detail */}
          {selected && (
            <div style={{borderRadius:"16px",padding:"24px",border:`1px solid ${sevBg[selected.severity]??"rgba(255,255,255,0.06)"}`,background:sevBg[selected.severity]??"rgba(255,255,255,0.02)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"}}>
                <span style={{color:sevColors[selected.severity],fontSize:"11px",fontWeight:700,letterSpacing:"0.08em"}}>{selected.id} · {selected.severity?.toUpperCase()}</span>
                <span style={{color:"#334155",fontSize:"12px"}}>{selected.time}</span>
              </div>
              <h3 style={{color:"white",fontSize:"18px",fontWeight:700,margin:"0 0 8px"}}>{selected.title}</h3>
              <p style={{color:"#64748b",fontSize:"13px",margin:"0 0 12px"}}>{selected.location}</p>
              <p style={{color:"#94a3b8",fontSize:"13px",lineHeight:1.7,margin:0}}>{selected.details}</p>
            </div>
          )}

          {/* AI Analysis */}
          <div style={{borderRadius:"16px",padding:"24px",border:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.02)"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px"}}>
              <CheckCircle size={16} color="#22c55e"/>
              <h2 style={{color:"white",fontSize:"16px",fontWeight:700,margin:0}}>AI Analysis</h2>
              <span style={{color:"#334155",fontSize:"12px",marginLeft:"auto"}}>Generated by Skylark Agent</span>
            </div>
            <div style={{color:"#94a3b8",fontSize:"13px",lineHeight:1.8,whiteSpace:"pre-wrap",maxHeight:"280px",overflowY:"auto"}}>
              {analysis||"Loading..."}
            </div>
          </div>

          {/* Maya's notes */}
          <div style={{borderRadius:"16px",padding:"24px",border:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.02)"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px"}}>
              <Edit3 size={16} color="#f59e0b"/>
              <h2 style={{color:"white",fontSize:"16px",fontWeight:700,margin:0}}>Maya's Notes & Overrides</h2>
            </div>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)}
              placeholder="Add corrections, context, or instructions for the briefing..."
              style={{width:"100%",background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",padding:"14px",color:"#cbd5e1",fontSize:"13px",resize:"none",height:"100px",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>

          {/* Summary + Generate */}
          <div style={{borderRadius:"16px",padding:"24px",border:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.02)"}}>
            <p style={{color:"#334155",fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",marginBottom:"16px"}}>REVIEW SUMMARY</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"12px",marginBottom:"20px"}}>
              {[
                {label:"Approved",status:"approve",col:"#22c55e",bg:"rgba(34,197,94,0.08)",border:"rgba(34,197,94,0.2)"},
                {label:"Escalated",status:"escalate",col:"#ef4444",bg:"rgba(239,68,68,0.08)",border:"rgba(239,68,68,0.2)"},
                {label:"Dismissed",status:"dismiss",col:"#64748b",bg:"rgba(100,116,139,0.08)",border:"rgba(100,116,139,0.2)"},
              ].map(s=>(
                <div key={s.label} style={{borderRadius:"12px",padding:"16px",textAlign:"center",background:s.bg,border:`1px solid ${s.border}`}}>
                  <div style={{fontSize:"28px",fontWeight:900,color:s.col,lineHeight:1}}>{Object.values(eventStatuses).filter(v=>v===s.status).length}</div>
                  <div style={{color:"#475569",fontSize:"11px",marginTop:"4px"}}>{s.label}</div>
                </div>
              ))}
            </div>
            <button onClick={generateBriefing} disabled={generating}
              style={{width:"100%",padding:"16px",borderRadius:"12px",fontWeight:700,color:"white",fontSize:"15px",border:"none",cursor:generating?"not-allowed":"pointer",background:"linear-gradient(135deg,#1d4ed8,#0891b2)",boxShadow:"0 0 30px rgba(59,130,246,0.3)",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",opacity:generating?0.6:1}}>
              {generating?"Generating Briefing...":"Generate Morning Briefing"} {!generating && <ChevronRight size={18}/>}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}