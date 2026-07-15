"""
bit_encoder.py Color Packer Using <<, |
==========================================
The inverse of Newton's prism: recombining separate color components
back into a single packed integer. Uses left-shift (<<) to position
each component and bitwise OR (|) to merge them together.
"""


def encode_rgb565(red, green, blue):
    """
    Packs R, G, B into a 16-bit RGB565 integer.
    
    Layout: RRRRR GGGGGG BBBBB
    
    Steps:
    1. Clamp each channel to its valid range
    2. Shift each channel to its position using <<
    3. Combine all channels using | (bitwise OR)
    """
    # Clamp values to their bit-width ranges
    red = min(red, 0b11111)       # 5 bits: 0-31
    green = min(green, 0b111111)  # 6 bits: 0-63
    blue = min(blue, 0b11111)     # 5 bits: 0-31
    
    # Shift to position and combine with OR
    packed = (red << 11) | (green << 5) | blue
    
    return packed


def encode_rgb888(red, green, blue):
    """
    Packs R, G, B into a 24-bit RGB888 integer.
    
    Layout: RRRRRRRR GGGGGGGG BBBBBBBB
    """
    red = min(red, 0xFF) & 0xFF
    green = min(green, 0xFF) & 0xFF
    blue = min(blue, 0xFF) & 0xFF
    
    packed = (red << 16) | (green << 8) | blue
    
    return packed


def encode_rgba8888(red, green, blue, alpha=255):
    """
    Packs R, G, B, A into a 32-bit RGBA8888 integer.
    
    Layout: RRRRRRRR GGGGGGGG BBBBBBBB AAAAAAAA
    """
    red = min(red, 0xFF) & 0xFF
    green = min(green, 0xFF) & 0xFF
    blue = min(blue, 0xFF) & 0xFF
    alpha = min(alpha, 0xFF) & 0xFF
    
    packed = (red << 24) | (green << 16) | (blue << 8) | alpha
    
    return packed


def rgb888_to_rgb565(r8, g8, b8):
    """
    Converts 8-bit per channel color to RGB565.
    This loses precision (8→5 bits for R/B, 8→6 bits for G).
    
    Like Newton's prism in reverse: we're losing some wavelengths.
    """
    # Scale down: divide by the ratio of ranges
    r5 = (r8 >> 3) & 0x1F   # 8-bit → 5-bit: shift right by 3
    g6 = (g8 >> 2) & 0x3F   # 8-bit → 6-bit: shift right by 2
    b5 = (b8 >> 3) & 0x1F   # 8-bit → 5-bit: shift right by 3
    
    return encode_rgb565(r5, g6, b5)


def blend_colors(color_a, color_b, ratio=0.5):
    """
    Blends two RGB888 colors using bitwise extraction and repacking.
    
    ratio: 0.0 = all color_a, 1.0 = all color_b
    """
    # Extract channels from color_a
    r_a = (color_a >> 16) & 0xFF
    g_a = (color_a >> 8) & 0xFF
    b_a = color_a & 0xFF
    
    # Extract channels from color_b
    r_b = (color_b >> 16) & 0xFF
    g_b = (color_b >> 8) & 0xFF
    b_b = color_b & 0xFF
    
    # Linear interpolation
    r = int(r_a * (1 - ratio) + r_b * ratio)
    g = int(g_a * (1 - ratio) + g_b * ratio)
    b = int(b_a * (1 - ratio) + b_b * ratio)
    
    return encode_rgb888(r, g, b)


if __name__ == '__main__':
    print("=" * 55)
    print("  Newton's Prism (Reversed): Packing Colors with << |")
    print("=" * 55)
    
    # === RGB565 Encoding ===
    print("\n  --- RGB565 Encoding ---")
    # Pure red: R=31, G=0, B=0
    red_565 = encode_rgb565(31, 0, 0)
    print(f"  Pure Red:     R=31 G=0  B=0  → {red_565:#06x} ({red_565:#018b})")
    
    # Pure green: R=0, G=63, B=0
    green_565 = encode_rgb565(0, 63, 0)
    print(f"  Pure Green:   R=0  G=63 B=0  → {green_565:#06x} ({green_565:#018b})")
    
    # Pure blue: R=0, G=0, B=31
    blue_565 = encode_rgb565(0, 0, 31)
    print(f"  Pure Blue:    R=0  G=0  B=31 → {blue_565:#06x} ({blue_565:#018b})")
    
    # White: all max
    white_565 = encode_rgb565(31, 63, 31)
    print(f"  White:        R=31 G=63 B=31 → {white_565:#06x} ({white_565:#018b})")
    
    # === Step-by-step breakdown ===
    print(f"\n  --- Step-by-Step: Packing R=31, G=32, B=15 ---")
    r, g, b = 31, 32, 15
    print(f"  Red   = {r:>2} = {r:#07b}")
    print(f"  Green = {g:>2} = {g:#08b}")
    print(f"  Blue  = {b:>2} = {b:#07b}")
    print()
    r_shifted = r << 11
    g_shifted = g << 5
    print(f"  Red   << 11 = {r_shifted:#018b}")
    print(f"  Green << 5  = {g_shifted:#018b}")
    print(f"  Blue        = {b:#018b}")
    result = r_shifted | g_shifted | b
    print(f"  OR together = {result:#018b} = {result:#06x}")
    
    # === RGB888 Encoding ===
    print(f"\n  --- RGB888 Encoding ---")
    coral = encode_rgb888(255, 127, 80)
    print(f"  Coral:        R=255 G=127 B=80 → {coral:#08x}")
    
    # === Color Blending ===
    print(f"\n  --- Color Blending (RGB888) ---")
    pure_red = encode_rgb888(255, 0, 0)
    pure_blue = encode_rgb888(0, 0, 255)
    
    for ratio in [0.0, 0.25, 0.5, 0.75, 1.0]:
        blended = blend_colors(pure_red, pure_blue, ratio)
        r = (blended >> 16) & 0xFF
        g = (blended >> 8) & 0xFF
        b = blended & 0xFF
        print(f"  {ratio:.0%} blue: R={r:>3} G={g:>3} B={b:>3} → {blended:#08x}")
    
    # === RGB888 → RGB565 Conversion ===
    print(f"\n  --- RGB888 → RGB565 Conversion ---")
    print(f"  Coral (255, 127, 80):")
    print(f"    RGB888: {encode_rgb888(255, 127, 80):#08x}")
    print(f"    RGB565: {rgb888_to_rgb565(255, 127, 80):#06x}")
    print(f"  Note: RGB565 loses precision (8→5/6 bits per channel)")
