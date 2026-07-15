import asyncio

async def engine_subsystem():
    print("Engine: Starting diagnostics...")
    await asyncio.sleep(1)
    print("Engine: OK")
    return "Engine Ready"

async def navigation_subsystem():
    print("Nav: Calibrating GPS...")
    await asyncio.sleep(2)
    print("Nav: OK")
    return "Nav Ready"

async def camera_subsystem():
    print("Camera: Initializing feed...")
    await asyncio.sleep(0.5)
    print("Camera: OK")
    return "Camera Ready"

async def telemetry_subsystem():
    print("Telemetry: Connecting to base...")
    await asyncio.sleep(1.5)
    print("Telemetry: OK")
    return "Telemetry Ready"

async def main():
    print("Starting all drone subsystems concurrently...")
    results = await asyncio.gather(
        engine_subsystem(),
        navigation_subsystem(),
        camera_subsystem(),
        telemetry_subsystem()
    )
    print("All subsystems initialized:", results)

if __name__ == "__main__":
    asyncio.run(main())
