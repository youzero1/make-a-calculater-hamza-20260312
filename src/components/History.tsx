'use client';

import { CalculationRecord } from '@/app/page';

interface HistoryProps {
  history: CalculationRecord[];
  loading: boolean;
  onClearHistory: () => void;
}

export default function History({ history, loading, onClearHistory }: HistoryProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-slate-800 rounded-3xl p-5 shadow-2xl border border-slate-700 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Calculation History</h2>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-sm text-red-400 hover:text-red-300 transition-colors duration-150 border border-red-500 hover:border-red-400 px-3 py-1 rounded-lg"
          >
            Clear All
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-slate-500">
          <svg
            className="w-12 h-12 mb-3 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-sm">No calculations yet</p>
          <p className="text-xs mt-1 opacity-70">Start calculating to see history</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-slate-700 rounded-xl p-3 border border-slate-600 hover:border-slate-500 transition-colors duration-150"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-sm truncate">{item.expression}</p>
                  <p
                    className={`text-lg font-semibold truncate ${
                      item.result === 'Error' ? 'text-red-400' : 'text-white'
                    }`}
                  >
                    = {item.result}
                  </p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap mt-1">
                  {formatDate(item.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
