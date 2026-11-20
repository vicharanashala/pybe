// Shared defensive storage for story-specific notes; it does not prescribe a flow.
export function readStoryState(storage,collection,slot,fallback){
 try{const value=JSON.parse(storage.getItem(`pybe-learning-v1:${collection}:${slot}`));if(value===null)return fallback;if(Array.isArray(fallback))return Array.isArray(value)?value:fallback;if(fallback&&typeof fallback==='object')return value&&typeof value==='object'&&!Array.isArray(value)?value:fallback;return typeof value===typeof fallback?value:fallback;}catch{return fallback;}
}
export function saveStoryState(storage,collection,slot,value){try{storage.setItem(`pybe-learning-v1:${collection}:${slot}`,JSON.stringify(value));return true;}catch{return false;}}
