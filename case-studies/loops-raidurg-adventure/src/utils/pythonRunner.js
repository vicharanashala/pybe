import {runPython} from '../../../../library/learning/python-client.mjs';
import {validateOutput} from '../../../../library/learning/core.mjs';
// The three supplied programs run in the same isolated worker as every other lab.
// Judge actual stdout and Python syntax trees, never fabricated keyword output.
const stations=['Ameerpet','Madhura Nagar','Yusufguda','Road No. 5 Jubilee Hills','Jubilee Hills Check Post','Peddamma Gudi','Madhapur','Durgam Cheruvu','HITEC City','Raidurg'];
export const LOOP_CHECKS={
  while_metro:{expected:stations.map(s=>'Checking station: '+s).join('\n')+'\nReached Raidurg!',kind:'while'},
  for_friends:{expected:['Samosa','Puff','Dosa','Juice','Biryani'].map(d=>'Preparing dish: '+d).join('\n'),kind:'for'},
  nested_seats:{expected:Array.from({length:5},(_,r)=>Array.from({length:6},(_,s)=>`Row ${r+1} Seat ${s+1} checked`)).flat().join('\n'),kind:'nested'}
};
export async function executePythonCode(code,testType){
  const check=LOOP_CHECKS[testType];
  if(!check)return {stdout:[],errors:['This challenge has no check defined.'],isPassed:false};
  const marker='__PYBE_RAIDURG_SYNTAX__';
  const inspection=`\nimport ast as _pybe_ast\n_pybe_tree=_pybe_ast.parse(${JSON.stringify(code)})\n_pybe_nodes=list(_pybe_ast.walk(_pybe_tree))\n_pybe_kind=${JSON.stringify(check.kind)}\n_pybe_valid=any(isinstance(n,_pybe_ast.While) for n in _pybe_nodes) if _pybe_kind=='while' else any(isinstance(n,_pybe_ast.For) for n in _pybe_nodes) if _pybe_kind=='for' else any(isinstance(n,_pybe_ast.For) and any(isinstance(inner,_pybe_ast.For) for child in n.body for inner in _pybe_ast.walk(child)) for n in _pybe_nodes)\nprint(${JSON.stringify(marker)}+str(_pybe_valid))`;
  const result=await runPython(code+inspection);
  if(result.error)return {stdout:result.output.trimEnd().split('\n').filter(Boolean),errors:[result.error],isPassed:false};
  const index=result.output.lastIndexOf(marker),output=index<0?result.output:result.output.slice(0,index);
  const structure=index>=0&&result.output.slice(index+marker.length).trim()==='True';
  const matches=validateOutput({type:'exact',expected:check.expected},output).valid;
  return {stdout:output.trimEnd().split('\n').filter(Boolean),errors:matches&&structure?[]:['Compare the loop structure and printed results with the task. Use the hint if you need it.'],isPassed:matches&&structure};
}
