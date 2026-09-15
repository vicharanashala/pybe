export const TOUR_DATA = {
  home: [
    {
      author:"bittu",
      targetIds: [],
      text: "Grandpa, look! Every time I open a new pack of cream biscuits, the jam colors are always arranged in the same order. They are never mixed up!",
      actionText: "Click next ->",
      bittuImage: { url: '/images/10-Photoroom.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', left: '25%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"grandpa",
      targetIds: [],
      text: "Haha, good eye Bittu! That's because the factory machines arrange them in a tuple like fashion",
      actionText: "Click next ->",
      bittuImage: { url: '/images/a2-Photoroom.png', bgSize: '500% 300%', bgPos: '75% 50%' },
      // Position near Grandpa (Right side)
      boxPosition: { top: '45%', left: '55%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"bittu",
      targetIds: [],
      text: "Tuple? What's a tuple Grandpa? Is it like a magic trick?",
      actionText: "Click next ->",
      bittuImage: { url: '/images/9-Photoroom.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      boxPosition: { top: '45%', left: '25%', transform: 'translate(-50%, -50%)' },
      automated: false,
    },
    {
      author:"grandpa",
      targetIds: [],
      text: "Not magic, computer science! A strictly ordered wrapper like that is called a 'Tuple'. Do you want to learn about tuples bittu?",
      actionText: "Click the green button to start",
      bittuImage: { url: '/images/y3.png', bgSize: '500% 300%', bgPos: '75% 50%' },
      // Position right below the button
      boxPosition: { top: '45%', left: '55%', transform: 'translate(-50%, 0)' },
      automated: false,
    },
    {
      author:"bittu",
      targetIds: [],
      text: "Yes grandpa, it I wanna know more!",
      actionText: "Click next ->",
      bittuImage: { url: '/images/7-Photoroom.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      boxPosition: { top: '45%', left: '25%', transform: 'translate(-50%, -50%)' },
      automated: false,
    },
  ],
  
 
  ordered: [
    { 
      targetIds: ['pantry-biscuit-red','pantry-biscuit-blue','pantry-biscuit-green','pantry-biscuit-pink','pantry-biscuit-yellow', 'tour-wrapper-zone'],
      text:"Bittu!, take some biscuits and add it into the wrapper", 
      actionText: "Drag a biscuit to wrapper",
      bittuImage: { url: '/images/y1.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      boxPosition: { top: '35%', left: '60%', transform: 'translateX(-50%)' },
      automated: false, // Requires user to click ">" to proceed
    },
    { 
      targetIds: ['btn-seal-wrapper'], 
      text: "Awesome!. Click 'Seal Wrapper' so that the biscuits don't fall out. (tuples being initialized)", 
      actionText: "Click Seal Wrapper",
      bittuImage: { url: '/images/y5.png', bgSize: '500% 300%', bgPos: '75% 50%' },
      boxPosition: { top: '45%', left: '60%', transform: 'translateX(-50%)' },

      automated: true,
    },
    {
      author:"grandpa",
      targetIds: ['pantry-biscuit-red','pantry-biscuit-blue','pantry-biscuit-green','pantry-biscuit-pink','pantry-biscuit-yellow', 'tour-wrapper-zone'],
      text: "Now try to add more biscuits. You can't right?, This is what separates lists from tuples. You can change elements in a list after initialization, but you cannot in a tuple.",
      actionText: "Try to add biscuits",
      bittuImage: { url: '/images/a2-Photoroom.png', bgSize: '500% 300%', bgPos: '75% 50%' },
      // Position right below the button
      boxPosition: { top: '50%', left: '65%', transform: 'translate(-50%, 0)' },
      automated: false,
    },
    {
      author:"grandpa",
      targetIds: [],
      text: "This property is called immutability. Once you've initialized, you cannot alter the biscuits",
      actionText: "Click next",
      bittuImage: { url: '/images/y3.png', bgSize: '500% 300%', bgPos: '75% 50%' },
      // Position right below the button
      boxPosition: { top: '45%', left: '42%', transform: 'translate(-50%, 0)' },
      automated: false,
    },

    { 
      targetIds: ['btn-shake-wrapper'], 
      text: "Try shaking the wrapper.", 
      actionText: "Click Shake Wrapper",
      bittuImage: { url: '/images/a3-Photoroom.png', bgSize: '500% 300%', bgPos: '0% 0%' },
      boxPosition: { top: '50%', left: '65%', transform: 'translate(-50%, 0)' },
      automated: true, // Automatically jumps to next step after shaking
    },

    { 
      targetIds: ['tour-wrapper-zone'],
      text: "Notice that the order is maintained", 
      actionText: "click next",
      bittuImage: { url: '/images/a4-Photoroom.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      boxPosition: { top: '25%', left: '50%', transform: 'translateX(-50%)' },
      automated: false, // Requires user to click ">" to proceed
    },
    { 
      targetIds: ['pantry-biscuit-red','pantry-biscuit-blue','pantry-biscuit-green','pantry-biscuit-pink','pantry-biscuit-yellow', 'tour-jar-zone'], 
      text: "Now grab atleast 2-3 biscuit and drop it into the Jar.", 
      actionText: "Drag biscuit to jar and hit next",
      bittuImage: { url: '/images/a2-Photoroom.png', bgSize: '500% 300%', bgPos: '25% 100%' },
      boxPosition: { bottom: '150px', right: '40px' },
      automated: false,
    },
    { 
      targetIds: ['btn-shake-jar'], 
      text: "Shake the jar and watch the order get scrambled.", 
      actionText: "Click Shake Jar",
      bittuImage: { url: '/images/a3-Photoroom.png', bgSize: '500% 300%', bgPos: '100% 100%' },
      boxPosition: { top: '25%', left: '50%', transform: 'translateX(-50%)' },
      automated: true,
    },
    { 
      targetIds: ['tour-jar-zone','btn-shake-jar'], 
      text: "Notice how the order is not maintained, it shows unordered behavior", 
      actionText: "Drag biscuit to jar",
      bittuImage: { url: '/images/a4-Photoroom.png', bgSize: '500% 300%', bgPos: '25% 100%' },
      boxPosition: { top: '25%', left: '35%', transform: 'translateX(-50%)' },
      automated: true,
    },
  ],
  heterogeneous: [
    {
      author:"grandpa",
      targetIds: [],
      text: "Look bittu you understood \'ordered\' & \'immutable\' property of tuples. But tuples also accept \'heterogenous\' values into it",
      actionText: "Click next ->",
      bittuImage: { url: '/images/a2-Photoroom.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', left: '25%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"bittu",
      targetIds: [],
      text: "Heterogeneous means different right grandpa?",
      actionText: "Click next ->",
      bittuImage: { url: '/images/z3.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', right: '15%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"grandpa",
      targetIds: [],
      text: "More or less. Remember that tuples also behaves like a shopping bag. You can put anything into a shopping bag, it will accept it. But you only put biscuits inside biscuit wrappers",
      actionText: "Click next ->",
      bittuImage: { url: '/images/y2.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', left: '25%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"grandpa",
      targetIds: ["pantry-item-watch", "pantry-item-biscuit-red","pantry-item-ring","pantry-item-biscuit-blue","pantry-item-shoes","pantry-item-camera","pantry-item-apple","pantry-item-coffee","wrapper div"],
      text: "Here, Try adding anything apart from biscuits",
      actionText: "Click next ->",
      bittuImage: { url: '/images/a3-Photoroom.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', left: '65%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"grandpa",
      targetIds: [],
      text: "You saw that only biscuits were acceptable inside a wrapper. That is not how tuples behave",
      actionText: "Click next ->",
      bittuImage: { url: '/images/y3.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', left: '45%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"grandpa",
      targetIds: ["pantry-item-watch", "pantry-item-biscuit-red","pantry-item-ring","pantry-item-biscuit-blue","pantry-item-shoes","pantry-item-camera","pantry-item-apple","pantry-item-coffee","bag div"],
      text: "In a shopping bag you can add all varieties of items. This is more or less how tuples behave. Accept everything that comes",
      actionText: "Click next ->",
      bittuImage: { url: '/images/y2.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', left: '30%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    
  ],
  nested: [
    {
      author:"bittu",
      targetIds: [],
      text: "Grandpa, All these are fine, but can you give me one good example which replicates all the properties of a tuple?",
      actionText: "Click next ->",
      bittuImage: { url: '/images/10-Photoroom.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', right: '15%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"grandpa",
      targetIds: [],
      text: "Indeed my son. A remote is a perfect replica which behaves like a tuple.",
      actionText: "Click next ->",
      bittuImage: { url: '/images/y4.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', left: '25%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"bittu",
      targetIds: [],
      text: "Remote? That was unexpected grandpa, how does it behave like a tuple though?",
      actionText: "Click next ->",
      bittuImage: { url: '/images/9-Photoroom.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', right: '15%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"grandpa",
      targetIds: [],
      text: "Think of buttons, batteries, and all other components inside a remote as different data types. So it is executing \'heterogeneous\' property",
      actionText: "Click next ->",
      bittuImage: { url: '/images/y3.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', left: '25%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"grandpa",
      targetIds: ["locked zone"],
      text: "You can clearly see they are 'Ordered' and won't change it's place. Now try to pick a button from it's place.",
      actionText: "Click next ->",
      bittuImage: { url: '/images/y5.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', left: '25%', transform: 'translate(-50%, -50%)' }, 
      automated: true,
    },
    {
      author:"grandpa",
      targetIds: ["locked zone"],
      text: "You can't right? It is executing 'Immutable' behavior",
      actionText: "Click next ->",
      bittuImage: { url: '/images/a5-Photoroom.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', left: '25%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"bittu",
      targetIds: ["Battery Case"],
      text: "Okay grandpa, but batteries are replaceable right? how can you say it is immutable?",
      actionText: "Click next ->",
      bittuImage: { url: '/images/z6.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', right: '15%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"grandpa",
      targetIds: [],
      text: "Very good bittu. You're asking the right questions. You know about 'lists' right?",
      actionText: "Click next ->",
      bittuImage: { url: '/images/y2.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', left: '25%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"bittu",
      targetIds: [],
      text: "Yes grandpa. They are just mutable tuples right?",
      actionText: "Click next ->",
      bittuImage: { url: '/images/z4.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', right: '15%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"grandpa",
      targetIds: [],
      text: "Indeed they are. As tuples are 'Heterogeneous', they can hold different data types and data structures into it.",
      actionText: "Click next ->",
      bittuImage: { url: '/images/a2-Photoroom.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', left: '25%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"grandpa",
      targetIds: ["Battery Case", "unused slot", "used slot"],
      text: "Now, look at this battery case. Let's say it is behaving like a list. Even though a tuple is immutable. Lists inside them are mutable. So you can change them however you want",
      actionText: "Click next ->",
      bittuImage: { url: '/images/a1.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', left: '15%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },
    {
      author:"bittu",
      targetIds: [],
      text: "Wow grandpa, that's a cool distinction grandpa",
      actionText: "Click next ->",
      bittuImage: { url: '/images/z2.png', bgSize: '500% 300%', bgPos: '50% 0%' },
      // Position near Bittu (Left side)
      boxPosition: { top: '45%', right: '15%', transform: 'translate(-50%, -50%)' }, 
      automated: false,
    },


  ]
};