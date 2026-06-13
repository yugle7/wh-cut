const takes = [
    {width: 1000, height: 500, count: 10, rotated: true}
];

const task = {
    kerf: 4,
    sheet: {width: 2800, height: 2070, edge: 10},
    scraps: [
        {width: 2800, height: 2070, edge: 1}
    ]
};

let zone;

function getVerticalPacks(takes, drop) {
    const dst = [];

    takes.forEach(({width, height, rotated, count}, i) => {
        if (count === 0) return;
        const a = width * height;

        function add(w, h) {
            let height = h;
            let area = a;
            const takes = [i];
            while (height <= drop.height && takes.length <= count) {
                dst.push({width: w, height, area, takes: takes.slice()});
                height += h + task.kerf;
                area += a
                takes.push(i);
            }
        }

        if (rotated && height <= drop.width) {
            add(height, width);
        }
        if (width <= drop.width) {
            add(width, height);
        }
    });

    return dst;
}

function cutHorizontalLine(packs, {width, height}, counts) {
    packs = packs.filter(pack =>
        pack.height <= height && pack.takes.every(i => counts[i] > 0)
    );

    const states = new Array(width + task.kerf);
    for (let i = 0; i < states.length; i++) states[i] = [];
    states[0].push({
        counts: new Array(counts.length).fill(0),
        area: 0,
        pack: 0,
        n: null
    });

    let line = {area: 0, packs: [], height};
    let L = 0;
    let N = 0;

    for (let left = 0; left < width; left++) {
        if (states[left].length === 0) continue;

        states[left].forEach((state, n) => {
            const c = state.counts;

            for (let k = state.pack; k < packs.length; k++) {
                const pack = packs[k];
                for (const i of pack.takes) c[i]++;

                if (pack.takes.every(i => c[i] <= counts[i])) {
                    const l = left + pack.width + task.kerf;
                    if (l <= width) {
                        const a = state.area + pack.area;
                        if (a > line.area) {
                            line.area = a;
                            L = l;
                            N = states[l].length;
                        }
                        states[l].push({counts: [...c], area: a, pack: k, n});
                    }
                }
                for (const i of pack.takes) c[i]--;
            }
        });
    }

    while (L) {
        const state = states[L][N];
        const pack = packs[state.pack];
        line.packs.push(pack);
        L -= pack.width + task.kerf;
        N = state.n;
    }
    line.score = line.area / line.height;

    return line;
}

function getHeights(takes, drop, counts) {
    const heights = [];

    counts.forEach((c, i) => {
        if (c === 0) return;
        const {rotated, height, width} = takes[i];
        if (rotated && height < width && width <= drop.height && height <= drop.width) {
            heights.push(width);
        } else if (height <= drop.height && width <= drop.width) {
            heights.push(height);
        }
    })
    return heights;
}

function cutVerticalLines(drop, takes) {
    takes = takes.map(({width, height, rotated, count}) => ({width: height, height: width, rotated, count}));
    drop = {width: drop.width, height: drop.height};
    return cutHorizontalLines(drop, takes);
}

function cutHorizontalLines(drop, takes) {
    const packs = getVerticalPacks(takes, drop);
    const counts = takes.map(({count}) => count);

    const dst = {area: 0, lines: []};

    let area = 0
    const lines = [];

    while (drop.height > 0) {
        let line = cutHorizontalLine(packs, drop, counts);

        if (area + line.area > dst.area) {
            line.height = 0;
            for (const pack of line.packs) {
                if (pack.height > line.height) line.height = pack.height;
            }
            dst.area = area + line.area;
            dst.lines = [...lines, line];
        }
        if (line.score === 0) break;

        for (const height of getHeights(takes, drop, counts)) {
            const l = cutHorizontalLine(packs, {width: drop.width, height}, counts);
            if (l.score > line.score) {
                line = l;
            }
        }
        lines.push(line);
        area += line.area;

        drop.height -= line.height + task.kerf;
        line.packs.forEach(({takes}) => takes.forEach(i => counts[i]--));
    }

    return dst.lines;
}


function addTake({i, rotated, width, height}, drop, first) {
    zone.drags.push({
        left: drop.left, top: drop.top,
        width, height, rotated,
        cutDirection: false,
        take: i, drop: zone.drops.length
    })
    zone.drops.push({...drop, busy: true});

    if (!first && drop.width > width + task.kerf) {
        zone.drops.push({
            top: drop.top, left: drop.left + width + task.kerf,
            width: drop.width - width - task.kerf, height
        });
    }
}

function addPack(pack, drop, takes) {
    let first = true;
    for (const i of pack.takes) {
        let {rotated, width, height} = takes[i]
        if (rotated && (width < height || width > pack.width) && height <= pack.width) {
            [width, height] = [height, width];
        }
        addTake({i, rotated, width, height}, drop, first);
        if (first) {
            drop.width = pack.width;
            drop.height = pack.height;
            first = false;
        }
        drop.top += height + task.kerf;
        drop.height -= height + task.kerf;
    }
    console.log('drop', drop)
    if (drop.height > 0) {
        zone.drops.push(drop);
    }
}

function addLine(line, drop, takes) {
    let first = true;
    for (const pack of line.packs) {
        pack.height = line.height;
        addPack(pack, {...drop}, takes);
        drop.left += pack.width + task.kerf;
        drop.width -= pack.width + task.kerf;
        if (first) {
            drop.height = pack.height;
            first = false;
        }
    }
    if (drop.width > 0) {
        zone.drops.push(drop);
    }
}

function addLines(lines, drop, takes) {
    lines.forEach(line => {
        addLine(line, {...drop}, takes);
        drop.top += line.height + task.kerf;
        drop.height -= line.height + task.kerf;
    })
    if (drop.height > 0) {
        zone.drops.push(drop);
    }
}

function asZone(q) {
    return {
        width: q.width,
        height: q.height,
        drags: [],
        drops: [
            {
                top: q.edge,
                left: q.edge,
                width: q.width - 2 * q.edge,
                height: q.height - 2 * q.edge
            }
        ]
    };
}

const horizontalCut = (drop, takes) => {
    const lines = cutHorizontalLines({...drop}, takes);
    lines.forEach(({packs}) => packs.forEach(pack => pack.takes.forEach(i => takes[i].count--)));
    addLines(lines, drop, takes);
}

const cut = (takes) => {
    let k = 0;
    while (takes.some(({count}) => count > 0)) {
        if (k < task.scraps.length) {
            zone = asZone(task.scraps[k]);
            k++;
        } else {
            zone = asZone(task.sheet);
        }
        const drops = zone.drops.filter(d => !d.busy);
        zone.drops = zone.drops.filter(d => d.busy);

        drops.forEach(drop => horizontalCut(drop, takes));
        console.log(zone)
    }
}

cut(takes);