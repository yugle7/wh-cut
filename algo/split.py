from utils import remove


# подбирает минимальные размеры новых листов
def get_d(pieces: list[tuple]) -> tuple[int, int]:
    w = min(h if z else w for w, h, z, c in pieces)
    h = min(h for w, h, z, c in pieces)
    return w, h


# разбивает задачи на подзадачи
def split(task: tuple[list, list, list]) -> list[tuple]:
    sheets, pieces, rects = task

    # сортируем детали по неудобству
    p = max(q[2] + q[3] for q in sheets)
    P = sorted((w + h, j, w, h, z) for j, (w, h, z, c) in enumerate(pieces) if w + h <= p)

    while P:
        # берем самую неудобную деталь
        p, j, w, h, z = P.pop()

        # подбираем ей самый большой лист
        i = len(sheets)
        while i:
            i -= 1
            X, Y, W, H = sheets[i]

            if (w > W or h > H) and (not z or h > W or w > H):
                continue

            sheets.pop(i)
            remove(pieces, j)

            # подбираем минимальные размеры новых листов
            dw, dh = get_d(pieces)

            # выбираем разрез
            def vertical():
                s = []
                if W - w >= dw:
                    s.append((X + w, Y, W - w, H))
                if H - h >= dh:
                    s.append((X, Y + h, w, H - h))
                return s

            def horizontal():
                s = []
                if W - w >= dw:
                    s.append((X + w, Y, W - w, h))
                if H - h >= dh:
                    s.append((X, Y + h, W, H - h))
                return s

            # пробуем по разному поставить и по разному обрезать деталь
            tasks = []

            if w <= W and h <= H:
                for s in [vertical(), horizontal()]:
                    tasks.append((
                        sorted(sheets + s, key=lambda q: q[2] * q[3]),
                        pieces.copy(),
                        rects + [(X, Y, w, h)])
                    )

            if z and w <= H and h <= W:
                w, h = h, w
                for s in [vertical(), horizontal()]:
                    tasks.append((
                        sorted(sheets + s, key=lambda q: q[2] * q[3]),
                        pieces.copy(),
                        rects + [(X, Y, w, h)]
                    ))

            return tasks
    return []
