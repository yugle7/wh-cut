from const import *
from exact import get_rects, remove
from utils import take, pick


def fuzzy(sheet: tuple, pieces: list[tuple]) -> list[tuple]:
    # отбираем только подходящие детали
    X, Y, W, H = sheet
    P = take(W, H, pieces)

    if not P:
        return []

    C = sum(q[3] for q in P)
    if C > COUNT:
        if len(P) > MAX_TYPES_COUNT or C > MAX_COUNT:
            return None
        P, C = pick(W, H, P)

    R = get_rects(W, H, P, C)
    remove(R, pieces)
    return [(x + X, y + Y, w, h) for x, y, w, h in R]
