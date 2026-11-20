import React from 'react';
import AuthoredStory from '../AuthoredStory.jsx';
import Story from '../../../../case-studies/polymorphism-and-truthiness-dashavatara-and-mela/village-mela-truthiness/src/MelaStory.jsx';
import styles from '../../../../case-studies/polymorphism-and-truthiness-dashavatara-and-mela/village-mela-truthiness/src/styles.css';
import guided from '../../../../case-studies/polymorphism-and-truthiness-dashavatara-and-mela/village-mela-truthiness/src/guided.css';
const theme=`:host{--panel:#fffdf9;--line:#eadbce;--muted:#766352;--orange:#b24e25;--green:#28714b;color:#30271f}.app{min-height:0}.app>header .brand{display:none}.app>header{justify-content:space-between}.stage,.paper,.bell,.valueCard,.verdict,.stop,.summary>div,fieldset,.guidedChecks article,.wordMap>div,.guidedResult{background:#fffdf9;color:#30271f;border-color:#eadbce}.stage{box-shadow:none}.lead,.summary p,.stop p,.guidedStory p,.guidedChecks p,.thanks p{color:#766352}.note,.guidedStory,.guidedCode{background:#fff0e2;color:#30271f}.controls select,textarea,button{background:#fffdf9;color:#30271f;border-color:#eadbce}.primary{background:#df622f;color:white;border-color:#df622f}.valueCard code,.stop>code{color:#30271f}.skipCheck,.skipped{background:#f7efe7!important;color:#766352}.rules p{background:#fff0e2}.thanks{background:#edf5ee}.lessonLabel{display:block}pre,pre code{color:#f1f0ed}button:disabled{opacity:.55}`;
export default function MelaStory({onComplete}){
  return <AuthoredStory styles={[styles,guided]} theme={theme} completionHeading="Well done. You turned a story into understanding!" onComplete={onComplete}><Story/></AuthoredStory>;
}
