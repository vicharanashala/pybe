# Assuming the directory 'gauntlet' exists with __init__.py, time_stone.py, space_stone.py

# gauntlet/__init__.py content:
# from .time_stone import reverse_time
# from .space_stone import teleport

# gauntlet/time_stone.py content:
# def reverse_time(): return 'Time reversed'

import os

def setup_gauntlet():
    os.makedirs('gauntlet', exist_ok=True)
    with open('gauntlet/time_stone.py', 'w') as f:
        f.write('def reverse_time(): return "Time reversed"')
    with open('gauntlet/__init__.py', 'w') as f:
        f.write('from .time_stone import reverse_time')

if __name__ == '__main__':
    setup_gauntlet()
    from gauntlet import reverse_time
    print(reverse_time())
