import manorImage from '../assets/manor-rosewood.jpg';
import minaImage from '../assets/suspect_mina.jpg';
import devImage from '../assets/suspect_dev.jpg';
import irisImage from '../assets/suspect_iris.jpg';
import ronanImage from '../assets/suspect_ronan.jpg';
import piaImage from '../assets/suspect_pia.jpg';

export const manorAsset = manorImage;

export const suspectImages = {
  mina: minaImage,
  dev: devImage,
  iris: irisImage,
  ronan: ronanImage,
  pia: piaImage
};

export const suspectIdFromName = (name = '') => {
  const first = name.split(' ')[0].toLowerCase();
  return first === 'mrs.' ? 'mina' : first;
};
