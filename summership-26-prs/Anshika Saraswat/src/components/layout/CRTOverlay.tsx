export default function CRTOverlay() {
  return (
    <div className="crt-overlay crt-flicker" aria-hidden="true">
      <div className="absolute inset-0 animate-scanline opacity-[0.04] bg-gradient-to-b from-transparent via-white to-transparent h-1/3" />
    </div>
  )
}
