'use client';

import { useState, useCallback } from 'react';
import Display from './Display';
import Button from './Button';

interface CalculatorProps {
  onCalculationSaved: () => void;
}

type ButtonConfig = {
  label: string;
  variant?: 'default' | 'operator' | 'equals' | 'clear' | 'special';
  wide?: boolean;
  action: string;
};

const BUTTONS: ButtonConfig[][] = [
  [
    { label: 'AC', variant: 'clear', action: 'clear' },
    { label: '+/-', variant: 'special', action: 'negate' },
    { label: '%', variant: 'special', action: 'percent' },
    { label: '÷', variant: 'operator', action: '/' },
  ],
  [
    { label: '7', action: '7' },
    { label: '8', action: '8' },
    { label: '9', action: '9' },
    { label: '×', variant: 'operator', action: '*' },
  ],
  [
    { label: '4', action: '4' },
    { label: '5', action: '5' },
    { label: '6', action: '6' },
    { label: '−', variant: 'operator', action: '-' },
  ],
  [
    { label: '1', action: '1' },
    { label: '2', action: '2' },
    { label: '3', action: '3' },
    { label: '+', variant: 'operator', action: '+' },
  ],
  [
    { label: '0', wide: true, action: '0' },
    { label: '.', action: '.' },
    { label: '=', variant: 'equals', action: '=' },
  ],
];

export default function Calculator({ onCalculationSaved }: CalculatorProps) {
  const [current, setCurrent] = useState('0');
  const [expression, setExpression] = useState('');
  const [operator, setOperator] = useState<string | null>(null);
  const [operand, setOperand] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);

  const saveCalculation = useCallback(async (expr: string, result: string) => {
    try {
      await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: expr, result }),
      });
      onCalculationSaved();
    } catch (error) {
      console.error('Failed to save calculation:', error);
    }
  }, [onCalculationSaved]);

  const calculate = useCallback(
    (a: number, op: string, b: number): number | 'Error' => {
      switch (op) {
        case '+':
          return a + b;
        case '-':
          return a - b;
        case '*':
          return a * b;
        case '/':
          if (b === 0) return 'Error';
          return a / b;
        default:
          return b;
      }
    },
    []
  );

  const formatResult = (value: number): string => {
    if (!isFinite(value)) return 'Error';
    const str = value.toPrecision(12);
    const num = parseFloat(str);
    if (Math.abs(num) > 1e15 || (Math.abs(num) < 1e-7 && num !== 0)) {
      return num.toExponential(6);
    }
    return String(num);
  };

  const handleDigit = useCallback(
    (digit: string) => {
      setHasError(false);
      if (waitingForOperand) {
        setCurrent(digit);
        setWaitingForOperand(false);
        setJustCalculated(false);
        return;
      }
      if (justCalculated) {
        setCurrent(digit);
        setExpression('');
        setOperator(null);
        setOperand(null);
        setJustCalculated(false);
        return;
      }
      setCurrent((prev) =>
        prev === '0' && digit !== '.' ? digit : prev + digit
      );
    },
    [waitingForOperand, justCalculated]
  );

  const handleDecimal = useCallback(() => {
    if (waitingForOperand) {
      setCurrent('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!current.includes('.')) {
      setCurrent((prev) => prev + '.');
    }
  }, [current, waitingForOperand]);

  const handleOperator = useCallback(
    (op: string) => {
      setHasError(false);
      setJustCalculated(false);
      const currentValue = parseFloat(current);

      if (operator && !waitingForOperand && operand !== null) {
        const prev = parseFloat(operand);
        const result = calculate(prev, operator, currentValue);
        if (result === 'Error') {
          setCurrent('Error');
          setHasError(true);
          setExpression('');
          setOperator(null);
          setOperand(null);
          setWaitingForOperand(false);
          return;
        }
        const formatted = formatResult(result);
        setCurrent(formatted);
        setExpression(`${formatted} ${op}`);
        setOperand(formatted);
      } else {
        setExpression(`${current} ${op}`);
        setOperand(current);
      }

      setOperator(op);
      setWaitingForOperand(true);
    },
    [current, operator, operand, waitingForOperand, calculate]
  );

  const handleEquals = useCallback(async () => {
    if (!operator || operand === null) return;
    if (hasError) return;

    const a = parseFloat(operand);
    const b = parseFloat(current);
    const result = calculate(a, operator, b);

    const opSymbol: Record<string, string> = {
      '+': '+',
      '-': '−',
      '*': '×',
      '/': '÷',
    };
    const fullExpression = `${operand} ${opSymbol[operator] || operator} ${current}`;

    if (result === 'Error') {
      setCurrent('Error');
      setHasError(true);
      setExpression(`${fullExpression} =`);
      setOperator(null);
      setOperand(null);
      setWaitingForOperand(false);
      setJustCalculated(true);
      await saveCalculation(fullExpression, 'Error');
      return;
    }

    const formatted = formatResult(result);
    setCurrent(formatted);
    setExpression(`${fullExpression} =`);
    setOperator(null);
    setOperand(null);
    setWaitingForOperand(false);
    setJustCalculated(true);

    await saveCalculation(fullExpression, formatted);
  }, [operator, operand, current, hasError, calculate, saveCalculation]);

  const handleClear = useCallback(() => {
    setCurrent('0');
    setExpression('');
    setOperator(null);
    setOperand(null);
    setWaitingForOperand(false);
    setHasError(false);
    setJustCalculated(false);
  }, []);

  const handleNegate = useCallback(() => {
    if (hasError) return;
    setCurrent((prev) => {
      const num = parseFloat(prev);
      if (isNaN(num)) return prev;
      return String(-num);
    });
  }, [hasError]);

  const handlePercent = useCallback(() => {
    if (hasError) return;
    setCurrent((prev) => {
      const num = parseFloat(prev);
      if (isNaN(num)) return prev;
      return formatResult(num / 100);
    });
  }, [hasError]);

  const handleAction = useCallback(
    (action: string) => {
      if (action === 'clear') return handleClear();
      if (action === 'negate') return handleNegate();
      if (action === 'percent') return handlePercent();
      if (action === '.') return handleDecimal();
      if (action === '=') return handleEquals();
      if (['+', '-', '*', '/'].includes(action)) return handleOperator(action);
      handleDigit(action);
    },
    [handleClear, handleNegate, handlePercent, handleDecimal, handleEquals, handleOperator, handleDigit]
  );

  return (
    <div className="bg-slate-800 rounded-3xl p-5 shadow-2xl border border-slate-700 w-full">
      <Display expression={expression} current={current} hasError={hasError} />
      <div className="grid grid-cols-4 gap-3">
        {BUTTONS.map((row, rowIdx) =>
          row.map((btn, colIdx) => (
            <Button
              key={`${rowIdx}-${colIdx}`}
              label={btn.label}
              variant={btn.variant}
              wide={btn.wide}
              onClick={() => handleAction(btn.action)}
            />
          ))
        )}
      </div>
    </div>
  );
}
