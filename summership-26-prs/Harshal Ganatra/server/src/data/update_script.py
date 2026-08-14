import json

db_path = r'd:\pybe\server\src\data\db.json'

with open(db_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_case_study = {
    "title": "Functions: 5 Historic Breakthroughs",
    "description": "Master Python functions through 5 historical events. Standalone stories where coding skills build cumulatively.",
    "stages": [
        {
            "id": "stage1_wright",
            "stage_number": 1,
            "title": "Stage 1: Basic Definition & Arguments (Wright Brothers, 1901)",
            "type": "coding_challenge",
            "narrative": "Dayton, Ohio, 1901. Orville and Wilbur Wright are in their wind tunnel testing 200 different wing shapes. Manually calculating the lift for each shape is tedious and error-prone. You must convert repeated manual lift calculations into a single, reusable `calculate_lift(wing_shape)` function.",
            "starter_code": "# Define the calculate_lift function\n\n\n# Test with a wing shape\n# calculate_lift('cambered_wing')",
            "expected_output_contains": "",
            "validation_keywords": ["def", "calculate_lift", "wing_shape"],
            "hints": [
                {
                    "trigger": "missing_def",
                    "pattern": "^(?!.*\\bdef\\b)",
                    "message": "Use the 'def' keyword to define your function."
                }
            ]
        },
        {
            "id": "stage2_apollo",
            "stage_number": 2,
            "title": "Stage 2: Return Values (Apollo 11 Moon Landing, 1969)",
            "type": "coding_challenge",
            "narrative": "July 1969. The Apollo 11 Lunar Module is descending toward the moon. The guidance computer is overloading due to radar data. Just printing a warning isn't enough; the flight computer needs a definitive boolean signal to know whether to trigger the 1202 alarm. Define `check_radar_overflow(cpu_load)` that returns True or False to tell the flight computer whether to trigger the 1202 alarm, rather than just printing the status.",
            "starter_code": "def check_radar_overflow(cpu_load):\n    # Return True if cpu_load > 85, else return False\n    pass\n",
            "expected_output_contains": "",
            "validation_keywords": ["def", "check_radar_overflow", "return", "True", "False"],
            "hints": [
                {
                    "trigger": "missing_return",
                    "pattern": "^(?!.*\\breturn\\b)",
                    "message": "Make sure you 'return' the boolean value instead of printing it."
                }
            ]
        },
        {
            "id": "stage3_bletchley",
            "stage_number": 3,
            "title": "Stage 3: Default Arguments (Bletchley Park Enigma, 1941)",
            "type": "coding_challenge",
            "narrative": "Bletchley Park, 1941. You are intercepting encrypted messages. To speed up cracking the Enigma code, most messages use a standard ring offset of 1. Build a function `decrypt(text, rotor, ring_offset=1)` to crack the code, relying on the default offset to speed up the process.",
            "starter_code": "# Define decrypt(text, rotor, ring_offset=1)\n\n",
            "expected_output_contains": "",
            "validation_keywords": ["def", "decrypt", "ring_offset=1"],
            "hints": [
                {
                    "trigger": "missing_default",
                    "pattern": "^(?!.*ring_offset=1)",
                    "message": "Assign the default value 1 to ring_offset in the function definition."
                }
            ]
        },
        {
            "id": "stage4_telegraph",
            "stage_number": 4,
            "title": "Stage 4: Variable Scope (Transatlantic Telegraph Cable, 1858)",
            "type": "coding_challenge",
            "narrative": "1858. The first transatlantic telegraph cable across the ocean is losing signal. You must write a function where a local `boost_voltage` variable amplifies the signal without corrupting the global `main_power_grid` variable.",
            "starter_code": "main_power_grid = 100\n\ndef amplify_signal(signal):\n    # Define a local variable boost_voltage and return the amplified signal\n    pass\n",
            "expected_output_contains": "",
            "validation_keywords": ["def", "amplify_signal", "boost_voltage", "return"],
            "hints": [
                {
                    "trigger": "global_modified",
                    "pattern": "global\\s+main_power_grid",
                    "message": "Do not modify the global main_power_grid variable."
                }
            ]
        },
        {
            "id": "stage5_telephone",
            "stage_number": 5,
            "title": "Stage 5: Recursion (The First Telephone Exchange, 1878)",
            "type": "coding_challenge",
            "narrative": "1878. George Coy is building the first commercial telephone exchange. You must write a recursive function `route_call()` that continues to call itself to search through switchboard nodes until it successfully connects the caller to the recipient.",
            "starter_code": "def route_call(node, target):\n    # Check if current node is target, otherwise recursively call route_call\n    pass\n",
            "expected_output_contains": "",
            "validation_keywords": ["def", "route_call"],
            "hints": [
                {
                    "trigger": "missing_recursion",
                    "pattern": "^(?!.*route_call.*route_call)",
                    "message": "The function must call itself to be recursive."
                }
            ]
        }
    ]
}

data['modules'][0]['interactive_case_study'] = new_case_study

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print('Done')
