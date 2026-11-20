import React from 'react';
import AuthoredStory from '../AuthoredStory.jsx';
import Story from '../../../../case-studies/exceptions-dasara-festival/src/App.jsx';
import tokens from '../../../../case-studies/exceptions-dasara-festival/src/styles/tokens.css';
import base from '../../../../case-studies/exceptions-dasara-festival/src/styles/base.css';
import animations from '../../../../case-studies/exceptions-dasara-festival/src/styles/animations.css';
import screens from '../../../../case-studies/exceptions-dasara-festival/src/styles/screens.css';
const theme=`.question-header-details,.question-prompt-text,.result-info{min-width:0}.pybe-pre-inline{white-space:pre-wrap;overflow-wrap:anywhere;max-width:100%}.result-buttons{flex-wrap:wrap}:host{--clr-bg:#fffaf3;--clr-accent:#c45b19;--clr-accent-hover:#9a4211;--clr-accent-dim:#fff0df;--clr-accent-border:#e7cfb5;--clr-border-focus:#df622f;--clr-text-primary:#382b21;--clr-text-secondary:#705a46}.site-header{position:relative;top:auto}.app-shell{min-height:0}.site-main{min-height:0}.site-footer{position:relative}.screen{min-height:0}.pybe-terminal-box{max-width:100%;overflow:auto}.pybe-primary-btn,.btn-primary{background:#c45b19;border-color:#c45b19;color:white}button{scroll-margin:130px}@media(max-width:600px){.pybe-result-banner{flex-direction:column;align-items:flex-start}.header-inner{flex-wrap:wrap;gap:12px}.chapter-nav{order:3;width:100%}.pybe-single-column{padding:0}.screen{padding:16px 10px}.pybe-story-title{font-size:28px}.pybe-card{min-width:0}.pybe-pre{max-width:100%;overflow:auto}}`;
export default function DasaraFestival({onComplete}){
  return <AuthoredStory styles={[tokens,base,animations,screens]} theme={theme}><Story onComplete={onComplete}/></AuthoredStory>;
}
