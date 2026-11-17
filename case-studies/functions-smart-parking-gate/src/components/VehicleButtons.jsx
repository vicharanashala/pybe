export default function VehicleButtons({ vehicles, selectedPlate, onSelect, disabled }) {
  return (
    <div className="vehicle-row" role="group" aria-label="Choose a vehicle number">
      {vehicles.map((plate) => (
        <button
          key={plate}
          type="button"
          className={`vehicle-chip ${selectedPlate === plate ? "is-selected" : ""}`}
          onClick={() => onSelect(plate)}
          disabled={disabled}
          aria-pressed={selectedPlate === plate}
        >
          {plate}
        </button>
      ))}
    </div>
  );
}
