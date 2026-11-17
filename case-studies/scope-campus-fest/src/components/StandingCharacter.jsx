import React from 'react';
import kabir1Img from '../../assets/kabir1.png';
import priya1Img from '../../assets/priya1.png';
import other1Img from '../../assets/other1.png';
import other2Img from '../../assets/other2.png';

export default function StandingCharacter({ character, style = {} }) {
  let imgUrl = kabir1Img;

  if (character === 'Kabir' || character === 'kabir') {
    imgUrl = kabir1Img;
  } else if (character === 'Priya' || character === 'priya') {
    imgUrl = priya1Img;
  } else if (character === 'Sprint Participant' || character === 'other 1' || character === 'other1') {
    imgUrl = other1Img;
  } else if (character === 'Faculty Coordinator' || character === 'other 2' || character === 'other2') {
    imgUrl = other2Img;
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '0px',
        left: '20px',
        width: '320px',
        height: '250px',
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: 'auto 100%',
        backgroundPosition: 'bottom center',
        backgroundRepeat: 'no-repeat',
        zIndex: 5,
        filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.5))',
        pointerEvents: 'none',
        ...style
      }}
    />
  );
}
