
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line } from 'recharts';
import { Battery, Gauge, Thermometer, Wind, AlertTriangle, ShieldCheck, Zap, Activity, BrainCircuit, HardDriveDownload, Power, PlusCircle, ArrowUpRight, TrendingDown } from 'lucide-react';
import { VehicleData, OtaState, Fault, AIInsight } from '../types';

interface DashboardProps {
  data: VehicleData;
  history: VehicleData[];
  ota: OtaState;
  faults: Fault[];
  injectFault: (f: Fault) => void;
  onProvisionService: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, history, ota, faults, injectFault, onProvisionService }) => {
  const [showProvisionModal, setShowProvisionModal] = useState(false);

  const insights: AIInsight[] = useMemo(() => [
    { type: 'EFFICIENCY', message: 'Driving pattern correction: Smooth throttle detected.', impact: '+4.2% Range' },
    { type: 'PREDICTION', message: 'Inverter Phase-B thermal drift detected.', impact: 'Service in 1200km' },
    { type: 'SAFETY', message: 'Tyre 03 pressure stabilizing after pulse.', impact: 'Nominal' }
  ], []);

  const failurePredictionData = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      hour: i,
      health: 100 - (i * 0.5) - (Math.random() * 2),
      confidence: [90 - i, 110 - i]
    }));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* Dynamic OTA/New Service Banner */}
      {ota.status !== 'IDLE' ? (
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-blue-500/5">
          <div className="flex items-center gap-5">
            <div className="bg-blue-500/20 p-3 rounded-xl animate-pulse">
              <HardDriveDownload className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-400">{ota.status} ENHANCED SERVICE MODULE</p>
              <p className="text-[10px] text-slate-500 font-mono">ID: SDV-SERVICE-PROVISION-{ota.progress}%</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <span className="text-2xl font-mono font-black text-blue-500">{ota.progress}%</span>
             <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${ota.progress}%` }}></div>
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <PlusCircle className="text-blue-500" size={20} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New OTA Capabilities Found</span>
           </div>
           <button 
             onClick={onProvisionService}
             className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase rounded-lg transition-all shadow-lg shadow-blue-600/20"
           >
             Provision New Health Service
           </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Main Metrics & Predictions */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { label: 'Energy Economy', val: '14.2', unit: 'kWh/100', trend: <TrendingDown size={14} className="text-green-500" />, color: 'text-green-400' },
               { label: 'Failure Risk', val: '2.4', unit: '%', trend: <ShieldCheck size={14} className="text-blue-500" />, color: 'text-blue-400' },
               { label: 'Brake Health', val: '94', unit: '%', trend: <Activity size={14} className="text-purple-500" />, color: 'text-purple-400' },
               { label: 'Est. Lifetime', val: '8.2', unit: 'Years', trend: <Zap size={14} className="text-orange-500" />, color: 'text-orange-400' }
             ].map((m, i) => (
               <div key={i} className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl group hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between mb-3 text-slate-500">
                    <span className="text-[9px] font-bold uppercase tracking-widest">{m.label}</span>
                    {m.trend}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-black font-mono tracking-tight ${m.color}`}>{m.val}</span>
                    <span className="text-[10px] font-bold text-slate-600">{m.unit}</span>
                  </div>
               </div>
             ))}
          </div>

          {/* Large Insight Area */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-3">
                 <BrainCircuit className="text-blue-500" size={20} />
                 <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">GenAI Diagnostic Forecast</h3>
               </div>
               <div className="flex gap-4 text-[9px] font-mono text-slate-500">
                  <span className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Health Projection</span>
                  <span className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-800 rounded-full border border-slate-700"></div> Confidence Interval</span>
               </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={failurePredictionData}>
                  <defs>
                    <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="hour" hide />
                  <YAxis domain={[80, 105]} hide />
                  <Tooltip contentStyle={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="health" stroke="#3b82f6" strokeWidth={3} fill="url(#healthGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: AI Insights & Fault Management */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Zap size={14} /> AI Optimization Layer
              </h3>
              <div className="space-y-4">
                 {insights.map((ins, i) => (
                   <div key={i} className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all cursor-default group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[8px] font-black text-slate-600 bg-slate-900 px-2 py-0.5 rounded uppercase">{ins.type}</span>
                        <span className="text-[9px] font-bold text-green-500 group-hover:translate-x-1 transition-transform">{ins.impact} <ArrowUpRight size={10} className="inline" /></span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">{ins.message}</p>
                   </div>
                 ))}
              </div>
           </div>

           {/* Early Detection Panel */}
           <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck size={64} className="text-blue-500" />
              </div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Proactive Security Scan</h3>
              <div className="space-y-3 font-mono text-[9px]">
                 <div className="flex justify-between items-center text-green-500">
                    <span>[PASS] ISO 21434 CYBER_SEC</span>
                    <ShieldCheck size={12} />
                 </div>
                 <div className="flex justify-between items-center text-slate-400">
                    <span>[SYNC] V-TRUST TEE_TRUSTED</span>
                    <Activity size={12} className="animate-pulse" />
                 </div>
                 <div className="flex justify-between items-center text-slate-400">
                    <span>[SCAN] OTA_SIGNATURE_VALID</span>
                    <HardDriveDownload size={12} />
                 </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800">
                 <button className="w-full py-2 bg-slate-950 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-800 hover:border-blue-500 transition-colors">
                    Re-Verify Security Stack
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
