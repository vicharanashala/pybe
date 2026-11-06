# The Smart Factory: The Overheating Conveyor 🏭⚙️
### PyBe Interactive Discovery Lab — Python Generators, Iterators & `yield`

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://python.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20ES6%2B-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tests](https://img.shields.io/badge/Unit%20Tests-4%2F4%20Passing-success)](#-automated-testing)
[![Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20Local)-brightgreen)](#-how-to-run-locally)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **Contributed by:** Vighnesh Bhilare ([@vighneshbhilare2005](https://github.com/vighneshbhilare2005))  
> **Affiliation:** Production Engineering, VJTI Mumbai & Data Analytics, IIT Madras  
> **Platform:** [PyBe (Python by Experience)](https://github.com/vicharanashala/pybe), Vicharanashala, IIT Ropar

---

## 🌟 Executive Overview

**The Smart Factory** is a story-driven open-source discovery lab created for **PyBe**.

Rather than teaching Python Generators deductively through abstract grammar rules (`yield`, iterator protocol, `__iter__`, `__next__`), this module grounds memory efficiency in the tangible, high-stakes physical intuition of an **Automotive Roller Bearing Assembly Line** at Precision Motors in Pune/Mumbai.

When a junior engineer attempts to collect 500,000 telemetry readings into a standard Python list, the quality control workstation suffers a critical `MemoryError` crash. The learner must diagnose why storing all items simultaneously fails, discover the physical mechanism of an automated **Conveyor Belt**, and implement **lazy evaluation** using `yield` and `next()`.

---

## 💡 The Pedagogical Mapping

| Physical Factory Reality | Python Construct | Pedagogical Intuition |
| :--- | :--- | :--- |
| **Warehouse Batch Staging:** Stacking 500,000 bearings on the floor before inspecting part #1. The floor collapses. | Regular Function (`return [batch]`) | **Eager Evaluation:** Allocates all items in RAM at once ($O(N)$ space complexity). |
| **Automated Conveyor Belt:** Fabricating one bearing, rolling it past the sensor, inspecting it, and packing it immediately. | Python Generator (`yield item`) | **Lazy Evaluation:** Values produced on-demand; only 1 item in RAM ($O(1)$ space complexity). |
| **Conveyor Advancement Lever:** The inspector pulling the lever to bring the next bearing into the sensor station. | `next(stream)` | Freezes execution state at `yield`, passes control to caller, resumes upon demand. |
| **Raw Material Hopper Empty:** The factory shift runs out of raw metal blanks. | `StopIteration` Exception | Natural end-of-stream signal handled seamlessly by Python's `for` loops. |
| **Continuous 24/7 Monitoring:** Factory vibration sensor streaming readings indefinitely. | Infinite Generator (`while True: yield`) | Streams that cannot exist as a list because an infinite list requires infinite RAM. |

---

## 🔬 Benchmark Proof: List vs Generator

Running the included `simulation.py` script on 300,000 sensor telemetry readings produces the following empirical profile:

```text
=================================================================
>> RUNNING SMART FACTORY MEMORY BENCHMARK (300,000 Parts)
=================================================================

[1] EAGER LIST APPROACH (Function returning full list):
    - Execution Time : 1.0700 seconds
    - Peak RAM Used  : 45.96 MB
    - Total defects  : 128,571

[2] LAZY GENERATOR APPROACH (Python 'yield' conveyor belt):
    - Execution Time : 0.4573 seconds
    - Peak RAM Used  : 0.53 KB (0.0005 MB)
    - Total defects  : 128,571

-----------------------------------------------------------------
>> VERDICT: Generator reduced peak memory usage by 88,589x!
   Object size of generator alone: 232 bytes
-----------------------------------------------------------------
```

---

## 📁 Repository Structure

```text
summership-26-prs/Vighnesh Bhilare/
├── README.md             # Complete project overview, pedagogy, and run guide
├── context.md            # Educational motivation and cognitive gap analysis
├── product.md            # Product specification and multi-phase learner journey
├── index.html            # Interactive 6-stage web discovery lab (zero dependencies)
├── style.css             # Clean industrial-themed dark styling
├── app.js                # State machine, conveyor simulator, and certification engine
├── simulation.py         # Standalone RAM/profiling benchmark script
└── test_generators.py    # Automated unit test suite verifying iterator protocol
```

---

## 🚀 How to Run Locally

### 1. Interactive Web Discovery Lab
**Zero setup required.** Open `index.html` directly in any web browser (Chrome, Edge, Firefox, Safari):
* Simply double-click `index.html` in your file manager, OR
* In terminal:
  ```bash
  python -m http.server 8000
  ```
  Visit `http://localhost:8000` in your browser.

### 2. Python Simulation & Memory Benchmark
To run the live factory simulation and memory measurement:
```bash
python simulation.py
```

### 3. Automated Testing
Run the comprehensive test suite verifying the generator mechanics:
```bash
python test_generators.py
```

---

## 🎯 Verification & Quality Gates

* [x] **Zero Dependencies:** Runs locally without npm, node_modules, Docker, or external databases.
* [x] **Deterministic Logic:** No paid API keys or external LLM connections needed.
* [x] **Isolated Footprint:** All code lives strictly inside `summership-26-prs/Vighnesh Bhilare/`, preventing merge conflicts.
* [x] **Cross-Platform:** Tested and passing on Windows, Linux, and macOS.
