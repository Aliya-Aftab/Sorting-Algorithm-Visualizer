let bars = [];
let speed = 500; // Default speed
let stopSortingFlag = false;

// Update speed from slider
document.getElementById("speed").addEventListener("input", function () {
    speed = 1000 - this.value;
});

// Sleep function for animation delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate bars based on input
function generateBars() {
    stopSortingFlag = false;
    document.getElementById("statusMessage").innerText = ""; // Clear status message
    document.getElementById("error-message").innerText = ""; // Clear errors

    let input = document.getElementById("arrayInput").value;
    let arr = input.split(",").map(Number);

    if (arr.length === 0 || arr.some(isNaN)) {
        document.getElementById("error-message").innerText = "Please enter valid numbers separated by commas!";
        return;
    }

    let container = document.getElementById("barsContainer");
    container.innerHTML = ""; // Clear previous bars
    bars = [];

    if (arr.length > 30) {
        arr = arr.slice(0, 30); // Limit to 30 bars
    }

    arr.forEach(value => {
        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value * 5}px`;
        bar.innerText = value;
        bars.push(bar);
        container.appendChild(bar);
    });
}

// Swap two bars
function swap(bar1, bar2) {
    let tempHeight = bar1.style.height;
    let tempText = bar1.innerText;

    bar1.style.height = bar2.style.height;
    bar1.innerText = bar2.innerText;
    
    bar2.style.height = tempHeight;
    bar2.innerText = tempText;
}

// Reset bar colors before sorting
function resetBarColors() {
    bars.forEach(bar => {
        bar.style.backgroundColor = "blue"; // Default color
    });
}

// Bubble Sort
async function bubbleSort() {
    resetBarColors();
    let arr = bars.map(bar => parseInt(bar.innerText));
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (stopSortingFlag) return; // Stop sorting if flag is set

            bars[j].style.backgroundColor = "red";
            bars[j + 1].style.backgroundColor = "red";

            if (arr[j] > arr[j + 1]) {
                await sleep(speed);
                swap(bars[j], bars[j + 1]);
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }

            bars[j].style.backgroundColor = "blue";
            bars[j + 1].style.backgroundColor = "blue";
        }
        bars[arr.length - i - 1].style.backgroundColor = "green";
    }
    bars[0].style.backgroundColor = "green"; // Last remaining bar should be green
}

// Selection Sort
async function selectionSort() {
    resetBarColors();
    let arr = bars.map(bar => parseInt(bar.innerText));
    for (let i = 0; i < arr.length - 1; i++) {
        if (stopSortingFlag) return;

        let minIdx = i;
        bars[minIdx].style.backgroundColor = "blue";

        for (let j = i + 1; j < arr.length; j++) {
            if (stopSortingFlag) return;

            bars[j].style.backgroundColor = "red";
            await sleep(speed);

            if (arr[j] < arr[minIdx]) {
                bars[minIdx].style.backgroundColor = "blue";
                minIdx = j;
                bars[minIdx].style.backgroundColor = "blue";
            }
            bars[j].style.backgroundColor = "blue";
        }

        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        swap(bars[i], bars[minIdx]);
        bars[i].style.backgroundColor = "green";
    }
    bars[bars.length - 1].style.backgroundColor = "green"; 
}

async function insertionSort() {
    resetBarColors(); // Reset all bars to blue
    let arr = bars.map(bar => parseInt(bar.innerText));

    for (let i = 1; i < arr.length; i++) {
        if (stopSortingFlag) return; // Stop if flag is set

        let key = arr[i];
        let j = i - 1;

        // Mark the current element as being inserted
        bars[i].style.backgroundColor = "red";  

        while (j >= 0 && arr[j] > key) {
            if (stopSortingFlag) return; 

            bars[j + 1].style.backgroundColor = "red"; 
            await sleep(speed);

            arr[j + 1] = arr[j];
            swap(bars[j], bars[j + 1]);
            j--;
        }

        arr[j + 1] = key;

        // Reset colors to blue for all unsorted bars
        for (let k = 0; k < bars.length; k++) {
            if (k <= i) {
                bars[k].style.backgroundColor = "green"; // Mark sorted ones
            } else {
                bars[k].style.backgroundColor = "blue"; // Keep others blue
            }
        }
    }
    bars[0].style.backgroundColor = "green"; 
}


// Start Sorting Based on Selected Algorithm
async function startSorting() {
    if (bars.length === 0) {
        document.getElementById("error-message").innerText = "Please generate an array before starting the sorting.";
        return;
    }

    stopSortingFlag = false;
    let algorithm = document.getElementById("algorithm").value;

    if (algorithm === "bubble") {
        await bubbleSort();
    } else if (algorithm === "selection") {
        await selectionSort();
    } else if (algorithm === "insertion") {
        await insertionSort();
    }

    if (!stopSortingFlag) {
        document.getElementById("statusMessage").innerText = "Array is sorted now!";
    }
}

// Stop Sorting
function stopSorting() {
    stopSortingFlag = true;
}
