import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {values,evaluate} from '../src/semantics.js';
test('all example truth values agree with real Python',()=>{
 const actual=JSON.parse(execFileSync('python3',['-c',`import json\nprint(json.dumps([bool(v) for v in [${values.map(v=>v.code).join(',')}]]))`],{encoding:'utf8'}));
 assert.deepEqual(values.map(v=>v.truth),actual);
});
test('every lab combination matches Python result, type and lazy evaluation',()=>{
 const cases=[];
 for(const a of values)for(const op of ['and','or'])for(const b of values)cases.push({a,op,b});
 const py=`import json\ncases=json.loads(${JSON.stringify(JSON.stringify(cases.map(c=>[c.a.code,c.op,c.b.code])))})\nout=[]\nfor a,op,b in cases:\n    visited=[]\n    def second():\n        visited.append(True)\n        return eval(b)\n    result=eval(a+' '+op+' second()')\n    out.append([result,type(result).__name__,bool(visited)])\nprint(json.dumps(out))`;
 const actual=JSON.parse(execFileSync('python3',['-c',py],{encoding:'utf8'}));
 cases.forEach((c,i)=>{
  const r=evaluate(c.a,c.op,c.b);
  const expectedValue=JSON.parse(execFileSync('python3',['-c',`import json; print(json.dumps(${r.value.code}))`],{encoding:'utf8'}));
  assert.deepEqual([expectedValue,r.value.type,r.rightEvaluated],actual[i],`${c.a.code} ${c.op} ${c.b.code}`);
  assert.equal(r.value,r.rightEvaluated?c.b:c.a);
 });
});
