"""
cross_platform.py Windows/macOS Hardware Alternatives
========================================================
Different operating systems expose hardware data differently.
This module provides platform-specific implementations for reading
system information, demonstrating the abstraction pattern at each
level of Maslow's stack.
"""

import sys
import os
import platform
import subprocess
import struct


# ============================================================
# Platform Detection
# ============================================================

def get_platform_info():
    """Gather comprehensive platform information."""
    return {
        'system': platform.system(),           # Windows, Linux, Darwin
        'release': platform.release(),         # 10, 5.15.0, 22.1.0
        'machine': platform.machine(),         # AMD64, x86_64, arm64
        'processor': platform.processor(),     # Intel64, x86_64
        'python': platform.python_version(),
        'byte_order': sys.byteorder,           # little or big
        'pointer_size': struct.calcsize('P') * 8,  # 32 or 64 bits
    }


# ============================================================
# Windows: WMI and PowerShell
# ============================================================

class WindowsHardwareReader:
    """
    Reads hardware data on Windows using PowerShell/WMI commands.
    WMI (Windows Management Instrumentation) is the Windows equivalent
    of Linux's sysfs.
    """
    
    @staticmethod
    def get_cpu_info():
        """Read CPU information via WMI."""
        try:
            result = subprocess.run(
                ['powershell', '-Command',
                 'Get-CimInstance Win32_Processor | '
                 'Select-Object Name, NumberOfCores, MaxClockSpeed | '
                 'ConvertTo-Json'],
                capture_output=True, text=True, timeout=10
            )
            if result.returncode == 0:
                return result.stdout.strip()
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
        return None
    
    @staticmethod
    def get_memory_info():
        """Read memory information via WMI."""
        try:
            result = subprocess.run(
                ['powershell', '-Command',
                 'Get-CimInstance Win32_OperatingSystem | '
                 'Select-Object TotalVisibleMemorySize, FreePhysicalMemory | '
                 'ConvertTo-Json'],
                capture_output=True, text=True, timeout=10
            )
            if result.returncode == 0:
                return result.stdout.strip()
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
        return None
    
    @staticmethod
    def get_disk_info():
        """Read disk information via WMI."""
        try:
            result = subprocess.run(
                ['powershell', '-Command',
                 'Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | '
                 'Select-Object DeviceID, Size, FreeSpace | '
                 'ConvertTo-Json'],
                capture_output=True, text=True, timeout=10
            )
            if result.returncode == 0:
                return result.stdout.strip()
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
        return None


# ============================================================
# macOS: sysctl and IOKit
# ============================================================

class MacOSHardwareReader:
    """
    Reads hardware data on macOS using sysctl and system_profiler.
    macOS uses IOKit framework for hardware access (similar to Linux's sysfs).
    """
    
    @staticmethod
    def get_cpu_temp():
        """
        On macOS, CPU temperature requires IOKit or third-party tools
        (e.g., osx-cpu-temp). This demonstrates the sysctl approach.
        """
        try:
            result = subprocess.run(
                ['sysctl', '-n', 'machdep.cpu.brand_string'],
                capture_output=True, text=True, timeout=5
            )
            if result.returncode == 0:
                return result.stdout.strip()
        except FileNotFoundError:
            pass
        return None
    
    @staticmethod
    def get_memory_info():
        """Read memory pressure from sysctl."""
        try:
            result = subprocess.run(
                ['sysctl', '-n', 'hw.memsize'],
                capture_output=True, text=True, timeout=5
            )
            if result.returncode == 0:
                return int(result.stdout.strip())
        except (FileNotFoundError, ValueError):
            pass
        return None


# ============================================================
# Linux: sysfs and procfs
# ============================================================

class LinuxHardwareReader:
    """
    Reads hardware data on Linux from virtual filesystems.
    - /sys (sysfs): device and driver information
    - /proc: process and kernel information
    """
    
    @staticmethod
    def get_cpu_temp():
        """Read CPU temperature from thermal zones."""
        thermal_zones = []
        base_path = '/sys/class/thermal'
        
        if os.path.exists(base_path):
            for entry in os.listdir(base_path):
                if entry.startswith('thermal_zone'):
                    temp_path = os.path.join(base_path, entry, 'temp')
                    type_path = os.path.join(base_path, entry, 'type')
                    try:
                        with open(temp_path) as f:
                            temp = int(f.read().strip()) / 1000.0
                        zone_type = 'unknown'
                        if os.path.exists(type_path):
                            with open(type_path) as f:
                                zone_type = f.read().strip()
                        thermal_zones.append({
                            'zone': entry,
                            'type': zone_type,
                            'temp_celsius': temp,
                        })
                    except (IOError, ValueError):
                        pass
        return thermal_zones
    
    @staticmethod
    def get_memory_info():
        """Read memory info from /proc/meminfo."""
        info = {}
        try:
            with open('/proc/meminfo') as f:
                for line in f:
                    parts = line.split(':')
                    if len(parts) == 2:
                        key = parts[0].strip()
                        val = parts[1].strip().split()[0]  # Value in KB
                        if key in ('MemTotal', 'MemFree', 'MemAvailable', 'SwapTotal', 'SwapFree'):
                            info[key] = int(val)
        except IOError:
            pass
        return info


# ============================================================
# Cross-Platform Interface
# ============================================================

class CrossPlatformReader:
    """
    Unified interface that delegates to the correct platform-specific reader.
    This is the abstraction that lets application code be platform-independent.
    """
    
    def __init__(self):
        self.platform = platform.system()
        
        if self.platform == 'Windows':
            self._reader = WindowsHardwareReader()
        elif self.platform == 'Darwin':
            self._reader = MacOSHardwareReader()
        elif self.platform == 'Linux':
            self._reader = LinuxHardwareReader()
        else:
            self._reader = None
    
    def get_system_summary(self):
        """Get a cross-platform system summary."""
        info = get_platform_info()
        
        summary = {
            'platform': info,
            'hardware': {},
        }
        
        if self.platform == 'Windows':
            cpu_info = self._reader.get_cpu_info()
            if cpu_info:
                summary['hardware']['cpu'] = cpu_info
            mem_info = self._reader.get_memory_info()
            if mem_info:
                summary['hardware']['memory'] = mem_info
        
        elif self.platform == 'Darwin':
            cpu = self._reader.get_cpu_temp()
            if cpu:
                summary['hardware']['cpu_brand'] = cpu
            mem = self._reader.get_memory_info()
            if mem:
                summary['hardware']['memory_bytes'] = mem
        
        elif self.platform == 'Linux':
            temps = self._reader.get_cpu_temp()
            if temps:
                summary['hardware']['thermal_zones'] = temps
            mem = self._reader.get_memory_info()
            if mem:
                summary['hardware']['memory_kb'] = mem
        
        return summary


# ============================================================
# Platform Comparison Table
# ============================================================

def print_platform_comparison():
    """Shows how each platform exposes hardware data."""
    print("=" * 65)
    print("  Cross-Platform Hardware Access Comparison")
    print("=" * 65)
    print()
    print("  ┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐")
    print("  │ Feature          │ Linux            │ macOS            │ Windows          │")
    print("  ├──────────────────┼──────────────────┼──────────────────┼──────────────────┤")
    print("  │ CPU Temperature  │ /sys/class/      │ IOKit / smc      │ WMI / OpenHW     │")
    print("  │                  │ thermal/         │                  │ Monitor          │")
    print("  │ Memory Info      │ /proc/meminfo    │ sysctl hw.mem    │ Win32_Operating  │")
    print("  │                  │                  │                  │ System           │")
    print("  │ Disk Info        │ /sys/block/      │ diskutil         │ Win32_LogicalDisk│")
    print("  │ CPU Info         │ /proc/cpuinfo    │ sysctl machdep   │ Win32_Processor  │")
    print("  │ GPU Info         │ /sys/class/drm/  │ system_profiler  │ Win32_VideoCtrl  │")
    print("  │ Battery          │ /sys/class/      │ pmset            │ Win32_Battery    │")
    print("  │                  │ power_supply/    │                  │                  │")
    print("  │ Network          │ /sys/class/net/  │ ifconfig         │ Get-NetAdapter   │")
    print("  └──────────────────┴──────────────────┴──────────────────┴──────────────────┘")
    print()
    print("  KEY INSIGHT: Each OS has different APIs, but the abstraction pattern")
    print("  is the same: detect platform → call platform-specific code → return")
    print("  unified data structure.")
    print()


if __name__ == '__main__':
    print_platform_comparison()
    
    print("=" * 65)
    print(f"  Running on: {platform.system()} {platform.release()}")
    print("=" * 65)
    print()
    
    # Show platform info
    info = get_platform_info()
    for key, value in info.items():
        print(f"  {key:>15}: {value}")
    print()
    
    # Try to read actual hardware data
    reader = CrossPlatformReader()
    summary = reader.get_system_summary()
    
    if summary['hardware']:
        print("  Hardware readings:")
        for key, value in summary['hardware'].items():
            if isinstance(value, str) and len(value) > 60:
                print(f"    {key}: (data available, {len(value)} chars)")
            else:
                print(f"    {key}: {value}")
    else:
        print("  No hardware readings available on this platform configuration.")
    
    print()
    print("  ✓ Cross-platform detection complete.")
