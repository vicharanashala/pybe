"""
The Sorting Hat: Decision Tree Classification Solution

This scenario implements a Hogwarts enrollment classification system that
categorizes students into houses using a decision tree approach. The Sorting
Hat evaluates personality traits and uses binary decisions to arrive at a
house assignment - similar to how a well-designed algorithm evaluates features
against thresholds.

Key concepts:
- Decision tree classification: a series of binary decisions based on features
- Binary search with bisect module for efficient lookup in O(log n) time
- OOP design for maintainable classification rules
- The bisect module for maintaining sorted data structures

The Sorting Hat doesn't make random assignments - it evaluates features
(bravery, cunning, loyalty, intelligence) against a learned model and
produces a deterministic label (Gryffindor, Slytherin, Ravenclaw, Hufflepuff).
"""

import bisect
from dataclasses import dataclass
from typing import Optional, Callable
from enum import Enum


class House(Enum):
    """
    The four Hogwarts houses, each with distinct characteristics.

    Each house values different traits:
    - Gryffindor: bravery, courage, chivalry
    - Slytherin: ambition, cunning, resourcefulness
    - Ravenclaw: intelligence, creativity, learning
    - Hufflepuff: loyalty, patience, fair play
    """
    GRYFFINDOR = "Gryffindor"
    SLYTHERIN = "Slytherin"
    RAVENCLAW = "Ravenclaw"
    HUFFLEPUFF = "Hufflepuff"


@dataclass
class Student:
    """
    Represents a Hogwarts student with personality scores.

    Each trait is scored from 0-10, representing how strongly
    the student exhibits that trait. These scores are used by
    the decision tree to classify the student into a house.
    """
    name: str
    bravery: int      # Courage, nerve, daring
    cunning: int      # Ambition, shrewdness, resourcefulness
    loyalty: int      # Fair play, patience, dedication
    intelligence: int # Learning, wit, wisdom

    def __post_init__(self):
        """Validate that all scores are within valid range."""
        for trait in ['bravery', 'cunning', 'loyalty', 'intelligence']:
            value = getattr(self, trait)
            if not 0 <= value <= 10:
                raise ValueError(f"{trait} score must be between 0 and 10, got {value}")


@dataclass
class ClassifiedStudent:
    """A student with their assigned house after classification."""
    student: Student
    house: House
    confidence: float  # 0.0 to 1.0, how confident the classification is


class SortingHat:
    """
    The Hogwarts sorting algorithm implemented as a decision tree.

    The decision tree asks a series of binary questions based on
    personality traits to determine the most appropriate house.
    This mirrors the classic "ask questions, make decisions" approach
    of the magical Sorting Hat.

    The decision tree structure:
    1. Is intelligence very high (>8)? -> Ravenclaw
    2. Is bravery dominant over all other traits? -> Gryffindor
    3. Is cunning the highest trait and significantly higher than others? -> Slytherin
    4. Otherwise -> Hufflepuff (the loyal house for those who don't fit elsewhere)
    """

    def __init__(self):
        """Initialize the Sorting Hat with classification thresholds."""
        # Decision tree thresholds
        self.INTELLIGENCE_THRESHOLD = 8  # Very high intelligence suggests Ravenclaw
        self.BRAVERY_DOMINANCE_THRESHOLD = 2  # How much higher bravery must be
        self.CUNNING_THRESHOLD = 7  # High cunning suggests Slytherin
        self.CUNNING_DOMINANCE_THRESHOLD = 2  # How much higher cunning must be

    def classify(self, student: Student) -> ClassifiedStudent:
        """
        Classify a student into a Hogwarts house using the decision tree.

        The classification follows this decision tree:
        1. If intelligence > 8, classify as Ravenclaw (value learning above all)
        2. Else if bravery is at least 2 points higher than all other traits,
           classify as Gryffindor (bravery is their defining trait)
        3. Else if cunning > 7 and is at least 2 points higher than loyalty,
           classify as Slytherin (ambition is their defining trait)
        4. Otherwise, classify as Hufflepuff (loyal house for those who don't fit)

        Args:
            student: The student to classify

        Returns:
            ClassifiedStudent with the student's assigned house and confidence
        """
        # Get trait values
        traits = {
            'intelligence': student.intelligence,
            'bravery': student.bravery,
            'cunning': student.cunning,
            'loyalty': student.loyalty
        }

        # Decision Node 1: Is intelligence exceptional?
        # Ravenclaw values intelligence and learning above all
        if student.intelligence >= self.INTELLIGENCE_THRESHOLD:
            return ClassifiedStudent(
                student=student,
                house=House.RAVENCLAW,
                confidence=self._calculate_confidence(student, House.RAVENCLAW)
            )

        # Decision Node 2: Is bravery the dominant trait?
        # Gryffindor values courage and bravery
        other_traits = [student.cunning, student.loyalty, student.intelligence]
        if self._is_dominant(student.bravery, other_traits, self.BRAVERY_DOMINANCE_THRESHOLD):
            return ClassifiedStudent(
                student=student,
                house=House.GRYFFINDOR,
                confidence=self._calculate_confidence(student, House.GRYFFINDOR)
            )

        # Decision Node 3: Is cunning dominant?
        # Slytherin values ambition and cunning
        if student.cunning >= self.CUNNING_THRESHOLD:
            if student.cunning >= student.loyalty + self.CUNNING_DOMINANCE_THRESHOLD:
                return ClassifiedStudent(
                    student=student,
                    house=House.SLYTHERIN,
                    confidence=self._calculate_confidence(student, House.SLYTHERIN)
                )

        # Decision Node 4: Default to Hufflepuff
        # Hufflepuff accepts all, values loyalty and fair play
        return ClassifiedStudent(
            student=student,
            house=House.HUFFLEPUFF,
            confidence=self._calculate_confidence(student, House.HUFFLEPUFF)
        )

    def _is_dominant(self, value: int, others: list[int], threshold: int) -> bool:
        """
        Check if a value is dominant over all other values.

        A value is dominant if it's at least 'threshold' points higher
        than the maximum of the other values.

        Args:
            value: The value to check
            others: List of other values to compare against
            threshold: How much higher value must be

        Returns:
            True if value is threshold higher than all others
        """
        max_other = max(others)
        return value >= max_other + threshold

    def _calculate_confidence(self, student: Student, house: House) -> float:
        """
        Calculate classification confidence based on trait alignment.

        Confidence is higher when the student's traits strongly align
        with the typical house traits.

        Returns:
            Confidence score between 0.0 and 1.0
        """
        house_traits = {
            House.RAVENCLAW: ('intelligence',),
            House.GRYFFINDOR: ('bravery',),
            House.SLYTHERIN: ('cunning',),
            House.HUFFLEPUFF: ('loyalty',)
        }

        primary_trait, = house_traits[house]
        primary_score = getattr(student, primary_trait)

        # Base confidence from primary trait (0-10 maps to 0.4-1.0)
        base_confidence = 0.4 + (primary_score / 10) * 0.6

        # Bonus if no other trait is higher (clear alignment)
        all_traits = [student.bravery, student.cunning, student.loyalty, student.intelligence]
        if primary_score == max(all_traits):
            base_confidence = min(1.0, base_confidence + 0.1)

        return round(base_confidence, 2)


class StudentDatabase:
    """
    Database of students with efficient binary search lookup.

    Uses Python's bisect module for O(log n) search performance
    on sorted student collections. This is crucial when dealing
    with large student populations (3000+ in the Hogwarts system).
    """

    def __init__(self):
        """Initialize empty student database."""
        self._students: list[tuple[int, ClassifiedStudent]] = []
        self._hat = SortingHat()

    def add_student(self, student: Student) -> ClassifiedStudent:
        """
        Add a student to the database, classifying them first.

        Args:
            student: The student to add

        Returns:
            The classified student
        """
        classified = self._hat.classify(student)
        # Key for sorting: (total_score, name) for stable sort
        sort_key = (student.bravery + student.cunning + student.loyalty + student.intelligence, student.name)
        bisect.insort(self._students, (sort_key, classified))
        return classified

    def find_similar_students(self, student: Student, limit: int = 5) -> list[ClassifiedStudent]:
        """
        Find students with similar personality profiles using binary search.

        This is much more efficient than linear search O(log n) vs O(n).
        We use binary search to find the insertion point, then return
        students near that point.

        Args:
            student: The student to find matches for
            limit: Maximum number of similar students to return

        Returns:
            List of similar classified students
        """
        target_key = (sum([student.bravery, student.cunning, student.loyalty, student.intelligence]), student.name)

        # Find insertion point using binary search
        pos = bisect.bisect_left(self._students, (target_key, None))

        # Collect nearby students
        results = []
        for i in range(max(0, pos - limit), min(len(self._students), pos + limit)):
            if i != pos:  # Don't include the target student
                results.append(self._students[i][1])

        return results[:limit]

    def find_by_house(self, house: House) -> list[ClassifiedStudent]:
        """Get all students in a specific house."""
        return [classified for _, classified in self._students if classified.house == house]

    def reclassify_student(self, name: str) -> Optional[ClassifiedStudent]:
        """
        Re-classify a student (for handling transfers or personality changes).

        Args:
            name: The student's name to look for

        Returns:
            The re-classified student, or None if not found
        """
        for i, (key, classified) in enumerate(self._students):
            if classified.student.name == name:
                # Remove from current position
                self._students.pop(i)
                # Re-classify and re-add
                return self.add_student(classified.student)
        return None

    @property
    def total_students(self) -> int:
        """Get total number of students in database."""
        return len(self._students)


def demonstrate_decision_tree():
    """
    Demonstrate the decision tree classification process.
    """
    print("\n" + "=" * 70)
    print("DECISION TREE: How the Sorting Hat Classifies Students")
    print("=" * 70)

    hat = SortingHat()

    test_students = [
        Student("Hermione Granger", bravery=8, cunning=7, loyalty=9, intelligence=10),
        Student("Draco Malfoy", bravery=5, cunning=10, loyalty=4, intelligence=8),
        Student("Ron Weasley", bravery=9, cunning=5, loyalty=10, intelligence=6),
        Student("Luna Lovegood", bravery=6, cunning=4, loyalty=7, intelligence=10),
        Student("Cho Chang", bravery=7, cunning=6, loyalty=8, intelligence=9),
    ]

    print(f"\n{'Name':<20} {'B':<3} {'C':<3} {'L':<3} {'I':<3} -> {'House':<12} {'Confidence':<10}")
    print("-" * 70)

    for student in test_students:
        result = hat.classify(student)
        print(f"{student.name:<20} {student.bravery:<3} {student.cunning:<3} {student.loyalty:<3} {student.intelligence:<3} -> {result.house.value:<12} {result.confidence:.0%}")


def demonstrate_binary_search():
    """
    Demonstrate efficient lookup using bisect module.
    """
    print("\n" + "=" * 70)
    print("BINARY SEARCH: Efficient Student Lookup with bisect")
    print("=" * 70)

    db = StudentDatabase()

    # Add a diverse class of students
    students = [
        Student("Harry Potter", bravery=10, cunning=6, loyalty=7, intelligence=7),
        Student("Hermione Granger", bravery=8, cunning=7, loyalty=9, intelligence=10),
        Student("Draco Malfoy", bravery=5, cunning=10, loyalty=4, intelligence=8),
        Student("Luna Lovegood", bravery=6, cunning=4, loyalty=7, intelligence=10),
        Student("Neville Longbottom", bravery=7, cunning=5, loyalty=10, intelligence=8),
        Student("Ginny Weasley", bravery=9, cunning=6, loyalty=8, intelligence=7),
        Student("Theodore Nott", bravery=4, cunning=9, loyalty=3, intelligence=9),
        Student("Padma Patil", bravery=6, cunning=5, loyalty=7, intelligence=10),
    ]

    print("\nEnrolling new class of students...")
    for student in students:
        classified = db.add_student(student)
        print(f"  {student.name}: {classified.house.value}")

    print(f"\nTotal enrolled: {db.total_students} students")

    # Demonstrate binary search for similar students
    target = Student("New Student", bravery=8, cunning=7, loyalty=8, intelligence=7)
    print(f"\nFinding students similar to {target.name}...")
    similar = db.find_similar_students(target, limit=3)

    print("\nSimilar students found:")
    for s in similar:
        print(f"  - {s.student.name} ({s.house.value}, confidence: {s.confidence:.0%})")

    print(f"\nBinary search complexity: O(log n) = O(log {db.total_students}) ≈ {db.total_students.bit_length()} comparisons")
    print("vs linear search: O(n) = {} comparisons".format(db.total_students))


def demonstrate_reclassification():
    """
    Demonstrate handling of student transfers.
    """
    print("\n" + "=" * 70)
    print("RE-CLASSIFICATION: Handling Student Transfers")
    print("=" * 70)

    db = StudentDatabase()

    # Original classification
    harry = Student("Harry Potter", bravery=10, cunning=6, loyalty=7, intelligence=7)
    result = db.add_student(harry)
    print(f"\nOriginal sorting: {harry.name} -> {result.house.value}")

    # Later, Harry develops more cunning (grows wiser)
    # In reality, student personalities can change
    harry_updated = Student("Harry Potter", bravery=8, cunning=9, loyalty=7, intelligence=8)
    new_result = db.reclassify_student("Harry Potter")

    if new_result:
        print(f"After personality growth: {harry_updated.name} -> {new_result.house.value}")
        print("Note: In actual Hogwarts, students keep their original house!")


def show_decision_tree_diagram():
    """
    Display ASCII diagram of the decision tree.
    """
    print("\n" + "=" * 70)
    print("SORTING HAT DECISION TREE STRUCTURE")
    print("=" * 70)
    print("""
                            [START]
                               |
                               v
              +----------------------------------+
              | Is intelligence >= 8?            |
              +----------------------------------+
                     |                    |
                   YES                    NO
                     |                    |
                     v                    v
              +------------+    +-----------------------------+
              | RAVENCLAW  |    | Is bravery >= max(others)+2?|
              +------------+    +-----------------------------+
                                        |              |
                                      YES              NO
                                        |              |
                                        v              v
                                 +------------+  +-----------------------------+
                                 | GRYFFINDOR |  | Is cunning >= 7 AND          |
                                 +------------+  |   cunning >= loyalty + 2?    |
                                                 +-----------------------------+
                                                       |              |
                                                     YES              NO
                                                       |              |
                                                       v              v
                                                +------------+  +------------+
                                                | SLYTHERIN  |  | HUFFLEPUFF |
                                                +------------+  +------------+
    """)


if __name__ == "__main__":
    print("=" * 70)
    print("THE SORTING HAT: Decision Tree Classification")
    print("=" * 70)

    show_decision_tree_diagram()
    demonstrate_decision_tree()
    demonstrate_binary_search()
    demonstrate_reclassification()

    print("\n" + "=" * 70)
    print("KEY CONCEPTS DEMONSTRATED")
    print("=" * 70)
    print("""
1. DECISION TREE CLASSIFICATION
   - Sequential binary decisions based on feature thresholds
   - Each decision narrows down the possible outcomes
   - Mirrors how the magical Sorting Hat evaluates students

2. BINARY SEARCH (bisect module)
   - O(log n) search complexity vs O(n) linear search
   - bisect_left finds insertion point in sorted list
   - bisect.insort maintains sorted order when inserting

3. CLASSIFICATION CONFIDENCE
   - How certain is the algorithm about its decision?
   - Based on how strongly the student fits the house profile
   - Useful for flagging borderline cases

4. RE-CLASSIFICATION
   - Handling transfers or personality changes
   - Removing from one category, adding to another
   - Demonstrates dynamic updating of classified data

5. OOP DESIGN
   - Student dataclass for clean data representation
   - SortingHat encapsulates classification logic
   - StudentDatabase provides search and storage
   - House enum for type-safe house representation
""")