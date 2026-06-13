import json


def get_mins(drags):
    return {
        'width': min(min(q['width'], q['height']) if q['rotated'] else q['width'] for q in drags),
        'height': min(min(q['width'], q['height']) if q['rotated'] else q['height'] for q in drags)
    } if drags else {}


def get_loss(drop, mins):
    s = drop['width'] * drop['height']
    if drop['width'] < mins['width'] or drop['height'] < mins['height']:
        return s
    return s * 0.1 / (1 + 1 / min(drop['width'], drop['height']))


def guillotine_cut(zones, task):
    task['pieces'].sort(key=lambda q: q['width'] * q['height'], reverse=True)

    dst = []

    drags = [{
        'width': p['width'],
        'height': p['height'],
        'rotated': p['rotated'],
        'count': p['count'],
        'i': i
    } for i, p in enumerate(task['pieces'])]

    k = 0
    while True:
        zone = zones[k]
        k = min(k + 1, len(zones))
        drops = [{
            'left': zone['e'],
            'top': zone['e'],
            'width': zone['width'] - 2 * zone['e'],
            'height': zone['height'] - 2 * zone['e']
        }]

        cuts = []

        i = 0
        while i < len(drags):
            drag = drags[i]
            cut = None

            mins = get_mins(drags[i + 1:])

            for j, drop in enumerate(drops):
                for rotated, fail in [
                    (False, drop['width'] < drag['width'] or drop['height'] < drag['height']),
                    (True, not drag['rotated'] or drag['height'] > drop['width'] or drag['width'] > drop['height'])
                ]:
                    if fail:
                        continue
                    if rotated:
                        drag['width'], drag['height'] = drag['height'], drag['width']

                    for direction in (True, False):
                        score = get_score(drop, drag, direction, mins) if mins else 0

                        if not cut or score > cut['score']:
                            cut = {
                                'score': score,
                                'direction': direction,
                                'rotated': rotated,
                                'j': j
                            }
                    if rotated:
                        drag['width'], drag['height'] = drag['height'], drag['width']

            if not cut:
                i += 1
                continue

            drag = drags[i]
            drag['count'] -= 1
            if not drag['count']:
                drags.pop(i)

            drop = drops.pop(cut['j'])

            cuts.append({
                'drop': drop,
                'drag': drag['i'],
                'direction': cut['direction'],
                'rotated': cut['rotated'],
            })

            if cut['rotated']:
                drag['width'], drag['height'] = drag['height'], drag['width']

            if cut['direction']:
                right = {
                    'left': drop['left'] + drag['width'],
                    'top': drop['top'],
                    'width': drop['width'] - drag['width'],
                    'height': drop['height']
                }
                top = {
                    'left': drop['left'],
                    'top': drop['top'] + drag['height'],
                    'width': drag['width'],
                    'height': drop['height'] - drag['height']
                }
            else:
                right = {
                    'left': drop['left'] + drag['width'],
                    'top': drop['top'],
                    'width': drop['width'] - drag['width'],
                    'height': drag['height']
                }
                top = {
                    'left': drop['left'],
                    'top': drop['top'] + drag['height'],
                    'width': drop['width'],
                    'height': drop['height'] - drag['height']
                }

            if right['width'] and right['height']:
                drops.append(right)
            if top['width'] and top['height']:
                drops.append(top)

        dst.append({
            'width': zone['width'],
            'height': zone['height'],
            'cuts': cuts
        })
        if not drags:
            break

    return dst


def get_score(drop: dict, drag: dict, cut_direction: bool, mins: dict):
    if cut_direction:
        R = {'width': drop['width'] - drag['width'], 'height': drop['height']}
        T = {'width': drop['width'], 'height': drop['height'] - drag['height']}
    else:
        R = {'width': drop['width'] - drag['width'], 'height': drag['height']}
        T = {'width': drop['width'], 'height': drop['height'] - drag['height']}

    return get_loss(drop, mins) - get_loss(R, mins) - get_loss(T, mins)


if __name__ == "__main__":
    zones = [
        {
            'width': 2000,
            'height': 1000,
            'e': 0
        },
        {
            'width': 2800,
            'height': 2080,
            'e': 10
        }
    ]
    task = {
        'pieces': [
            {'width': 400, 'height': 300, 'rotated': True, 'count': 10},
            {'width': 500, 'height': 200, 'rotated': False, 'count': 15}
        ]
    }

    print(json.dumps(guillotine_cut(zones, task), indent=2))
