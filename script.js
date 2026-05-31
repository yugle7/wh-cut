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

// Состояние

let page = mainPage;
let task = null;
let form = sheetForm;
let link = null;

let edgingLine = -1;
let pieceRotated = false;
let pieceEdging = {left: null, up: null, right: null, down: null};

// Константы

const getIcon = (id) => `<svg class="icon gray"><use href="sprite.svg#${id}"></use></svg>`;
const getLine = (line) => line === null ? `<svg class="line gray"><use href="sprite.svg#line"></use></svg>` : `<svg class="line yellow"><use href="sprite.svg#${edgingLines[line]}"></use></svg>`;
const getValue = (value, unit) => `<span style="padding: 10px;"><span class="value">${value}</span><span class="unit">${unit}</span></span>`

const x = getIcon('x');
const v = getIcon('v');
const o = getIcon('o');

// Навигация

const changePage = (p) => {
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
let isDragging = false;
let wasDragging = false;
let startX = 0;
let startLeftWith = 0;
let clickTimeout = null;

const minWidth = 150;
const maxWidth = 100000;

function handleMouseDown(e) {
    e.preventDefault();
    gutter = e.target;
    isDragging = true;
    wasDragging = false;
    gutter.classList.add("dragging");
    document.body.style.cursor = "col-resize";
    startX = e.clientX;
    startLeftWith = page.firstElementChild.getBoundingClientRect().width;
}

function handleMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    wasDragging = true;
    if (clickTimeout) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
    }

    let leftWidth = startLeftWith + e.clientX - startX;
    leftWidth = Math.min(maxWidth, Math.max(minWidth, leftWidth));

    gutter.style.left = leftWidth + 'px';
    page.style.gridTemplateColumns = `${leftWidth}px 1fr`;

    if (gutter === cuttingGutter) {
        src.style.width = (leftWidth - 80) + 'px';
    }
}

function handleMouseUp() {
    if (isDragging && gutter) {
        isDragging = false;
        gutter.classList.remove("dragging");
        document.body.style.cursor = "";
        gutter = null;
    }
}

document.onmousemove = document.ontouchmove = handleMouseMove;
document.onmouseup = document.ontouchend = document.onmouseleave = handleMouseUp;

// 1.1. Навигация

toMainButton.onclick = () => {
    header.classList.add('hidden');
    changePage(mainPage);
}

createTaskButton.onclick = async () => {
    await _createTask();
    toSettingPage();
};

const toTask = async (e) => {
    e.preventDefault()

    if (changePage(settingPage)) {
        scrapsList.replaceChildren();
        edgingsList.replaceChildren();
        piecesList.replaceChildren();

        await _loadTask(e.currentTarget.id);
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

const getTasks = async () => {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
};

const _getTasks = async () => {
    return [{id: 1, title: 'first cutting'}, {id: 2, title: 'second cutting'}]
};


// 2.1 Константы

const edgingLines = ['line', 'dash', 'wave'];


// 2.2 Значения по умолчанию

const taskKerfDefault = 4;
const sheetEdgeDefault = 10;
const sheetWidthDefault = 2800;
const sheetHeightDefault = 2070;

// 2.2 Разделитель

settingGutter.onmousedown = settingGutter.ontouchstart = handleMouseDown;

// 2.2 Отображение данных

const getSheetHTML = (width, height, edge) => `${width}${x}${height}${v}${getValue(edge, 'мм')}`

const getScrapHTML = (width, height, edge, count) => `<div>${width}${x}${height}${v}${getValue(edge, 'мм')}</div>${getValue(count, 'шт')}`;

const getEdgingHTML = (line, thick) => `<div>${getLine(line)}</div>${getValue(thick, 'мм')}`;

const getPieceHTML = (width, height, rotated, {left, up, right, down}, count) => {
    const w = `<div class="col"><span>${width}</span>${getLine(up)}${getLine(down)}</div>`;
    const h = `<div class="col"><span>${height}</span>${getLine(left)}${getLine(right)}</div>`;

    return `<div>${w}${rotated ? o : x}${h}</div>${getValue(count, 'шт')}`
}

// 2.3 Заполнение данных

const setTask = ({title, kerf, sheet, scraps, edgings, pieces}) => {
    taskTitleInput.innerText = title;

    taskKerfInput.value = kerf;
    toUpdateSheetLink.lastElementChild.innerHTML = `${getValue(kerf, 'мм')}`

    setSheet(sheet);
    scraps.forEach(addScrap);
    edgings.forEach(addEdging);
    pieces.forEach(addPiece);
}

const setSheet = ({width, height, edge}) => {
    toUpdateSheetLink.firstElementChild.innerHTML = getSheetHTML(width, height, edge);

    sheetWidthInput.value = width;
    sheetHeightInput.value = height;
    sheetEdgeInput.value = edge;
};

// 2.4 Создание

const copyScrapToForm = () => {
    const q = task.scraps[index];
    scrapWidthInput.value = q.width;
    scrapHeightInput.value = q.height;
    scrapEdgeInput.value = q.edge;
    scrapCountInput.value = q.count;
}

const addScrap = ({width, height, edge, count}, i) => {
    let q = document.createElement('li');
    q.innerHTML = `<button class="section">${getScrapHTML(width, height, edge, count)}</button>`
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
    const q = task.edgings[index];
    edgingThickInput.value = q.thick;
    edgingLine = q.line;
    edgingLineInput.innerHTML = getLine(q.line);
}

const addEdging = ({line, thick}, i) => {
    let q = document.createElement('li');
    q.innerHTML = `<button class="section">${getEdgingHTML(line, thick)}</button>`;
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
    pieceEdgingUpInput.innerHTML = getLine(q.edging.up);
    pieceEdgingDownInput.innerHTML = getLine(q.edging.down);
    pieceEdgingLeftInput.innerHTML = getLine(q.edging.left);
    pieceEdgingRightInput.innerHTML = getLine(q.edging.right);
}

const addPiece = ({width, height, rotated, count, edging}, i) => {
    let {left, up, right, down} = edging;

    const w = `<div class="col"><span>${width}</span>${getLine(up)}${getLine(down)}</div>`;
    const h = `<div class="col"><span>${height}</span>${getLine(left)}${getLine(right)}</div>`;

    let q = document.createElement('li');
    q.innerHTML = `<button class="section"><div>${w}${rotated ? o : x}${h}</div>${getValue(count, 'шт')}</button>`
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
    link.innerHTML = getScrapHTML(...Object.values(task.scraps[index]));
}

const updateEdging = () => {
    task.edgings[index] = {
        line: edgingLine, thick: edgingThickInput.value
    }
    link.innerHTML = getEdgingHTML(...Object.values(task.edgings[index]));
}

const updatePiece = () => {
    task.pieces[index] = {
        width: pieceWidthInput.value,
        height: pieceHeightInput.value,
        rotated: pieceRotated,
        edging: pieceEdging,
        count: pieceCountInput.value
    };
    link.innerHTML = getPieceHTML(...Object.values(task.pieces[index]));
}

const updateSheet = () => {
    task.sheet = {
        width: sheetWidthInput.value, height: sheetHeightInput.value, edge: sheetEdgeInput.value
    }
    task.kerf = taskKerfInput.value;

    toUpdateSheetLink.firstElementChild.innerHTML = getSheetHTML(...Object.values(task.sheet));
    toUpdateSheetLink.lastElementChild.innerHTML = `${getValue(task.kerf, 'мм')}`
}

// 2.4 Навигация

toSettingButton.onclick = () => changePage(settingPage);


// 2.5 Управление задачей

removeTaskButton.onclick = async () => {
    if (task) {
        const q = document.getElementById(task.id)
        q.remove()
        await _deleteTask(task.id);
        task = null;
    }
    changePage(mainPage);
}

const deleteTask = async () => {
    if (!task) return;
    const url = new URL(API_ENDPOINT);
    url.searchParams.set("task_id", '-' + task.id)
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
};

const _deleteTask = async () => {
    console.log('delete task', task.id);
}

taskTitleInput.onblur = async () => {
    const title = taskTitleInput.innerText.trim();
    if (task.title !== title) {
        task.title = title;
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
    edgingLineInput.innerHTML = getLine(edgingLine);

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
    pieceEdgingUpInput.innerHTML = pieceEdgingDownInput.innerHTML = pieceEdgingLeftInput.innerHTML = pieceEdgingRightInput.innerHTML = getLine(null);

    changeForm(e, pieceForm);
    formLabel.innerText = 'Деталь';
    toCreateForm();
}

// 2.7 отправка и получение данных

const loadTask = async (id) => {
    const url = new URL(API_ENDPOINT);
    url.searchParams.set("task_id", id)
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    task = await response.json();
}

const _loadTask = async (id) => {
    console.log('load task', id);

    task = {
        id: 1,
        title: 'Заголовок',
        kerf: 4,
        sheet: {
            width: 2800, height: 2070, edge: 10
        },
        scraps: [{width: 1800, height: 1000, edge: 0, count: 1}],
        edgings: [{line: 0, thick: 2}, {line: 1, thick: 0.2},],
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
        }, {width: 1034, height: 334, rotated: true, count: 8, edging: {left: null, right: 1, up: null, down: 1}}]
    };
}

const createTask = async () => {
    const url = new URL(API_ENDPOINT);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    task = await response.json();
};

const _createTask = async () => {
    task = {
        id: 3, title: "new cutting",
    }
}

// 2.8 Изменение

edgingLineInput.onclick = (e) => {
    e.preventDefault();
    edgingLine = (edgingLine + 1) % edgingLines.length;
    edgingLineInput.innerHTML = getLine(edgingLine);
}

const getNextEdgingLine = (line) => {
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
    pieceEdgingUpInput.innerHTML = getLine(pieceEdging.up);
}

pieceEdgingDownInput.onclick = (e) => {
    e.preventDefault();
    pieceEdging.down = getNextEdgingLine(pieceEdging.down);
    pieceEdgingDownInput.innerHTML = getLine(pieceEdging.down);
}

pieceEdgingLeftInput.onclick = (e) => {
    e.preventDefault();
    pieceEdging.left = getNextEdgingLine(pieceEdging.left);
    pieceEdgingLeftInput.innerHTML = getLine(pieceEdging.left);
}

pieceEdgingRightInput.onclick = (e) => {
    e.preventDefault();
    pieceEdging.right = getNextEdgingLine(pieceEdging.right);
    pieceEdgingRightInput.innerHTML = getLine(pieceEdging.right);
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
            q.innerHTML = getLine(null);
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

cuttingGutter.onmousedown = cuttingGutter.ontouchstart = handleMouseDown;

// 3.2. Управление

downloadCuttingButton.onclick = async () => {
    // загружаем pdf
}

// 3.3. Отображение деталей

const widthHeightHtml = (width, height, rotated = false) => `${width}${rotated ? o : x}${height}`
const getColors = n => [...Array(n)].map((_, i) => `hsl(${i / n * 360}, var(--saturation), var(--lightness))`);

const pieceTitleHtml = (width, height, rotated) => `<h4 class="center">${widthHeightHtml(width, height, rotated)}</h4>`;
const pieceBodyHtml = (width, height, color, count, i) => `<div class="center"><div class="take" data-i="${i}" style="width: ${100 * width / task.sheet.width}%; aspect-ratio: ${width} / ${height}; background-color: ${color};"></div>${getValue(count, 'шт')}</div>`;

const pieceHtml = (width, height, rotated, color, count, i) => `<div>${pieceTitleHtml(width, height, rotated)}${pieceBodyHtml(width, height, color, count, i)}</div>`;

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
        }, i) => pieceHtml(width, height, rotated, color, count, i)).join('\n');

    takePieces = [...src.getElementsByClassName('take')];
    takeCounts = [...src.getElementsByClassName('value')];

    takePieces.forEach((q) => {
        q.onmousedown = q.ontouchstart = (e) => {
            onMouseDown(e, dragTakePiece);
            setCutDirectionButton(cutDirection);
        }
        q.onmouseup = q.ontouchend = () => {
            takePiece = q;
            toSelect(q);
        };
    });
}
const getTakeCount = (p) => {
    const q = document.createElement('span');
    q.innerText = p.count;
    return q;
}
const addPieces = () => {

    task.pieces.forEach(p => {
        const q = document.createElement('div')
        q.classList.add('take')

        q.style.width = 100 * p.width / task.sheet.width + '%';
        q.style.aspectRatio = `${p.width} / ${p.height}`;
        q.style.backgroundColor = p.color;

        q.onmousedown = q.ontouchstart = (e) => {
            onMouseDown(e, dragTakePiece);
            setCutDirectionButton(cutDirection);
        }
        q.onmouseup = q.ontouchend = () => {
            takePiece = q;
            toSelect(q);
        };
        q.dataset.i = takeStates.length.toString();

        takeStates.push(p);
        takePieces.push(q);

        const c = getTakeCount(p);
        takeCounts.push(c);
        src.appendChild(c);

        src.appendChild(q);
    })
}

// 3.4 Отображение мест вставки

const cutButtonHtml = () => `<button class="hidden">собрать</button>`;
const placeTitleHtml = (width, height) => `<h4 class="center">${cutButtonHtml()}${widthHeightHtml(width, height)}</h4>`;
const dropHtml = (width, height, edge, k) => `<div class="drop" data-k="${k}" style="width: ${100 - 200 * edge / width}%; aspect-ratio: ${width - 2 * edge} / ${height - 2 * edge}; left: ${100 * edge / width}%; top: ${100 * edge / width}%; background-color: var(--bg-header);"></div>`;
const placeBodyHtml = (width, height, edge, k) => `<div class="edge" style="width: ${100 * width / task.sheet.width}%; aspect-ratio: ${width} / ${height}; background-color: var(--bg-secondary);">${dropHtml(width, height, edge, k)}</div>`;
const placeHtml = (width, height, edge, k) => `<div class="place">${placeTitleHtml(width, height)}${placeBodyHtml(width, height, edge, k)}</div>`;

const setPlaces = () => {
    const states = [...task.scraps, task.sheet];
    dst.innerHTML = states.map((
        {
            width,
            height,
            edge
        }, k) => placeHtml(width, height, edge, k)).join('\n');
    dropStates = states.map(({width, height, edge}) => ({width: width - 2 * edge, height: height - 2 * edge}));
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
    window.removeEventListener('mousemove', toDragPiece);
    window.removeEventListener('touchmove', toDragPiece);
    window.removeEventListener('mouseup', dropDragPiece);
    window.removeEventListener('touchend', dropDragPiece);

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
    if (rect.width <= 0) return;

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
}

const addLeftDropPlace = () => {
    // console.log('addLeftDropPlace')
    const rect = {height: dropState.height - dragState.height - task.kerf};
    if (rect.height <= 0) return;

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

    dragPiece.onmousedown = dragPiece.ontouchstart = (e) => onMouseDown(e, dragDropPiece);
    dragPiece.onmouseup = dragPiece.ontouchend = (e) => {
        e.preventDefault();
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
    addLeftDropPlace();
    addRightDropPlace();
    addVerticalCutLine();
    addHorizontalCutLine();
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
    dragPiece.style.aspectRatio = `${r.width} / ${r.height}`;
    dragPiece.classList.add('drag');

    dragPiece.dataset.i = takePiece.dataset.i;
    decTakeCount(takePiece.dataset.i)

    dragPiece.dataset.j = dragStates.length.toString();
    dragStates.push({...takeState, cutDirection});

    dragPiece.style.width = r.width + 'px';
    dragPiece.style.left = r.left + 'px';
    dragPiece.style.top = r.top + 'px';
    dragPiece.style.backgroundColor = takeState.color;

    document.body.appendChild(dragPiece);
    if (selected !== dragPiece) toSelect(dragPiece);

    window.addEventListener('mousemove', toDragPiece);
    window.addEventListener('touchmove', toDragPiece);
    window.addEventListener('mouseup', dropDragPiece);
    window.addEventListener('touchend', dropDragPiece);
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

    document.body.appendChild(dragPiece);
    if (selected !== dragPiece) {
        toSelect(dragPiece);
        setCutDirectionButton(dragState.cutDirection);
    }

    window.addEventListener('mousemove', toDragPiece);
    window.addEventListener('touchmove', toDragPiece);
    window.addEventListener('mouseup', dropDragPiece);
    window.addEventListener('touchend', dropDragPiece);
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
    if (selected === takePiece) {
        rotateTakePiece();
    } else if (selected === dragPiece) {
        rotateDropPiece();
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

const onMouseDown = (e, f) => {
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
        if ((Math.abs(click.x - e.clientX) > MIN_DRAG || Math.abs(click.y - e.clientY) > MIN_DRAG)) {
            const {x, y, t, f} = click;
            click = null;
            f(x, y, t);
        }
    }
}

window.addEventListener('mouseup', endClick);
window.addEventListener('touchend', endClick);

window.addEventListener('mousemove', tryStartDrag);
window.addEventListener('touchmove', tryStartDrag);

// Автосохранение

let saveTimeout = null;
let abortController = null;


async function saveToServer(update) {
    if (abortController) abortController.abort();
    console.log('saveToServer:', update);

    abortController = new AbortController();
    const signal = abortController.signal;

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(update)
        });

        if (!response.ok) {
            console.error('saveToServer: HTTP', response.status);
            return false;
        }

        await response.json();
        return true;

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('saveToServer cancelled');
            return false;
        }
        console.error('saveToServer:', error);
        return false;

    } finally {
        if (abortController && abortController.signal === signal) {
            abortController = null;
        }
    }
}

async function _saveToServer(update) {
    if (abortController) abortController.abort();
    console.log('saveToServer:', update);

    abortController = new AbortController();
    const signal = abortController.signal;

    console.log(update);
    if (abortController && abortController.signal === signal) {
        abortController = null;
    }
}

const blurAutoSave = async (update) => {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
        saveTimeout = null;
    }
    await _saveToServer(update);
}


// Начальная загрузка

_getTasks()
    .then(cuttings => cuttings.forEach(addTask))
    .catch(error => console.error(error));



