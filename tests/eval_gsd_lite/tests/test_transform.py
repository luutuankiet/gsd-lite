import unittest
import sys
import os

# Ensure we can import from src
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.etl.transform import clean_currency

class TestTransform(unittest.TestCase):
    def test_clean_currency_standard(self):
        self.assertEqual(clean_currency('$1,200.50'), 1200.50)
        
    def test_clean_currency_negative(self):
        self.assertEqual(clean_currency('-$500.00'), -500.00)
        
    def test_clean_currency_empty(self):
        self.assertEqual(clean_currency(''), 0.0)
        
    def test_clean_currency_no_symbol(self):
        self.assertEqual(clean_currency('100.00'), 100.00)

if __name__ == '__main__':
    unittest.main()
