from tqdm import tqdm

from utils import get_pieces, load


def get_patterns(W: int, H: int, pieces: list[tuple], C: int) -> None:
    N = 1 << C
    rects = [None] * N
    norms = [0] * N
    areas = [0] * N

    A = W * H
    D = A * 0.05

    U = []
    V = []

    i = 0
    for w, h, z, c in pieces:
        r = []
        if w <= W and h <= H:
            r.append((w, h))
        if z and h <= W and w <= H:
            r.append((h, w))
        rects[1 << i] = tuple(r)

        qL = U[:]
        qR = V[:]

        a = w * h
        d = 0

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

            d += a
            areas[u] = d

            for q in qL:
                areas[q | u] = areas[q] + d

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
                    for lw, lh in rects[lm]:
                        for rw, rh in rects[rm]:
                            r.append((max(lw, rw), lh + rh))
                            r.append((lw + rw, max(lh, rh)))
            lm = (lm - 1) & mask

        if not r:
            continue

        R = []

        a = areas[mask]
        d = H + 1
        for w, h in sorted((w, h) for w, h in r if w <= W and h <= H and a - w * h < D):
            if h < d:
                R.append((w, h))
                d = h
        if R:
            rects[mask] = tuple(R)
            if A - a < D:
                print(mask)

if __name__ == '__main__':
    pieces = get_pieces(load(1))
    get_patterns(2080, 2070,  pieces, sum(q[3] for q in pieces))