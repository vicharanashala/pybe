const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, 'content.json');
const data = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

const sortingTopic = {
  "topicId": "sorting-searching",
  "topicName": "Sorting & Searching Basics",
  "levels": [
    {
      "levelId": 1,
      "title": "Level 1: The Missing Shelf (Prestructural)",
      "caseStudies": [
        {
          "id": "sorting-searching-01",
          "scenario": "You run a small trophy shelf for your neighborhood sports club. Every week, a new trophy arrives with a random height engraved value. Someone asks: \"Where is the trophy for the 4th-place team?\" You have no order — you stare at the whole shelf, one by one, until you find it.",
          "stage1": {
            "attempt1": [
              {
                "text": "Look at every single trophy one by one until you find it.",
                "status": "correct",
                "routesTo": "reveal"
              },
              {
                "text": "Jump straight to the middle trophy on the shelf.",
                "status": "incorrect",
                "routesTo": "reflection_1"
              },
              {
                "text": "Ask the shelf to automatically sort itself.",
                "status": "incorrect",
                "routesTo": "reflection_2"
              }
            ],
            "reflections": {
              "reflection_1": {
                "prompt": "Jumping to the middle only works if you already know the trophies are arranged in some order. Are they ordered right now?",
                "attempt2": [
                  {
                    "text": "No, because the shelf is unsorted, I have to check one by one.",
                    "status": "correct"
                  },
                  {
                    "text": "Yes, middle always works no matter what.",
                    "status": "incorrect"
                  }
                ]
              },
              "reflection_2": {
                "prompt": "Shelves don't sort themselves — yet! Who actually has to organize the items so searching gets cheaper?",
                "attempt2": [
                  {
                    "text": "We must organize and sort the data explicitly first.",
                    "status": "correct"
                  },
                  {
                    "text": "The shelf will do it automatically.",
                    "status": "incorrect"
                  }
                ]
              }
            }
          },
          "stage2": {
            "conceptReveal": "Searching means finding a specific item in a collection. Sorting means arranging items in order so searching becomes faster and cheaper. When data is unordered, your only option is linear search — checking every item one by one from start to finish."
          },
          "stage3": {
            "codeTemplate": "trophies = [14, 8, 22, 5, 19]\ntarget = 5\n\nfor index, trophy in enumerate(trophies):\n    if trophy == target:\n        print(\"Found trophy at index:\", _____)",
            "tokens": [
              {
                "value": "index",
                "correct": true
              },
              {
                "value": "trophy",
                "correct": false,
                "hint": "You want to print the position/index of the found trophy."
              },
              {
                "value": "target",
                "correct": false,
                "hint": "You want the index where it was found."
              }
            ]
          }
        }
      ]
    },
    {
      "levelId": 2,
      "title": "Level 2: Three Core Case Studies (Unistructural)",
      "caseStudies": [
        {
          "id": "sorting-searching-02",
          "scenario": "A school gate guard has a list of ID card numbers allowed entry. A student claims their card is valid. The guard has to check the list front to back until they find a match.",
          "stage1": {
            "attempt1": [
              {
                "text": "Only after checking every single entry in the list.",
                "status": "correct",
                "routesTo": "reveal"
              },
              {
                "text": "After checking the first 5 entries.",
                "status": "incorrect",
                "routesTo": "reflection_1"
              }
            ],
            "reflections": {
              "reflection_1": {
                "prompt": "What if the missing ID would have been entry #6? Can you be sure it is absent without checking the rest?",
                "attempt2": [
                  {
                    "text": "You can only be 100% sure after checking every entry to the end.",
                    "status": "correct"
                  },
                  {
                    "text": "If it is not in the top 5, it is never in the list.",
                    "status": "incorrect"
                  }
                ]
              }
            }
          },
          "stage2": {
            "conceptReveal": "In a linear search, use an **early return** as soon as you find a match so you don't waste time scanning the rest of the list. If you loop through everything without finding it, return `-1` to signal 'not found'."
          },
          "stage3": {
            "codeTemplate": "allowed_ids = [1029, 4471, 2200, 8890, 3345]\n\ndef linear_search(id_list, target_id):\n    for index, current_id in _____(id_list):\n        if current_id _____ target_id:\n            return index\n    return _____\n\nprint(linear_search(allowed_ids, 2200))",
            "tokens": [
              { "value": "enumerate", "correct": true },
              { "value": "==", "correct": true },
              { "value": "-1", "correct": true },
              { "value": "=", "correct": false, "hint": "Use == for equality checking." },
              { "value": "0", "correct": false, "hint": "0 is a valid first index, not a not-found signal." }
            ]
          }
        },
        {
          "id": "sorting-searching-03",
          "scenario": "A game night leaderboard needs to display scores lowest to highest so the most improved player (lowest score) gets recognized first.",
          "stage1": {
            "attempt1": [
              {
                "text": "No, it returns a brand new sorted list leaving the original untouched.",
                "status": "correct",
                "routesTo": "reveal"
              },
              {
                "text": "Yes, it sorts the original list directly in place.",
                "status": "incorrect",
                "routesTo": "reflection_1"
              }
            ],
            "reflections": {
              "reflection_1": {
                "prompt": "In-place sorting is what `.sort()` does. What does `sorted(list)` return instead?",
                "attempt2": [
                  {
                    "text": "`sorted()` creates and returns a new sorted list.",
                    "status": "correct"
                  },
                  {
                    "text": "It modifies the original list and returns None.",
                    "status": "incorrect"
                  }
                ]
              }
            }
          },
          "stage2": {
            "conceptReveal": "Python's built-in `sorted(iterable)` function sorts items in ascending order (smallest to largest) and produces a fresh list without changing your original data."
          },
          "stage3": {
            "codeTemplate": "scores = [88, 42, 95, 60]\nmost_improved_first = _____(scores)\nprint(most_improved_first[_____])",
            "tokens": [
              { "value": "sorted", "correct": true },
              { "value": "0", "correct": true },
              { "value": "sort", "correct": false, "hint": "Use the sorted() built-in function." },
              { "value": "-1", "correct": false, "hint": "Index 0 holds the smallest value after ascending sort." }
            ]
          }
        },
        {
          "id": "sorting-searching-04",
          "scenario": "A rocket launch countdown display needs numbers listed highest to lowest, not lowest to highest.",
          "stage1": {
            "attempt1": [
              {
                "text": "sorted([3, 1, 4, 1, 5], reverse=True)",
                "status": "correct",
                "routesTo": "reveal"
              },
              {
                "text": "sorted([3, 1, 4, 1, 5], descending=True)",
                "status": "incorrect",
                "routesTo": "reflection_1"
              }
            ],
            "reflections": {
              "reflection_1": {
                "prompt": "Python's keyword argument for reversing sort order is named `reverse`, not `descending`.",
                "attempt2": [
                  {
                    "text": "Use `reverse=True` inside `sorted()`.",
                    "status": "correct"
                  },
                  {
                    "text": "Use `descending=True`.",
                    "status": "incorrect"
                  }
                ]
              }
            }
          },
          "stage2": {
            "conceptReveal": "Passing `reverse=True` to `sorted()` reverses the default ascending order, sorting elements from largest to smallest (descending)."
          },
          "stage3": {
            "codeTemplate": "countdown_raw = [3, 1, 4, 1, 5, 9, 2, 6]\ncountdown = sorted(countdown_raw, _____=_____)\nprint(countdown)",
            "tokens": [
              { "value": "reverse", "correct": true },
              { "value": "True", "correct": true },
              { "value": "descending", "correct": false, "hint": "The parameter is named reverse." },
              { "value": "False", "correct": false, "hint": "Set reverse to True for high-to-low." }
            ]
          }
        }
      ]
    },
    {
      "levelId": 3,
      "title": "Level 3: Binary Search & Custom Key Sort (Multistructural)",
      "caseStudies": [
        {
          "id": "sorting-searching-05",
          "scenario": "A physical phonebook is already alphabetically sorted. You flip to the middle, decide if your target name is before or after it, and eliminate the half you don't need.",
          "stage1": {
            "attempt1": [
              {
                "text": "The data must already be sorted.",
                "status": "correct",
                "routesTo": "reveal"
              },
              {
                "text": "The data must consist of numbers only.",
                "status": "incorrect",
                "routesTo": "reflection_1"
              }
            ],
            "reflections": {
              "reflection_1": {
                "prompt": "Names sort alphabetically just fine! What property actually matters for binary search: order or data type?",
                "attempt2": [
                  {
                    "text": "Order matters — any sorted sequence works.",
                    "status": "correct"
                  },
                  {
                    "text": "Only integers can be binary searched.",
                    "status": "incorrect"
                  }
                ]
              }
            }
          },
          "stage2": {
            "conceptReveal": "Binary search divides the search space in half each step by comparing the middle element with the target. It works in logarithmic time O(log n), but requires the list to be sorted beforehand."
          },
          "stage3": {
            "codeTemplate": "sorted_names = [\"Aarav\", \"Diya\", \"Kabir\", \"Meera\", \"Rohan\", \"Vihaan\"]\n\ndef binary_search(sorted_list, target):\n    low, high = 0, len(sorted_list) - _____\n    while low <= high:\n        mid = (low + high) _____ 2\n        if sorted_list[mid] == target:\n            return mid\n        elif sorted_list[mid] < target:\n            low = mid + _____\n        else:\n            high = mid - 1\n    return -1\n\nprint(binary_search(sorted_names, \"Meera\"))",
            "tokens": [
              { "value": "1", "correct": true },
              { "value": "//", "correct": true },
              { "value": "1", "correct": true },
              { "value": "/", "correct": false, "hint": "Use // for integer division." },
              { "value": "0", "correct": false, "hint": "high index starts at len(list) - 1." }
            ]
          }
        },
        {
          "id": "sorting-searching-06",
          "scenario": "A hospital waiting room list needs to be sorted by patient urgency level rather than arrival time.",
          "stage1": {
            "attempt1": [
              {
                "text": "sorted(patients, key=lambda p: p[\"urgency\"])",
                "status": "correct",
                "routesTo": "reveal"
              },
              {
                "text": "sorted(patients[\"urgency\"])",
                "status": "incorrect",
                "routesTo": "reflection_1"
              }
            ],
            "reflections": {
              "reflection_1": {
                "prompt": "`patients[\"urgency\"]` tries to access a key on the list itself. How do you instruct `sorted()` what property to look at for each patient object?",
                "attempt2": [
                  {
                    "text": "Use the `key` parameter with a lambda function.",
                    "status": "correct"
                  },
                  {
                    "text": "Extract all urgency values into a separate list first.",
                    "status": "incorrect"
                  }
                ]
              }
            }
          },
          "stage2": {
            "conceptReveal": "The `key=` parameter in `sorted()` takes a function (often a `lambda`) that extracts a comparison key from each element in the list."
          },
          "stage3": {
            "codeTemplate": "patients = [\n    {\"name\": \"Ravi\", \"urgency\": 2},\n    {\"name\": \"Sana\", \"urgency\": 5},\n    {\"name\": \"Omar\", \"urgency\": 3}\n]\n\nmost_urgent_first = sorted(patients, _____=lambda p: p[_____], reverse=_____)\nprint(most_urgent_first[0][\"name\"])",
            "tokens": [
              { "value": "key", "correct": true },
              { "value": "\"urgency\"", "correct": true },
              { "value": "True", "correct": true },
              { "value": "by", "correct": false, "hint": "The parameter is named key." }
            ]
          }
        }
      ]
    },
    {
      "levelId": 4,
      "title": "Level 4: Library Catalog Rush (Relational)",
      "caseStudies": [
        {
          "id": "sorting-searching-07",
          "scenario": "You volunteer at a library with 5,000 books stored in the order they were donated — completely unsorted. Visitors arrive constantly asking for books by title.",
          "stage1": {
            "attempt1": [
              {
                "text": "Sort the catalog once, then binary search for every visitor.",
                "status": "correct",
                "routesTo": "reveal"
              },
              {
                "text": "Binary search directly on the unsorted catalog.",
                "status": "incorrect",
                "routesTo": "reflection_1"
              },
              {
                "text": "Linear search for every single visitor, all day.",
                "status": "incorrect",
                "routesTo": "reflection_2"
              }
            ],
            "reflections": {
              "reflection_1": {
                "prompt": "What happens to binary search's left/right logic if the middle book isn't actually the middle alphabetically?",
                "attempt2": [
                  {
                    "text": "Binary search fails on unsorted data; sort first!",
                    "status": "correct"
                  },
                  {
                    "text": "Binary search still works on unsorted lists.",
                    "status": "incorrect"
                  }
                ]
              },
              "reflection_2": {
                "prompt": "Linear search works for 1 visitor, but for 5,000 books and hundreds of visitors, it is extremely slow. Paying an upfront sorting cost makes all future searches fast!",
                "attempt2": [
                  {
                    "text": "Sort once up front so all future lookups take milliseconds.",
                    "status": "correct"
                  },
                  {
                    "text": "Keep scanning 5,000 books every time.",
                    "status": "incorrect"
                  }
                ]
              }
            }
          },
          "stage2": {
            "conceptReveal": "By combining `sorted()` (to organize the dataset upfront) with `binary_search` (for instantaneous lookups), you turn an O(N) search bottleneck into an efficient O(log N) system."
          },
          "stage3": {
            "codeTemplate": "catalog = [\"The Hobbit\", \"Emma\", \"Dune\", \"1984\", \"Beloved\", \"Kim\"]\nlookup_title = \"Dune\"\n\ncatalog_sorted = _____(catalog)\n\ndef binary_search(sorted_list, target):\n    low, high = 0, len(sorted_list) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if sorted_list[mid] == target:\n            return mid\n        elif sorted_list[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nposition = binary_search(catalog_sorted, _____)",
            "tokens": [
              { "value": "sorted", "correct": true },
              { "value": "lookup_title", "correct": true },
              { "value": "sort", "correct": false, "hint": "Use sorted() to get a new sorted list." },
              { "value": "\"Dune\"", "correct": false, "hint": "Pass the variable lookup_title." }
            ]
          }
        }
      ]
    },
    {
      "levelId": 5,
      "title": "Level 5: System Trade-Off Design (Extended Abstract)",
      "caseStudies": [
        {
          "id": "sorting-searching-08",
          "scenario": "You are designing an application feature for a peer. You need to decide whether to use linear search or binary search given system constraints.",
          "stage1": {
            "attempt1": [
              {
                "text": "How frequently the data changes versus how often it gets searched.",
                "status": "correct",
                "routesTo": "reveal"
              },
              {
                "text": "Always pick binary search because it is faster regardless of setup costs.",
                "status": "incorrect",
                "routesTo": "reflection_1"
              }
            ],
            "reflections": {
              "reflection_1": {
                "prompt": "If data is modified every second and searched once a day, sorting over and over might waste more total time than linear search! Weigh write cost vs read cost.",
                "attempt2": [
                  {
                    "text": "Choose based on read-vs-write frequency and dataset scale.",
                    "status": "correct"
                  },
                  {
                    "text": "Binary search is always better even for 2 items.",
                    "status": "incorrect"
                  }
                ]
              }
            }
          },
          "stage2": {
            "conceptReveal": "Mastery of searching and sorting means making architectural trade-offs: Linear search requires zero setup cost and handles unsorted, dynamic data well. Binary search requires pre-sorted data but scales to millions of elements effortlessly."
          },
          "stage3": {
            "codeTemplate": "def choose_search_strategy(dataset_size, is_sorted):\n    if _____ or dataset_size > 1000:\n        return _____\n    return \"linear_search\"",
            "tokens": [
              { "value": "is_sorted", "correct": true },
              { "value": "\"binary_search\"", "correct": true },
              { "value": "True", "correct": false, "hint": "Check the boolean flag is_sorted." }
            ]
          }
        }
      ]
    }
  ]
};

const existingIdx = data.findIndex(t => t.topicId === "sorting-searching");
if (existingIdx >= 0) {
  data[existingIdx] = sortingTopic;
} else {
  data.push(sortingTopic);
}

fs.writeFileSync(contentPath, JSON.stringify(data, null, 2), 'utf-8');
console.log('Successfully updated content.json with sorting-searching topic! Total topics:', data.length);
