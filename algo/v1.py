def get_vertical_packs(takes, height):
    dst = []

    def add(w, h):
        H = h
        a = area
        A = a
        I = [i]
        while H < height and len(I) <= count:
            dst.append({
                'width': w,
                'height': H,
                'area': A,
                'takes': I[:]
            })
            H += h + kerf
            A += a
            I.append(i)

    for i, q in enumerate(takes):
        count = q['count']
        if count:
            area = q['width'] * q['height']
            if q['rotated']:
                add(q['height'], q['width'])
            add(q['width'], q['height'])

    return dst


kerf = 4


def cut_horizontal_line(packs, width, height, counts):
    packs = [q for q in packs if q['height'] <= height and all(counts[i] for i in q['takes'])]

    states = [[] for _ in range(width + kerf)]
    states[0] = [{
        'counts': [0] * len(counts),
        'area': 0,
        'pack': 0,
        'n': None
    }]
    line = {'area': 0, 'packs': [], 'height': height}
    L = 0
    N = 0
    for left in range(width):
        if not states[left]:
            continue

        for n, state in enumerate(states[left]):
            c = state['counts']
            for k in range(state['pack'], len(packs)):
                pack = packs[k]
                for i in pack['takes']:
                    c[i] += 1

                if all(c[i] <= counts[i] for i in pack['takes']):
                    l = left + pack['width']
                    if l <= width:
                        l += kerf
                        a = state['area'] + pack['area']
                        if a > line['area']:
                            line['area'] = a
                            L = l
                            N = len(states[l])

                        states[l].append({
                            'counts': c[:],
                            'area': a,
                            'pack': k,
                            'n': n
                        })

                for i in pack['takes']:
                    c[i] -= 1

    while L:
        state = states[L][N]
        pack = packs[state['pack']]
        line['packs'].append(pack)
        L -= pack['width'] + kerf
        N = state['n']

    return line


def get_heights(takes, counts, height):
    dst = []
    for i, q in enumerate(takes):
        if counts[i]:
            if q['rotated'] and q['height'] < q['width'] <= height:
                dst.append(q['width'])
            elif q['height'] <= height:
                dst.append(q['height'])
    return dst


def cut_horizontal_lines(drag, takes):
    height = drag['height']
    width = drag['width']

    packs = get_vertical_packs(takes, height)
    counts = [q['count'] for q in takes]

    dst = {'area': 0, 'lines': []}

    area = 0
    lines = []

    while height > 0:
        line = cut_horizontal_line(packs, width, height, counts)
        if area + line['area'] > dst['area']:
            dst['area'] = area + line['area']
            dst['lines'] = lines + [line]

        if line['area'] == 0:
            break

        score = line['area'] / line['height']
        for h in get_heights(takes, counts, height):
            l = cut_horizontal_line(packs, width, h, counts)
            s = l['area'] / l['height']
            if s > score:
                score = s
                line = l

        for pack in line['packs']:
            for i in pack['takes']:
                counts[i] -= 1

        lines.append(line)
        height -= line['height'] + kerf

    for line in dst['lines']:
        for pack in line['packs']:
            for i in pack['takes']:
                takes[i]['count'] -= 1

    return dst


def add_take(i, take, drop, zone, first):
    zone['drags'].append({
        'left': drop['left'],
        'top': drop['top'],
        'width': take['width'],
        'height': take['height'],
        'rotated': take['rotated'],
        'cutDirection': False,
        'take': i,
        'drop': len(zone['drops'])
    })
    zone['drops'].append({**drop, 'busy': True})

    if not first:
        drop['width'] -= take['width'] + kerf
        if drop['width'] > 0:
            drop['left'] += take['width'] + kerf
            drop['height'] = take['height']
            zone['drops'].append(drop)


def add_pack(pack, drop, takes, zone):
    first = True
    for i in pack['takes']:
        take = takes[i]
        add_take(i, take, drop.copy(), zone, first)
        if first:
            drop['width'] = pack['width']
            drop['height'] = pack['height']
            first = False
        drop['height'] -= take['height'] + kerf

    if drop['height'] > 0:
        zone['drops'].append(drop)


def add_line(line, drop, takes, zone):
    first = True
    for pack in line['packs']:
        add_pack(pack, drop.copy(), takes, zone)
        drop['left'] += pack['width'] + kerf
        drop['width'] -= pack['width'] + kerf
        if first:
            drop['height'] = pack['height']
            first = False

    if drop['width'] > 0:
        zone['drops'].append(drop)


def add_lines(lines, drop, takes, zone):
    for line in lines:
        add_line(line, drop.copy(), takes, zone)
        drop['top'] += line['height'] + kerf
        drop['height'] -= line['height'] + kerf

    if drop['height'] > 0:
        zone['drops'].append(drop)


def as_zone(q):
    return {
        'width': q['width'],
        'height': q['height'],
        'drags': [],
        'drops': [
            {
                'top': q['edge'],
                'left': q['edge'],
                'width': q['width'] - 2 * q['edge'],
                'height': q['height'] - 2 * q['edge']
            }
        ]
    }


if __name__ == '__main__':
    drop = {'top': 10, 'left': 10, 'width': 2780, 'height': 2050}

    takes = [
        {'width': 1000, 'height': 500, 'count': 30, 'rotated': True}
    ]
    task = {
        'kerf': 4,
        'sheet': {'width': 2800, 'height': 2070, 'edge': 10},

    }
    scraps = [
        {'width': 2800, 'height': 2070, 'edge': 1},
    ]

    k = 0
    while any(q['count'] for q in takes):
        if k < len(scraps):
            zone = as_zone(scraps[k])
            k += 1
        else:
            zone = as_zone(task['sheet'])

        drops = [drop for drop in zone['drops'] if not drop.get('busy')]
        zone['drops'] = [drop for drop in zone['drops'] if drop.get('busy')]

        for drop in drops:
            result = cut_horizontal_lines(drop, takes)
            print('area:', result['area'])
            add_lines(result['lines'], drop, takes, zone)

        print(zone)
