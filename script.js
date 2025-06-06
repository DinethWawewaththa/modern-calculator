class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
        this.memory = 0;
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
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
        if (this.currentOperand === '0') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

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
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '0';
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
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    memoryStore() {
        this.memory = parseFloat(this.currentOperand);
        this.updateMemoryButtons();
    }

    memoryRecall() {
        if (this.memory !== null) {
            this.currentOperand = this.memory.toString();
            this.updateDisplay();
        }
    }

    memoryClear() {
        this.memory = 0;
        this.updateMemoryButtons();
    }

    memoryAdd() {
        const current = parseFloat(this.currentOperand);
        if (!isNaN(current)) {
            this.memory += current;
            this.updateMemoryButtons();
        }
    }

    memorySubtract() {
        const current = parseFloat(this.currentOperand);
        if (!isNaN(current)) {
            this.memory -= current;
            this.updateMemoryButtons();
        }
    }

    updateMemoryButtons() {
        const memoryButtons = document.querySelectorAll('.memory-btn');
        memoryButtons.forEach(button => {
            button.classList.toggle('active', this.memory !== 0);
        });
    }

    scientificOperation(operation) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;

        let result;
        switch (operation) {
            case 'sin':
                result = Math.sin(current * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(current * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(current * Math.PI / 180);
                break;
            case '√':
                if (current < 0) {
                    alert('Cannot calculate square root of negative number');
                    return;
                }
                result = Math.sqrt(current);
                break;
            case 'x²':
                result = Math.pow(current, 2);
                break;
            case 'x³':
                result = Math.pow(current, 3);
                break;
            case 'xʸ':
                this.operation = 'pow';
                this.previousOperand = current;
                this.currentOperand = '0';
                return;
            case 'log':
                if (current <= 0) {
                    alert('Cannot calculate logarithm of non-positive number');
                    return;
                }
                result = Math.log10(current);
                break;
            case 'ln':
                if (current <= 0) {
                    alert('Cannot calculate natural logarithm of non-positive number');
                    return;
                }
                result = Math.log(current);
                break;
            case 'π':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
            case '|x|':
                result = Math.abs(current);
                break;
        }

        this.currentOperand = result.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }
}

const calculator = new Calculator(
    document.querySelector('.previous-operand'),
    document.querySelector('.current-operand')
);

document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

document.querySelector('.equals').addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

document.querySelector('.clear').addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

document.querySelector('.delete').addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

// Add keyboard support
document.addEventListener('keydown', event => {
    if (event.key >= '0' && event.key <= '9' || event.key === '.') {
        calculator.appendNumber(event.key);
        calculator.updateDisplay();
    }
    if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        const operatorMap = {
            '*': '×',
            '/': '÷'
        };
        const operator = operatorMap[event.key] || event.key;
        calculator.chooseOperation(operator);
        calculator.updateDisplay();
    }
    if (event.key === 'Enter' || event.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
    }
    if (event.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    }
    if (event.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
});

// Dark mode toggle
const themeSwitch = document.getElementById('theme-switch');
themeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeSwitch.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Add memory button event listeners
document.querySelector('.mc').addEventListener('click', () => {
    calculator.memoryClear();
});

document.querySelector('.mr').addEventListener('click', () => {
    calculator.memoryRecall();
});

document.querySelector('.m-plus').addEventListener('click', () => {
    calculator.memoryAdd();
});

document.querySelector('.m-minus').addEventListener('click', () => {
    calculator.memorySubtract();
});

document.querySelector('.ms').addEventListener('click', () => {
    calculator.memoryStore();
});

// Add scientific mode toggle
const modeSwitch = document.getElementById('mode-switch');
const scientificButtons = document.querySelector('.scientific-buttons');

modeSwitch.addEventListener('click', () => {
    scientificButtons.classList.toggle('hidden');
    modeSwitch.textContent = scientificButtons.classList.contains('hidden') ? '123' : 'f(x)';
});

// Add scientific button event listeners
document.querySelectorAll('.scientific-btn').forEach(button => {
    button.addEventListener('click', () => {
        calculator.scientificOperation(button.innerText);
    });
}); 