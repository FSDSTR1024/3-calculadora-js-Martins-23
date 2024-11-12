/*************************** CONSTANTS ***************************/
// Save relevant HTML elements, for later usage
const display = document.getElementById("display");
const buttonsDiv = document.getElementById("buttons");
const historyList = document.getElementById("historyList");

const deleteButton = document.getElementById("delete");
const calculateButton = document.getElementById("calculate");

/*********************** HISTORY ENTRY CLASS ***********************/
class HistoryEntry {
    constructor(timestamp, operationString, operationResult) {
        this.timestamp = timestamp;
        this.operationString = operationString;
        this.operationResult = operationResult;
        this._addToHistoryList();
    }

    _addToHistoryList() {
        const newHistoryEntry = document.createElement("li");
        const EntryDiv = document.createElement("div");
        // Timestamp part
        const timestampElem = document.createElement("p");
        timestampElem.classList.add("timestamp");
        // timestampElem.innerHTML = this.timestamp;
        timestampElem.textContent = this.timestamp;
        EntryDiv.appendChild(timestampElem);
        // Operation part
        const operationElem = document.createElement("p");
        operationElem.classList.add("operationStr");
        operationElem.textContent = this.operationString;
        EntryDiv.appendChild(operationElem);
        // Result part
        const resultElem = document.createElement("p");
        resultElem.classList.add("operationResult");
        if (this.operationResult.includes("ERROR")) {
            resultElem.classList.add("error");
        } else {
            resultElem.classList.add("correct");
        }
        resultElem.textContent = this.operationResult;
        EntryDiv.appendChild(resultElem);

        newHistoryEntry.appendChild(EntryDiv);
        historyList.prepend(newHistoryEntry);
    }
}


/*********************** CALCULATOR CLASS ***********************/
class Calculator {
    operationsPriorityList = [
        {  // Power of
            priority: 1,
            symbol: '\u005E',
            method: this.powerOf,
            neededValues: 2
        },
        {  // Multiplication
            priority: 2,
            symbol: '*',
            method: this.multiply,
            neededValues: 2
        },
        {  // Division
            priority: 3,
            symbol: '/',
            method: this.divide,
            neededValues: 2
        },
        {  // Addition
            priority: 4,
            symbol: '+',
            method: this.add,
            neededValues: 2
        },
        {  // Substraction
            priority: 5,
            symbol: '-',
            method: this.substract,
            neededValues: 2
        },
        {  // Square
            priority: 6,
            symbol: '\u00B2',
            method: this.square,
            neededValues: 1
        },
        {  // Square root
            priority: 7,
            symbol: '\u221A',
            method: this.squareRoot,
            neededValues: 1
        }
    ]

    constructor() {
        this._setInitialState();
    }

    /********** REQUESTED FUNCTIONS **********/
    add(addend1, addend2) {
        return addend1 + addend2;
    }

    substract(minuend, subtrahend) {
        return minuend - subtrahend;
    }

    multiply(factor1, factor2) {
        return factor1 * factor2;
    }

    divide(divisor, quotient) {
        if (quotient === 0) {
            alert("Division by zero is not allowed!");
        }
        return divisor / quotient;
    }

    clear() {
        this._setInitialState();
    }

    /********** ADDITIONAL FUNCTIONS **********/
    powerOf(base, exponent) {
        // There were several ways to implement this:
        // - Using the Math library (Math.pow(base, exponent))
        // - Using the multiplication operation (base * base * base * ... * base) exponent times
        // -> Using the power operation (base ** exponent)
        return base ** exponent;
    }

    square(number) {
        // There were several ways to implement this:
        // - Using the Math library (Math.pow(number, 2))
        // -> Using the multiplication operation (number * number)
        // - Using the power operation (number ** 2)
        return number * number;
    }

    squareRoot(number) {
        // I tried to implement the square root function without using the Math library
        // (with what's called the Long Division Method), but it was getting too complex...
        if (number < 0) {
            alert("Square root of negative number is not allowed!");
        }
        return Math.sqrt(number);
    }

    // Function to print the display content
    _printDisplay() {
        let displayContent = '';
        for (let index = 0; index < this.numbersList.length; index++) {
            displayContent += this.numbersList[index];
            if (index < this.operationsList.length) {
                displayContent += ` ${this.operationsList[index]} `;
            }
        }
        display.textContent = displayContent;
    }

    // Function to set the initial state of the calculator
    _setInitialState() {
        this.numbersList = ['0'];
        this.operationsList = [];
        this.showingResult = true;
        this.wasOperationPressed = false;
        deleteButton.disabled = true;
        this._printDisplay();
    }

    // Function to add the input number to the display, handling 0's
    addNumberToDisplay(number) {
        // Show in the display the introduced value if:
        // - No number was pressed before, the display is "empty"
        // - The current value in the display is a 0
        // - An operation was calculated before
        if (this.numbersList.length === 1 && this.wasOperationPressed === false && (this.numbersList[0] === '0' || this.showingResult === true)) {
            this.showingResult = false;
            this.numbersList[0] = number;
            deleteButton.disabled = (number === '0');
        } else if (this.wasOperationPressed === true) {
            // An operation was pressed before, add to the list a new number
            this.wasOperationPressed = false;
            this.numbersList.push(number);
        } else if (this.wasOperationPressed === false) {
            // A number was pressed before
            deleteButton.disabled = false;
            const lastNumberIdx = this.numbersList.length - 1;
            const lastNumber = this.numbersList[lastNumberIdx];
            if (lastNumber === '0') {
                // The current value is a 0, so replace it with the new number
                this.numbersList[lastNumberIdx] = number;
            } else {
                // Concatenate the new number to the current value
                this.numbersList[lastNumberIdx] += number;
            }
        }
        calculateButton.disabled = false;
        this._printDisplay();
    }

    // Function to add the input operation to the display
    addOperationToDisplay(operationString) {
        if (['\u221A', '\u00B2'].includes(operationString)) {
            this.wasOperationPressed = true;
            this.operationsList.push(operationString);
            if (operationString === '\u221A') {  // Square root
                display.textContent = `${operationString}(${display.textContent})`;
            } else if (operationString === '\u00B2') {  // Square
                display.textContent = `(${display.textContent})${operationString}`;
            }
            this.calculate();
        } else if (this.wasOperationPressed === true) {
            // An operation was pressed before, so change the last operation
            this.operationsList[this.operationsList.length - 1] = operationString;
        } else if (this.wasOperationPressed === false) {
            // A number was pressed before, so add to the list a new operation
            this.wasOperationPressed = true;
            this.operationsList.push(operationString);
            deleteButton.disabled = false;
            calculateButton.disabled = true;
        }
        this._printDisplay();
    }

    // Function to calculate the result of the operations
    calculate() {
        const timestamp = new Date().toLocaleString();
        const operationString = `${display.textContent} =`;
        while (this.operationsList.length > 0) {
            let operationIdx = -1;
            let operationObj = undefined;

            for (let operation of this.operationsPriorityList.sort((x, y) => x.priority - y.priority)) {
                operationIdx = this.operationsList.indexOf(operation.symbol);
                if (operationIdx !== -1) {
                    operationObj = operation;
                    break;
                }
            }

            // Check if it was found any operation
            if (operationObj === undefined) {
                break;
            }

            // Retrieve the involved number(s) in the operation (operands)...
            let numbersArray = this.numbersList.splice(operationIdx, operationObj.neededValues);
            // ... and replace with the result of it
            this.numbersList.splice(operationIdx, 0,
                operationObj.method(...numbersArray.map(num => parseFloat(num))).toString()
            );
            // Remove the operation from the operations-list
            this.operationsList.splice(operationIdx, 1);
        }

        const operationResult = this.numbersList[0];
        new HistoryEntry(timestamp, operationString, operationResult);
        // This is just for clean-up purposes
        this._setInitialState();
        this.numbersList = [operationResult];
        this._printDisplay();
    }

    // Function to delete the last introduced element
    deleteLastEntry() {
        if (this.wasOperationPressed === true) {
            // The last introduced element was an operation
            this.operationsList.pop();
            this.wasOperationPressed = false;
            calculateButton.disabled = false;
        } else {
            // The last introduced element was a number
            const lastNumber = this.numbersList.pop();
            if (lastNumber.length > 1) {
                // The last number had more than one digit
                this.numbersList.push(lastNumber.slice(0, -1));
            } else {
                // The last number had only one digit
                if (this.numbersList.length === 0) {
                    // The last introduced element was actually the first number introduced
                    this.numbersList.push('0');
                    deleteButton.disabled = true;
                } else {
                    this.wasOperationPressed = true;
                    calculateButton.disabled = true;
                }
            }
        }
        this._printDisplay();
    }
}

/************************ WEB PAGE LOGIC ************************/
// Create a new instance of the Calculator class
const calculator = new Calculator();

// Add to the buttons the corresponding event listener to be written in the display
for (let child of buttonsDiv.children) {
    const buttonString = child.textContent;
    if (child.classList.contains("number")) {
        child.addEventListener("click", () => {
            calculator.addNumberToDisplay(buttonString);
        });
    } else if (child.classList.contains("operation") || child.classList.contains("specialOperation")) {
        child.addEventListener("click", () => {
            calculator.addOperationToDisplay(buttonString);
        });
    } else if (child.id === "calculate") {
        child.addEventListener("click", () => {
            calculator.calculate();
        });
    } else if (child.id === "clear") {
        child.addEventListener("click", () => {
            calculator.clear();
        });
    } else if (child.id === "delete") {
        child.addEventListener("click", () => {
            calculator.deleteLastEntry();
        });
    }
}

// Add to corresponding event listener when the keyboard is pressed to be written in the display
document.addEventListener("keydown", (event) => {
    const key = event.key;
    const numbersKeyList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const operationsKeyList = ['+', '-', '*', '/', '^'];
    if (numbersKeyList.includes(key)) {
        // A number is pressed
        calculator.addNumberToDisplay(key);
    } else if (operationsKeyList.includes(key)) {
        // An operation is pressed
        calculator.addOperationToDisplay(key);
    } else if (key === '=') {
        // It is desired to calculate the result
        calculator.calculate();
    } else if (key === 'c' || key === 'C') {
        // It is desired to clear the display
        calculator.clear();
    } else if (key === "Backspace") {
        // It is desired to delete the last introduced element
        calculator.deleteLastEntry();
    }
});
