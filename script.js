const DATA_URL = ""; // https://d5ds1trsppqs2rog97qd.cmxivbes.apigw.yandexcloud.net";
const ALGO_URL = "https://d5d313gii5f4ak4h4arg.wnq2w1o5.apigw.yandexcloud.net";

// Элементы

// 1. Главная страница

const mainPage = document.getElementById("main");

const createTaskButton = document.getElementById("create-task");
const tasksList = document.getElementById("tasks");

// 2. Навигация

const menuNav = document.getElementById("menu");

const toMainButton = document.getElementById("to-main");
const toSettingButton = document.getElementById("to-setting");
const toCuttingButton = document.getElementById("to-cutting");

// 3. Настройки задачи раскроя

const settingPage = document.getElementById("setting");
const settingGutter = document.getElementById("setting-gutter");

const removeTaskButton = document.getElementById("remove-task");

// 3.1 Задача

const taskForm = document.getElementById("task");
const toUpdateTaskLink = document.getElementById("to-update-task");

const taskTitleInput = document.getElementById("task-title");
const taskMaterialInput = document.getElementById("task-material");
const taskThickInput = document.getElementById("task-thick");
const taskStartInput = document.getElementById("task-start");
const taskFinishInput = document.getElementById("task-finish");
const taskKerfInput = document.getElementById("task-kerf");

// 3.2 Лист

const sheetForm = document.getElementById("sheet");
const toUpdateSheetLink = document.getElementById("to-update-sheet");

const sheetWidthInput = document.getElementById("sheet-width");
const sheetHeightInput = document.getElementById("sheet-height");
const sheetEdgeInput = document.getElementById("sheet-edge");

// 3.3 Обрезки

const scrapForm = document.getElementById("scrap");
const scrapsList = document.getElementById("scraps");
const toCreateScrapLink = document.getElementById("to-create-scrap");

const scrapWidthInput = document.getElementById("scrap-width");
const scrapHeightInput = document.getElementById("scrap-height");
const scrapEdgeInput = document.getElementById("scrap-edge");
const scrapCountInput = document.getElementById("scrap-count");

// 3.4 Кромки

const edgingForm = document.getElementById("edging");
const edgingsList = document.getElementById("edgings");
const toCreateEdgingLink = document.getElementById("to-create-edging");

const edgingLineInput = document.getElementById('edging-line');
const edgingThickInput = document.getElementById('edging-thick');

// 3.5 Детали

const pieceForm = document.getElementById("piece");
const piecesList = document.getElementById("pieces");
const toCreatePieceLink = document.getElementById("to-create-piece");

const pieceWidthInput = document.getElementById('piece-width');
const pieceHeightInput = document.getElementById('piece-height');
const pieceRotatedInput = document.getElementById('piece-rotated');
const pieceCountInput = document.getElementById('piece-count');

const pieceEdgingUpInput = document.getElementById('piece-edging-up');
const pieceEdgingDownInput = document.getElementById('piece-edging-down');
const pieceEdgingLeftInput = document.getElementById('piece-edging-left');
const pieceEdgingRightInput = document.getElementById('piece-edging-right');

// 3.6 Формы добавления и изменения

const createButton = document.getElementById("create");
const removeButton = document.getElementById("remove");
const updateButton = document.getElementById("update");
const formLabel = document.getElementById("form");

// 4. Редактор раскроя

const cuttingPage = document.getElementById("cutting");
const fastCutButton = document.getElementById("fast-cut");
const slowCutButton = document.getElementById("slow-cut");

const clearButton = document.getElementById("clear");

const downloadCuttingButton = document.getElementById("download-cutting");
const cuttingGutter = document.getElementById("cutting-gutter");

const takeArea = document.getElementById("take");
const dropArea = document.getElementById("drop");

// 4.1 Управление

const toolsBlock = document.getElementById("tools");
const cutDirectionButton = document.getElementById("cut-direction");
const rotatePieceButton = document.getElementById("rotate-piece");

// 5. Печать

const printPages = document.getElementById('print');

// Константы

// 1. Редактор

const edgingLines = ['line', 'dash', 'wave'];

const defaultTask = {
    kerf: 4,
    title: "Раскрой",
    sheet: {width: 2800, height: 2070, edge: null},
    scraps: [],
    edgings: [{line: 0, thick: 2}, {line: 1, thick: 0.2}],
    pieces: [],
};

const labels = {
    task: 'Задача',
    sheet: 'Лист',
    scrap: 'Обрезок',
    edging: 'Кромка',
    piece: 'Деталь',
    yes: 'да',
    no: 'нет',
    cut: 'собрать'
}

const toDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split("-");
    return `${day}.${month}.${year}`;
}

const isOn = (inner, outer) => inner.left >= outer.left && inner.top >= outer.top && inner.left + inner.width <= outer.left + outer.width && inner.top + inner.height <= outer.top + outer.height;

const p = (value) => `${(100 * value).toFixed(3)}%`;

// 2. HTML

const spriteHtml = (name) => `<use href="sprite.svg#${name}"></use>`;

const iconHtml = (icon, color = "gray") => `<svg class="icon ${color}">${spriteHtml(icon)}</svg>`;
const lineHtml = (line) => {
    const color = line === null ? "gray" : "yellow";
    line = line === null ? "line" : edgingLines[line];
    return `<svg class="line ${color}">${spriteHtml(line)}</svg>`;
}
const valueHtml = (value, unit) => `<span class="value"><span>${value || 0}</span><span class="unit">${unit}</span></span>`

const x = iconHtml('x');
const v = iconHtml('v');
const o = iconHtml('o');

// 3. PDF

const A4 = {
    width: 297,
    height: 210
}

const D = 10;
const H = {
    top: D,
    left: D,
    right: D,
    height: 20
}
H.bottom = A4.height - 2 * D - H.height;
const S = {
    top: 2 * D + H.height,
    right: D,
    width: 70,
    bottom: D
}
S.left = A4.width - S.width - D;
const A = {
    top: S.top,
    left: D - 1,
    right: D + S.width + S.right + 1,
    bottom: D,
}
A.width = A4.width - A.left - A.right;
A.height = A4.height - A.top - A.bottom;

// 4. Отладка

// const fakeTasks = [
//     {
//         id: 0,
//         title: 'Раскрой меня',
//         start: '2026-06-01',
//         finish: '2026-07-20',
//         material: 'Владимирский ржаной',
//         thick: 12,
//         kerf: 4,
//         sheet: {
//             width: 2800, height: 2070, edge: 10
//         },
//         scraps: [{width: 1800, height: 1000, edge: 0, count: 1}],
//         edgings: [{line: 0, thick: 2}, {line: 1, thick: 0.2}],
//         pieces: [{
//             width: 334,
//             height: 284,
//             rotated: true,
//             count: 2,
//             edging: {left: 0, right: 1, up: null, down: null}
//         }, {
//             width: 572,
//             height: 84,
//             rotated: false,
//             count: 1,
//             edging: {left: null, right: 1, up: 1, down: null}
//         }, {
//             width: 604,
//             height: 84,
//             rotated: true,
//             count: 1,
//             edging: {left: 0, right: null, up: null, down: null}
//         }, {
//             width: 388,
//             height: 324,
//             rotated: false,
//             count: 2,
//             edging: {left: 1, right: 0, up: null, down: 1}
//         }, {
//             width: 389,
//             height: 334,
//             rotated: false,
//             count: 1,
//             edging: {left: null, right: 1, up: 0, down: null}
//         }, {
//             width: 806,
//             height: 84,
//             rotated: true,
//             count: 1,
//             edging: {left: 0, right: 1, up: 1, down: null}
//         }, {
//             width: 734,
//             height: 334,
//             rotated: true,
//             count: 2,
//             edging: {left: 1, right: 0, up: null, down: null}
//         }, {
//             width: 805,
//             height: 324,
//             rotated: false,
//             count: 6,
//             edging: {left: 0, right: 0, up: 1, down: null}
//         }, {
//             width: 1034,
//             height: 334,
//             rotated: true,
//             count: 8,
//             edging: {left: null, right: 1, up: null, down: 1}
//         }]
//     }
// ];

fakeTasks = [
    {
        id: 0,
        title: 'Раскрой меня',
        start: '2026-06-01',
        finish: '2026-07-20',
        material: 'Владимирский ржаной',
        thick: 12,
        kerf: 4,
        sheet: {
            width: 2800, height: 2070, edge: 10
        },
        scraps: [{width: 2800, height: 2070, edge: 10, count: 1}],
        edgings: [{line: 0, thick: 2}, {line: 1, thick: 0.2}],
        pieces: [{
            width: 568,
            height: 80,
            rotated: true,
            count: 1,
            edging: {left: 0, right: 1, up: null, down: null}
        }, {
            width: 384,
            height: 320,
            rotated: true,
            count: 2,
            edging: {left: null, right: 1, up: 1, down: null}
        }, {
            width: 801,
            height: 320,
            rotated: true,
            count: 6,
            edging: {left: 0, right: null, up: null, down: null}
        }, {
            width: 802,
            height: 80,
            rotated: true,
            count: 1,
            edging: {left: 1, right: 0, up: null, down: 1}
        }, {
            width: 600,
            height: 80,
            rotated: true,
            count: 1,
            edging: {left: null, right: 1, up: 0, down: null}
        }, {
            width: 385,
            height: 330,
            rotated: true,
            count: 1,
            edging: {left: 0, right: 1, up: 1, down: null}
        }, {
            width: 1030,
            height: 330,
            rotated: true,
            count: 8,
            edging: {left: 1, right: 0, up: null, down: null}
        }, {
            width: 730,
            height: 330,
            rotated: true,
            count: 2,
            edging: {left: 0, right: 0, up: 1, down: null}
        }, {
            width: 280,
            height: 330,
            rotated: true,
            count: 2,
            edging: {left: null, right: 1, up: null, down: 1}
        }]
    }
];

// Состояние

// 1. Общее

let page = mainPage;

let tasks = [];
let task = null;

// 2. Параметры задачи

let form = taskForm;
let link = null;
let index = null;

let edgingLine = -1;
let pieceRotated = false;
let pieceEdging = {left: null, up: null, right: null, down: null};

// 3. Редактор раскроя

let colors = [];

// 4. Печать

let scale;
let pdfHead;

// 5. Автоматический раскрой

let line;

// Навигация

const changePage = (p) => {
    console.log('changePage')
    if (page === p) return false;
    if (p === mainPage) {
        menuNav.classList.add('hidden');
    } else {
        menuNav.classList.remove('hidden');
        if (p === settingPage) {
            removeTaskButton.classList.remove('hidden');
            downloadCuttingButton.classList.add('hidden');

            toSettingButton.classList.add('hidden');
            toCuttingButton.classList.remove('hidden');

            toolsBlock.classList.add('hidden');
        } else {
            removeTaskButton.classList.add('hidden');
            downloadCuttingButton.classList.remove('hidden');

            toSettingButton.classList.remove('hidden');
            toCuttingButton.classList.add('hidden');

            toolsBlock.classList.remove('hidden');
        }
    }
    page.classList.add("hidden");
    page = p;
    page.classList.remove("hidden");
    return true;
}

// Разделитель

let gutter = null;
let startX = 0;
let startLeftWith = 0;

const minWidth = 150;
const maxWidth = 100000;

function handlePointerDown(e) {
    console.log('handlePointerDown')
    e.preventDefault();
    gutter = e.currentTarget;
    gutter.setPointerCapture(e.pointerId);
    gutter.classList.add("dragging");
    document.body.style.cursor = "col-resize";
    startX = e.clientX;
    startLeftWith = page.firstElementChild.getBoundingClientRect().width;
}

function handlePointerMove(e) {
    if (!gutter) return;
    console.log('handlePointerMove')
    e.preventDefault();

    let leftWidth = startLeftWith + e.clientX - startX;
    leftWidth = Math.min(maxWidth, Math.max(minWidth, leftWidth));

    gutter.style.left = leftWidth + 'px';
    page.style.gridTemplateColumns = `${leftWidth}px 1fr`;

    if (gutter === cuttingGutter) {
        takeArea.style.width = leftWidth + 'px';
    }
}

function handlePointerUp(e) {
    if (!gutter) return;
    console.log('handlePointerUp')
    gutter.releasePointerCapture(e.pointerId);
    gutter.classList.remove("dragging");
    document.body.style.cursor = "";
    gutter = null;
}

window.addEventListener('pointermove', handlePointerMove);
window.addEventListener('pointerup', handlePointerUp);
window.addEventListener('mouseleave', handlePointerUp);
window.addEventListener('pointercancel', handlePointerUp);

cuttingGutter.onpointerdown = handlePointerDown;
settingGutter.onpointerdown = handlePointerDown;

// 1. Выбор задачи

toMainButton.onclick = () => {
    menuNav.classList.add('hidden');
    changePage(mainPage);
}

createTaskButton.onclick = async () => {
    await createTask();
    setTask(task);
    changePage(settingPage);
    addTask(task);
};

const toTask = async (e) => {
    e.preventDefault()

    if (changePage(settingPage)) {
        scrapsList.replaceChildren();
        edgingsList.replaceChildren();
        piecesList.replaceChildren();

        await loadTask(e.currentTarget.id);
        setTask(task);
    }
}

// 1.1 Отображение данных

const addTask = ({id, title}) => {
    const q = document.createElement('li')
    q.innerText = title;
    q.id = id;
    q.onclick = toTask;
    tasksList.appendChild(q);
}

// 1.2 Получение данных

const loadTasks = async () => {
    if (DATA_URL) {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        tasks = await response.json();
    } else {
        const t = localStorage.getItem('tasks');
        tasks = t ? JSON.parse(t) : [];

        tasks.forEach(q => {
            q.scraps = q.scraps.filter(Boolean);
            q.edgings = q.edgings.filter(Boolean);
            q.pieces = q.pieces.filter(Boolean);
        });
    }
};

// 2. Настройки задачи раскроя

toSettingButton.onclick = () => changePage(settingPage);

// 2.1 Отображение данных

const titleHtml = () => `<h1>${task.title}</h1>`

const dateHtml = () => task.start || task.finish ? `<div class="section"><span>${toDate(task.start)}</span><span class="date">${toDate(task.finish)}</span></div>` : '';

const materialHtml = () => task.material ? `<div class="section"><span>${task.material}</span><span>${valueHtml(task.thick, 'мм')}</span></div>` : '';

const kerfHtml = () => `<span>${valueHtml(task.kerf || 0, 'мм')}</span>`;

const sheetHtml = (
    {
        width,
        height,
        edge
    }) => `<div class="section"><span>${width}${x}${height}${v}${valueHtml(edge, 'мм')}</span>${kerfHtml()}</div>`;

const scrapHtml = (
    {
        width,
        height,
        edge,
        count
    }) => `<div>${width}${x}${height}${v}${valueHtml(edge, 'мм')}</div>${valueHtml(count, 'шт')}`;

const edgingHtml = ({line, thick}) => `<div>${lineHtml(line)}</div>${valueHtml(thick, 'мм')}`;

const pieceHtml = ({width, height, rotated, edging, count}) => {
    const {left, up, right, down} = edging;

    const w = `<div class="col"><span>${width}</span>${lineHtml(up)}${lineHtml(down)}</div>`;
    const h = `<div class="col"><span>${height}</span>${lineHtml(left)}${lineHtml(right)}</div>`;

    return `<div>${w}${rotated ? o : x}${h}</div>${valueHtml(count, 'шт')}`
}

// 2.2 Заполнение полей задачи

const setTask = ({title, start, finish, material, thick, kerf, sheet, scraps, edgings, pieces}) => {
    taskTitleInput.value = title;

    taskKerfInput.value = kerf || '';
    taskStartInput.value = start;
    taskFinishInput.value = finish;
    taskMaterialInput.value = material || '';
    taskThickInput.value = thick || '';

    toUpdateTaskLink.innerHTML = titleHtml() + dateHtml() + materialHtml();
    toUpdateSheetLink.innerHTML = sheetHtml(sheet);
    setSheet(sheet);

    scrapsList.replaceChildren();
    scraps.forEach(addScrap);
    edgingsList.replaceChildren();
    edgings.forEach(addEdging);
    piecesList.replaceChildren();
    pieces.forEach(addPiece);
}

const setSheet = ({width, height, edge}) => {
    sheetWidthInput.value = width;
    sheetHeightInput.value = height;
    sheetEdgeInput.value = edge;
};

// 2.3 Добавление и обновление обрезка

const copyScrapToForm = ({width, height, edge, count}) => {
    console.log('copyScrapToForm')
    scrapWidthInput.value = width;
    scrapHeightInput.value = height;
    scrapEdgeInput.value = edge;
    scrapCountInput.value = count;
}

const addScrap = (scrap, i) => {
    console.log('addScrap')
    let q = document.createElement('li');
    q.innerHTML = `<button class="section">${scrapHtml(scrap)}</button>`
    q.firstChild.onclick = (e) => {
        index = i;
        copyScrapToForm(scrap);
        changeForm(e, scrapForm);
        formLabel.innerText = labels.scrap;
        toUpdateForm();
    }
    scrapsList.appendChild(q);
    return q.firstChild;
};

const createScrap = () => {
    index = task.scraps.length;
    task.scraps.push({
        width: +scrapWidthInput.value,
        height: +scrapHeightInput.value,
        edge: +scrapEdgeInput.value,
        count: +scrapCountInput.value
    });
    link = addScrap(task.scraps[index], index);
}

const updateScrap = () => {
    task.scraps[index] = {
        width: +scrapWidthInput.value,
        height: +scrapHeightInput.value,
        edge: +scrapEdgeInput.value,
        count: +scrapCountInput.value,
    }
    link.innerHTML = scrapHtml(task.scraps[index]);
}

// 2.4 Добавление и обновление кромки

const copyEdgingToForm = ({line, thick}) => {
    console.log('copyEdgingToForm')
    edgingThickInput.value = thick;
    edgingLine = line;
    edgingLineInput.innerHTML = lineHtml(line);
}

const addEdging = (edging, i) => {
    console.log('addEdging')
    let q = document.createElement('li');
    q.innerHTML = `<button class="section">${edgingHtml(edging)}</button>`;
    q.firstChild.onclick = (e) => {
        index = i;
        copyEdgingToForm(edging);
        changeForm(e, edgingForm);
        formLabel.innerText = labels.edging;
        toUpdateForm();
    }
    edgingsList.appendChild(q);
    return q.firstChild;
};

const createEdging = () => {
    index = task.edgings.length;
    task.edgings.push({
        line: edgingLine,
        thick: edgingThickInput.value
    });
    link = addEdging(task.edgings[index], index);
}

const updateEdging = () => {
    task.edgings[index] = {
        line: edgingLine,
        thick: edgingThickInput.value
    };
    link.innerHTML = edgingHtml(task.edgings[index]);
}

// 2.5 Добавление и обновление детали

const copyPieceToForm = ({width, height, rotated, count, edging}) => {
    pieceWidthInput.value = width;
    pieceHeightInput.value = height;
    pieceRotated = rotated;
    pieceRotatedInput.innerText = rotated ? labels.yes : labels.no;
    pieceCountInput.value = count;

    pieceEdging = edging;
    pieceEdgingUpInput.innerHTML = lineHtml(edging.up);
    pieceEdgingDownInput.innerHTML = lineHtml(edging.down);
    pieceEdgingLeftInput.innerHTML = lineHtml(edging.left);
    pieceEdgingRightInput.innerHTML = lineHtml(edging.right);
}

const addPiece = (piece, i) => {
    let q = document.createElement('li');
    q.innerHTML = `<button class="section">${pieceHtml(piece)}</button>`
    q.firstChild.onclick = (e) => {
        index = i;
        copyPieceToForm(piece);
        changeForm(e, pieceForm);
        formLabel.innerText = labels.piece;
        toUpdateForm();
    }
    piecesList.appendChild(q);
    return q.firstChild;
};

const createPiece = () => {
    index = task.pieces.length;
    task.pieces.push({
        width: +pieceWidthInput.value,
        height: +pieceHeightInput.value,
        rotated: pieceRotated,
        edging: pieceEdging,
        count: +pieceCountInput.value
    });
    link = addPiece(task.pieces[index], index);
}

const updatePiece = () => {
    task.pieces[index] = {
        width: +pieceWidthInput.value,
        height: +pieceHeightInput.value,
        rotated: pieceRotated,
        edging: pieceEdging,
        count: +pieceCountInput.value
    };
    link.innerHTML = pieceHtml(task.pieces[index]);
}

// 2.6 Обновление задачи и листа

const updateTask = () => {
    task.title = taskTitleInput.value || labels.task;
    task.kerf = +taskKerfInput.value || 0;
    task.material = taskMaterialInput.value;
    task.thick = +taskThickInput.value;
    task.start = taskStartInput.value;
    task.finish = taskFinishInput.value;

    toUpdateTaskLink.innerHTML = titleHtml() + dateHtml() + materialHtml();
}

const updateSheet = () => {
    task.sheet = {
        width: +sheetWidthInput.value || 1,
        height: +sheetHeightInput.value || 1,
        edge: +sheetEdgeInput.value || 0
    }
    toUpdateSheetLink.innerHTML = sheetHtml(task.sheet);
}

// 2.7 Управление задачей

removeTaskButton.onclick = async () => {
    if (task) {
        document.getElementById(task.id).remove()
        tasks = tasks.filter(({id}) => id !== task.id);
        await deleteTask();
        task = null;
    }
    changePage(mainPage);
}

// 2.8 Переключение между формами

const changeForm = (e, f) => {
    e.stopPropagation();

    if (form) form.classList.add('hidden');
    if (link) link.classList.remove('selected');
    form = f;
    const l = e.currentTarget;
    if (l.parentElement.nodeName === 'LI') {
        link = l;
        link.classList.add('selected');
    } else {
        link = null;
    }
    form.classList.remove('hidden');
}

const toCreateForm = () => {
    createButton.classList.remove('hidden');
    updateButton.classList.add('hidden');
}

const toUpdateForm = () => {
    updateButton.classList.remove('hidden');
    createButton.classList.add('hidden');
}

toUpdateTaskLink.onclick = (e) => {
    taskTitleInput.value = task.title;

    taskStartInput.value = task.start;
    taskFinishInput.value = task.finish;
    taskMaterialInput.value = task.material || '';
    taskThickInput.value = task.thick || '';

    changeForm(e, taskForm);
    formLabel.innerText = labels.task;
    toUpdateForm();
}

toUpdateSheetLink.onclick = (e) => {
    sheetWidthInput.value = task.sheet.width;
    sheetHeightInput.value = task.sheet.height;
    sheetEdgeInput.value = task.sheet.edge;

    taskKerfInput.value = task.kerf || '';

    changeForm(e, sheetForm);
    formLabel.innerText = labels.sheet;
    toUpdateForm();
}

toCreateScrapLink.onclick = (e) => {
    scrapHeightInput.value = scrapWidthInput.value = scrapEdgeInput.value = '';
    scrapCountInput.value = 1;

    changeForm(e, scrapForm);
    formLabel.innerText = labels.scrap;
    toCreateForm();
}

toCreateEdgingLink.onclick = (e) => {
    edgingThickInput.value = '';

    edgingLine = (edgingLine + 1) % edgingLines.length;
    edgingLineInput.innerHTML = lineHtml(edgingLine);

    changeForm(e, edgingForm);
    formLabel.innerText = labels.edging;
    toCreateForm();
}

toCreatePieceLink.onclick = (e) => {
    pieceHeightInput.value = pieceWidthInput.value = '';
    pieceCountInput.value = 1;

    pieceRotated = false;
    pieceRotatedInput.innerText = labels.no;

    pieceEdging = {left: null, up: null, right: null, down: null};
    pieceEdgingUpInput.innerHTML = pieceEdgingDownInput.innerHTML = pieceEdgingLeftInput.innerHTML = pieceEdgingRightInput.innerHTML = lineHtml(null);

    changeForm(e, pieceForm);
    formLabel.innerText = labels.piece;
    toCreateForm();
}

// 2.9 Отправка и получение данных

const loadTask = async (id) => {
    if (DATA_URL) {
        const url = new URL(DATA_URL);
        url.searchParams.set("task_id", id)
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        task = await response.json();
    } else {
        task = tasks.find(q => q.id == id);
    }
    console.assert(task);
}

const saveTask = async () => {
    console.assert(task);
    if (DATA_URL) {
        const url = new URL(DATA_URL);
        url.searchParams.set("task", JSON.stringify(task))
        await fetch(url);
    } else {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

const deleteTask = async () => {
    console.assert(task);
    if (DATA_URL) {
        const url = new URL(DATA_URL);
        url.searchParams.set("task_id", '-' + task.id)
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } else {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

const createTask = async () => {
    if (DATA_URL) {
        const url = new URL(DATA_URL);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        task = await response.json();
    } else {
        task = structuredClone(defaultTask);
        task.id = tasks.length
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// 2.10 Изменения настроек

edgingLineInput.onclick = (e) => {
    e.preventDefault();
    edgingLine = (edgingLine + 1) % edgingLines.length;
    edgingLineInput.innerHTML = lineHtml(edgingLine);
}

const getNextEdgingLine = (line) => {
    console.log('getNextEdgingLine')
    const lines = task.edgings.filter(Boolean).map(q => q.line).sort();
    if (lines.length === 0) return null;
    if (line === null) return lines[0];
    if (line >= lines[lines.length - 1]) return null;
    let i = 0;
    while (lines[i] <= line) i++;
    return lines[i];
}

pieceEdgingUpInput.onclick = (e) => {
    e.preventDefault();
    pieceEdging.up = getNextEdgingLine(pieceEdging.up);
    pieceEdgingUpInput.innerHTML = lineHtml(pieceEdging.up);
}

pieceEdgingDownInput.onclick = (e) => {
    e.preventDefault();
    pieceEdging.down = getNextEdgingLine(pieceEdging.down);
    pieceEdgingDownInput.innerHTML = lineHtml(pieceEdging.down);
}

pieceEdgingLeftInput.onclick = (e) => {
    e.preventDefault();
    pieceEdging.left = getNextEdgingLine(pieceEdging.left);
    pieceEdgingLeftInput.innerHTML = lineHtml(pieceEdging.left);
}

pieceEdgingRightInput.onclick = (e) => {
    e.preventDefault();
    pieceEdging.right = getNextEdgingLine(pieceEdging.right);
    pieceEdgingRightInput.innerHTML = lineHtml(pieceEdging.right);
}

pieceRotatedInput.onclick = (e) => {
    e.preventDefault();
    pieceRotated = !pieceRotated;
    pieceRotatedInput.innerText = pieceRotated ? labels.yes : labels.no;
}

// 2.11 Работа со списками

const clearForm = () => {
    form.querySelectorAll('input').forEach(q => q.value = '');

    if (form === edgingForm) {
        edgingLine = 0;
        edgingLineInput = lineHtml(edgingLine);

    } else if (form === pieceForm) {
        pieceRotated = false;
        pieceRotatedInput.innerText = labels.no;

        pieceEdging = {left: null, up: null, right: null, down: null};
        pieceEdgingUpInput.innerHTML = pieceEdgingDownInput.innerHTML = pieceEdgingLeftInput.innerHTML = pieceEdgingRightInput.innerHTML = lineHtml(null);
    }
}

removeButton.onclick = (e) => {
    e.preventDefault();
    clearForm();
    if (link) {
        link.remove();
        toCreateForm();
        console.assert(index !== null);
        if (form === scrapForm) {
            task.scraps[index] = null;
        } else if (form === edgingForm) {
            task.edgings[index] = null;
        } else if (form === pieceForm) {
            task.pieces[index] = null;
        }
        saveTask();
        index = null;
    }
}

createButton.onclick = (e) => {
    e.preventDefault();
    console.assert(form);

    if (form === scrapForm) {
        createScrap();
    } else if (form === edgingForm) {
        createEdging();
    } else if (form === pieceForm) {
        createPiece();
    }
    link.classList.add('selected');
    toUpdateForm();
    saveTask();
}

updateButton.onclick = (e) => {
    e.preventDefault();
    if (form === taskForm) {
        updateTask();
    } else if (form === scrapForm) {
        updateScrap();
    } else if (form === edgingForm) {
        updateEdging();
    } else if (form === pieceForm) {
        updatePiece();
    } else {
        updateSheet();
    }
    saveTask();
}

// 3. Редактор раскроя

// 3.1 Константы

const minDrag = 5;

// 3.2 Состояние

let down = null;
let move = null;

let take = null;
let drag = null;
let drop = null;
let zone = null;

let selected = null;
let isDragging = false;
let cutDirection = true;

let zones = [];
let takes = [];

// 3.3. Отображение деталей

const widthHeightHtml = (width, height, rotated = false) => `${width}${rotated ? o : x}${height}`

const getColors = n => [...Array(n)].map((_, i) => `hsl(${i / n * 360}, var(--saturation), var(--lightness))`);

const takeTitleHtml = (width, height, rotated) => `<h4 class="center">${widthHeightHtml(width, height, rotated)}</h4>`;
const takePieceHtml = (width, height, count, color) => `<div class="center"><div class="take" style="width: ${width * 100 / task.sheet.width}%; aspect-ratio: ${width} / ${height}; background-color: ${color};"></div>${valueHtml(count, 'шт')}</div>`;

const takeHtml = (width, height, rotated, count, color) => `<div>
    ${takeTitleHtml(width, height, rotated)}
    ${takePieceHtml(width, height, count, color)}
</div>`;

const setTakes = () => {
    takes = task.pieces.map(({width, height, rotated, count}, i) => ({
        width,
        height,
        rotated,
        count,
        color: colors[i]
    }));

    takeArea.innerHTML = takes.map((
        {width, height, rotated, count, color}) => takeHtml(width, height, rotated, count, color)
    ).join('');

    takeArea.childNodes.forEach((q, i) => {
        q = q.lastElementChild.firstElementChild;
        q.dataset.i = i;

        q.onpointerup = (e) => {
            console.log('take.onpointerup')
            if (!down) return;
            take = takes[i];
            toSelect(take);
        };
        q.onpointerdown = (e) => {
            console.log('take.onpointerdown')
            q.releasePointerCapture(e.pointerId);
            onPointerDown(e, dragTake);
        }
        takes[i].html = q
    });
}

// 3.4 Отображение мест вставки

const createZone = (zone, i) => {
    console.log('createZone')

    const area = document.createElement('DIV');
    area.classList.add("area");

    const title = document.createElement('H4');
    title.classList.add('center');
    title.innerHTML = widthHeightHtml(zone.width, zone.height);
    area.appendChild(title);

    const q = zone.html = document.createElement('DIV');
    q.classList.add('zone');
    q.dataset.i = i;
    q.style.width = p(zone.width / task.sheet.width);
    q.style.aspectRatio = `${zone.width} / ${zone.height}`;
    area.appendChild(q);

    dropArea.appendChild(area);
}

const createDrop = (drop) => {
    console.log('createDrop')

    const q = drop.html = document.createElement('DIV');
    q.classList.add('drop');

    q.dataset.i = zone.drops.length;
    zone.drops.push(drop);

    q.style.left = p(drop.left / zone.width);
    q.style.top = p(drop.top / zone.height);

    q.style.width = p(drop.width / zone.width);
    q.style.height = p(drop.height / zone.height);

    q.onpointerup = dropDrag;
    if (drop.busy === false) zone.html.appendChild(q);
}

const createDrag = (drag) => {
    console.log('createDrag')

    const q = drag.html = document.createElement('DIV');
    drag.toLeft = drag.toTop = true;

    setTake(drag);
    drag.drop = zone.drops.length;

    q.dataset.i = zone.drags.length;
    zone.drags.push(drag);

    q.style.cursor = 'grab';
    q.style.zIndex = 9999;
    q.style.left = p(drag.left / zone.width);
    q.style.top = p(drag.top / zone.height);
    q.style.width = p(drag.width / zone.width);
    q.style.aspectRatio = `${drag.width} / ${drag.height}`;
    q.style.position = 'absolute';
    q.style.backgroundColor = colors[drag.take]

    q.onpointerdown = (e) => onPointerDown(e, dragDrop);
    q.onpointerup = onDragClick;

    zone.html.appendChild(q);
}

// 3.5 Оценка количества зон

const dropJson = (width, height, edge) => ({
    left: edge,
    top: edge,
    width: width - 2 * edge,
    height: height - 2 * edge,
    busy: false
});

const zoneJson = ({width, height, edge}) => ({width, height, drops: [dropJson(width, height, edge)], drags: []});

const getDrops = () => {
    const dst = task.scraps.filter(Boolean).flatMap(
        ({width, height, edge, count}) => Array(count).fill({
            width: width - 2 * edge + task.kerf,
            height: height - 2 * edge + task.kerf
        })
    );
    return dst.sort((a, b) => b.width + b.height - a.width - a.height);
}

const sheetJson = () => {
    const {width, height, edge} = task.sheet;
    return {
        width: width - 2 * edge + task.kerf,
        height: height - 2 * edge + task.kerf
    };
}

const getTakes = () => {
    const dst = task.pieces.filter(Boolean).map(
        ({width, height, rotated, count}) => ({width, height, rotated, count})
    )
    return dst.sort((a, b) => b.width + b.height - a.width - a.height || a.rotated - b.rotated)
}

const getZones = () => {
    const dst = task.scraps.filter(Boolean).flatMap(
        q => Array(q.count).fill(zoneJson(q))
    );

    const drops = getDrops();
    const takes = getTakes();
    const sheet = sheetJson();

    takes.forEach(({width, height, rotated, count}) => {
        const match = (q) => (width <= q.width && height <= q.height) || (rotated && height <= q.width && width <= q.height);

        for (let i = 0; i < count; i++) {
            let drop = drops.find(match);

            if (!drop) {
                if (!match(sheet)) break;
                dst.push(zoneJson(task.sheet));

                drop = {...sheet};
                drops.push(drop);
            }
            if (width <= drop.width && height <= drop.height) {
                drop.width -= width;
                drop.height -= height;
            } else {
                drop.width -= height;
                drop.height -= width;
            }
            if (drop.width >= drop.height) {
                if (drop.height > task.kerf) {
                    drops.push({width, height: drop.height})
                }
                drop.height += height;
            } else {
                if (drop.width > task.kerf) {
                    drops.push({width: drop.width, height})
                }
                drop.width += width;
            }
        }
    });

    return dst;
}

const setZones = () => {
    console.log('setZones');
    zones = getZones();

    dropArea.replaceChildren()
    zones.forEach(createZone);

    for (zone of zones) createDrop(zone.drops.pop());
}

// 3.6 Отображение страницы

const clearCutting = () => {
    toSelect(null);

    colors = getColors(task.pieces.length);

    setTakes();
    setZones();
}

toCuttingButton.onclick = () => {
    clearCutting();
    changePage(cuttingPage);
}

// 3.7 Начало перетаскивания

const startMove = (x, y, left, top) => {
    move = {x, y, dx: left - x, dy: top - y};

    window.addEventListener('pointermove', toDrag);
    window.addEventListener('pointerup', stopDrag);
}

const endMove = () => {
    move = null;

    window.removeEventListener('pointermove', toDrag);
    window.removeEventListener('pointerup', stopDrag);
}

const stopDrag = () => {
    if (!move) return;
    endMove();
    cancelDrag();
}

const dragTake = (x, y, t) => {
    console.log('dragTake');

    const {left, top, width} = t.getBoundingClientRect();

    const i = +t.dataset.i;
    take = takes[i];

    decTakeCount(take);

    const q = document.createElement('DIV');

    q.style.aspectRatio = `${take.width} / ${take.height}`;
    q.style.width = width + 'px';
    q.style.left = left + 'px';
    q.style.top = top + 'px';
    q.style.position = 'absolute';
    q.style.cursor = 'grabbing';
    q.style.pointerEvents = 'none';
    q.style.backgroundColor = take.color;

    cuttingPage.appendChild(q);

    drag = {
        take: i, html: q,
        width: take.width,
        height: take.height,
        rotated: take.rotated,
        cutDirection
    };
    toSelect(drag);
    startMove(x, y, left, top);
}

const dragDrop = (x, y, t) => {
    console.log('dragDrop')
    zone = zones[t.parentElement.dataset.i];
    drag = zone.drags[t.dataset.i];

    take = takes[drag.take];
    drop = zone.drops[drag.drop];

    toSelect(null);
    clearDrop();

    const {left, top, width} = t.getBoundingClientRect();

    const q = drag.html;
    drag.html = null;
    drag = {...drag, html: q};
    toSelect(drag);

    q.style.width = width + 'px';
    q.style.left = left + 'px';
    q.style.top = top + 'px';
    q.style.cursor = 'grabbing';
    q.style.pointerEvents = 'none';

    cuttingPage.appendChild(q);
    startMove(x, y, left, top);
}

const toDrag = (e) => {
    if (!move) return;
    console.log('toDrag')
    e.preventDefault();

    move.x = e.clientX;
    move.y = e.clientY;

    drag.html.style.left = move.x + move.dx + 'px';
    drag.html.style.top = move.y + move.dy + 'px';
}

// 3.7 Завершение перетаскивания

const addDrop = (drop) => {
    const q = drop.html = document.createElement('DIV');
    q.classList.add('drop');
    drop.busy = false;

    q.dataset.i = zone.drops.length.toString();
    zone.drops.push(drop);

    q.style.left = p(drop.left / zone.width);
    q.style.top = p(drop.top / zone.height);

    q.style.width = p(drop.width / zone.width);
    q.style.height = p(drop.height / zone.height);

    q.onpointerup = dropDrag;
    zone.html.appendChild(q);
}

const addRightDrop = () => {
    const r = {width: drop.width - drag.width - task.kerf};
    if (r.width > 0) {
        r.height = drag.cutDirection ? drop.height : drag.height;

        r.left = drag.toLeft ? drop.left + drag.width + task.kerf : drop.left;
        r.top = drag.cutDirection ? drop.top : drag.top;

        addDrop(r);
    }
}

const addLeftDrop = () => {
    const r = {height: drop.height - drag.height - task.kerf};
    if (r.height > 0) {
        r.width = drag.cutDirection ? drag.width : drop.width;

        r.left = drag.cutDirection ? drag.left : drop.left;
        r.top = drag.top === drop.top ? drop.top + drag.height + task.kerf : drop.top;

        addDrop(r);
    }
}

const addDrag = () => {
    console.log('addDrag')

    drag.left = drag.toLeft ? drop.left : drop.left + drop.width - drag.width;
    drag.top = drag.toTop ? drop.top : drop.top + drop.height - drag.height;

    const q = drag.html;
    q.style.cursor = 'grab';
    q.style.left = p(drag.left / zone.width);
    q.style.top = p(drag.top / zone.height);
    q.style.width = p(drag.width / zone.width);
    q.style.pointerEvents = 'auto';

    q.onpointerdown = (e) => onPointerDown(e, dragDrop);
    q.onpointerup = onDragClick;

    zone.html.appendChild(q);

    q.dataset.i = zone.drags.length;
    zone.drags.push(drag);
}

const cutDrop = () => {
    console.log('cutDrop');

    addDrag();
    addLeftDrop();
    addRightDrop();

    drop.html.remove();
    drop.busy = true;
}

const canDropDrag = () => {
    console.log('canDropDrag');
    if (drag.width <= drop.width && drag.height <= drop.height) return true;
    if (drag.rotated && drag.height <= drop.width && drag.width <= drop.height) {
        toRotateDrag();
        return true;
    }
    return false;
}

const findDropCorner = () => {
    console.log('findDropCorner');

    let r = drag.html.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;

    r = drop.html.getBoundingClientRect();
    drag.toLeft = x - r.left <= r.right - x;
    drag.toTop = y - r.top <= r.bottom - y;
}

const dropDrag = (e) => {
    console.log('dropDrag')
    if (!move) return;
    endMove();

    e.preventDefault();
    e.stopPropagation();

    const q = e.currentTarget;
    zone = zones[q.parentElement.dataset.i];

    drag.drop = +q.dataset.i;
    drop = zone.drops[drag.drop];

    if (canDropDrag()) {
        findDropCorner();
        cutDrop();
    } else {
        cancelDrag();
    }
}

// 3.8 Вращения и изменение направления реза

const onDragClick = (e) => {
    console.log('onDragClick')
    e.preventDefault();
    if (down) {
        const q = e.currentTarget;
        zone = zones[q.parentElement.dataset.i];
        drag = zone.drags[q.dataset.i];
        toSelect(drag);
    }
}

const rotateDrag = () => {
    console.log('rotateDrag');
    drop = zone.drops[drag.drop];

    if (drag.rotated && drag.height <= drop.width && drag.width <= drop.height) {
        toRotateDrag();
        clearDrop();
        cutDrop();
    }
}

const toRotateDrag = () => {
    console.log('toRotateDrag');
    [drag.width, drag.height] = [drag.height, drag.width];
    drag.html.style.width = drag.width * 100 / zone.width + '%';
    drag.html.style.aspectRatio = `${drag.width} / ${drag.height}`;
}

const rotateTake = () => take.rotated && toRotateTake();

const toRotateTake = () => {
    console.log('toRotateTake');
    [take.width, take.height] = [take.height, take.width];
    take.html.style.width = take.width * 100 / task.sheet.width + '%';
    take.html.style.aspectRatio = `${take.width} / ${take.height}`;
}

const changeCutDirection = () => {
    console.log('changeCutDirection');
    drop = zone.drops[drag.drop];

    if (drag.width < drop.width && drag.height < drop.height) {
        clearDrop();
        cutDrop();
    }
}

// 3.9 Кнопки изменений положения деталей и разрезов

rotatePieceButton.onclick = () => {
    if (selected) {
        if (selected === take) {
            rotateTake();
        } else if (selected === drag) {
            rotateDrag();
        }
    }
}

const setCutDirectionButton = () => {
    const d = selected && selected === drag ? drag.cutDirection : cutDirection
    cutDirectionButton.firstElementChild.style.transform = `rotate(${d ? 0 : 90}deg)`
}

cutDirectionButton.onclick = () => {
    if (selected && selected === drag) {
        drag.cutDirection = !drag.cutDirection;
        changeCutDirection();
    } else {
        cutDirection = !cutDirection;
    }
    setCutDirectionButton();

}

// 3.10 Счетчики деталей

const incTakeCount = (take) => {
    console.log('incTakeCount')
    if (take.count === 0) {
        take.html.parentElement.parentElement.classList.remove('hidden');
    }
    take.count++;
    take.html.nextElementSibling.firstChild.innerText = take.count;
}

const decTakeCount = (take) => {
    console.log('decTakeCount')
    take.count--;
    if (take.count === 0) {
        take.html.parentElement.parentElement.classList.add('hidden');
    }
    take.html.nextElementSibling.firstChild.innerText = take.count;
}

const clearDrop = () => {
    console.log('clearDrop');

    zone.html.appendChild(drop.html);
    drop.busy = false;
    zone.drags.forEach(q => {
        if (q.html && q !== drag && isOn(q, drop)) {
            q.html.remove();
            q.html = null;
            incTakeCount(takes[q.take]);
        }
    });
    zone.drops.forEach(q => {
        if (q.html && q !== drop && isOn(q, drop)) {
            q.html.remove();
            q.html = q.busy = null;
        }
    });
}

const cancelDrag = () => {
    console.log('cancelDrag');

    incTakeCount(take);
    toSelect(take);

    drag.html.remove();
    drag = null;
}

// 3.11 Нажатия и клики

const onPointerDown = (e, f) => {
    console.log('onPointerDown')
    e.preventDefault();
    down = {x: e.clientX, y: e.clientY, f, t: e.currentTarget};
}

const toSelect = (q) => {
    console.log('toSelect')

    if (selected) {
        selected.html.classList.remove('selected');
    }
    selected = selected === q ? null : q;
    if (selected) {
        selected.html.classList.add('selected');
    }
    setCutDirectionButton();
}

const endClick = () => (down = null);

const isDrag = (e) => (Math.abs(down.x - e.clientX) > minDrag || Math.abs(down.y - e.clientY) > minDrag);

const tryStartDrag = (e) => {
    if (down) {
        console.log('tryStartDrag');
        if (isDrag(e)) {
            const {x, y, t, f} = down;
            down = null;
            f(x, y, t);
        }
    }
}

window.addEventListener('pointerup', endClick);
window.addEventListener('pointermove', tryStartDrag);


// 4. Печать

// 4.1. Загрузка

const getScale = () => Math.min(A.width / task.sheet.width, A.height / task.sheet.height);

downloadCuttingButton.onclick = () => {
    scale = getScale();
    pdfHead = headPdf(task);
    printPages.innerHTML = settingPdf() + getCuttings().map(cuttingPdf).join('\n')
    window.print();
}

const valuePdf = (key, value) => `<div class="sign"><span>${key}:</span><span>${value}</span></div>`

const headPdf = ({title, start, finish, material, thick}) => {
    const s = getHeadStyle();
    return `<div class="task" style="${s}">
    <div class="signs">
        ${valuePdf('Заказ', title)}
        ${valuePdf('Дата', toDate(start))}
        ${valuePdf('Дата готовности', toDate(finish))}
    </div>
    <div class="signs">
        ${valuePdf('Материал', material)}
        ${valuePdf('Толщина', thick ? thick + ' мм' : '')}
    </div>
</div>`;
}

// 4.2 Постановка задачи

const linePdf = (line, color = 'black') => line !== null ? `<svg class="line ${color}">${spriteHtml(edgingLines[line])}</use></svg>` : '';

const flagPdf = (flag) => `<td style="color: green;">${flag ? `&#10003;` : ''}</td>`;

const whPdf = (width, height, {left, right, up, down}) => {
    const w = `<div class="col"><span>${width}</span>${linePdf(up)}${linePdf(down)}</div>`;
    const h = `<div class="col"><span>${height}</span>${linePdf(left)}${linePdf(right)}</div>`;
    return `<td>${w}</td><td>${h}</td>`

}
const settingPdf = () => `<div class="page">
    ${pdfHead}${pdfLogo}
    <table style="left: ${D}mm;top: ${A.top}mm;">
        <thead>${pdfPiecesHead}</thead>
        <tbody>${piecesListPdf()}</tbody>
    </table>
</div>`;

const pdfPiecesHead = `<tr>
    <th>#</th>
    <th>Длина</th>
    <th>Ширина</th>
    <th>Кол-во</th>
    <th>Пов-от</th>
    <th>Наименование</th>
    <th>ДО</th>
</tr>`;

const piecesItemPdf = ({width, height, count, rotated, name, extra, edging}, i) => `<tr>
    <td>${i + 1}</td>
    ${whPdf(width, height, edging)}
    <td>${count}</td>
    ${flagPdf(rotated)}
    <td>${name || ""}</td>
    ${flagPdf(extra)}
</tr>`;

const piecesListPdf = () => task.pieces.map(piecesItemPdf).join('\n');

// 4.3 Раскрой

const getRectStyle = (left, top, width, height) => `left: ${left}mm;top: ${top}mm;width: ${width}mm;height: ${height}mm;`;
const getAreaStyle = (width, height) => `right: ${A.right}mm;top: ${A.top}mm;width: ${width}mm;height: ${height}mm;`;
const getHeadStyle = () => `left: ${H.left}mm;top: ${H.top}mm;right: ${H.right}mm;height: ${H.height}mm;`;

const backPdf = (style, zIndex) => `<div class="base" style="${style};z-index: ${zIndex}"></div>`

const zonePdf = (style, tape, drags, drops) => `<div class="area" style="${style}">${tape}${drags}${drops}</div>`
const dragPdf = (style, size, index) => `<div class="rect" style="${style}">${size}${index}</div>`
const dropPdf = (style, size) => `<div class="rect gray" style="${style}">${size}</div>`

const indexPdf = (index, width, height) => {
    const n = index.toString().length + 1;
    const fontSize = Math.min(width / n, height / 1.2, 3);
    return `<div class="index gray" style="font-size: ${fontSize}mm;">#${index + 1}.</div>`
}

const widthPdf = (width, w, h, fontSize) => {
    fontSize = Math.min(fontSize, w / width.toString().length, h / 1.2);
    return fontSize > 2 ? `<div class="width" style="font-size: ${fontSize}mm">${width}</div>` : '';
}

const heightPdf = (height, h, w, fontSize) => {
    fontSize = Math.min(fontSize, h / height.toString().length, w / 1.2);
    return fontSize > 2 ? `<div class="height" style="font-size: ${fontSize}mm">${height}</div>` : '';
}

const sizePdf = (width, height, w, h) => {
    const fontSize = Math.min(5, (w + h) / (width.toString().length + height.toString().length + 2));
    return widthPdf(width, w, h, fontSize) + heightPdf(height, h, w, fontSize);
}

const tapePdf = (w, h) => {
    const lines = []
    for (let y = -w; y <= h; y += 5) {
        lines.push(`<line x1=0 y1=${y} x2=${w} y2=${y + w}></line>`)
    }
    return `<svg class="tape" viewBox="0 0 ${w} ${h}">${lines.join('\n')}</svg>`
}

const dragsPdf = (drags) => drags.map(({l, t, w, h, width, height, i}) => {
    const style = getRectStyle(l, t, w, h);
    return dragPdf(style, sizePdf(width, height, w, h), indexPdf(i, w, h)) + backPdf(style, 3);
}).join('\n');

const dropsPdf = (places) => places.map(({l, t, w, h, width, height}) => {
    const s = getRectStyle(l, t, w, h);
    return dropPdf(s, sizePdf(width, height, w, h)) + backPdf(s, 1);
}).join('\n');


const rectPdf = (style) => `<div class="rect" style="${style}"></div>`;

const takesHeadPdf = `<tr><th>#</th><th>Длина</th><th>Ширина</th><th>Кол-во</th></tr>`;
const takesItemPdf = (i, count) => {
    const {width, height, edging} = task.pieces[i];
    return `<tr><td>${i + 1}</td>${whPdf(width, height, edging)}<td>${count}</td></tr>`
}
const takesListPdf = (drags) => {
    const counts = drags.reduce((acc, {i}) => {
        acc[i] = (acc[i] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(counts).map(([i, count]) => takesItemPdf(+i, count)).join('\n');
}
const pdfLogo = `<div class="logo">${iconHtml('cutting', 'green')} <span>whCut</span></div>`;

const takesPdf = (drags) => `<table style="top: ${S.top}mm;right: ${S.right}mm; width: ${S.width}mm;">
    <thead>${takesHeadPdf}</thead>
    <tbody>${takesListPdf(drags)}</tbody>
</table>`;

const cuttingPdf = ({w, h, drags, drops}) => {
    const style = getAreaStyle(w, h);
    return `<div class="page">
    ${pdfHead}${pdfLogo}
    ${zonePdf(style, tapePdf(w, h), dragsPdf(drags), dropsPdf(drops))}
    ${rectPdf(style)}
    ${takesPdf(drags)}
</div>`;
}

const getCuttings = () => zones.map(({width, height, drops, drags}) => ({
    w: width * scale, h: height * scale,
    drops: drops.filter(({html}) => html && html.isConnected).map(({top, left, width, height}) => ({
        width, height,
        l: left * scale, t: top * scale, w: width * scale, h: height * scale
    })),
    drags: drags.filter(({html}) => html && html.isConnected).map(({top, left, width, height, take}) => ({
        width, height, i: take,
        l: left * scale, t: top * scale, w: width * scale, h: height * scale
    }))
})).filter(({drags}) => drags.length);

// 5. Автоматический раскрой

const takesRect = () => takes.filter(({count}) => count > 0).map(
    ({width, height, rotated, count}) => [width + task.kerf, height + task.kerf, rotated, count]
);

const dropsRect = () => zones.flatMap(({drops}) => drops.filter(
    ({busy}) => busy === false)).map(({width, height}) => [width + task.kerf, height + task.kerf]);


// 5.1 Раскрой на клиенте

const getVerticalPacks = (takes, counts) => {
    const dst = [];

    takes.forEach(([width, height, rotated], i) => {
        const b = width * height;

        function add(w, h) {
            if (w > line.width) return;
            const takes = [i];

            let height = h;
            let busy = b;

            while (height <= line.height && takes.length <= counts[i]) {
                dst.push({width: w, height, busy: busy, takes: [...takes]});

                height += h;
                busy += b;
                takes.push(i);
            }
        }

        rotated && add(height, width);
        add(width, height);
    });
    return dst.sort((a, b) => b.height - a.height || b.width - a.width);
}

const getStates = (packs, counts, fit) => {
    const states = new Array(line.width + 1).fill(null);

    for (let k = 0; k < packs.length; k++) {
        const pack = packs[k];

        if (fit && pack.height < line.height) break;

        const s = {
            busy: pack.busy,
            counts: getCounts([pack], [...counts]),
            k, left: 0
        };

        const l = pack.width;
        states[l] ? states[l].push(s) : (states[l] = [s]);
    }
    return states;
}

const cutHorizontalLine = (packs, counts, fit) => {
    const states = getStates(packs, counts, fit);

    let S;
    const updateBestState = (s) => (!S || s.busy > S.busy || (s.busy === S.busy && s.k < S.k)) && (S = s);

    states.forEach((q, left) => {
        if (!q) return;

        states[left] = q = getBestStates(q.sort((u, v) => v.busy - u.busy || u.k - v.k));
        updateBestState(q[0]);

        q.forEach(({busy, counts, k}, n) => {
            for (; k < packs.length; k++) {
                const pack = packs[k];

                const l = left + pack.width;
                if (l > line.width) continue;

                const s = {
                    busy: busy + pack.busy,
                    counts: getCounts([pack], [...counts]),
                    k, n, left
                };
                if (s.counts.every(n => n >= 0)) {
                    states[l] ? states[l].push(s) : (states[l] = [s]);
                }
            }
        })
    });

    line.packs = [];

    if (S) {
        line.busy = S.busy;
        line.packs.push(packs[S.k]);
        while (S.left) {
            S = states[S.left][S.n];
            line.packs.push(packs[S.k]);
        }
        line.packs.reverse();
    } else {
        line.busy = 0;
    }
    calcFree();
}

const calcFree = () => {
    let h = 0;
    let w = 0;
    line.packs.forEach(({width, height}) => {
        if (height > h) h = height;
        w += width;
    })
    line.free = line.width * line.height - w * h;
}

const getHeights = (takes, counts) => {
    const dst = new Set([line.height]);

    takes.forEach(([width, height, rotated], i) => {
        if (counts[i] > 0) {
            if (rotated && height < width && width < line.height && height <= line.width) {
                dst.add(width);
            } else if (height < line.height && width <= line.width) {
                dst.add(height);
            }
        }
    });
    return Array.from(dst).sort((a, b) => b - a);
}

const getLineRects = (packs, takes, top) => {
    const dst = [];
    let left = 0;

    packs.forEach(pack => {
        let t = top;

        pack.takes.forEach(i => {
            const [width, height, rotated] = takes[i];

            const rotate = rotated && (
                width > pack.width || (width < height && height <= pack.width)
            );

            const rect = rotate ? [left, t, height, width] : [left, t, width, height];
            dst.push(rect);

            t += rotate ? width : height;
        })
        left += pack.width;
    })
    return dst;
}

const getCounts = (packs, counts) => {
    packs.forEach(pack => pack.takes.forEach(i => counts[i]--));
    return counts;
}

const getBestStates = (src, n = 7) => {
    const dst = [];
    let C = null;
    for (const q of src) {
        const c = JSON.stringify(q.counts);
        if (c !== C) {
            C = c;
            dst.push(q);
            if (dst.length === n) break;
        }
    }
    return dst;
}

const cutHorizontalLines = (width, height, takes) => {
    let S = {busy: 0, free: 0, packs: [], counts: takes.map(q => q[3]), n: null};
    const updateBestState = (s) => (s.busy > S.busy || (s.busy === S.busy && s.free > S.free)) && (S = s);

    line = {width};

    const states = new Array(height + 1).fill(null);
    states[0] = [S];

    states.forEach((q, top) => {
        if (!q) return;

        states[top] = q = getBestStates(q.sort((u, v) => v.busy - u.busy || v.free - u.free));
        updateBestState(q[0]);

        q.forEach(({busy, counts}, n) => {
            line.height = height - top;

            for (const h of getHeights(takes, counts)) {
                line.height = h;

                const packs = getVerticalPacks(takes, counts)
                cutHorizontalLine(packs, counts, top + h < height);
                if (!line.busy) break;

                const s = {
                    busy: busy + line.busy,
                    free: line.free,
                    packs: line.packs,
                    counts: getCounts(line.packs, [...counts]),
                    top, n
                }
                const t = top + h;
                states[t] ? states[t].push(s) : (states[t] = [s]);
            }
        });
    });

    S.rects = [];

    let s = S;
    while (s.busy) {
        S.rects = [...getLineRects(s.packs, takes, s.top), ...S.rects];
        s = states[s.top][s.n];
    }
    return S;
}

const cutVerticalLines = (width, height, takes) => {
    takes = takes.map(([width, height, rotated, count]) => [height, width, rotated, count]);
    const dst = cutHorizontalLines(height, width, takes);
    dst.rects = dst.rects.map(([top, left, height, width]) => [left, top, width, height]);
    return dst;
}

const toCut = (drops, takes, n = 7) => {
    let src = [{busy: 0, free: 0, rects: [], takes}];

    for (const [width, height] of drops) {
        let dst = [];
        src.forEach(q => {
            [cutHorizontalLines, cutVerticalLines].forEach(f => {
                const {busy, free, rects, counts} = f(width, height, q.takes);

                dst.push({
                    busy: q.busy + busy,
                    free: Math.max(q.free, free),
                    rects: [...q.rects, rects],
                    takes: q.takes.map(
                        ([width, height, rotated], i) => [width, height, rotated, counts[i]]
                    ).filter(q => q[3] > 0)
                });
            });
        });
        src = dst;

        src.sort((a, b) => b.busy - a.busy || b.free - a.free);

        if (!src[0].takes.length) return src[0].rects;
        if (src.length > n) src.length = n;
    }
}

// 5.2 Раскрой на сервере

slowCutButton.onclick = (e) => {
    e.preventDefault();

    const takes = takesRect();
    const drops = dropsRect();

    const rects = toCut(drops, takes);
    console.log('rects:', rects);

    fetch(ALGO_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({drops, takes})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();

        })
        .then(rects => {
            addRects(rects, drops);
            console.log('rects:', rects);
        })
        .catch(error => {
            console.error(error);
        });
}

fastCutButton.onclick = (e) => {
    e.preventDefault();

    const takes = takesRect();
    const drops = dropsRect();

    const rects = toCut(drops, takes);
    console.log('rects:', rects);
    addRects(rects, drops);
}

clearButton.onclick = () => clearCutting();

// 5.3 Отобразить раскрой

const setTake = (drag) => {
    take = null;

    for (let i = 0; i < takes.length; i++) {
        const {width, height, rotated, count} = takes[i];
        if (!count) continue;

        if (width === drag.width && height === drag.height) {
            drag.take = i
            take = takes[i];
            if (!rotated) break;
        } else if (!take && rotated && width === drag.height && height === drag.width) {
            drag.take = i;
            drag.rotated = true;
            take = takes[i];
        }
    }
    decTakeCount(take);
}

const findCut = (q) => {
    let Y = q[0][1];
    for (const [x, y] of q) {
        if (x >= Y) break;
        if (y > Y) Y = y;
    }
    return Y;
}

const findVerticalCut = (rects) => findCut(
    rects.map(([left, top, width, height]) => [left, left + width]).sort((a, b) => a[0] - b[0] || b[1] - a[1])
);

const findHorizontalCut = (rects) => findCut(
    rects.map(([left, top, width, height]) => [top, top + height]).sort((a, b) => a[0] - b[0] || b[1] - a[1])
);

const asDrop = ([left, top, width, height], busy = false) => ({
    left: left + drop.left,
    top: top + drop.top,
    width: width - task.kerf,
    height: height - task.kerf,
    busy
});

const asDrag = ([l, t, w, h]) => ({
    left: l + drop.left,
    top: t + drop.top,
    width: w - task.kerf,
    height: h - task.kerf
});

const findDrag = ([left, top, width, height], rects) => {
    let drag = rects.find(([l, t]) => left === l && top === t);
    if (drag) return drag;

    let L = width;
    let T = height;
    rects.forEach(([l, t]) => {
        L = Math.min(L, l - left);
        T = Math.min(T, t - top);
    });
    rects.forEach(q => {
        q[0] -= L;
        q[1] -= T;
    });
    return rects.find(([l, t]) => left === l && top === t);
}

const addCut = (drop, rects, create = true) => {
    console.log('addCut')
    if (!rects.length) {
        createDrop(asDrop(drop));
        return;
    }
    if (create) {
        const drag = findDrag(drop, rects);

        createDrag(asDrag(drag));
        createDrop(asDrop(drop, true));
    }
    const [left, top, width, height] = drop;

    const T = findHorizontalCut(rects);
    const L = findVerticalCut(rects);
    const H = top + height - T
    const W = left + width - L

    const cutDirection = W > H;

    if (cutDirection) {
        addCut([left, top, width - W, height], rects.filter(([l, t, w, h]) => l < L), false)
        addCut([L, top, W, height], rects.filter(([l, t, w, h]) => l >= L))
    } else if (H) {
        addCut([left, top, width, height - H], rects.filter(([l, t, w, h]) => t < T), false)
        addCut([left, T, width, H], rects.filter(([l, t, w, h]) => t >= T))
    }
}

const addRects = (rects, drops) => {
    let i = 0;

    for (zone of zones) {
        zone.drops.filter(({busy}) => busy === false).forEach(q => {
            if (rects[i] && rects[i].length) {
                q.html.remove();
                q.busy = null;

                drop = q;
                addCut([0, 0, ...drops[i]], rects[i]);
            }
            i++;
        });
    }
}

// 6. Автосохранение

let saveTimeout = null;
let abortController = null;

async function editTask(update) {
    if (abortController) abortController.abort();
    console.log('editTask:', update);

    abortController = new AbortController();
    const signal = abortController.signal;

    try {
        if (DATA_URL) {
            const response = await fetch(DATA_URL, {
                method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(update)
            });
            if (!response.ok) {
                console.error('updateTask: HTTP', response.status);
                return false;
            }
            await response.json();
            return true;
        } else {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }


    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('editTask cancelled');
            return false;
        }
        console.error('editTask:', error);
        return false;

    } finally {
        if (abortController && abortController.signal === signal) {
            abortController = null;
        }
    }
}


const blurAutoSave = async (update) => {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
        saveTimeout = null;
    }
    await updateTask(update);
}


// Начальная загрузка

(function () {
    loadTasks();
    tasks.forEach(addTask);
})();

