"""
🐾 Test Suite for Buddy's Magic Pet Shop Encapsulation
"""
import unittest
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))
from pet_shop_puppy import MagicalPuppy

class TestMagicalPuppyEncapsulation(unittest.TestCase):
    def setUp(self):
        self.buddy = MagicalPuppy("Buddy")

    def test_initial_state(self):
        self.assertEqual(self.buddy.health, 100)
        self.assertEqual(self.buddy.happiness, 100)
        self.assertEqual(self.buddy.energy, 100)

    def test_private_attribute_protection(self):
        # Direct access to __health must raise AttributeError
        with self.assertRaises(AttributeError):
            _ = self.buddy.__health

    def test_heal_method(self):
        self.buddy.health = 50
        self.buddy.heal(20)
        self.assertEqual(self.buddy.health, 70)

        # Healing cannot exceed 100
        self.buddy.heal(50)
        self.assertEqual(self.buddy.health, 100)

    def test_setter_validation(self):
        # Valid assignment
        self.buddy.health = 80
        self.assertEqual(self.buddy.health, 80)

        # Invalid negative assignment should be blocked by setter
        self.buddy.health = -500
        self.assertEqual(self.buddy.health, 80)

    def test_play_and_nap(self):
        self.buddy.play()
        self.assertLess(self.buddy.energy, 100)
        self.buddy.nap()
        self.assertEqual(self.buddy.energy, 100)

if __name__ == '__main__':
    unittest.main()
