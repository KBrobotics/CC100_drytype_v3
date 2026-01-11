
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TransformerSignals, ConnectionStatus } from './types';
import { SIGNAL_NAMES, DEFAULT_WS_URL } from './constants';
import TransformerIcon from './components/TransformerIcon';
import StatusIndicator from './components/StatusIndicator';

const App: React.FC = () => {
  const [data, setData] = useState<TransformerSignals>({});
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.CONNECTING || wsRef.current?.readyState === WebSocket.OPEN) return;
    if (isSimulationMode) { setStatus(ConnectionStatus.CONNECTED); return; }
    
    setStatus(ConnectionStatus.CONNECTING);
    try {
      const ws = new WebSocket(DEFAULT_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus(ConnectionStatus.CONNECTED);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && typeof payload === 'object') {
            setData(prev => ({ ...prev, ...payload }));
            setLastUpdate(new Date());
          }
        } catch (err) { console.error('Data error:', err); }
      };

      ws.onclose = () => {
        if (!isSimulationMode) {
          setStatus(ConnectionStatus.DISCONNECTED);
          setTimeout(connect, 5000);
        }
      };

      ws.onerror = () => {
        setError(`Failed to connect to Node-RED`);
        ws.close();
      };
    } catch (e) {
      setError('WebSocket initialization failed');
    }
  }, [isSimulationMode]);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);

  // Simulation Logic
  useEffect(() => {
    if (!isSimulationMode) return;
    const interval = setInterval(() => {
      const simT1 = 80 + Math.random() * 40;
      const simT3 = 80 + Math.random() * 40;
      setData(prev => ({
        ...prev,
        [SIGNAL_NAMES.TEMP_L1]: Number(simT1.toFixed(1)),
        [SIGNAL_NAMES.TEMP_L3]: Number(simT3.toFixed(1)),
        [SIGNAL_NAMES.COOLING_OK]: true,
        [SIGNAL_NAMES.TRIP]: simT1 > 135
      }));
      setLastUpdate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isSimulationMode]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col p-4 font-sans select-none">
      <header className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-yellow-500 rounded-full" />
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight">Transformer Monitoring Unit</h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">WAGO CC100 Industrial HMI</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Sim Mode</span>
              <button 
                onClick={() => setIsSimulationMode(!isSimulationMode)}
                className={`w-8 h-4 rounded-full relative transition-colors ${isSimulationMode ? 'bg-amber-600' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isSimulationMode ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${status === ConnectionStatus.CONNECTED ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[10px] font-mono">{status}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
        <section className="lg:col-span-8 bg-zinc-900/20 border border-zinc-800 rounded-xl flex items-center justify-center p-6 relative overflow-hidden min-h-[500px]">
          <TransformerIcon 
            l1Temp={data[SIGNAL_NAMES.TEMP_L1]} 
            l3Temp={data[SIGNAL_NAMES.TEMP_L3]}
            isTrip={data[SIGNAL_NAMES.TRIP]}
            isAlarm={data[SIGNAL_NAMES.ALARM_GEN]}
          />
          
          <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-zinc-700">
             <svg className={`w-5 h-5 ${data[SIGNAL_NAMES.COOLING_OK] ? 'text-green-500 animate-spin' : 'text-zinc-600'}`} style={{animationDuration: '3s'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /></svg>
             <span className="text-[10px] font-bold uppercase tracking-widest">Cooling System: {data[SIGNAL_NAMES.COOLING_OK] ? 'ACTIVE' : 'IDLE'}</span>
          </div>
        </section>

        <section className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-zinc-900/20 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Safety Status</h3>
            <div className="grid grid-cols-1 gap-3">
              <StatusIndicator label="Transformer Trip" isActive={data[SIGNAL_NAMES.TRIP]} type="trip" />
              <StatusIndicator label="General Alarm" isActive={data[SIGNAL_NAMES.ALARM_GEN]} type="alarm" />
              <StatusIndicator label="Cooling Bank Fail" isActive={data[SIGNAL_NAMES.COOLING_FAIL]} type="trip" />
            </div>
          </div>

          <div className="bg-zinc-900/20 border border-zinc-800 rounded-xl p-5 flex-grow">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Telemetry</h3>
            <div className="space-y-3">
              <div className="bg-black/40 p-4 rounded border border-zinc-800 flex justify-between items-center">
                <span className="text-xs text-zinc-400">LV L1 Temp</span>
                <span className="text-2xl font-mono font-bold">{data[SIGNAL_NAMES.TEMP_L1] ?? '--.-'}°C</span>
              </div>
              <div className="bg-black/40 p-4 rounded border border-zinc-800 flex justify-between items-center">
                <span className="text-xs text-zinc-400">LV L3 Temp</span>
                <span className="text-2xl font-mono font-bold">{data[SIGNAL_NAMES.TEMP_L3] ?? '--.-'}°C</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
        <span>System Ready // No Faults Detected</span>
        <span>Last Sync: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Waiting...'}</span>
      </footer>
    </div>
  );
};

export default App;
