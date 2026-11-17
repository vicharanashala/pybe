import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BookOpen, Sparkles, Wand2, Box } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <SyntaxHighlighter 
    language="python" 
    style={vscDarkPlus}
    customStyle={{ borderRadius: '12px', padding: '20px', fontSize: '1.1rem', margin: '20px 0' }}
  >
    {code}
  </SyntaxHighlighter>
);

const Home = () => {
  const [symbol, setSymbol] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const openChest = async (e) => {
    e.preventDefault();
    if (!symbol.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/treasure/${symbol}`);
      setResult(response.data);
    } catch (error) {
      setResult({ success: false, message: 'Oh no, the magic connection is broken!' });
    }
    setLoading(false);
  };

  const dynamicCode = `# You cast the spell!
magic_chest = get_magical_chest()

# Unlock the drawer labeled "${symbol || '...'}"
treasure = magic_chest.get("${symbol || '...'}")

print("You found:", treasure)`;

  return (
    <div className="story-container">
      
      {/* Chapter 1 */}
      <motion.section 
        className="story-chapter glass-panel"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="chapter-icon"><BookOpen size={48} color="#FF6B6B" /></div>
        <h2 className="title">Chapter 1: The Grand Library</h2>
        <p className="story-text">
          Imagine you are a young sorcerer exploring the ancient Grand Library of Pythonia. 
          Hidden under a pile of dusty scrolls, you find a massive, glowing chest with thousands of tiny drawers!
        </p>
        <p className="story-text">
          You want to find the rare "Golden Coin". But if you open every single drawer one by one to check what's inside (just like searching through a simple <strong>List</strong>), it will take you years!
        </p>
      </motion.section>

      {/* Chapter 2 */}
      <motion.section 
        className="story-chapter glass-panel"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="chapter-icon"><Sparkles size={48} color="#FFE66D" /></div>
        <h2 className="title">Chapter 2: The Hashmap Enchantment</h2>
        <p className="story-text">
          Luckily, the chest is enchanted with powerful magic called a <strong>Hashmap</strong>!
        </p>
        <p className="story-text">
          Instead of searching everywhere, each drawer has a magical sticker on it. The sticker is the <strong>Key</strong>, and the item inside is the <strong>Value</strong>. 
          If you know the exact name of the sticker (the Key), the magic instantly pops open the correct drawer in zero time! No searching required!
        </p>
      </motion.section>

      {/* Chapter 3 */}
      <motion.section 
        className="story-chapter glass-panel"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="chapter-icon"><Wand2 size={48} color="#4ECDC4" /></div>
        <h2 className="title">Chapter 3: The Python Spellbook</h2>
        <p className="story-text">
          To use the chest, you must speak its language: <strong>Python</strong>. In Python, this Hashmap magic is called a <strong>Dictionary</strong>.
        </p>
        <p className="story-text">
          Sorcerers write Dictionaries using curly braces <code>{'{ }'}</code>. They look like this:
        </p>
        <CodeBlock code={`# The Sorcerer's Spellbook (A Python Dictionary)
magic_chest = {
    "star": "Golden Coin 🌟",
    "heart": "Magic Potion 💖",
    "skull": "Pirate Eye Patch ☠️"
}`} />
      </motion.section>

      {/* Chapter 4 */}
      <motion.section 
        className="story-chapter glass-panel"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="chapter-icon"><Box size={48} color="#FF8E8E" /></div>
        <h2 className="title">Chapter 4: Cast the Spell!</h2>
        <p className="story-text">
          Now it's your turn. Type a sticker name (like <strong>star</strong> or <strong>heart</strong>) into the spell bar below. Watch how the Python code changes as you prepare to cast your spell!
        </p>

        <div className="interactive-section">
          <div className="interactive-code">
            <CodeBlock code={dynamicCode} />
          </div>
          
          <div className="interactive-chest box-center">
            <motion.div 
              className="chest-image-placeholder"
              animate={result?.success ? { rotateY: 180, scale: 1.1 } : {}}
              transition={{ duration: 0.5 }}
            >
              {result?.success ? '🎁' : '🧰'}
            </motion.div>

            <form className="form-group" onSubmit={openChest}>
              <input 
                type="text" 
                className="kid-input" 
                placeholder="Type a sticker name..." 
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
              <button type="submit" className="kid-button" disabled={loading}>
                {loading ? 'Casting...' : 'Cast Spell!'}
              </button>
            </form>
          </div>
        </div>
      </motion.section>

      {/* Chapter 5 - Appears after trying */}
      {result && (
        <motion.section 
          className="story-chapter glass-panel"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {result.success ? (
            <>
              <h2 className="title" style={{color: 'var(--secondary)'}}>✨ Spell Successful! ✨</h2>
              <p className="story-text" style={{textAlign: 'center'}}>
                The magic instantly found your item!
              </p>
              <div className="treasure-text" style={{textAlign: 'center', fontSize: '3rem'}}>{result.treasure}</div>
            </>
          ) : (
            <>
              <h2 className="title" style={{color: 'var(--primary)'}}>💥 The Missing Key! 💥</h2>
              <p className="story-text">
                What happens if you ask for a sticker that isn't on the chest? In Python, asking for a missing key normally causes a loud explosion called a <code>KeyError</code>! 
              </p>
              <p className="story-text">
                But as a clever sorcerer, you used the <code>.get()</code> spell! Instead of exploding, `.get()` gives you a gentle, friendly hint:
              </p>
              <div className="hint-text" style={{textAlign: 'center', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px'}}>
                {result.message}
              </div>
            </>
          )}
        </motion.section>
      )}

    </div>
  );
};

export default Home;
