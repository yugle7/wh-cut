
class Rectangle:
    def __init__(self, width: int, height: int, rotated: bool = True, id: int = None):
        self.width = width
        self.height = height
        self.id = id
        self.rotated = rotated

    def get_area(self) -> float:
        return self.width * self.height


class Node:
    def __init__(self, x: float, y: float, width: float, height: float):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.rect = None
        self.child_a = None   # Левый/верхний дочерний узел после разреза
        self.child_b = None   # Правый/нижний дочерний узел

    def is_leaf(self) -> bool:
        return self.child_a is None and self.child_b is None

    def split(self, rect: Rectangle, is_vertical: bool):
        self.rect = rect
        if is_vertical:
            self.child_a = Node(self.x, self.y, rect.width, self.height)
            self.child_b = Node(self.x + rect.width, self.y, self.width - rect.width, self.height)
        else:
            self.child_a = Node(self.x, self.y, self.width, rect.height)
            self.child_b = Node(self.x, self.y + rect.height, self.width, self.height - rect.height)


def find_best_node(node: Node, rect: Rectangle):
    if not node.is_leaf():
        res = find_best_node(node.child_a, rect)
        if res: return res
        # Затем в правом/нижнем
        return find_best_node(node.child_b, rect)

    # Узел свободен
    can_fit_normal = rect.width <= node.width and rect.height <= node.height
    can_fit_rotated = rect.rotated and rect.height <= node.width and rect.width <= node.height

    if can_fit_normal:
        return node, False
    elif can_fit_rotated:
        return node, True
    else:
        return None


def guillotine_pack(rectangles: list, sheet: dict):
    rectangles.sort(key=lambda r: r['width'] * r['height'], reverse=True)

    root = Node(0, 0, sheet['width'], sheet['height'])
    packed_rects = []

    for rect in rectangles:
        best = find_best_node(root, rect)
        if best:
            node, should_rotate = best
            # Применяем поворот, если нужно
            final_rect = Rectangle(rect.height, rect.width, rect.rotated, rect.id) if should_rotate else rect
            # Определяем направление разреза для минимизации остатка
            # Эвристика: режем по длинной стороне оставшегося пространства
            is_vertical = node.width - final_rect.width > node.height - final_rect.height

            node.split(final_rect, is_vertical)
            packed_rects.append(final_rect)
            print(f"Размещена деталь {final_rect.id}: {final_rect.width}x{final_rect.height} на позиции ({node.x}, {node.y})")
        else:
            print(f"Не удалось разместить деталь {rect.id}")

    return packed_rects


# --- Пример использования ---
if __name__ == "__main__":
    # Создаем список деталей, укажем, какие из них можно поворачивать
    items = [
        Rectangle(30, 40, rotated=True, id=1),
        Rectangle(50, 20, rotated=False, id=2),
        Rectangle(20, 20, rotated=True, id=3),
        Rectangle(60, 30, rotated=False, id=4),
        Rectangle(25, 35, rotated=True, id=5),
    ]

    SHEET_W, SHEET_H = 100, 100
    packed = guillotine_pack(items, SHEET_W, SHEET_H)