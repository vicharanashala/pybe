import React from 'react';
import AuthoredStory from '../AuthoredStory.jsx';
import App from '../../../../case-studies/data-visualization-novatech-investor-room/client/src/App.jsx';
import base from '../../../../case-studies/data-visualization-novatech-investor-room/client/src/styles/base.css';
import meeting from '../../../../case-studies/data-visualization-novatech-investor-room/client/src/styles/meeting.css';
import plots from '../../../../case-studies/data-visualization-novatech-investor-room/client/src/styles/plots.css';
import quiz from '../../../../case-studies/data-visualization-novatech-investor-room/client/src/styles/quiz.css';
import outcome from '../../../../case-studies/data-visualization-novatech-investor-room/client/src/styles/outcome.css';
import responsive from '../../../../case-studies/data-visualization-novatech-investor-room/client/src/styles/responsive.css';
const theme=`:host{--navy:#30271f;--teal:#df622f;--coral:#c35a32;--gold:#edb17c;--cream:#fcf8f2;--paper:#fffdf9}.app-shell{min-height:0}.topbar .brand{display:none}.topbar{grid-template-columns:1fr auto}.primary{background:#df622f;color:white}.visual-toolkit{border:1px solid #eadbce;border-radius:16px;padding:20px;background:#fffdf9}.visual-toolkit ul{display:flex;gap:16px;flex-wrap:wrap}.status{justify-content:flex-start}`;
export default function InvestorRoom({onComplete}){
  return <AuthoredStory styles={[base,meeting,plots,quiz,outcome,responsive]} theme={theme} completionHeading="The deal is closed." onComplete={onComplete}><App/></AuthoredStory>;
}
