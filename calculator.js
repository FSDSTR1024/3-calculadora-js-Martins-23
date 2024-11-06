/*************************** CONSTANTS ***************************/
// Save relevant HTML elements, for later usage
const display = document.getElementById("display");
const buttonsDiv = document.getElementById("buttons");

/*********************** CALCULATOR CLASS ***********************/
class Calculator {
    // Function to add the input number to the display, handling 0's
    addNumberToDisplay(number) {
        // If the display is empty, set it to the introduced value
        if (display.textContent.normalize('NFKC').includes('\u200B')) {
            display.textContent = number;
            return;
        }
        // If current value in display is 0, replace it with introduced value
        if (display.textContent === "0") {
            display.textContent = number;
            return;
        }
        display.textContent += number.toString();
    }
}

/************************ WEB PAGE LOGIC ************************/
// Create a new instance of the Calculator class
const calculator = new Calculator();

// Add to the number buttons the event listener to be written in the display
for (let child of buttonsDiv.children) {
    if (child.classList.contains("number")) {
        child.addEventListener("click", () => {
            const pressedButtonNumber = child.textContent;
            calculator.addNumberToDisplay(pressedButtonNumber);
        });
    }
}
