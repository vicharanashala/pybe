import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  BookOpen,
  Play,
  Zap,
  Code2,
  Trophy,
  HelpCircle,
  Bot,
  CheckCircle2,
  Layers,
  Wand2
} from 'lucide-react';

import { Page1Stories } from './components/Page1Stories';
import { DebuggerSimulator } from './components/DebuggerSimulator';
import { ExecutionFlowchart } from './components/ExecutionFlowchart';
import { LineByLineGenerator } from './components/LineByLineGenerator';
import { BugHunterGame } from './components/BugHunterGame';
import { ConceptFlipCards } from './components/ConceptFlipCards';
import { SentenceOrderingPuzzles } from './components/SentenceOrderingPuzzles';
import { AIReasoningSandbox } from './components/AIReasoningSandbox';
import { CustomStoryModal } from './components/CustomStoryModal';
import { CustomStoryPlayground } from './components/CustomStoryPlayground';

export const EXCEPTION_STORIES = [
  {
    id: 'red_hood',
    title: '1. Little Red Riding Hood & The Disguise Trap',
    tagline: 'Catching AttributeError & NameError before danger strikes',
    icon: '🐺',
    pythonConcept: 'try ... except AttributeError',
    description: 'Red Riding Hood visits Grandma\'s cottage in the woods. But wait! The Big Bad Wolf is disguised in bed! Calling guest.bake_pastries() crashes because a Wolf has no bake_pastries method! Catching AttributeError alerts the Woodcutter in time.',
    character: 'Red Riding Hood',
    antagonist: 'Disguised Wolf',
    errorType: 'AttributeError',
    variables: { guest: 'wolf' },
    animationState: {
      options: [
        { label: 'Visit Real Grandma 👵', val: 'grandma', desc: 'Object has .bake_pastries() method' },
        { label: 'Visit Wolf in Disguise 🐺', val: 'wolf', desc: 'Object lacks .bake_pastries() -> Throws AttributeError!' }
      ]
    },
    sentenceMappings: [
      { stepNumber: 1, sentence: 'Red Riding Hood approaches Grandma\'s cottage door.', conceptTag: 'TRY BLOCK START', codeLine: 'try:', explanation: 'Wraps risky action inside try:' },
      { stepNumber: 2, sentence: 'She enters and identifies the guest lying in bed.', conceptTag: 'RESOURCE GET', codeLine: '    guest = cottage.get_guest()', explanation: 'Obtains guest object.' },
      { stepNumber: 3, sentence: 'She asks the guest in bed to bake fresh pastries.', conceptTag: 'RISKY OPERATION', codeLine: '    guest.bake_pastries()  # Risky call!', explanation: 'Wolf has no bake_pastries method -> AttributeError!' },
      { stepNumber: 4, sentence: 'Oh no! The guest is a disguised Wolf lacking the bake_pastries method!', conceptTag: 'EXCEPT CATCH', codeLine: 'except AttributeError as wolf_error:', explanation: 'Catches missing method error.' },
      { stepNumber: 5, sentence: 'Red Riding Hood catches danger and alerts Woodcutter to rescue her!', conceptTag: 'RECOVERY HANDLER', codeLine: '    woodcutter.alert_rescue()', explanation: 'Executes emergency rescue handler.' }
    ],
    orderingPuzzle: [
      { id: 'p1', text: 'Red Riding Hood approaches Grandma\'s cottage door.', correctAscending: 1, pythonCode: 'try:' },
      { id: 'p2', text: 'She asks the guest in bed to bake fresh pastries.', correctAscending: 2, pythonCode: '    guest.bake_pastries()' },
      { id: 'p3', text: 'The guest is a disguised Wolf throwing an AttributeError!', correctAscending: 3, pythonCode: 'except AttributeError:' },
      { id: 'p4', text: 'Red Riding Hood catches the danger and calls the Woodcutter.', correctAscending: 4, pythonCode: '    woodcutter.alert_rescue()' }
    ],
    fillups: {
      question: 'Fill in missing exception keywords for Little Red Riding Hood:',
      codeSnippet: ['[SLOT_1]', '    guest.bake_pastries()', '[SLOT_2] AttributeError:', '    woodcutter.alert()'],
      options: ['try:', 'except', 'finally:', 'else:'],
      answers: { SLOT_1: 'try:', SLOT_2: 'except' }
    }
  },
  {
    id: 'tortoise_hare',
    title: '2. The Tortoise & The Hare: The Sleepy Divide',
    tagline: 'Handling ZeroDivisionError & try ... except ... else',
    icon: '🐢',
    pythonConcept: 'ZeroDivisionError & else block',
    description: 'The Hare takes a nap mid-race, setting hare_speed = 0! Calculating race completion time (distance / speed) crashes with ZeroDivisionError. We catch division by zero to wake up Hare, while else runs when speed is normal.',
    character: 'Tortoise & Hare',
    antagonist: 'Zero Speed Nap',
    errorType: 'ZeroDivisionError',
    variables: { speed: 0 },
    animationState: {
      options: [
        { label: 'Hare Sleeping 💤 (speed = 0)', val: 0, desc: 'Distance / 0 -> Throws ZeroDivisionError!' },
        { label: 'Hare Running 🏃 (speed = 10)', val: 10, desc: 'Normal division -> Runs else block!' }
      ]
    },
    sentenceMappings: [
      { stepNumber: 1, sentence: 'Set the race track distance to 100 meters.', conceptTag: 'INITIAL SETUP', codeLine: 'distance = 100', explanation: 'Sets race distance.' },
      { stepNumber: 2, sentence: 'Try calculating the Hare\'s race completion time.', conceptTag: 'TRY BLOCK START', codeLine: 'try:\n    time = distance / hare_speed', explanation: 'Attempts division.' },
      { stepNumber: 3, sentence: 'If Hare\'s speed is 0 during his nap, catch ZeroDivisionError!', conceptTag: 'EXCEPT CATCH', codeLine: 'except ZeroDivisionError:', explanation: 'Catches 0 speed division.' },
      { stepNumber: 4, sentence: 'Wake up the Hare and set default finish time.', conceptTag: 'ERROR HANDLER', codeLine: '    print("⚡ ZeroDivisionError caught! Hare is asleep!")', explanation: 'Handles zero speed.' },
      { stepNumber: 5, sentence: 'If Hare was running normally, run else block to record time.', conceptTag: 'ELSE BLOCK SUCCESS', codeLine: 'else:\n    print(f"🏃 Race finished in {time}s!")', explanation: 'Executes on success.' }
    ],
    orderingPuzzle: [
      { id: 'p1', text: 'Set race distance to 100 meters.', correctAscending: 1, pythonCode: 'distance = 100' },
      { id: 'p2', text: 'Try dividing distance by Hare speed.', correctAscending: 2, pythonCode: 'try:\n    time = distance / speed' },
      { id: 'p3', text: 'Catch ZeroDivisionError if Hare speed is 0.', correctAscending: 3, pythonCode: 'except ZeroDivisionError:' },
      { id: 'p4', text: 'Else block runs when race completes without errors.', correctAscending: 4, pythonCode: 'else:\n    print("Finish!")' }
    ],
    fillups: {
      question: 'Fill in missing keywords for race completion:',
      codeSnippet: ['try:', '    time = 100 / hare_speed', '[SLOT_1] [SLOT_2]:', '    print("Hare asleep!")', '[SLOT_3]:', '    print("Finish!")'],
      options: ['except', 'ZeroDivisionError', 'else', 'finally'],
      answers: { SLOT_1: 'except', SLOT_2: 'ZeroDivisionError', SLOT_3: 'else' }
    }
  },
  {
    id: 'goldilocks',
    title: '3. Goldilocks & The Three Bears: Out-Of-Bounds Check',
    tagline: 'Mastering IndexError and KeyError handling',
    icon: '🥣',
    pythonConcept: 'IndexError & KeyError',
    description: 'Goldilocks explores the Bears\' cottage. There are only 3 porridge bowls [0, 1, 2]. Asking for bowls[5] throws an IndexError! Looking up bed key "goldilocks" in bear_beds dictionary throws a KeyError!',
    character: 'Goldilocks',
    antagonist: 'Invalid Bounds & Keys',
    errorType: 'IndexError / KeyError',
    variables: { bowlIndex: 5 },
    animationState: {
      options: [
        { label: 'Bowl Index 2 (Baby Bear 🥣)', val: 2, desc: 'Valid index in [0, 1, 2]' },
        { label: 'Bowl Index 5 (Non-existent 💥)', val: 5, desc: 'Out of bounds -> Throws IndexError!' }
      ]
    },
    sentenceMappings: [
      { stepNumber: 1, sentence: 'The Bears table has 3 porridge bowls at positions 0, 1, and 2.', conceptTag: 'LIST DEFINITION', codeLine: 'porridge_bowls = ["Hot 🔥", "Cold 🧊", "Just Right ✨"]', explanation: 'Creates 3-element array.' },
      { stepNumber: 2, sentence: 'Goldilocks tries to taste the bowl at selected index N.', conceptTag: 'TRY BLOCK START', codeLine: 'try:\n    choice = porridge_bowls[selected_index]', explanation: 'Wraps array access.' },
      { stepNumber: 3, sentence: 'If she selects bowl #5, catch IndexError before crashing!', conceptTag: 'EXCEPT INDEX ERROR', codeLine: 'except IndexError:\n    print("🥣 IndexError caught! Only 3 bowls exist!")', explanation: 'Catches out of bounds.' },
      { stepNumber: 4, sentence: 'If she looks for her name in bear_beds dictionary, catch KeyError!', conceptTag: 'EXCEPT KEY ERROR', codeLine: 'except KeyError:\n    print("🛏️ KeyError caught! Not a bear bed owner!")', explanation: 'Catches missing key.' }
    ],
    orderingPuzzle: [
      { id: 'p1', text: 'The cottage table has 3 porridge bowls.', correctAscending: 1, pythonCode: 'bowls = ["Hot", "Cold", "Right"]' },
      { id: 'p2', text: 'Goldilocks tries to access bowl at index 5.', correctAscending: 2, pythonCode: 'try:\n    tasted = bowls[5]' },
      { id: 'p3', text: 'Catch IndexError when index exceeds bowl count.', correctAscending: 3, pythonCode: 'except IndexError:' },
      { id: 'p4', text: 'Handle missing bowl safely without crashing.', correctAscending: 4, pythonCode: '    print("No such bowl!")' }
    ],
    fillups: {
      question: 'Which exception catches invalid list index lookup?',
      codeSnippet: ['try:', '    bowl = porridge_bowls[5]', 'except [SLOT_1]:', '    print("No such bowl!")'],
      options: ['IndexError', 'KeyError', 'ValueError', 'TypeError'],
      answers: { SLOT_1: 'IndexError' }
    }
  },
  {
    id: 'cried_wolf',
    title: '4. The Boy Who Cried Wolf: Triggering Custom Errors',
    tagline: 'Raising exceptions with raise and Custom Exception classes',
    icon: '📯',
    pythonConcept: 'raise & Custom Exceptions',
    description: 'The shepherd boy raises false alarms. When a false alarm is reported, the code explicitly raise ValueError("Prank!"). When a real wolf arrives, the code raise WolfAlarmError("REAL WOLF!") to mobilize villagers!',
    character: 'Shepherd Boy',
    antagonist: 'False Alarms vs Real Danger',
    errorType: 'raise & WolfAlarmError',
    variables: { alarmType: 'prank' },
    animationState: {
      options: [
        { label: 'Shout False Alarm 🤡', val: 'prank', desc: 'Triggers raise ValueError("False Alarm!")' },
        { label: 'Shout Real Wolf Danger 🐺', val: 'real_wolf', desc: 'Triggers raise WolfAlarmError("VILLAGERS ASSEMBLE!")' }
      ]
    },
    sentenceMappings: [
      { stepNumber: 1, sentence: 'Define custom exception class for real wolf danger.', conceptTag: 'CUSTOM EXCEPTION', codeLine: 'class WolfAlarmError(Exception): pass', explanation: 'Extends Exception class.' },
      { stepNumber: 2, sentence: 'Try inspecting shepherd boy\'s alarm signal.', conceptTag: 'TRY BLOCK START', codeLine: 'try:', explanation: 'Starts try block.' },
      { stepNumber: 3, sentence: 'If alarm is prank, raise ValueError exception!', conceptTag: 'RAISE BUILT-IN ERROR', codeLine: '    if alarm == "prank":\n        raise ValueError("🤡 Prank alarm!")', explanation: 'Raises built-in ValueError.' },
      { stepNumber: 4, sentence: 'If real wolf is spotted, raise custom WolfAlarmError!', conceptTag: 'RAISE CUSTOM ERROR', codeLine: '    elif alarm == "real_wolf":\n        raise WolfAlarmError("🐺 REAL WOLF!")', explanation: 'Raises custom WolfAlarmError.' },
      { stepNumber: 5, sentence: 'Villagers catch both exceptions and handle them appropriately.', conceptTag: 'EXCEPT HANDLERS', codeLine: 'except ValueError as ve:\n    print(f"Prank: {ve}")\nexcept WolfAlarmError as wae:\n    print(f"🚨 EMERGENCY: {wae}")', explanation: 'Handles raised errors.' }
    ],
    orderingPuzzle: [
      { id: 'p1', text: 'Define custom WolfAlarmError exception class.', correctAscending: 1, pythonCode: 'class WolfAlarmError(Exception): pass' },
      { id: 'p2', text: 'Try checking current alarm signal.', correctAscending: 2, pythonCode: 'try:' },
      { id: 'p3', text: 'If real wolf, raise custom WolfAlarmError!', correctAscending: 3, pythonCode: '    raise WolfAlarmError("Danger!")' },
      { id: 'p4', text: 'Catch WolfAlarmError and assemble villagers.', correctAscending: 4, pythonCode: 'except WolfAlarmError:\n    print("Assemble!")' }
    ],
    fillups: {
      question: 'Which keyword explicitly triggers an exception in Python?',
      codeSnippet: ['if alarm == "real_wolf":', '    [SLOT_1] WolfAlarmError("Danger!")'],
      options: ['raise', 'except', 'try', 'catch'],
      answers: { SLOT_1: 'raise' }
    }
  },
  {
    id: 'three_pigs',
    title: '5. The Three Little Pigs: Brick House Cleanup',
    tagline: 'Guaranteed execution with try ... except ... finally',
    icon: '🐷',
    pythonConcept: 'try ... except ... finally',
    description: 'The pigs build straw, wood, and brick houses. When the wolf huffs and puffs, straw/wood houses fail. But no matter whether an exception occurs or not, the finally block GUARANTEES that construction tools are put away and the door is locked securely!',
    character: 'Three Little Pigs',
    antagonist: 'Big Bad Wolf Huff & Puff',
    errorType: 'finally Guaranteed Cleanup',
    variables: { material: 'straw' },
    animationState: {
      options: [
        { label: 'Build Straw House 🌾', val: 'straw', desc: 'Blows down -> Throws HouseBlownError, BUT finally STILL runs!' },
        { label: 'Build Brick House 🧱', val: 'brick', desc: 'Stands firm -> No error, AND finally STILL runs!' }
      ]
    },
    sentenceMappings: [
      { stepNumber: 1, sentence: 'Try building house with chosen material.', conceptTag: 'TRY BLOCK START', codeLine: 'try:\n    print(f"Building house with {material}...")', explanation: 'Starts try block.' },
      { stepNumber: 2, sentence: 'If material is straw, Wolf blows it down, throwing collapse exception!', conceptTag: 'COLLAPSE EXCEPTION', codeLine: '    if material == "straw":\n        raise Exception("💨 Straw house blown down!")', explanation: 'Simulates failure.' },
      { stepNumber: 3, sentence: 'Catch any house collapse exception safely.', conceptTag: 'EXCEPT HANDLER', codeLine: 'except Exception as e:\n    print(f"🏠 House collapsed: {e}")', explanation: 'Handles collapse.' },
      { stepNumber: 4, sentence: 'FINALLY, clean up tools and lock site securely no matter what happened!', conceptTag: 'FINALLY GUARANTEED CLEANUP', codeLine: 'finally:\n    site_locked = True\n    print("🔒 FINALLY block executed! Site locked & tools cleaned!")', explanation: 'ALWAYS executes.' }
    ],
    orderingPuzzle: [
      { id: 'p1', text: 'Try building house with straw.', correctAscending: 1, pythonCode: 'try:\n    build_straw_house()' },
      { id: 'p2', text: 'Catch house collapse exception when wolf blows it down.', correctAscending: 2, pythonCode: 'except Exception as e:\n    print("Collapsed!")' },
      { id: 'p3', text: 'FINALLY block runs guaranteed to clean up tools & lock site.', correctAscending: 3, pythonCode: 'finally:\n    lock_site_tools()' }
    ],
    fillups: {
      question: 'Which block executes ALWAYS, whether an exception occurred or not?',
      codeSnippet: ['try:', '    build_house()', 'except Exception:', '    evacuate()', '[SLOT_1]:', '    lock_site_tools()'],
      options: ['finally', 'else', 'catch', 'always'],
      answers: { SLOT_1: 'finally' }
    }
  },
  {
    id: 'hansel_gretel',
    title: '6. Hansel & Gretel: The Trail of Breadcrumbs',
    tagline: 'Handling FileNotFoundError when files are missing',
    icon: '🍞',
    pythonConcept: 'try ... except FileNotFoundError',
    description: 'Hansel & Gretel leave a trail of breadcrumbs in the forest saved in trail.txt. But birds eat all the breadcrumbs! Opening trail.txt throws a FileNotFoundError. Catching FileNotFoundError enables them to safely use their magic compass instead.',
    character: 'Hansel & Gretel',
    antagonist: 'Hungry Forest Birds',
    errorType: 'FileNotFoundError',
    variables: { trailState: 'eaten' },
    animationState: {
      options: [
        { label: 'Birds Ate Trail 🐦 (Missing File)', val: 'eaten', desc: 'open("trail.txt") -> Throws FileNotFoundError!' },
        { label: 'Trail Intact 🥖 (File Exists)', val: 'intact', desc: 'File opened -> Reads trail coordinates cleanly!' }
      ]
    },
    sentenceMappings: [
      { stepNumber: 1, sentence: 'Hansel & Gretel attempt to open the saved breadcrumb trail file.', conceptTag: 'TRY BLOCK START', codeLine: 'try:\n    trail_file = open("breadcrumbs_trail.txt", "r")', explanation: 'Attempts to open trail file.' },
      { stepNumber: 2, sentence: 'They read the path coordinates to find their way home.', conceptTag: 'FILE READ', codeLine: '    path = trail_file.read()', explanation: 'Reads file content.' },
      { stepNumber: 3, sentence: 'Oh no! Birds ate the breadcrumbs, throwing a FileNotFoundError!', conceptTag: 'EXCEPT FILE NOT FOUND', codeLine: 'except FileNotFoundError as err:', explanation: 'Catches missing file error.' },
      { stepNumber: 4, sentence: 'They catch the error and switch to compass navigation safely.', conceptTag: 'RECOVERY HANDLER', codeLine: '    print("🐦 FileNotFoundError caught! Breadcrumbs eaten! Using compass 🧭")', explanation: 'Switches to compass.' }
    ],
    orderingPuzzle: [
      { id: 'p1', text: 'Try opening breadcrumbs_trail.txt file.', correctAscending: 1, pythonCode: 'try:\n    f = open("trail.txt")' },
      { id: 'p2', text: 'Birds ate the trail file, throwing FileNotFoundError!', correctAscending: 2, pythonCode: 'except FileNotFoundError:' },
      { id: 'p3', text: 'Switch to compass navigation safely.', correctAscending: 3, pythonCode: '    use_compass_navigation()' }
    ],
    fillups: {
      question: 'Which exception catches missing file errors in Python?',
      codeSnippet: ['try:', '    f = open("trail.txt")', 'except [SLOT_1]:', '    use_compass()'],
      options: ['FileNotFoundError', 'IndexError', 'ZeroDivisionError', 'TypeError'],
      answers: { SLOT_1: 'FileNotFoundError' }
    }
  },
  {
    id: 'jack_beanstalk',
    title: '7. Jack & The Beanstalk: Magic Bean Type Check',
    tagline: 'Handling TypeError when data types mismatch',
    icon: '🫘',
    pythonConcept: 'try ... except TypeError',
    description: 'Jack trades his cow for magic beans, but the count is stored as a string ("5"). Trying to add numeric magic potion count magic_beans + 3 throws a TypeError! Catching TypeError converts string "5" into an integer int(magic_beans) safely.',
    character: 'Jack',
    antagonist: 'Mismatched String Data Type',
    errorType: 'TypeError',
    variables: { beanType: 'str_val' },
    animationState: {
      options: [
        { label: 'String Bean Count "5" 🫘', val: 'str_val', desc: '"5" + 3 -> Throws TypeError!' },
        { label: 'Numeric Bean Count 5 🟢', val: 'int_val', desc: '5 + 3 -> Adds magic potions cleanly!' }
      ]
    },
    sentenceMappings: [
      { stepNumber: 1, sentence: 'Jack receives magic_beans count from trader.', conceptTag: 'DATA ASSIGNMENT', codeLine: 'magic_beans = "5"  # String type!', explanation: 'String representation.' },
      { stepNumber: 2, sentence: 'He tries to add 3 magic potions directly to magic_beans.', conceptTag: 'TRY BLOCK START', codeLine: 'try:\n    total = magic_beans + 3', explanation: 'Adding string and int throws TypeError.' },
      { stepNumber: 3, sentence: 'Python throws a TypeError because str and int cannot be added!', conceptTag: 'EXCEPT TYPE ERROR', codeLine: 'except TypeError:', explanation: 'Catches type mismatch.' },
      { stepNumber: 4, sentence: 'Jack catches TypeError and converts magic_beans using int() safely.', conceptTag: 'TYPE CONVERSION HANDLER', codeLine: '    total = int(magic_beans) + 3\n    print(f"🌱 TypeError handled! Total potions: {total}")', explanation: 'Converts str to int.' }
    ],
    orderingPuzzle: [
      { id: 'p1', text: 'Set magic_beans = "5" as string.', correctAscending: 1, pythonCode: 'beans = "5"' },
      { id: 'p2', text: 'Try adding 3 potions: beans + 3.', correctAscending: 2, pythonCode: 'try:\n    total = beans + 3' },
      { id: 'p3', text: 'Catch TypeError when adding str and int.', correctAscending: 3, pythonCode: 'except TypeError:' },
      { id: 'p4', text: 'Convert string to int(beans) + 3.', correctAscending: 4, pythonCode: '    total = int(beans) + 3' }
    ],
    fillups: {
      question: 'Which exception catches incompatible type operations?',
      codeSnippet: ['try:', '    total = "5" + 3', 'except [SLOT_1]:', '    total = int("5") + 3'],
      options: ['TypeError', 'ValueError', 'KeyError', 'AttributeError'],
      answers: { SLOT_1: 'TypeError' }
    }
  },
  {
    id: 'aladdin_genie',
    title: '8. Aladdin & The Genie: Wish Permission Validator',
    tagline: 'Handling PermissionError & Wish Limits',
    icon: '🧞',
    pythonConcept: 'PermissionError & AssertionError',
    description: 'Aladdin rubs the magic lamp to request wishes. Trying to ask for more than 3 wishes (wish_count > 3) throws a PermissionError! Catching PermissionError reminds Aladdin of the Genie\'s cosmic rules.',
    character: 'Aladdin & Genie',
    antagonist: 'Forbidden Cosmic Wishes',
    errorType: 'PermissionError',
    variables: { wishCount: 'excess' },
    animationState: {
      options: [
        { label: 'Request 5 Wishes 🧞 (Forbidden)', val: 'excess', desc: 'wishes > 3 -> Throws PermissionError!' },
        { label: 'Request 2 Wishes ✨ (Allowed)', val: 'normal', desc: 'wishes <= 3 -> Genie grants wishes!' }
      ]
    },
    sentenceMappings: [
      { stepNumber: 1, sentence: 'Aladdin rubs the lamp to request wishes.', conceptTag: 'START TRY BLOCK', codeLine: 'try:\n    requested_wishes = 5', explanation: 'Starts wish request.' },
      { stepNumber: 2, sentence: 'If wish count exceeds 3, Genie throws a PermissionError!', conceptTag: 'CHECK PERMISSION', codeLine: '    if requested_wishes > 3:\n        raise PermissionError("🧞 Cosmic Law: Max 3 wishes allowed!")', explanation: 'Raises PermissionError.' },
      { stepNumber: 3, sentence: 'Catch PermissionError and notify Aladdin of the rule.', conceptTag: 'EXCEPT PERMISSION ERROR', codeLine: 'except PermissionError as err:', explanation: 'Catches permission violation.' },
      { stepNumber: 4, sentence: 'Aladdin adjusts his request to 3 wishes safely.', conceptTag: 'RECOVERY HANDLER', codeLine: '    print(f"🚨 PermissionError caught: {err}! Wish count reset to 3.")', explanation: 'Resets wish count.' }
    ],
    orderingPuzzle: [
      { id: 'p1', text: 'Aladdin requests 5 wishes.', correctAscending: 1, pythonCode: 'try:\n    wishes = 5' },
      { id: 'p2', text: 'If wishes > 3, raise PermissionError!', correctAscending: 2, pythonCode: '    raise PermissionError("Max 3")' },
      { id: 'p3', text: 'Catch PermissionError and reset to 3 wishes.', correctAscending: 3, pythonCode: 'except PermissionError:\n    wishes = 3' }
    ],
    fillups: {
      question: 'Which exception handles forbidden permission access?',
      codeSnippet: ['if wishes > 3:', '    raise [SLOT_1]("Forbidden!")'],
      options: ['PermissionError', 'TypeError', 'ZeroDivisionError', 'IndexError'],
      answers: { SLOT_1: 'PermissionError' }
    }
  },
  {
    id: 'cinderella',
    title: '9. Cinderella: The Midnight Glass Slipper Timer',
    tagline: 'Handling TimeoutError when time expires',
    icon: '👠',
    pythonConcept: 'try ... except TimeoutError',
    description: 'Cinderella attends the royal ball. Her fairy godmother spell has a strict midnight deadline. Dancing past midnight (time_remaining <= 0) throws a TimeoutError! Catching TimeoutError transforms her dress back to rags before the Prince notices.',
    character: 'Cinderella',
    antagonist: 'Midnight Clock Deadline',
    errorType: 'TimeoutError',
    variables: { clockState: 'past_midnight' },
    animationState: {
      options: [
        { label: 'Clock Strikes 12:01 AM 🕛', val: 'past_midnight', desc: 'Spell expired -> Throws TimeoutError!' },
        { label: 'Clock at 11:45 PM 🕚', val: 'before_midnight', desc: 'Time remaining -> Dance continues!' }
      ]
    },
    sentenceMappings: [
      { stepNumber: 1, sentence: 'Cinderella dances at the royal ball.', conceptTag: 'TRY BLOCK START', codeLine: 'try:\n    time_remaining = 0  # Midnight!', explanation: 'Starts timer check.' },
      { stepNumber: 2, sentence: 'If time expires, fairy godmother magic throws TimeoutError!', conceptTag: 'CHECK TIMEOUT', codeLine: '    if time_remaining <= 0:\n        raise TimeoutError("🕛 Spell expired at midnight!")', explanation: 'Raises TimeoutError.' },
      { stepNumber: 3, sentence: 'Catch TimeoutError as clock strikes midnight.', conceptTag: 'EXCEPT TIMEOUT ERROR', codeLine: 'except TimeoutError as err:', explanation: 'Catches timeout.' },
      { stepNumber: 4, sentence: 'Cinderella leaves glass slipper and escapes in carriage safely.', conceptTag: 'ESCAPE HANDLER', codeLine: '    print(f"👠 TimeoutError caught: {err}! Escaping to carriage!")', explanation: 'Executes escape.' }
    ],
    orderingPuzzle: [
      { id: 'p1', text: 'Cinderella dances at royal ball.', correctAscending: 1, pythonCode: 'try:\n    time_left = 0' },
      { id: 'p2', text: 'Clock strikes 12, raising TimeoutError!', correctAscending: 2, pythonCode: '    raise TimeoutError("Expired!")' },
      { id: 'p3', text: 'Catch TimeoutError and escape to carriage.', correctAscending: 3, pythonCode: 'except TimeoutError:\n    escape_to_carriage()' }
    ],
    fillups: {
      question: 'Which exception catches timer expiration in Python?',
      codeSnippet: ['if time <= 0:', '    raise [SLOT_1]("Expired!")'],
      options: ['TimeoutError', 'MemoryError', 'IndexError', 'KeyError'],
      answers: { SLOT_1: 'TimeoutError' }
    }
  },
  {
    id: 'pied_piper',
    title: '10. Pied Piper of Hamelin: River Crossing Capacity',
    tagline: 'Handling MemoryError and OverflowError',
    icon: '🪈',
    pythonConcept: 'MemoryError & OverflowError',
    description: 'The Pied Piper plays his magic flute to lead rats out of Hamelin. Attempting to allocate memory for 2 ** 100000000 rats in a single array throws a MemoryError! Catching MemoryError processes rats in safe batch sizes.',
    character: 'Pied Piper',
    antagonist: 'Infinite Rat Array Overflow',
    errorType: 'MemoryError / OverflowError',
    variables: { ratCount: 'infinite' },
    animationState: {
      options: [
        { label: 'Infinite Rat List 🐀 (Too Large)', val: 'infinite', desc: 'Array too large -> Throws MemoryError!' },
        { label: 'Batch Rat Processing 📦', val: 'batch', desc: 'Batch size 100 -> Processed cleanly!' }
      ]
    },
    sentenceMappings: [
      { stepNumber: 1, sentence: 'Pied Piper tries to allocate memory for all rats at once.', conceptTag: 'TRY BLOCK START', codeLine: 'try:\n    rats_array = [0] * (10 ** 12)', explanation: 'Tries massive memory allocation.' },
      { stepNumber: 2, sentence: 'Memory exceeds system capacity, throwing MemoryError!', conceptTag: 'EXCEPT MEMORY ERROR', codeLine: 'except MemoryError:', explanation: 'Catches out of memory.' },
      { stepNumber: 3, sentence: 'Pied Piper catches MemoryError and switches to batch processing.', conceptTag: 'BATCH HANDLER', codeLine: '    print("🌊 MemoryError caught! Processing rats in batches of 100!")', explanation: 'Handles memory limit.' }
    ],
    orderingPuzzle: [
      { id: 'p1', text: 'Try allocating memory for 10^12 rats.', correctAscending: 1, pythonCode: 'try:\n    arr = [0] * (10**12)' },
      { id: 'p2', text: 'System runs out of memory, throwing MemoryError!', correctAscending: 2, pythonCode: 'except MemoryError:' },
      { id: 'p3', text: 'Switch to batch processing of 100 rats at a time.', correctAscending: 3, pythonCode: '    process_batches(100)' }
    ],
    fillups: {
      question: 'Which exception catches out-of-memory array allocation?',
      codeSnippet: ['try:', '    arr = [0] * (10**12)', 'except [SLOT_1]:', '    process_batches()'],
      options: ['MemoryError', 'TypeError', 'IndexError', 'ValueError'],
      answers: { SLOT_1: 'MemoryError' }
    }
  }
];

const STAGES = [
  { id: 1, title: 'Page 1: The Magic of Code (Stories)', icon: BookOpen, short: 'Stories' },
  { id: 2, title: 'Page 2: Debugging & Variable Inspector', icon: Play, short: 'Debugger' },
  { id: 3, title: 'Page 3: Workflow Node Graphs', icon: Zap, short: 'Flowchart' },
  { id: 4, title: 'Page 4: Line-by-Line Code Generator', icon: Code2, short: 'Generator' },
  { id: 5, title: 'Page 5: Break the Code - Bug Hunter', icon: Trophy, short: 'Bug Hunter' },
  { id: 6, title: 'Page 6: Concept Flip Cards', icon: Layers, short: 'Flip Cards' },
  { id: 7, title: 'Page 7: Fill-ups & Sentence Ordering', icon: HelpCircle, short: 'Puzzles' },
  { id: 8, title: 'Page 8: AI Reasoning Sandbox', icon: Bot, short: 'AI Sandbox' },
  { id: 9, title: 'Page 9: Custom Story Generator Playground', icon: Wand2, short: 'Playground' },
];

export function ExceptionStudio({ onSubmitReasoning }) {
  const [activeStage, setActiveStage] = useState(1);
  const [activeStoryId, setActiveStoryId] = useState('red_hood');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completedStagesMap, setCompletedStagesMap] = useState(() => {
    try {
      const saved = localStorage.getItem('pybe_completed_stages_map');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [unlockedStagesMap, setUnlockedStagesMap] = useState(() => {
    try {
      const saved = localStorage.getItem('pybe_unlocked_stages_map');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [stageActivityDoneMap, setStageActivityDoneMap] = useState(() => {
    try {
      const saved = localStorage.getItem('pybe_stage_activity_done_map');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [completedStories, setCompletedStories] = useState(() => {
    try {
      const saved = localStorage.getItem('pybe_completed_stories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [unlockedStories, setUnlockedStories] = useState(() => {
    try {
      const saved = localStorage.getItem('pybe_unlocked_stories');
      return saved ? JSON.parse(saved) : ['red_hood'];
    } catch {
      return ['red_hood'];
    }
  });
  const [completionPopup, setCompletionPopup] = useState(null);

  useEffect(() => {
    localStorage.setItem('pybe_completed_stages_map', JSON.stringify(completedStagesMap));
  }, [completedStagesMap]);

  useEffect(() => {
    localStorage.setItem('pybe_unlocked_stages_map', JSON.stringify(unlockedStagesMap));
  }, [unlockedStagesMap]);

  useEffect(() => {
    localStorage.setItem('pybe_stage_activity_done_map', JSON.stringify(stageActivityDoneMap));
  }, [stageActivityDoneMap]);

  useEffect(() => {
    localStorage.setItem('pybe_completed_stories', JSON.stringify(completedStories));
  }, [completedStories]);

  useEffect(() => {
    localStorage.setItem('pybe_unlocked_stories', JSON.stringify(unlockedStories));
  }, [unlockedStories]);

  const isReviewMode = completedStories.includes(activeStoryId);
  const completedStages = isReviewMode
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9]
    : (completedStagesMap[activeStoryId] || []);
  const unlockedStages = isReviewMode
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9]
    : (unlockedStagesMap[activeStoryId] || [1]);
  const stageActivityDone = isReviewMode
    ? { 1:true,2:true,3:true,4:true,5:true,6:true,7:true,8:true,9:true }
    : (stageActivityDoneMap[activeStoryId] || { 1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false,9:false });

  const handleActivityDone = (stageId) => {
    setStageActivityDoneMap(prev => {
      const storyDoneObj = prev[activeStoryId] || { 1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false,9:false };
      const updatedStoryObj = { ...storyDoneObj, [stageId]: true };

      // If Stage 9 activity is completed, unlock the next story!
      if (stageId === 9) {
        unlockNextStory(activeStoryId);
      }

      return {
        ...prev,
        [activeStoryId]: updatedStoryObj
      };
    });

    setCompletedStagesMap(prev => {
      const current = prev[activeStoryId] || [];
      return {
        ...prev,
        [activeStoryId]: current.includes(stageId) ? current : [...current, stageId]
      };
    });
  };

  const unlockNextStory = (storyId) => {
    setCompletedStories(prev => prev.includes(storyId) ? prev : [...prev, storyId]);
    const currIdx = EXCEPTION_STORIES.findIndex(s => s.id === storyId);
    const nextStory = EXCEPTION_STORIES[currIdx + 1];
    if (nextStory) {
      setUnlockedStories(prev => prev.includes(nextStory.id) ? prev : [...prev, nextStory.id]);
    }
  };

  // Story condition states
  const [storyConditions, setStoryConditions] = useState({
    red_hood: 'wolf',
    tortoise_hare: 0,
    goldilocks: 5,
    cried_wolf: 'prank',
    three_pigs: 'straw',
    hansel_gretel: 'eaten',
    jack_beanstalk: 'str_val',
    aladdin_genie: 'excess',
    cinderella: 'past_midnight',
    pied_piper: 'infinite'
  });

  const currentStory = EXCEPTION_STORIES.find((s) => s.id === activeStoryId) || EXCEPTION_STORIES[0];
  const currentCondition = storyConditions[activeStoryId];

  const handleConditionChange = (newVal) => {
    setStoryConditions((prev) => ({ ...prev, [activeStoryId]: newVal }));
  };

  const handleSelectStory = (storyId) => {
    if (unlockedStories.includes(storyId)) {
      setActiveStoryId(storyId);
      setActiveStage(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoadDebugger = (storyId) => {
    if (!unlockedStories.includes(storyId)) return;
    setActiveStoryId(storyId);
    // The user read the full story in the modal — that completes Stage 1's activity.
    setStageActivityDoneMap(prev => ({
      ...prev,
      [storyId]: {
        ...(prev[storyId] || { 1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false,9:false }),
        1: true
      }
    }));
    setCompletedStagesMap(prev => {
      const current = prev[storyId] || [];
      return { ...prev, [storyId]: current.includes(1) ? current : [...current, 1] };
    });
    setUnlockedStagesMap(prev => {
      const current = prev[storyId] || [1];
      return { ...prev, [storyId]: current.includes(2) ? current : [...current, 2] };
    });
    setActiveStage(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRedirectToNextStoryOnPage1 = () => {
    // Mark stage 9 as completed with a tick before redirecting
    handleActivityDone(9);
    unlockNextStory(activeStoryId);

    const currIdx = EXCEPTION_STORIES.findIndex(s => s.id === activeStoryId);
    const nextStory = EXCEPTION_STORIES[currIdx + 1] || EXCEPTION_STORIES[0];

    // Small delay so the tick renders before resetting to new story
    setTimeout(() => {
      setActiveStoryId(nextStory.id);
      setActiveStage(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  const handleStageChange = (stageId) => {
    if (unlockedStages.includes(stageId)) {
      setActiveStage(stageId);
    }
  };

  const goToNextStage = () => {
    if (activeStage < 8) {
      const next = activeStage + 1;
      setCompletedStagesMap(prev => {
        const current = prev[activeStoryId] || [];
        return {
          ...prev,
          [activeStoryId]: current.includes(activeStage) ? current : [...current, activeStage]
        };
      });
      setUnlockedStagesMap(prev => {
        const current = prev[activeStoryId] || [1];
        return {
          ...prev,
          [activeStoryId]: current.includes(next) ? current : [...current, next]
        };
      });
      setCompletionPopup({ fromStage: activeStage, toStage: next });
    } else {
      // Stage 8 done — unlock the Playground (Stage 9)
      setCompletedStagesMap(prev => {
        const current = prev[activeStoryId] || [];
        return {
          ...prev,
          [activeStoryId]: current.includes(activeStage) ? current : [...current, activeStage]
        };
      });
      setUnlockedStagesMap(prev => {
        const current = prev[activeStoryId] || [1];
        return {
          ...prev,
          [activeStoryId]: current.includes(9) ? current : [...current, 9]
        };
      });
      setCompletionPopup({ fromStage: activeStage, toStage: 9 });
    }
  };

  const confirmNextStage = () => {
    if (completionPopup?.toStage) {
      setActiveStage(completionPopup.toStage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setCompletionPopup(null);
  };

  const goToPrevStage = () => {
    if (activeStage > 1) {
      setActiveStage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const hasError =
    currentCondition === 'wolf'
    || currentCondition === 0
    || currentCondition === 5
    || currentCondition === 'prank'
    || currentCondition === 'real_wolf'
    || currentCondition === 'straw'
    || currentCondition === 'eaten'
    || currentCondition === 'str_val'
    || currentCondition === 'excess'
    || currentCondition === 'past_midnight'
    || currentCondition === 'infinite';

  return (
    <div className="exception-studio-container">
      {/* Top Banner Toolbar - Clean and Simple */}
      <div className="studio-toolbar-banner-clean">
        <div className="story-title-box-clean">
          <h2>PyBe Python Exception Studio</h2>
          <p>Learn Exception Handling (try, except, else, finally, raise) using childhood fairytale analogies.</p>
        </div>
      </div>

      {/* 9-Stage Sequential Stepper Header Bar */}
      <div className="stepper-header-bar">
        <div className="stepper-top-info">
          <span className="stepper-stage-chip">Stage {activeStage} of {STAGES.length}</span>
          <h3 className="stepper-stage-title">{(STAGES[activeStage - 1] || STAGES[0]).title}</h3>
        </div>

        {/* Stepper Chips / Dots */}
        <div className="stepper-nav-chips">
          {STAGES.map((st) => {
            const IconComp = st.icon;
            const isActive = activeStage === st.id;
            const isDone = completedStages.includes(st.id);
            const isUnlocked = unlockedStages.includes(st.id);
            const isLocked = !isUnlocked;
            return (
              <button
                key={st.id}
                className={`stepper-chip ${isActive ? 'active' : isDone ? 'done' : isLocked ? 'locked' : ''}`}
                onClick={() => !isLocked && handleStageChange(st.id)}
                disabled={isLocked}
                title={isLocked ? `Complete Stage ${st.id - 1} to unlock` : st.title}
              >
                <span className="chip-num">{isDone ? '✓' : isLocked ? '🔒' : st.id}</span>
                <IconComp size={14} className="chip-icon" />
                <span className="chip-lbl">{st.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STAGE CONTENT SWITCHER */}
      <div className="stepper-stage-view">
        {activeStage === 1 && (
          <Page1Stories
            stories={EXCEPTION_STORIES}
            activeStory={currentStory}
            onSelectStory={handleSelectStory}
            onLoadDebugger={handleLoadDebugger}
            onActivityDone={() => handleActivityDone(1)}
            completedStories={completedStories}
            unlockedStories={unlockedStories}
          />
        )}

        {activeStage === 2 && (
          <DebuggerSimulator
            story={currentStory}
            currentCondition={currentCondition}
            onConditionChange={handleConditionChange}
            onActivityDone={() => handleActivityDone(2)}
          />
        )}

        {activeStage === 3 && (
          <ExecutionFlowchart
            hasError={hasError}
            story={currentStory}
            onActivityDone={() => handleActivityDone(3)}
          />
        )}

        {activeStage === 4 && (
          <LineByLineGenerator
            story={currentStory}
            onActivityDone={() => handleActivityDone(4)}
          />
        )}

        {activeStage === 5 && (
          <BugHunterGame
            story={currentStory}
            onActivityDone={() => handleActivityDone(5)}
          />
        )}

        {activeStage === 6 && (
          <ConceptFlipCards
            story={currentStory}
            onActivityDone={() => handleActivityDone(6)}
          />
        )}

        {activeStage === 7 && (
          <SentenceOrderingPuzzles
            story={currentStory}
            onActivityDone={() => handleActivityDone(7)}
          />
        )}

        {activeStage === 8 && (
          <AIReasoningSandbox
            story={currentStory}
            onActivityDone={() => handleActivityDone(8)}
          />
        )}

        {activeStage === 9 && (
          <CustomStoryPlayground
            story={currentStory}
            onReturnToStudio={() => setActiveStage(8)}
            onRedirectToPage1={handleRedirectToNextStoryOnPage1}
            onActivityDone={() => handleActivityDone(9)}
          />
        )}
      </div>

      {/* Sequential Stepper Bottom Navigation — hidden on Stage 9 Playground */}
      {activeStage !== 9 && (
        <div className="stepper-bottom-nav">
          <button
            className="stepper-btn prev"
            onClick={goToPrevStage}
            disabled={activeStage === 1}
          >
            <ChevronLeft size={18} /> Previous Stage
          </button>

          <div className="stepper-progress-indicator">
            <span>Stage <strong>{activeStage}</strong> of {STAGES.length}</span>
            <div className="stepper-mini-bar">
              <div className="stepper-mini-fill" style={{ width: `${(activeStage / STAGES.length) * 100}%` }} />
            </div>
          </div>

          <div className="stepper-next-wrap">
            {!stageActivityDone[activeStage] && (
              <span className="stepper-activity-hint">
                ⚠️ Complete this stage's activity first
              </span>
            )}
            <button
              className={`stepper-btn next ${!stageActivityDone[activeStage] ? 'next-locked' : ''}`}
              onClick={goToNextStage}
              disabled={!stageActivityDone[activeStage]}
              title={!stageActivityDone[activeStage] ? 'Complete this stage\'s activity to unlock' : ''}
            >
              {activeStage === 8 ? (
                <span>🎭 Go to Playground!</span>
              ) : (
                <>
                  <span>Complete &amp; Unlock Stage {activeStage + 1}</span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Custom Story Modal Dialog */}
      <CustomStoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Stage Completion Popup */}
      {completionPopup && (
        <div className="stage-completion-backdrop" onClick={() => setCompletionPopup(null)}>
          <div className="stage-completion-popup" onClick={e => e.stopPropagation()}>
            <div className="scp-confetti">{completionPopup.toStage === 9 ? '🏆' : '🎉'}</div>
            <div className="scp-badge">
              {completionPopup.toStage === 9 ? 'All 8 Stages Complete!' : `Stage ${completionPopup.fromStage} Complete!`}
            </div>
            <h3 className="scp-title">
              {completionPopup.toStage === 9
                ? '🎭 Custom Story Playground Unlocked!'
                : `${STAGES[completionPopup.fromStage - 1]?.title} Done!`}
            </h3>
            <p className="scp-desc">
              {completionPopup.toStage === 9
                ? 'You have mastered all 8 stages of the Python Exception Studio! Your Custom Story Generator Playground is now ready. Design your own fairytale scenarios and generate real Python code!'
                : `Great work! You've unlocked Stage ${completionPopup.toStage}: ${STAGES[completionPopup.toStage - 1]?.title}. Ready to continue?`}
            </p>
            <div className="scp-actions">
              <button className="scp-btn-skip" onClick={() => setCompletionPopup(null)}>Stay Here</button>
              {completionPopup.toStage && (
                <button className="scp-btn-next" onClick={confirmNextStage}>
                  {completionPopup.toStage === 9
                    ? '🎭 Open Playground!'
                    : `Go to Stage ${completionPopup.toStage} → ${STAGES[completionPopup.toStage - 1]?.short}`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
