import React from 'react';
import AuthoredStory from '../AuthoredStory.jsx';
import Story from '../../../../case-studies/classes-and-inheritance-squad-and-bird-family/client/src/InheritanceLesson.jsx';
import styles from '../../../../case-studies/classes-and-inheritance-squad-and-bird-family/client/src/App.css';
const theme=`:host{position:relative;isolation:isolate;--bg:#fffaf3;--ink:#382b21;--ink-soft:#705a46;--amber:#df622f;--teal:#c45b19;--teal-deep:#9a4211;--card-border:#e7cfb5;--card-bg:#fffdf9;--code-bg:#29241f;--code-ink:#f1f0ed}.app-shell{min-height:0;padding:24px 16px 40px;background:#fffaf3}.app-header{padding:0}.btn-primary{background:#c45b19;color:#fffdf9;border-color:#c45b19}.card{box-shadow:0 8px 24px #59371512}.app-shell button{scroll-margin:140px}.app-main{min-width:0}.jargon-modal-backdrop{position:absolute;inset:0}@media(max-width:760px){.app-shell{padding:18px 10px 28px}.card{padding:20px 14px}.simulator-grid{grid-template-columns:minmax(0,1fr)}.app-header{flex-wrap:wrap;gap:12px}.feather-trail{flex-wrap:wrap}.code-block,pre{max-width:100%;overflow:auto}.card-title{font-size:28px}.level-map-row{min-width:0}.trait-card,.dna-splicer{max-width:100%}}`;
export default function BirdFamily({onComplete}){
 const revisit=()=>{localStorage.removeItem('pybe-learning-v1:sign-squad-stage');localStorage.removeItem('pybe_classes_stage');location.hash='#study/story-d212101de2e2efa4';};
 return <AuthoredStory styles={[styles]} theme={theme}><Story onComplete={onComplete} onRevisitClasses={revisit}/></AuthoredStory>;
}
