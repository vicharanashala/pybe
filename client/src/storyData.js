// Story-specific data for Bug Hunter, Flip Cards, AI Sandbox, and Playground
// Each story has its own set of content for stages 5, 6, 8, and 9.

export function getStoryBugHunterPuzzles(story) {
  const map = {
    red_hood: [
      {
        id: 'rh1', story: 'Little Red Riding Hood', icon: '🐺',
        scene: 'Red Riding Hood calls guest.bake_pastries() but the guest is a Wolf!',
        bugCode: `try:\n    guest.bake_pastries()\n        # Wolf has no bake_pastries method!\n# ???: ??? as wolf_error:\n#     woodcutter.alert_rescue()`,
        options: [
          { id: 'a', label: 'except AttributeError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except ZeroDivisionError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except IndexError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except FileNotFoundError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    guest.bake_pastries()\nexcept AttributeError as wolf_error:\n    woodcutter.alert_rescue()\n    print("🪓 Woodcutter: RESCUED!")`,
        explanation: '✅ AttributeError fires when an object lacks the called method. Wolf has no .bake_pastries() so we catch AttributeError.'
      },
      {
        id: 'rh2', story: 'Little Red Riding Hood', icon: '🐺',
        scene: 'Red checks if guest has a "howl" attribute — but Grandma does not howl!',
        bugCode: `person = grandma\ntry:\n    person.howl()\n# ???: ???:\n#     print("This person doesn't howl!")`,
        options: [
          { id: 'a', label: 'except AttributeError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except NameError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except ValueError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except TypeError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `person = grandma\ntry:\n    person.howl()\nexcept AttributeError:\n    print("👵 Grandma doesn't howl — safe!")`,
        explanation: '✅ Calling a method that doesn\'t exist on an object raises AttributeError.'
      },
      {
        id: 'rh3', story: 'Little Red Riding Hood', icon: '🐺',
        scene: 'The basket items are listed. Red tries to access basket[10] but only 3 items exist!',
        bugCode: `basket = ["bread", "butter", "wine"]\ntry:\n    item = basket[10]\n# ???: ???:\n#     print("No such item in basket!")`,
        options: [
          { id: 'a', label: 'except IndexError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except KeyError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except AttributeError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except ValueError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `basket = ["bread", "butter", "wine"]\ntry:\n    item = basket[10]\nexcept IndexError:\n    print("🧺 Only 3 items in basket!")`,
        explanation: '✅ IndexError is raised when accessing an index beyond a list\'s length.'
      },
      {
        id: 'rh4', story: 'Little Red Riding Hood', icon: '🐺',
        scene: 'After visiting the cottage, Red must ALWAYS close the door — even if the Wolf attacked!',
        bugCode: `try:\n    enter_cottage()\n    talk_to_guest()\nexcept WolfAttackError:\n    run_away()\n# Door MUST be closed no matter what!\n# ???:\n#     close_door()`,
        options: [
          { id: 'a', label: 'finally:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'else:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'try:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    enter_cottage()\n    talk_to_guest()\nexcept WolfAttackError:\n    run_away()\nfinally:\n    close_door()  # ALWAYS runs!`,
        explanation: '✅ finally: guarantees cleanup code runs regardless of exceptions.'
      },
      {
        id: 'rh5', story: 'Little Red Riding Hood', icon: '🐺',
        scene: 'If guest IS Grandma (no error), Red wants to give her the basket — which block runs ONLY on success?',
        bugCode: `try:\n    guest.bake_pastries()\nexcept AttributeError:\n    woodcutter.alert()\n# ???:\n#     give_basket_to_grandma()`,
        options: [
          { id: 'a', label: 'else:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'finally:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'try:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    guest.bake_pastries()\nexcept AttributeError:\n    woodcutter.alert()\nelse:\n    give_basket_to_grandma()  # Only if no error`,
        explanation: '✅ else: executes only when try: completes without raising any exception.'
      }
    ],

    tortoise_hare: [
      {
        id: 'th1', story: 'Tortoise & Hare', icon: '🐢',
        scene: 'The Hare fell asleep (speed = 0) — dividing distance by speed causes crash!',
        bugCode: `distance = 100\nhare_speed = 0\ntry:\n    time = distance / hare_speed\n# ???: ???:\n#     print("Hare is sleeping!")`,
        options: [
          { id: 'a', label: 'except ZeroDivisionError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except ValueError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except TypeError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except IndexError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `distance = 100\nhare_speed = 0\ntry:\n    time = distance / hare_speed\nexcept ZeroDivisionError:\n    print("🐢 Hare sleeping — ZeroDivisionError!")`,
        explanation: '✅ Division by zero always raises ZeroDivisionError in Python.'
      },
      {
        id: 'th2', story: 'Tortoise & Hare', icon: '🐢',
        scene: 'The race distance is "100" (a string). Adding speed integer to it crashes!',
        bugCode: `race_distance = "100"\nspeed = 10\ntry:\n    total = race_distance + speed\n# ???: ???:\n#     total = int(race_distance) + speed`,
        options: [
          { id: 'a', label: 'except TypeError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except ZeroDivisionError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except ValueError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except AttributeError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `race_distance = "100"\nspeed = 10\ntry:\n    total = race_distance + speed\nexcept TypeError:\n    total = int(race_distance) + speed`,
        explanation: '✅ Adding a string and int raises TypeError — convert types first!'
      },
      {
        id: 'th3', story: 'Tortoise & Hare', icon: '🐢',
        scene: 'If Hare finishes without sleeping, we celebrate — which block runs ONLY on success?',
        bugCode: `try:\n    time = distance / hare_speed\nexcept ZeroDivisionError:\n    print("Sleeping!")\n# ???:\n#     print("Race finished!")`,
        options: [
          { id: 'a', label: 'else:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'finally:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'try:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    time = distance / hare_speed\nexcept ZeroDivisionError:\n    print("Sleeping!")\nelse:\n    print("🏃 Race finished!")`,
        explanation: '✅ else: runs only when try: succeeds with no exceptions.'
      },
      {
        id: 'th4', story: 'Tortoise & Hare', icon: '🐢',
        scene: 'Race log file must be saved regardless of who wins or crashes.',
        bugCode: `try:\n    run_race()\nexcept RaceError:\n    handle_crash()\n# Log MUST be saved!\n# ???:\n#     save_race_log()`,
        options: [
          { id: 'a', label: 'finally:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'else:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except Exception:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'try:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    run_race()\nexcept RaceError:\n    handle_crash()\nfinally:\n    save_race_log()  # ALWAYS runs!`,
        explanation: '✅ finally: always executes — perfect for saving logs or closing resources.'
      },
      {
        id: 'th5', story: 'Tortoise & Hare', icon: '🐢',
        scene: 'We need to wrap the risky division in a safety block. Which keyword starts it?',
        bugCode: `distance = 100\nhare_speed = 0\n# ???:\n#     time = distance / hare_speed\nexcept ZeroDivisionError:\n    print("Caught!")`,
        options: [
          { id: 'a', label: 'try:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'else:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'finally:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `distance = 100\nhare_speed = 0\ntry:\n    time = distance / hare_speed\nexcept ZeroDivisionError:\n    print("Caught!")`,
        explanation: '✅ try: wraps risky operations that might throw exceptions.'
      }
    ],

    goldilocks: [
      {
        id: 'gl1', story: 'Goldilocks & Three Bears', icon: '🥣',
        scene: 'Goldilocks picks porridge index 5, but the bowl list only has 3 items!',
        bugCode: `porridge = ["Hot","Cold","Just Right"]\nindex = 5\ntry:\n    choice = porridge[index]\n# ???: ???:\n#     print("That bowl doesn't exist!")`,
        options: [
          { id: 'a', label: 'except IndexError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except AttributeError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except TypeError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except OverflowError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `porridge = ["Hot","Cold","Just Right"]\nindex = 5\ntry:\n    choice = porridge[index]\nexcept IndexError:\n    print("🐻 That bowl doesn't exist!")`,
        explanation: '✅ IndexError fires when you access a list index outside its length.'
      },
      {
        id: 'gl2', story: 'Goldilocks & Three Bears', icon: '🥣',
        scene: 'Goldilocks looks for "goldilocks" key in bear_beds dict — but it doesn\'t exist!',
        bugCode: `bear_beds = {"papa": "big", "mama": "medium", "baby": "small"}\ntry:\n    bed = bear_beds["goldilocks"]\n# ???: ???:\n#     print("Not a bear bed owner!")`,
        options: [
          { id: 'a', label: 'except KeyError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except IndexError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except NameError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except ValueError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `bear_beds = {"papa": "big", "mama": "medium", "baby": "small"}\ntry:\n    bed = bear_beds["goldilocks"]\nexcept KeyError:\n    print("🛏️ Not a bear bed owner!")`,
        explanation: '✅ KeyError is raised when accessing a dictionary key that doesn\'t exist.'
      },
      {
        id: 'gl3', story: 'Goldilocks & Three Bears', icon: '🥣',
        scene: 'Before leaving, Goldilocks must ALWAYS close the cottage door — crash or not!',
        bugCode: `try:\n    taste_porridge()\n    sit_in_chair()\nexcept BearReturnError:\n    run_away()\n# Door MUST be closed!\n# ???:\n#     close_cottage_door()`,
        options: [
          { id: 'a', label: 'finally:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'else:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'try:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    taste_porridge()\n    sit_in_chair()\nexcept BearReturnError:\n    run_away()\nfinally:\n    close_cottage_door()  # ALWAYS runs!`,
        explanation: '✅ finally: guarantees cleanup regardless of what happened.'
      },
      {
        id: 'gl4', story: 'Goldilocks & Three Bears', icon: '🥣',
        scene: 'Temperature is "hot" (string). Comparing it with > 50 (int) crashes!',
        bugCode: `temp = "hot"\ntry:\n    if temp > 50:\n        print("Too hot!")\n# ???: ???:\n#     print("Can't compare string to int!")`,
        options: [
          { id: 'a', label: 'except TypeError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except ValueError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except IndexError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except KeyError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `temp = "hot"\ntry:\n    if temp > 50:\n        print("Too hot!")\nexcept TypeError:\n    print("🥣 Can't compare string to int!")`,
        explanation: '✅ Comparing incompatible types (str > int) raises TypeError.'
      },
      {
        id: 'gl5', story: 'Goldilocks & Three Bears', icon: '🥣',
        scene: 'If porridge is "Just Right" (no error), Goldilocks eats it happily!',
        bugCode: `try:\n    bowl = porridge[baby_index]\nexcept IndexError:\n    print("No bowl!")\n# ???:\n#     eat_porridge(bowl)`,
        options: [
          { id: 'a', label: 'else:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'finally:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'try:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    bowl = porridge[baby_index]\nexcept IndexError:\n    print("No bowl!")\nelse:\n    eat_porridge(bowl)  # Only if no error`,
        explanation: '✅ else: runs only when the try: block succeeds without any exception.'
      }
    ],

    cried_wolf: [
      {
        id: 'cw1', story: 'Boy Who Cried Wolf', icon: '📯',
        scene: 'The boy deliberately triggers a false alarm. Which keyword THROWS an exception?',
        bugCode: `if alarm == "prank":\n    # ???  ValueError("False Alarm!")\n# We need to trigger the error intentionally`,
        options: [
          { id: 'a', label: 'raise', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'try', correct: false, color: 'opt-green' },
          { id: 'd', label: 'catch', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `if alarm == "prank":\n    raise ValueError("False Alarm!")\nprint("🤡 Prank alarm raised!")`,
        explanation: '✅ raise deliberately throws an exception — like sounding a false alarm!'
      },
      {
        id: 'cw2', story: 'Boy Who Cried Wolf', icon: '📯',
        scene: 'A real wolf appears! We need a custom exception class. How do you define one?',
        bugCode: `# ???  WolfAlarmError(Exception):\n#     pass\n# Then raise WolfAlarmError("REAL WOLF!")`,
        options: [
          { id: 'a', label: 'class', correct: true, color: 'opt-red' },
          { id: 'b', label: 'def', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'raise', correct: false, color: 'opt-green' },
          { id: 'd', label: 'import', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `class WolfAlarmError(Exception):\n    pass\n\nraise WolfAlarmError("🐺 REAL WOLF!")`,
        explanation: '✅ Custom exceptions are defined as classes inheriting from Exception.'
      },
      {
        id: 'cw3', story: 'Boy Who Cried Wolf', icon: '📯',
        scene: 'Villagers catch the boy\'s prank ValueError and the real WolfAlarmError separately.',
        bugCode: `try:\n    check_alarm()\nexcept ValueError:\n    print("Prank!")\n# ???: ??? as e:\n#     assemble_villagers()`,
        options: [
          { id: 'a', label: 'except WolfAlarmError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'finally WolfAlarmError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'else WolfAlarmError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'try WolfAlarmError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    check_alarm()\nexcept ValueError:\n    print("Prank!")\nexcept WolfAlarmError as e:\n    assemble_villagers()`,
        explanation: '✅ You can chain multiple except blocks for different error types.'
      },
      {
        id: 'cw4', story: 'Boy Who Cried Wolf', icon: '📯',
        scene: 'After checking the alarm, the village bell must ALWAYS be reset.',
        bugCode: `try:\n    sound_alarm()\nexcept WolfAlarmError:\n    run_to_hills()\n# Bell MUST reset!\n# ???:\n#     reset_village_bell()`,
        options: [
          { id: 'a', label: 'finally:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'else:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'raise:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    sound_alarm()\nexcept WolfAlarmError:\n    run_to_hills()\nfinally:\n    reset_village_bell()  # ALWAYS runs!`,
        explanation: '✅ finally: ensures cleanup code runs no matter what.'
      },
      {
        id: 'cw5', story: 'Boy Who Cried Wolf', icon: '📯',
        scene: 'If the alarm check passes (no wolf), the sheep graze peacefully. Which block?',
        bugCode: `try:\n    check_field()\nexcept WolfAlarmError:\n    evacuate()\n# ???:\n#     sheep.graze_peacefully()`,
        options: [
          { id: 'a', label: 'else:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'finally:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'try:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    check_field()\nexcept WolfAlarmError:\n    evacuate()\nelse:\n    sheep.graze_peacefully()`,
        explanation: '✅ else: runs only when try: succeeds without raising any exception.'
      }
    ],

    three_pigs: [
      {
        id: 'tp1', story: 'Three Little Pigs', icon: '🐷',
        scene: 'After building (success or failure), pigs must ALWAYS lock the construction site.',
        bugCode: `try:\n    build_house(material)\nexcept HuffError:\n    call_for_help()\n# Site lock MUST run!\n# ???:\n#     lock_site()`,
        options: [
          { id: 'a', label: 'finally:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'else:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except Exception:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'try:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    build_house(material)\nexcept HuffError:\n    call_for_help()\nfinally:\n    lock_site()  # ALWAYS runs!`,
        explanation: '✅ finally: ALWAYS executes — whether or not an exception was raised.'
      },
      {
        id: 'tp2', story: 'Three Little Pigs', icon: '🐷',
        scene: 'The Wolf blows the straw house down. We need to deliberately crash the build!',
        bugCode: `if material == "straw":\n    # ???  Exception("House blown down!")\n# Deliberately trigger collapse`,
        options: [
          { id: 'a', label: 'raise', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'try', correct: false, color: 'opt-green' },
          { id: 'd', label: 'finally', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `if material == "straw":\n    raise Exception("💨 House blown down!")\nprint("Wolf huffed and puffed!")`,
        explanation: '✅ raise deliberately triggers an exception — like the Wolf blowing the house down!'
      },
      {
        id: 'tp3', story: 'Three Little Pigs', icon: '🐷',
        scene: 'When the house collapses, we catch the Exception to evacuate safely.',
        bugCode: `try:\n    build_house("straw")\n    # Wolf huffs!\n# ???: ??? as e:\n#     evacuate_pigs()`,
        options: [
          { id: 'a', label: 'except Exception', correct: true, color: 'opt-red' },
          { id: 'b', label: 'finally Exception', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'else Exception', correct: false, color: 'opt-green' },
          { id: 'd', label: 'raise Exception', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    build_house("straw")\nexcept Exception as e:\n    evacuate_pigs()\n    print(f"🏠 Collapse: {e}")`,
        explanation: '✅ except Exception catches any exception thrown inside try: block.'
      },
      {
        id: 'tp4', story: 'Three Little Pigs', icon: '🐷',
        scene: 'If brick house stands firm (no error), pigs celebrate! Which block runs on success?',
        bugCode: `try:\n    build_house("brick")\nexcept HuffError:\n    evacuate()\n# ???:\n#     celebrate_victory()`,
        options: [
          { id: 'a', label: 'else:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'finally:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'try:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    build_house("brick")\nexcept HuffError:\n    evacuate()\nelse:\n    celebrate_victory()  # Only if no error!`,
        explanation: '✅ else: runs only when try: completes with zero exceptions.'
      },
      {
        id: 'tp5', story: 'Three Little Pigs', icon: '🐷',
        scene: 'We need to wrap the risky house building in a safety block first.',
        bugCode: `material = "straw"\n# ???:\n#     build_house(material)\nexcept Exception:\n    print("Collapsed!")`,
        options: [
          { id: 'a', label: 'try:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'else:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'finally:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'raise:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `material = "straw"\ntry:\n    build_house(material)\nexcept Exception:\n    print("🐷 Collapsed!")`,
        explanation: '✅ try: wraps risky code that might raise exceptions.'
      }
    ],

    hansel_gretel: [
      {
        id: 'hg1', story: 'Hansel & Gretel', icon: '🍞',
        scene: 'Hansel and Gretel open the breadcrumbs file — but birds ate it!',
        bugCode: `try:\n    with open("breadcrumbs.txt") as f:\n        path = f.read()\n# ???: ???:\n#     path = compass.navigate()`,
        options: [
          { id: 'a', label: 'except FileNotFoundError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except IOError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except NameError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except OSError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    with open("breadcrumbs.txt") as f:\n        path = f.read()\nexcept FileNotFoundError:\n    path = compass.navigate()`,
        explanation: '✅ FileNotFoundError is raised when open() can\'t find the file.'
      },
      {
        id: 'hg2', story: 'Hansel & Gretel', icon: '🍞',
        scene: 'If the trail file exists (no error), they follow it home safely!',
        bugCode: `try:\n    with open("trail.txt") as f:\n        path = f.read()\nexcept FileNotFoundError:\n    use_compass()\n# ???:\n#     follow_trail_home(path)`,
        options: [
          { id: 'a', label: 'else:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'finally:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'try:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    with open("trail.txt") as f:\n        path = f.read()\nexcept FileNotFoundError:\n    use_compass()\nelse:\n    follow_trail_home(path)`,
        explanation: '✅ else: runs only when the try: block succeeds without errors.'
      },
      {
        id: 'hg3', story: 'Hansel & Gretel', icon: '🍞',
        scene: 'After navigation attempt, the compass sensor MUST always be turned off.',
        bugCode: `try:\n    read_trail()\nexcept FileNotFoundError:\n    use_compass()\n# Sensor MUST turn off!\n# ???:\n#     compass.shutdown()`,
        options: [
          { id: 'a', label: 'finally:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'else:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'try:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    read_trail()\nexcept FileNotFoundError:\n    use_compass()\nfinally:\n    compass.shutdown()  # ALWAYS runs!`,
        explanation: '✅ finally: guarantees cleanup — always shuts down resources.'
      },
      {
        id: 'hg4', story: 'Hansel & Gretel', icon: '🍞',
        scene: 'The candy house witch stores trap configs in a dict. Key "escape" doesn\'t exist!',
        bugCode: `traps = {"cage": True, "oven": True}\ntry:\n    escape_route = traps["escape"]\n# ???: ???:\n#     print("No escape route found!")`,
        options: [
          { id: 'a', label: 'except KeyError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except IndexError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except FileNotFoundError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except AttributeError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `traps = {"cage": True, "oven": True}\ntry:\n    escape_route = traps["escape"]\nexcept KeyError:\n    print("🍬 No escape route! Push witch into oven!")`,
        explanation: '✅ KeyError fires when accessing a missing dictionary key.'
      },
      {
        id: 'hg5', story: 'Hansel & Gretel', icon: '🍞',
        scene: 'To begin safely navigating the forest, which keyword starts the safety block?',
        bugCode: `# ???:\n#     open("trail.txt")\nexcept FileNotFoundError:\n    print("Trail missing!")`,
        options: [
          { id: 'a', label: 'try:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'else:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'finally:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    open("trail.txt")\nexcept FileNotFoundError:\n    print("🍞 Trail missing!")`,
        explanation: '✅ try: always comes first — it wraps the risky operation.'
      }
    ],

    jack_beanstalk: [
      {
        id: 'jb1', story: 'Jack & The Beanstalk', icon: '🫘',
        scene: 'magic_beans is "5" (string). Adding 3 (int) to it crashes!',
        bugCode: `magic_beans = "5"\ntry:\n    total = magic_beans + 3\n# ???: ???:\n#     total = int(magic_beans) + 3`,
        options: [
          { id: 'a', label: 'except TypeError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except ValueError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except KeyError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except AttributeError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `magic_beans = "5"\ntry:\n    total = magic_beans + 3\nexcept TypeError:\n    total = int(magic_beans) + 3`,
        explanation: '✅ Adding a string and integer raises TypeError — convert first!'
      },
      {
        id: 'jb2', story: 'Jack & The Beanstalk', icon: '🫘',
        scene: 'Converting "golden_egg" to int crashes — it\'s not a number!',
        bugCode: `egg = "golden_egg"\ntry:\n    count = int(egg)\n# ???: ???:\n#     count = 1  # default`,
        options: [
          { id: 'a', label: 'except ValueError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except TypeError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except IndexError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except KeyError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `egg = "golden_egg"\ntry:\n    count = int(egg)\nexcept ValueError:\n    count = 1  # default golden egg count`,
        explanation: '✅ ValueError fires when int() can\'t convert a non-numeric string.'
      },
      {
        id: 'jb3', story: 'Jack & The Beanstalk', icon: '🫘',
        scene: 'Jack climbs the beanstalk. If he reaches the top (no error), he grabs the golden harp!',
        bugCode: `try:\n    climb_beanstalk()\nexcept FallError:\n    use_safety_net()\n# ???:\n#     grab_golden_harp()`,
        options: [
          { id: 'a', label: 'else:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'finally:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'try:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    climb_beanstalk()\nexcept FallError:\n    use_safety_net()\nelse:\n    grab_golden_harp()  # Only on success!`,
        explanation: '✅ else: executes only after try: completes without any exception.'
      },
      {
        id: 'jb4', story: 'Jack & The Beanstalk', icon: '🫘',
        scene: 'After climbing (up or down, crash or not), the beanstalk must always be chopped down.',
        bugCode: `try:\n    climb_up()\n    steal_treasure()\nexcept GiantError:\n    slide_down()\n# Beanstalk MUST be cut!\n# ???:\n#     chop_beanstalk()`,
        options: [
          { id: 'a', label: 'finally:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'else:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'raise:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    climb_up()\n    steal_treasure()\nexcept GiantError:\n    slide_down()\nfinally:\n    chop_beanstalk()  # ALWAYS runs!`,
        explanation: '✅ finally: guarantees cleanup — the beanstalk always gets chopped!'
      },
      {
        id: 'jb5', story: 'Jack & The Beanstalk', icon: '🫘',
        scene: 'The giant spots Jack! We need to deliberately raise an alarm error.',
        bugCode: `if giant.is_awake:\n    # ???  GiantError("FEE-FI-FO-FUM!")\n# Deliberately trigger danger`,
        options: [
          { id: 'a', label: 'raise', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'try', correct: false, color: 'opt-green' },
          { id: 'd', label: 'catch', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `if giant.is_awake:\n    raise GiantError("FEE-FI-FO-FUM!")\nprint("🫘 Giant danger raised!")`,
        explanation: '✅ raise explicitly throws an exception — like a danger alarm!'
      }
    ],

    aladdin_genie: [
      {
        id: 'ag1', story: 'Aladdin & The Genie', icon: '🧞',
        scene: 'Aladdin requests 5 wishes — exceeding the Genie\'s limit of 3!',
        bugCode: `wishes = 5\ntry:\n    if wishes > 3:\n        raise PermissionError("Max 3!")\n# ???: ??? as e:\n#     print(f"Denied: {e}")`,
        options: [
          { id: 'a', label: 'except PermissionError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except ValueError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except TypeError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except IndexError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `wishes = 5\ntry:\n    if wishes > 3:\n        raise PermissionError("Max 3!")\nexcept PermissionError as e:\n    print(f"🧞 Denied: {e}")`,
        explanation: '✅ PermissionError catches access violations — like exceeding wish limits!'
      },
      {
        id: 'ag2', story: 'Aladdin & The Genie', icon: '🧞',
        scene: 'Aladdin wants to raise a PermissionError when wishes exceed the limit.',
        bugCode: `if requested_wishes > 3:\n    # ???  PermissionError("Cosmic Law!")\n# Deliberately trigger`,
        options: [
          { id: 'a', label: 'raise', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'try', correct: false, color: 'opt-green' },
          { id: 'd', label: 'finally', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `if requested_wishes > 3:\n    raise PermissionError("🧞 Cosmic Law!")\nprint("Wish limit enforced!")`,
        explanation: '✅ raise explicitly triggers an exception to enforce rules.'
      },
      {
        id: 'ag3', story: 'Aladdin & The Genie', icon: '🧞',
        scene: 'If wishes are valid (no error), the Genie grants them happily!',
        bugCode: `try:\n    validate_wishes(count)\nexcept PermissionError:\n    deny_wish()\n# ???:\n#     grant_all_wishes()`,
        options: [
          { id: 'a', label: 'else:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'finally:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'try:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    validate_wishes(count)\nexcept PermissionError:\n    deny_wish()\nelse:\n    grant_all_wishes()  # Only if valid!`,
        explanation: '✅ else: runs only when try: succeeds without raising any exception.'
      },
      {
        id: 'ag4', story: 'Aladdin & The Genie', icon: '🧞',
        scene: 'After any wish attempt, the magic lamp MUST always be sealed shut.',
        bugCode: `try:\n    rub_lamp()\n    make_wish()\nexcept PermissionError:\n    deny_wish()\n# Lamp MUST seal!\n# ???:\n#     lamp.seal()`,
        options: [
          { id: 'a', label: 'finally:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'else:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'raise:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    rub_lamp()\n    make_wish()\nexcept PermissionError:\n    deny_wish()\nfinally:\n    lamp.seal()  # ALWAYS runs!`,
        explanation: '✅ finally: guarantees the lamp is sealed regardless of what happened.'
      },
      {
        id: 'ag5', story: 'Aladdin & The Genie', icon: '🧞',
        scene: 'We need to begin wrapping the risky wish request. Which keyword starts it?',
        bugCode: `# ???:\n#     rub_lamp()\n#     make_wish()\nexcept PermissionError:\n    print("Denied!")`,
        options: [
          { id: 'a', label: 'try:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'else:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'finally:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    rub_lamp()\n    make_wish()\nexcept PermissionError:\n    print("🧞 Denied!")`,
        explanation: '✅ try: always starts first to wrap the risky operation.'
      }
    ],

    cinderella: [
      {
        id: 'ci1', story: 'Cinderella', icon: '👠',
        scene: 'Clock strikes midnight and time runs out — we need to catch the timeout!',
        bugCode: `try:\n    if time_remaining <= 0:\n        raise TimeoutError("Midnight!")\n# ???: ??? as e:\n#     escape_to_carriage()`,
        options: [
          { id: 'a', label: 'except TimeoutError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except ValueError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except PermissionError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except IndexError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    if time_remaining <= 0:\n        raise TimeoutError("Midnight!")\nexcept TimeoutError as e:\n    escape_to_carriage()`,
        explanation: '✅ TimeoutError catches timer expiration — like the midnight deadline!'
      },
      {
        id: 'ci2', story: 'Cinderella', icon: '👠',
        scene: 'The fairy godmother deliberately triggers midnight timeout!',
        bugCode: `if time_remaining <= 0:\n    # ???  TimeoutError("Spell expired!")\n# Deliberately trigger timeout`,
        options: [
          { id: 'a', label: 'raise', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'try', correct: false, color: 'opt-green' },
          { id: 'd', label: 'catch', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `if time_remaining <= 0:\n    raise TimeoutError("👠 Spell expired!")\nprint("Midnight triggered!")`,
        explanation: '✅ raise deliberately throws an exception to signal timeout.'
      },
      {
        id: 'ci3', story: 'Cinderella', icon: '👠',
        scene: 'If Cinderella makes it before midnight (no error), she dances with the Prince!',
        bugCode: `try:\n    check_time()\nexcept TimeoutError:\n    flee_ball()\n# ???:\n#     dance_with_prince()`,
        options: [
          { id: 'a', label: 'else:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'finally:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'try:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    check_time()\nexcept TimeoutError:\n    flee_ball()\nelse:\n    dance_with_prince()  # Only if no timeout!`,
        explanation: '✅ else: runs only when try: completes without any exception.'
      },
      {
        id: 'ci4', story: 'Cinderella', icon: '👠',
        scene: 'After the ball, the glass slipper MUST always be left at the stairs.',
        bugCode: `try:\n    attend_ball()\nexcept TimeoutError:\n    flee()\n# Slipper MUST be left!\n# ???:\n#     leave_glass_slipper()`,
        options: [
          { id: 'a', label: 'finally:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'else:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'raise:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    attend_ball()\nexcept TimeoutError:\n    flee()\nfinally:\n    leave_glass_slipper()  # ALWAYS runs!`,
        explanation: '✅ finally: guarantees the slipper is left — cleanup always runs!'
      },
      {
        id: 'ci5', story: 'Cinderella', icon: '👠',
        scene: 'Which keyword starts the safety block to wrap the risky ball attendance?',
        bugCode: `# ???:\n#     attend_ball()\n#     dance()\nexcept TimeoutError:\n    print("Midnight!")`,
        options: [
          { id: 'a', label: 'try:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'else:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'finally:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    attend_ball()\n    dance()\nexcept TimeoutError:\n    print("👠 Midnight!")`,
        explanation: '✅ try: wraps the risky code that might raise exceptions.'
      }
    ],

    pied_piper: [
      {
        id: 'pp1', story: 'Pied Piper', icon: '🪈',
        scene: 'Pied Piper tries allocating memory for 10^12 rats — system runs out!',
        bugCode: `try:\n    rats = [0] * (10**12)\n# ???: ???:\n#     process_batches(100)`,
        options: [
          { id: 'a', label: 'except MemoryError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except IndexError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except TypeError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except ValueError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    rats = [0] * (10**12)\nexcept MemoryError:\n    process_batches(100)\n    print("🪈 Batch processing activated!")`,
        explanation: '✅ MemoryError fires when the system can\'t allocate the requested memory.'
      },
      {
        id: 'pp2', story: 'Pied Piper', icon: '🪈',
        scene: 'Computing 2**100000000 causes an OverflowError!',
        bugCode: `import math\ntry:\n    result = math.exp(1000)\n# ???: ???:\n#     result = float("inf")`,
        options: [
          { id: 'a', label: 'except OverflowError', correct: true, color: 'opt-red' },
          { id: 'b', label: 'except MemoryError', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except ZeroDivisionError', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except ValueError', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `import math\ntry:\n    result = math.exp(1000)\nexcept OverflowError:\n    result = float("inf")\n    print("🪈 Overflow handled!")`,
        explanation: '✅ OverflowError fires when a computation exceeds numeric limits.'
      },
      {
        id: 'pp3', story: 'Pied Piper', icon: '🪈',
        scene: 'If batch processing succeeds (no memory error), the Piper leads all rats out!',
        bugCode: `try:\n    process_all_rats()\nexcept MemoryError:\n    use_batches()\n# ???:\n#     lead_rats_out()`,
        options: [
          { id: 'a', label: 'else:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'finally:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'try:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    process_all_rats()\nexcept MemoryError:\n    use_batches()\nelse:\n    lead_rats_out()  # Only if no error!`,
        explanation: '✅ else: runs only when try: succeeds without raising any exception.'
      },
      {
        id: 'pp4', story: 'Pied Piper', icon: '🪈',
        scene: 'After leading rats (crash or not), the Piper must ALWAYS collect his payment.',
        bugCode: `try:\n    lead_rats()\nexcept MemoryError:\n    batch_lead()\n# Payment MUST be collected!\n# ???:\n#     collect_payment()`,
        options: [
          { id: 'a', label: 'finally:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'else:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'except:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'raise:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    lead_rats()\nexcept MemoryError:\n    batch_lead()\nfinally:\n    collect_payment()  # ALWAYS runs!`,
        explanation: '✅ finally: guarantees cleanup — payment is always collected!'
      },
      {
        id: 'pp5', story: 'Pied Piper', icon: '🪈',
        scene: 'Which keyword wraps the risky memory allocation attempt?',
        bugCode: `# ???:\n#     rats = [0] * (10**12)\nexcept MemoryError:\n    print("Out of memory!")`,
        options: [
          { id: 'a', label: 'try:', correct: true, color: 'opt-red' },
          { id: 'b', label: 'else:', correct: false, color: 'opt-blue' },
          { id: 'c', label: 'finally:', correct: false, color: 'opt-green' },
          { id: 'd', label: 'except:', correct: false, color: 'opt-purple' },
        ],
        fixedCode: `try:\n    rats = [0] * (10**12)\nexcept MemoryError:\n    print("🪈 Out of memory!")`,
        explanation: '✅ try: wraps risky code that might raise exceptions.'
      }
    ]
  };

  return map[story.id] || map['red_hood'];
}


export function getStoryFlipCards(story) {
  const base = [
    {
      id: 'try', keyword: 'try:', badge: 'ACTION ATTEMPT', frontIcon: '🛡️', colorVar: 'try',
      backNote: 'The try: block contains code that might throw an exception. If no error occurs, it completes normally.'
    },
    {
      id: 'except', keyword: 'except:', badge: 'SAFETY NET', frontIcon: '🚨', colorVar: 'except',
      backNote: 'except: runs ONLY when the try: block throws the specified error type. You can chain multiple except blocks.'
    },
    {
      id: 'else', keyword: 'else:', badge: 'SUCCESS PATH', frontIcon: '✨', colorVar: 'else',
      backNote: 'else: runs only when try: succeeds. Great for code that should run after a successful try.'
    },
    {
      id: 'finally', keyword: 'finally:', badge: 'GUARANTEED CLEANUP', frontIcon: '🔒', colorVar: 'finally',
      backNote: 'finally: is guaranteed to run — even if an unhandled exception occurs or a return statement is hit.'
    },
    {
      id: 'raise', keyword: 'raise', badge: 'SOUND THE ALARM', frontIcon: '📯', colorVar: 'raise',
      backNote: 'raise manually throws an exception — either a built-in one or your own custom Exception subclass.'
    }
  ];

  const storyCards = {
    red_hood: [
      { ...base[0], storyTitle: `${story.icon} Knocking on Grandma's door`, storyText: `${story.character} knocks without knowing if Grandma or the Wolf is inside. Wrap risky code in try: — the same way you attempt an action with hidden danger.`, codeSnippet: `try:\n    guest = cottage.get_guest()\n    guest.bake_pastries()` },
      { ...base[1], storyTitle: `🪓 The Woodcutter's rescue`, storyText: `When the Wolf is revealed (${story.errorType}), the Woodcutter rushes in. except: catches the specific error and handles it before the program crashes.`, codeSnippet: `except AttributeError as e:\n    print(f"Error: {e}")\n    woodcutter.alert_rescue()` },
      { ...base[2], storyTitle: `👵 Grandma bakes safely`, storyText: `When the guest IS Grandma (no error), Red delivers the basket. else: runs only when try: completed without any exceptions.`, codeSnippet: `else:\n    print("Safe! It's Grandma!")\n    deliver_basket()` },
      { ...base[3], storyTitle: `🔒 Always close the door`, storyText: `Whether the Wolf attacks or Grandma welcomes Red, the cottage door MUST always be closed. finally: runs in BOTH cases.`, codeSnippet: `finally:\n    cottage.close_door()\n    print("🔒 Door secured!")` },
      { ...base[4], storyTitle: `📯 Raising the Wolf alarm`, storyText: `When the Woodcutter spots the Wolf, he deliberately sounds the alarm. raise is exactly that — deliberately trigger an exception when danger is real.`, codeSnippet: `if guest == "wolf":\n    raise WolfAlertError("WOLF!")` },
    ],
    tortoise_hare: [
      { ...base[0], storyTitle: `${story.icon} Starting the race`, storyText: `The Hare attempts to run the race at full speed. try: wraps the risky speed calculation that might fail if speed is zero.`, codeSnippet: `try:\n    time = distance / hare_speed` },
      { ...base[1], storyTitle: `💤 Catching the sleeping hare`, storyText: `When Hare's speed is 0, division crashes with ${story.errorType}. except: catches this specific error before the program crashes.`, codeSnippet: `except ZeroDivisionError:\n    print("Hare is sleeping!")\n    time = 999` },
      { ...base[2], storyTitle: `🏃 Clean finish celebration`, storyText: `When Hare runs at full speed (no ZeroDivisionError), else: celebrates the clean race finish. It only runs when try: completed without exceptions.`, codeSnippet: `else:\n    print(f"Finished in {time}s!")` },
      { ...base[3], storyTitle: `📋 Always log race results`, storyText: `Whether the Hare sleeps or runs, race results MUST always be logged. finally: runs in BOTH cases — guaranteed cleanup.`, codeSnippet: `finally:\n    save_race_log()\n    print("📋 Log saved!")` },
      { ...base[4], storyTitle: `⚡ Deliberately stopping the race`, storyText: `If cheating is detected, the referee deliberately halts the race by raising an error. raise is intentional exception triggering.`, codeSnippet: `if cheating_detected:\n    raise RaceViolationError("Cheat!")` },
    ],
    goldilocks: [
      { ...base[0], storyTitle: `${story.icon} Tasting the porridge`, storyText: `Goldilocks reaches for a porridge bowl at an index that might not exist. try: wraps the risky array access.`, codeSnippet: `try:\n    choice = porridge_bowls[index]` },
      { ...base[1], storyTitle: `💥 Out-of-bounds bowl catch`, storyText: `When index 5 is used on a 3-item list, ${story.errorType} fires. except: catches this before the program crashes.`, codeSnippet: `except IndexError:\n    print("Bowl doesn't exist!")\nexcept KeyError:\n    print("Not a bear!")` },
      { ...base[2], storyTitle: `✨ Just Right success`, storyText: `When Goldilocks picks a valid bowl (no error), else: lets her eat happily. It only runs when try: completed without exceptions.`, codeSnippet: `else:\n    eat_porridge(choice)\n    print("Just right!")` },
      { ...base[3], storyTitle: `🚪 Always close the cottage`, storyText: `Whether Bears return or not, Goldilocks MUST close the cottage door. finally: guarantees this cleanup runs.`, codeSnippet: `finally:\n    close_cottage_door()\n    print("🚪 Door closed!")` },
      { ...base[4], storyTitle: `🐻 Bears raise the intruder alarm`, storyText: `When Bears discover the intruder, they deliberately raise an alert. raise triggers an exception on purpose.`, codeSnippet: `if intruder_found:\n    raise IntruderError("WHO?!")` },
    ],
    cried_wolf: [
      { ...base[0], storyTitle: `${story.icon} Checking the alarm`, storyText: `The villagers try to check if the alarm is real. try: wraps the risky alarm inspection code.`, codeSnippet: `try:\n    check_alarm_signal()` },
      { ...base[1], storyTitle: `🤡 Catching prank alarms`, storyText: `When the boy cries false alarms, ValueError is raised. except: catches and handles the prank before chaos.`, codeSnippet: `except ValueError:\n    print("Prank alarm!")\nexcept WolfAlarmError:\n    assemble_villagers()` },
      { ...base[2], storyTitle: `🐑 Sheep graze peacefully`, storyText: `When the alarm check passes (no wolf), else: lets the sheep graze. It only runs when try: completed without exceptions.`, codeSnippet: `else:\n    sheep.graze_peacefully()\n    print("All clear!")` },
      { ...base[3], storyTitle: `🔔 Always reset the bell`, storyText: `Whether prank or real wolf, the village bell MUST always be reset. finally: guarantees this happens.`, codeSnippet: `finally:\n    reset_village_bell()\n    print("🔔 Bell reset!")` },
      { ...base[4], storyTitle: `📯 Deliberately sounding the alarm`, storyText: `The shepherd boy deliberately raises false alarms with raise. This keyword intentionally triggers exceptions.`, codeSnippet: `if alarm == "prank":\n    raise ValueError("False!")\nif alarm == "real_wolf":\n    raise WolfAlarmError("WOLF!")` },
    ],
    three_pigs: [
      { ...base[0], storyTitle: `${story.icon} Building the house`, storyText: `The pigs try building a house with chosen material. try: wraps this risky construction that might fail.`, codeSnippet: `try:\n    build_house(material)` },
      { ...base[1], storyTitle: `💨 Catching the collapse`, storyText: `When straw house is huffed down, Exception is raised. except: catches the collapse and triggers evacuation.`, codeSnippet: `except Exception as e:\n    print(f"Collapsed: {e}")\n    evacuate_pigs()` },
      { ...base[2], storyTitle: `🧱 Brick victory celebration`, storyText: `When brick house stands firm (no error), else: celebrates! It only runs when try: completed without exceptions.`, codeSnippet: `else:\n    celebrate_victory()\n    print("Brick stands!")` },
      { ...base[3], storyTitle: `🔒 Always lock the site`, storyText: `Whether house collapses or stands, construction tools MUST always be locked. finally: guarantees cleanup runs.`, codeSnippet: `finally:\n    lock_site()\n    cleanup_tools()\n    print("🔒 Site secured!")` },
      { ...base[4], storyTitle: `💨 Wolf deliberately blows`, storyText: `The Wolf deliberately blows the straw house down — like raise, it intentionally triggers the collapse exception.`, codeSnippet: `if material == "straw":\n    raise HuffError("Blown down!")` },
    ],
    hansel_gretel: [
      { ...base[0], storyTitle: `${story.icon} Opening the trail file`, storyText: `Hansel & Gretel try to open the breadcrumb trail file. try: wraps this risky file access.`, codeSnippet: `try:\n    f = open("breadcrumbs.txt")\n    path = f.read()` },
      { ...base[1], storyTitle: `🐦 Birds ate the breadcrumbs`, storyText: `When the file is missing (birds ate it), ${story.errorType} fires. except: catches and switches to compass.`, codeSnippet: `except FileNotFoundError:\n    print("Birds ate trail!")\n    path = compass.navigate()` },
      { ...base[2], storyTitle: `🏠 Following the trail home`, storyText: `When the trail file exists (no error), else: follows it home. It only runs when try: completed without exceptions.`, codeSnippet: `else:\n    follow_trail_home(path)\n    print("Home safe!")` },
      { ...base[3], storyTitle: `🧭 Always shutdown compass`, storyText: `Whether trail exists or not, the compass sensor MUST always shut down. finally: guarantees cleanup.`, codeSnippet: `finally:\n    compass.shutdown()\n    print("🧭 Compass off!")` },
      { ...base[4], storyTitle: `🍬 Witch raises the trap`, storyText: `The Witch deliberately triggers her trap when children enter. raise intentionally throws an exception.`, codeSnippet: `if children_entered:\n    raise TrapError("CAUGHT!")` },
    ],
    jack_beanstalk: [
      { ...base[0], storyTitle: `${story.icon} Adding magic potions`, storyText: `Jack tries adding magic potions to his bean count. try: wraps this risky type operation.`, codeSnippet: `try:\n    total = magic_beans + 3` },
      { ...base[1], storyTitle: `💥 Type mismatch crash`, storyText: `When beans is "5" (string) + 3 (int), ${story.errorType} fires. except: catches and converts types.`, codeSnippet: `except TypeError:\n    total = int(magic_beans) + 3\n    print("Converted!")` },
      { ...base[2], storyTitle: `🌱 Beanstalk grows tall`, storyText: `When types match correctly (no error), else: grows the beanstalk. It only runs when try: completed without exceptions.`, codeSnippet: `else:\n    grow_beanstalk(total)\n    print("Growing!")` },
      { ...base[3], storyTitle: `🪓 Always chop beanstalk`, storyText: `Whether Jack succeeds or the Giant attacks, the beanstalk MUST always be chopped. finally: guarantees this.`, codeSnippet: `finally:\n    chop_beanstalk()\n    print("🪓 Chopped!")` },
      { ...base[4], storyTitle: `⚡ Giant raises the alarm`, storyText: `When the Giant spots Jack, he deliberately raises an error. raise intentionally triggers the exception.`, codeSnippet: `if giant.is_awake:\n    raise GiantError("FEE-FI-FO!")` },
    ],
    aladdin_genie: [
      { ...base[0], storyTitle: `${story.icon} Rubbing the lamp`, storyText: `Aladdin tries rubbing the lamp and making wishes. try: wraps this risky wish request.`, codeSnippet: `try:\n    rub_lamp()\n    make_wish(count)` },
      { ...base[1], storyTitle: `🚨 Cosmic wish violation`, storyText: `When wishes exceed 3, ${story.errorType} fires. except: catches the cosmic rule violation.`, codeSnippet: `except PermissionError as e:\n    print(f"Denied: {e}")\n    wishes = 3` },
      { ...base[2], storyTitle: `✨ Genie grants wishes`, storyText: `When wishes are within limit (no error), else: grants them! It only runs when try: completed without exceptions.`, codeSnippet: `else:\n    genie.grant_all()\n    print("Wishes granted!")` },
      { ...base[3], storyTitle: `🪔 Always seal the lamp`, storyText: `Whether wishes succeed or are denied, the lamp MUST always be sealed. finally: guarantees this.`, codeSnippet: `finally:\n    lamp.seal()\n    print("🪔 Lamp sealed!")` },
      { ...base[4], storyTitle: `⚡ Enforcing cosmic law`, storyText: `The Genie deliberately raises an error when wishes exceed the limit. raise enforces the cosmic rule.`, codeSnippet: `if wishes > 3:\n    raise PermissionError("Max 3!")` },
    ],
    cinderella: [
      { ...base[0], storyTitle: `${story.icon} Attending the ball`, storyText: `Cinderella tries attending the royal ball before midnight. try: wraps this time-sensitive action.`, codeSnippet: `try:\n    attend_ball()\n    dance_with_prince()` },
      { ...base[1], storyTitle: `🕛 Midnight clock strikes`, storyText: `When time runs out, ${story.errorType} fires. except: catches the timeout and triggers escape.`, codeSnippet: `except TimeoutError as e:\n    print(f"Expired: {e}")\n    escape_to_carriage()` },
      { ...base[2], storyTitle: `💃 Dancing continues`, storyText: `When time remains (no timeout), else: keeps the dance going. It only runs when try: completed without exceptions.`, codeSnippet: `else:\n    dance_with_prince()\n    print("Still dancing!")` },
      { ...base[3], storyTitle: `👠 Always leave the slipper`, storyText: `Whether midnight strikes or not, Cinderella MUST always leave her glass slipper. finally: guarantees this.`, codeSnippet: `finally:\n    leave_glass_slipper()\n    print("👠 Slipper left!")` },
      { ...base[4], storyTitle: `⏰ Fairy godmother triggers timeout`, storyText: `The fairy godmother deliberately triggers midnight timeout. raise intentionally throws the TimeoutError.`, codeSnippet: `if time <= 0:\n    raise TimeoutError("Midnight!")` },
    ],
    pied_piper: [
      { ...base[0], storyTitle: `${story.icon} Allocating rat memory`, storyText: `Pied Piper tries to allocate massive memory for all rats. try: wraps this risky allocation.`, codeSnippet: `try:\n    rats = [0] * (10**12)` },
      { ...base[1], storyTitle: `💥 Memory overflow caught`, storyText: `When array is too large, ${story.errorType} fires. except: catches and switches to batch processing.`, codeSnippet: `except MemoryError:\n    print("Out of memory!")\n    process_batches(100)` },
      { ...base[2], storyTitle: `🪈 All rats led out`, storyText: `When allocation succeeds (no memory error), else: leads all rats out. It only runs when try: completed without exceptions.`, codeSnippet: `else:\n    lead_rats_out()\n    print("All rats led!")` },
      { ...base[3], storyTitle: `💰 Always collect payment`, storyText: `Whether rats are processed or memory fails, the Piper MUST always collect payment. finally: guarantees this.`, codeSnippet: `finally:\n    collect_payment()\n    print("💰 Payment collected!")` },
      { ...base[4], storyTitle: `🌊 Deliberately overflow`, storyText: `The Piper deliberately creates an overflow to demonstrate limits. raise intentionally triggers the memory error.`, codeSnippet: `if rat_count > MAX:\n    raise MemoryError("Too many!")` },
    ],
  };

  return storyCards[story.id] || storyCards['red_hood'];
}


export function getStoryAIPresets(story) {
  const map = {
    red_hood: [
      { id: 'p1', title: `${story.icon} Wolf Disguise Attack`, prompt: `Check if Grandma object has .bake_pastries() method. If not, catch AttributeError and alert Woodcutter rescue unit.` },
      { id: 'p2', title: `🪓 Woodcutter Rescue`, prompt: `Write a try/except that calls guest.bake_pastries(). Catch AttributeError when the guest is a Wolf with no such method. Alert the Woodcutter.` },
      { id: 'p3', title: `👵 Safe Grandma Visit`, prompt: `Verify the guest identity before calling methods. Use try/except/else to safely visit and deliver the basket only if Grandma is real.` },
      { id: 'p4', title: `🔒 Cottage Door Cleanup`, prompt: `Write code that always closes the cottage door using finally, whether or not the Wolf attacked during the visit.` },
    ],
    tortoise_hare: [
      { id: 'p1', title: `${story.icon} Hare Sleeping Zero Division`, prompt: `Calculate race completion time for distance=100 and hare_speed=0. Handle ZeroDivisionError safely, and use else block for clean finish.` },
      { id: 'p2', title: `🏃 Race Speed Check`, prompt: `Write try/except to safely divide distance by speed. Catch ZeroDivisionError when the Hare falls asleep (speed=0).` },
      { id: 'p3', title: `📋 Race Log Finally`, prompt: `Write code that always saves the race log using finally, whether or not a ZeroDivisionError occurred during the race.` },
      { id: 'p4', title: `⚡ Speed Type Mismatch`, prompt: `Handle the case where speed is accidentally a string "fast" instead of a number. Catch TypeError and convert.` },
    ],
    goldilocks: [
      { id: 'p1', title: `${story.icon} Porridge Bowl Access`, prompt: `Access porridge_bowls[5] from a 3-item list. Catch IndexError when the index is out of bounds.` },
      { id: 'p2', title: `🛏️ Bear Bed Key Lookup`, prompt: `Look up "goldilocks" key in bear_beds dictionary. Catch KeyError when the key doesn't exist.` },
      { id: 'p3', title: `🚪 Cottage Door Cleanup`, prompt: `Write code that always closes the cottage door using finally, whether or not Bears returned during the visit.` },
      { id: 'p4', title: `🥣 Temperature Type Check`, prompt: `Handle the case where porridge temperature is "hot" (string) instead of a number. Catch TypeError.` },
    ],
    cried_wolf: [
      { id: 'p1', title: `${story.icon} False Alarm Raise`, prompt: `Write code that raises a ValueError when the shepherd boy sounds a prank alarm, and a custom WolfAlarmError for real wolf danger.` },
      { id: 'p2', title: `🐑 Multiple Exception Handlers`, prompt: `Write try/except with multiple handlers — catch ValueError for prank alarms and WolfAlarmError for real wolf sightings separately.` },
      { id: 'p3', title: `🔔 Village Bell Reset`, prompt: `Write code that always resets the village bell using finally, whether the alarm was a prank or a real wolf.` },
      { id: 'p4', title: `📯 Custom Exception Class`, prompt: `Define a custom WolfAlarmError exception class that inherits from Exception. Then raise it when a real wolf is spotted.` },
    ],
    three_pigs: [
      { id: 'p1', title: `${story.icon} House Building Try/Finally`, prompt: `Build a house with given material. If straw, it collapses. Use finally to ALWAYS lock the construction site afterward.` },
      { id: 'p2', title: `💨 Wolf Huff Simulation`, prompt: `Write code that raises an Exception when the Wolf blows down a straw house. Catch it and evacuate the pigs.` },
      { id: 'p3', title: `🧱 Brick Success Path`, prompt: `Use try/except/else to attempt building. If brick house stands (no error), else: celebrates the victory.` },
      { id: 'p4', title: `🔒 Site Cleanup Guarantee`, prompt: `Write code that always cleans up construction tools and locks the site using finally, regardless of house outcome.` },
    ],
    hansel_gretel: [
      { id: 'p1', title: `${story.icon} Missing Breadcrumbs File`, prompt: `Attempt to open "breadcrumbs.txt". Catch FileNotFoundError when forest birds eat the file and fall back to compass navigation.` },
      { id: 'p2', title: `🧭 Compass Fallback`, prompt: `Write try/except/else to open trail file. If found, follow trail. If FileNotFoundError, use compass instead.` },
      { id: 'p3', title: `🔑 Witch Trap KeyError`, prompt: `Look up "escape" key in the witch's trap dictionary. Catch KeyError when no escape route exists.` },
      { id: 'p4', title: `🧭 Compass Shutdown Finally`, prompt: `Write code that always shuts down the compass sensor using finally, whether the trail was found or not.` },
    ],
    jack_beanstalk: [
      { id: 'p1', title: `${story.icon} Magic Bean Type Check`, prompt: `magic_beans is "5" (string). Try adding 3 (int) to it. Catch TypeError and convert using int().` },
      { id: 'p2', title: `🥚 Golden Egg Conversion`, prompt: `Try converting "golden_egg" string to int(). Catch ValueError when the string is not a valid number.` },
      { id: 'p3', title: `🪓 Beanstalk Chop Finally`, prompt: `Write code that always chops the beanstalk using finally, whether Jack steals treasure or the Giant attacks.` },
      { id: 'p4', title: `⚡ Giant Custom Error`, prompt: `Define a custom GiantError exception and raise it when the Giant spots Jack. Catch it to slide down safely.` },
    ],
    aladdin_genie: [
      { id: 'p1', title: `${story.icon} Wish Limit Check`, prompt: `Check if requested_wishes > 3. Raise PermissionError with cosmic message if exceeded.` },
      { id: 'p2', title: `✨ Valid Wish Grant`, prompt: `Write try/except/else to validate wishes. If within limit (no error), else: grants wishes happily.` },
      { id: 'p3', title: `🪔 Lamp Seal Finally`, prompt: `Write code that always seals the magic lamp using finally, whether wishes were granted or denied.` },
      { id: 'p4', title: `🧞 Cosmic Law Custom Error`, prompt: `Define a custom CosmicLawError and raise it when Aladdin tries forbidden wishes. Catch it to reset wish count.` },
    ],
    cinderella: [
      { id: 'p1', title: `${story.icon} Midnight Timeout`, prompt: `Check if time_remaining <= 0. Raise TimeoutError with midnight message. Catch it to escape to carriage.` },
      { id: 'p2', title: `💃 Dance Success Path`, prompt: `Write try/except/else to check time. If before midnight (no error), else: continues the dance with the Prince.` },
      { id: 'p3', title: `👠 Glass Slipper Finally`, prompt: `Write code that always leaves the glass slipper at the stairs using finally, whether midnight strikes or not.` },
      { id: 'p4', title: `⏰ Spell Expiry Custom Error`, prompt: `Define a custom SpellExpiredError and raise it when the fairy godmother's magic runs out at midnight.` },
    ],
    pied_piper: [
      { id: 'p1', title: `${story.icon} Memory Overflow`, prompt: `Try allocating [0] * (10**12). Catch MemoryError and switch to batch processing of 100 rats at a time.` },
      { id: 'p2', title: `📊 Overflow Computation`, prompt: `Try computing math.exp(1000). Catch OverflowError and set result to float("inf") instead.` },
      { id: 'p3', title: `💰 Payment Collection Finally`, prompt: `Write code that always collects the Piper's payment using finally, whether rats were processed or memory failed.` },
      { id: 'p4', title: `🌊 Batch Processing Else`, prompt: `Write try/except/else to process rats. If allocation succeeds (no error), else: leads all rats out of Hamelin.` },
    ],
  };

  return map[story.id] || map['red_hood'];
}


export function getStoryPlaygroundTemplates(story) {
  const map = {
    red_hood: [
      {
        id: 'rh_adv', emoji: '🐺', label: `1. ${story.character} Adventure`,
        fields: ['Hero Name', 'Villain Name', 'Rescue Item'],
        defaults: [story.character, story.antagonist, 'Axe'],
        fn: (f0, f1, f2) => {
          const hero = f0 || story.character; const villain = f1 || story.antagonist; const item = f2 || 'Axe';
          return `# ${story.icon} ${hero}'s Adventure — Python Exception Story\nclass DisguiseError(Exception):\n    """Raised when ${villain} is disguised."""\n    pass\n\ntry:\n    print(f"${hero} enters the cottage...")\n    guest = get_guest()\n    guest.bake_pastries()  # Risky!\n\nexcept AttributeError as e:\n    print(f"🚨 ${villain} detected: {e}")\n    woodcutter.rescue()\n\nelse:\n    print(f"✨ Safe! ${hero} delivers the basket!")\n\nfinally:\n    print(f"🔒 Cottage door locked by ${hero}.")`;
        }
      }
    ],
    tortoise_hare: [
      {
        id: 'th_race', emoji: '🐢', label: `1. ${story.character} Race`,
        fields: ['Racer Name', 'Distance', 'Speed'],
        defaults: [story.character, '100', '0'],
        fn: (f0, f1, f2) => {
          const racer = f0 || story.character; const dist = f1 || '100'; const speed = f2 || '0';
          return `# ${story.icon} ${racer}'s Race — Python Exception Story\ndistance = ${dist}\nhare_speed = ${speed}\n\ntry:\n    print(f"🏁 ${racer} starts the race!")\n    time = distance / hare_speed\n\nexcept ZeroDivisionError:\n    print("💤 ZeroDivisionError! Hare is sleeping!")\n    time = 999\n\nelse:\n    print(f"🏃 Race finished in {time}s!")\n\nfinally:\n    print(f"📋 Race log saved for ${racer}.")`;
        }
      }
    ],
    goldilocks: [
      {
        id: 'gl_bowl', emoji: '🥣', label: `1. ${story.character} Porridge`,
        fields: ['Character Name', 'Bowl Index', 'Bear Owner'],
        defaults: [story.character, '5', 'Baby Bear'],
        fn: (f0, f1, f2) => {
          const char = f0 || story.character; const idx = f1 || '5'; const bear = f2 || 'Baby Bear';
          return `# ${story.icon} ${char}'s Porridge Test — Python Exception Story\nporridge = ["Hot 🔥", "Cold 🧊", "Just Right ✨"]\nselected_index = ${idx}\n\ntry:\n    print(f"${char} reaches for bowl #{selected_index}...")\n    choice = porridge[selected_index]\n\nexcept IndexError:\n    print(f"🥣 IndexError! Only 3 bowls exist!")\n\nelse:\n    print(f"✨ ${char} found ${bear}'s bowl: {choice}!")\n\nfinally:\n    print(f"🚪 Cottage door closed behind ${char}.")`;
        }
      }
    ],
    cried_wolf: [
      {
        id: 'cw_alarm', emoji: '📯', label: `1. ${story.character} Alarm`,
        fields: ['Boy Name', 'Alarm Type', 'Village Name'],
        defaults: [story.character, 'prank', 'Hamelin'],
        fn: (f0, f1, f2) => {
          const boy = f0 || story.character; const alarm = f1 || 'prank'; const village = f2 || 'Hamelin';
          return `# ${story.icon} ${boy}'s Alarm — Python Exception Story\nclass WolfAlarmError(Exception):\n    pass\n\nalarm = "${alarm}"\n\ntry:\n    if alarm == "prank":\n        raise ValueError("🤡 False Alarm!")\n    elif alarm == "real_wolf":\n        raise WolfAlarmError("🐺 REAL WOLF!")\n\nexcept ValueError as ve:\n    print(f"Prank by ${boy}: {ve}")\n\nexcept WolfAlarmError as wae:\n    print(f"🚨 EMERGENCY in ${village}: {wae}")\n\nfinally:\n    print(f"🔔 ${village} bell reset.")`;
        }
      }
    ],
    three_pigs: [
      {
        id: 'tp_build', emoji: '🐷', label: `1. ${story.character} House Build`,
        fields: ['Pig Name', 'Material', 'Tool'],
        defaults: ['First Pig', 'straw', 'Hammer'],
        fn: (f0, f1, f2) => {
          const pig = f0 || 'First Pig'; const material = f1 || 'straw'; const tool = f2 || 'Hammer';
          return `# ${story.icon} ${pig}'s House — Python Exception Story\nmaterial = "${material}"\n\ntry:\n    print(f"${pig} builds with {material}...")\n    if material == "straw":\n        raise Exception("💨 House blown down!")\n\nexcept Exception as e:\n    print(f"🏠 Collapse: {e}")\n    print("Evacuating pigs!")\n\nelse:\n    print(f"🧱 ${pig}'s house stands firm!")\n\nfinally:\n    print(f"🔒 ${tool} locked. Site secured.")`;
        }
      }
    ],
    hansel_gretel: [
      {
        id: 'hg_trail', emoji: '🍞', label: `1. ${story.character} Trail`,
        fields: ['Child Name', 'Trail File', 'Backup Tool'],
        defaults: ['Hansel', 'breadcrumbs.txt', 'Compass'],
        fn: (f0, f1, f2) => {
          const child = f0 || 'Hansel'; const file = f1 || 'breadcrumbs.txt'; const backup = f2 || 'Compass';
          return `# ${story.icon} ${child}'s Trail — Python Exception Story\ntry:\n    print(f"${child} opens ${file}...")\n    with open("${file}") as f:\n        path = f.read()\n\nexcept FileNotFoundError:\n    print(f"🐦 FileNotFoundError! Birds ate ${file}!")\n    path = ${backup.toLowerCase()}.navigate()\n\nelse:\n    print(f"🏠 ${child} follows trail home!")\n\nfinally:\n    print(f"🧭 ${backup} sensor shut down.")`;
        }
      }
    ],
    jack_beanstalk: [
      {
        id: 'jb_beans', emoji: '🫘', label: `1. ${story.character} Magic Beans`,
        fields: ['Hero Name', 'Bean Count', 'Potion Count'],
        defaults: ['Jack', '5', '3'],
        fn: (f0, f1, f2) => {
          const hero = f0 || 'Jack'; const beans = f1 || '5'; const potions = f2 || '3';
          return `# ${story.icon} ${hero}'s Magic Beans — Python Exception Story\nmagic_beans = "${beans}"  # String!\npotion_count = ${potions}\n\ntry:\n    print(f"${hero} adds potions to beans...")\n    total = magic_beans + potion_count\n\nexcept TypeError:\n    total = int(magic_beans) + potion_count\n    print(f"🌱 TypeError handled! Total: {total}")\n\nelse:\n    print(f"✨ ${hero} has {total} items!")\n\nfinally:\n    print(f"🪓 Beanstalk chopped by ${hero}.")`;
        }
      }
    ],
    aladdin_genie: [
      {
        id: 'ag_wish', emoji: '🧞', label: `1. ${story.character} Wishes`,
        fields: ['Wisher Name', 'Wish Count', 'Lamp Color'],
        defaults: ['Aladdin', '5', 'Golden'],
        fn: (f0, f1, f2) => {
          const wisher = f0 || 'Aladdin'; const count = f1 || '5'; const color = f2 || 'Golden';
          return `# ${story.icon} ${wisher}'s Wishes — Python Exception Story\nrequested_wishes = ${count}\nMAX_WISHES = 3\n\ntry:\n    print(f"${wisher} rubs the ${color} lamp...")\n    if requested_wishes > MAX_WISHES:\n        raise PermissionError("🧞 Max 3 wishes!")\n    print(f"✨ Granted {requested_wishes} wishes!")\n\nexcept PermissionError as e:\n    print(f"🚨 Denied: {e}")\n    requested_wishes = MAX_WISHES\n\nfinally:\n    print(f"🪔 ${color} lamp sealed by ${wisher}.")`;
        }
      }
    ],
    cinderella: [
      {
        id: 'ci_ball', emoji: '👠', label: `1. ${story.character} Ball`,
        fields: ['Princess Name', 'Time Left', 'Prince Name'],
        defaults: ['Cinderella', '0', 'Prince Charming'],
        fn: (f0, f1, f2) => {
          const princess = f0 || 'Cinderella'; const time = f1 || '0'; const prince = f2 || 'Prince Charming';
          return `# ${story.icon} ${princess}'s Ball — Python Exception Story\ntime_remaining = ${time}\n\ntry:\n    print(f"${princess} dances with ${prince}...")\n    if time_remaining <= 0:\n        raise TimeoutError("🕛 Midnight!")\n    print(f"💃 Still dancing!")\n\nexcept TimeoutError as e:\n    print(f"👠 {e} — Escaping to carriage!")\n\nelse:\n    print(f"🎉 ${princess} dances all night!")\n\nfinally:\n    print(f"👠 Glass slipper left by ${princess}.")`;
        }
      }
    ],
    pied_piper: [
      {
        id: 'pp_rats', emoji: '🪈', label: `1. ${story.character} Rats`,
        fields: ['Piper Name', 'Rat Count', 'Batch Size'],
        defaults: ['Pied Piper', '10**12', '100'],
        fn: (f0, f1, f2) => {
          const piper = f0 || 'Pied Piper'; const count = f1 || '10**12'; const batch = f2 || '100';
          return `# ${story.icon} ${piper}'s Rat March — Python Exception Story\ntry:\n    print(f"${piper} allocates memory for ${count} rats...")\n    rats = [0] * (${count})\n\nexcept MemoryError:\n    print(f"🌊 MemoryError! Processing in batches of ${batch}!")\n    process_batches(${batch})\n\nelse:\n    print(f"🪈 All rats led out by ${piper}!")\n\nfinally:\n    print(f"💰 ${piper} collects payment.")`;
        }
      }
    ]
  };

  return map[story.id] || map['red_hood'];
}
