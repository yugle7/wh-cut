const testTasks = [
    {
        id: 0,
        title: 'Галечный',
        start: '2026-06-01',
        finish: '2026-07-20',
        material: 'Галечный',
        thick: 12,
        kerf: 4,
        sheet: {
            width: 2800,
            height: 2070,
            edge: 10
        },
        scraps: [
            {
                width: 1000,
                height: 2070,
                edge: 10,
                count: 1
            }
        ],
        edgings: [
            {
                line: 0,
                thick: 2
            },
            {
                line: 1,
                thick: 0.2
            }
        ],
        pieces: [
            {
                width: 568,
                height: 80,
                rotated: true,
                count: 1,
                edging: {
                    left: 0,
                    right: 1,
                    up: null,
                    down: null
                }
            },
            {
                width: 384,
                height: 320,
                rotated: true,
                count: 2,
                edging: {
                    left: null,
                    right: 1,
                    up: 1,
                    down: null
                }
            },
            {
                width: 801,
                height: 320,
                rotated: true,
                count: 6,
                edging: {
                    left: 0,
                    right: null,
                    up: null,
                    down: null
                }
            },
            {
                width: 802,
                height: 80,
                rotated: true,
                count: 1,
                edging: {
                    left: 1,
                    right: 0,
                    up: null,
                    down: 1
                }
            },
            {
                width: 600,
                height: 80,
                rotated: true,
                count: 1,
                edging: {
                    left: null,
                    right: 1,
                    up: 0,
                    down: null
                }
            },
            {
                width: 385,
                height: 330,
                rotated: true,
                count: 1,
                edging: {
                    left: 0,
                    right: 1,
                    up: 1,
                    down: null
                }
            },
            {
                width: 1030,
                height: 330,
                rotated: true,
                count: 8,
                edging: {
                    left: 1,
                    right: 0,
                    up: null,
                    down: null
                }
            },
            {
                width: 730,
                height: 330,
                rotated: true,
                count: 2,
                edging: {
                    left: 0,
                    right: 0,
                    up: 1,
                    down: null
                }
            },
            {
                width: 280,
                height: 330,
                rotated: true,
                count: 2,
                edging: {
                    left: null,
                    right: 1,
                    up: null,
                    down: 1
                }
            }
        ]
    },
    {
        id: 1,
        title: 'Грозовой',
        start: '2026-06-01',
        finish: '2026-07-20',
        material: 'Бежевый грозовой',
        thick: 12,
        kerf: 4,
        sheet: {
            width: 2800,
            height: 2070,
            edge: 10
        },
        scraps: [
        ],
        edgings: [
            {
                line: 0,
                thick: 2
            },
            {
                line: 1,
                thick: 0.2
            }
        ],
        pieces: [
            {
                width: 1070,
                height: 334,
                rotated: true,
                count: 1,
                edging: {
                    left: 0,
                    right: 1,
                    up: 1,
                    down: 1
                }
            },
            {
                width: 1054,
                height: 330,
                rotated: true,
                count: 13,
                edging: {
                    left: null,
                    right: 1,
                    up: 1,
                    down: null
                }
            },
            {
                width: 568,
                height: 330,
                rotated: true,
                count: 9,
                edging: {
                    left: 0,
                    right: null,
                    up: null,
                    down: null
                }
            },
            {
                width: 568,
                height: 150,
                rotated: true,
                count: 3,
                edging: {
                    left: 1,
                    right: 0,
                    up: null,
                    down: 1
                }
            },
            {
                width: 568,
                height: 85,
                rotated: true,
                count: 3,
                edging: {
                    left: null,
                    right: 1,
                    up: 0,
                    down: null
                }
            },
            {
                width: 567,
                height: 320,
                rotated: true,
                count: 11,
                edging: {
                    left: 0,
                    right: 1,
                    up: 1,
                    down: null
                }
            },
            {
                width: 1850,
                height: 300,
                rotated: true,
                count: 1,
                edging: {
                    left: 1,
                    right: 0,
                    up: null,
                    down: null
                }
            },
            {
                width: 1250,
                height: 300,
                rotated: true,
                count: 1,
                edging: {
                    left: 0,
                    right: 0,
                    up: 1,
                    down: null
                }
            },
            {
                width: 568,
                height: 80,
                rotated: true,
                count: 7,
                edging: {
                    left: null,
                    right: 1,
                    up: null,
                    down: 1
                }
            },
            {
                width: 1022,
                height: 568,
                rotated: true,
                count: 1,
                edging: {
                    left: null,
                    right: 1,
                    up: null,
                    down: 1
                }
            },
            {
                width: 567,
                height: 490,
                rotated: true,
                count: 2,
                edging: {
                    left: null,
                    right: 1,
                    up: null,
                    down: 1
                }
            },
            {
                width: 567,
                height: 410,
                rotated: true,
                count: 1,
                edging: {
                    left: null,
                    right: 1,
                    up: null,
                    down: 1
                }
            },
            {
                width: 704,
                height: 80,
                rotated: true,
                count: 1,
                edging: {
                    left: null,
                    right: 1,
                    up: null,
                    down: 1
                }
            },
            {
                width: 568,
                height: 80,
                rotated: true,
                count: 7,
                edging: {
                    left: null,
                    right: 1,
                    up: null,
                    down: 1
                }
            },
            {
                width: 568,
                height: 80,
                rotated: true,
                count: 7,
                edging: {
                    left: null,
                    right: 1,
                    up: null,
                    down: 1
                }
            },
            {
                width: 1720,
                height: 610,
                rotated: true,
                count: 2,
                edging: {
                    left: null,
                    right: 1,
                    up: null,
                    down: 1
                }
            },
            {
                width: 1100,
                height: 594,
                rotated: true,
                count: 2,
                edging: {
                    left: null,
                    right: 1,
                    up: null,
                    down: 1
                }
            },
            {
                width: 680,
                height: 594,
                rotated: true,
                count: 2,
                edging: {
                    left: null,
                    right: 1,
                    up: null,
                    down: 1
                }
            },
            {
                width: 1340,
                height: 560,
                rotated: true,
                count: 1,
                edging: {
                    left: null,
                    right: 1,
                    up: null,
                    down: 1
                }
            },
            {
                width: 568,
                height: 180,
                rotated: true,
                count: 1,
                edging: {
                    left: null,
                    right: 1,
                    up: null,
                    down: 1
                }
            }
        ]
    },
    {
        id: 2,
        title: 'Ржаной',
        start: '2026-06-01',
        finish: '2026-07-20',
        material: 'Владимирский ржаной',
        thick: 12,
        kerf: 4,
        sheet: {
            width: 2800,
            height: 2070,
            edge: 10
        },
        scraps: [
            {
                width: 1000,
                height: 2070,
                edge: 10,
                count: 1
            }
        ],
        edgings: [
            {
                line: 0,
                thick: 2
            },
            {
                line: 1,
                thick: 0.2
            }
        ],
        pieces: [
            {width: 1070, height: 334, rotated: true, count: 1, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 1054, height: 330, rotated: true, count: 13, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 568, height: 330, rotated: true, count: 9, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 568, height: 150, rotated: true, count: 3, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 568, height: 85, rotated: true, count: 3, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 567, height: 320, rotated: true, count: 10, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 1850, height: 300, rotated: true, count: 1, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 1250, height: 300, rotated: true, count: 1, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 568, height: 80, rotated: true, count: 6, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 1022, height: 568, rotated: true, count: 1, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 567, height: 490, rotated: true, count: 2, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 567, height: 410, rotated: true, count: 1, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 704, height: 80, rotated: true, count: 1, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 1720, height: 610, rotated: true, count: 2, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 1100, height: 594, rotated: true, count: 2, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 680, height: 594, rotated: true, count: 2, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 1340, height: 560, rotated: true, count: 1, edging: {left: null, right: 1, up: null, down: 1}},
            {width: 568, height: 180, rotated: true, count: 1, edging: {left: null, right: 1, up: null, down: 1}}
        ]
    }
];