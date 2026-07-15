"""
struct_demo.py struct Module for BMP Header Parsing
======================================================
The struct module packs and unpacks binary data, bridging Python's
high-level world with raw bytes. Here we parse a real BMP image header
to extract width, height, and color depth the same way image editors
read files at the byte level.
"""

import struct
import os


def create_minimal_bmp(width, height, color=(255, 0, 0)):
    """
    Creates a minimal valid BMP file in memory.
    BMP format uses little-endian byte ordering.
    
    This demonstrates struct.pack() converting Python values to bytes.
    """
    # Pixels: each row must be padded to a multiple of 4 bytes
    row_size = width * 3  # 3 bytes per pixel (BGR)
    padding = (4 - (row_size % 4)) % 4
    padded_row_size = row_size + padding
    pixel_data_size = padded_row_size * height
    
    # BMP Header (14 bytes) + DIB Header (40 bytes) = 54 bytes before pixel data
    file_size = 54 + pixel_data_size
    
    # --- BMP File Header (14 bytes) ---
    # Format: 2s = 2-char string, I = unsigned int (4 bytes), H = unsigned short (2 bytes)
    bmp_header = struct.pack('<2sIHHI',
        b'BM',           # Signature (magic bytes)
        file_size,       # Total file size
        0,               # Reserved1
        0,               # Reserved2
        54               # Offset to pixel data
    )
    
    # --- DIB Header (BITMAPINFOHEADER, 40 bytes) ---
    # Format: I = unsigned int, i = signed int, H = unsigned short
    dib_header = struct.pack('<IiiHHIIiiII',
        40,              # DIB header size
        width,           # Image width (signed)
        height,          # Image height (signed, positive = bottom-up)
        1,               # Color planes (always 1)
        24,              # Bits per pixel (24 = RGB)
        0,               # Compression (0 = none)
        pixel_data_size, # Image data size
        2835,            # Horizontal resolution (pixels/meter)
        2835,            # Vertical resolution (pixels/meter)
        0,               # Colors in palette (0 = default)
        0                # Important colors (0 = all)
    )
    
    # --- Pixel Data ---
    # BMP stores colors as BGR (not RGB!) and rows bottom-to-top
    b, g, r = color[2], color[1], color[0]
    pixel_row = struct.pack('BBB', b, g, r) * width + b'\x00' * padding
    pixel_data = pixel_row * height
    
    return bmp_header + dib_header + pixel_data


def parse_bmp_header(data):
    """
    Parses a BMP file header using struct.unpack().
    
    This demonstrates struct.unpack() converting raw bytes back to Python values.
    """
    print("  === BMP File Header (14 bytes) ===")
    print(f"  Raw bytes: {data[:14].hex(' ')}")
    
    # Unpack BMP header
    # '<' = little-endian, '2s' = 2-byte string, 'I' = uint32, 'H' = uint16
    signature, file_size, reserved1, reserved2, pixel_offset = \
        struct.unpack('<2sIHHI', data[:14])
    
    print(f"  Signature:     {signature} (must be b'BM')")
    print(f"  File size:     {file_size} bytes")
    print(f"  Pixel offset:  {pixel_offset} bytes")
    
    print(f"\n  === DIB Header (40 bytes) ===")
    print(f"  Raw bytes: {data[14:54].hex(' ')}")
    
    # Unpack DIB header (BITMAPINFOHEADER)
    (dib_size, width, height, planes, bpp,
     compression, img_size, h_res, v_res,
     palette_colors, important_colors) = \
        struct.unpack('<IiiHHIIiiII', data[14:54])
    
    print(f"  DIB header size: {dib_size} bytes")
    print(f"  Width:           {width} pixels")
    print(f"  Height:          {height} pixels")
    print(f"  Color planes:    {planes}")
    print(f"  Bits per pixel:  {bpp}")
    print(f"  Compression:     {compression} (0=none, 1=RLE8, 2=RLE4)")
    print(f"  Image data size: {img_size} bytes")
    print(f"  H resolution:    {h_res} pixels/meter")
    print(f"  V resolution:    {v_res} pixels/meter")
    
    return {
        'width': width,
        'height': height,
        'bpp': bpp,
        'file_size': file_size,
        'compression': compression,
    }


def demo_struct_basics():
    """Shows fundamental struct.pack/unpack operations."""
    print("=" * 55)
    print("  struct Module Basics: Python ↔ Raw Bytes")
    print("=" * 55)
    print()
    
    # Pack an integer into 4 bytes (little-endian)
    value = 0x0000FF00  # Green in ARGB
    packed = struct.pack('<I', value)
    print(f"  struct.pack('<I', {value:#010x})")
    print(f"  Result: {packed} = {packed.hex(' ')}")
    print()
    
    # Unpack it back
    unpacked = struct.unpack('<I', packed)[0]
    print(f"  struct.unpack('<I', {packed})")
    print(f"  Result: {unpacked:#010x}")
    print()
    
    # Pack multiple values at once
    r, g, b = 255, 128, 64
    packed_rgb = struct.pack('BBB', r, g, b)
    print(f"  struct.pack('BBB', {r}, {g}, {b})")
    print(f"  Result: {packed_rgb.hex(' ')} ({len(packed_rgb)} bytes)")
    print()
    
    # Show format character sizes
    print("  Format character sizes:")
    formats = [('B', 'unsigned byte'), ('H', 'unsigned short'),
               ('I', 'unsigned int'), ('Q', 'unsigned long long'),
               ('f', 'float'), ('d', 'double')]
    for fmt, name in formats:
        size = struct.calcsize(fmt)
        print(f"    '{fmt}' ({name:20s}): {size} byte(s)")
    print()
    
    # Endianness comparison
    print("  Endianness matters:")
    value = 0x12345678
    le = struct.pack('<I', value)  # Little-endian
    be = struct.pack('>I', value)  # Big-endian
    print(f"    Value: {value:#010x}")
    print(f"    Little-endian (<): {le.hex(' ')}")
    print(f"    Big-endian (>):    {be.hex(' ')}")
    print()


def demo_bmp_parsing():
    """Creates and parses a BMP file."""
    print("=" * 55)
    print("  BMP Header Parsing with struct")
    print("=" * 55)
    print()
    
    # Create a 4x3 red BMP in memory
    print("  Creating a 4x3 red BMP image...")
    bmp_data = create_minimal_bmp(4, 3, color=(255, 0, 0))
    print(f"  Total BMP size: {len(bmp_data)} bytes")
    print()
    
    # Parse the header
    info = parse_bmp_header(bmp_data)
    
    print(f"\n  Parsed image info:")
    print(f"    Dimensions: {info['width']}x{info['height']}")
    print(f"    Color depth: {info['bpp']}-bit")
    print(f"    File size: {info['file_size']} bytes")
    
    # Save to disk so the user can verify
    bmp_path = 'test_image.bmp'
    with open(bmp_path, 'wb') as f:
        f.write(bmp_data)
    print(f"\n  ✓ Saved to '{bmp_path}' open it to see a tiny red image!")
    
    # Clean up
    if os.path.exists(bmp_path):
        os.remove(bmp_path)
    print()


if __name__ == '__main__':
    demo_struct_basics()
    demo_bmp_parsing()
