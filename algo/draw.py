import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

from const import EDGE, KERF


def get_colors(rects: list[tuple]):
    src = {(w, h) if w > h else (h, w) for x, y, w, h in rects}
    print('colors:', len(src))
    colors = plt.cm.tab20(np.linspace(0, 1, len(src)))
    dst = {}
    for c, (w, h) in zip(colors, src):
        dst[(w, h)] = dst[(h, w)] = c
    return dst


def draw(width: int, height: int, rects: list[tuple]):
    rects = [(x + EDGE, y + EDGE, w - KERF, h - KERF) for (x, y, w, h) in rects]
    fig, ax = plt.subplots(figsize=(8, 6))
    colors = get_colors(rects)

    ax.set_xlim(0, width)
    ax.set_ylim(0, height)
    ax.set_aspect('equal', adjustable='box')
    ax.grid(True, linestyle='--', alpha=0.5)

    for x, y, w, h in rects:
        # Рисуем прямоугольник (левый нижний угол, ширина, высота)
        rect = patches.Rectangle(
            (x, y), w, h,
            linewidth=1, edgecolor='black',
            facecolor=colors[(w, h)], alpha=0.6)
        ax.add_patch(rect)

    # Рисуем границу листа
    sheet_border = patches.Rectangle(
        (0, 0), width, height,
        linewidth=2, edgecolor='black',
        facecolor='none', linestyle='-'
    )
    ax.add_patch(sheet_border)

    plt.tight_layout()
    plt.show()
