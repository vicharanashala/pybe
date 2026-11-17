"""
test_attendance_cleaner.py

Tests for attendance_cleaner.py. Uses plain assert statements so it
runs with no extra dependencies:

    python3 test_attendance_cleaner.py
"""

from attendance_cleaner import clean_attendance_list


def test_matches_case_study_example():
    raw = (
        "priya sharma,   Rohit KUMAR ,ANEESH nair,  Divya Menon,rohit kumar ,\n"
        "  Aneesh Nair,Priya Sharma"
    )
    result = clean_attendance_list(raw)
    assert result == "Aneesh Nair, Divya Menon, Priya Sharma, Rohit Kumar"


def test_removes_duplicates_regardless_of_original_casing():
    raw = "amit,AMIT,Amit,aMiT"
    result = clean_attendance_list(raw)
    assert result == "Amit"


def test_strips_leading_and_trailing_whitespace():
    raw = "   Neha  ,  Karan   "
    result = clean_attendance_list(raw)
    assert result == "Karan, Neha"


def test_handles_trailing_comma_without_crashing():
    raw = "Ravi,Meena,"
    result = clean_attendance_list(raw)
    assert result == "Meena, Ravi"


def test_handles_single_name():
    raw = "Sanya"
    result = clean_attendance_list(raw)
    assert result == "Sanya"


def test_handles_empty_string():
    raw = ""
    result = clean_attendance_list(raw)
    assert result == ""


def test_known_limitation_internal_double_spaces_not_collapsed():
    # This documents an intentional scope boundary: the case study
    # only covers stray whitespace *around* commas (leading/trailing),
    # not repeated whitespace *inside* a name. A name typed with a
    # double space in the middle passes through unchanged.
    raw = "Rohit  Kumar"  # double space between first and last name
    result = clean_attendance_list(raw)
    assert result == "Rohit  Kumar"


if __name__ == "__main__":
    tests = [
        test_matches_case_study_example,
        test_removes_duplicates_regardless_of_original_casing,
        test_strips_leading_and_trailing_whitespace,
        test_handles_trailing_comma_without_crashing,
        test_handles_single_name,
        test_handles_empty_string,
        test_known_limitation_internal_double_spaces_not_collapsed,
    ]

    passed = 0
    for test in tests:
        try:
            test()
            print(f"PASS  {test.__name__}")
            passed += 1
        except AssertionError:
            print(f"FAIL  {test.__name__}")

    print(f"\n{passed}/{len(tests)} tests passed")
