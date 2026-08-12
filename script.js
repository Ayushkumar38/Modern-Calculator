const display = document.getElementById("display");
const history = document.getElementById("history");
const buttons = document.querySelectorAll(".btn");

let current = "0";
let previous = null;
let operator = null;
let waiting = false;

function format(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "Error";
    }
    
    if ( Number.isInteger(number) ) {
        return String(number);
    }

    return String(Number(number.toFixed(12)));
}

function update() {
    display.textContent = current;

    if (previous !==null  && operator) {
      history.textContent = `${format(previous)} ${operator}`;
    }else{
        history.textContent = "";
    }
}

function inputNumber(number) {
    if (current == "Error") {
        reset();
    }

    if (waiting) {
        current = number;
        waiting = false;
    }else{
       current = current =="0"
       ? number
       : current + number; 
    }

    update();
}

function decimal() {
    if (current == "Error") {
        reset(); 
    }

    if (waiting) {
        current = "0.";
        waiting = false;
    }else if (!current.includes(".")) {
        current +=".";
    }

    update();
}

function reset() {
    current = "0";
    previous = null;
    operator = null;
    waiting = false;

    update();
}

function del() {
    if (waiting || current == "Error") {
        return;
    }

    if (current.length > 1) {
        current = current.slice(0, -1);
    }else{
        current = "0";
    }
    
    update();
}

function percent() {
    if(current !=="Error") {
        current = String(Number(current)/100);
        update();
    }
}

function calc(a,b,op) {
    if (op == "+") {
        return a + b;
    }

    if (op == "-") {
        return a - b;
    }

    if (op == "*") {
        return a * b;
    }

    if (op == "/") {
        return b == 0 ? null : a / b;
    }

    return b;
}

function choose(op){
    const input = Number(current);

    if (!Number.isFinite(input)) {
        return;
    }

    if (operator && waiting) {
        operator = op;
        update();
        return;
    }

    if (previous == null){
      previous = input;
    }else if(operator){
        const result = calc(
            previous,
            input,
            operator
        );

        if (result == null) {
            current = "Error";
            previous = null;
            operator = null;
            waiting = true;
            update();
            return;
        }

        current = format(result);
        previous = result;
    }

    operator = op;
    waiting = true;

    update();
}

function equals() {
    if (
        operator == null ||
        previous == null
    ) {
        return;
    }

    const result = calc(
        previous,
        Number(current),
        operator
    );

    if (result == null) {
        current = "Error";
    }else {
        current = format(result);
    }

    previous =  null;
    operator = null;
    waiting = true;

    update();
}

document.querySelector(".buttons").addEventListener("click",(event) => {
    const button = event.target.closest("button");

    if (!button){
        return;
    }

    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value !== undefined) {
        if (/^\d$/.test(value)) {
            inputNumber(value);
        } else if (value === ".") {
            decimal();
        } else {
            choose(value);
        }

        return;
    }
    if (action === "decimal"){
        decimal();
    }

    if (action === "clear") {
        reset();
    }

    if (action === "delete") {
        del();
    }

    if (action === "percent") {
        percent();
    }

    if (action === "calculate") {
        equals();
    }
});

document.addEventListener("keydown",(event) => {
    if (/^\d$/.test(event.key)) {
        inputNumber(event.key);
    } else if (event.key === ".") {
        decimal();
    } else if (event.key === "+") {
        choose("+");
    } else if (event.key === "-") {
        choose("-");
    } else if (event.key === "*") {
        choose("*");
    } else if (event.key === "/") {
        event.preventDefault();
        choose("/");
    } else if (event.key === "%") {
        percent();
    } else if (
        event.key === "Enter" ||
        event.key === "="
    ) {
        equals();
    } else if (event.key === "Backspace") {
        del();
    } else if (event.key === "Escape") {
        reset();
    }
});

update();