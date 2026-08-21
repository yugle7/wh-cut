const helpTask = {
    id: 0,
    title: 'Мой первый раскрой',
    start: '2026-06-01',
    finish: '2026-07-20',
    material: 'Галечный',
    kerf: 4,
    sheet: {width: 2800, height: 2070, edge: 10, depth: 12, rotated: false},
    scraps: [],
    edgings: [
        {line: 0, thick: 2},
        {line: 1, thick: 0.4}
    ],
    rolls: [{inner: 52, outer: 134, line: 1, thick: 0.4, length: 29940}],
    pieces: [
        {width: 568, height: 80, rotated: true, count: 1, edging: {left: 0, right: 1, up: null, down: null}},
        {width: 384, height: 320, rotated: true, count: 2, edging: {left: null, right: 1, up: 1, down: null}},
        {width: 801, height: 320, rotated: true, count: 6, edging: {left: 0, right: null, up: null, down: null}},
        {width: 802, height: 80, rotated: true, count: 1, edging: {left: 1, right: 0, up: null, down: 1}},
        {width: 600, height: 80, rotated: true, count: 1, edging: {left: null, right: 1, up: 0, down: null}},
        {width: 385, height: 330, rotated: true, count: 1, edging: {left: 0, right: 1, up: 1, down: null}},
        {width: 1030, height: 330, rotated: true, count: 8, edging: {left: 1, right: 0, up: null, down: null}},
        {width: 730, height: 330, rotated: true, count: 2, edging: {left: 0, right: 0, up: 1, down: null}},
        {width: 280, height: 330, rotated: true, count: 2, edging: {left: null, right: 1, up: null, down: 1}}
    ]
}