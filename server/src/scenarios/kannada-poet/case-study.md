You are the trusted assistant to a famous Kannada poet at the royal court of the Vijayanagara Empire. The poet is brilliant but slow. When given a topic, it takes the poet exactly 2 seconds to compose a beautiful 4-line verse. 

The courtiers are impatient and often ask for poems on the same topics repeatedly. To please them, you decide to memorize the poet's works. However, your memory is limited: you can only remember the **3 most recently requested poems**.

If a courtier asks for a topic you remember, you recite it instantly (0 seconds). This is a **Cache Hit**.
If they ask for a new topic, you must ask the poet, which takes 2 seconds, and then you memorize it. This is a **Cache Miss**.
If your memory is full (3 poems) and a new one is composed, you must forget the one you haven't recited for the longest time (**Least Recently Used**).

Your tasks:
1. Implement a function `compose_poem(topic)` that uses `time.sleep(2)` to simulate the expensive composition process.
2. Build a `PoetCache` class initialized with a `capacity` of 3.
3. Use Python's `collections.OrderedDict` to store the poems.
4. Implement a `get_poem(topic)` method in your cache.
   - If the topic is in the cache, move it to the end (marking it as most recently used) and return the poem instantly.
   - If the topic is not in the cache, call `compose_poem(topic)`, add it to the cache, and if the cache size exceeds 3, remove the first item (the least recently used).

Test your cache with this sequence:
"Monsoon", "Tiger", "Lotus", "Monsoon" (Should be fast!), "King" (Evicts Tiger), "Tiger" (Must compose again).
