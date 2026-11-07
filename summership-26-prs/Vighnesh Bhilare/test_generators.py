"""
Unit Tests for Smart Factory Generator Module
Verifies iterator protocol, memory efficiency, and state preservation.
"""

import sys
import unittest
from simulation import sensor_batch_list, sensor_stream_generator


class TestSmartFactoryGenerators(unittest.TestCase):

    def test_generator_is_lazy(self):
        """Verify generator returns immediately without computing all elements."""
        # Even with 10 million items, generator object creation takes < 1 millisecond
        gen = sensor_stream_generator(10_000_000)
        self.assertTrue(hasattr(gen, "__iter__"))
        self.assertTrue(hasattr(gen, "__next__"))
        # Check that its size in memory is tiny (typically under 250 bytes in Python)
        self.assertLess(sys.getsizeof(gen), 300)

    def test_generator_yields_correct_values(self):
        """Verify generator yields values identical to the eager batch list."""
        count = 100
        batch = sensor_batch_list(count)
        gen = sensor_stream_generator(count)
        gen_list = list(gen)
        self.assertEqual(batch, gen_list)
        self.assertEqual(len(gen_list), count)

    def test_next_steps_and_stop_iteration(self):
        """Verify manual iteration with next() and clean StopIteration exception."""
        gen = sensor_stream_generator(2)
        first = next(gen)
        self.assertEqual(first[0], 1)
        second = next(gen)
        self.assertEqual(second[0], 2)
        with self.assertRaises(StopIteration):
            next(gen)

    def test_state_preservation(self):
        """Verify that local variables persist across yields."""
        def stateful_line():
            total_weight = 0
            for weight in [10, 20, 30]:
                total_weight += weight
                yield total_weight

        stream = stateful_line()
        self.assertEqual(next(stream), 10)
        self.assertEqual(next(stream), 30)
        self.assertEqual(next(stream), 60)


if __name__ == "__main__":
    unittest.main()
