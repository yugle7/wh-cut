from collections import Counter

from const import KERF
from rough import get_r


# todo: учесть чуть большие размеры
def del_w(src: list[tuple], W: int, H: int):
    src = [(h, w, z) if z and h == W else (w, h, z) for w, h, z in src]
    src.sort(key=lambda q: (q[2], -q[1]))
    dst = []

    for w, h, z in src:
        if W - KERF <= w <= W and h <= H:
            H -= h
        else:
            dst.append((w, h, z))
    return dst


def del_h(src: list[tuple], W: int, H: int):
    src = [(h, w, z) if z and w == H else (w, h, z) for w, h, z in src]
    src.sort(key=lambda q: (q[2], -q[0]))
    dst = []

    for w, h, z in src:
        if H - KERF <= h <= H and w <= W:
            W -= w
        else:
            dst.append((w, h, z))
    return dst


def get_d(pieces: list[tuple]):
    dst = []
    for w, h, z, c in pieces:
        dst += [(w, h, z)] * c
    return dst


def get_w(src: list[tuple]):
    n = Counter()
    for w, h, z in src:
        n[w] += (w >= h) + 1
        if z:
            n[h] += (h >= w) + 1

    keys = sorted(n.keys(), reverse=True)
    for i, w in enumerate(keys, 0):
        while i > 0:
            i -= 1
            W = keys[i]
            if W - w > KERF:
                break
            n[W] += n[w] / 2

    return max(keys, key=lambda q: n[q])


def get_h(src: list[tuple]):
    n = Counter()
    for w, h, z in src:
        n[h] += (h >= w) + 1
        if z:
            n[w] += (w >= h) + 1

    keys = sorted(n.keys(), reverse=True)
    for i, h in enumerate(keys, 0):
        while i > 0:
            i -= 1
            H = keys[i]
            if H - h > KERF:
                break
            n[H] += n[h] / 2

    return max(keys, key=lambda q: n[q])


def get_a(rects: list[tuple]):
    return sum(w * h for x, y, w, h in rects)


def main(sheets: list[tuple], pieces: list[tuple]) -> list[tuple]:
    A = 0
    R = []

    d = get_d(pieces)

    tasks = [(sheets, d)]
    j = 0
    while pieces and j < len(tasks):
        sheets, d = tasks[j]
        j += 1

        # r = get_r(sheets, pieces) if j > 1 else None
        r = get_r(sheets, pieces)  # так медленнее

        if r:
            a = get_a(r)
            if a > A:
                A = a
                R = r

        w = get_w(d)
        h = get_h(d)

        i = n = len(sheets)
        while i:
            i -= 1
            X, Y, W, H = sheets[i]

            if W >= 2 * w and H >= 2 * h:
                sheets[i] = (X, Y, w, H)
                sheets.append((X + w, Y, W - w, H))
                tasks.append((
                    sorted(sheets, key=lambda q: q[2] * q[3]),
                    del_w(d, w, H)
                ))
                sheets[i] = (X, Y, W, h)
                sheets[n] = (X, Y + h, W, H - h)
                sheets.sort(key=lambda q: q[2] * q[3])
                tasks.append((sheets, del_h(d, W, h)))
                break

    return R

