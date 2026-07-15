# The Horcrux Pattern

In the wizarding world, a Horcrux is an object in which a Dark wizard has hidden a fragment of their soul for the purpose of attaining immortality. As long as the physical object remains intact, the wizard cannot truly die.

Python objects are mortal. They live in RAM, and when the program finishes executing, they vanish into the void. To grant an object immortality, you must serialize it—transform its living state into a static sequence of bytes that can be written to a hard drive.

In this scenario, you will explore two methods of making Horcruxes: `json`, which is readable by all (Muggles and wizards alike), and `pickle`, a dark art specific to Python that can capture almost any complex object structure.