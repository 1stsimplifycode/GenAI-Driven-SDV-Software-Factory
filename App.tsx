
import React, { useState, useEffect } from 'react';
import { Activity, Code, FileText, CheckCircle, TrendingUp, Car, Zap, ShieldCheck, Database, Cpu, RefreshCw, AlertCircle, PlusCircle } from 'lucide-react';
import Dashboard from './components/Dashboard';
import RequirementsBuilder from './components/RequirementsBuilder';
import CodeGenerator from './components/CodeGenerator';
import Analytics from './components/Analytics';
import { ActiveTab, VehicleData, VehicleVariant, OtaState, Fault, TraceLink, AIInsight } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.DASHBOARD);
  const [variant, setVariant] = useState<VehicleVariant>('SEDAN_BEV');
  const [ota, setOta] = useState<OtaState>({ status: 'IDLE', progress: 0, version: 'v3.0.4' });
  const [faults, setFaults] = useState<Fault[]>([]);
  const [traceLinks, setTraceLinks] = useState<TraceLink[]>([]);
  const [requirements, setRequirements] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');

  const [vehicleData, setVehicleData] = useState<VehicleData>({
    speed: 0,
    battery: 98.4,
    tyrePressure: [32, 32, 32, 32],
    steeringAngle: 0,
    throttle: 0,
    brake: 0,
    evRange: 450,
    gearPosition: 1,
    temperature: 25,
    timestamp: new Date().toLocaleTimeString()
  });

  const [historicalData, setHistoricalData] = useState<VehicleData[]>([]);

  // Simulation logic
  const config = {
    SEDAN_BEV: { drag: 0.05, power: 0.15, mass: 2000, maxRange: 500 },
    TRUCK_HEAVY: { drag: 0.12, power: 0.08, mass: 8000, maxRange: 350 },
    SPORTS_PHEV: { drag: 0.03, power: 0.25, mass: 1600, maxRange: 600 }
  }[variant];

  useEffect(() => {
    if (ota.status === 'REBOOTING') return;
    const interval = setInterval(() => {
      setVehicleData(prev => {
        const targetThrottle = 50 + Math.sin(Date.now() / 4000) * 20;
        const acc = ((targetThrottle * config.power) - (prev.speed * config.drag)) / (config.mass / 1000);
        const newSpeed = Math.max(0, Math.min(220, prev.speed + acc));
        const newBattery = Math.max(0, prev.battery - (newSpeed * 0.0001));

        return {
          ...prev,
          speed: newSpeed,
          battery: newBattery,
          throttle: targetThrottle,
          temperature: 25 + (newSpeed * 0.3),
          evRange: newBattery * (config.maxRange / 100),
          timestamp: new Date().toLocaleTimeString()
        };
      });
    }, 500);
    return () => clearInterval(interval);
  }, [variant, ota.status]);

  useEffect(() => {
    setHistoricalData(prev => [...prev.slice(-59), vehicleData]);
  }, [vehicleData]);

  const triggerOta = (isNewService = false) => {
    setOta({ ...ota, status: 'DOWNLOADING', progress: 0 });
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setOta(prev => ({ ...prev, progress: p }));
      if (p >= 100) {
        clearInterval(interval);
        setOta(prev => ({ ...prev, status: 'INSTALLING' }));
        setTimeout(() => {
          setOta(prev => ({ ...prev, status: 'REBOOTING' }));
          setTimeout(() => {
            setOta({ status: 'IDLE', progress: 0, version: isNewService ? 'v3.1.0-EXP' : 'v3.1.0' });
            if (isNewService) setActiveTab(ActiveTab.CODE);
          }, 2000);
        }, 1500);
      }
    }, 150);
  };

  const injectFault = (f: Fault) => setFaults(prev => [...prev.filter(x => x.id !== f.id), f]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-500/30">
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <Car className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">Gemini <span className="text-blue-500">SDV-PRO</span></h1>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Digital Twin Engineering Platform</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {[
              { id: ActiveTab.DASHBOARD, label: 'Telemetry', icon: Activity },
              { id: ActiveTab.REQUIREMENTS, label: 'Traceable Specs', icon: FileText },
              { id: ActiveTab.CODE, label: 'SOA Synthesis', icon: Code },
              { id: ActiveTab.ANALYTICS, label: 'KPIs & savings', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <tab.icon size={16} />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
             <select 
               value={variant}
               onChange={(e) => setVariant(e.target.value as VehicleVariant)}
               className="bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold uppercase p-2 focus:ring-1 focus:ring-blue-500 outline-none"
             >
               <option value="SEDAN_BEV">Model-S (BEV)</option>
               <option value="TRUCK_HEAVY">Industrial (HDT)</option>
               <option value="SPORTS_PHEV">GTX-Sport (PHEV)</option>
             </select>
             <button 
               onClick={() => triggerOta()}
               disabled={ota.status !== 'IDLE'}
               className="flex items-center gap-2 px-3 py-2 bg-blue-600/10 border border-blue-600/20 rounded-lg hover:bg-blue-600/20 disabled:opacity-30 transition-all"
             >
                <RefreshCw size={14} className={ota.status !== 'IDLE' ? 'animate-spin text-blue-400' : ''} />
                <span className="text-[10px] font-bold uppercase">Cloud OTA</span>
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {ota.status === 'REBOOTING' ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-slate-800 border-t-blue-500 animate-spin"></div>
            <p className="text-xs font-mono text-blue-400 uppercase tracking-[0.3em]">HPC Module Rebooting...</p>
          </div>
        ) : (
          <div className="max-w-[1600px] mx-auto p-6">
            {activeTab === ActiveTab.DASHBOARD && (
              <Dashboard 
                data={vehicleData} 
                history={historicalData} 
                ota={ota}
                faults={faults}
                injectFault={injectFault}
                onProvisionService={() => triggerOta(true)}
              />
            )}
            {activeTab === ActiveTab.REQUIREMENTS && (
              <RequirementsBuilder 
                requirements={requirements} 
                setRequirements={setRequirements} 
              />
            )}
            {activeTab === ActiveTab.CODE && (
              <CodeGenerator 
                requirements={requirements} 
                code={generatedCode} 
                setCode={setGeneratedCode}
                traceLinks={traceLinks}
                setTraceLinks={setTraceLinks}
              />
            )}
            {activeTab === ActiveTab.ANALYTICS && <Analytics />}
          </div>
        )}
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 py-3 px-6">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <div className="flex gap-8">
            <span className="flex items-center gap-2"><Database size={10} /> BUS: SOME/IP @ 1Gbps</span>
            <span className="flex items-center gap-2 text-blue-400"><ShieldCheck size={10} /> ASPICE L3 COMPLIANT</span>
            <span className="flex items-center gap-2"><Zap size={10} /> GENAI SYNTHESIS ACTIVE</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-2 py-0.5 rounded border border-slate-800 bg-slate-900">SW Version: {ota.version}</div>
             <span className="flex items-center gap-2">HPC STATUS: <span className="text-green-500">OPTIMAL</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
