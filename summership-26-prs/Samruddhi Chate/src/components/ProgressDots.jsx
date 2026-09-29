export default function ProgressDots({ total, currentIndex }) {
  return (
    <div className="progress-dots" aria-label={`Story progress: part ${currentIndex + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`progress-dot-item ${
            i === currentIndex ? "is-active" : i < currentIndex ? "is-done" : ""
          }`}
        />
      ))}
    </div>
  );
}
