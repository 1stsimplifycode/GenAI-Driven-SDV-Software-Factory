
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Zap, Clock, Code, TrendingUp, Sparkles, ShieldCheck, IndianRupee } from 'lucide-react';

const Analytics: React.FC = () => {
  const vModelEfficiency = [
    { name: 'Req. Analysis', Manual: 48, AI: 2 },
    { name: 'Architecture', Manual: 120, AI: 8 },
    { name: 'Coding', Manual: 180, AI: 12 },
    { name: 'Unit Testing', Manual: 72, AI: 5 },
  ];

  const pieData = [
    { name: 'AI Synthesized', value: 85, color: '#3b82f6' },
    { name: 'Human Verified', value: 15, color: '#1e293b' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      
      {/* Executive Summary */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <Zap size={300} className="text-white -ml-20 -mt-20" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/80 font-bold uppercase tracking-[0.3em] text-[10px] mb-4">
            <Sparkles size={14} /> Industrial Impact Metrics
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter leading-none mb-2">GenAI ROI Report</h2>
          <p className="text-white/60 text-sm font-medium">SDV Platform Acceleration & Efficiency Gains</p>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-4 mt-8 md:mt-0">
           <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10 text-center min-w-[140px]">
              <p className="text-[9px] font-black text-white/50 uppercase mb-1">Total Effort Savings</p>
              <p className="text-3xl font-black text-white">92<span className="text-lg">%</span></p>
           </div>
           <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10 text-center min-w-[140px]">
              <p className="text-[9px] font-black text-white/50 uppercase mb-1">Time-to-Prod</p>
              <p className="text-3xl font-black text-white">8<span className="text-lg">x</span></p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* V-Model Time Comparison */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <Clock size={16} className="text-blue-500" /> V-Model Development Velocity
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">Manual vs Gemini Synthesis (Hours)</p>
            </div>
            <div className="flex gap-4 text-[9px] font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2 text-slate-700"><div className="w-2 h-2 rounded-full bg-slate-700"></div> Manual Process</span>
              <span className="flex items-center gap-2 text-blue-500"><div className="w-2 h-2 rounded-full bg-blue-500"></div> GenAI Assisted</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vModelEfficiency} layout="vertical" barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} cursor={{ fill: '#1e293b' }} />
                <Bar dataKey="Manual" fill="#1e293b" radius={[0, 4, 4, 0]} />
                <Bar dataKey="AI" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Synthesis Integrity Pie */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-10 w-full text-left">Synthesis Ownership</h3>
          <div className="h-[200px] w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 w-full">
            <div className="flex justify-between items-center text-[11px] font-bold">
               <span className="text-slate-500">Auto-Generated Code</span>
               <span className="text-blue-500">85%</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold">
               <span className="text-slate-500">Human Peer Review</span>
               <span className="text-slate-200">15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: <ShieldCheck className="text-green-500" />, label: 'ASPICE Readiness', val: 'L3 / Verified' },
          { icon: <Zap className="text-blue-500" />, label: 'OTA Success Rate', val: '99.8%' },
          { icon: <TrendingUp className="text-purple-500" />, label: 'Dev. Acceleration', val: '12.4x' },
          { icon: <Code className="text-orange-500" />, label: 'Bug Density', val: '0.04 / KLOC' }
        ].map((kpi, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 group hover:bg-slate-900 transition-all">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 group-hover:border-slate-700">{kpi.icon}</div>
            <div>
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-lg font-black text-slate-200">{kpi.val}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Analytics;
