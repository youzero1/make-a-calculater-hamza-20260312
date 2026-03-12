'use client';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'operator' | 'equals' | 'clear' | 'special';
  wide?: boolean;
}

export default function Button({
  label,
  onClick,
  variant = 'default',
  wide = false,
}: ButtonProps) {
  const base =
    'flex items-center justify-center rounded-2xl text-xl font-medium cursor-pointer select-none transition-all duration-100 active:scale-95 h-16 shadow-md';

  const variants: Record<string, string> = {
    default:
      'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600',
    operator:
      'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500',
    equals:
      'bg-green-600 hover:bg-green-500 text-white border border-green-500',
    clear:
      'bg-red-600 hover:bg-red-500 text-white border border-red-500',
    special:
      'bg-slate-600 hover:bg-slate-500 text-slate-200 border border-slate-500',
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${wide ? 'col-span-2' : ''}`}
    >
      {label}
    </button>
  );
}
