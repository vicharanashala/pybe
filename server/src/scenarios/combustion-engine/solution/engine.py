import asyncio
import time

async def run_cylinder(cylinder_id, initial_delay=0.0):
    """Simulates a 4-stroke engine cylinder."""
    # Offset the start so they don't fire at the exact same time
    if initial_delay > 0:
        await asyncio.sleep(initial_delay)
    
    strokes = ["Intake", "Compression", "Power", "Exhaust"]
    
    # Run the engine for 3 full cycles
    for cycle in range(1, 4):
        for stroke in strokes:
            print(f"[{time.time():.2f}] Cylinder {cylinder_id} | Cycle {cycle} | {stroke}")
            # The cylinder yields control back to the event loop while it "moves"
            await asyncio.sleep(0.1)

async def main():
    print("Starting V4 Engine...")
    start_time = time.time()
    
    # Firing order: 1 - 3 - 4 - 2
    # Cylinder 1 starts immediately (0.0s)
    # Cylinder 3 starts at 0.1s
    # Cylinder 4 starts at 0.2s
    # Cylinder 2 starts at 0.3s
    
    tasks = [
        run_cylinder(1, 0.0),
        run_cylinder(3, 0.1),
        run_cylinder(4, 0.2),
        run_cylinder(2, 0.3)
    ]
    
    # Run all cylinders concurrently
    await asyncio.gather(*tasks)
    
    end_time = time.time()
    print(f"Engine stopped. Total run time: {end_time - start_time:.2f} seconds.")

if __name__ == "__main__":
    # Start the event loop (the crankshaft)
    asyncio.run(main())
