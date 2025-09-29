class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === 'Error') {
            this.clear();
            return;
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = `${this.currentOperand} ${this.operation}`;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        try {
            switch (this.operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '×':
                    computation = prev * current;
                    break;
                case '÷':
                    if (current === 0) throw new Error('Cannot divide by zero');
                    computation = prev / current;
                    break;
                default:
                    return;
            }
            
            // Check if the result is too large
            if (!isFinite(computation)) {
                throw new Error('Number too large');
            }
            // Add to history before mutating state
            addHistoryItem(`${formatNumber(prev)} ${this.operation} ${formatNumber(current)}`, computation);

            this.currentOperand = computation.toString();
            this.operation = undefined;
            this.previousOperand = '';
        } catch (error) {
            this.currentOperand = 'Error';
            this.operation = undefined;
            this.previousOperand = '';
        }
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand.split(' ')[0])} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');
const exportHistoryBtn = document.getElementById('export-history');
const themeToggleBtn = document.getElementById('theme-toggle');
const copyResultBtn = document.getElementById('copy-result');
const actionButtons = document.querySelectorAll('[data-action]');
const memoryButtons = document.querySelectorAll('[data-memory]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (calculator.currentOperand === '0' || calculator.currentOperand === 'Error') {
            calculator.currentOperand = '';
        }
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', button => {
    calculator.clear();
});

deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        if (calculator.currentOperand === '0' || calculator.currentOperand === 'Error') {
            calculator.currentOperand = '';
        }
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        let operation = e.key;
        if (operation === '*') operation = '×';
        if (operation === '/') operation = '÷';
        calculator.chooseOperation(operation);
        calculator.updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
    } else if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    } else if (e.key === 'Escape') {
        calculator.clear();
    }
});

// ===== History logic =====
const HISTORY_KEY = 'modern_calc_history_v1';
const MEMORY_KEY = 'modern_calc_memory_v1';
const THEME_KEY = 'modern_calc_theme_v1';

function loadHistory() {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveHistory(items) {
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(-50))); // keep last 50
    } catch {
        // ignore quota errors
    }
}

function renderHistory() {
    const items = loadHistory();
    historyList.innerHTML = '';
    items.forEach((item, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="expr">${item.expr}</span><span class="result">${formatNumber(item.result)}</span>`;
        li.title = 'Click to reuse result';
        li.addEventListener('click', () => {
            calculator.currentOperand = String(item.result);
            calculator.operation = undefined;
            calculator.previousOperand = '';
            calculator.updateDisplay();
        });
        historyList.appendChild(li);
    });
}

function addHistoryItem(expr, result) {
    const items = loadHistory();
    items.push({ expr, result });
    saveHistory(items);
    renderHistory();
}

function clearHistory() {
    saveHistory([]);
    renderHistory();
}

function formatNumber(n) {
    if (typeof n !== 'number') n = parseFloat(n);
    if (!isFinite(n)) return '∞';
    return n.toLocaleString('en', { maximumFractionDigits: 12 });
}

// Clear history button
clearHistoryBtn.addEventListener('click', clearHistory);

// Initial render
renderHistory();

// ===== Memory logic =====
function loadMemory() {
    const v = localStorage.getItem(MEMORY_KEY);
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
}

function saveMemory(n) {
    try { localStorage.setItem(MEMORY_KEY, String(n)); } catch {}
}

let memoryValue = loadMemory();

memoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const cur = parseFloat(calculator.currentOperand);
        const tag = btn.getAttribute('data-memory');
        if (tag === 'mc') {
            memoryValue = 0;
            saveMemory(memoryValue);
        } else if (tag === 'mr') {
            calculator.currentOperand = String(memoryValue);
            calculator.updateDisplay();
        } else if (tag === 'mplus') {
            if (!isNaN(cur)) { memoryValue += cur; saveMemory(memoryValue); }
        } else if (tag === 'mminus') {
            if (!isNaN(cur)) { memoryValue -= cur; saveMemory(memoryValue); }
        }
    });
});

// ===== Unary actions and percent =====
function applyUnary(action) {
    const cur = parseFloat(calculator.currentOperand);
    if (isNaN(cur)) return;
    let result = cur;
    let expr = '';
    try {
        switch (action) {
            case 'negate':
                result = -cur; expr = `negate(${formatNumber(cur)})`;
                break;
            case 'percent':
                if (calculator.operation && calculator.previousOperand) {
                    const prev = parseFloat(calculator.previousOperand);
                    result = prev * (cur / 100);
                    expr = `${formatNumber(prev)} ${calculator.operation} (${formatNumber(cur)}%)`;
                } else {
                    result = cur / 100; expr = `${formatNumber(cur)}%`;
                }
                break;
            case 'sqrt':
                if (cur < 0) throw new Error('Invalid');
                result = Math.sqrt(cur); expr = `√(${formatNumber(cur)})`;
                break;
            case 'square':
                result = cur * cur; expr = `sqr(${formatNumber(cur)})`;
                break;
            case 'reciprocal':
                if (cur === 0) throw new Error('Divide by zero');
                result = 1 / cur; expr = `1/(${formatNumber(cur)})`;
                break;
            default:
                return;
        }
        addHistoryItem(expr, result);
        calculator.currentOperand = String(result);
        calculator.updateDisplay();
    } catch {
        calculator.currentOperand = 'Error';
        calculator.updateDisplay();
    }
}

actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        applyUnary(action);
    });
});

// ===== Theme toggle =====
function loadTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
}

function applyTheme(mode) {
    if (mode === 'light') {
        document.body.classList.add('light');
    } else {
        document.body.classList.remove('light');
    }
}

function saveTheme(mode) {
    try { localStorage.setItem(THEME_KEY, mode); } catch {}
}

let theme = loadTheme();
applyTheme(theme);

themeToggleBtn.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    saveTheme(theme);
});

// ===== Copy result =====
copyResultBtn.addEventListener('click', async () => {
    const text = String(calculator.currentOperand);
    try {
        await navigator.clipboard.writeText(text);
        copyResultBtn.textContent = 'Copied';
        setTimeout(() => (copyResultBtn.textContent = 'Copy'), 1200);
    } catch {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    }
});

// ===== Export history =====
exportHistoryBtn.addEventListener('click', () => {
    const items = loadHistory();
    const lines = items.map(it => `${it.expr} = ${formatNumber(it.result)}`);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calculator-history.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
