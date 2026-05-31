import time
from const import EDGE, COUNT, KERF
from collections import Counter
from functools import wraps

perf_counter = {}
call_counter = {}


def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        o = time.perf_counter()
        result = func(*args, **kwargs)
        perf_counter[func.__name__] = round(time.perf_counter() - o, 2)
        return result

    return wrapper


def caller(func):
    call_counter[func.__name__] = 0

    @wraps(func)
    def wrapper(*args, **kwargs):
        call_counter[func.__name__] += 1
        return func(*args, **kwargs)

    return wrapper


def printer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        for k, v in call_counter.items():
            print(f'{k}:', v)
        for k, v in perf_counter.items():
            print(f'{k}:', v, 's')
        return result

    return wrapper


def get_pieces(src: list[tuple]) -> list[tuple]:
    dst = Counter()
    for w, h, z, c in src:
        if w == h:
            z = False
        if z and w < h:
            w, h = h, w
        dst[(w, h, z)] += c

    dst = [(w + KERF, h + KERF, z, c) for (w, h, z), c in dst.items()]

    return sorted(dst, key=lambda q: (q[2], q[0] + q[1]))


def sum_a(pieces: list[tuple]) -> int:
    return sum(w * h * c for w, h, z, c in pieces)


def sum_c(pieces: list[tuple]) -> int:
    return sum(q[3] for q in pieces)


def get_sheets(src: list[tuple]) -> tuple[list, int, int, int]:
    dst = []
    h = 0
    w = 0
    d = 2 * EDGE - KERF
    for W, H, C in src:
        for c in range(C):
            dst.append((0, h, W - d, H - d))
            h += H
        w = max(w, W)

    return sorted(dst, key=lambda q: q[2] * q[3]), w, h, sum(q[2] * q[3] for q in dst)


# удаляет одну деталь
def remove(pieces: list[tuple], i):
    w, h, z, c = pieces[i]
    if c > 1:
        pieces[i] = w, h, z, c - 1
    else:
        pieces.pop(i)


def take(W: int, H: int, pieces: list[tuple]) -> tuple[tuple]:
    return tuple((w, h, z, min(c, (W * H) // (w * h))) for w, h, z, c in pieces if (w <= W and h <= H) or (z and h <= W and w <= H))


def pick(W: int, H: int, pieces: list[tuple]) -> tuple[tuple[tuple], int]:
    dst = {(w, h, z): 1 for w, h, z, c in pieces}
    src = [(w, h, z, c - 1) for w, h, z, c in pieces if c > 1]
    p = sorted(src, key=lambda q: q[0] + q[1])

    a = sum(w * h for w, h, z in dst.keys())
    A = W * H

    j = len(p)
    C = len(dst)
    while a < A and p:
        j -= 1
        w, h, z, c = p[j]

        a += w * h
        if c == 1:
            p.pop(j)
        else:
            p[j] = (w, h, z, c - 1)
        dst[(w, h, z)] += 1
        C += 1

        if j == 0:
            j = len(p)

    j = 0
    while C < COUNT and j < len(p):
        w, h, z, c = p[j]
        dst[(w, h, z)] += c
        C += c
        j += 1

    return tuple((w, h, z, c) for (w, h, z), c in dst.items()), C


def change(dst: list[tuple], src: list[tuple]) -> None:
    C = {(w, h, z): c for w, h, z, c in src}
    i = len(dst)
    while i:
        i -= 1
        w, h, z, c = dst[i]
        c = C.get((w, h, z), 0)
        if c:
            dst[i] = w, h, z, c
        else:
            dst.pop(i)


def load(src: str) -> list[tuple]:
    with open(f'src/{src}.csv') as src:
        dst = [q.split(',') for q in src]
        return [(int(w), int(h), z == 'true', int(c)) for w, h, z, c in dst]
