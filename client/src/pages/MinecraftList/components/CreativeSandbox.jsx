import React, { useState, useRef, useEffect } from 'react';
import Stage from './Stage';

// Helper for icon mapping matching the original
const getIcon = (name) => {
  const icons = {'Wood':'🪵', 'Stone':'🪨', 'Sword':'🗡️', 'Pickaxe':'⛏️', 'Apple':'🍎', 'Diamond':'💎', 'Iron':'🪩'};
  return icons[name] || '📦';
};

const OPS = {
  append:   {label:'append(x)',        color:'add',    complexity:'O(1)'},
  insert:   {label:'insert(i, x)',     color:'add',    complexity:'O(n)'},
  popLast:  {label:'pop()',            color:'del',    complexity:'O(1)'},
  popIndex: {label:'pop(i)',           color:'del',    complexity:'O(n)'},
  remove:   {label:'remove(x)',        color:'del',    complexity:'O(n)'},
  clear:    {label:'clear()',          color:'del',    complexity:'O(1)'},
  access:   {label:'list[i]',          color:'access', complexity:'O(1)'},
  update:   {label:'list[i] = x',      color:'update', complexity:'O(1)'},
  len:      {label:'len(list)',        color:'access', complexity:'O(1)'},
  contains: {label:'x in list',        color:'search', complexity:'O(n)'},
  index:    {label:'index(x)',         color:'search', complexity:'O(n)'},
  count:    {label:'count(x)',         color:'search', complexity:'O(n)'},
  del:      {label:'del list[i]',      color:'del',    complexity:'O(n)'},
  slice:    {label:'list[a:b]',        color:'access', complexity:'O(k)'},
  copy:     {label:'copy()',           color:'access', complexity:'O(n)'},
  extend:   {label:'extend(iter)',     color:'add',    complexity:'O(k)'},
  reverse:  {label:'reverse()',        color:'sort',   complexity:'O(n)'},
  sort:     {label:'sort()',           color:'sort',   complexity:'O(n log n)'}
};

const OP_GROUPS = [
  {key:'append', title:'append(x)', desc: 'Adds a single item to the very end of the list.', fields:[{n:'value', label:'Item Name', type:'text', ph:'Diamond'}]},
  {key:'access', title:'list[i]', desc: 'Gets the item at the specific index.', fields:[{n:'index', label:'Index', type:'number', ph:'0'}]},
  {key:'update', title:'list[i] = x', desc: 'Replaces the item at the specific index with a new item.', fields:[{n:'index', label:'Index', type:'number', ph:'0'}, {n:'value', label:'New Item Name', type:'text', ph:'Apple'}]},
  {key:'len', title:'len(list)', desc: 'Returns the total number of items in the list.', fields:[]},
  {key:'contains', title:'x in list', desc: 'Checks if an item exists in the list (returns True/False).', fields:[{n:'value', label:'Item Name', type:'text', ph:'Wood'}]},
  {key:'index', title:'index(x)', desc: 'Finds the first index where the item appears.', fields:[{n:'value', label:'Item Name', type:'text', ph:'Stone'}]},
  {key:'count', title:'count(x)', desc: 'Counts how many times an item appears in the list.', fields:[{n:'value', label:'Item Name', type:'text', ph:'Wood'}]},
  {key:'insert', title:'insert(i, x)', desc: 'Squeezes an item in at the specific index, pushing everything else to the right.', fields:[{n:'index', label:'Index', type:'number', ph:'0'}, {n:'value', label:'Item Name', type:'text', ph:'Sword'}]},
  {key:'remove', title:'remove(x)', desc: 'Finds and deletes the first matching item in the list.', fields:[{n:'value', label:'Item Name', type:'text', ph:'Wood'}]},
  {key:'popLast', title:'pop()', desc: 'Removes and returns the very last item in the list.', fields:[]},
  {key:'popIndex', title:'pop(i)', desc: 'Removes and returns the item at a specific index.', fields:[{n:'index', label:'Index', type:'number', ph:'0'}]},
  {key:'del', title:'del list[i]', desc: 'Deletes an item at a specific index without returning it.', fields:[{n:'index', label:'Index', type:'number', ph:'0'}]},
  {key:'slice', title:'list[a:b]', desc: 'Creates a new list holding a slice of items from index A to B (not including B).', fields:[{n:'a', label:'Start (empty=0)', type:'text', ph:''},{n:'b', label:'Stop (empty=end)', type:'text', ph:''}]},
  {key:'copy', title:'copy()', desc: 'Creates a full shallow copy of the entire list.', fields:[]},
  {key:'extend', title:'extend(iter)', desc: 'Adds all items from another list/iterable to the end.', fields:[{n:'iter', label:'Comma separated items', type:'text', ph:'Iron,Apple'}]},
  {key:'reverse', title:'reverse()', desc: 'Flips the entire list backwards, directly modifying the original list.', fields:[]},
  {key:'sort', title:'sort()', desc: 'Sorts the items alphabetically/numerically, directly modifying the original list.', fields:[]},
  {key:'clear', title:'clear()', desc: 'Deletes every item, leaving an empty list.', fields:[]}
];

export default function CreativeSandbox() {
  const [items, setItems] = useState([]);
  const [speed, setSpeed] = useState(1);
  const [history, setHistory] = useState([{ label: "inventory = ['Wood', 'Stone']" }]);
  const [codeLine, setCodeLine] = useState("inventory = ['Wood', 'Stone']");
  const [opPill, setOpPill] = useState("ready");
  const [highlight, setHighlight] = useState(null);
  const [errBanner, setErrBanner] = useState("");
  const [explainData, setExplainData] = useState(null);
  
  // Keep track of form values per operation group
  const [formValues, setFormValues] = useState({});

  // Uid generator ref
  const uidCounter = useRef(1);
  const historyListRef = useRef(null);

  // Initialize with Wood and Stone
  useEffect(() => {
    setItems([
      {id: uidCounter.current++, value: 'Wood', icon: getIcon('Wood')},
      {id: uidCounter.current++, value: 'Stone', icon: getIcon('Stone')}
    ]);
  }, []);

  // Auto-scroll history
  useEffect(() => {
    if (historyListRef.current) {
      historyListRef.current.scrollTop = historyListRef.current.scrollHeight;
    }
  }, [history]);

  const handleInputChange = (opKey, fieldName, value) => {
    setFormValues(prev => ({
      ...prev,
      [`${opKey}-${fieldName}`]: value
    }));
  };

  const resetSandbox = () => {
    setItems([]);
    setHistory([{ label: "inventory = []" }]);
    setCodeLine("inventory = []");
    setErrBanner("");
    setExplainData(null);
    setHighlight(null);
    setOpPill("ready");
  };

  const handleRunOp = (opKey) => {
    const group = OP_GROUPS.find(g => g.key === opKey);
    const params = {};
    group.fields.forEach(f => {
      const rawVal = formValues[`${opKey}-${f.n}`] !== undefined ? formValues[`${opKey}-${f.n}`] : f.ph;
      params[f.n] = f.type === 'number' && rawVal !== '' ? Number(rawVal) : rawVal;
    });

    setErrBanner("");
    setHighlight(null);
    
    // We need to work with a copy to safely mutate logic then push to state
    let nextItems = [...items];
    let code = '', what = '', nextHighlight = null;
    const n = nextItems.length;

    try {
      if (opKey === 'append') {
        const v = params.value;
        code = `inventory.append('${v}')`;
        const item = {id: uidCounter.current++, value: v, icon: getIcon(v)};
        nextItems.push(item);
        what = `'${v}' appended to the end.`;
        nextHighlight = {type:'add', ids:[item.id], bounceIds:[item.id]};
      }
      else if (opKey === 'insert') {
        let i = params.index; i = Math.max(0, Math.min(i, n));
        const v = params.value;
        code = `inventory.insert(${i}, '${v}')`;
        const item = {id: uidCounter.current++, value: v, icon: getIcon(v)};
        nextItems.splice(i, 0, item);
        const movedIds = nextItems.slice(i+1).map(it=>it.id);
        what = `'${v}' inserted at index ${i}.`;
        nextHighlight = {type:'add', ids:[item.id], bounceIds: movedIds};
      }
      else if (opKey === 'popLast') {
        if(n === 0) throw new Error("Inventory is empty!");
        code = `inventory.pop()`;
        const removed = nextItems[n-1];
        nextHighlight = {type:'del', ids:[removed.id]};
        nextItems.pop();
        what = `Last item ('${removed.value}') popped out.`;
      }
      else if (opKey === 'popIndex') {
        let i = params.index;
        if(i < 0 || i >= n) throw new Error("Index out of bounds!");
        code = `inventory.pop(${i})`;
        const removed = nextItems[i];
        const movedIds = nextItems.slice(i+1).map(it=>it.id);
        nextHighlight = {type:'del', ids:[removed.id], bounceIds: movedIds};
        nextItems.splice(i, 1);
        what = `Item at index ${i} ('${removed.value}') popped.`;
      }
      else if (opKey === 'remove') {
        const v = params.value;
        const idx = nextItems.findIndex(it => it.value === v);
        if(idx === -1) throw new Error(`'${v}' not found in inventory!`);
        code = `inventory.remove('${v}')`;
        const removed = nextItems[idx];
        const movedIds = nextItems.slice(idx+1).map(it=>it.id);
        nextHighlight = {type:'del', ids:[removed.id], bounceIds: movedIds};
        nextItems.splice(idx, 1);
        what = `First instance of '${v}' removed.`;
      }
      else if (opKey === 'clear') {
        code = `inventory.clear()`;
        const ids = nextItems.map(i=>i.id);
        nextHighlight = {type:'del', ids};
        nextItems = [];
        what = `Inventory completely cleared.`;
      }
      else if (opKey === 'access') {
        let i = params.index;
        if(i < 0 || i >= n) throw new Error("Index out of bounds!");
        code = `inventory[${i}]`;
        what = `Accessed index ${i}: '${nextItems[i].value}'.`;
        nextHighlight = {type:'access', ids:[nextItems[i].id], bounceIds:[nextItems[i].id]};
      }
      else if (opKey === 'update') {
        let i = params.index;
        if(i < 0 || i >= n) throw new Error("Index out of bounds!");
        const v = params.value;
        code = `inventory[${i}] = '${v}'`;
        // Must replace object for React state change detection
        nextItems[i] = { ...nextItems[i], value: v, icon: getIcon(v) };
        what = `Index ${i} updated to '${v}'.`;
        nextHighlight = {type:'update', ids:[nextItems[i].id], bounceIds:[nextItems[i].id]};
      }
      else if (opKey === 'len') {
        code = `len(inventory)`;
        what = `Length is ${n}.`;
        nextHighlight = {type:'access', ids: nextItems.map(i=>i.id)};
      }
      else if (opKey === 'contains') {
        const v = params.value;
        const idx = nextItems.findIndex(it=>it.value===v);
        code = `'${v}' in inventory`;
        what = idx === -1 ? `False ('${v}' not found).` : `True (found at index ${idx}).`;
        nextHighlight = idx === -1 ? {type:'search', ids: nextItems.map(i=>i.id)} : {type:'search', ids:[nextItems[idx].id], bounceIds:[nextItems[idx].id]};
      }
      else if (opKey === 'index') {
        const v = params.value;
        const idx = nextItems.findIndex(it=>it.value===v);
        if(idx === -1) throw new Error(`'${v}' not in list!`);
        code = `inventory.index('${v}')`;
        what = `Found at index ${idx}.`;
        nextHighlight = {type:'search', ids:[nextItems[idx].id], bounceIds:[nextItems[idx].id]};
      }
      else if (opKey === 'count') {
        const v = params.value;
        const matches = nextItems.filter(it=>it.value===v);
        code = `inventory.count('${v}')`;
        what = `Counted ${matches.length} instance(s) of '${v}'.`;
        nextHighlight = {type:'search', ids: matches.map(m=>m.id), bounceIds: matches.map(m=>m.id)};
      }
      else if (opKey === 'del') {
        let i = params.index;
        if(i < 0 || i >= n) throw new Error("Index out of bounds!");
        code = `del inventory[${i}]`;
        const removed = nextItems[i];
        const movedIds = nextItems.slice(i+1).map(it=>it.id);
        nextHighlight = {type:'del', ids:[removed.id], bounceIds: movedIds};
        nextItems.splice(i, 1);
        what = `Item at index ${i} deleted.`;
      }
      else if (opKey === 'slice') {
        const start = params.a === '' ? 0 : Number(params.a);
        const stop = params.b === '' ? n : Number(params.b);
        code = `inventory[${params.a}:${params.b}]`;
        const sliceIds = [];
        for(let i=Math.max(0, start); i<Math.min(n, stop); i++) sliceIds.push(nextItems[i].id);
        what = `Sliced ${sliceIds.length} item(s) to a new list.`;
        nextHighlight = {type:'access', ids: sliceIds, bounceIds: sliceIds};
      }
      else if (opKey === 'copy') {
        code = `inventory.copy()`;
        what = `Created a shallow copy of the inventory.`;
        nextHighlight = {type:'access', ids: nextItems.map(i=>i.id)};
      }
      else if (opKey === 'extend') {
        const listStr = params.iter; // e.g. "Diamond,Iron"
        const arr = listStr.split(',').map(s=>s.trim()).filter(Boolean);
        code = `inventory.extend(['${arr.join("', '")}'])`;
        const newItems = arr.map(v => ({id: uidCounter.current++, value: v, icon: getIcon(v)}));
        nextItems.push(...newItems);
        what = `Extended inventory with ${arr.length} new items.`;
        nextHighlight = {type:'add', ids: newItems.map(i=>i.id), bounceIds: newItems.map(i=>i.id)};
      }
      else if (opKey === 'reverse') {
        code = `inventory.reverse()`;
        nextItems.reverse();
        what = `Inventory order reversed in place.`;
        nextHighlight = {type:'sort', ids: nextItems.map(i=>i.id)};
      }
      else if (opKey === 'sort') {
        code = `inventory.sort()`;
        nextItems.sort((a,b)=> a.value.localeCompare(b.value));
        what = `Inventory sorted alphabetically in place.`;
        nextHighlight = {type:'sort', ids: nextItems.map(i=>i.id)};
      }
      
      // Update state
      setItems(nextItems);
      setCodeLine(code);
      setOpPill(OPS[opKey].label);
      setHighlight(nextHighlight);
      setExplainData({ what, complexity: OPS[opKey].complexity });
      setHistory(prev => [...prev, { label: code }]);

    } catch (e) {
      setErrBanner(e.message);
    }
  };

  return (
    <div className="grid sandbox-layout">
      {/* LEFT CONTROLS */}
      <div>
        <div className="panel" style={{ padding: '16px' }}>
          <h2>Crafting Operations</h2>
          <div id="op-groups">
            {OP_GROUPS.map(g => (
              <details key={g.key} className="op-group">
                <summary>{g.title} <span className="chev">▶</span></summary>
                <div className="op-body">
                  <div style={{ fontSize: '16px', color: '#555', marginBottom: '8px', fontStyle: 'italic' }}>
                    {g.desc}
                  </div>
                  {g.fields.map(f => (
                    <div key={f.n}>
                      <label>{f.label}</label>
                      <input 
                        type={f.type} 
                        placeholder={f.ph}
                        value={formValues[`${g.key}-${f.n}`] !== undefined ? formValues[`${g.key}-${f.n}`] : f.ph}
                        onChange={e => handleInputChange(g.key, f.n, e.target.value)}
                      />
                    </div>
                  ))}
                  <button className="runbtn" onClick={() => handleRunOp(g.key)}>Run</button>
                </div>
              </details>
            ))}
          </div>
        </div>
        
        <div className="panel">
          <h2>Game Speed</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span>Slow</span>
            <input 
              type="range" 
              min="0.4" 
              max="2.5" 
              step="0.1" 
              value={speed} 
              onChange={e => setSpeed(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span>Fast</span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <button className="runbtn" style={{ width: '100%' }} onClick={resetSandbox}>
              🗑 Drop All Items
            </button>
          </div>
        </div>
        
        <div className="panel">
          <h2>Server Log</h2>
          <div className="history-list" ref={historyListRef}>
            {history.map((h, idx) => (
              <div key={idx} className={`history-item ${idx === history.length - 1 ? 'current' : ''}`}>
                {idx === 0 ? '' : '> '}{h.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT STAGE */}
      <div>
        <Stage 
          items={items}
          speed={speed}
          highlight={highlight}
          codeLine={codeLine}
          metaPills={[
            { text: `len = ${items.length}` },
            { text: opPill, style: { background: '#3f9a3f' } }
          ]}
        />
        
        {errBanner && (
          <div id="errBanner">
            <div><b>Error:</b> {errBanner}</div>
          </div>
        )}

        <div className="panel" style={{ marginTop: '20px' }}>
          <h2>Command Output</h2>
          <div className="explain-grid">
            {explainData && (
              <>
                <div className="exp-card">
                  <div className="k">What happened</div>
                  <div className="v">{explainData.what}</div>
                </div>
                <div className="exp-card">
                  <div className="k">Time Complexity</div>
                  <div className="v mono">{explainData.complexity}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
