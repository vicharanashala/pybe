import {runPython} from '../../../../../library/learning/python-client.mjs';
import {validateOutput} from '../../../../../library/learning/core.mjs';

// Keep each authored check, executing code in the common isolated worker.
export async function checkResult(code,check){
  if(!check)return {passed:false,message:'This task has no check defined.',output:''};
  if(check.type==='output-equals'){
    const actual=await runPython(code);
    if(actual.error)return {passed:false,message:actual.error,output:actual.output};
    const {valid}=validateOutput({type:'exact',expected:check.expected},actual.output);
    return {passed:valid,message:valid?(check.message||'Correct!'):`Expected output:\n${check.expected}\n\nGot:\n${actual.output||'(nothing printed)'}`,output:actual.output};
  }
  if(check.type==='py-check'){
    const marker='__PYBE_BETAAL_CHECK__';
    const actual=await runPython(code+'\n'+check.code+'\nimport json as _pybe_json\nprint("'+marker+'" + _pybe_json.dumps({"passed": bool(__pybe_pass), "message": globals().get("__pybe_message")}))');
    if(actual.error)return {passed:false,message:actual.error,output:actual.output};
    const index=actual.output.lastIndexOf(marker);
    if(index<0)return {passed:false,message:'The exercise check did not finish.',output:actual.output};
    const result=JSON.parse(actual.output.slice(index+marker.length).trim());
    return {passed:result.passed,message:result.passed?(check.message||'Correct!'):(result.message||check.failMessage||'Check the logic and try again.'),output:actual.output.slice(0,index)};
  }
  return {passed:false,message:'Unknown check type.',output:''};
}

export function computeProgress(stories, sessions) {
  const statusByStory = {};
  (stories || []).forEach((story) => {
    statusByStory[story.id] = { riddle: false, challenge: false, project: false };
  });

  (sessions || []).forEach((session) => {
    const status = statusByStory[session.storyId];
    if (!status) return;
    if (session.event === 'riddle' && session.passed) status.riddle = true;
    if (session.event === 'challenge' && session.passed) status.challenge = true;
    if (session.event === 'project' && session.passed) status.project = true;
  });

  const completed = Object.values(statusByStory).filter(
    (status) => status.riddle && status.challenge && status.project
  ).length;

  return { statusByStory, completed };
}
