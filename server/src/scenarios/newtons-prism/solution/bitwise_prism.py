def extract_rgb_565(color_16bit):
    # Extract Blue (last 5 bits)
    b_mask = 0b11111
    b = color_16bit & b_mask
    
    # Extract Green (middle 6 bits)
    g_mask = 0b111111
    g = (color_16bit >> 5) & g_mask
    
    # Extract Red (first 5 bits)
    r_mask = 0b11111
    r = (color_16bit >> 11) & r_mask
    
    return r, g, b

if __name__ == '__main__':
    # Let's test with a magenta-like color: max red, 0 green, max blue
    # Red: 11111, Green: 000000, Blue: 11111 => 1111100000011111 in binary
    color = 0b1111100000011111
    r, g, b = extract_rgb_565(color)
    print(f'Color: {bin(color)}')
    print(f'R: {r}, G: {g}, B: {b}')
