"""
Newton's Prism: Bitwise Operations Solution

This scenario explores how bitwise operators act as a computational prism, separating
a composite 16-bit integer into its RGB components. Just as Isaac Newton demonstrated
that white light is composed of all colors, a 16-bit integer encodes multiple data
channels within a single value.

The 16-bit format (RGB565) distributes bits as follows:
- Bits 0-4: Blue (5 bits, values 0-31)
- Bits 5-10: Green (6 bits, values 0-63)
- Bits 11-15: Red (5 bits, values 0-31)

We use bitwise AND (&) to mask/extract specific bits, and right shift (>>) to
position the extracted bits for proper interpretation.
"""


def extract_rgb(pixel: int) -> tuple[int, int, int]:
    """
    Extract Red, Green, and Blue components from a 16-bit RGB565 integer.

    Args:
        pixel: A 16-bit integer encoding RGB values in RGB565 format.
               Bits 11-15 = Red (5 bits)
               Bits 5-10  = Green (6 bits)
               Bits 0-4   = Blue (5 bits)

    Returns:
        A tuple of (red, green, blue) with each value normalized to 0-255 range.

    Example:
        >>> extract_rgb(0xF800)  # Pure red in RGB565
        (255, 0, 0)
    """
    # Bitmask to isolate the 5 red bits: 0xF800 = 1111100000000000 in binary
    # The mask 0xF800 selects only the red channel bits
    red_mask = 0xF800
    red = (pixel & red_mask) >> 11  # Shift right 11 to get 5-bit value

    # Bitmask for 6 green bits: 0x07E0 = 0000011111100000 in binary
    # This selects the green channel which sits in the middle
    green_mask = 0x07E0
    green = (pixel & green_mask) >> 5  # Shift right 5 to get 6-bit value

    # Bitmask for 5 blue bits: 0x001F = 0000000000011111 in binary
    # Blue occupies the lowest 5 bits, so no shift needed after masking
    blue_mask = 0x001F
    blue = pixel & blue_mask

    # Normalize each component from its native bit-depth to 0-255 range
    # Red and Blue: 5 bits -> divide by 31 and multiply by 255
    # Green: 6 bits -> divide by 63 and multiply by 255
    red_normalized = int((red / 31) * 255)
    green_normalized = int((green / 63) * 255)
    blue_normalized = int((blue / 31) * 255)

    return (red_normalized, green_normalized, blue_normalized)


def extract_rgb_original_scale(pixel: int) -> tuple[int, int, int]:
    """
    Extract RGB components WITHOUT normalization, returning native bit-depth values.

    This is useful when you need the raw values before scaling to 8-bit display.

    Args:
        pixel: A 16-bit integer in RGB565 format.

    Returns:
        Tuple of (red_5bit, green_6bit, blue_5bit) in their original scales.
    """
    red = (pixel & 0xF800) >> 11
    green = (pixel & 0x07E0) >> 5
    blue = pixel & 0x001F
    return (red, green, blue)


def create_rgb565(red: int, green: int, blue: int) -> int:
    """
    Combine separate R, G, B values into a single RGB565 16-bit integer.

    This is the inverse of extract_rgb - we pack three color channels
    back into a single integer using bitwise OR and left shifts.

    Args:
        red:   8-bit red value (0-255), will be converted to 5-bit
        green: 8-bit green value (0-255), will be converted to 6-bit
        blue:  8-bit blue value (0-255), will be converted to 5-bit

    Returns:
        A 16-bit RGB565 encoded integer.
    """
    # Convert 8-bit values back to their native bit-depths
    red_5bit = int((red / 255) * 31)
    green_6bit = int((green / 255) * 63)
    blue_5bit = int((blue / 255) * 31)

    # Pack the bits using left shift (<<) and OR (|) operations
    # Red goes into bits 11-15: shift left by 11
    # Green goes into bits 5-10: shift left by 5
    # Blue goes into bits 0-4: no shift needed (already in position)
    pixel = (red_5bit << 11) | (green_6bit << 5) | blue_5bit
    return pixel


def demonstrate_bitwise_prism():
    """
    Demonstrate the bitwise prism concept with various test cases.
    Shows how a single integer contains multiple channels of information.
    """
    test_pixels = [
        0xF800,  # Pure red (RGB565)
        0x07E0,  # Pure green
        0x001F,  # Pure blue
        0xFFFF,  # White (all bits set)
        0x0000,  # Black (all bits clear)
        0xBC21,  # Mixed color example
        0xA534,  # Another mixed color
    ]

    print("=" * 70)
    print("NEWTON'S PRISM: Extracting RGB from 16-bit integers")
    print("=" * 70)
    print(f"{'Hex Value':<10} {'Binary':<20} {'Red':<8} {'Green':<8} {'Blue':<8}")
    print("-" * 70)

    for pixel in test_pixels:
        r, g, b = extract_rgb(pixel)
        # Also show the packed binary representation as a prism would show the spectrum
        r_orig, g_orig, b_orig = extract_rgb_original_scale(pixel)
        binary = format(pixel, '016b')

        # Visual representation using box-drawing characters
        # The 'prism' effect shows which bits contribute to which color
        print(f"0x{pixel:04X}    {binary}    {r:>3} ({r_orig:>2})   {g:>3} ({g_orig:>2})   {b:>3} ({b_orig:>2})")

    print("-" * 70)


def demonstrate_rgb_reconstruction():
    """
    Verify that our encode-decode roundtrip preserves color values.
    """
    print("\n" + "=" * 70)
    print("VERIFICATION: Roundtrip RGB565 encode -> decode")
    print("=" * 70)

    test_colors = [
        (255, 0, 0),    # Red
        (0, 255, 0),    # Green
        (0, 0, 255),    # Blue
        (255, 255, 255),# White
        (128, 128, 128),# Gray
        (255, 128, 0),  # Orange
        (100, 200, 50), # Mixed
    ]

    print(f"{'Original RGB':<20} {'RGB565 Hex':<12} {'Decoded RGB':<20} {'Match':<6}")
    print("-" * 70)

    for r, g, b in test_colors:
        original = (r, g, b)
        pixel = create_rgb565(r, g, b)
        decoded = extract_rgb(pixel)
        match = "OK" if decoded == original else "FAIL"
        print(f"({r:>3}, {g:>3}, {b:>3})      0x{pixel:04X}        {decoded}      {match}")

    print("-" * 70)


if __name__ == "__main__":
    # Newton's original prism experiment separated white light into a spectrum
    # Our computational prism separates a composite integer into color channels
    demonstrate_bitwise_prism()
    demonstrate_rgb_reconstruction()

    # Educational demonstration of bitwise operations
    print("\n" + "=" * 70)
    print("BITWISE OPERATION EXERCISES")
    print("=" * 70)

    # Exercise 1: Check if a specific bit is set
    number = 0b10110010
    bit_position = 3
    is_set = (number >> bit_position) & 1
    print(f"\nIs bit {bit_position} set in {bin(number)}? {bool(is_set)}")

    # Exercise 2: Toggle a bit using XOR
    original = 0b10100000
    toggle_mask = 0b00001111
    toggled = original ^ toggle_mask
    print(f"XOR to toggle bits: {bin(original)} ^ {bin(toggle_mask)} = {bin(toggled)}")

    # Exercise 3: Demonstrate two's complement with ~ (negation)
    val = 5
    negated = ~val
    print(f"Two's complement: ~{val} = {negated} (always adds 1 to negation)")

    # Exercise 4: Fast multiplication and division using shifts
    num = 42
    multiplied = num << 3  # Same as num * 8
    divided = num >> 2     # Same as num // 4
    print(f"\nBit-shift arithmetic: {num} << 3 = {multiplied} ({num} * 8)")
    print(f"                     {num} >> 2 = {divided} ({num} // 4)")