
import React, { useState } from 'react';
import { FileText, Wand2, Loader2, Download, Copy, CheckCircle2 } from 'lucide-react';
import { generateSdvRequirements } from '../services/geminiService';

interface RequirementsBuilderProps {
  requirements: string;
  setRequirements: (req: string) => void;
}

const RequirementsBuilder: React.FC<RequirementsBuilderProps> = ({ requirements, setRequirements }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const result = await generateSdvRequirements(input);
      setRequirements(result || '');
    } catch (error) {
      console.error(error);
      alert('Failed to generate requirements. Check console.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(requirements);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-600/20 p-3 rounded-2xl">
              <FileText className="text-blue-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">SDV Specifications</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Requirements Engineering Agent</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Initial System Brief</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-48 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none resize-none font-medium leading-relaxed"
              placeholder="e.g., Define a thermal management service that monitors battery temperature across 4 zones and controls the active cooling pump via SOME/IP. It must have <10ms latency for safety shutdowns."
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !input.trim()}
              className="w-full h-14 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-2xl flex items-center justify-center gap-3 font-bold transition-all shadow-xl shadow-blue-500/20 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>SYNTHESIZING...</span>
                </>
              ) : (
                <>
                  <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                  <span>GENERATE FORMAL SPECS</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-500" />
            Compliance Checklist
          </h3>
          <ul className="space-y-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> ISO 26262 Alignment (ASIL-D)</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> ASPICE Process Compliance</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Cyber Security (ISO 21434)</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> AUTOSAR Compatibility</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Output: Documentation_Draft.md</span>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
              {copySuccess ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
              <Download size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 p-8 overflow-y-auto bg-slate-950">
          {requirements ? (
            <div className="prose prose-invert prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-slate-300 text-xs font-mono leading-relaxed bg-transparent p-0">
                {requirements}
              </pre>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
              <FileText size={48} className="opacity-10" />
              <p className="text-xs font-bold uppercase tracking-widest opacity-30">Waiting for generation...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequirementsBuilder;
