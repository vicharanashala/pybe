"""
flask_api.py REST Endpoint Serving Hardware Data
====================================================
The top of Maslow's hierarchy: a REST API that abstracts away all the
lower layers (hardware → ctypes → OS → Python → Flask → HTTP).

A consumer of this API doesn't need to know about sysfs, ctypes, or
even what OS the server runs on. Pure self-actualization.
"""

import sys
import os
import time
import random
import math

# Try to import Flask; provide instructions if not installed
try:
    from flask import Flask, jsonify, request
except ImportError:
    print("Flask is not installed. Install it with:")
    print("  pip install flask")
    print()
    print("Running in demo mode (no server)...")
    Flask = None


# ============================================================
# Mock Hardware Layer (same as hardware_reader.py)
# ============================================================

class HardwareSensor:
    """Simulates hardware sensor readings."""
    
    def __init__(self):
        self._start = time.time()
        self.sensors = {
            'cpu': {'type': 'cpu-thermal', 'base': 45.0, 'variance': 15.0},
            'gpu': {'type': 'gpu-thermal', 'base': 50.0, 'variance': 20.0},
            'ssd': {'type': 'ssd-thermal', 'base': 35.0, 'variance': 5.0},
            'ambient': {'type': 'ambient', 'base': 25.0, 'variance': 3.0},
        }
    
    def read(self, sensor_id):
        """Read a specific sensor."""
        if sensor_id not in self.sensors:
            return None
        
        config = self.sensors[sensor_id]
        elapsed = time.time() - self._start
        temp = (config['base']
                + math.sin(elapsed * 0.3) * config['variance'] * 0.3
                + random.gauss(0, 0.5))
        
        return {
            'sensor_id': sensor_id,
            'type': config['type'],
            'temperature_celsius': round(temp, 2),
            'timestamp': time.time(),
            'status': 'critical' if temp > 85 else 'warning' if temp > 70 else 'normal',
        }
    
    def read_all(self):
        """Read all sensors."""
        return {sid: self.read(sid) for sid in self.sensors}


# ============================================================
# Flask REST API
# ============================================================

if Flask:
    app = Flask(__name__)
    hw = HardwareSensor()
    
    # Request history for rate limiting demo
    request_log = []
    
    @app.route('/')
    def index():
        """API documentation endpoint."""
        return jsonify({
            'name': "Maslow's Hardware API",
            'version': '1.0.0',
            'endpoints': {
                '/sensors': 'GET - List all sensor readings',
                '/sensors/<id>': 'GET - Read a specific sensor',
                '/sensors/<id>/history': 'GET - Get reading history (mock)',
                '/health': 'GET - API health check',
            },
            'available_sensors': list(hw.sensors.keys()),
        })
    
    @app.route('/sensors', methods=['GET'])
    def get_all_sensors():
        """Return readings from all hardware sensors."""
        readings = hw.read_all()
        return jsonify({
            'count': len(readings),
            'sensors': readings,
            'server_time': time.time(),
        })
    
    @app.route('/sensors/<sensor_id>', methods=['GET'])
    def get_sensor(sensor_id):
        """Return reading from a specific sensor."""
        reading = hw.read(sensor_id)
        if reading is None:
            return jsonify({
                'error': f"Sensor '{sensor_id}' not found",
                'available': list(hw.sensors.keys()),
            }), 404
        
        return jsonify(reading)
    
    @app.route('/sensors/<sensor_id>/history', methods=['GET'])
    def get_sensor_history(sensor_id):
        """Return simulated historical readings."""
        if sensor_id not in hw.sensors:
            return jsonify({'error': f"Sensor '{sensor_id}' not found"}), 404
        
        # Generate mock historical data
        count = request.args.get('count', 10, type=int)
        count = min(count, 100)  # Cap at 100
        
        history = []
        for i in range(count):
            reading = hw.read(sensor_id)
            reading['timestamp'] = time.time() - (count - i) * 60  # 1-minute intervals
            history.append(reading)
        
        return jsonify({
            'sensor_id': sensor_id,
            'count': len(history),
            'history': history,
        })
    
    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint the API's self-actualization."""
        return jsonify({
            'status': 'healthy',
            'uptime_seconds': time.time() - hw._start,
            'platform': sys.platform,
            'python_version': sys.version.split()[0],
        })


# ============================================================
# Demo Mode (when Flask is not available)
# ============================================================

def demo_without_flask():
    """Demonstrates the API structure without Flask."""
    print("=" * 55)
    print("  Maslow's REST API Demo Mode")
    print("=" * 55)
    print()
    
    hw = HardwareSensor()
    
    # Simulate GET /sensors
    print("  GET /sensors")
    readings = hw.read_all()
    for sid, reading in readings.items():
        print(f"    {sid}: {reading['temperature_celsius']:.1f}°C [{reading['status']}]")
    
    # Simulate GET /sensors/cpu
    print(f"\n  GET /sensors/cpu")
    reading = hw.read('cpu')
    print(f"    Temperature: {reading['temperature_celsius']:.1f}°C")
    print(f"    Status: {reading['status']}")
    print(f"    Timestamp: {reading['timestamp']:.0f}")
    
    # Simulate GET /sensors/invalid
    print(f"\n  GET /sensors/invalid")
    reading = hw.read('invalid')
    print(f"    404: Sensor 'invalid' not found")
    
    print(f"\n  To run the actual Flask server:")
    print(f"    pip install flask")
    print(f"    python flask_api.py")
    print(f"    Then visit: http://localhost:5001/sensors")
    print()


if __name__ == '__main__':
    if Flask:
        print("Starting Maslow's Hardware API...")
        print("Endpoints:")
        print("  http://localhost:5001/")
        print("  http://localhost:5001/sensors")
        print("  http://localhost:5001/sensors/cpu")
        print("  http://localhost:5001/health")
        print()
        app.run(debug=True, port=5001)
    else:
        demo_without_flask()
