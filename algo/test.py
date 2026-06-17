import json

from exact import exact
from main import main
from rough import get_a, rough
from utils import *
from draw import *

if __name__ == '__main__':
    pieces = get_pieces(load('B/1'))
    a = sum_a(pieces)

    print('- количество деталей:', sum_c(pieces))
    print('- площадь деталей:', a)
    sheets, W, H, A = get_sheets([
        (2800, 2070, 3)
    ])
    print('- площадь листов:', A)
    if a < A:
        print('- ожидаемая заполненность:', round(100 * a / A, 2))

    print(sheets)
    print(pieces)
    rects = main(sheets, pieces)
    print(rects)
    # rects = exact(sheets[0], pieces)
    # rects = rough(sheets[0], pieces)
    print('- выбрано деталей:', len(rects))

    a = get_a(rects)
    print('- площадь выбранных деталей:', a)
    print('- полученная заполненность:', round(100 * a / A, 2))

    draw(W, H, rects)

# 16338
# 16389
