import React from 'react';
// Small local vector illustrations render without emoji or external font support.
export default function Icon({kind}) {
 let art;
 if(['🧺','🍬'].includes(kind))art=<><path d="M8 25h48l-6 29H14Z" fill="#cf9863"/><path d="M19 27c0-25 26-25 26 0" fill="none" stroke="#f6d3a0" strokeWidth="5"/><path d="M23 31v17m10-17v17m10-17v17M13 39h38" stroke="#795433" strokeWidth="3"/>{kind==='🍬'&&<circle cx="32" cy="20" r="10" fill="#f1bb56"/>}</>;
 else if(['🪙','💰','➖'].includes(kind))art=<><circle cx="32" cy="32" r="25" fill="#e4ad59" stroke="#ffe1a1" strokeWidth="4"/><circle cx="32" cy="32" r="18" fill="none" stroke="#9a682b" strokeWidth="2"/><text x="32" y="39" textAnchor="middle" fill="#553e20" fontSize="21" fontWeight="bold">{kind==='🪙'?'0':kind==='➖'?'−1':'10'}</text></>;
 else if(['📄','🏷️','🔖'].includes(kind))art=<><rect x="14" y="7" width="36" height="50" rx="5" fill="#eed8ba"/><path d="M22 18h20M22 45h20" stroke="#ad8161" strokeWidth="3"/>{kind!=='📄'&&<text x="32" y="36" textAnchor="middle" fill="#704a35" fontSize="15" fontWeight="bold">{kind==='🔖'?'0':'Asha'}</text>}</>;
 else if(kind==='🤲')art=<><path d="M5 39l10 13h31l13-13M5 39l7-8 12 9h16l12-9 7 8" stroke="#edbd90" strokeWidth="6" strokeLinecap="round" fill="none"/><circle cx="32" cy="19" r="10" stroke="#8e9fb3" strokeWidth="3" strokeDasharray="4 4" fill="none"/></>;
 else if(kind==='🚫')art=<><circle cx="32" cy="32" r="24" stroke="#e99e97" strokeWidth="6" fill="none"/><path d="M15 15l34 34" stroke="#e99e97" strokeWidth="6"/></>;
 else if(kind==='🎟️')art=<><path d="M5 15h54v12c-10 0-10 10 0 10v12H5V37c10 0 10-10 0-10Z" fill="#f3c28c"/><path d="M42 17v30" stroke="#875f42" strokeDasharray="4 3" strokeWidth="2"/><text x="25" y="38" textAnchor="middle" fontSize="18" fill="#684b39">★</text></>;
 else if(kind==='🎗️')art=<><path d="M20 12l-9 43 20-10 22 10-10-43" fill="#97cfb7"/><circle cx="32" cy="22" r="16" fill="#d7edcf"/><text x="32" y="26" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#355f4a">VIP</text></>;
 else if(['🔔','🔕'].includes(kind))art=<><path d="M12 45h40l-7-12V25c0-20-26-20-26 0v8Z" fill="#edbd69"/><circle cx="32" cy="51" r="6" fill="#ffda94"/>{kind==='🔕'&&<path d="M10 9l44 46" stroke="#e49793" strokeWidth="5"/>}</>;
 else if(['🚶','🏃'].includes(kind))art=<><circle cx="34" cy="10" r="7" fill="#f2c69e"/><path d="M31 23l-8 15 13 6 9 13M31 23l6 11 15-5M31 23L16 27 9 38M25 38l-6 18" stroke="#f3c89a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M31 21l-6 13" stroke="#97d5c2" strokeWidth="10"/></>;
 else if(kind==='🪔')art=<><path d="M8 35h48C48 59 17 59 8 35" fill="#cd8976"/><path d="M32 34C12 28 34 4 34 4c17 23 10 30-2 30" fill="#ffd185"/></>;
 else if(kind==='📦')art=<><path d="M8 20l24-12 24 12v29L32 59 8 49Z" fill="#d9a66d"/><path d="M8 20l24 12 24-12M32 32v27M20 14l24 12v13" fill="none" stroke="#775338" strokeWidth="3"/></>;
 else art=<><path d="M5 31L32 8l27 23v25H5Z" fill="#b87979"/><path d="M16 29L32 8l16 21" fill="#edc18c"/><path d="M24 56V35h16v21" fill="#283545"/></>;
 return <svg className="iconSvg" viewBox="0 0 64 64" aria-hidden="true">{art}</svg>
}
