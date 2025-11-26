import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Delete } from 'lucide-react';

interface CalculatorProps {
  onClose: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const backspace = () => {
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result = 0;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '×':
          result = currentValue * inputValue;
          break;
        case '÷':
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        case '%':
          result = (currentValue * inputValue) / 100;
          break;
        default:
          result = inputValue;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    if (!operation || previousValue === null) return;
    
    const inputValue = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = previousValue + inputValue;
        break;
      case '-':
        result = previousValue - inputValue;
        break;
      case '×':
        result = previousValue * inputValue;
        break;
      case '÷':
        result = inputValue !== 0 ? previousValue / inputValue : 0;
        break;
      case '%':
        result = (previousValue * inputValue) / 100;
        break;
      default:
        result = inputValue;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const buttonClass = "h-14 text-lg font-semibold transition-all duration-150 active:scale-95";

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm glass-card animate-slide-up">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Calculator</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Display */}
          <div className="bg-secondary/50 rounded-lg p-4 text-right">
            <div className="text-sm text-muted-foreground h-5">
              {previousValue !== null && `${previousValue} ${operation}`}
            </div>
            <div className="text-3xl font-bold text-foreground truncate">
              {display}
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button variant="secondary" className={buttonClass} onClick={clear}>C</Button>
            <Button variant="secondary" className={buttonClass} onClick={backspace}>
              <Delete className="w-5 h-5" />
            </Button>
            <Button variant="secondary" className={buttonClass} onClick={() => performOperation('%')}>%</Button>
            <Button variant="finance" className={buttonClass} onClick={() => performOperation('÷')}>÷</Button>

            <Button variant="glass" className={buttonClass} onClick={() => inputDigit('7')}>7</Button>
            <Button variant="glass" className={buttonClass} onClick={() => inputDigit('8')}>8</Button>
            <Button variant="glass" className={buttonClass} onClick={() => inputDigit('9')}>9</Button>
            <Button variant="finance" className={buttonClass} onClick={() => performOperation('×')}>×</Button>

            <Button variant="glass" className={buttonClass} onClick={() => inputDigit('4')}>4</Button>
            <Button variant="glass" className={buttonClass} onClick={() => inputDigit('5')}>5</Button>
            <Button variant="glass" className={buttonClass} onClick={() => inputDigit('6')}>6</Button>
            <Button variant="finance" className={buttonClass} onClick={() => performOperation('-')}>-</Button>

            <Button variant="glass" className={buttonClass} onClick={() => inputDigit('1')}>1</Button>
            <Button variant="glass" className={buttonClass} onClick={() => inputDigit('2')}>2</Button>
            <Button variant="glass" className={buttonClass} onClick={() => inputDigit('3')}>3</Button>
            <Button variant="finance" className={buttonClass} onClick={() => performOperation('+')}>+</Button>

            <Button variant="glass" className={`${buttonClass} col-span-2`} onClick={() => inputDigit('0')}>0</Button>
            <Button variant="glass" className={buttonClass} onClick={inputDecimal}>.</Button>
            <Button variant="success" className={buttonClass} onClick={calculate}>=</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;
