<<<<<<< HEAD
/* -------------------------------------------------------------------------- */
/* DATA & CONFIGURATION                                                       */
/* -------------------------------------------------------------------------- */
const ALGO_DATA = {
    bubble: {
        title: "Bubble Sort",
        desc: "Steps through list, compares adjacent elements, swaps if wrong order. Largest element 'bubbles' to the top.",
        complexity: "Time: O(N²) | Space: O(1)",
        legend: [
            { label: "Comparing", color: "var(--c-compare)" },
            { label: "Swapping", color: "var(--c-swap)" },
            { label: "Sorted", color: "var(--c-sorted)" }
        ],
        code: `async function bubbleSort(arr) {
  for(let i=0; i<arr.length; i++) {
    for(let j=0; j<arr.length-i-1; j++) {
      if(arr[j] > arr[j+1]) {
        await swap(arr, j, j+1);
      }
    }
  }
}`
    },
    selection: {
        title: "Selection Sort",
        desc: "Repeatedly finds the minimum element from unsorted part and puts it at the beginning.",
        complexity: "Time: O(N²) | Space: O(1)",
        legend: [
            { label: "Scanning", color: "var(--c-compare)" },
            { label: "Min Found", color: "var(--c-pivot)" },
            { label: "Sorted", color: "var(--c-sorted)" }
        ],
        code: `async function selectionSort(arr) {
  for(let i=0; i<arr.length; i++) {
    let min = i;
    for(let j=i+1; j<arr.length; j++) {
      if(arr[j] < arr[min]) min = j;
    }
    await swap(arr, i, min);
  }
}`
    },
    insertion: {
        title: "Insertion Sort",
        desc: "Builds sorted array one item at a time, shifting larger elements to the right.",
        complexity: "Time: O(N²) | Space: O(1)",
        legend: [
            { label: "Key", color: "var(--c-pivot)" },
            { label: "Comparing", color: "var(--c-compare)" },
            { label: "Sorted", color: "var(--c-sorted)" }
        ],
        code: `async function insertionSort(arr) {
  for(let i=1; i<arr.length; i++) {
    let j = i;
    while(j > 0 && arr[j] < arr[j-1]) {
      await swap(arr, j, j-1);
      j--;
    }
  }
}`
    },
    merge: {
        title: "Merge Sort",
        desc: "Divides array into halves, sorts them recursively, and merges sorted halves.",
        complexity: "Time: O(N log N) | Space: O(N)",
        legend: [
            { label: "Partition", color: "var(--c-aux)" },
            { label: "Merging", color: "var(--c-compare)" },
            { label: "Sorted", color: "var(--c-sorted)" }
        ],
        code: `async function mergeSort(arr, l, r) {
  if(l >= r) return;
  let m = Math.floor((l+r)/2);
  await mergeSort(arr, l, m);
  await mergeSort(arr, m+1, r);
  await merge(arr, l, m, r);
}`
    },
    quick: {
        title: "Quick Sort",
        desc: "Picks a pivot, partitions array around it (smaller left, larger right), then sorts recursively.",
        complexity: "Time: O(N log N) | Space: O(log N)",
        legend: [
            { label: "Pivot", color: "var(--c-pivot)" },
            { label: "Comparing", color: "var(--c-compare)" },
            { label: "Sorted", color: "var(--c-sorted)" }
        ],
        code: `async function quickSort(arr, start, end) {
  if(start >= end) return;
  let idx = await partition(arr, start, end);
  await quickSort(arr, start, idx-1);
  await quickSort(arr, idx+1, end);
}`
    },
    heap: {
        title: "Heap Sort",
        desc: "Builds a Max-Heap (tree), extracts max element to end of array, and rebuilds heap.",
        complexity: "Time: O(N log N) | Space: O(1)",
        legend: [
            { label: "Max Root", color: "var(--c-pivot)" },
            { label: "Heapify", color: "var(--c-compare)" },
            { label: "Sorted", color: "var(--c-sorted)" }
        ],
        code: `async function heapSort(arr) {
  // Build max heap
  for(let i=n/2-1; i>=0; i--) await heapify(n, i);
  // Extract max
  for(let i=n-1; i>0; i--) {
    await swap(0, i);
    await heapify(i, 0);
  }
}`
    }
};

/* -------------------------------------------------------------------------- */
/* VISUALIZER ENGINE CLASS                                                    */
/* -------------------------------------------------------------------------- */
class Visualizer {
    constructor() {
        this.container = document.getElementById("barsContainer");
        this.bars = [];
        this.audioCtx = null;
        this.isSorting = false;
        this.stopFlag = false;
        this.isPaused = false; // New Pause State
        this.delay = 80; 
        this.stats = { comp: 0, swap: 0 };
        this.init();
    }

    init() {
        this.bindControls();
        this.generateArray();
        this.updateAlgoInfo("bubble");
        
        // Global tab switcher
        window.switchTab = (tabName) => {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
            document.getElementById(tabName).classList.add('active');
            const btns = document.querySelectorAll('.tab-btn');
            btns.forEach(b => {
                if(b.innerText.toLowerCase().includes(tabName.substring(0,4))) b.classList.add('active');
            });
        };
    }

    bindControls() {
        document.getElementById("startBtn").addEventListener("click", () => this.start());
        
        // Pause Button Logic
        const pauseBtn = document.getElementById("pauseBtn");
        pauseBtn.addEventListener("click", () => {
            if(!this.isSorting) return;
            this.isPaused = !this.isPaused;
            if(this.isPaused) {
                pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
                this.log("⚠️ Paused by user");
            } else {
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                this.log("▶️ Resuming...");
            }
        });

        document.getElementById("resetBtn").addEventListener("click", () => { 
            this.stopFlag = true; 
            this.isPaused = false; // Unpause if stopping
        });
        
        document.getElementById("randomBtn").addEventListener("click", () => this.generateArray());
        document.getElementById("loadBtn").addEventListener("click", () => this.loadCustom());
        
        document.getElementById("speed").addEventListener("input", (e) => {
            const val = parseInt(e.target.value);
            this.delay = 1000 / (val * 1.5);
        });

        document.getElementById("algorithm").addEventListener("change", (e) => {
            this.updateAlgoInfo(e.target.value);
        });
    }

    /* --- HELPERS --- */
    log(msg) {
        const logEl = document.getElementById("actionLog");
        logEl.innerText = msg;
    }

    updateStats() {
        document.getElementById("compCount").innerText = this.stats.comp;
        document.getElementById("swapCount").innerText = this.stats.swap;
    }

    updateAlgoInfo(key) {
        const data = ALGO_DATA[key];
        document.getElementById("algoTitle").innerText = data.title;
        document.getElementById("algoDesc").innerText = data.desc;
        document.getElementById("algoCode").innerText = data.code;

        const legendContainer = document.getElementById("legendContainer");
        legendContainer.innerHTML = "";
        data.legend.forEach(item => {
            const div = document.createElement("div");
            div.className = "legend-item";
            div.innerHTML = `<div class="color-dot" style="background: ${item.color}"></div><span>${item.label}</span>`;
            legendContainer.appendChild(div);
        });
    }

    showToast(msg, type="error") {
        const toast = document.getElementById("toast");
        toast.innerText = msg;
        toast.className = `toast ${type}`;
        setTimeout(() => toast.classList.add("hidden"), 3000);
    }

    playNote(val) {
        if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.frequency.value = 200 + (val * 6);
        osc.type = 'triangle'; 
        gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.1);
    }

    /* --- THE PAUSE ENGINE --- */
    async sleep(ms) {
        // If paused, infinite loop until unpaused
        while(this.isPaused) {
            await new Promise(r => setTimeout(r, 100));
        }
        return new Promise(r => setTimeout(r, ms));
    }

    /* --- GENERATION --- */
    generateArray(size = 30) {
        if (this.isSorting) return;
        this.container.innerHTML = "";
        this.bars = [];
        this.stats = { comp: 0, swap: 0 };
        this.updateStats();
        this.log("Ready to sort.");

        for (let i = 0; i < size; i++) {
            const val = Math.floor(Math.random() * 90) + 10;
            this.bars.push(val);
            this.createBar(val);
        }
    }

    loadCustom() {
        if(this.isSorting) return;
        const input = document.getElementById("customInput").value;
        if (!/^[0-9, ]+$/.test(input)) return this.showToast("Numbers only!");
        
        const arr = input.split(",").map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        if (arr.length > 40) return this.showToast("Max 40 numbers");
        
        this.container.innerHTML = "";
        this.bars = arr;
        this.stats = { comp: 0, swap: 0 };
        this.updateStats();
        arr.forEach(n => this.createBar(n));
        this.showToast("Data Loaded", "success");
        this.log("Custom data loaded.");
    }

    createBar(val) {
        const bar = document.createElement("div");
        bar.className = "bar";
        const max = Math.max(...this.bars, 100); 
        bar.style.height = `${(val / max) * 100}%`;
        bar.dataset.val = val;
        
        // ALWAYS Show number label
        const label = document.createElement("span");
        label.innerText = val;
        bar.appendChild(label);

        this.container.appendChild(bar);
    }

    /* --- SORTING CONTROLLER --- */
    async start() {
        if (this.isSorting) return;
        this.isSorting = true;
        this.stopFlag = false;
        this.isPaused = false;
        
        document.getElementById("startBtn").disabled = true;
        document.getElementById("pauseBtn").disabled = false;
        document.getElementById("resetBtn").disabled = false;
        document.getElementById("customInput").disabled = true;
        document.getElementById("pauseBtn").innerHTML = '<i class="fas fa-pause"></i> Pause';
        
        const algo = document.getElementById("algorithm").value;
        const domBars = document.getElementsByClassName("bar");
        
        this.log(`Starting ${algo.toUpperCase()}...`);
        
        if (algo === 'bubble') await this.bubbleSort(domBars);
        if (algo === 'selection') await this.selectionSort(domBars);
        if (algo === 'insertion') await this.insertionSort(domBars);
        if (algo === 'merge') await this.mergeSort(domBars, 0, this.bars.length - 1);
        if (algo === 'quick') await this.quickSort(domBars, 0, this.bars.length - 1);
        if (algo === 'heap') await this.heapSort(domBars);

        if (!this.stopFlag) {
            this.showToast("Sorting Complete", "success");
            this.log("Finished!");
            for(let b of domBars) {
                b.classList.add("bar-sorted");
                await this.sleep(20); // Verification ripple
            }
        } else {
            this.showToast("Stopped");
            this.log("Process stopped.");
        }

        this.isSorting = false;
        document.getElementById("startBtn").disabled = false;
        document.getElementById("pauseBtn").disabled = true;
        document.getElementById("resetBtn").disabled = true;
        document.getElementById("customInput").disabled = false;
    }

    async swap(el1, el2) {
        if (this.stopFlag) return;
        
        el1.classList.add("bar-swap");
        el2.classList.add("bar-swap");
        this.playNote(parseInt(el1.dataset.val));
        this.log(`Swapping ${el1.dataset.val} and ${el2.dataset.val}`);
        
        await this.sleep(this.delay);

        const h1 = el1.style.height;
        const v1 = el1.dataset.val;
        const t1 = el1.querySelector("span").innerText;

        el1.style.height = el2.style.height;
        el1.dataset.val = el2.dataset.val;
        el1.querySelector("span").innerText = el2.querySelector("span").innerText;

        el2.style.height = h1;
        el2.dataset.val = v1;
        el2.querySelector("span").innerText = t1;

        this.stats.swap++;
        this.updateStats();

        el1.classList.remove("bar-swap");
        el2.classList.remove("bar-swap");
    }

    /* --- ALGORITHMS --- */
    
    async bubbleSort(bars) {
        for(let i=0; i<bars.length-1; i++) {
            for(let j=0; j<bars.length-i-1; j++) {
                if(this.stopFlag) return;
                bars[j].classList.add("bar-compare");
                bars[j+1].classList.add("bar-compare");
                this.stats.comp++;
                this.updateStats();
                await this.sleep(this.delay);

                if(parseInt(bars[j].dataset.val) > parseInt(bars[j+1].dataset.val)) {
                    await this.swap(bars[j], bars[j+1]);
                }
                bars[j].classList.remove("bar-compare");
                bars[j+1].classList.remove("bar-compare");
            }
            bars[bars.length-1-i].classList.add("bar-sorted");
        }
        bars[0].classList.add("bar-sorted");
    }

    async selectionSort(bars) {
        for(let i=0; i<bars.length; i++) {
            if(this.stopFlag) return;
            let min = i;
            bars[i].classList.add("bar-pivot"); // Current target
            this.log(`Seeking min starting from index ${i}`);

            for(let j=i+1; j<bars.length; j++) {
                if(this.stopFlag) return;
                bars[j].classList.add("bar-compare");
                this.stats.comp++;
                this.updateStats();
                await this.sleep(this.delay);

                if(parseInt(bars[j].dataset.val) < parseInt(bars[min].dataset.val)) {
                    if(min !== i) bars[min].classList.remove("bar-swap");
                    min = j;
                    bars[min].classList.add("bar-swap"); // Found new min
                }
                bars[j].classList.remove("bar-compare");
            }
            await this.swap(bars[i], bars[min]);
            bars[min].classList.remove("bar-swap");
            bars[i].classList.remove("bar-pivot");
            bars[i].classList.add("bar-sorted");
        }
    }

    async insertionSort(bars) {
        for(let i=1; i<bars.length; i++) {
            let j = i;
            this.log(`Inserting ${bars[i].dataset.val}...`);
            bars[i].classList.add("bar-pivot");

            while(j > 0) {
                if(this.stopFlag) return;
                bars[j-1].classList.add("bar-compare");
                this.stats.comp++;
                this.updateStats();
                await this.sleep(this.delay);

                if(parseInt(bars[j].dataset.val) < parseInt(bars[j-1].dataset.val)) {
                    await this.swap(bars[j], bars[j-1]);
                    bars[j].classList.remove("bar-compare");
                    bars[j-1].classList.remove("bar-compare");
                    j--;
                } else {
                    bars[j-1].classList.remove("bar-compare");
                    break;
                }
            }
            bars[j].classList.remove("bar-pivot");
        }
        for(let b of bars) b.classList.add("bar-sorted");
    }

    async mergeSort(bars, start, end) {
        if(start >= end || this.stopFlag) return;
        const mid = Math.floor((start+end)/2);
        await this.mergeSort(bars, start, mid);
        await this.mergeSort(bars, mid+1, end);
        await this.merge(bars, start, mid, end);
    }

    async merge(bars, start, mid, end) {
        if(this.stopFlag) return;
        this.log(`Merging range ${start} to ${end}`);
        let temp = [];
        let i = start, j = mid+1;
        
        for(let k=start; k<=end; k++) bars[k].classList.add("bar-aux");

        while(i <= mid && j <= end) {
            this.stats.comp++;
            this.updateStats();
            await this.sleep(this.delay);
            let v1 = parseInt(bars[i].dataset.val);
            let v2 = parseInt(bars[j].dataset.val);
            if(v1 <= v2) { temp.push(v1); i++; }
            else { temp.push(v2); j++; }
        }
        while(i <= mid) temp.push(parseInt(bars[i++].dataset.val));
        while(j <= end) temp.push(parseInt(bars[j++].dataset.val));

        for(let k=0; k<temp.length; k++) {
            if(this.stopFlag) return;
            bars[start+k].classList.remove("bar-aux");
            bars[start+k].classList.add("bar-compare");
            
            bars[start+k].style.height = `${(temp[k]/Math.max(...this.bars, 100))*100}%`;
            bars[start+k].dataset.val = temp[k];
            bars[start+k].querySelector("span").innerText = temp[k]; // Update label
            
            this.playNote(temp[k]);
            await this.sleep(this.delay);
            bars[start+k].classList.remove("bar-compare");
        }
    }

    async quickSort(bars, start, end) {
        if(start >= end || this.stopFlag) return;
        let pIndex = await this.partition(bars, start, end);
        await this.quickSort(bars, start, pIndex-1);
        await this.quickSort(bars, pIndex+1, end);
    }

    async partition(bars, start, end) {
        let pivotVal = parseInt(bars[end].dataset.val);
        this.log(`Partitioning around pivot ${pivotVal}`);
        let pIndex = start;
        bars[end].classList.add("bar-pivot");

        for(let i=start; i<end; i++) {
            if(this.stopFlag) return;
            bars[i].classList.add("bar-compare");
            this.stats.comp++;
            this.updateStats();
            await this.sleep(this.delay);

            if(parseInt(bars[i].dataset.val) < pivotVal) {
                await this.swap(bars[i], bars[pIndex]);
                pIndex++;
            }
            bars[i].classList.remove("bar-compare");
        }
        await this.swap(bars[pIndex], bars[end]);
        bars[end].classList.remove("bar-pivot");
        return pIndex;
    }

    async heapSort(bars) {
        let n = bars.length;
        this.log("Building Max Heap...");
        for(let i = Math.floor(n/2)-1; i>=0; i--) {
            if(this.stopFlag) return;
            await this.heapify(bars, n, i);
        }
        for(let i = n-1; i>0; i--) {
            if(this.stopFlag) return;
            this.log(`Extracting max ${bars[0].dataset.val}`);
            await this.swap(bars[0], bars[i]);
            bars[i].classList.add("bar-sorted");
            await this.heapify(bars, i, 0);
        }
        bars[0].classList.add("bar-sorted");
    }

    async heapify(bars, n, i) {
        if(this.stopFlag) return;
        let largest = i;
        let l = 2*i + 1;
        let r = 2*i + 2;

        if(l < n && parseInt(bars[l].dataset.val) > parseInt(bars[largest].dataset.val)) largest = l;
        if(r < n && parseInt(bars[r].dataset.val) > parseInt(bars[largest].dataset.val)) largest = r;

        if(largest !== i) {
            this.stats.comp++;
            this.updateStats();
            await this.swap(bars[i], bars[largest]);
            await this.heapify(bars, n, largest);
        }
    }
}

window.onload = () => new Visualizer();
=======
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
>>>>>>> 34b26de8a6fa482da99318159c84b874c28b8c78
