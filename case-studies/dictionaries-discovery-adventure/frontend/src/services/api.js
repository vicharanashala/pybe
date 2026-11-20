const MOCK_TREASURES = {
  star: { treasure: 'Golden Coin 🌟', hint: 'Shines bright in the night sky. The Wizard\'s pride!' },
  heart: { treasure: 'Ruby 💖', hint: 'Pulsing with warm magic and vital energy.' },
  skull: { treasure: 'Cursed Ring ☠️', hint: 'Dark enchantment wrapped in cold silver.' },
  crown: { treasure: 'Royal Gem 👑', hint: 'Forged for kings, gleaming with regal light.' },
  // Easter eggs!
  goblin: { treasure: 'Shiny Golden Spoon 🥄', hint: 'Sly\'s secret personal treasure for midnight snacks!' },
  bone: { treasure: 'Sleepy Dog Biscuit 🦴', hint: 'The guard dog munches happily and goes back to sleep!' }
};


export async function getTreasure(symbol){const key=(symbol||'').toLowerCase().trim();if(!key)return {success:false,found:false,message:'Please provide a valid sticker symbol!'};const treasure=MOCK_TREASURES[key];return treasure?{success:true,found:true,key,...treasure,...(['goblin','bone'].includes(key)?{isEasterEgg:true}:{})}:{success:false,found:false,key,message:`Sticker '${key}' not found on the chest!`,hint:"Try checking the secret parchment symbols: 'star', 'heart', 'skull', or 'crown'."};}
export async function getQuiz(){const keys=['star','heart','skull','crown'];const correctKey=keys[Math.floor(Math.random()*keys.length)],correctValue=MOCK_TREASURES[correctKey].treasure;const others=keys.filter(key=>key!==correctKey).sort(()=>Math.random()-0.5);return {success:true,question:`Which treasure is hidden behind the "${correctKey}" sticker?`,correctKey,correctValue,options:[correctKey,...others.slice(0,2)].map(key=>({key,value:MOCK_TREASURES[key].treasure})).sort(()=>Math.random()-0.5)};}
export async function checkBackendHealth(){return {online:true,message:'Local authored treasure lookup is ready.'};}
