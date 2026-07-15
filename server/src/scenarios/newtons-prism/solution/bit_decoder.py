"""
bit_decoder.py Color Extractor Using Bitwise Ops
=====================================================
Newton split white light through a prism into its component colors.
Similarly, we split a packed integer into its component color channels
using bitwise right-shift (>>) and AND (&) operations.

Covers RGB565, RGB888, and RGBA8888 decoding.
"""


def decode_rgb565(packed):
    """
    Extracts R, G, B from a 16-bit RGB565 packed color.
    
    Layout (16 bits): RRRRR GGGGGG BBBBB
                      [15:11] [10:5]  [4:0]
    
    Steps:
    1. Shift right to move the desired bits to position 0
    2. AND with a mask to isolate only the bits we want
    """
    # Extract blue: bits [4:0] already at position 0
    blue = packed & 0b11111           # Mask: 5 bits
    
    # Extract green: bits [10:5] shift right by 5, then mask 6 bits
    green = (packed >> 5) & 0b111111  # Mask: 6 bits
    
    # Extract red: bits [15:11] shift right by 11, then mask 5 bits
    red = (packed >> 11) & 0b11111    # Mask: 5 bits
    
    return red, green, blue


def decode_rgb888(packed):
    """
    Extracts R, G, B from a 24-bit RGB888 packed color.
    
    Layout (24 bits): RRRRRRRR GGGGGGGG BBBBBBBB
                      [23:16]   [15:8]    [7:0]
    """
    blue = packed & 0xFF           # Bits [7:0]
    green = (packed >> 8) & 0xFF   # Bits [15:8]
    red = (packed >> 16) & 0xFF    # Bits [23:16]
    
    return red, green, blue


def decode_rgba8888(packed):
    """
    Extracts R, G, B, A from a 32-bit RGBA8888 packed color.
    
    Layout (32 bits): RRRRRRRR GGGGGGGG BBBBBBBB AAAAAAAA
                      [31:24]   [23:16]   [15:8]    [7:0]
    """
    alpha = packed & 0xFF           # Bits [7:0]
    blue = (packed >> 8) & 0xFF     # Bits [15:8]
    green = (packed >> 16) & 0xFF   # Bits [23:16]
    red = (packed >> 24) & 0xFF     # Bits [31:24]
    
    return red, green, blue, alpha


def scale_to_8bit(value, src_bits):
    """
    Scales a color component from src_bits precision to 8-bit.
    Example: 5-bit value 31 → 8-bit value 255
    
    Formula: (value * 255) // ((1 << src_bits) - 1)
    """
    max_src = (1 << src_bits) - 1
    return (value * 255) // max_src if max_src > 0 else 0


def print_color_bar(r, g, b, width=30):
    """Prints a simple text-based color visualization."""
    # Normalize to percentage for text representation
    r_pct = r / 255
    g_pct = g / 255
    b_pct = b / 255
    
    r_bar = '█' * int(r_pct * width)
    g_bar = '█' * int(g_pct * width)
    b_bar = '█' * int(b_pct * width)
    
    print(f"  R [{r:>3}]: {r_bar}")
    print(f"  G [{g:>3}]: {g_bar}")
    print(f"  B [{b:>3}]: {b_bar}")


if __name__ == '__main__':
    # === RGB565 Decoding ===
    print("=" * 50)
    print("  Newton's Prism: Splitting Colors with >> and &")
    print("=" * 50)
    
    # Magenta in RGB565: R=31, G=0, B=31
    magenta_565 = 0b1111100000011111
    r, g, b = decode_rgb565(magenta_565)
    print(f"\n  RGB565 Magenta: {bin(magenta_565)}")
    print(f"  Raw:  R={r}, G={g}, B={b}")
    # Scale to 8-bit for display
    r8 = scale_to_8bit(r, 5)
    g8 = scale_to_8bit(g, 6)
    b8 = scale_to_8bit(b, 5)
    print(f"  8-bit: R={r8}, G={g8}, B={b8}")
    print_color_bar(r8, g8, b8)
    
    # === RGB888 Decoding ===
    print(f"\n  RGB888 Coral: 0xFF7F50")
    coral_888 = 0xFF7F50
    r, g, b = decode_rgb888(coral_888)
    print(f"  R={r}, G={g}, B={b}")
    print_color_bar(r, g, b)
    
    # === RGBA8888 Decoding ===
    print(f"\n  RGBA8888 Semi-transparent Blue: 0x0000FF80")
    semi_blue = 0x0000FF80
    r, g, b, a = decode_rgba8888(semi_blue)
    print(f"  R={r}, G={g}, B={b}, A={a} ({a/255*100:.0f}% opaque)")
    print_color_bar(r, g, b)
    
    # === Step-by-step breakdown ===
    print(f"\n{'=' * 50}")
    print("  Step-by-step: Decoding RGB565 0xF81F (Magenta)")
    print("=" * 50)
    packed = 0xF81F
    print(f"  Packed value:  {packed:#06x} = {packed:#018b}")
    print(f"  Step 1 (Blue):  packed & 0x1F         = {packed & 0x1F:#07b} = {packed & 0x1F}")
    print(f"  Step 2 (Green): (packed >> 5) & 0x3F   = {(packed >> 5) & 0x3F:#08b} = {(packed >> 5) & 0x3F}")
    print(f"  Step 3 (Red):   (packed >> 11) & 0x1F  = {(packed >> 11) & 0x1F:#07b} = {(packed >> 11) & 0x1F}")
