"""
hardware_reader.py Hardware Temperature Reader
==================================================
Reads system hardware data. On Linux, reads from sysfs (/sys/class/thermal).
On other platforms (Windows/macOS), uses a mock that simulates the same
interface, demonstrating the abstraction pattern.

Maslow's hierarchy: this is the "Physiological" layer the raw hardware
that everything else depends on.
"""

import os
import sys
import random
import time
from pathlib import Path


class LinuxThermalReader:
    """
    Reads CPU temperature from Linux sysfs.
    
    On Linux, /sys/class/thermal/thermal_zone*/temp contains the
    temperature in millidegrees Celsius (e.g., 45000 = 45.0°C).
    """
    
    THERMAL_BASE = Path('/sys/class/thermal')
    
    def __init__(self):
        self.zones = self._discover_zones()
    
    def _discover_zones(self):
        """Find all thermal zones in sysfs."""
        zones = []
        if self.THERMAL_BASE.exists():
            for entry in sorted(self.THERMAL_BASE.iterdir()):
                if entry.name.startswith('thermal_zone'):
                    temp_file = entry / 'temp'
                    type_file = entry / 'type'
                    if temp_file.exists():
                        zone_type = 'unknown'
                        if type_file.exists():
                            zone_type = type_file.read_text().strip()
                        zones.append({
                            'name': entry.name,
                            'type': zone_type,
                            'temp_path': str(temp_file),
                        })
        return zones
    
    def read_temperature(self, zone_index=0):
        """Read temperature from a specific thermal zone."""
        if not self.zones:
            raise RuntimeError("No thermal zones found in sysfs")
        
        zone = self.zones[zone_index]
        with open(zone['temp_path'], 'r') as f:
            millidegrees = int(f.read().strip())
        
        return {
            'zone': zone['name'],
            'type': zone['type'],
            'temp_celsius': millidegrees / 1000.0,
            'temp_raw': millidegrees,
            'source': 'sysfs',
        }
    
    def read_all(self):
        """Read temperature from all thermal zones."""
        readings = []
        for i in range(len(self.zones)):
            try:
                readings.append(self.read_temperature(i))
            except Exception as e:
                readings.append({
                    'zone': self.zones[i]['name'],
                    'error': str(e),
                })
        return readings


class MockThermalReader:
    """
    Mock thermal reader for non-Linux platforms (Windows, macOS).
    Simulates realistic temperature readings with thermal dynamics.
    
    In a real application, you'd use:
    - Windows: WMI (Win32_TemperatureProbe) or Open Hardware Monitor
    - macOS: IOKit framework via ctypes
    """
    
    def __init__(self):
        self.base_temp = 42.0  # Base idle temperature
        self.zones = [
            {'name': 'thermal_zone0', 'type': 'cpu-thermal'},
            {'name': 'thermal_zone1', 'type': 'gpu-thermal'},
            {'name': 'thermal_zone2', 'type': 'ssd-thermal'},
        ]
        self._start_time = time.time()
    
    def read_temperature(self, zone_index=0):
        """Generate a realistic mock temperature reading."""
        zone = self.zones[zone_index]
        
        # Simulate temperature with some variation
        elapsed = time.time() - self._start_time
        # CPU tends to be warmer than SSD
        offsets = {'cpu-thermal': 15.0, 'gpu-thermal': 20.0, 'ssd-thermal': 5.0}
        offset = offsets.get(zone['type'], 10.0)
        
        # Add some sinusoidal variation + random noise
        import math
        variation = math.sin(elapsed * 0.5) * 3.0
        noise = random.gauss(0, 0.5)
        
        temp = self.base_temp + offset + variation + noise
        millidegrees = int(temp * 1000)
        
        return {
            'zone': zone['name'],
            'type': zone['type'],
            'temp_celsius': millidegrees / 1000.0,
            'temp_raw': millidegrees,
            'source': 'mock (non-Linux platform)',
        }
    
    def read_all(self):
        """Read all mock thermal zones."""
        return [self.read_temperature(i) for i in range(len(self.zones))]


def get_thermal_reader():
    """
    Factory function: returns the appropriate reader for the current platform.
    This is the abstraction layer code above this doesn't need to know
    whether we're reading real sysfs or using a mock.
    """
    if sys.platform == 'linux':
        reader = LinuxThermalReader()
        if reader.zones:
            return reader
        # Fall back to mock if no zones found (e.g., in a container)
        print("  ⚠️  No thermal zones found; using mock reader.")
    
    return MockThermalReader()


def format_temp_bar(temp, max_temp=100, width=30):
    """Create a simple temperature bar visualization."""
    filled = int((temp / max_temp) * width)
    filled = min(filled, width)
    
    # Color coding via text
    if temp < 50:
        status = "🟢 COOL"
    elif temp < 70:
        status = "🟡 WARM"
    elif temp < 85:
        status = "🟠 HOT"
    else:
        status = "🔴 CRITICAL"
    
    bar = '█' * filled + '░' * (width - filled)
    return f"[{bar}] {temp:.1f}°C {status}"


if __name__ == '__main__':
    print("=" * 60)
    print("  Maslow's Base Layer: Hardware Temperature Reader")
    print("=" * 60)
    print(f"  Platform: {sys.platform}")
    print()
    
    reader = get_thermal_reader()
    
    # Read all thermal zones
    print("  All thermal zones:")
    readings = reader.read_all()
    for reading in readings:
        if 'error' in reading:
            print(f"    {reading['zone']}: ERROR - {reading['error']}")
        else:
            bar = format_temp_bar(reading['temp_celsius'])
            print(f"    {reading['zone']} ({reading['type']}):")
            print(f"      {bar}")
            print(f"      Raw value: {reading['temp_raw']} millidegrees")
            print(f"      Source: {reading['source']}")
    
    # Continuous monitoring (3 readings)
    print(f"\n  --- Continuous Monitoring (3 readings, 1s interval) ---")
    for i in range(3):
        reading = reader.read_temperature(0)
        bar = format_temp_bar(reading['temp_celsius'])
        print(f"    [{i+1}] {reading['type']}: {bar}")
        if i < 2:
            time.sleep(1)
    
    print(f"\n  ✓ Hardware layer operational.")
