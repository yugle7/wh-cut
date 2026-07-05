from collections import defaultdict
from time import time


def horizontal_cut(width, height, counts, packs):
    S = defaultdict(list)

    for k, (h, w, a, i, c) in enumerate(packs):
        if h != height:
            break

        counts[i] -= c
        S[w].append((a, counts[:], k))
        counts[i] += c

    area = 0
    for l in range(width + 1):
        if l in S:
            s = get_states(S[l])
            if s[0][0] > area:
                counts = s[0][1]
                area = s[0][0]

            dw = width - l
            for a, c, k in s:
                while k < len(packs):
                    H, W, A, I, C = packs[k]
                    if W <= dw and c[I] >= C:
                        c[I] -= C
                        S[l + W].append((a + A, c[:], k))
                        c[I] += C
                    k += 1

    return area, counts


def vertical_cut(width, height, counts, packs):
    S = defaultdict(list)

    for k, (w, h, a, i, c) in enumerate(packs):
        if w != width:
            break

        counts[i] -= c
        S[h].append((a, counts[:], k))
        counts[i] += c

    area = 0
    for t in range(height + 1):
        if t in S:
            s = get_states(S[t])
            if s[0][0] > area:
                counts = s[0][1]
                area = s[0][0]

            dh = height - t
            for a, c, k in s:
                while k < len(packs):
                    W, H, A, I, C = packs[k]
                    if H <= dh and c[I] >= C:
                        c[I] -= C
                        S[t + H].append((a + A, c[:], k))
                        c[I] += C
                    k += 1
    return area, counts


def optimal(width, height, takes):
    return 0, []


def suboptimal(width, height, takes):
    return 0, []


def get_states(src, n=3):
    if len(src) == 1:
        return src
    src.sort(key=lambda x: -x[0])
    dst = []
    C = set()
    for q in src:
        c = tuple(q[1])
        if c in C:
            continue
        if any(all(u >= v for u, v in zip(c, q)) for q in C):
            # continue
            break
        dst.append(q)
        if len(dst) >= n:
            break
        C.add(c)
    return dst


def get_heights(width, height, takes):
    dst = []
    for w, h, z, i, c in takes:
        if w <= width and h <= height:
            dst.append(h)
        if z and w <= height and h <= width:
            dst.append(w)
    return set(dst)


def get_widths(width, height, takes):
    dst = []
    for w, h, z, i, c in takes:
        if w <= width and h <= height:
            dst.append(w)
        if z and w <= height and h <= width:
            dst.append(h)
    return set(dst)


def get_horizontal_packs(width, height, takes):
    dst = []
    for w, h, z, i, c in takes:
        if w <= width and h <= height:
            for n, H in enumerate(range(h, min(height, c * h) + 1, h), 1):
                dst.append((w, H, w * H, i, n))
        if z and w <= height and h <= width:
            for n, W in enumerate(range(w, min(height, c * w) + 1, w), 1):
                dst.append((h, W, W * h, i, n))
    dst.sort(reverse=True)
    return dst


def get_vertical_packs(width, height, takes):
    dst = []
    for w, h, z, i, c in takes:
        if w <= width and h <= height:
            for n, W in enumerate(range(w, min(width, c * w) + 1, w), 1):
                dst.append((h, W, W * h, i, n))
        if z and w <= height and h <= width:
            for n, H in enumerate(range(h, min(width, c * h) + 1, h), 1):
                dst.append((w, H, w * H, i, n))
    dst.sort(reverse=True)
    return dst


def get_takes(width, height, counts, takes):
    dst = []
    for (i, c), (w, h, z) in zip(enumerate(counts), takes):
        if c:
            n = (width // w) * (height // h)
            if z and c > n:
                n = max(n, (height // w) * (width // h))
            if n:
                dst.append((w, h, z, i, min(c, n)))
    return dst


def cut(sheets, pieces):
    counts = [q[3] for q in pieces]
    takes = [q[:3] for q in pieces]

    states = [(0, counts, None, None)]
    S = []
    for width, height in sheets:
        s = cut_sheet(width, height, takes, states)
        S.append(s)
        states = [(q[0][0], q[0][1], None, k) for k, q in enumerate(s)]

    return S


def cut_sheet(width, height, takes, states):
    W = width + 1
    H = height + 1

    S = defaultdict(list)
    S[0] = states

    s = []

    for i in range(W * H):
        if i not in S:
            continue

        top, left = divmod(i, W)
        w = width - left
        h = height - top

        S[i] = get_states(S[i])

        for k, (area, counts, I, K) in enumerate(S[i]):
            t = get_takes(w, h, counts, takes)
            if not t:
                s.append((area, counts, i, k))
                continue

            a, c = suboptimal(w, h, t)
            s.append((area + a, c, i, k))

            for dh in get_heights(w, h, t):
                p = get_vertical_packs(w, dh, t)
                a, c = horizontal_cut(w, dh, counts[:], p)
                S[i + W * dh].append((area + a, c, i, k))

            for dw in get_widths(w, h, t):
                p = get_horizontal_packs(dw, h, t)
                a, c = vertical_cut(dw, h, counts[:], p)
                S[i + dw].append((area + a, c, i, k))

    s = get_states(s)
    dst = []
    for a, c, i, k in s:
        q = [(a, c, i, k)]
        while i:
            a, c, i, k = S[i][k]
            q.append((a, c, i, k))
        dst.append(q)

    return dst



one_sheet_pieces = [
    (568, 80, True, 1),
    (384, 320, True, 2),
    (801, 320, True, 6),
    (802, 80, True, 1),
    (600, 80, True, 1),
    (385, 330, True, 1),
    (1030, 330, True, 8),
    (730, 330, True, 2),
    (280, 330, True, 2)
]

three_sheets_pieces = [
    (1070, 334, True, 1),
    (1054, 330, True, 13),
    (568, 330, True, 9),
    (568, 150, True, 3),
    (568, 85, True, 3),
    (567, 320, True, 10),
    (1850, 300, True, 1),
    (1250, 300, True, 1),
    (568, 80, True, 6),
    (1022, 568, True, 1),
    (567, 490, True, 2),
    (567, 410, True, 1),
    (704, 80, True, 1),
    (1720, 610, True, 2),
    (1100, 594, True, 2),
    (680, 594, True, 2),
    (1340, 560, True, 1),
    (568, 180, True, 1)
]

if __name__ == '__main__':
    o = time()
    cut([(2800, 2070), (2800, 2070), (2800, 2070)], one_sheet_pieces)
    print(f'{time() - o:.2f}')


# 93.87