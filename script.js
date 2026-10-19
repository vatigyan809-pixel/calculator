
const screen = document.getElementById("screen");
const previous = document.getElementById("previous");
const buttons = document.querySelector(".buttons");

let current = "0";
let stored = null;
let operator = null;
let resetScreen = false;

function updateScreen() {
  screen.value = current;
}

function clearAll() {
  current = "0";
  stored = null;
  operator = null;
  resetScreen = false;
  previous.textContent = "";
  updateScreen();
}

function inputNumber(number) {
  if (resetScreen) {
    current = number;
    resetScreen = false;
  } else if (current === "0") {
    current = number;
  } else if (current.length < 15) {
    current += number;
  }

  updateScreen();
}

function inputDecimal() {
  if (resetScreen) {
    current = "0";
    resetScreen = false;
  }

  if (!current.includes(".")) {
    current += ".";
  }

  updateScreen();
}

function chooseOperator(nextOperator) {
  if (operator !== null && !resetScreen) {
    calculate();
  }

  stored = Number(current);
  operator = nextOperator;
  previous.textContent = `${current} ${operatorSymbol(operator)}`;
  resetScreen = true;
}

function operatorSymbol(op) {
  return { "+": "+", "-": "−", "*": "×", "/": "÷" }[op];
}

function calculate() {
  if (operator === null || stored === null) return;

  const first = stored;
  const second = Number(current);
  let result;

  if (operator === "+") result = first + second;
  if (operator === "-") result = first - second;
  if (operator === "*") result = first * second;

  if (operator === "/") {
    if (second === 0) {
      current = "Cannot divide by zero";
      stored = null;
      operator = null;
      resetScreen = true;
      previous.textContent = "";
      updateScreen();
      return;
    }
    result = first / second;
  }

  previous.textContent = `${first} ${operatorSymbol(operator)} ${second} =`;

  current = String(Number(result.toPrecision(12)));
  stored = null;
  operator = null;
  resetScreen = true;
  updateScreen();
}

function deleteLast() {
  if (resetScreen || current === "Cannot divide by zero") {
    current = "0";
    resetScreen = false;
  } else {
    current = current.length > 1 ? current.slice(0, -1) : "0";

    if (current === "-") current = "0";
  }

  updateScreen();
}

function percentage() {
  current = String(Number(current) / 100);
  resetScreen = true;
  updateScreen();
}

function changeSign() {
  if (current !== "0" && current !== "Cannot divide by zero") {
    current = String(-Number(current));
    updateScreen();
  }
}

buttons.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.value !== undefined) {
    const value = button.dataset.value;

    if ("0123456789".includes(value) && value.length === 1) {
      inputNumber(value);
    } else {
      chooseOperator(value);
    }

    return;
  }

  const action = button.dataset.action;

  if (action === "clear") clearAll();
  if (action === "delete") deleteLast();
  if (action === "decimal") inputDecimal();
  if (action === "calculate") calculate();
  if (action === "percent") percentage();
  if (action === "sign") changeSign();
});

document.addEventListener("keydown", function (event) {
  if (event.key >= "0" && event.key <= "9") {
    inputNumber(event.key);
  } else if (event.key === ".") {
    inputDecimal();
  } else if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperator(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    deleteLast();
  } else if (event.key === "Escape") {
    clearAll();
  } else if (event.key === "%") {
    percentage();
  }
});
 