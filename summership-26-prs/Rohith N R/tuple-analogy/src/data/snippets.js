export const SNIPPET_DATA = {
  ordered: [
    {
      instruction: "Challenge 1: Tuples preserve order. Drag the correct snippet to grab the very first biscuit!",
      beforeCode: `# Tuples keep their sequence exactly as you wrote it.
biscuit_pack = ("Red", "Green", "Blue", "Pink")

# How do we get the very first item?
first_biscuit = `,
      afterCode: `

print("First out:", first_biscuit)
# Output: Red`,
      options: [
        { id: 1, text: "biscuit_pack[0]", isCorrect: true },
        { id: 2, text: "biscuit_pack.first()", isCorrect: false },
        { id: 3, text: "biscuit_pack[1]", isCorrect: false }
      ]
    },
    {
      instruction: "Challenge 2: How do you grab the last item without knowing how many biscuits there are?",
      beforeCode: `biscuit_pack = ("Red", "Green", "Blue", "Pink")

# Use negative indexing to get the last item!
last_biscuit = `,
      afterCode: `

print("Last out:", last_biscuit)
# Output: Pink`,
      options: [
        { id: 4, text: "biscuit_pack[4]", isCorrect: false },
        { id: 5, text: "biscuit_pack[-1]", isCorrect: true },
        { id: 6, text: "biscuit_pack.last()", isCorrect: false }
      ]
    }
  ],
  heterogeneous: [
    {
      instruction: "Challenge 1: Tuples can hold mixed data types! Drag the correct tuple format.",
      beforeCode: `# Heterogeneous means mixing different types!
# Let's pack a String, an Integer, and a Boolean:

bittus_bag = `,
      afterCode: `

print(bittus_bag)`,
      options: [
        { id: 1, text: "('Apple', 42, True)", isCorrect: true },
        { id: 2, text: "('Apple', 'Apple', 'Apple')", isCorrect: false },
        { id: 3, text: "['Apple', 42, True]", isCorrect: false }
      ]
    },
    {
      instruction: "Challenge 2: We can easily unpack a heterogeneous tuple into separate variables!",
      beforeCode: `bittus_bag = ("Camera", 2026, True)

# Unpack the tuple into three separate variables
`,
      afterCode: ` = bittus_bag

print(item_name) # Output: Camera`,
      options: [
        { id: 4, text: "[item_name, year, is_working]", isCorrect: false },
        { id: 5, text: "bittus_bag.unpack()", isCorrect: false },
        { id: 6, text: "item_name, year, is_working", isCorrect: true }
      ]
    }
  ],
  nested: [
    {
      instruction: "Challenge 1: A tuple can't change, but a list inside it can! Drag the snippet to update the battery.",
      beforeCode: `# The remote tuple contains a mutable list of batteries
my_remote = ("Samsung TV", "Living Room", ["old_bat", "old_bat"])

# Let's replace the first battery with a 'new_bat'
`,
      afterCode: `

print(my_remote)
# Output: ('Samsung TV', 'Living Room', ['new_bat', 'old_bat'])`,
      options: [
        { id: 1, text: "my_remote[2][0] = 'new_bat'", isCorrect: true },
        { id: 2, text: "my_remote[0] = 'new_bat'", isCorrect: false },
        { id: 3, text: "my_remote[2] = 'new_bat'", isCorrect: false }
      ]
    },
    {
      instruction: "Challenge 2: What code will cause a TypeError by trying to replace the whole battery list?",
      beforeCode: `# Remember, the tuple itself is immutable!
my_remote = ("Samsung TV", "Living Room", ["old_bat", "old_bat"])

# This attempt to swap out the ENTIRE list will fail:
`,
      afterCode: `
# TypeError: 'tuple' object does not support item assignment!`,
      options: [
        { id: 4, text: "my_remote[2].clear()", isCorrect: false },
        { id: 5, text: "my_remote[2] = ['new', 'new']", isCorrect: true },
        { id: 6, text: "my_remote[2].append('new')", isCorrect: false }
      ]
    }
  ],
  final: [
    {
      instruction: "Boss Challenge 1: Find out how many items are in the heterogeneous tuple!",
      beforeCode: `inventory = ("Camera", "Biscuit", 42, True)

# Count the items!
total_items = `,
      afterCode: `

print("Total items:", total_items)`,
      options: [
        { id: 1, text: "len(inventory)", isCorrect: true },
        { id: 2, text: "inventory.length()", isCorrect: false },
        { id: 3, text: "count(inventory)", isCorrect: false }
      ]
    },
    {
      instruction: "Boss Challenge 2: Which code correctly triggers an error by trying to mutate a tuple?",
      beforeCode: `biscuit_pack = ("Red", "Green", "Blue")

# Let's try to change "Red" to "Yellow" (This will break!)
`,
      afterCode: `
# TypeError: 'tuple' object does not support item assignment`,
      options: [
        { id: 4, text: "biscuit_pack.replace('Red', 'Yellow')", isCorrect: false },
        { id: 5, text: "biscuit_pack[0] = 'Yellow'", isCorrect: true },
        { id: 6, text: "biscuit_pack.append('Yellow')", isCorrect: false }
      ]
    },
    {
      instruction: "Boss Challenge 3: You have a list inside a tuple. Add a 3rd item to that list!",
      beforeCode: `data = (10, 20, ["A", "B"])

# Add "C" to the end of the list inside the tuple
`,
      afterCode: `

print(data)
# Output: (10, 20, ['A', 'B', 'C'])`,
      options: [
        { id: 7, text: "data[2].append('C')", isCorrect: true },
        { id: 8, text: "data.append('C')", isCorrect: false },
        { id: 9, text: "data[2][2] = 'C'", isCorrect: false }
      ]
    }
  ]
};