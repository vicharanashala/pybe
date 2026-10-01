"""
attendance_cleaner.py

Companion code for the case study "The Messy Attendance List"
(see case-study.md in this folder).

Cleans a messy, comma-separated string of student names — stripping
stray whitespace, normalizing capitalization, removing duplicates,
and returning a sorted, comma-joined result.

Run directly to see it in action:
    python3 attendance_cleaner.py
"""


def clean_attendance_list(raw_message: str) -> str:
    """
    Turn a messy, comma-separated block of names into a clean,
    alphabetically sorted, duplicate-free string.

    Mirrors the five steps from the case study:
      1. Split the raw text into individual name-pieces.
      2. Strip stray whitespace from each piece.
      3. Normalize capitalization so the same name always matches.
      4. Drop duplicates.
      5. Sort and rejoin into a single clean line.
    """
    pieces = raw_message.split(",")

    # Steps 2 + 3: strip whitespace, normalize case.
    # The `if piece.strip()` guard drops any empty pieces that come
    # from trailing commas or blank lines in the raw message.
    cleaned_names = [piece.strip().title() for piece in pieces if piece.strip()]

    # Step 4: duplicates removed by funneling through a set.
    unique_names = set(cleaned_names)

    # Step 5: sort alphabetically, rejoin as one line.
    return ", ".join(sorted(unique_names))


if __name__ == "__main__":
    raw_message = (
        "priya sharma,   Rohit KUMAR ,ANEESH nair,  Divya Menon,rohit kumar ,\n"
        "  Aneesh Nair,Priya Sharma"
    )

    print("Raw message:")
    print(repr(raw_message))
    print()
    print("Cleaned list:")
    print(clean_attendance_list(raw_message))
