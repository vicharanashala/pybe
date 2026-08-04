const scenesData = [
  {
    "id": 0,
    "characterName": "Master Spy",
    "dialogue": [
      "The border guards intercepted several ravens bound for the enemy camp.",
      "They carry encrypted scrolls. We believe they contain the exact time and location of their planned attack.",
      "But our enemies use various ciphers and chaotic formatting to scramble their words.",
      "Are you ready to master the art of String Manipulation, apprentice?"
    ],
    "interactive": true,
    "interactionType": "choice",
    "question": "Will you help decode the messages?",
    "options": [
      {
        "text": "Yes, show me the first scroll.",
        "action": "continue",
        "extraDialogue": ["Good. Let us begin with 'The Muddy Missive'."]
      }
    ],
    "decoderVisible": false
  },
  {
    "id": 1,
    "characterName": "Master Spy",
    "dialogue": [
      "Here is the first scroll. It was dropped in the mud, and the scribe was careless.",
      "Notice the chaotic formatting and the blank spaces at the beginning and end.",
      "In cryptography, we must first clean our data."
    ],
    "interactive": true,
    "interactionType": "terminal",
    "terminalPrompt": "Use the .strip() method to remove the blank spaces from 'msg':",
    "expectedPattern": "^msg\\s*=\\s*msg\\.strip\\(\\)$",
    "successFeedback": "Excellent. The excess dirt (whitespace) is gone.",
    "errorHints": {
      "default": "Incorrect syntax. Remember to reassign the variable. Click 'Need a Hint?' if you are stuck."
    },
    "defaultHint": "Hint: msg = msg.strip()",
    "messageState": "   aTTaCk   ",
    "newMessageState": "aTTaCk",
    "decoderVisible": true
  },
  {
    "id": 2,
    "characterName": "Master Spy",
    "dialogue": [
      "The spaces are gone, but the casing is chaotic.",
      "Let's standardize the text to lowercase so we can read it clearly."
    ],
    "interactive": true,
    "interactionType": "terminal",
    "terminalPrompt": "Use .lower() to convert 'msg' to lowercase:",
    "expectedPattern": "^msg\\s*=\\s*msg\\.lower\\(\\)$",
    "successFeedback": "Perfect. 'attack'. Short and terrifying.",
    "errorHints": {
      "default": "Incorrect syntax. Remember to reassign the variable. Click 'Need a Hint?' if you are stuck."
    },
    "defaultHint": "Hint: msg = msg.lower()",
    "messageState": "aTTaCk",
    "newMessageState": "attack",
    "decoderVisible": true
  },
  {
    "id": 3,
    "characterName": "Master Spy",
    "dialogue": [
      "Now for the second scroll. It's much longer.",
      "Before we waste time decoding it, we must verify its priority.",
      "If a message starts with 'urgent:', we must alert the King immediately."
    ],
    "interactive": true,
    "interactionType": "terminal",
    "terminalPrompt": "Use .startswith() to check if 'msg' starts with 'urgent':",
    "expectedPattern": "^msg\\.startswith\\(\\s*['\"]urgent['\"]\\s*\\)$",
    "successFeedback": "It returns True! We must hurry.",
    "errorHints": {
      "default": "Incorrect syntax. Ensure you use 'urgent'. Click 'Need a Hint?' if you are stuck."
    },
    "defaultHint": "Hint: msg.startswith('urgent')",
    "messageState": "urgent: troops arriving. repeat, urgent!",
    "newMessageState": "True",
    "decoderVisible": true
  },
  {
    "id": 4,
    "characterName": "Master Spy",
    "dialogue": [
      "It is urgent! But how urgent?",
      "Let's see how many times the enemy repeated the word 'urgent' in the text.",
      "We can count specific words in a string."
    ],
    "interactive": true,
    "interactionType": "terminal",
    "terminalPrompt": "Use the .count() method to count occurrences of 'urgent':",
    "expectedPattern": "^msg\\.count\\(\\s*['\"]urgent['\"]\\s*\\)$",
    "successFeedback": "It returns 2. Highly critical.",
    "errorHints": {
      "default": "Incorrect syntax. Ensure you use 'urgent'. Click 'Need a Hint?' if you are stuck."
    },
    "defaultHint": "Hint: msg.count('urgent')",
    "messageState": "urgent: troops arriving. repeat, urgent!",
    "newMessageState": "2",
    "decoderVisible": true
  },
  {
    "id": 5,
    "characterName": "Master Spy",
    "dialogue": [
      "Here is the third scroll. This one uses a substitution cipher.",
      "The enemy frequently substitutes the letter 'z' with 'a' to confuse us.",
      "We must swap them back."
    ],
    "interactive": true,
    "interactionType": "terminal",
    "terminalPrompt": "Use .replace() to swap 'z' with 'a' and assign it back to 'msg':",
    "expectedPattern": "^msg\\s*=\\s*msg\\.replace\\(\\s*['\"]z['\"]\\s*,\\s*['\"]a['\"]\\s*\\)$",
    "successFeedback": "The hidden words emerge.",
    "errorHints": {
      "default": "Incorrect syntax. Remember to swap 'z' with 'a'. Click 'Need a Hint?' if you are stuck."
    },
    "defaultHint": "Hint: msg = msg.replace('z', 'a')",
    "messageState": "zrmy is zpprozching",
    "newMessageState": "army is approaching",
    "decoderVisible": true
  },
  {
    "id": 6,
    "characterName": "Master Spy",
    "dialogue": [
      "'army is approaching'.",
      "Let's format this properly for the Commander. We should capitalize the first letter of every word."
    ],
    "interactive": true,
    "interactionType": "terminal",
    "terminalPrompt": "Use .title() to convert 'msg' to Title Case:",
    "expectedPattern": "^msg\\s*=\\s*msg\\.title\\(\\)$",
    "successFeedback": "Beautifully formatted.",
    "errorHints": {
      "default": "Incorrect syntax. Remember to reassign the variable. Click 'Need a Hint?' if you are stuck."
    },
    "defaultHint": "Hint: msg = msg.title()",
    "messageState": "army is approaching",
    "newMessageState": "Army Is Approaching",
    "decoderVisible": true
  },
  {
    "id": 7,
    "characterName": "Master Spy",
    "dialogue": [
      "Actually, military protocols require all warnings to be fully capitalized to denote extreme urgency.",
      "Make the entire string uppercase."
    ],
    "interactive": true,
    "interactionType": "terminal",
    "terminalPrompt": "Use .upper() to convert 'msg' to UPPERCASE:",
    "expectedPattern": "^msg\\s*=\\s*msg\\.upper\\(\\)$",
    "successFeedback": "The warning is ready.",
    "errorHints": {
      "default": "Incorrect syntax. Remember to reassign the variable. Click 'Need a Hint?' if you are stuck."
    },
    "defaultHint": "Hint: msg = msg.upper()",
    "messageState": "Army Is Approaching",
    "newMessageState": "ARMY IS APPROACHING",
    "decoderVisible": true
  },
  {
    "id": 8,
    "characterName": "Master Spy",
    "dialogue": [
      "Finally, the last scroll. It contains the exact coordinates.",
      "But it's a single string separated by commas.",
      "Our generals need this broken down into a Python List of separate instructions."
    ],
    "interactive": true,
    "interactionType": "terminal",
    "terminalPrompt": "Use .split() to break the string at every comma (',') into 'msg_list':",
    "expectedPattern": "^msg_list\\s*=\\s*msg\\.split\\(\\s*['\"],['\"]\\s*\\)$",
    "successFeedback": "Brilliant. The string is now a List of three separate items.",
    "errorHints": {
      "default": "Incorrect syntax. Remember to split at the comma ','. Click 'Need a Hint?' if you are stuck."
    },
    "defaultHint": "Hint: msg_list = msg.split(',')",
    "messageState": "location,docks,midnight",
    "newMessageState": "['location', 'docks', 'midnight']",
    "decoderVisible": true
  },
  {
    "id": 9,
    "characterName": "Master Spy",
    "dialogue": [
      "Wait, the generals just told me their map software only accepts data separated by a dash and spaces (' - ').",
      "We can use the .join() method to stitch our list back into a single string!"
    ],
    "interactive": true,
    "interactionType": "terminal",
    "terminalPrompt": "Use ' - '.join(msg_list) to stitch the list together into 'msg':",
    "expectedPattern": "^msg\\s*=\\s*['\"]\\s*-\\s*['\"]\\.join\\(\\s*msg_list\\s*\\)$",
    "successFeedback": "Incredible! You broke the string apart, and glued it back together differently.",
    "errorHints": {
      "default": "Incorrect syntax. Check the string ' - ' and the list msg_list. Click 'Need a Hint?' if you are stuck."
    },
    "defaultHint": "Hint: msg = ' - '.join(msg_list)",
    "messageState": "['location', 'docks', 'midnight']",
    "newMessageState": "location - docks - midnight",
    "fullyDecoded": true,
    "decoderVisible": true
  },
  {
    "id": 10,
    "characterName": "Master Spy",
    "dialogue": [
      "You have saved the kingdom, apprentice.",
      "You stripped the dirt, lowered the cases, searched with startswith and count, replaced the ciphers, upper-cased the warnings, and split/joined the coordinates.",
      "By mastering Strings, you control the flow of information itself."
    ],
    "interactive": false,
    "buttons": [{ "text": "Restart Case Study", "action": "restart" }],
    "messageState": "location - docks - midnight",
    "fullyDecoded": true,
    "decoderVisible": true
  }
];
