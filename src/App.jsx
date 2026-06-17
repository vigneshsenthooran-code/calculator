import { useState } from 'react'
import './App.css'

// [row][col] — label, type, action
const BUTTONS = [
  [
    { label: 'C',  type: 'clear' },
    { label: '±',  type: 'fn' },
    { label: '%',  type: 'fn' },
    { label: '÷',  type: 'op' },
  ],
  [
    { label: '7', type: 'digit' },
    { label: '8', type: 'digit' },
    { label: '9', type: 'digit' },
    { label: '×', type: 'op' },
  ],
  [
    { label: '4', type: 'digit' },
    { label: '5', type: 'digit' },
    { label: '6', type: 'digit' },
    { label: '−', type: 'op' },
  ],
  [
    { label: '1', type: 'digit' },
    { label: '2', type: 'digit' },
    { label: '3', type: 'digit' },
    { label: '+', type: 'op' },
  ],
  [
    { label: '0',  type: 'digit', wide: true },
    { label: '.',  type: 'fn' },
    { label: '=',  type: 'eq' },
  ],
]

export default function App() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState(null)
  const [op, setOp] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  function handleDigit(digit) {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit)
    }
  }

  function handleDecimal() {
    if (waitingForOperand) { setDisplay('0.'); setWaitingForOperand(false); return }
    if (!display.includes('.')) setDisplay(display + '.')
  }

  function calculate(a, b, operator) {
    switch (operator) {
      case '+': return a + b
      case '−': return a - b
      case '×': return a * b
      case '÷': return b !== 0 ? a / b : 'Error'
      default: return b
    }
  }

  function handleOperator(nextOp) {
    const current = parseFloat(display)
    if (prev !== null && !waitingForOperand) {
      const result = calculate(prev, current, op)
      setDisplay(String(result))
      setPrev(result)
    } else {
      setPrev(current)
    }
    setOp(nextOp)
    setWaitingForOperand(true)
  }

  function handleEquals() {
    if (op === null || waitingForOperand) return
    const result = calculate(prev, parseFloat(display), op)
    setDisplay(String(result))
    setPrev(null); setOp(null); setWaitingForOperand(true)
  }

  function handleButton({ label, type }) {
    if (type === 'clear') {
      setDisplay('0'); setPrev(null); setOp(null); setWaitingForOperand(false)
    } else if (label === '±') {
      setDisplay(String(parseFloat(display) * -1))
    } else if (label === '%') {
      setDisplay(String(parseFloat(display) / 100))
    } else if (label === '.') {
      handleDecimal()
    } else if (type === 'eq') {
      handleEquals()
    } else if (type === 'op') {
      handleOperator(label)
    } else {
      handleDigit(label)
    }
  }

  return (
    <div className="scene">
      <div className="calculator">
        {/* math doodle watermark */}
        <svg className="doodle" aria-hidden="true" viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg">
          <text x="10"  y="30"  fontSize="14" opacity=".18">π</text>
          <text x="240" y="50"  fontSize="12" opacity=".15">∑</text>
          <text x="60"  y="80"  fontSize="11" opacity=".13">f(x)</text>
          <text x="200" y="100" fontSize="13" opacity=".16">∞</text>
          <text x="20"  y="140" fontSize="10" opacity=".12">a²+b²=c²</text>
          <text x="210" y="160" fontSize="11" opacity=".14">√x</text>
          <text x="80"  y="200" fontSize="12" opacity=".13">∫</text>
          <text x="160" y="220" fontSize="10" opacity=".12">Δ</text>
          <text x="30"  y="260" fontSize="11" opacity=".15">y=mx+b</text>
          <text x="220" y="280" fontSize="13" opacity=".14">θ</text>
          <text x="100" y="320" fontSize="10" opacity=".12">∂/∂x</text>
          <text x="190" y="350" fontSize="11" opacity=".13">≈</text>
          <text x="40"  y="390" fontSize="12" opacity=".15">μ</text>
          <line x1="130" y1="10" x2="180" y2="60" stroke="#aaa" strokeWidth="0.8" opacity=".1"/>
          <line x1="250" y1="180" x2="280" y2="240" stroke="#aaa" strokeWidth="0.8" opacity=".1"/>
          <circle cx="260" cy="70" r="18" fill="none" stroke="#aaa" strokeWidth="0.8" opacity=".1"/>
        </svg>

        <div className="display">
          <div className="display-inner">
            <span>{display}</span>
          </div>
        </div>

        <div className="buttons">
          {BUTTONS.flat().map((btn, i) => (
            <button
              key={i}
              className={`btn btn-${btn.type}${btn.wide ? ' wide' : ''}`}
              onClick={() => handleButton(btn)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
