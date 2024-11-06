/*************************** CONSTANTS ***************************/
// Save relevant HTML elements, for later usage
const display = document.getElementById("display");
const buttonsDiv = document.getElementById("buttons");

/*********************** CALCULATOR CLASS ***********************/
class Calculator {
    numbersList = ['0'];
    operationsList = [];
    wasOperationPressed = false;

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
        if (this.numbersList.length === 1 && this.numbersList[0] === '0') {
            this.numbersList[0] = number;
        }
        // Check if an operation was pressed before
        else if (this.wasOperationPressed === true) {
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
        // Check if an operation was pressed before
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
    }
}

// Add to corresponding event listener when the keyboard is pressed to be written in the display
document.addEventListener("keydown", (event) => {
    const key = event.key;
    const numbersKeyList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const operationsKeyList = ['+', '-', '*', '/'];
    if (numbersKeyList.includes(key)) {
        calculator.addNumberToDisplay(key);
    } else if (operationsKeyList.includes(key)) {
        calculator.addOperationToDisplay(key);
    }
});
