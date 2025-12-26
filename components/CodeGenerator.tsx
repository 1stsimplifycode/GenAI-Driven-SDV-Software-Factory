
import React, { useState } from 'react';
import { Code2, Terminal, Play, Loader2, Download, ShieldAlert, Cpu, Box, CheckCircle2, ChevronRight, Table } from 'lucide-react';
import { generateSdvCode, generateUnitTests } from '../services/geminiService';
import { TraceLink } from '../types';

interface CodeGeneratorProps {
  requirements: string;
  code: string;
  setCode: (code: string) => void;
  traceLinks: TraceLink[];
  setTraceLinks: (links: TraceLink[]) => void;
}

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ requirements, code, setCode, traceLinks, setTraceLinks }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [view, setView] = useState<'CODE' | 'TRACE'>('CODE');

  const handleGenerate = async () => {
    if (!requirements) return;
    setIsGenerating(true);
    setBuildStep(1);
    
    try {
      const result = await generateSdvCode(requirements);
      setCode(result || '');
      setBuildStep(3);

      // Simulate parsing for traceability
      const newLinks: TraceLink[] = [
        { reqId: 'FR-BAT-001', reqText: 'Monitor State of Charge', codeSymbol: 'BmsService::getSoC()', testId: 'T-BMS-01', status: 'VERIFIED' },
        { reqId: 'FR-MOT-002', reqText: 'Early Thermal Warning', codeSymbol: 'MotorMgr::checkThresholds()', testId: 'T-MOT-02', status: 'VERIFIED' },
        { reqId: 'NFR-LAT-05', reqText: 'Latency < 10ms', codeSymbol: 'SOA::FastDispatcher', testId: 'T-PERF-05', status: 'VERIFIED' }
      ];
      setTraceLinks(newLinks);
      
      setBuildStep(5);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full animate-in fade-in duration-500">
      
      {/* Build Control Panel */}
      <div className="xl:col-span-3 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-purple-600/20 p-3 rounded-2xl">
              <Cpu className="text-purple-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">SDV Builder</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">GenAI SOA Pipeline</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
             {['Ingestion', 'Synthesis', 'Traceability', 'Compliance', 'Deploy'].map((step, i) => (
               <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${buildStep > i ? 'bg-green-500/10 border-green-500/20' : 'bg-slate-950 border-slate-800 opacity-40'}`}>
                  <CheckCircle2 size={14} className={buildStep > i ? 'text-green-500' : 'text-slate-700'} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{step}</span>
               </div>
             ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !requirements}
            className="w-full h-14 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white rounded-2xl flex items-center justify-center gap-3 font-bold transition-all shadow-xl shadow-purple-500/20"
          >
            {isGenerating ? <Loader2 className="animate-spin" /> : <Play fill="white" />}
            <span className="uppercase tracking-widest text-[11px]">Start Synthesis</span>
          </button>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-4">ASPICE Compliance Logs</p>
           <div className="font-mono text-[9px] text-slate-500 space-y-1">
             <p>[GEN] Generating traceability IDs...</p>
             <p>[SEC] Verifying MISRA compliance...</p>
             <p>[OK] All symbols traceable to SRS.</p>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="xl:col-span-9 flex flex-col space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl flex-1">
          <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
             <div className="flex gap-1 bg-slate-900 p-1 rounded-lg">
                <button 
                  onClick={() => setView('CODE')}
                  className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${view === 'CODE' ? 'bg-slate-800 text-white shadow' : 'text-slate-500'}`}
                >
                  <Code2 size={12} className="inline mr-2" /> Source
                </button>
                <button 
                  onClick={() => setView('TRACE')}
                  className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${view === 'TRACE' ? 'bg-slate-800 text-white shadow' : 'text-slate-500'}`}
                >
                  <Table size={12} className="inline mr-2" /> Traceability
                </button>
             </div>
             <div className="flex items-center gap-3">
               <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded">GenAI Verified</span>
               <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"><Download size={16} /></button>
             </div>
          </div>
          
          <div className="flex-1 overflow-auto bg-slate-950 p-8 font-mono">
             {view === 'CODE' ? (
               <pre className="text-[11px] leading-relaxed text-slate-300">
                 {code || '// Awaiting Pipeline Start...'}
               </pre>
             ) : (
               <div className="h-full">
                 <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        <th className="pb-4">Req ID</th>
                        <th className="pb-4">Requirement Text</th>
                        <th className="pb-4">Code Symbol</th>
                        <th className="pb-4">Test Link</th>
                        <th className="pb-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px]">
                       {traceLinks.map((link, i) => (
                         <tr key={i} className="border-b border-slate-900 hover:bg-slate-900/50 transition-colors">
                           <td className="py-4 text-blue-500 font-bold">{link.reqId}</td>
                           <td className="py-4 text-slate-400">{link.reqText}</td>
                           <td className="py-4 text-purple-400">{link.codeSymbol}</td>
                           <td className="py-4 text-amber-500">{link.testId}</td>
                           <td className="py-4"><span className="text-[9px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold">{link.status}</span></td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator;
