# AlgoMaster - Sorting Algorithm Visualizer

**AlgoMaster** is an interactive web application designed to help users visualize and understand Data Structures and Algorithms (DSA). Unlike standard animations, this tool allows users to see exactly how sorting logic works step-by-step, acting as a visual debugger for complex code.

🔗 **Live Demo:** [View Live Demo](https://aliya-aftab.github.io/Sorting-Algorithm-Visualizer/)

## 📖 Project Overview
Learning algorithms like Merge Sort or Quick Sort by reading code alone can be difficult. AlgoMaster bridges the gap between theory and practice. It provides a real-time visualization where users can watch, hear, and control the sorting process to gain a deeper understanding of efficiency and logic.

## 📸 Interface
![Application Interface](./Screenshot%202025-12-01%20144127.png)

![Sorting in Progress](./Screenshot%202025-12-01%20144209.png)

## ✨ Key Features

* **Live Code Inspection:** The application displays the actual JavaScript code alongside the animation. As the sorting happens, the specific line of code being executed is highlighted, linking the visual movement to the logic.
* **Playback Control (Pause & Resume):** Users can pause the sorting process at any moment to analyze the state of the array, then resume when ready.
* **Audio Feedback:** The tool uses sound to represent data. You can "hear" the difference between a slow algorithm (like Bubble Sort) and a fast one (like Quick Sort) based on the speed and pattern of the audio.
* **Real-Time Logs:** A log panel displays exactly what operations are happening (e.g., "Swapping index 4 and 10"), providing full transparency.
* **Custom Inputs:** Users are not limited to random data; they can input their own numbers to test specific scenarios, such as reverse-sorted or nearly-sorted arrays.

## ⚙️ Technical Architecture
This application was built entirely with **Object-Oriented JavaScript (OOP)**. No external UI libraries were used, ensuring a lightweight and highly optimized performance.

* **Custom Animation Engine:** JavaScript is typically single-threaded. To allow for pausing and resuming without freezing the browser, I implemented a custom "sleep" function using JavaScript Promises.
* **Audio System:** The sound generation uses the **Web Audio API**. It creates oscillators that change pitch based on the value of the numbers being sorted.
* **Modular Design:** The code is structured using Classes, making it clean, scalable, and easy to maintain.

## 🚀 Supported Algorithms

* **Merge Sort** $(O(N \log N))$: Visualizes how arrays are divided and merged back together.
* **Quick Sort** $(O(N \log N))$: Demonstrates partitioning logic and pivot selection.
* **Heap Sort** $(O(N \log N))$: Shows how binary heap structures operate.
* **Bubble, Insertion, & Selection Sort** $(O(N^2))$: accurate visualizations of fundamental comparison algorithms.

## 💻 Tech Stack
* **Frontend:** HTML5, CSS3 (Flexbox).
* **Logic:** JavaScript (ES6+).
* **Audio:** Web Audio API.

## 🛠️ Installation
To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/aliya-aftab/Sorting-Algorithm-Visualizer.git](https://github.com/aliya-aftab/Sorting-Algorithm-Visualizer.git)
    ```
2.  **Open the directory:**
    ```bash
    cd Sorting-Algorithm-Visualizer
    ```
3.  **Run the App:**
    Open `index.html` in your web browser.

---
**Developed by Aliya Aftab**
