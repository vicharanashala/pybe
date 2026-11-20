// Reference programs used to check the eight authored garden task validators.
export const gardenPrograms=[
 'water_cans = [20,35,15,40,25]\ntotal_water = 0\nfor can in water_cans:\n    total_water += can',
 'flower_beds = ["Roses","Tulips","Daisies","Lilies"]\nfor bed in flower_beds:\n    print("Checking",bed)',
 'seed_baskets = [40,55,30]\ntotal_seeds = 0\nfor seeds in seed_baskets:\n    total_seeds += seeds',
 'for count in range(10,0,-1):\n    print(count)\nprint("BLOOM!")',
 'for row in range(1,7):\n    if row == 4:\n        print("Pest warning at row",row)\n        break\n    print("Checking row",row)',
 'sprinklers = [10,0,25,0,30,15]\ntotal_flow = 0\nfor flow in sprinklers:\n    if flow == 0:\n        continue\n    total_flow += flow',
 'can_water = 0\nwhile can_water < 50:\n    can_water += 7',
 'print("Water:",total_water)\nprint("Seeds:",total_seeds)\nprint("Flow:",total_flow)\nprint("Can:",can_water)'
];
