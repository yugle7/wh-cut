from fuzzy import fuzzy
from local import local
from exact import exact
from const import MAX_TASKS_COUNT
from split import split
from utils import change


# только важные поля задачи
def get_task_id(task: tuple[list, list, list]) -> tuple:
    return tuple(sorted((q[2], q[3]) for q in task[0])) + tuple(task[1])


# является ли задача легко решаемой
def check(task: tuple[list, list, list]) -> bool:
    sheets, pieces, rects = task
    return not sheets or 2 * max(q[0] * q[1] for q in pieces) >= max(q[2] * q[3] for q in sheets)


# создаем задачи на распил
def get_tasks(task: tuple[tuple]) -> list[tuple]:
    # разбиваем на несколько более простых
    tasks = split(task)
    task_ids = set()

    # индексы задач, которые не получилось поделить
    checked = []

    i = 0
    # если задач мало
    while len(tasks) - i < MAX_TASKS_COUNT and i < len(tasks):
        if check(tasks[i]):
            checked.append(i)
        else:
            for task in split(tasks[i]):
                task_id = get_task_id(task)

                # если задача новая - добавляем в список задач
                if task_id not in task_ids:
                    task_ids.add(task_id)
                    tasks.append(task)

        # удаляем старую задачу
        i += 1

    return [tasks[j] for j in checked] + tasks[i:]


# вычисляет суммарную площадь прямоугольников
def get_a(rects: list[tuple]) -> int:
    return sum(r[2] * r[3] for r in rects)


# пилим по очереди листы на детали
def get_r(sheets: list[tuple], pieces: list[tuple]) -> list[tuple]:
    # sheets отсортированы по площади
    rects = []

    # 1. пробуем впихнуть 1 или 2 детали
    i = 0
    while i < len(sheets) and pieces:
        r = local(sheets[i], pieces)
        if r is None:
            i += 1
            continue

        rects += r
        sheets.pop(i)  # удаляем распиленный лист

    # 2. точный распил
    i = 0
    while i < len(sheets) and pieces:
        r = exact(sheets[i], pieces)
        if r is None:
            i += 1
            continue

        rects += r
        sheets.pop(i)  # удаляем распиленный лист

        # деталей стало меньше, поэтому пробуем заново
        i = 0

    # 3. неточный распил
    i = 0
    while i < len(sheets) and pieces:
        r = fuzzy(sheets[i], pieces)
        if r is None:
            i += 1
            continue

        rects += r
        sheets.pop(i)  # удаляем распиленный лист

        # деталей стало меньше, поэтому пробуем заново
        i = 0

    # 4. грубый распил
    i = 0
    while i < len(sheets) and pieces:
        rects += rough(sheets[i], pieces)
        i += 1

    return rects


def rough(sheet: tuple, pieces: list[tuple]) -> list[tuple]:
    # ищем распил с наибольшей площадью выпиленных деталей
    A = 0
    R = []
    P = []

    # ставим задачу
    task = ([sheet], pieces, [])
    tasks = get_tasks(task)

    # бежим по задачам на распил
    for sheets, p, rects in tasks:
        rects += get_r(sheets, p)

        area = get_a(rects)
        if area > A:
            A = area
            R = rects
            if not p:
                pieces.clear()
                return R
            P = p

    change(pieces, P)
    return R
