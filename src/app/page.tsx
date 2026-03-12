'use client';

import { useState, useEffect, useCallback } from 'react';
import Calculator from '@/components/Calculator';
import History from '@/components/History';

export interface CalculationRecord {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
}

export default function Home() {
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator');

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/calculations');
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleCalculationSaved = useCallback(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleClearHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/calculations', { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to clear history');
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-start py-10 px-4">
      <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">
        <span className="text-blue-400">Calc</span>ulator
      </h1>

      {/* Tab Navigation */}
      <div className="flex mb-8 bg-slate-800 rounded-xl p-1 gap-1">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'calculator'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Calculator
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'history'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          History {history.length > 0 && <span className="ml-1 text-xs bg-blue-600 px-1.5 py-0.5 rounded-full">{history.length}</span>}
        </button>
      </div>

      <div className="w-full max-w-md">
        {activeTab === 'calculator' ? (
          <Calculator onCalculationSaved={handleCalculationSaved} />
        ) : (
          <History
            history={history}
            loading={loadingHistory}
            onClearHistory={handleClearHistory}
          />
        )}
      </div>
    </main>
  );
}
