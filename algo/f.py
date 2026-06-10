class FreeRect:
    __slots__ = ('x', 'y', 'w', 'h')

    def __init__(self, x: int, y: int, w: int, h: int):
        self.x = x
        self.y = y
        self.w = w
        self.h = h

    def a(self) -> int:
        return self.w * self.h


def guillotine_cut(
        plates: list,  # (ширина, высота, количество)
        rectangles: list,  # (ширина, высота, количество)
        allow_rotation: bool = True,
):
    """
    Гильотинный раскрой с выбором по BAF + BSSF.
    Возвращает список: (индекс_листа, [(x, y, w, h, rotated), ...])
    """
    # Разворачиваем листы
    drops = []
    for w, h, c in plates:
        drops.extend([{'w': w, 'h': h}] * c)

    # Разворачиваем детали
    drags = []
    for w, h, c in rectangles:
        drags.extend([{'w': w, 'h': h}] * c)

    # Сортируем по убыванию площади
    drags.sort(key=lambda r: r['width'] * r['height'], reverse=True)

    results = []

    for plate_idx, drop in enumerate(drops):
        rects = [{'x': 0, 'y': 0, 'w': drop['w'], 'h': drop['h']}]
        placed = []
        remaining = drags[:]

        i = 0
        while i < len(remaining):
            rect = remaining[i]
            cut = {}

            def get():
                for cut_direction in (True, False):
                    baf, bssf = evaluate_placement(r, rect[0], rect[1], cut_direction)
                    if compare_candidates(baf, bssf, cut['baf'], cut['bssf']):
                        return {
                            'baf': baf,
                            'bssf': bssf,
                            'r': r,
                            'rotated': False,
                            'direction': cut_direction,
                            'i': idx
                        }
                return cut

            for idx, r in enumerate(rects):
                # Оригинальная ориентация
                if r['w'] >= rect['w'] and r['h'] >= rect['h']:
                    cut = get()
                # Повёрнутая ориентация
                if r['rotated'] and r['w'] >= rect['h'] and r['h'] >= rect['w']:
                    r['w'], r['h'] = r['h'], r['w']
                    cut = get()

            if not (
                    cut):
                i += 1
                continue

            w = rect[0] if not best_orientation else rect[1]
            h = rect[1] if not best_orientation else rect[0]
            x, y = best_rect.x, best_rect.y
            placed.append((x, y, w, h, best_orientation))

            # Создаём два новых прямоугольника в зависимости от типа реза
            if best_cut_type == 'vertical':
                # Вертикальный разрез: сначала отрезаем правую часть
                right = FreeRect(x + w, y, best_rect.w - w, best_rect.h)
                top = FreeRect(x, y + h, best_rect.w, best_rect.h - h)
            else:  # horizontal
                # Горизонтальный разрез: сначала отрезаем верхнюю часть
                top = FreeRect(x, y + h, best_rect.w, best_rect.h - h)
                right = FreeRect(x + w, y, best_rect.w - w, h)

            # Удаляем использованную область и добавляем новые (только положительные)
            rects.pop(best_rect_idx)
            if right.w > 0 and right.h > 0:
                rects.append(right)
            if top.w > 0 and top.h > 0:
                rects.append(top)

            # Удаляем размещённую деталь из списка оставшихся
            remaining.pop(i)
            # Не увеличиваем i, т.к. список сдвинулся

        results.append((plate_idx, placed))

    return results


def evaluate_placement(r: dict, p: dict, cut_direction: bool):
    if cut_direction:
        R = {'w': r['w'] - p['w'], 'h': r['h']}
        T = {'w': r['w'], 'h': r['h'] - p['h']}
    else:
        R = {'w': r['w'] - p['w'], 'h': p['h']}
        T = {'w': r['w'], 'h': r['h'] - p['h']}

    baf = (R['w'] * R['h'] if R['w'] > 0 and R['h'] > 0 else 0) + \
          (T['w'] * T['h'] if T['w'] > 0 and T['h'] > 0 else 0)

    if baf > 0:
        bssf = int('inf')
        if R['w'] > 0 and R['h'] > 0:
            bssf =min(bssf, R['w'], R['h'])
        if T['w'] > 0 and T['h'] > 0:
            bssf = min(bssf, T['w'], T['h'])
    else:
        bssf = -1

    return baf, bssf


def compare_candidates(leftover1: int, bssf1: int, leftover2: int, bssf2: int, strategy: str) -> bool:
    """
    Сравнивает два варианта размещения. Возвращает True, если первый лучше второго.
    """
    if strategy == 'baf':
        return leftover1 < leftover2
    else:  # 'baf+bssf'
        # Сначала сравниваем по оставшейся площади с эпсилон (0.1% от площади детали? используем относительное)
        # Для простоты: если разница в площади меньше 1e-6, то сравниваем по BSSF
        if abs(leftover1 - leftover2) < 1e-6:
            # Чем больше BSSF, тем лучше
            return bssf1 > bssf2
        return leftover1 < leftover2


# -------------------------------------------------------------------
# Пример использования
if __name__ == "__main__":
    plates = [(2000, 1000, 2)]  # два листа 2000x1000
    rectangles = [(400, 300, 10), (500, 200, 5)]

    result = guillotine_cut(plates, rectangles, allow_rotation=True, strategy='baf+bssf')

    for plate_idx, items in result:
        print(f"Лист {plate_idx}:")
        for x, y, w, h, rot in items:
            print(f"  Деталь {w}x{h} в ({x}, {y}) {'повёрнута' if rot else ''}")
        print(f"  Всего деталей: {len(items)}\n")
