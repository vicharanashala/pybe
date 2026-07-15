from datetime import datetime, timedelta

def calculate_sm2(quality: int, repetitions: int, easiness: float, interval: int):
    """
    SuperMemo-2 (SM-2) algorithm
    quality: 0-5 (0=complete blackout, 5=perfect response)
    """
    if quality >= 3:
        if repetitions == 0:
            interval = 1
        elif repetitions == 1:
            interval = 6
        else:
            interval = round(interval * easiness)
        repetitions += 1
    else:
        repetitions = 0
        interval = 1

    easiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    if easiness < 1.3:
        easiness = 1.3

    next_review = datetime.utcnow() + timedelta(days=interval)
    
    return {
        "repetitions": repetitions,
        "easiness": easiness,
        "interval": interval,
        "next_review_date": next_review
    }
