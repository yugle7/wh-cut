const API_ENDPOINT = ""; // https://d5ds1trsppqs2rog97qd.cmxivbes.apigw.yandexcloud.net";


// 1. Главная страница
const mainPage = document.getElementById("main");

const createTaskButton = document.getElementById("create-task");
const tasksList = document.getElementById("tasks");

const header = document.getElementById("header");

// 2. Настройки раскроя
const settingPage = document.getElementById("setting");
const settingGutter = document.getElementById("setting-gutter");

const toMainButton = document.getElementById("to-main");
const removeTaskButton = document.getElementById("remove-task");
const toSettingButton = document.getElementById("to-setting");

const sheetForm = document.getElementById("sheet");
const toUpdateSheetLink = document.getElementById("to-update-sheet");

const taskTitleInput = document.getElementById("task-title");
const taskMaterialInput = document.getElementById("task-material");
const taskThickInput = document.getElementById("task-thick");
const taskStartInput = document.getElementById("task-start");
const taskFinishInput = document.getElementById("task-finish");
const taskKerfInput = document.getElementById("task-kerf");

const sheetWidthInput = document.getElementById("sheet-width");
const sheetHeightInput = document.getElementById("sheet-height");
const sheetEdgeInput = document.getElementById("sheet-edge");

// 2.1 Обрезки
const scrapsList = document.getElementById("scraps");
const toCreateScrapLink = document.getElementById("to-create-scrap");
const scrapForm = document.getElementById("scrap");

const scrapWidthInput = document.getElementById("scrap-width");
const scrapHeightInput = document.getElementById("scrap-height");
const scrapEdgeInput = document.getElementById("scrap-edge");
const scrapCountInput = document.getElementById("scrap-count");

// 2.2 Кромки
const edgingsList = document.getElementById("edgings");
const toCreateEdgingLink = document.getElementById("to-create-edging");
const edgingForm = document.getElementById("edging");

const edgingLineInput = document.getElementById('edging-line');
const edgingThickInput = document.getElementById('edging-thick');

// 2.3 Детали
const piecesList = document.getElementById("pieces");
const toCreatePieceLink = document.getElementById("to-create-piece");
const pieceForm = document.getElementById("piece");

const pieceWidthInput = document.getElementById('piece-width');
const pieceHeightInput = document.getElementById('piece-height');
const pieceRotatedInput = document.getElementById('piece-rotated');
const pieceCountInput = document.getElementById('piece-count');

const pieceEdgingUpInput = document.getElementById('piece-edging-up');
const pieceEdgingDownInput = document.getElementById('piece-edging-down');
const pieceEdgingLeftInput = document.getElementById('piece-edging-left');
const pieceEdgingRightInput = document.getElementById('piece-edging-right');

// 2.5 Формы добавления и изменения
const createButton = document.getElementById("create");
const removeButton = document.getElementById("remove");
const updateButton = document.getElementById("update");
const formLabel = document.getElementById("form");

// 3. Редактор раскроя
const cuttingPage = document.getElementById("cutting");
const toCuttingButton = document.getElementById("to-cutting");

const downloadCuttingButton = document.getElementById("download-cutting");
const cuttingGutter = document.getElementById("cutting-gutter");

const toolsBlock = document.getElementById("tools");
const cutDirectionButton = document.getElementById("cut-direction");
const rotatePieceButton = document.getElementById("rotate-piece");

const src = document.getElementById("src");
const dst = document.getElementById("dst");

// 4. Печать

const print = document.getElementById('print');

const A4 = {
    width: 297,
    height: 210
}

const padding = 10;
const U = {
    top: padding,
    left: padding,
    right: padding,
    height: 20
}
U.bottom = A4.height - 2 * padding - U.height;
const R = {
    top: 2 * padding + U.height,
    right: padding,
    width: 70,
    bottom: padding
}
R.left = A4.width - R.width - padding;
const L = {
    top: R.top,
    left: padding - 1,
    right: padding + R.width + R.right + 1,
    bottom: padding,
}
L.width = A4.width - L.left - L.right;
L.height = A4.height - L.top - L.bottom;


// Состояние

let tasks = [];
let page = mainPage;
let task = null;
let form = sheetForm;
let link = null;

let edgingLine = -1;
let pieceRotated = false;
let pieceEdging = {left: null, up: null, right: null, down: null};


// Константы

const iconHtml = (id, color = "gray") => `<svg class="icon ${color}"><use href="sprite.svg#${id}"></use></svg>`;
const lineHtml = (line) => line === null ? `<svg class="line gray"><use href="sprite.svg#line"></use></svg>` : `<svg class="line yellow"><use href="sprite.svg#${edgingLines[line]}"></use></svg>`;
const valueHtml = (value, unit) => `<span style="padding: 10px;"><span class="value">${value}</span><span class="unit">${unit}</span></span>`

const x = iconHtml('x');
const v = iconHtml('v');
const o = iconHtml('o');

// Навигация

const changePage = (p) => {
    console.log('changePage')
    if (page === p) return false;
    if (p === mainPage) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
        if (p === settingPage) {
            removeTaskButton.classList.remove('hidden');
            downloadCuttingButton.classList.add('hidden');

            toolsBlock.classList.add('hidden');
        } else {
            removeTaskButton.classList.add('hidden');
            downloadCuttingButton.classList.remove('hidden');

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
        src.style.width = (leftWidth - 80) + 'px';
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

// 1.1. Навигация

toMainButton.onclick = () => {
    header.classList.add('hidden');
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

// 1.2 Отображение данных

const addTask = ({id, title}) => {
    const q = document.createElement('li')
    q.innerText = title;
    q.id = id;
    q.onclick = toTask;
    tasksList.appendChild(q);
}

// 1.3 Получение данных

const loadTasks = async () => {
    if (API_ENDPOINT) {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        tasks = await response.json();
    } else {
        const t = localStorage.getItem('tasks');
        tasks = t ? JSON.parse(t) : fakeTasks;
    }
};

const fakeTasks = [
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
        scraps: [{width: 1800, height: 1000, edge: 0, count: 1}],
        edgings: [{line: 0, thick: 2}, {line: 1, thick: 0.2}],
        pieces: [{
            width: 334,
            height: 284,
            rotated: true,
            count: 2,
            edging: {left: 0, right: 1, up: null, down: null}
        }, {
            width: 572,
            height: 84,
            rotated: false,
            count: 1,
            edging: {left: null, right: 1, up: 1, down: null}
        }, {
            width: 604,
            height: 84,
            rotated: true,
            count: 1,
            edging: {left: 0, right: null, up: null, down: null}
        }, {
            width: 388,
            height: 324,
            rotated: false,
            count: 2,
            edging: {left: 1, right: 0, up: null, down: 1}
        }, {
            width: 389,
            height: 334,
            rotated: false,
            count: 1,
            edging: {left: null, right: 1, up: 0, down: null}
        }, {
            width: 806,
            height: 84,
            rotated: true,
            count: 1,
            edging: {left: 0, right: 1, up: 1, down: null}
        }, {
            width: 734,
            height: 334,
            rotated: true,
            count: 2,
            edging: {left: 1, right: 0, up: null, down: null}
        }, {
            width: 805,
            height: 324,
            rotated: false,
            count: 6,
            edging: {left: 0, right: 0, up: 1, down: null}
        }, {
            width: 1034,
            height: 334,
            rotated: true,
            count: 8,
            edging: {left: null, right: 1, up: null, down: 1}
        }]
    }
];


// 2.1 Константы

const edgingLines = ['line', 'dash', 'wave'];


// 2.2 Значения по умолчанию

const taskKerfDefault = 4;
const sheetEdgeDefault = 10;
const sheetWidthDefault = 2800;
const sheetHeightDefault = 2070;

// 2.2 Разделитель

settingGutter.onpointerdown = handlePointerDown;

// 2.2 Отображение данных

const kerfHtml = () => `<span>${valueHtml(task.kerf || 0, 'мм')}</span>`;

const sheetHtml = (
    {
        width,
        height,
        edge
    }) => `<div class="section"><span>${width}${x}${height}${v}${valueHtml(edge, 'мм')}</span>${kerfHtml()}</div>`;

const scrapHtml = (width, height, edge, count) => `<div>${width}${x}${height}${v}${valueHtml(edge, 'мм')}</div>${valueHtml(count, 'шт')}`;

const edgingHtml = (line, thick) => `<div>${lineHtml(line)}</div>${valueHtml(thick, 'мм')}`;

const pieceHtml = (width, height, rotated, {left, up, right, down}, count) => {
    const w = `<div class="col"><span>${width}</span>${lineHtml(up)}${lineHtml(down)}</div>`;
    const h = `<div class="col"><span>${height}</span>${lineHtml(left)}${lineHtml(right)}</div>`;

    return `<div>${w}${rotated ? o : x}${h}</div>${valueHtml(count, 'шт')}`
}

// 2.3 Заполнение данных

const toDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split("-");
    return `${day}.${month}.${year}`;
}
const dateHtml = () => (task.start && task.finish) ? `<div class="section"><span>${toDate(task.start)}</span><span class="date">${toDate(task.finish)}</span></div>` : '';
const materialHtml = () => task.material ? `<div class="section"><span>${task.material}</span><span>${valueHtml(task.thick, 'мм')}</span></div>` : '';

const setTask = ({title, start, finish, material, thick, kerf, sheet, scraps, edgings, pieces}) => {
    taskTitleInput.innerText = title;

    taskKerfInput.value = kerf || '';
    taskStartInput.value = start;
    taskFinishInput.value = finish;
    taskMaterialInput.value = material || '';
    taskThickInput.value = thick || '';

    toUpdateSheetLink.innerHTML = dateHtml() + materialHtml() + sheetHtml(sheet);
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

// 2.4 Создание

const copyScrapToForm = () => {
    console.log('copyScrapToForm')
    const q = task.scraps[index];
    scrapWidthInput.value = q.width;
    scrapHeightInput.value = q.height;
    scrapEdgeInput.value = q.edge;
    scrapCountInput.value = q.count;
}

const addScrap = ({width, height, edge, count}, i) => {
    console.log('addScrap')
    let q = document.createElement('li');
    q.innerHTML = `<button class="section">${scrapHtml(width, height, edge, count)}</button>`
    q.firstChild.onclick = (e) => {
        index = i;
        copyScrapToForm();
        changeForm(e, scrapForm);
        formLabel.innerText = 'Обрезок';
        toUpdateForm();
    }
    scrapsList.appendChild(q);
    return q.firstChild;
};

const copyEdgingToForm = () => {
    console.log('copyEdgingToForm')
    const q = task.edgings[index];
    edgingThickInput.value = q.thick;
    edgingLine = q.line;
    edgingLineInput.innerHTML = lineHtml(q.line);
}

const addEdging = ({line, thick}, i) => {
    console.log('addEdging')
    let q = document.createElement('li');
    q.innerHTML = `<button class="section">${edgingHtml(line, thick)}</button>`;
    q.firstChild.onclick = (e) => {
        index = i;
        copyEdgingToForm();
        changeForm(e, edgingForm);
        formLabel.innerText = 'Кромка';
        toUpdateForm();
    }
    edgingsList.appendChild(q);
    return q.firstChild;
};

const copyPieceToForm = () => {
    const q = task.pieces[index]
    pieceWidthInput.value = q.width;
    pieceHeightInput.value = q.height;
    pieceRotated = q.rotated;
    pieceRotatedInput.innerText = q.rotated ? 'да' : 'нет';
    pieceCountInput.value = q.count;

    pieceEdging = q.edging;
    pieceEdgingUpInput.innerHTML = lineHtml(q.edging.up);
    pieceEdgingDownInput.innerHTML = lineHtml(q.edging.down);
    pieceEdgingLeftInput.innerHTML = lineHtml(q.edging.left);
    pieceEdgingRightInput.innerHTML = lineHtml(q.edging.right);
}

const addPiece = ({width, height, rotated, count, edging}, i) => {
    let {left, up, right, down} = edging;

    const w = `<div class="col"><span>${width}</span>${lineHtml(up)}${lineHtml(down)}</div>`;
    const h = `<div class="col"><span>${height}</span>${lineHtml(left)}${lineHtml(right)}</div>`;

    let q = document.createElement('li');
    q.innerHTML = `<button class="section"><div>${w}${rotated ? o : x}${h}</div>${valueHtml(count, 'шт')}</button>`
    q.firstChild.onclick = (e) => {
        index = i;
        copyPieceToForm();
        changeForm(e, pieceForm);
        formLabel.innerText = 'Деталь';
        toUpdateForm();
    }
    piecesList.appendChild(q);
    return q.firstChild;
};

// 2.4 Создание

const createScrap = () => {
    index = task.scraps.length;
    task.scraps.push({
        width: scrapWidthInput.value,
        height: scrapHeightInput.value,
        edge: scrapEdgeInput.value,
        count: scrapCountInput.value
    });
    link = addScrap(task.scraps[index], index);
}

const createEdging = () => {
    index = task.edgings.length;
    task.edgings.push({
        line: edgingLine, thick: edgingThickInput.value
    });
    link = addEdging(task.edgings[index], index);
}

const createPiece = () => {
    index = task.pieces.length;
    task.pieces.push({
        width: pieceWidthInput.value,
        height: pieceHeightInput.value,
        rotated: pieceRotated,
        edging: pieceEdging,
        count: pieceCountInput.value
    });
    link = addPiece(task.pieces[index], index);
}

// 2.4 Обновление

const updateScrap = () => {
    task.scraps[index] = {
        width: scrapWidthInput.value,
        height: scrapHeightInput.value,
        edge: scrapEdgeInput.value,
        count: scrapCountInput.value,
    }
    link.innerHTML = scrapHtml(...Object.values(task.scraps[index]));
}

const updateEdging = () => {
    task.edgings[index] = {
        line: edgingLine, thick: edgingThickInput.value
    }
    link.innerHTML = edgingHtml(...Object.values(task.edgings[index]));
}

const updatePiece = () => {
    task.pieces[index] = {
        width: pieceWidthInput.value,
        height: pieceHeightInput.value,
        rotated: pieceRotated,
        edging: pieceEdging,
        count: pieceCountInput.value
    };
    link.innerHTML = pieceHtml(...Object.values(task.pieces[index]));
}

const updateSheet = () => {
    task.sheet = {
        width: sheetWidthInput.value || 1,
        height: sheetHeightInput.value || 1,
        edge: sheetEdgeInput.value || 0
    }
    task.kerf = taskKerfInput.value;
    task.material = taskMaterialInput.value;
    task.thick = taskThickInput.value;
    task.start = taskStartInput.value;
    task.finish = taskFinishInput.value;

    toUpdateSheetLink.innerHTML = dateHtml() + materialHtml() + sheetHtml(task.sheet);
}

// 2.4 Навигация

toSettingButton.onclick = () => changePage(settingPage);


// 2.5 Управление задачей

removeTaskButton.onclick = async () => {
    if (task) {
        const q = document.getElementById(task.id)
        q.remove()
        await deleteTask(task.id);
        task = null;
    }
    changePage(mainPage);
}

const deleteTask = async () => {
    if (task) {
        if (API_ENDPOINT) {
            const url = new URL(API_ENDPOINT);
            url.searchParams.set("task_id", '-' + task.id)
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
        } else {
            tasks = tasks.filter(({id}) => task.id != id);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

};


taskTitleInput.onblur = async () => {
    const title = taskTitleInput.innerText.trim();
    if (task.title !== title) {
        task.title = document.getElementById(task.id).innerText = title;
        saveTask();
        await blurAutoSave({task_id: task.id, title});
    }
};


// 2.6 Переключение между формами

const changeForm = (e, f) => {
    e.stopPropagation();

    if (form) form.classList.add('hidden');
    if (link) link.classList.remove('selected');
    form = f;
    const target = e.currentTarget;
    if (target.parentElement.nodeName === 'LI') {
        link = target;
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

toUpdateSheetLink.onclick = (e) => {
    sheetWidthInput.value = task.sheet.width;
    sheetHeightInput.value = task.sheet.height;
    sheetEdgeInput.value = task.sheet.edge;
    taskKerfInput.value = task.kerf;

    changeForm(e, sheetForm);
    formLabel.innerText = 'Лист';
    toUpdateForm();
}
toCreateScrapLink.onclick = (e) => {
    scrapHeightInput.value = scrapWidthInput.value = scrapEdgeInput.value = '';
    scrapCountInput.value = 1;

    changeForm(e, scrapForm);
    formLabel.innerText = 'Обрезок';
    toCreateForm();
}
toCreateEdgingLink.onclick = (e) => {
    edgingThickInput.value = '';

    edgingLine = (edgingLine + 1) % edgingLines.length;
    edgingLineInput.innerHTML = lineHtml(edgingLine);

    changeForm(e, edgingForm);
    formLabel.innerText = 'Кромка';
    toCreateForm();
}
toCreatePieceLink.onclick = (e) => {
    pieceHeightInput.value = pieceWidthInput.value = '';
    pieceCountInput.value = 1;

    pieceRotated = false;
    pieceRotatedInput.innerText = 'нет';

    pieceEdging = {left: null, up: null, right: null, down: null};
    pieceEdgingUpInput.innerHTML = pieceEdgingDownInput.innerHTML = pieceEdgingLeftInput.innerHTML = pieceEdgingRightInput.innerHTML = lineHtml(null);

    changeForm(e, pieceForm);
    formLabel.innerText = 'Деталь';
    toCreateForm();
}

// 2.7 отправка и получение данных

const loadTask = async (id) => {
    if (API_ENDPOINT) {
        const url = new URL(API_ENDPOINT);
        url.searchParams.set("task_id", id)
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        task = await response.json();
    } else {
        task = tasks.find(q => q.id == id);
    }
}

const saveTask = async () => {
    if (API_ENDPOINT) {
        const url = new URL(API_ENDPOINT);
        url.searchParams.set("task", JSON.stringify(task))
        await fetch(url);
    } else {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

const createTask = async () => {
    if (API_ENDPOINT) {
        const url = new URL(API_ENDPOINT);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        task = await response.json();
    } else {
        task = {
            id: tasks.length,
            title: "Раскрой",
            kerf: 4,
            sheet: {width: 1000, height: 1000, edge: 10},
            pieces: [],
            edgings: [{line: 0, thick: 2}, {line: 1, thick: 0.2}],
            scraps: []
        }
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}


// 2.8 Изменение

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
    pieceRotatedInput.innerText = pieceRotated ? 'да' : 'нет';
}

// 2.8 Работа со списками

const clearForm = () => {
    form.querySelectorAll('input').forEach(q => q.value = '');
    pieceEdging = {left: null, up: null, right: null, down: null};
    pieceRotated = false;
    edgingLine = 0;
    form.querySelectorAll('button').forEach(q => {
        if (q.id === 'piece-rotated') {
            q.innerText = 'нет';
        } else {
            q.innerHTML = lineHtml(null);
        }
    });
}

removeButton.onclick = (e) => {
    e.preventDefault();
    clearForm();
    if (link) {
        link.remove();
        toCreateForm();
        if (form === scrapForm) {
            task.scraps[index] = null;
        } else if (form === edgingForm) {
            task.edgings[index] = null;
        } else if (form === pieceForm) {
            task.pieces[index] = null;
        }
    }
}

createButton.onclick = (e) => {
    e.preventDefault();
    if (form === scrapForm) {
        createScrap();
    } else if (form === edgingForm) {
        createEdging();
    } else if (form === pieceForm) {
        createPiece();
    }
    link.classList.add('selected');
    toUpdateForm();
}

updateButton.onclick = (e) => {
    e.preventDefault();
    if (form === scrapForm) {
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

// 3.1 Состояние

let click;
const MIN_DRAG = 5;
let startPoint;

let selected;
let cutDirection = true;

let takePiece;
let dragPiece;
let dropPlace;
let dragPoint = {};

let dropStates = [];
let dragStates = [];
let takeStates = [];
let takePieces = [];
let takeCounts = [];

let dropState;
let dragState;
let takeState;

// 3.2. Разделитель

cuttingGutter.onpointerdown = handlePointerDown;

// 3.2. Управление

const setScale = ({width, height}) => {
    scale = Math.min(L.width / width, L.height / height)
}

downloadCuttingButton.onclick = () => {
    const t = taskPdf(task);
    setScale(task.sheet);

    print.innerHTML = takePagePdf(t) + getPages().map((
        {sheet, pieces, places}) => pagePdf(sheet, pieces, places, t)).join('\n')
    window.print();
}

// 3.3. Отображение деталей

const widthHeightHtml = (width, height, rotated = false) => `${width}${rotated ? o : x}${height}`
const getColors = n => [...Array(n)].map((_, i) => `hsl(${i / n * 360}, var(--saturation), var(--lightness))`);

const pieceTitleHtml = (width, height, rotated) => `<h4 class="center">${widthHeightHtml(width, height, rotated)}</h4>`;
const pieceBodyHtml = (width, height, color, count, i) => `<div class="center"><div class="take" data-i="${i}" style="width: ${100 * width / task.sheet.width}%; aspect-ratio: ${width} / ${height}; background-color: ${color};"></div>${valueHtml(count, 'шт')}</div>`;

const takePieceHtml = (width, height, rotated, color, count, i) => `<div>${pieceTitleHtml(width, height, rotated)}${pieceBodyHtml(width, height, color, count, i)}</div>`;

const setPieces = () => {
    const colors = getColors(task.pieces.length);
    takeStates = task.pieces.map(({width, height, rotated, count}, i) => ({
        width,
        height,
        rotated,
        count,
        color: colors[i]
    }));

    src.innerHTML = takeStates.map((
        {
            width,
            height,
            rotated,
            count,
            color
        }, i) => takePieceHtml(width, height, rotated, color, count, i)).join('\n');

    takePieces = [...src.getElementsByClassName('take')];
    takeCounts = [...src.getElementsByClassName('value')];

    takePieces.forEach((q) => {
        q.onpointerdown = (e) => {
            onPointerDown(e, dragTakePiece);
            setCutDirectionButton(cutDirection);
        }
        q.onpointerup = () => {
            if (!click) return;
            takePiece = q;
            toSelect(q);
        };
    });
}

// 3.4 Отображение мест вставки

const cutButtonHtml = () => `<button class="hidden">собрать</button>`;
const placeTitleHtml = (width, height) => `<h4 class="center">${cutButtonHtml()}${widthHeightHtml(width, height)}</h4>`;
const dropHtml = (width, height, edge, k) => `<div class="drop" data-k="${k}" style="width: ${100 * (1 - 2 * edge / width)}%; aspect-ratio: ${width - 2 * edge} / ${height - 2 * edge}; left: ${100 * edge / width}%; top: ${100 * edge / height}%; background-color: var(--bg-header);"></div>`;
const placeBodyHtml = (width, height, edge, k) => `<div class="edge" style="width: ${100 * width / task.sheet.width}%; aspect-ratio: ${width} / ${height}; background-color: var(--bg-secondary);">${dropHtml(width, height, edge, k)}</div>`;
const placeHtml = (width, height, edge, k) => `<div class="place">${placeTitleHtml(width, height)}${placeBodyHtml(width, height, edge, k)}</div>`;

const setPlaces = () => {
    const states = [...task.scraps, task.sheet].filter(Boolean);
    dst.innerHTML = states.map((
        {
            width,
            height,
            edge
        }, k) => placeHtml(width, height, edge, k)).join('\n');
    dropStates = states.map(({width, height, edge}) => ({
        left: 0,
        top: 0,
        width: width - 2 * edge,
        height: height - 2 * edge
    }));
}

// 3.5 Отображение страницы

const clearCutting = () => {
    src.replaceChildren();
    takeStates.length = 0;
    takePieces.length = 0;
    takeCounts.length = 0;

    dst.replaceChildren();
    dropStates.length = 0;
    dragStates.length = 0;
}

toCuttingButton.onclick = () => {
    clearCutting();

    setCutDirectionButton(cutDirection);
    setPlaces();
    setPieces();

    changePage(cuttingPage);
}

// 3.6 Перетаскивания

const dropDragPiece = (e) => {
    console.log('dropDragPiece')
    e.preventDefault();
    if (!startPoint) return;
    if (findDropPlace()) {
        calcDropPoint();
        cutDropPlace();
    } else {
        cancelDragPiece();
    }
    window.removeEventListener('pointermove', toDragPiece);
    window.removeEventListener('pointerup', dropDragPiece);

    startPoint = null;
}

const rotateDropPiece = () => {
    console.log('rotateDropPiece')
    console.assert(dragPiece);
    console.assert(dropPlace);

    dropState = dropStates[dropPlace.dataset.k];
    dragState = dragStates[dragPiece.dataset.j];

    if (dragState.rotated && dragState.height <= dropState.width && dragState.width <= dropState.height) {
        toRotateDropPiece();
        clearDropPlace();
        cutDropPlace();
    }
}

const rotateTakePiece = () => {
    console.log('rotateTakePiece')
    console.assert(takePiece);

    takeState = takeStates[takePiece.dataset.i];
    if (takeState.rotated) {
        [takeState.width, takeState.height] = [takeState.height, takeState.width];
        takePiece.style.width = 100 * takeState.width / task.sheet.width + '%';
        takePiece.style.aspectRatio = `${takeState.width} / ${takeState.height}`;
    }
}

const changeCutDirection = () => {
    console.log('changeCutDirection')
    console.assert(dragPiece);
    console.assert(dropPlace);

    console.assert(dropState === dropStates[dropPlace.dataset.k])
    console.assert(dragState === dragStates[dragPiece.dataset.j])

    if (dragState.width < dropState.width && dragState.height < dropState.height) {
        clearDropPlace();
        cutDropPlace();
    }
}

const calcDropPoint = () => {
    console.log('calcDropPoint')
    console.assert(dragState);

    const piece = dragPiece.getBoundingClientRect();
    const x = piece.left + piece.width / 2;
    const y = piece.top + piece.height / 2;

    const place = dropPlace.getBoundingClientRect();
    dragState.left = x - place.left <= place.right - x;
    dragState.top = y - place.top <= place.bottom - y;
}

const findDropPlace = () => {
    console.log('findDropPlace')
    dropPlace = Array.from(dst.getElementsByClassName('drop')).find(q => {
        if (q.childElementCount) return false;
        const r = q.getBoundingClientRect();
        return r.left <= dragPoint.x && dragPoint.x <= r.right && r.top <= dragPoint.y && dragPoint.y <= r.bottom;
    });
    if (!dropPlace) return false;

    dropState = dropStates[dropPlace.dataset.k];
    dragState = dragStates[dragPiece.dataset.j];

    if (dragState.width <= dropState.width && dragState.height <= dropState.height) return true;
    if (dragState.rotated && dragState.height <= dropState.width && dragState.width <= dropState.height) {
        toRotateDragPiece();
        return true;
    }
    return false;
}
const toRotateDragPiece = () => {
    console.log('toRotateDragPiece');
    [dragState.width, dragState.height] = [dragState.height, dragState.width];
    dragPiece.style.width = 100 * dragState.width / task.sheet.width + '%';
    dragPiece.style.aspectRatio = `${dragState.width} / ${dragState.height}`;
}

const toRotateDropPiece = () => {
    console.log('toRotateDropPiece');
    [dragState.width, dragState.height] = [dragState.height, dragState.width];
    dragPiece.style.width = 100 * dragState.width / dropState.width + '%';
    dragPiece.style.aspectRatio = `${dragState.width} / ${dragState.height}`;
}

const addRightDropPlace = () => {
    // console.log('addRightDropPlace')
    const rect = {width: dropState.width - dragState.width - task.kerf};
    if (rect.width <= 0) return false;

    const place = document.createElement('DIV');
    place.classList.add('drop');

    rect.height = dragState.cutDirection ? dropState.height : dragState.height;
    place.dataset.k = dropStates.length.toString();
    dropStates.push(rect);

    if (dragState.left) {
        place.style.right = '0';
    } else {
        place.style.left = '0';
    }
    if (dragState.top) {
        place.style.top = '0';
    } else {
        place.style.bottom = '0';
    }
    place.style.width = 100 * rect.width / dropState.width + '%';
    place.style.height = 100 * rect.height / dropState.height + '%';

    dropPlace.appendChild(place);
    return true;
}

const addLeftDropPlace = () => {
    // console.log('addLeftDropPlace')
    const rect = {height: dropState.height - dragState.height - task.kerf};
    if (rect.height <= 0) return false;

    const place = document.createElement('DIV');
    place.classList.add('drop');

    rect.width = dragState.cutDirection ? dragState.width : dropState.width;
    place.dataset.k = dropStates.length.toString();
    dropStates.push(rect);

    if (dragState.left) {
        place.style.left = '0';
    } else {
        place.style.right = '0';
    }
    if (dragState.top) {
        place.style.bottom = '0';
    } else {
        place.style.top = '0';
    }
    place.style.width = 100 * rect.width / dropState.width + '%';
    place.style.height = 100 * rect.height / dropState.height + '%';

    dropPlace.appendChild(place);
    return true;
}

const addVerticalCutLine = () => {
    // console.log('addVerticalCutLine')
    const line = document.createElement('DIV');
    line.classList.add('cut');

    const width = 100 * dragState.width / dropState.width + '%'
    const height = 100 * dragState.height / dropState.height + '%'

    if (dragState.left) {
        line.style.left = width;
    } else {
        line.style.right = width;
    }
    if (dragState.top) {
        line.style.top = '0';
    } else {
        line.style.bottom = '0';
    }
    line.style.width = 100 * task.kerf / dropState.width + '%';
    line.style.height = dragState.cutDirection ? '100%' : height;
    dropPlace.appendChild(line);
}

const addHorizontalCutLine = () => {
    // console.log('addHorizontalCutLine')
    const line = document.createElement('DIV');
    line.classList.add('cut');

    const width = 100 * dragState.width / dropState.width + '%'
    const height = 100 * dragState.height / dropState.height + '%'

    if (dragState.left) {
        line.style.left = '0';
    } else {
        line.style.right = '0';
    }
    if (dragState.top) {
        line.style.top = height;
    } else {
        line.style.bottom = height;
    }

    line.style.height = 100 * task.kerf / dropState.height + '%';
    line.style.width = dragState.cutDirection ? width : '100%';
    dropPlace.appendChild(line);
}

const addDropPiece = () => {
    console.log('addDropPiece')
    dragPiece.style.removeProperty('inset');
    dragPiece.style.cursor = 'grab';
    if (dragState.left) {
        dragPiece.style.left = '0';
    } else {
        dragPiece.style.right = '0';
    }
    if (dragState.top) {
        dragPiece.style.top = '0';
    } else {
        dragPiece.style.bottom = '0';
    }
    dragPiece.style.width = 100 * dragState.width / dropState.width + '%';

    dragPiece.onpointerdown = (e) => onPointerDown(e, dragDropPiece);
    dragPiece.onpointerup = (e) => {
        if (click) {
            dragPiece = e.currentTarget;
            dropPlace = dragPiece.parentElement;

            dropState = dropStates[dropPlace.dataset.k];
            dragState = dragStates[dragPiece.dataset.j];

            toSelect(dragPiece);
            setCutDirectionButton(dragState.cutDirection);
        }
    };
    dropPlace.appendChild(dragPiece);
}

const cutDropPlace = () => {
    console.log('cutDropPlace')

    console.assert(dropState === dropStates[dropPlace.dataset.k])
    console.assert(dragState === dragStates[dragPiece.dataset.j])

    addDropPiece();
    addLeftDropPlace() && addHorizontalCutLine();
    addRightDropPlace() && addVerticalCutLine();
    // dropPlace.style.backgroundColor = 'gray'
}

const incTakeCount = (i) => {
    takeState = takeStates[i];
    takePiece = takePieces[i];
    if (takeState.count === 0) {
        takePiece.parentElement.parentElement.classList.remove('hidden');
    }
    takeState.count++;
    takeCounts[i].innerText = takeState.count;
}

const decTakeCount = (i) => {
    console.assert(takePiece);

    takeState = takeStates[i];
    console.assert(takeState.count);

    takeState.count--;
    if (takeState.count === 0) {
        takePiece.parentElement.parentElement.classList.add('hidden');
    }
    takeCounts[i].innerText = takeState.count;
}

const clearDropPlace = () => {
    console.log('clearDropPlace')
    dropPlace.querySelectorAll('[data-i]').forEach(q => q !== dragPiece && incTakeCount(q.dataset.i));
    dropPlace.replaceChildren();
}

const cancelDragPiece = () => {
    console.log('cancelDragPiece')
    console.assert(dragPiece);
    console.assert(startPoint);

    incTakeCount(dragPiece.dataset.i);
    toSelect(takePiece);
    setCutDirectionButton(cutDirection);

    dragPiece.remove();
    dragPiece = dropPlace = startPoint = null;
}

// Перетаскивания деталей

const dragTakePiece = (x, y, t) => {
    console.log('dragTakePiece')
    if (startPoint) return;

    takePiece = t;

    const r = takePiece.getBoundingClientRect();
    startPoint = {
        left: r.left,
        top: r.top,
        x, y
    };

    dragPiece = document.createElement('div');
    dragPiece.style.aspectRatio = getComputedStyle(takePiece).aspectRatio;
    dragPiece.style.position = 'absolute';
    dragPiece.style.cursor = 'grabbing';

    dragPiece.dataset.i = takePiece.dataset.i;
    decTakeCount(takePiece.dataset.i)

    dragPiece.dataset.j = dragStates.length.toString();
    const {width, height, rotated, color} = takeState;
    dragStates.push({width, height, rotated, cutDirection});

    dragPiece.style.width = r.width + 'px';
    dragPiece.style.left = r.left + 'px';
    dragPiece.style.top = r.top + 'px';
    dragPiece.style.backgroundColor = color;

    document.body.appendChild(dragPiece);
    if (selected !== dragPiece) toSelect(dragPiece);

    window.addEventListener('pointermove', toDragPiece);
    window.addEventListener('pointerup', dropDragPiece);
}

const dragDropPiece = (x, y, t) => {
    console.log('dragDropPiece')
    if (startPoint) return;

    dragPiece = t;
    const r = dragPiece.getBoundingClientRect();
    startPoint = {left: r.left, top: r.top, x, y};

    dropPlace = dragPiece.parentElement;
    dragPiece.remove();
    clearDropPlace();

    dragPiece.style.width = r.width + 'px';
    dragPiece.style.removeProperty('inset');
    dragPiece.style.left = r.left + 'px';
    dragPiece.style.top = r.top + 'px';
    dragPiece.style.cursor = 'grabbing';

    document.body.appendChild(dragPiece);
    if (selected !== dragPiece) {
        toSelect(dragPiece);
        setCutDirectionButton(dragState.cutDirection);
    }

    window.addEventListener('pointermove', toDragPiece);
    window.addEventListener('pointerup', dropDragPiece);
}

const toDragPiece = (e) => {
    console.log('toDragPiece')
    if (!startPoint) return;
    e.preventDefault();
    console.assert(dragPiece);

    dragPoint.x = e.clientX;
    dragPoint.y = e.clientY;

    dragPiece.style.left = startPoint.left + dragPoint.x - startPoint.x + 'px';
    dragPiece.style.top = startPoint.top + dragPoint.y - startPoint.y + 'px';
}

// Кнопки изменений положения деталей и разрезов

rotatePieceButton.onclick = () => {
    if (selected) {
        if (selected === takePiece) {
            rotateTakePiece();
        } else if (selected === dragPiece) {
            rotateDropPiece();
        }
    }
}
const setCutDirectionButton = (cutDirection) => cutDirectionButton.firstElementChild.style.transform = `rotate(${cutDirection ? 0 : 90}deg)`

cutDirectionButton.onclick = () => {
    if (selected && selected === dragPiece) {
        dragState.cutDirection = !dragState.cutDirection;
        changeCutDirection();
        setCutDirectionButton(dragState.cutDirection);
    } else {
        cutDirection = !cutDirection;
        setCutDirectionButton(cutDirection);
    }
}

// Нажатия мышкой

const onPointerDown = (e, f) => {
    console.log('onPointerDown')
    e.preventDefault();
    click = {
        x: e.clientX,
        y: e.clientY,
        f,
        t: e.currentTarget
    };
}

const toSelect = (q) => {
    console.log('toSelect')

    if (selected) {
        selected.classList.remove('selected');
    }
    selected = selected === q ? null : q;
    if (selected) {
        selected.classList.add('selected');
    }
}

const endClick = () => (click = null);

const tryStartDrag = (e) => {
    if (click) {
        console.log('tryStartDrag');
        if ((Math.abs(click.x - e.clientX) > MIN_DRAG || Math.abs(click.y - e.clientY) > MIN_DRAG)) {
            const {x, y, t, f} = click;
            click = null;
            f(x, y, t);
        }
    }
}

window.addEventListener('pointerup', endClick);
window.addEventListener('pointermove', tryStartDrag);


// Печать

let scale;

const valuePdf = (key, value) => `<div class="sign"><span>${key}:</span><span>${value}</span></div>`

const taskPdf = ({title, start, finish, material, thick}) => {
    const s = getHead();
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

// Все детали

const linePdf = (line) => line === null ? '' : `<svg class="line yellow"><use href="sprite.svg#${edgingLines[line]}"></use></svg>`;

const flagPdf = (flag) => `<td style="color: green;">${flag ? `&#10003;` : ''}</td>`;
const whPdf = (width, height, {left, right, up, down}) => {
    const w = `<div class="col"><span>${width}</span>${linePdf(up)}${linePdf(down)}</div>`;
    const h = `<div class="col"><span>${height}</span>${linePdf(left)}${linePdf(right)}</div>`;
    return `<td>${w}</td><td>${h}</td>`

}
const takePagePdf = (t) => `<div class="page">${t}${logoPdf}<table style="left: ${padding}mm;top: ${L.top}mm;"><thead>${takeHeadPdf}</thead><tbody>${takeListPdf()}</tbody></table></div>`
const takeHeadPdf = `<tr><th>#</th><th>Длина</th><th>Ширина</th><th>Кол-во</th><th>Пов-от</th><th>Наименование</th><th>ДО</th></tr>`;
const takeItemPdf = (
    {
        width,
        height,
        count,
        rotated,
        name,
        extra,
        edging
    }, i) => `<tr><td>${i + 1}</td>${whPdf(width, height, edging)}<td>${count}</td>${flagPdf(rotated)}<td>${name || ""}</td>${flagPdf(extra)}</tr>`;
const takeListPdf = () => task.pieces.map(takeItemPdf).join('\n');

// Раскрой

const getRect = (left, top, width, height) => `left: ${left}mm;top: ${top}mm;width: ${width}mm;height: ${height}mm;`;
const getArea = (width, height) => `right: ${L.right}mm;top: ${L.top}mm;width: ${width}mm;height: ${height}mm;`;
const getHead = () => `left: ${U.left}mm;top: ${U.top}mm;right: ${U.right}mm;height: ${U.height}mm;`;

const backPdf = (s, zIndex) => `<div class="base" style="${s};z-index: ${zIndex}"></div>`

const sheetPdf = (s, l, p) => `<div class="area" style="${s}">${l}${p}</div>`
const piecePdf = (s, wh, i) => `<div class="rect" style="${s}">${wh}${i}</div>`
const placePdf = (s, wh) => `<div class="rect gray" style="${s}">${wh}</div>`

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

const tapePdf = (width, height) => {
    const lines = []
    for (let y = -width; y <= height; y += 5) {
        lines.push(`<line x1=0 y1=${y} x2=${width} y2=${y + width}></line>`)
    }
    return `<svg class="junk" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 ${width} ${height}">${lines.join('\n')}</svg>`
}

const piecesPdf = (pieces) => pieces.map(({left, top, width, height, i}) => {
    const w = width * scale;
    const h = height * scale;
    const l = left * scale;
    const t = top * scale;
    const s = getRect(l, t, w, h);
    return piecePdf(s, sizePdf(width, height, w, h), indexPdf(+i, w, h)) + backPdf(s, 3);
}).join('\n');

const placesPdf = (places) => places.map(({left, top, width, height}) => {
    const w = width * scale;
    const h = height * scale;
    const l = left * scale;
    const t = top * scale;
    const s = getRect(l, t, w, h);
    return placePdf(s, sizePdf(width, height, w, h)) + backPdf(s, 1);
}).join('\n');


const cutPdf = (sheet, pieces, places) => {
    const {width, height} = sheet;
    const w = width * scale;
    const h = height * scale;
    const s = getArea(w, h);
    const l = tapePdf(w, h);
    const p = piecesPdf(pieces) + placesPdf(places);
    return sheetPdf(s, l, p) + `<div class="rect" style="${s}"></div>`;
}

const pieceHeadPdf = `<tr><th>#</th><th>Длина</th><th>Ширина</th><th>Кол-во</th></tr>`;
const pieceItemPdf = (i, count) => {
    const {width, height, edging} = task.pieces[i];
    return `<tr><td>${i + 1}</td>${whPdf(width, height, edging)}<td>${count}</td></tr>`
}
const pieceListPdf = (pieces) => {
    const counts = pieces.reduce((acc, {i}) => {
        acc[i] = (acc[i] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(counts).map(([i, count]) => pieceItemPdf(+i, count)).join('\n');
}
const logoPdf = `<div class="logo">${iconHtml('cut', 'green')} <span>whCut</span></div>`;

const takePdf = (pieces) => `<table style="top: ${R.top}mm;right: ${R.right}mm; width: ${R.width}mm;"><thead>${pieceHeadPdf}</thead><tbody>${pieceListPdf(pieces)}</tbody></table>`
const pagePdf = (sheet, pieces, places, t) => `<div class="page">${t}${logoPdf}${cutPdf(sheet, pieces, places)}${takePdf(pieces)}</div>`;

const getPages = () => [...dst.querySelectorAll('.edge')].map(e => {
    const {left, top, width, height} = e.getBoundingClientRect();
    const scale = getComputedStyle(e).aspectRatio.split('/')[0] / width;
    const shift = {left, top};

    return {
        sheet: {width: Math.round(width * scale), height: Math.round(height * scale)},
        places: [...e.querySelectorAll('[data-k]:empty')].map(p => {
            let {left, top, width, height} = p.getBoundingClientRect();
            left = Math.round((left - shift.left) * scale);
            top = Math.round((top - shift.top) * scale);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
            return {left, top, width, height};
        }),
        pieces: [...e.querySelectorAll('[data-i]')].map(p => {
            let {left, top, width, height} = p.getBoundingClientRect();
            left = Math.round((left - shift.left) * scale);
            top = Math.round((top - shift.top) * scale);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
            return {left, top, width, height, i: p.dataset.i};
        })
    };
});

// Автосохранение

let saveTimeout = null;
let abortController = null;


async function updateTask(update) {
    if (abortController) abortController.abort();
    console.log('updateTask:', update);

    abortController = new AbortController();
    const signal = abortController.signal;

    try {
        if (API_ENDPOINT) {
            const response = await fetch(API_ENDPOINT, {
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
            console.log('updateTask cancelled');
            return false;
        }
        console.error('updateTask:', error);
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



