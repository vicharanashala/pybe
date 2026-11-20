import React from 'react';
import AuthoredStory from '../AuthoredStory.jsx';
import Story from '../../../../case-studies/polymorphism-and-truthiness-dashavatara-and-mela/dashavatara-polymorphism/src/DashavataraStory.jsx';
import styles from '../../../../case-studies/polymorphism-and-truthiness-dashavatara-and-mela/dashavatara-polymorphism/src/styles.css';
import commonTheme from '../themes/chapter-story.css';
const theme=commonTheme+`:host{--accent:#b24e25;--danger:#b83c31}.top{background:#fcf8f2;position:relative;top:auto}.bar{position:relative;top:auto}.visual{color:#eaf2fb;--text:#eaf2fb}.binary button,.miniTree{background:#fff5eb;color:#30271f}.miniTree{border:1px solid #eadbce}.reflection textarea{color:#30271f}.formula{color:#30271f}`;
export default function DashavataraStory({onComplete}){
  return <AuthoredStory styles={[styles]} theme={theme} completionHeading="You can now see polymorphism." onComplete={onComplete}><Story/></AuthoredStory>;
}
