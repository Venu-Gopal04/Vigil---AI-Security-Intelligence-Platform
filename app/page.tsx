"use client";
import { Shield, Zap, ChevronRight, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export default function Home() {
  return (
    <main style={{
      minHeight:"100vh",
      background:"#030712",
      fontFamily:"system-ui,-apple-system,sans-serif",
      display:"flex",
      flexDirection:"column"
    }}>

      {/* Ambient glow effects */}
      <div style={{position:"fixed",top:"-20%",left:"30%",width:"600px",height:"600px",background:"radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:"-10%",right:"20%",width:"400px",height:"400px",background:"radial-gradient(circle,rgba(139,92,246,0.06) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      {/* NAV */}
      <nav style={{
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"16px 48px",
        borderBottom:"1px solid rgba(255,255,255,0.06)",
        background:"rgba(3,7,18,0.8)",
        backdropFilter:"blur(20px)",
        position:"relative",zIndex:10
      }}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <div style={{
            width:"32px",height:"32px",borderRadius:"8px",
            background:"linear-gradient(135deg,#2563eb,#0891b2)",
            display:"flex",alignItems:"center",justifyContent:"center"
          }}>
            <Shield size={16} color="white"/>
          </div>
          <span style={{color:"white",fontWeight:700,fontSize:"13px",letterSpacing:"0.05em"}}>SKYLARK DRONES</span>
          <span style={{color:"#334155",fontSize:"13px"}}>·</span>
          <span style={{color:"#64748b",fontSize:"13px"}}>Ridgeway Industrial Site</span>
        </div>
        <div style={{
          display:"flex",alignItems:"center",gap:"8px",
          padding:"6px 14px",borderRadius:"99px",
          border:"1px solid rgba(251,191,36,0.2)",
          background:"rgba(251,191,36,0.06)"
        }}>
          <span style={{width:"6px",height:"6px",borderRadius:"50%",background:"#fbbf24"}}></span>
          <Clock size={11} color="#fbbf24"/>
          <span style={{color:"#fbbf24",fontSize:"11px",fontFamily:"monospace",fontWeight:600}}>6:10 AM — Morning Review Active</span>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        flex:1,display:"flex",alignItems:"center",justifyContent:"center",
        padding:"0px 48px",position:"relative",zIndex:1,minHeight:"calc(100vh - 120px)"
      }}>
        <div style={{width:"100%",maxWidth:"1100px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"80px",alignItems:"center"}}>

          {/* LEFT COLUMN */}
          <div>
            {/* Alert badges */}
<div style={{display:"flex",gap:"12px",marginBottom:"32px",flexWrap:"wrap"}}>
  <div style={{display:"inline-flex",alignItems:"center",gap:"8px",padding:"6px 14px",borderRadius:"99px",border:"1px solid rgba(239,68,68,0.25)",background:"rgba(239,68,68,0.07)"}}>
    <span style={{width:"6px",height:"6px",borderRadius:"50%",background:"#ef4444"}}></span>
    <span style={{color:"#f87171",fontSize:"12px",fontWeight:600}}>5 overnight events require review</span>
  </div>
  <div style={{display:"inline-flex",alignItems:"center",gap:"8px",padding:"6px 14px",borderRadius:"99px",border:"1px solid rgba(34,197,94,0.25)",background:"rgba(34,197,94,0.07)"}}>
    <span style={{width:"6px",height:"6px",borderRadius:"50%",background:"#22c55e"}}></span>
    <span style={{color:"#4ade80",fontSize:"12px",fontWeight:600}}>🔴 LIVE — Real data from UK Police API</span>
  </div>
</div>

            {/* Big title */}
            <div style={{marginBottom:"24px"}}>
              <div style={{fontSize:"96px",fontWeight:900,color:"white",lineHeight:1,letterSpacing:"-3px"}}>6:10</div>
              <div style={{
                fontSize:"96px",fontWeight:900,lineHeight:1,letterSpacing:"-3px",
                background:"linear-gradient(135deg,#3b82f6 0%,#06b6d4 50%,#8b5cf6 100%)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
              }}>Assistant</div>
            </div>

            <p style={{color:"#94a3b8",fontSize:"15px",lineHeight:1.7,marginBottom:"8px"}}>
              AI-powered overnight intelligence for Ridgeway Site.
            </p>
            <p style={{color:"#475569",fontSize:"14px",marginBottom:"32px"}}>
              You have{" "}
              <span style={{color:"#fbbf24",fontWeight:700}}>1h 50m</span>
              {" "}before Nisha's 8:00 AM briefing.
            </p>

            {/* Supervisor note */}
            <div style={{
              borderRadius:"12px",padding:"16px 20px",marginBottom:"36px",
              borderLeft:"3px solid #f59e0b",
              background:"rgba(245,158,11,0.05)",
              border:"1px solid rgba(245,158,11,0.12)",
              borderLeftWidth:"3px",borderLeftColor:"#f59e0b"
            }}>
              <p style={{color:"#fbbf24",fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",marginBottom:"6px"}}>📋 RAGHAV · NIGHT SUPERVISOR</p>
              <p style={{color:"#cbd5e1",fontSize:"13px",fontStyle:"italic",margin:0}}>"Please check Block C before leadership asks."</p>
            </div>

            {/* CTA Buttons */}
            <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
              <a href="/investigate" style={{
                display:"inline-flex",alignItems:"center",gap:"8px",
                padding:"14px 28px",borderRadius:"12px",
                fontWeight:700,color:"white",fontSize:"14px",
                textDecoration:"none",
                background:"linear-gradient(135deg,#1d4ed8,#0891b2)",
                boxShadow:"0 0 40px rgba(59,130,246,0.35), 0 4px 15px rgba(0,0,0,0.3)",
                transition:"all 0.2s"
              }}>
                <Zap size={16}/> Start AI Investigation <ChevronRight size={16}/>
              </a>
              <a href="/map" style={{
                display:"inline-flex",alignItems:"center",gap:"8px",
                padding:"14px 24px",borderRadius:"12px",
                fontWeight:700,color:"#94a3b8",fontSize:"14px",
                textDecoration:"none",
                background:"rgba(255,255,255,0.03)",
                border:"1px solid rgba(255,255,255,0.08)",
                transition:"all 0.2s"
              }}>
                🗺️ View Site Map
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <p style={{color:"#334155",fontSize:"11px",fontWeight:700,letterSpacing:"0.12em",marginBottom:"16px"}}>LAST NIGHT'S EVENTS</p>

            <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"20px"}}>
              {[
                {id:"EVT-001",icon:"🔒",title:"Fence Breach Alert",loc:"Gate 3 · North Perimeter",time:"01:23 AM",sev:"MEDIUM",col:"#f59e0b",resolved:false},
                {id:"EVT-002",icon:"🚗",title:"Unauthorized Vehicle Path",loc:"Storage Yard B · Restricted Zone",time:"02:47 AM",sev:"HIGH",col:"#ef4444",resolved:false},
                {id:"EVT-003",icon:"🪪",title:"Failed Badge Swipes ×3",loc:"Block C · Controlled Access Point",time:"03:15 AM",sev:"HIGH",col:"#ef4444",resolved:false},
                {id:"EVT-004",icon:"🚁",title:"Scheduled Drone Patrol",loc:"North Sector → Block C → Yard B",time:"04:00 AM",sev:"INFO",col:"#3b82f6",resolved:true},
                {id:"EVT-005",icon:"⚡",title:"Power Fluctuation",loc:"Substation Alpha",time:"02:58 AM",sev:"LOW",col:"#64748b",resolved:true},
              ].map((ev) => (
                <div key={ev.id} style={{
                  display:"flex",alignItems:"center",gap:"14px",
                  padding:"14px 16px",borderRadius:"12px",
                  background:"rgba(255,255,255,0.02)",
                  border:"1px solid rgba(255,255,255,0.06)",
                  cursor:"pointer",transition:"all 0.15s"
                }}>
                  <span style={{fontSize:"20px",flexShrink:0}}>{ev.icon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                      <span style={{color:"white",fontSize:"13px",fontWeight:600}}>{ev.title}</span>
                      {ev.resolved && <CheckCircle size={12} color="#22c55e"/>}
                    </div>
                    <p style={{color:"#475569",fontSize:"11px",margin:0,marginTop:"2px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ev.loc}</p>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <p style={{color:"#475569",fontSize:"11px",fontFamily:"monospace",margin:0}}>{ev.time}</p>
                    <p style={{fontSize:"10px",fontWeight:700,margin:0,marginTop:"3px",color:ev.col}}>● {ev.sev}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"}}>
              {[
                {n:2,label:"High Severity",bg:"rgba(239,68,68,0.07)",border:"rgba(239,68,68,0.18)",col:"#ef4444"},
                {n:1,label:"Medium",bg:"rgba(245,158,11,0.07)",border:"rgba(245,158,11,0.18)",col:"#f59e0b"},
                {n:2,label:"Resolved",bg:"rgba(34,197,94,0.07)",border:"rgba(34,197,94,0.18)",col:"#22c55e"},
              ].map(s=>(
                <div key={s.label} style={{
                  borderRadius:"12px",padding:"16px",textAlign:"center",
                  background:s.bg,border:`1px solid ${s.border}`
                }}>
                  <div style={{fontSize:"32px",fontWeight:900,color:s.col,lineHeight:1}}>{s.n}</div>
                  <div style={{color:"#475569",fontSize:"11px",marginTop:"4px"}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div style={{
        padding:"10px 48px",
        borderTop:"1px solid rgba(255,255,255,0.05)",
        background:"rgba(3,7,18,0.9)",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        position:"relative",zIndex:10
      }}>
        <div style={{display:"flex",alignItems:"center",gap:"32px"}}>
          {[
            {id:"EVT-001",label:"Fence Alert · Gate 3",col:"#f59e0b"},
            {id:"EVT-002",label:"Vehicle · Storage Yard B",col:"#ef4444"},
            {id:"EVT-003",label:"Badge Fail · Block C",col:"#ef4444"},
            {id:"EVT-004",label:"Drone Patrol · D-7",col:"#3b82f6"},
            {id:"EVT-005",label:"Power · Substation",col:"#475569"},
          ].map(e=>(
            <div key={e.id} style={{display:"flex",alignItems:"center",gap:"6px"}}>
              <span style={{color:"#1e293b",fontSize:"10px",fontFamily:"monospace"}}>{e.id}</span>
              <span style={{fontSize:"11px",color:e.col}}>{e.label}</span>
            </div>
          ))}
        </div>
        <span style={{color:"#1e293b",fontSize:"11px"}}>Skylark Drones · Ridgeway Intelligence Platform</span>
      </div>

    </main>
  );
}