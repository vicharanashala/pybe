// Static sample data — no backend, no API.

export const SAMPLE_PLATES = ["MH-18-CD-4567", "MH-20-EF-7890", "MH-18-AB-1234"];

export const FINAL_PLATES = ["MH-18-CD-4567", "XX-22-AB-1111"];

export function verifyCar(plate) {
  // Mirrors:
  //   def verify_car(vehicle_number):
  //       if vehicle_number.startswith("MH"):
  //           return "ACCESS GRANTED"
  //       else:
  //           return "ACCESS DENIED"
  return plate.startsWith("MH") ? "ACCESS GRANTED" : "ACCESS DENIED";
}
