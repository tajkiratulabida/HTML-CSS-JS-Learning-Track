function dis(val) {
    document.getElementById("result").value += val;
}

function clr() {
    document.getElementById("result").value = "";
}

// Function that evaluates the entered expression
function solve() {
    let x = document.getElementById("result").value;
    try {
        let y = math.evaluate(x); 
        document.getElementById("result").value = y;
    } catch (error) {
        document.getElementById("result").value = "Error";
    }
}

// Function to handle enter and backspace inputs
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        solve();
    } else if (event.key === "Backspace") {
        resultField.value = resultField.value.slice(0, -1);
    }
});



