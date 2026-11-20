import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import {python} from '@codemirror/lang-python';
const extensions=[python()];
export default function PythonEditor({value,onChange,disabled=false,label='Python program',...props}){return <CodeMirror value={value} onChange={onChange} extensions={extensions} theme="light" aria-label={label} editable={!disabled} {...props}/>;}
