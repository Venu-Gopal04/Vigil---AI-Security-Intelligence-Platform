"use client";
import { useState, useEffect } from "react";
import { Shield, Clock, CheckCircle, Download, RotateCcw, Star, AlertTriangle, Info } from "lucide-react";

export default function BriefingPage() {
  const [briefing, setBriefing] = useState("");
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    const b = localStorage.getItem("briefing");
    const s = localStorage.getItem("eventStatuses");
    if (b) setBriefing(b);
    if (s) setStatuses(JSON.parse(s));
  }, []);

  function download() {
    const blob = new Blob([`RIDGEWAY SITE — MORNING BRIEFING\n${new Date().toLocaleString()}\n\n${briefing}`], {type:"text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="morning-briefing.txt"; a.click();
  }

  const escalated = Object.values(statuses).filter(v=>v==="escalate").length;
  const approved = Object.values(statuses).filter(v=>v==="approve").length;
  const dismissed = Object.values(statuses).filter(v=>v==="dismiss").length;

  // Parse briefing into sections
  const sections = briefing.split(/\n\n+/).filter(Boolean);

  return (
    <main style={{minHeight:"100vh",background:"#030712",fontFamily:"system-ui,-apple-system,sans-serif",display:"flex",flexDirection:"column"}}>

      {/* NAV */}
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 40px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(3,7,18,0.9)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
          <a href="/review" style={{color:"#475569",fontSize:"13px",textDecoration:"none"}}>← Back</a>
          <span style={{color:"#1e293b"}}>|</span>
          <div style={{width:"28px",height:"28px",borderRadius:"8px",background:"linear-gradient(135deg,#2563eb,#0891b2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Shield size={14} color="white"/>
          </div>
          <span style={{color:"white",fontWeight:700,fontSize:"14px"}}>Morning Briefing</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"8px",padding:"6px 14px",borderRadius:"99px",border:"1px solid rgba(34,197,94,0.2)",background:"rgba(34,197,94,0.06)"}}>
          <CheckCircle size={11} color="#22c55e"/>
          <span style={{color:"#22c55e",fontSize:"11px",fontFamily:"monospace",fontWeight:600}}>Ready for 8:00 AM</span>
        </div>
      </nav>

      <div style={{flex:1,maxWidth:"900px",margin:"0 auto",width:"100%",padding:"40px 40px 60px"}}>

        {/* Header Card */}
        <div style={{borderRadius:"20px",padding:"32px",marginBottom:"24px",border:"1px solid rgba(59,130,246,0.2)",background:"linear-gradient(135deg,rgba(29,78,216,0.08),rgba(8,145,178,0.08))",boxShadow:"0 0 60px rgba(59,130,246,0.1)"}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"24px"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
                <Star size={14} color="#fbbf24"/>
                <span style={{color:"#fbbf24",fontSize:"11px",fontWeight:700,letterSpacing:"0.1em"}}>CLASSIFIED · INTERNAL USE ONLY</span>
              </div>
              <h1 style={{color:"white",fontSize:"32px",fontWeight:900,margin:"0 0 4px",letterSpacing:"-0.5px"}}>Morning Briefing</h1>
              <p style={{color:"#64748b",fontSize:"14px",margin:0}}>Ridgeway Industrial Site · Overnight Report</p>
            </div>
            <div style={{textAlign:"right"}}>
              <p style={{color:"#475569",fontSize:"12px",margin:"0 0 4px"}}>Prepared for</p>
              <p style={{color:"white",fontSize:"20px",fontWeight:800,margin:"0 0 2px"}}>Nisha Kapoor</p>
              <p style={{color:"#475569",fontSize:"12px",margin:0}}>Site Head · Ridgeway</p>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"12px"}}>
            {[
              {n:Object.keys(statuses).length||5,label:"Total Events",col:"white",bg:"rgba(255,255,255,0.05)",border:"rgba(255,255,255,0.1)"},
              {n:escalated,label:"Escalated",col:"#ef4444",bg:"rgba(239,68,68,0.08)",border:"rgba(239,68,68,0.2)"},
              {n:approved,label:"Approved",col:"#22c55e",bg:"rgba(34,197,94,0.08)",border:"rgba(34,197,94,0.2)"},
              {n:dismissed,label:"Dismissed",col:"#64748b",bg:"rgba(100,116,139,0.08)",border:"rgba(100,116,139,0.2)"},
            ].map(s=>(
              <div key={s.label} style={{borderRadius:"12px",padding:"16px",textAlign:"center",background:s.bg,border:`1px solid ${s.border}`}}>
                <div style={{fontSize:"28px",fontWeight:900,color:s.col,lineHeight:1}}>{s.n}</div>
                <div style={{color:"#475569",fontSize:"11px",marginTop:"6px"}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Briefing Content */}
        <div style={{borderRadius:"20px",padding:"32px",marginBottom:"24px",border:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.02)"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"24px",paddingBottom:"16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <CheckCircle size={16} color="#22c55e"/>
            <h2 style={{color:"white",fontSize:"16px",fontWeight:700,margin:0}}>Full Report</h2>
            <span style={{color:"#1e293b",fontSize:"12px",marginLeft:"auto"}}>Generated by 6:10 Assistant · Reviewed by Maya</span>
          </div>

          {briefing ? (
            <div style={{color:"#94a3b8",fontSize:"14px",lineHeight:1.9,whiteSpace:"pre-wrap"}}>
              {briefing
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .split('\n').map((line, i) => {
                  if (line.match(/^\d+\.\s+[A-Z]/)) return <div key={i} style={{color:"white",fontWeight:700,fontSize:"15px",marginTop:"20px",marginBottom:"8px"}}>{line}</div>;
                  if (line.startsWith('- ')) return <div key={i} style={{paddingLeft:"16px",borderLeft:"2px solid rgba(59,130,246,0.3)",marginBottom:"6px",color:"#cbd5e1"}}>{line.slice(2)}</div>;
                  return <div key={i} style={{marginBottom:"4px"}}>{line}</div>;
                })
              }
            </div>
          ) : (
            <div style={{color:"#334155",fontSize:"14px"}}>No briefing generated yet.</div>
          )}
        </div>

        {/* Actions */}
        <div style={{display:"flex",gap:"12px"}}>
          <button onClick={download} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",padding:"16px",borderRadius:"14px",fontWeight:700,color:"white",fontSize:"15px",border:"none",cursor:"pointer",background:"linear-gradient(135deg,#1d4ed8,#0891b2)",boxShadow:"0 0 30px rgba(59,130,246,0.3)"}}>
            <Download size={18}/> Download Briefing
          </button>
          <a href="/" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",padding:"16px 24px",borderRadius:"14px",fontWeight:700,color:"#64748b",fontSize:"15px",textDecoration:"none",border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.02)"}}>
            <RotateCcw size={18}/> New Session
          </a>
        </div>

        <p style={{textAlign:"center",color:"#1e293b",fontSize:"12px",marginTop:"32px"}}>
          6:10 Assistant · Skylark Drones · Ridgeway Site Intelligence Platform
        </p>
      </div>
    </main>
  );
}