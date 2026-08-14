export default function FogLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -bottom-1/4 left-0 w-[140%] h-2/3 opacity-30 blur-3xl animate-drift"
        style={{
          background: 'radial-gradient(ellipse at 30% 60%, rgba(122,0,255,0.25), transparent 60%), radial-gradient(ellipse at 70% 40%, rgba(229,9,20,0.18), transparent 55%)',
        }}
      />
      <div
        className="absolute -bottom-1/3 right-0 w-[120%] h-1/2 opacity-20 blur-3xl animate-drift"
        style={{ animationDuration: '30s', animationDirection: 'reverse',
          background: 'radial-gradient(ellipse at 60% 50%, rgba(0,194,255,0.18), transparent 55%)' }}
      />
      <div className="absolute inset-0 noise-bg" />
    </div>
  )
}
