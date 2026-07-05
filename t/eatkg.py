class Rect:
    def __init__(self, w: int, h: int, value: int, count: int = 1):
        self.w = w
        self.h = h
        self.value = value
        self.count = count

    def area(self) -> int:
        return self.w * self.h


class Solution:
    def __init__(self):
        self.items = []
        self.total_value = 0

    def add_item(self, rect: Rect, x: int, y: int, rotated: bool):
        self.items.append((rect, x, y, rotated))
        self.total_value += rect.value


def run(
        W: int,
        H: int,
        item_types: list[Rect],
        upper_bound_func
):
    best_solution = Solution()
    # Сортируем детали по убыванию ценности для лучшего ветвления
    sorted_items = sorted(item_types, key=lambda x: x.value / x.area(), reverse=True)
    
    
    def backtrack(x: int, y: int, w: int, h: int, current_solution: Solution, remaining_items: list[Rect]):
        nonlocal best_solution
    
        # Обновляем лучшее решение, если текущее лучше
        if current_solution.total_value > best_solution.total_value:
            best_solution = current_solution
    
        # Проверка верхней границы: если даже теоретический максимум не лучше, прерываемся
        if upper_bound_func(w, h, remaining_items) + current_solution.total_value <= best_solution.total_value:
            return
    
        # Пробуем разместить деталь в текущем прямоугольнике
        for i, rect in enumerate(remaining_items):
            if rect.count <= 0:
                continue
    
            # Пробуем две ориентации
            for rotated in [False, True]:
                rw, rh = (rect.h, rect.w) if rotated else (rect.w, rect.h)
    
                # Проверяем, помещается ли деталь
                if rw <= w and rh <= h:
                    # Уменьшаем количество доступных деталей
                    rect.count -= 1
                    new_remaining = remaining_items[:]
    
                    # Создаем новое решение, добавляя деталь
                    new_solution = Solution()
                    new_solution.items = current_solution.items.copy()
                    new_solution.total_value = current_solution.total_value
                    new_solution.add_item(rect, x, y, rotated)
    
                    # --- ГИЛЬОТИННОЕ РАЗБИЕНИЕ ---
                    # После размещения детали в углу (x, y), 
                    # оставшееся пространство делится на два прямоугольника:
                    # 1) Справа: (x + rw, y, w - rw, h)
                    # 2) Сверху: (x, y + rh, rw, h - rh)
    
                    # Вариант 1: Сначала режем вертикально, потом горизонтально
                    if w - rw > 0 and h > 0:
                        backtrack(x + rw, y, w - rw, h, new_solution, new_remaining)
                    if rw > 0 and h - rh > 0:
                        backtrack(x, y + rh, rw, h - rh, new_solution, new_remaining)
    
                    # Вариант 2: Сначала режем горизонтально, потом вертикально
                    # (для простоты опущен, но в реальном EATKG оба варианта рассматриваются)
    
                    # Возвращаем деталь обратно
                    rect.count += 1
    
    
    # Запускаем поиск
    initial_solution = Solution()
    backtrack(0, 0, container_w, container_h, initial_solution, sorted_items)
    
    return best_solution if best_solution.total_value > 0 else None


# --- Вспомогательная функция для верхней границы ---
def simple_upper_bound(w: int, h: int, items: list[Rect]) -> int:
    """Простая верхняя граница: максимальная ценность, основанная на площади."""
    total_area = w * h
    # Сортируем по ценности на единицу площади
    sorted_by_density = sorted(items, key=lambda x: x.value / x.area(), reverse=True)
    remaining_area = total_area
    max_value = 0
    for item in sorted_by_density:
        if item.count <= 0:
            continue
        # Берем столько деталей, сколько помещается по площади
        max_possible = min(item.count, remaining_area // item.area())
        max_value += max_possible * item.value
        remaining_area -= max_possible * item.area()
    return max_value


# --- Пример использования ---
if __name__ == "__main__":
    # Параметры листа
    container_w, container_h = 10, 10

    # Типы деталей: (ширина, высота, ценность, количество)
    items = [
        Rect(5, 5, 10, 2),
        Rect(4, 6, 8, 1),
        Rect(3, 2, 3, 5),
    ]

    solution = run(container_w, container_h, items, simple_upper_bound)

    if solution:
        print(f"Лучшая найденная ценность: {solution.total_value}")
        for rect, x, y, rotated in solution.items:
            print(f"Деталь ({rect.w}x{rect.h}) в ({x}, {y}) rotated={rotated}")
    else:
        print("Решение не найдено.")
