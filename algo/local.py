from const import KERF
from utils import remove


def eq(s: int, S: int) -> bool:
    return S - 5 < s <= S


# подбирает наиболее близкую деталь или пару деталей
def local(sheet: tuple, pieces: list[tuple]) -> list[tuple]:
    return None
    X, Y, W, H = sheet
    a = 95 * W * H // 100
    k = None
    R = []

    # ищем среди деталей похожую по размерам
    for i, (w, h, z, c) in enumerate(pieces):
        if w <= H and h <= W and w * h > a:
            a = w * h
            k = i
            R = [(X, Y, w, h)]

        elif z and w <= H and h <= W and w * h > a:
            a = w * h
            k = i
            R = [(X, Y, h, w)]

    # бежим по всем парам, пробуем собрать пары по общей стороне
    for i, (wi, hi, zi, ci) in enumerate(pieces):
        da = a - wi * hi
        if eq(wi, W):
            for j in range(i + 1, len(pieces)):
                wj, hj, zj, cj = pieces[j]
                if wj * hj > da:
                    if wj <= W and hi + KERF + hj <= H:
                        k = (i, j)
                        R = [(X, Y, wi, hi), (X, Y + hi + KERF, wj, hj)]

                    elif cj and hj <= W and hi + KERF + wj <= H:
                        k = (i, j)
                        R = [(X, Y, wi, hi), (X, Y + hi + KERF, hj, wj)]

        elif eq(hi, H):
            for j in range(i + 1, len(pieces)):
                wj, hj, zj, cj = pieces[j]
                if wj * hj > da:
                    if hj <= H and wi + KERF + wj <= W:
                        k = (i, j)
                        R = [(X, Y, wi, hi), (X + wi + KERF, Y, wj, hj)]

                    elif cj and wj <= H and wi + KERF + hj <= W:
                        R = [(X, Y, wi, hi), (X + wi + KERF, Y, hj, wj)]

        elif ci:
            if eq(hi, W):
                for j in range(i + 1, len(pieces)):
                    wj, hj, zj, cj = pieces[j]
                    if wj * hj > da:
                        if wj <= W and wi + KERF + hj <= H:
                            k = (i, j)
                            R = [(X, Y, hi, wi), (X, Y + wi + KERF, wj, hj)]

                        elif cj and hj <= W and wi + KERF + wj <= H:
                            k = (i, j)
                            R = [(X, Y, hi, wi), (X, Y + wi + KERF, hj, wj)]

            elif eq(wi, H):
                for j in range(i + 1, len(pieces)):
                    wj, hj, zj, cj = pieces[j]
                    if wj * hj > da:
                        if hj <= H and hi + KERF + wj <= W:
                            k = (i, j)
                            R = [(X, Y, hi, wi), (X + hi + KERF, Y, wj, hj)]

                        elif cj and wj <= H and hi + KERF + hj <= W:
                            k = (i, j)
                            R = [(X, Y, hi, wi), (X + hi + KERF, Y, hj, wj)]
    if not R:
        return None

    if len(R) == 1:
        remove(pieces, k)
    else:
        i, j = k
        remove(pieces, j)
        remove(pieces, i)

    return R
