export default function Logo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M32 6C20 6 20 14 20 14V22H32" stroke="#3d5af1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 58C44 58 44 50 44 50V42H32" stroke="#ffc93c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="22" width="18" height="10" rx="4" fill="#3d5af1" />
      <rect x="32" y="32" width="18" height="10" rx="4" fill="#ffc93c" />
      <circle cx="19" cy="27" r="1.6" fill="#ffffff" />
      <circle cx="45" cy="37" r="1.6" fill="#1c2140" />
    </svg>
  );
}
