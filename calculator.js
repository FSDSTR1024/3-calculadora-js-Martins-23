/*************************** CONSTANTS ***************************/
// Save relevant HTML elements, for later usage
const display = document.getElementById("display");
const buttonsDiv = document.getElementById("buttons");

/*********************** CALCULATOR CLASS ***********************/
class Calculator {
    numbersList = ['0'];
    operationsList = [];
    wasOperationPressed = false;

    /********** REQUESTED FUNCTIONS **********/
    add(a, b) {
        return a + b;
    }

    substract() {}

    product(a, b) {
        return a * b;
    }

    division() {}

    clear() {}

    /********** ADDITIONAL FUNCTIONS **********/
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

    // Function to add the input number to the display, handling 0's
    addNumberToDisplay(number) {
        // Show in the display the introduced value if:
        // - No number was pressed before, the display is "empty"
        // - The current value in the display is a 0
        if (this.numbersList.length === 1 && this.numbersList[0] === '0' && this.wasOperationPressed === false) {
            this.numbersList[0] = number;
        } else if (this.wasOperationPressed === true) {
            // An operation was pressed before, add to the list a new number
            this.wasOperationPressed = false;
            this.numbersList.push(number);
        } else if (this.wasOperationPressed === false) {
            // A number was pressed before
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
        this._printDisplay();
    }

    // Function to add the input operation to the display
    addOperationToDisplay(operation) {
        if (this.wasOperationPressed === true) {
            // An operation was pressed before, so change the last operation
            this.operationsList[this.operationsList.length - 1] = operation;
        } else if (this.wasOperationPressed === false) {
            // A number was pressed before, so add to the list a new operation
            this.wasOperationPressed = true;
            this.operationsList.push(operation);
        }
        this._printDisplay();
    }

    // Function to calculate the result of the operations
    calculate() {
        while (this.operationsList.length > 0) {
            let operationMethod = undefined;

            // Check if there is a multiplication operation
            let operationIdx = this.operationsList.indexOf('*');
            if (operationIdx !== -1) {
                // Do the multiplication. 1st priority.
                operationMethod = this.product;
            } else {
                // Check if there is an addition operation
                operationIdx = this.operationsList.indexOf('+');
                if (operationIdx !== -1) {
                    // Do the addition. 3rd priority.
                    operationMethod = this.add;
                }
            }

            // Check if it was found any operation
            if (operationMethod === undefined) {
                break;
            }

            // Replace the operands (from the numbers-list) involved in the operation with the result of it
            this.numbersList.splice(operationIdx, 2,
                operationMethod(
                    parseFloat(this.numbersList[operationIdx]),
                    parseFloat(this.numbersList[operationIdx + 1])
                ).toString()
            );
            // Remove the operation from the operations-list
            this.operationsList.splice(operationIdx, 1);
        }
        this.wasOperationPressed = false;
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
    } else if (child.classList.contains("operation")) {
        child.addEventListener("click", () => {
            calculator.addOperationToDisplay(buttonString);
        });
    } else if (child.classList.contains("calculate")) {
        child.addEventListener("click", () => {
            calculator.calculate();
        });
    }
}

// Add to corresponding event listener when the keyboard is pressed to be written in the display
document.addEventListener("keydown", (event) => {
    const key = event.key;
    const numbersKeyList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const operationsKeyList = ['+', '-', '*', '/'];
    if (numbersKeyList.includes(key)) {
        // A number is pressed
        calculator.addNumberToDisplay(key);
    } else if (operationsKeyList.includes(key)) {
        // An operation is pressed
        calculator.addOperationToDisplay(key);
    } else if (key === '=' || key === 'Enter') {
        // It is desired to calculate the result
        calculator.calculate();
    }
});
