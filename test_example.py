"""
Simple example test file for demonstrating pytest functionality.
This file can be used to verify that the Python testing environment is working correctly.
"""

def test_example_addition():
    """Test basic addition."""
    assert 1 + 1 == 2

def test_example_string():
    """Test string operations."""
    assert "hello".upper() == "HELLO"

def test_example_list():
    """Test list operations."""
    my_list = [1, 2, 3]
    assert len(my_list) == 3
    assert 2 in my_list
