from collections import Counter
from functools import lru_cache

from tqdm import tqdm

from utils import take, get_pieces, load


def select(src: tuple[tuple], W: int, H: int) -> tuple[tuple]:
    dst = []

    H += 1
    for w, h, s in sorted((w, h, s) for w, h, s in src if w <= W and h <= H):
        if h < H:
            dst.append((w, h, s))
            H = h
    return tuple(dst)


# удаляет использованные pieces
def remove(rects: tuple[tuple], pieces: list[tuple]) -> None:
    C = Counter(q[2:] for q in rects)

    i = 0
    while i < len(pieces):
        w, h, z, c = pieces[i]
        k = (w, h)
        n = min(c, C[k])
        if n:
            c -= n
            C[k] -= n
        if z:
            k = (h, w)
            n = min(c, C[k])
            if n:
                c -= n
                C[k] -= n
        if c:
            pieces[i] = (w, h, z, c)
            i += 1
        else:
            pieces.pop(i)


def exact(sheet: tuple, pieces: list[tuple]) -> list[tuple]:
    # отбираем только подходящие детали
    X, Y, W, H = sheet
    P = take(W, H, pieces)

    if not P:
        return []

    C = sum(q[3] for q in P)
    if C > 25:
        return None

    R = get_rects(W, H, P, C)
    remove(R, pieces)
    return [(x + X, y + Y, w, h) for x, y, w, h in R]


# todo: добавить свой кэш, который будет учитывать вложенность
@lru_cache
def get_rects(W: int, H: int, pieces: tuple[tuple], C: int) -> list[tuple]:
    N = 1 << C
    rects = [None] * N
    norms = [0] * N
    areas = [0] * N

    U = []
    V = []

    def take_rects():
        r = []
        if w <= W and h <= H:
            r.append((w, h, 0))
        if z and h <= W and w <= H:
            r.append((h, w, 0))
        return tuple(r)

    i = 0
    for w, h, z, c in pieces:
        rects[1 << i] = take_rects()

        qL = U[:]
        qR = V[:]

        a = w * h
        A = 0

        u = 0
        for k in range(c):
            u += 1 << i
            i += 1

            norms[u] = u
            U.append(u)

            U += [q | u for q in qL]
            V += [q | u for q in qR]

            for q in qL:
                norms[q | u] = q | u
            for q in qR:
                norms[q | u] = norms[q] | u

            for j in range(1, c - k):
                v = u << j

                norms[v] = u
                V.append(v)

                V += [q | v for q in qL + qR]
                for q in qL:
                    norms[q | v] = q | u
                for q in qR:
                    norms[q | v] = norms[q] | u

            A += a
            areas[u] = A

            for q in qL:
                areas[q | u] = areas[q] + A

    for mask in tqdm(range(3, N)):
        if rects[mask] or norms[mask] != mask:
            continue

        r = []
        lm = (mask - 1) & mask
        while lm > 0:
            rm = mask ^ lm

            if rm > lm == norms[lm] and rects[lm]:
                rm = norms[rm]

                if rm and norms[rm] == rm and rects[rm]:
                    for lw, lh, _ in rects[lm]:
                        for rw, rh, _ in rects[rm]:
                            s = (lm << C) + rm
                            # Горизонтальный разрез (один над другим)
                            r.append((max(lw, rw), lh + rh, s))
                            # Вертикальный разрез (рядом)
                            r.append((lw + rw, max(lh, rh), s))
            lm = (lm - 1) & mask

        rects[mask] = select(r, W, H)

    # восстанавливаем прямоугольники распила
    def dfs(mask: int, x: int, y: int, width: int, height: int) -> None:
        for w, h, s in rects[mask]:
            if width == w and height == h:
                if s == 0:
                    dst.append((x, y, w, h))
                    return

                lm, rm = divmod(s, N)
                for lw, lh, ls in rects[lm]:
                    for rw, rh, rs in rects[rm]:
                        if lw + rw == w and max(lh, rh) == h:
                            dfs(lm, x, y, lw, lh)
                            dfs(rm, x + lw, y, rw, rh)
                            return

                        if max(lw, rw) == w and lh + rh == h:
                            dfs(lm, x, y, lw, lh)
                            dfs(rm, x, y + lh, rw, rh)
                            return

    # Находим решение с наибольшей площадью
    A = 0
    R = None
    for a, r in zip(areas, rects):
        if a > A and r:
            R = r
            A = a

    w, h, s = min(R, key=lambda q: q[0] + q[1])
    if s == 0:
        return [(0, 0, w, h)]

    dst = []

    lm, rm = divmod(s, N)
    for lw, lh, u in rects[lm]:
        for rw, rh, v in rects[rm]:
            if lw + rw == w and max(lh, rh) == h:
                dfs(lm, 0, 0, lw, lh)
                dfs(rm, lw, 0, rw, rh)
                return dst

            if max(lw, rw) == w and lh + rh == h:
                dfs(lm, 0, 0, lw, lh)
                dfs(rm, 0, lh, rw, rh)
                return dst
    return []


if __name__ == '__main__':
    pieces = get_pieces(load(1))
    exact((0, 0, 2800, 2070), pieces)
