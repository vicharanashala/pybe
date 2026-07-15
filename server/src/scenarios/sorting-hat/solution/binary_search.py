import bisect

def find_similar_student(sorted_students, target_score):
    """
    Given a list of students sorted by a specific trait (e.g., bravery),
    find the student with the closest score to the target using binary search.
    """
    # Extract just the scores to search over
    scores = [s['bravery'] for s in sorted_students]
    
    # bisect_left finds the insertion point to maintain sorted order
    # which effectively finds the closest value in O(log n) time
    idx = bisect.bisect_left(scores, target_score)
    
    # Handle edge cases (target is smaller than all or larger than all)
    if idx == 0:
        return sorted_students[0]
    if idx == len(scores):
        return sorted_students[-1]
        
    # Check if the element before or after is closer
    before = scores[idx - 1]
    after = scores[idx]
    
    if after - target_score < target_score - before:
        return sorted_students[idx]
    else:
        return sorted_students[idx - 1]

# In a real scenario, you'd sort the list once
# sorted_students = sorted(all_students, key=lambda x: x['bravery'])
# match = find_similar_student(sorted_students, 8)
