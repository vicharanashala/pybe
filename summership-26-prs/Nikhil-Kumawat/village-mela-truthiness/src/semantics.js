// Explicit Python truth values. Never use JavaScript truthiness for Python lists!
export const values = [
 {id:'empty', code:'[]', truth:false, icon:'🧺', name:'Empty basket', type:'list'},
 {id:'blank', code:'""', truth:false, icon:'📄', name:'Blank name slip', type:'str'},
 {id:'zero', code:'0', truth:false, icon:'🪙', name:'Zero coins', type:'int'},
 {id:'none', code:'None', truth:false, icon:'🤲', name:'Nothing supplied', type:'NoneType'},
 {id:'false', code:'False', truth:false, icon:'🚫', name:'A false flag', type:'bool'},
 {id:'sweet', code:'["laddu"]', truth:true, icon:'🍬', name:'One sweet in a basket', type:'list'},
 {id:'name', code:'"Asha"', truth:true, icon:'🏷️', name:'A filled name slip', type:'str'},
 {id:'coin', code:'10', truth:true, icon:'💰', name:'Ten coins', type:'int'},
 {id:'textzero', code:'"0"', truth:true, icon:'🔖', name:'The text zero', type:'str'},
 {id:'listzero', code:'[0]', truth:true, icon:'🧺', name:'One item, even if zero', type:'list'},
 {id:'negative', code:'-1', truth:true, icon:'➖', name:'A nonzero number', type:'int'},
 {id:'guest', code:'"Guest"', truth:true, icon:'🎪', name:'Fallback name', type:'str'},
 {id:'ticket', code:'"Ticket"', truth:true, icon:'🎟️', name:'Ticket present', type:'str'},
 {id:'band', code:'"VIP"', truth:true, icon:'🎗️', name:'Wristband present', type:'str'},
];
export const getValue = id => values.find(v=>v.id===id);
export function evaluate(left, operator, right) {
 if (!left || !right || !['and','or'].includes(operator)) throw new Error('Unsupported example');
 const rightEvaluated = operator === 'or' ? !left.truth : left.truth;
 return {value:rightEvaluated ? right : left, rightEvaluated};
}
export const questions = [
 {q:'Which basket is truthy?', options:['[]','[0]','None'], correct:1, why:'[0] contains one item. Python checks whether the list is empty, not whether its item is zero.'},
 {q:'What does "" or "Guest" return?', options:['True','""','"Guest"'], correct:2, why:'The empty string is falsy, so or evaluates and returns the second value: "Guest".'},
 {q:'What happens in 0 and ring_bell()?', options:['Returns 0; the bell is skipped','Returns False; the bell rings','Returns True; the bell is skipped'], correct:0, why:'and stops at the falsy first value. It returns the integer 0 without calling ring_bell().'}
];
