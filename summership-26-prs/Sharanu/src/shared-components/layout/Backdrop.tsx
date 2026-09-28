import kurukshetraBackdrop from "../../assets/illustrations/kurukshetra-backdrop.png";

export default function Backdrop() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <img
        src={kurukshetraBackdrop}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Light, even scrim — just enough to keep glass cards legible without
          burying the artwork under a heavy dark wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,18,32,0.35) 0%, rgba(11,18,32,0.45) 50%, rgba(11,18,32,0.6) 100%)",
        }}
      />
      {/* Darken behind the guide panel specifically, so it reads as its own surface */}
      <div
        className="absolute inset-y-0 left-0 hidden lg:block"
        style={{
          width: 340,
          background: "linear-gradient(90deg, rgba(11,18,32,0.75) 55%, rgba(11,18,32,0) 100%)",
        }}
      />
    </div>
  );
}