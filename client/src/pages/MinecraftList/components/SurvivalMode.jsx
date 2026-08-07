import React, { useState, useEffect, useRef } from 'react';
import Stage from './Stage';

// Helper for icon mapping matching the original
const getIcon = (name) => {
  const icons = {'Wood':'🪵', 'Stone':'🪨', 'Sword':'🗡️', 'Pickaxe':'⛏️', 'Apple':'🍎', 'Diamond':'💎', 'Iron':'🪩'};
  return icons[name] || '📦';
};

let uidCounter = 1;

export default function SurvivalMode({ onSandboxSwitch }) {
  const [items, setItems] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState({ text: '', color: '' });
  const [highlight, setHighlight] = useState(null);
  const [codeLine, setCodeLine] = useState('inventory = ???');
  const [lenPill, setLenPill] = useState('len = 0');
  
  // Ref for the input field to auto-focus when available
  const inputRef = useRef(null);

  // The story logic exactly ported from app.js
  // Using useRef to keep steps static across renders but allow them to mutate state
  const steps = useRef([
    {
      title: "1. The Empty Inventory",
      story: "Steve just spawned in a new world! He is ready to gather resources. But first, he checks his inventory. Right now, his hotbar is completely empty.",
      python: "In Python, a list is exactly like Steve's inventory hotbar. We create an empty list by setting a variable equal to square brackets `[]`.",
      instruction: "Type in plain English or Python to create an empty list:",
      expected: /inventory\s*=\s*\[\]|empty|create|new|init|\[\]/i,
      hint: "Try: \"create empty list\"",
      action: () => {
        setCodeLine("inventory = []");
        setLenPill("len = 0");
        return true;
      }
    },
    {
      title: "2. Punching Trees",
      story: "Steve punches a tree and a block of Wood pops out! He picks it up to put it in his inventory.",
      python: "In Python, to add an item to a list, we use the `append()` command. This command always places the new item into the very next empty slot at the end of the hotbar.",
      instruction: "Type in plain English or Python to add Wood to your inventory:",
      expected: /wood|append|add/i,
      hint: "Try: \"add wood\"",
      action: () => {
        const newItem = {id: uidCounter++, value: 'Wood', icon: getIcon('Wood')};
        setItems(prev => {
          const next = [...prev, newItem];
          setHighlight({type:'add', ids:[newItem.id], bounceIds:[newItem.id]});
          return next;
        });
        setCodeLine("inventory.append('Wood')");
        setLenPill("len = 1");
        return true;
      }
    },
    {
      title: "3. Mining Stone",
      story: "Now Steve crafts a wooden pickaxe and mines some Stone. He picks up the Stone block.",
      python: "Because we use the `append()` command, the Stone is placed exactly after the Wood in the next available slot.",
      instruction: "Type in plain English or Python to add Stone to your inventory:",
      expected: /stone|append|add/i,
      hint: "Try: \"add stone\"",
      action: () => {
        const newItem = {id: uidCounter++, value: 'Stone', icon: getIcon('Stone')};
        setItems(prev => {
          const next = [...prev, newItem];
          setHighlight({type:'add', ids:[newItem.id], bounceIds:[newItem.id]});
          return next;
        });
        setCodeLine("inventory.append('Stone')");
        setLenPill("len = 2");
        return true;
      }
    },
    {
      title: "4. Finding Diamonds",
      story: "Steve digs deep into a cave and strikes blue! It's a Diamond! He quickly grabs it.",
      python: "Again, we use `append()` to add the Diamond to the end of our growing list.",
      instruction: "Type in plain English or Python to add Diamond to your inventory:",
      expected: /diamond|append|add/i,
      hint: "Try: \"add diamond\"",
      action: () => {
        const newItem = {id: uidCounter++, value: 'Diamond', icon: getIcon('Diamond')};
        setItems(prev => {
          const next = [...prev, newItem];
          setHighlight({type:'add', ids:[newItem.id], bounceIds:[newItem.id]});
          return next;
        });
        setCodeLine("inventory.append('Diamond')");
        setLenPill("len = 3");
        return true;
      }
    },
    {
      title: "5. Inventory Check (len)",
      story: "Steve's pockets feel a bit heavy. He wants to know exactly how many items he is carrying right now.",
      python: "In Python, we use the `len()` function to get the length (or total size) of the list.",
      instruction: "Type in plain English or Python to check the length of your inventory:",
      expected: /len|length|size|count|check/i,
      hint: "Try: \"check length\"",
      action: () => {
        setCodeLine("len(inventory)");
        return true;
      }
    },
    {
      title: "6. Creeper! (Insert)",
      story: "Oh no! A Creeper approaches! Steve quickly crafts a Sword. He needs it in his main hand immediately, which is slot 0. If he appends it, it goes to slot 3, which is too far!",
      python: "We use the `insert(index, item)` command to force the Sword into index `0`. The other items automatically shift right to make room without being destroyed.",
      instruction: "Type in plain English or Python to insert a Sword at slot 0:",
      expected: /insert|sword|0|add/i,
      hint: "Try: \"insert sword at 0\"",
      action: () => {
        const newItem = {id: uidCounter++, value: 'Sword', icon: getIcon('Sword')};
        setItems(prev => {
          const next = [newItem, ...prev];
          const movedIds = prev.map(it=>it.id);
          setHighlight({type:'add', ids:[newItem.id], bounceIds:movedIds});
          return next;
        });
        setCodeLine("inventory.insert(0, 'Sword')");
        setLenPill("len = 4");
        return true;
      }
    },
    {
      title: "7. Attack! (Pop)",
      story: "Steve attacks the Creeper with the Sword and defeats it! Phew. He puts the Sword away, removing it completely from his main hand (slot 0).",
      python: "The `pop(0)` command removes the item from that exact index and returns it. Everything else in the hotbar shifts left to fill the gap.",
      instruction: "Type in plain English or Python to pop (remove) the item from slot 0:",
      expected: /pop|remove|delete|0|sword/i,
      hint: "Try: \"remove sword\"",
      action: () => {
        setItems(prev => {
          const removed = prev[0];
          const movedIds = prev.slice(1).map(it=>it.id);
          setHighlight({type:'del', ids:[removed.id], bounceIds:movedIds});
          return prev.slice(1);
        });
        setCodeLine("inventory.pop(0)");
        setLenPill("len = 3");
        return true;
      }
    },
    {
      title: "8. Organization (Sort)",
      story: "Steve is safe, but his inventory is disorganized. Wood, Stone, Diamond... He wants them sorted alphabetically so he can find things easily.",
      python: "The `sort()` command modifies the original list, sorting all of the items alphabetically or numerically in place.",
      instruction: "Type in plain English or Python to sort your inventory alphabetically:",
      expected: /sort|order|organize|alphabetical/i,
      hint: "Try: \"sort inventory\"",
      action: () => {
        setItems(prev => {
          const sorted = [...prev].sort((a,b)=> a.value.localeCompare(b.value));
          setHighlight({type:'sort', ids: sorted.map(i=>i.id)});
          return sorted;
        });
        setCodeLine("inventory.sort()");
        return true;
      }
    },
    {
      title: "9. Survived the Night!",
      story: "Steve survived! You now know the basics of how Python Lists manage data just like Minecraft manages your items.",
      python: "Lists can be accessed, sorted, counted, reversed, and more. Now, jump into the Creative Sandbox and try all 17 operations yourself!",
      instruction: "",
      expected: /.*/, 
      hint: "Click Go to Sandbox!",
      btnText: "Go to Creative Sandbox",
      action: () => {
        onSandboxSwitch();
        return false; 
      }
    }
  ]);

  const currentStep = steps.current[currentStepIndex];
  const isLastStep = currentStepIndex === steps.current.length - 1;

  const handleAction = () => {
    if (isLastStep) {
      currentStep.action();
      return;
    }

    const val = inputValue.trim();
    if (currentStep.expected.test(val)) {
      setFeedback({ text: 'Operation Successful!', color: '#55ff55' });
      const advance = currentStep.action();
      
      if (advance && currentStepIndex < steps.current.length - 1) {
        // Wait a second before visually switching the text to let the user see the result
        setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1);
          setInputValue('');
          setFeedback({ text: '', color: '' });
          // Focus input again if available
          if (inputRef.current) inputRef.current.focus();
        }, 1000);
      }
    } else {
      setFeedback({ text: currentStep.hint, color: '#ff5555' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAction();
  };

  return (
    <div className="grid story-layout">
      {/* LEFT PANEL: PROGRESS */}
      <div>
        <div className="panel progress-panel" style={{ position: 'sticky', top: '20px' }}>
          <h2>Advancements</h2>
          <div className="step-indicator">
            {steps.current.map((s, i) => {
              let classes = "step";
              if (i === currentStepIndex) classes += " active";
              else if (i < currentStepIndex) classes += " completed";
              return (
                <div key={i} className={classes}>
                  {i + 1}. {s.title.split('. ')[1] || s.title}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: CONTENT & OUTPUT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* TOP: STORY & SYNTAX */}
        <div className="panel story-panel">
          <h2 id="storyTitle">{currentStep.title}</h2>
          <p id="storyText" dangerouslySetInnerHTML={{ __html: currentStep.story }}></p>
          
          {currentStep.python && (
            <div id="pythonInterpretation" style={{ marginBottom: '24px', padding: '14px', background: '#000', border: '4px solid #555', color: '#fff' }}>
               <div style={{ color: '#55ff55', fontSize: '20px', textTransform: 'uppercase', marginBottom: '6px' }}>[Python Translation]</div>
               <div id="pythonText" style={{ fontSize: '22px', lineHeight: '1.5' }} dangerouslySetInnerHTML={{ __html: currentStep.python }}></div>
            </div>
          )}

          <div className="action-box">
            <div id="storyInputArea" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {!isLastStep && (
                <label id="storyInstruction" style={{ fontSize: '20px', color: '#111' }}>
                  {currentStep.instruction}
                </label>
              )}
              
              <div style={{ display: 'flex', gap: '8px' }}>
                {!isLastStep && (
                  <input 
                    ref={inputRef}
                    type="text" 
                    className="mono" 
                    placeholder={currentStep.hint} 
                    autoComplete="off"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                )}
                <button 
                  className="primary-btn accent" 
                  onClick={handleAction}
                >
                  {isLastStep ? currentStep.btnText : 'Execute'}
                </button>
              </div>
              <div style={{ fontSize: '20px', minHeight: '24px', marginTop: '8px', color: feedback.color }}>
                {feedback.text}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: OUTPUT (VISUAL HOTBAR) */}
        <Stage 
          items={items} 
          highlight={highlight}
          codeLine={codeLine}
          metaPills={[{ text: lenPill }]}
        />
        
      </div>
    </div>
  );
}
