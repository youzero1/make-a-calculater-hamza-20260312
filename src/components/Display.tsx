'use client';

interface DisplayProps {
  expression: string;
  current: string;
  hasError: boolean;
}

export default function Display({ expression, current, hasError }: DisplayProps) {
  const displayValue = current || '0';
  const fontSize =
    displayValue.length > 12
      ? 'text-2xl'
      : displayValue.length > 8
      ? 'text-3xl'
      : 'text-4xl';

  return (
    <div className="bg-slate-900 rounded-2xl p-5 mb-4 min-h-[110px] flex flex-col justify-between shadow-inner border border-slate-700">
      <div className="text-slate-400 text-sm min-h-[20px] text-right truncate">
        {expression || '\u00A0'}
      </div>
      <div
        className={`${
          hasError ? 'text-red-400' : 'text-white'
        } ${fontSize} font-light text-right tracking-wider truncate transition-all duration-150`}
      >
        {displayValue}
      </div>
    </div>
  );
}
