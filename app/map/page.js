"use client";
import { useEffect, useState } from "react";
import { Shield, Clock } from "lucide-react";

const events = [
  { id:"EVT-001", title:"Fence Breach Alert", type:"fence_alert", severity:"medium", lat:17.445, lng:78.349, time:"01:23 AM" },
  { id:"EVT-002", title:"Unauthorized Vehicle", type:"vehicle", severity:"high", lat:17.447, lng:78.352, time:"02:47 AM" },
  { id:"EVT-003", title:"Failed Badge x3", type:"badge_fail", severity:"high", lat:17.443, lng:78.355, time:"03:15 AM" },
  { id:"EVT-004", title:"Drone Patrol D-7", type:"drone_patrol", severity:"info", lat:17.446, lng:78.351, time:"04:00 AM" },
  { id:"EVT-005", title:"Power Fluctuation", type:"anomaly", severity:"low", lat:17.441, lng:78.348, time:"02:58 AM" },
];

const dronePathCoords = [
  [17.444,78.347],[17.445,78.349],[17.446,78.351],
  [17.447,78.352],[17.445,78.354],[17.443,78.355],
  [17.441,78.353],[17.442,78.350],[17.444,78.347]
];

const severityColor = {
  high: "#ef4444", medium: "#f59e0b", low: "#64748b", info: "#3b82f6"
};

const typeEmoji = {
  fence_alert:"🔒", vehicle:"🚗", badge_fail:"🪪", drone_patrol:"🚁", anomaly:"⚡"
};

export default function MapPage() {
  const [selected, setSelected] = useState(null);
  const [MapComponents, setMapComponents] = useState(null);
  const [droneAnim, setDroneAnim] = useState(0);
  const [showDrone, setShowDrone] = useState(false);

  useEffect(() => {
    import("leaflet").then(L => {
      delete L.default.Icon.Default.prototype._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });

    import("react-leaflet").then(mod => {
      setMapComponents({
        MapContainer: mod.MapContainer,
        TileLayer: mod.TileLayer,
        CircleMarker: mod.CircleMarker,
        Polyline: mod.Polyline,
        Popup: mod.Popup,
        Tooltip: mod.Tooltip,
      });
    });

    import("leaflet/dist/leaflet.css");
  }, []);

  useEffect(() => {
    if (!showDrone) return;
    const interval = setInterval(() => {
      setDroneAnim(prev => {
        if (prev >= dronePathCoords.length - 1) { clearInterval(interval); return prev; }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [showDrone]);

  function startDrone() { setDroneAnim(0); setShowDrone(true); }

  if (!MapComponents) return (
    <main className="min-h-screen flex items-center justify-center" style={{background:"radial-gradient(ellipse at top,#0a1628,#050a14)"}}>
      <div className="text-blue-400 animate-pulse">Loading map...</div>
    </main>
  );

  const { MapContainer, TileLayer, CircleMarker, Polyline, Popup, Tooltip } = MapComponents;
  const droneCurrentPath = dronePathCoords.slice(0, droneAnim + 1);
  const dronePos = dronePathCoords[droneAnim];

  return (
    <main className="min-h-screen flex flex-col" style={{background:"radial-gradient(ellipse at top,#0a1628,#050a14)"}}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 glass border-b border-blue-900/30">
        <div className="flex items-center gap-3">
          <a href="/" className="text-slate-500 hover:text-slate-300">← Back</a>
          <span className="text-slate-700">|</span>
          <Shield className="text-blue-400" size={20} />
          <span className="text-white font-bold">Site Map</span>
          <span className="text-slate-500 text-sm">— Ridgeway Industrial Site</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={startDrone}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
            style={{background:"linear-gradient(135deg,#1d4ed8,#0891b2)"}}>
            🚁 Simulate Drone Patrol
          </button>
          <div className="flex items-center gap-2 text-amber-400 text-sm">
            <Clock size={14} />
            <span className="font-mono">6:10 AM</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[17.444, 78.351]}
            zoom={16}
            style={{height:"100%", minHeight:"80vh", width:"100%", background:"#0a1628"}}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='© OpenStreetMap © CARTO'
            />

            {/* Drone path */}
            {showDrone && droneCurrentPath.length > 1 && (
              <Polyline positions={droneCurrentPath} color="#3b82f6" weight={2} dashArray="6,4" opacity={0.8} />
            )}

            {/* Drone current position */}
            {showDrone && (
              <CircleMarker center={dronePos} radius={10} color="#3b82f6" fillColor="#93c5fd" fillOpacity={0.9} weight={2}>
                <Tooltip permanent direction="top" offset={[0,-10]}>
                  <span style={{background:"transparent",border:"none",color:"#93c5fd",fontSize:"18px"}}>🚁</span>
                </Tooltip>
              </CircleMarker>
            )}

            {/* Events */}
            {events.map(ev => (
              <CircleMarker
                key={ev.id}
                center={[ev.lat, ev.lng]}
                radius={selected?.id === ev.id ? 18 : 12}
                color={severityColor[ev.severity]}
                fillColor={severityColor[ev.severity]}
                fillOpacity={0.7}
                weight={2}
                eventHandlers={{ click: () => setSelected(ev) }}
              >
                <Tooltip direction="top" offset={[0,-10]}>
                  <div style={{background:"#0a1628",border:"1px solid #1e3a5f",borderRadius:"8px",padding:"6px 10px",color:"#e2e8f0",fontSize:"12px"}}>
                    <div style={{fontWeight:"bold"}}>{typeEmoji[ev.type]} {ev.title}</div>
                    <div style={{color:"#94a3b8"}}>{ev.time}</div>
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass rounded-xl p-3 z-[1000]">
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Legend</div>
            {[["high","#ef4444","High Severity"],["medium","#f59e0b","Medium"],["info","#3b82f6","Info/Drone"],["low","#64748b","Low"]].map(([,color,label]) => (
              <div key={label} className="flex items-center gap-2 text-xs text-slate-300 mb-1">
                <span className="w-3 h-3 rounded-full inline-block" style={{background:color}}></span>
                {label}
              </div>
            ))}
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
              <span className="text-blue-400">---</span> Drone Path
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 glass border-l border-white/5 p-4 overflow-y-auto">
          <h3 className="text-slate-400 text-xs uppercase tracking-wider mb-4">Overnight Events</h3>
          <div className="space-y-3">
            {events.map(ev => (
              <div key={ev.id}
                onClick={() => setSelected(ev)}
                className={`rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.02] border ${
                  selected?.id === ev.id ? "border-blue-500/50 bg-blue-500/10" : "border-white/5 bg-white/3"
                }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-500 text-xs font-mono">{ev.id}</span>
                  <span className="w-2 h-2 rounded-full" style={{background:severityColor[ev.severity]}}></span>
                </div>
                <div className="text-white text-sm font-semibold">{typeEmoji[ev.type]} {ev.title}</div>
                <div className="text-slate-500 text-xs mt-1">{ev.time}</div>
              </div>
            ))}
          </div>

          {selected && (
            <div className="mt-4 rounded-xl p-4 border border-blue-500/30 bg-blue-500/5">
              <div className="text-blue-400 text-xs font-semibold uppercase mb-2">{selected.id} Details</div>
              <div className="text-white font-bold mb-1">{selected.title}</div>
              <div className="text-slate-400 text-xs">Lat: {selected.lat}, Lng: {selected.lng}</div>
              <div className="text-slate-400 text-xs mt-1">Time: {selected.time}</div>
              <div className="mt-2 text-xs font-semibold" style={{color:severityColor[selected.severity]}}>
                ● {selected.severity.toUpperCase()} SEVERITY
              </div>
            </div>
          )}

          <a href="/investigate"
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
            style={{background:"linear-gradient(135deg,#1d4ed8,#0891b2)"}}>
            Start Investigation →
          </a>
        </div>
      </div>
    </main>
  );
}