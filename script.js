const DATA_URL = ""; // https://d5ds1trsppqs2rog97qd.cmxivbes.apigw.yandexcloud.net";
const ALGO_URL = "https://d5d313gii5f4ak4h4arg.wnq2w1o5.apigw.yandexcloud.net";

// Элементы

const htmlElement = document.documentElement;

// 1. Главная страница

const mainPage = document.getElementById("main");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

const createTaskButton = document.getElementById("create-task");
const tasksList = document.getElementById("tasks");

const changeThemeButton = document.getElementById("change-theme");
const moon = changeThemeButton.lastElementChild;
const sun = changeThemeButton.firstElementChild;

// 2. Навигация

const toMainButton = document.getElementById("to-main");
const toSettingButton = document.getElementById("to-setting");
const toCuttingButton = document.getElementById("to-cutting");

// 3. Настройки задачи раскроя

const settingPage = document.getElementById("setting");

const removeTaskButton = document.getElementById("remove-task");
const yesRemoveTaskButton = document.getElementById("yes-remove-task");
const noRemoveTaskButton = document.getElementById("no-remove-task");
const toRemoveTaskPage = document.getElementById("to-remove-task");

// 3.1 Задача

const taskForm = document.getElementById("task");
const updateTaskButton = document.getElementById("update-task");

const taskTitleInput = document.getElementById("task-title");
const taskMaterialInput = document.getElementById("task-material");
const taskThickInput = document.getElementById("task-thick");
const taskStartInput = document.getElementById("task-start");
const taskFinishInput = document.getElementById("task-finish");
const taskKerfInput = document.getElementById("task-kerf");

// 3.2 Лист

const sheetForm = document.getElementById("sheet");
const updateSheetButton = document.getElementById("update-sheet");

const sheetWidthInput = document.getElementById("sheet-width");
const sheetHeightInput = document.getElementById("sheet-height");
const sheetEdgeInput = document.getElementById("sheet-edge");
const sheetDepthInput = document.getElementById("sheet-depth");
const sheetRotatedInput = document.getElementById("sheet-rotated");

// 3.3 Обрезки

const scrapForm = document.getElementById("scrap");
const scrapsList = document.getElementById("scraps");

const addScrapButton = document.getElementById("add-scrap");
const createScrapButton = document.getElementById("create-scrap");
const deleteScrapButton = document.getElementById("delete-scrap");

const scrapWidthInput = document.getElementById("scrap-width");
const scrapHeightInput = document.getElementById("scrap-height");
const scrapEdgeInput = document.getElementById("scrap-edge");
const scrapCountInput = document.getElementById("scrap-count");

// 3.4 Кромки

const edgingForm = document.getElementById("edging");
const edgingsList = document.getElementById("edgings");

const addEdgingButton = document.getElementById("add-edging");
const createEdgingButton = document.getElementById("create-edging");
const deleteEdgingButton = document.getElementById("delete-edging");

const edgingLineInput = document.getElementById('edging-line');
const edgingTextInput = document.getElementById('edging-text');
const edgingThickInput = document.getElementById('edging-thick');

// 3.5 Рулоны

const rollForm = document.getElementById("roll");
const rollsList = document.getElementById("rolls");

const addRollButton = document.getElementById("add-roll");
const createRollButton = document.getElementById("create-roll");
const deleteRollButton = document.getElementById("delete-roll");

const rollEdgingInput = document.getElementById('roll-edging');
const rollInnerInput = document.getElementById('roll-inner');
const rollOuterInput = document.getElementById('roll-outer');

// 3.5 Детали

const pieceForm = document.getElementById("piece");
const piecesList = document.getElementById("pieces");

const addPieceButton = document.getElementById("add-piece");
const createPieceButton = document.getElementById("create-piece");
const deletePieceButton = document.getElementById("delete-piece");

const pieceWidthInput = document.getElementById('piece-width');
const pieceHeightInput = document.getElementById('piece-height');

const pieceRotatedInput = document.getElementById('piece-rotated');
const pieceCountInput = document.getElementById('piece-count');

const pieceTextInput = document.getElementById('piece-text');
const pieceExtraInput = document.getElementById('piece-extra');

const pieceEdgingUpInput = document.getElementById('piece-edging-up');
const pieceEdgingDownInput = document.getElementById('piece-edging-down');
const pieceEdgingLeftInput = document.getElementById('piece-edging-left');
const pieceEdgingRightInput = document.getElementById('piece-edging-right');

// 4. Редактор раскроя

const cuttingPage = document.getElementById("cutting");
const cutButton = document.getElementById("cut");
const doCutButton = document.getElementById("do-cut");

const clearButton = document.getElementById("clear");

const downloadCuttingButton = document.getElementById("download-cutting");

const dropArea = document.getElementById("drop");
const gutter = document.getElementById('gutter');
const takeArea = document.getElementById("take");

// 4.1 Управление

const cutDirectionButton = document.getElementById("cut-direction");
const rotatePieceButton = document.getElementById("rotate-piece");

// 5. Печать

const printPage = document.getElementById('print');

// Константы

// 1. Редактор

const edgingIcons = ['line', 'dash', 'wave'];
const edgingThicks = Array(edgingIcons.length).fill(null);

const defaultTask = {
    title: "",
    kerf: 4,
    sheet: {width: 2800, height: 2070, edge: null, depth: 16},
    scraps: [],
    rolls: [],
    edgings: [{line: 0, thick: 2}, {line: 1, thick: 0.4}],
    pieces: [],
};


const toDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split("-");
    return `${day}.${month}.${year}`;
}

const isOn = (inner, outer) => inner.left >= outer.left && inner.top >= outer.top && inner.left + inner.width <= outer.left + outer.width && inner.top + inner.height <= outer.top + outer.height;

const p = (value) => `${(100 * value).toFixed(3)}%`;
const d = (value) => `calc(var(--drop-width) * ${value}px)`;

// 2. HTML

const spriteHtml = (name) => `<use href="sprite.svg#${name}"></use>`;

const iconHtml = (icon, color = "gray") => `<svg class="icon ${color}">${spriteHtml(icon)}</svg>`;
const lineHtml = (line) => {
    const color = line === null ? "gray fade" : "yellow";
    line = line === null ? "line" : edgingIcons[line];
    return `<svg class="line ${color}">${spriteHtml(line)}</svg>`;
}

const valueHtml = (value, unit) => `<span class="unit"><span>${value || 0}</span><span class="fade">${unit}</span></span>`

const x = iconHtml('x');
const v = iconHtml('v');
const o = iconHtml('o');

const oHtml = (i) => `<svg class="icon" onclick="rotatePiece(${i})">${spriteHtml("o")}</svg>`;

// 3. PDF

const A4 = {
    width: 297, height: 210
}

const A = {
    width: A4.width - 90, height: A4.height - 40
}

// 4. Отладка

async function loadFake() {
    try {
        const response = await fetch('fake.json'); // путь к файлу
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        tasks = await response.json();
    } catch (error) {
        console.error("Can't load JSON:", error);
    }
}

// Состояние

// 1. Общее

let page = mainPage;

let tasks = [];
let task = null;

// 2. Параметры задачи

let form = null;
let link = null;
let item = null;

let items = null;
let links = null;
let index = null;

let deleted = null;
let created = null;

let edgingLine = null;
let sheetRotated = false;
let pieceRotated = false;
let pieceExtra = false;
let pieceEdging = {left: null, up: null, right: null, down: null};

// 3. Редактор раскроя

let colors = [];
let pieces = [];
let scraps = [];

// 4. Печать

let scalePdf;

// 5. Автоматический раскрой

let line;

const changePage = (p) => {
    console.log('changePage')
    if (page === p) return;
    page.classList.add("hidden");
    page = p;
    page.classList.remove("hidden");
}

// 1. Выбор задачи

toMainButton.onclick = () => {
    toSave();
    changePage(mainPage);
    document.title = 'Раскрой'
}

createTaskButton.onclick = async () => {
    await createTask();
    setTask();
    changePage(settingPage);

    addTask();
};

const toTask = async (e) => {
    e.preventDefault()

    changePage(settingPage);
    scrapsList.replaceChildren();
    edgingsList.replaceChildren();
    piecesList.replaceChildren();

    await loadTask(e.currentTarget.id);
    setTask();
}

// 1.1 Отображение данных


const addTask = () => {
    const q = document.createElement('li')
    q.innerText = getTaskTitle(task);
    q.id = task.id;
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
        tasks = t ? JSON.parse(t).filter(Boolean) : [];

        tasks.forEach((q, i) => q.id = i);
        tasks.forEach(q => q.rolls = q.rolls || []);
        // tasks = testTasks;

        tasks.forEach(q => {
            q.scraps = q.scraps.filter(Boolean);
            q.edgings = q.edgings.filter(Boolean);
            q.pieces = q.pieces.filter(Boolean);
        });
    }
};

// 1.3 Изменение темы

let dark;

const setTheme = () => {
    htmlElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    themeColorMeta.content = getComputedStyle(htmlElement).getPropertyValue('--bg-primary').trim()
}

const loadTheme = () => {
    const q = localStorage.getItem('dark');
    dark = q ? q === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme();
    if (dark) {
        moon.classList.remove('hidden');
    } else {
        sun.classList.remove('hidden');
    }
}

const saveTheme = () => {
    if (dark) {
        moon.classList.remove('hidden');
        sun.classList.add('hidden');
    } else {
        moon.classList.add('hidden');
        sun.classList.remove('hidden');
    }
    setTheme();
    localStorage.setItem('dark', dark);
}

changeThemeButton.onclick = () => {
    dark = !dark;
    saveTheme();
}

// 2. Настройки задачи раскроя

toSettingButton.onclick = () => changePage(settingPage);

let deleteButton;
let createButton;
let updateButton;

let clearForm;
let copyToForm;
let focusInput;

let update;
let updateItem;
let toHtml;

// 2.1 Отображение данных

const dateHtml = () => task.start || task.finish ? `<div><span>${toDate(task.start)}</span><span class="fade">${toDate(task.finish)}</span></div>` : '';

const materialHtml = () => `<div><span>${task.material || 'Материал'}</span><span>${valueHtml(task.kerf, 'мм')}</span></div>`;

const toSheetHtml = (
    {width, height, edge, depth}
) => `<div>${width}${x}${height}${v}${valueHtml(edge, 'мм')}</span><span></span>${valueHtml(depth, 'мм')}</div>`;

const toScrapHtml = (
    {width, height, edge, count}
) => `<div>${width}${x}${height}${v}${valueHtml(edge, 'мм')}<span></span>${valueHtml(count, 'шт')}</div>`;

const textHtml = (text) => `<div class="text">${text || ''}</div>`;
const toEdgingHtml = (
    {line, thick, text}
) => `<div>${lineHtml(line)}${textHtml(text)}${valueHtml(thick, 'мм')}</div>`;

const toRollHtml = (
    {line, inner, outer, length, thick}
) => `<div>${lineHtml(line)}${v}${valueHtml(`${inner} - ${outer}`, 'мм')}<span></span>${valueHtml((length / 1000).toFixed(2), 'м')}</div>`;

const toPieceHtml = ({width, height, rotated, edging, count, text, extra}) => {
    const {left, up, right, down} = edging;

    const w = `<div class="col"><span>${width}</span>${lineHtml(up)}${lineHtml(down)}</div>`;
    const h = `<div class="col"><span>${height}</span>${lineHtml(left)}${lineHtml(right)}</div>`;
    const e = extra ? iconHtml('save', 'green') : `<span></span>`;

    return `<div>${w}${rotated ? o : x}${h}${textHtml(text)}${e}${valueHtml(count, 'шт')}</div>`
}

const defaultClearForm = () => form && form.querySelectorAll('input,textarea').forEach(q => q.value = '')

// 2.2 Заполнение полей задачи

const getTaskTitle = ({title, material}) => title || material || '..';

const setTask = () => {
    taskTitleInput.value = task.title;
    document.title = getTaskTitle(task);

    sheetRotated = task.sheet.rotated;

    updateTaskButton.innerHTML = dateHtml() + materialHtml();
    updateSheetButton.innerHTML = toSheetHtml(task.sheet);

    task.scraps = task.scraps.filter(Boolean);
    task.edgings = task.edgings.filter(Boolean);
    task.rolls = task.rolls.filter(Boolean);
    task.pieces = task.pieces.filter(Boolean);

    task.edgings.forEach(({line, thick}) => (edgingThicks[line] = thick));

    scrapsList.innerHTML = task.scraps.map(
        (q, i) => `<li><button type="button" onclick="toEdit(event, ${i}, toScrapForm)">${toScrapHtml(q)}</button></li>`
    ).join('\n')
    edgingsList.innerHTML = task.edgings.map(
        (q, i) => `<li><button type="button" onclick="toEdit(event, ${i}, toEdgingForm)">${toEdgingHtml(q)}</button></li>`
    ).join('\n')
    rollsList.innerHTML = task.rolls.map(
        (q, i) => `<li><button type="button" onclick="toEdit(event, ${i}, toRollForm)">${toRollHtml(q)}</button></li>`
    ).join('\n')
    piecesList.innerHTML = task.pieces.map(
        (q, i) => `<li><button type="button" onclick="toEdit(event, ${i}, toPieceForm)">${toPieceHtml(q)}</button></li>`
    ).join('\n');

    copyTaskToForm();
    copySheetToForm();
}

taskTitleInput.onblur = () => {
    console.log('taskTitleInput.onblur')
    task.title = taskTitleInput.value;
    saveTask();
}

const toUpdate = (e, toForm) => {
    e.preventDefault();
    e.stopPropagation();

    toSave();
    toForm();

    updateButton.classList.add('hidden');
    form.classList.remove('hidden');
    focusInput.focus();
}

// 2.3 Обновление задачи

const copyTaskToForm = () => {
    taskStartInput.value = task.start || '';
    taskFinishInput.value = task.finish || '';
    taskMaterialInput.value = task.material || '';
    taskKerfInput.value = task.kerf == null ? '' : task.kerf;
}

const updateTask = () => {
    console.log('updateTask')
    task.start = taskStartInput.value;
    task.finish = taskFinishInput.value;
    task.material = taskMaterialInput.value;
    task.kerf = +taskKerfInput.value;

    updateTaskButton.innerHTML = dateHtml() + materialHtml();
}

updateTaskButton.onclick = (e) => toUpdate(e, toTaskForm);

const toTaskForm = () => {
    update = updateTask;
    updateButton = updateTaskButton;
    form = taskForm;
    focusInput = taskMaterialInput;
}

// 2.3 Обновление листа

const copySheetToForm = () => {
    sheetWidthInput.value = task.sheet.width;
    sheetHeightInput.value = task.sheet.height;
    sheetEdgeInput.value = task.sheet.edge;
    sheetDepthInput.value = task.sheet.depth || '';
    sheetRotatedInput.innerHTML = sheetRotated ? o : x;
}

sheetRotatedInput.onclick = (e) => {
    console.log('sheetRotatedInput')
    e.preventDefault();
    e.stopPropagation();
    sheetRotated = !sheetRotated;
    sheetRotatedInput.innerHTML = sheetRotated ? o : x;
}

const updateSheet = () => {
    console.log('updateSheet')
    task.sheet = {
        width: +sheetWidthInput.value,
        height: +sheetHeightInput.value,
        edge: +sheetEdgeInput.value,
        depth: +sheetDepthInput.value
    }
    updateSheetButton.innerHTML = toSheetHtml(task.sheet);
}

taskForm.onclick = sheetForm.onclick = (e) => e.stopPropagation();
updateSheetButton.onclick = (e) => toUpdate(e, toSheetForm);


const toSheetForm = () => {
    update = updateSheet;
    updateButton = updateSheetButton;
    form = sheetForm;
    focusInput = sheetWidthInput;
}


// 2.3 Добавление и обновление обрезка

const copyScrapToForm = ({width, height, edge, count}) => {
    console.log('copyScrapToForm')
    scrapWidthInput.value = width;
    scrapHeightInput.value = height;
    scrapEdgeInput.value = edge;
    scrapCountInput.value = count;
}

const updateScrapItem = () => {
    const width = +scrapWidthInput.value;
    const height = +scrapHeightInput.value;
    const count = scrapCountInput.value ? +scrapCountInput.value : 1;
    const edge = +scrapEdgeInput.value;

    items[index] = !width || !height ? null : {width, height, edge, count};
}

const toScrapForm = () => {
    form = scrapForm;
    deleteButton = deleteScrapButton;
    createButton = createScrapButton;
    copyToForm = copyScrapToForm;
    focusInput = pieceWidthInput;
    updateItem = updateScrapItem;
    clearForm = clearScrapForm;
    toHtml = toScrapHtml;
    links = scrapsList;
    items = task.scraps;
}

// 2.4 Добавление и обновление кромки

const copyEdgingToForm = ({line, thick, text}) => {
    console.log('copyEdgingToForm')

    edgingLine = line;
    edgingLineInput.innerHTML = lineHtml(line);

    edgingThickInput.value = thick;
    edgingTextInput.value = text || '';

    edgingThicks[line] = null;
}

const toEdgingForm = () => {
    form = edgingForm;
    deleteButton = deleteEdgingButton;
    createButton = createEdgingButton;
    copyToForm = copyEdgingToForm;
    focusInput = edgingThickInput;
    updateItem = updateEdgingItem;
    clearForm = clearEdgingForm;
    toHtml = toEdgingHtml;
    links = edgingsList;
    items = task.edgings;
}

const updateEdgingItem = () => {
    console.log('updateEdgingItem')
    if (edgingLine == null) return;
    const thick = edgingThickInput.value ? +edgingThickInput.value : null;

    items[index] = thick ? {
        thick,
        line: edgingLine,
        text: edgingTextInput.value
    } : null;

    edgingThicks[edgingLine] = thick;
    updateRolls();
}

const updateRolls = () => {
    task.rolls.forEach((q, i) => {
        if (!q) return;

        const thick = edgingThicks[q.line];
        if (thick) {
            q.length = getRollLength(q.inner, q.outer, thick);
            rollsList.children[i].firstChild.innerHTML = toRollHtml(q);
        } else {
            task.rolls[i] = null;
            rollsList.children[i].classList.add('hidden');
        }
    });
}

// 2.4 Добавление и обновление рулона

const toRollForm = () => {
    form = rollForm;
    deleteButton = deleteRollButton;
    createButton = createRollButton;
    copyToForm = copyRollToForm;
    focusInput = rollInnerInput;
    updateItem = updateRollItem;
    clearForm = clearRollForm;
    toHtml = toRollHtml;
    links = rollsList;
    items = task.rolls;
}

const copyRollToForm = ({line, inner, outer}) => {
    console.log('copyRollToForm')

    edgingLine = line;
    rollEdgingInput.innerHTML = lineHtml(line);

    rollInnerInput.value = inner;
    rollOuterInput.value = outer;
}

const updateRollItem = () => {
    let inner = +rollInnerInput.value;
    let outer = +rollOuterInput.value;
    if (inner > outer) [outer, inner] = [inner, outer];

    const thick = edgingThicks[edgingLine];

    items[index] = !inner || !outer || !thick ? null : {
        inner, outer, line: edgingLine, length: getRollLength(inner, outer, thick)
    };
}

// 2.5 Добавление и обновление детали

const copyPieceToForm = ({width, height, rotated, count, edging, text, extra}) => {
    console.log('copyPieceToForm');
    pieceWidthInput.value = width;
    pieceHeightInput.value = height;

    pieceRotated = rotated;
    pieceRotatedInput.innerHTML = pieceRotated ? o : x;

    pieceExtra = extra;
    pieceExtraInput.innerHTML = iconHtml(pieceExtra ? 'save' : 'cancel');
    pieceTextInput.value = text || '';

    pieceCountInput.value = count;

    pieceEdging = edging;
    pieceEdgingUpInput.innerHTML = lineHtml(edging.up);
    pieceEdgingDownInput.innerHTML = lineHtml(edging.down);
    pieceEdgingLeftInput.innerHTML = lineHtml(edging.left);
    pieceEdgingRightInput.innerHTML = lineHtml(edging.right);
}

const toPieceForm = () => {
    form = pieceForm;
    deleteButton = deletePieceButton;
    createButton = createPieceButton;
    copyToForm = copyPieceToForm;
    focusInput = pieceWidthInput;
    updateItem = updatePieceItem;
    clearForm = clearPieceForm;
    toHtml = toPieceHtml;
    links = piecesList;
    items = task.pieces;
}

const updatePieceItem = () => {
    console.log('updatePieceItem');
    const width = +pieceWidthInput.value;
    const height = +pieceHeightInput.value;
    const count = +pieceCountInput.value || 1;

    items[index] = !width || !height ? null : {
        width, height, count,
        rotated: pieceRotated,
        edging: pieceEdging,
        text: pieceTextInput.value,
        extra: pieceExtra
    };
}

// 2.7 Управление задачей

removeTaskButton.onclick = () => {
    if (!task) return;

    if (task.pieces.some(Boolean) || task.scraps.some(Boolean)) {
        toRemoveTaskPage.children[2].innerText = getTaskTitle(task);
        toRemoveTaskPage.classList.remove('hidden');
    } else {
        removeTask();
    }
}

yesRemoveTaskButton.onclick = () => {
    toRemoveTaskPage.classList.add('hidden');
    removeTask();
}

noRemoveTaskButton.onclick = () => toRemoveTaskPage.classList.add('hidden');

// 2.8 Навигация по форме

const toCreateButton = () => {
    createButton.classList.add('hidden');
    deleteButton.innerText = 'Создать';
    deleteButton.style.color = 'var(--green)';
}

const toDeleteButton = () => {
    deleteButton.innerText = 'Очистить';
    deleteButton.style.color = 'var(--red)';
}

const updateLink = () => {
    console.log('updateLink');
    if (items[index]) {
        links.children[index].firstChild.innerHTML = toHtml(items[index]);
        links.children[index].classList.remove('hidden');
    }
}

const createItem = () => {
    index = items.length;
    items.push(null);
}

const createLink = (i, f) => {
    link = document.createElement('LI');
    link.classList.add('hidden');
    link.innerHTML = `<button type="button"></button>`
    link.firstElementChild.onclick = (e) => toEdit(e, i, f);
}

const toSave = () => {
    if (!form) return;
    console.log('toSave');

    if (form === taskForm || form === sheetForm) {
        update();
        updateButton.classList.remove('hidden');
        form.classList.add('hidden');
    } else {
        createButton.classList.remove('hidden');
        updateItem();
        updateLink();
        form.remove();
    }
    saveTask();
    form = null;
}

const toDelete = (e) => {
    if (created) {
        createButton.onclick(e);
        return;
    }
    e.preventDefault();
    e.stopPropagation();

    deleted = !deleted;

    if (deleted) {
        defaultClearForm();
        clearForm && clearForm();
        deleteButton.innerText = 'Как было';
    } else {
        copyToForm(items[index]);
        deleteButton.innerText = 'Очистить';
    }
}

const toEdit = (e, i, f) => {
    console.log('toEdit')
    e.stopPropagation();
    toSave();

    created = deleted = false;
    f();
    toDeleteButton();

    link = links.children[i];
    item = items[i];
    index = i;

    copyToForm(item);
    link.after(form);
    link.classList.add('hidden');

    // focusInput.focus();
}

const toCreate = (e, toForm) => {
    e.preventDefault();
    e.stopPropagation();

    toSave();
    toForm();

    created = true;
    toCreateButton();
    defaultClearForm();
    clearForm();

    createItem();
    createLink(index, toForm);

    links.append(link);
    links.append(form);

    focusInput.focus();

    form.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// 2.9 Кнопки создания

createScrapButton.onclick = addScrapButton.onclick = (e) => toCreate(e, toScrapForm);
createEdgingButton.onclick = addEdgingButton.onclick = (e) => toCreate(e, toEdgingForm);
createRollButton.onclick = addRollButton.onclick = (e) => toCreate(e, toRollForm);
createPieceButton.onclick = addPieceButton.onclick = (e) => toCreate(e, toPieceForm);

settingPage.addEventListener('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.tagName === 'SPAN') toSave();
});

settingPage.addEventListener('keydown', function (e) {
    e.stopPropagation();
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') toSave();
});

// 2.9 Клик по инпуту

let lastTapTime = 0;
let tapStart;

function handleDoubleClick(e) {
    const t = e.target.tagName;
    if (t !== 'INPUT' && t !== 'TEXTAREA') return;
    e.preventDefault();
    e.target.select();
}

function handleTouchStart(e) {
    const touch = e.touches[0];
    if (touch) tapStart = {x: touch.clientX, y: touch.clientY};
}

function handleTouchEnd(e) {
    if (!tapStart) return;

    const tag = e.target.tagName;
    if (tag !== 'INPUT' && tag !== 'TEXTAREA') return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const dx = Math.abs(touch.clientX - tapStart.x);
    const dy = Math.abs(touch.clientY - tapStart.y);
    if (dx > 10 || dy > 10) return;

    const now = Date.now();
    if (now - lastTapTime < 300 && now - lastTapTime > 0) {
        e.preventDefault();
        e.target.select();
    }
    lastTapTime = now;
}

document.addEventListener('dblclick', handleDoubleClick);
document.addEventListener('touchstart', handleTouchStart, {passive: true});
document.addEventListener('touchend', handleTouchEnd, {passive: false});

// 2.9 Переключение между формами

const toCreateItem = () => {
    created = true;
    index = items.length;
    items.push(null);
}

// 2.10 Отправка и получение данных

const loadTask = async (id) => {
    if (DATA_URL) {
        const url = new URL(DATA_URL);
        url.searchParams.set("task_id", id)
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        task = await response.json();
    } else {
        task = tasks[id];
    }
}

const saveTask = async () => {
    console.log('saveTask');
    if (DATA_URL) {
        const url = new URL(DATA_URL);
        url.searchParams.set("task", JSON.stringify(task))
        await fetch(url);
    } else {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    const title = getTaskTitle(task);
    if (title !== document.title) {
        document.getElementById(task.id).innerText = document.title = title;
    }

}

const removeTask = async () => {
    document.getElementById(task.id).remove();
    changePage(mainPage);
    if (DATA_URL) {
        const url = new URL(DATA_URL);
        url.searchParams.set("task_id", '-' + task.id)
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } else {
        tasks[task.id] = null;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    task = form = null;
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
        task.start = new Date().toISOString().slice(0, 10);
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// 2.10 Изменения настроек

rollEdgingInput.onclick = (e) => {
    e.preventDefault();
    edgingLine = getNextLine(true);
    rollEdgingInput.innerHTML = lineHtml(edgingLine);
}

edgingLineInput.onclick = (e) => {
    e.preventDefault();
    edgingLine = getNextLine(false);
    edgingLineInput.innerHTML = lineHtml(edgingLine);
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
    pieceRotatedInput.innerHTML = pieceRotated ? o : x;
}

pieceExtraInput.onclick = (e) => {
    e.preventDefault();
    pieceExtra = !pieceExtra;
    pieceExtraInput.innerHTML = iconHtml(pieceExtra ? 'save' : 'cancel');
}

// 2.11 Работа с кромками

const getNextLine = (used) => {
    let i = (edgingLine + 1) % edgingIcons.length;
    let n = 0;
    while (used === (edgingThicks[i] == null)) {
        i = (i + 1) % edgingIcons.length;
        n++;
        if (n === edgingIcons.length) return null;
    }
    return i;
}

const getNextEdgingLine = (line) => {
    let i = line == null ? 0 : line + 1;
    while (i < edgingIcons.length && edgingThicks[i] == null) i++;
    return i < edgingIcons.length ? i : null;
}

// 2.11 Очистка форм

const clearEdgingForm = () => {
    edgingLine = getNextLine(false);
    edgingLineInput.innerHTML = lineHtml(edgingLine);
}

const clearRollForm = () => {
    edgingLine = getNextLine(true);
    rollEdgingInput.innerHTML = lineHtml(edgingLine);
}
const clearScrapForm = () => {
    scrapEdgeInput.value = task.sheet.edge || '';
}

const clearPieceForm = () => {
    console.log('clearPieceForm')
    pieceRotated = sheetRotated;
    pieceExtra = false;
    pieceRotatedInput.innerHTML = iconHtml(pieceRotated ? 'o' : 'x');
    pieceExtraInput.innerHTML = iconHtml(pieceExtra ? 'save' : 'cancel');

    pieceEdging = {left: null, up: null, right: null, down: null};
    pieceEdgingUpInput.innerHTML = pieceEdgingDownInput.innerHTML = pieceEdgingLeftInput.innerHTML = pieceEdgingRightInput.innerHTML = lineHtml(null);
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
let cutDirection = true;

let zones = [];
let takes = [];

// 3.3. Отображение деталей

const observer = new ResizeObserver(() => {
    if (page === cuttingPage) {
        const width = dropArea.firstElementChild.getBoundingClientRect().width - 20;
        htmlElement.style.setProperty('--drop-width', width.toString());
    }
});

observer.observe(dropArea);

// 3.3. Отображение деталей

const widthHeightHtml = (width, height, rotated, i) => `${width}${rotated ? oHtml(i) : x}${height}`

const getColors = n => [...Array(n)].map((_, i) => `hsl(${i / n * 360}, var(--saturation), var(--lightness))`);

const takeSizesHtml = (width, height, rotated, i) => `<button class="sizes">${widthHeightHtml(width, height, rotated, i)}</button>`;
const takePieceHtml = (width, height, i) => `<div class="piece" style="width: ${d(width / task.width)}; aspect-ratio: ${width} / ${height}; background-color: ${colors[i]}" data-i="${i}"></div>`;
const takeCountHtml = (count) => `${valueHtml(count, 'шт')}`;

const takeHtml = (width, height, rotated, count, i) => `<div class="take">
    ${takeCountHtml(count)}
    ${takePieceHtml(width, height, i)}
    ${takeSizesHtml(width, height, rotated, i)}
</div>`;

const onTakeUp = (e, i) => {
    e.preventDefault();
    console.log('onTakeUp')
    if (!down) return;
    take = takes[i];
    toSelect(take);
}

const onTakeDown = (e) => {
    console.log('onTakeDown')
    e.currentTarget.releasePointerCapture(e.pointerId);
    onPointerDown(e, dragTake);
}

const setTakes = () => {
    takes = pieces.map(({width, height, rotated, count}) => ({
        width, height, rotated, count
    }));

    takeArea.innerHTML = takes.map(
        ({width, height, rotated, count}, i) => takeHtml(width, height, rotated, count, i)).join('');

    takeArea.childNodes.forEach((q, i) => {
        q = q.children[1];

        q.onpointerup = (e) => onTakeUp(e, i);
        q.onpointercancel = (e) => onTakeUp(e, i);
        q.onpointerdown = onTakeDown;
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
    q.style.width = p(zone.width / task.width);
    q.style.aspectRatio = `${zone.width} / ${zone.height}`;
    area.appendChild(q);

    dropArea.appendChild(area);
}

const createDrop = (drop) => {
    console.log('createDrop')

    const q = drop.html = document.createElement('DIV');
    q.classList.add('drop');

    q.dataset.i = zone.drops.length.toString();
    zone.drops.push(drop);

    q.style.left = p(drop.left / zone.width);
    q.style.top = p(drop.top / zone.height);

    q.style.width = p(drop.width / zone.width);
    q.style.height = p(drop.height / zone.height);

    q.onpointerup = dropDrag;
    q.onpointercancel = dropDrag;

    if (drop.busy === false) zone.html.appendChild(q);
    q.innerHTML = sizeHtml(drop.width, drop.height, drop.width * scaleHtml, drop.height * scaleHtml);
}

const createDrag = (drag) => {
    console.log('createDrag')

    const q = drag.html = document.createElement('DIV');
    drag.toLeft = drag.toTop = true;

    setTake(drag);
    drag.drop = zone.drops.length;

    q.dataset.i = zone.drags.length.toString();
    zone.drags.push(drag);

    q.style.position = 'relative';
    q.style.cursor = 'grab';
    q.style.zIndex = '9999';
    q.style.left = p(drag.left / zone.width);
    q.style.top = p(drag.top / zone.height);
    q.style.width = p(drag.width / zone.width);
    q.style.aspectRatio = `${drag.width} / ${drag.height}`;
    q.style.position = 'absolute';
    q.style.backgroundColor = colors[drag.take]
    q.style.pointerEvents = 'auto';
    q.style.touchAction = 'none';

    q.onpointerdown = (e) => onPointerDown(e, dragDrop);
    q.onpointerup = onDragClick;
    q.onpointercancel = onDragClick;

    zone.html.appendChild(q);
}


// 3.5 Оценка количества зон

const dropJson = (width, height, edge) => ({
    left: edge, top: edge, width: width - 2 * edge, height: height - 2 * edge, busy: false
});

const zoneJson = ({width, height, edge}, i = -1) => ({
    width,
    height,
    i,
    drops: [dropJson(width, height, edge || 0)],
    drags: []
});

const getDrops = () => {
    const dst = scraps.map(({width, height, edge, count}) => Array(count).fill({
        width: width - 2 * edge + task.kerf, height: height - 2 * edge + task.kerf
    }));
    return dst.sort((a, b) => b.width + b.height - a.width - a.height);
}

const sheetJson = () => {
    const {width, height, edge} = task.sheet;
    const e = edge || 0;
    return {
        width: width - 2 * e + task.kerf, height: height - 2 * e + task.kerf
    };
}

const getTakes = () => {
    const dst = pieces.map(({width, height, rotated, count}) => ({width, height, rotated, count}))
    return dst.sort((a, b) => b.width + b.height - a.width - a.height || a.rotated - b.rotated)
}

const getZones = () => {
    const dst = scraps.map(zoneJson);

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

let scaleHtml;

const setZones = () => {
    console.log('setZones');
    zones = getZones();

    dropArea.replaceChildren()
    zones.forEach(createZone);
    scaleHtml = getScaleHtml();

    for (zone of zones) createDrop(zone.drops.pop());
}

// 3.6 Отображение страницы

const setTaskSize = () => {
    task.width = task.sheet.width;
    task.height = task.sheet.height;
    task.scraps.filter(Boolean).forEach(({width, height}) => {
        if (width > task.width) task.width = width;
        if (height > task.height) task.height = height;
    });
}

const toScraps = () => task.scraps.filter(Boolean).flatMap(q => Array(q.count).fill(q));

const clearCutting = () => {
    toSelect(null);
    setTaskSize();

    pieces = task.pieces.filter(Boolean);
    colors = getColors(pieces.length);
    scraps = toScraps();

    setTakes();
    setZones();

    doCutButton.classList.add('hidden');
}

const overlayScreen = document.getElementById('overlay');

const toOverlayCut = () => {
    overlayScreen.style.display = 'flex';

    const takes = takesRect();
    const drops = dropsRect();

    setTimeout(() => {
        toCut(drops, takes);
        overlayScreen.style.display = 'none';
    }, 0);
}

toCuttingButton.onclick = toCuttingButton.nextElementSibling.onclick = () => {
    toSave();
    clearCutting();

    if (pieces.length && (task.scraps.some(Boolean) || (task.sheet.width && task.sheet.height))) {
        changePage(cuttingPage);
        toOverlayCut();
    } else {
        toCuttingButton.firstElementChild.classList.remove('yellow');
        setTimeout(() => toCuttingButton.firstElementChild.classList.add('yellow'), 3000);
    }
}

// 3.7 Начало перетаскивания

const startMove = (x, y, left, top) => {
    move = {x, y, dx: left - x, dy: top - y};

    window.addEventListener('pointermove', toDrag);
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointercancel', stopDrag);
}

const endMove = () => {
    move = null;

    window.removeEventListener('pointermove', toDrag);
    window.removeEventListener('pointerup', stopDrag);
    window.removeEventListener('pointercancel', stopDrag);
}

const stopDrag = (e) => {
    if (!move) return;
    e.preventDefault();
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
    q.style.touchAction = 'none';
    q.style.backgroundColor = colors[i];

    cuttingPage.appendChild(q);

    drag = {
        take: i, html: q, width: take.width, height: take.height, rotated: take.rotated, cutDirection
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

    clearDrop();

    const {left, top, width} = t.getBoundingClientRect();

    const q = drag.html;
    q.style.width = width + 'px';
    q.style.left = left + 'px';
    q.style.top = top + 'px';
    q.style.cursor = 'grabbing';
    q.style.pointerEvents = 'none';
    q.style.touchAction = 'none';

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

// 3.7 Отображение размеров

const getScaleHtml = () => Math.min(700, window.innerWidth) / task.width;

const widthHtml = (width, w, h, fontSize) => {
    fontSize = Math.min(fontSize, w / width.toString().length, (h - 2) / 1.2);
    return fontSize > 8 ? `<div class="width" style="font-size: ${fontSize}px">${width}</div>` : '';
}

const heightHtml = (height, h, w, fontSize) => {
    fontSize = Math.min(fontSize, h / height.toString().length, (w - 2) / 1.2);
    return fontSize > 8 ? `<div class="height" style="font-size: ${fontSize}px">${height}</div>` : '';
}

const sizeHtml = (width, height, w, h) => {
    const fontSize = Math.min(16, (w + h - 4) / (width.toString().length + height.toString().length + 2));
    return widthHtml(width, w, h, fontSize) + heightHtml(height, h, w, fontSize);
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
    q.onpointercancel = dropDrag;
    zone.html.appendChild(q);

    q.innerHTML = sizeHtml(drop.width, drop.height, drop.width * scaleHtml, drop.height * scaleHtml);
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
    q.style.touchAction = 'none';

    q.onpointerdown = (e) => onPointerDown(e, dragDrop);
    q.onpointerup = onDragClick;
    q.onpointercancel = onDragClick;

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
    drag.toLeft = true; // x - r.left <= r.right - x;
    drag.toTop = true; // y - r.top <= r.bottom - y;
}

const dropDrag = (e) => {
    if (!move) return;
    console.log('dropDrag')

    e.preventDefault();
    e.stopPropagation();

    endMove();

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
    drag.html.style.width = '1px';
    drag.html.style.aspectRatio = `${drag.width} / ${drag.height}`;
}

const rotateTake = () => take.rotated && toRotateTake();

const toRotateTake = () => {
    console.log('toRotateTake');
    [take.width, take.height] = [take.height, take.width];
    take.html.style.width = d(take.width / task.width);
    take.html.style.aspectRatio = `${take.width} / ${take.height}`;
}

const rotatePiece = (i) => {
    console.log('rotatePiece');

    take = takes[i];
    if (selected !== take) toSelect(take);
    toRotateTake();
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
    const q = cutDirectionButton.firstElementChild;
    if (selected && selected === drag ? drag.cutDirection : cutDirection) {
        q.classList.remove('rotated');
    } else {
        q.classList.add('rotated');
    }
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
        take.html.parentElement.classList.remove('hidden');
    }
    take.count++;
    take.html.parentElement.firstElementChild.firstChild.innerText = take.count;

    doCutButton.classList.add('hidden');
}

const decTakeCount = (take) => {
    console.log('decTakeCount')
    take.count--;
    if (take.count === 0) {
        take.html.parentElement.classList.add('hidden');
    }
    take.html.parentElement.firstElementChild.firstChild.innerText = take.count;
}

const clearDrop = () => {
    console.log('clearDrop');
    toSelect(null);

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
    const q = drag.html;
    drag.html = null;
    drag = {...drag, html: q};
    toSelect(drag);
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
    if (!down) return;
    console.log('tryStartDrag');
    e.preventDefault();
    if (isDrag(e)) {
        const {x, y, t, f} = down;
        down = null;
        f(x, y, t);
    }
}

window.addEventListener('pointerup', endClick);
window.addEventListener('pointercancel', endClick);
window.addEventListener('pointermove', tryStartDrag);

// 3.12 Разделитель

let start = null;

function onDragStart(e) {
    e.preventDefault();
    gutter.classList.add('active');
    start = {
        y: e.clientY,
        height: takeArea.getBoundingClientRect().height
    }
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
}

function onDragMove(e) {
    if (start) {
        e.preventDefault();
        const height = Math.max(start.height + start.y - e.clientY, 40);
        cuttingPage.style.gridTemplateRows = `1fr 6px ${height}px`;
    }
}

function onDragEnd(e) {
    if (start) {
        e.preventDefault();
        start = null;
        gutter.classList.remove('active');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }
}

gutter.addEventListener('pointerdown', onDragStart);
document.addEventListener('pointermove', onDragMove);
document.addEventListener('pointerup', onDragEnd);
document.addEventListener('pointercancel', onDragEnd);

// 4. Печать

// 4.1 Вычисление статистики

const valuePdf = (value, unit) => `<span class="just">${value} <span class="fade">${unit}</span></span>`

const edgingLengths = Array(edgingIcons.length).fill(0);

let cutsLength;
let piecesArea;
let scrapsArea;
let piecesCount;

const calc = () => {
    edgingLengths.fill(0);
    piecesArea = 0;
    piecesCount = 0;

    takes.forEach(({width, height, count}, i) => {
        count = pieces[i].count - count;
        if (!count) return;
        const {up, down, left, right} = pieces[i].edging;

        if (up != null) edgingLengths[up] += count * width;
        if (down != null) edgingLengths[down] += count * width;
        if (left != null) edgingLengths[left] += count * height;
        if (right != null) edgingLengths[right] += count * height;

        piecesArea += count * width * height;
        piecesCount += count;
    });

    cutsLength = 0;
    scrapsArea = 0;
    getCuts().forEach(({width, height, drags, drops}) => {
        scrapsArea += width * height;
        drags.forEach(({html, width, height}) => html && html.isConnected && (cutsLength += width + height));
        drops.forEach(({html, width, height}) => html && html.isConnected && (cutsLength += width + height));
    });
}

const statisticsPdf = () => {
    return `<table class="whole">
    <thead><tr><th>Деталей</th><th>Площадь деталей</th><th>Площадь листов</th><th>Длина реза</th></tr></thead>
    <tbody><td>${valuePdf(piecesCount, 'шт')}</td>
    <td>${valuePdf((piecesArea / 1000000).toFixed(2), 'м²')}</td>
    <td>${valuePdf((scrapsArea / 1000000).toFixed(2), 'м²')}</td>
    <td>${valuePdf((cutsLength / 1000).toFixed(2), 'м')}</td></tbody>`
}

// 4.1. Загрузка

const cuttingsPdf = () => getCuts().map(toScale).map(
    ({w, h, drops, drags}) => `<div class="page">${cuttingPdf(w, h, drops, drags)}${takesPdf(drags)}</div>`
).join('\n');

const getScalePdf = () => Math.min(A.width / task.width, A.height / task.height);

const scrapsPdf = () => {
    const scraps = toCount(getCuts()).map(([i, count]) => {
        const q = i < 0 ? task.sheet : task.scraps[i];
        return {...q, count};
    }).map(scrapPdf).join('\n')

    return scraps && `<table class="whole">
    <thead><tr><th>Длина</th><th>Ширина</th><th>Отступ</th><th>Кол-во</th><th>Лист</th></tr></thead>
    <tbody>${scraps}</tbody></table>`;
}

const edgingsPdf = () => {
    const edgings = task.edgings.filter(q => q && edgingLengths[q.line]).map(edgingPdf).join('\n');

    return edgings && `<table class="whole">
    <thead><tr><th>Линия</th><th>Толщина</th><th>Длина</th><th>Кромка</th></tr></thead>
    <tbody>${edgings}</tbody></table>`;
}

const rollsPdf = () => {
    const rolls = task.rolls.filter(Boolean).map(rollPdf).join('\n');

    return rolls && `<table class="whole">
    <thead><tr><th>Кромка</th><th>Внутри</th><th>Снаружи</th><th>Длина</th><th>Рулон</th></tr></thead>
    <tbody>${rolls}</tbody></table>`;
}

const piecesPdf = () => {
    const t = pieces.map(piecePdf).join('\n');

    return t && `<table>
    <thead><tr><th>#</th><th>Длина</th><th>Ширина</th><th>Кол-во</th>
    <th>Пов-от</th><th>Деталь</th><th>Доп.об.</th></tr></thead>
    <tbody>${t}</tbody></table>`;
}

const getLogo = () => `<div class="logo">
    <svg viewBox="0 0 24 24">
        <rect x="14" y="14" width="8" height="8" rx="2" ry="2" fill="#4aaf8c"/>
        <rect x="14" y="2" width="8" height="9" rx="2" ry="2" fill="#7a82da"/>
        <rect x="2" y="2" width="9" height="7" rx="2" ry="2" fill="#c97b72"/>
        <rect x="2" y="12" width="9" height="10" rx="2" ry="2" fill="#c9a84c"/>
    </svg>
    <span>whCut</span>
</div>`;

const getSigns = () => `<div class="task">
    <div class="signs">
        <div class="sign"><span>Заказ:</span><span>${task.title || ''}</span></div>
        <div class="sign"><span>Начало:</span><span>${toDate(task.start)}</span></div>
        <div class="sign"><span>Завершение:</span><span>${toDate(task.finish)}</span></div>
        <div style="width: 2cm"></div>
    </div>
    <div class="signs">
        <div class="sign"><span>Материал:</span>${task.material || ''}<span id="material"></span></div>
        <div class="sign"><span>Толщина:</span><span>${task.sheet.depth || ''} мм</span></div>
    </div>
</div>`


downloadCuttingButton.onclick = () => {
    calc();
    scalePdf = getScalePdf();
    printPage.innerHTML = getSigns() + getLogo() + statisticsPdf() + scrapsPdf() + edgingsPdf() + rollsPdf() + piecesPdf() + cuttingsPdf();
    window.print();
}

// 4.2 Постановка задачи

const lines = [
    '<line stroke="var(--yellow-min)" x1="2" y1="3" x2="58" y2="3"/>',
    '<line stroke="var(--yellow-min)" x1="2" y1="3" x2="58" y2="3" stroke-dasharray="8 8"/>',
    '<path stroke="var(--yellow-min)" d="M 2 3 Q 5 2, 7 2 Q 10 2, 12 3 Q 14 4, 17 4 Q 20 4, 22 3 Q 25 2, 27 2 Q 30 2, 32 3 Q 35 4, 37 4 Q 40 4, 42 3 Q 45 2, 47 2 Q 50 2, 52 3 Q 55 4, 57 4 L 58 4"/>'
];

const linePdf = (line) => line == null ? '' : `<svg class="line" viewBox="0 0 60 5">${lines[line]}</svg>`;

const flagPdf = (flag) => flag ? '<svg viewBox="0 0 24 24"><path stroke="var(--green-min)" stroke-width="3" d="M2 12L10 20L22 2"/></svg>' : '';

const whPdf = (width, height, {left, right, up, down}) => {
    const w = `<div class="col"><span>${width}</span>${linePdf(up)}${linePdf(down)}</div>`;
    const h = `<div class="col"><span>${height}</span>${linePdf(left)}${linePdf(right)}</div>`;
    return `<td>${w}</td><td>${h}</td>`
}

const countPdf = (count, i) => takes[i].count ? `<td style="white-space: nowrap; color: var(--red-min)">${count - takes[i].count} | ${takes[i].count}</td>` : `<td>${count}</td>`;

const piecePdf = ({width, height, count, rotated, text, extra, edging}, i) => `<tr>
    <td>${i + 1}</td>
    ${whPdf(width, height, edging)}
    ${countPdf(count, i)}
    <td>${flagPdf(rotated)}</td>
    <td class="name">${text || ""}</td>
    <td>${flagPdf(extra)}</td>
</tr>`;

const edgingPdf = ({line, thick, text, length}, i) => `<tr>
    <td>${linePdf(line)}</td>
    <td>${thick}</td>
    <td class="data">${valuePdf((edgingLengths[line] / 1000).toFixed(1), 'м')}</td>
    <td class="name">${text || ""}</td>
</tr>`;

const rollPdf = ({line, inner, outer, length}) => `<tr>
    <td>${linePdf(line)}</td>
    <td>${inner}</td>
    <td>${outer}</td>
    <td class="data">${valuePdf((length / 1000).toFixed(1), 'м')}</td>
    <td class="name"></td>
</tr>`;

const scrapPdf = ({width, height, edge, count, text}) => `<tr>
    <td>${width}</td>
    <td>${height}</td>
    <td>${edge || 0}</td>
    <td>${count}</td>
    <td class="name">${text || ""}</td>
</tr>`;

// 4.3 Раскрой

const getRectStyle = (left, top, width, height) => `left: ${left}mm;top: ${top}mm;width: ${width}mm;height: ${height}mm;`;
const getSizeStyle = (width, height) => `width: ${width}mm;height: ${height}mm;`;

const backPdf = (style, zIndex) => `<div class="back" style="${style};z-index: ${zIndex}"></div>`

const zonePdf = (style, tape, drags, drops) => `<div class="base">${tape}${drags}${drops}</div>`
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
    w = Math.floor(w)
    h = Math.floor(h)
    // for (let y = -w; y <= h; y += 5) {
    //     lines.push(`<line x1=0 y1=${y} x2=${w} y2=${y + w}></line>`)
    // }
    for (let y = 0; y <= h; y += 5) {
        lines.push(`<line x1=0 y1=${y} x2=${h - y} y2=${h}></line>`)
    }
    for (let x = 5; x <= w; x += 5) {
        lines.push(`<line x1=${x} y1=0 x2=${w} y2=${w - x}></line>`)
    }
    return `<svg class="tape" viewBox="0 0 ${w} ${h}">${lines.join('\n')}</svg>`
}

const dragsPdf = (drags) => drags.map(({l, t, w, h, width, height, i}) => {
    const style = getRectStyle(l, t, w, h);
    return dragPdf(style, sizePdf(width, height, w, h), indexPdf(i, w, h)) + backPdf(style, 3);
}).join('\n');

const dropsPdf = (places) => places.map(({l, t, w, h, width, height}) => {
    if (Math.min(w, h) <= 2 * task.kerf * scalePdf) return '';
    const s = getRectStyle(l, t, w, h);
    return dropPdf(s, sizePdf(width, height, w, h)) + backPdf(s, 1);
}).join('\n');

const rectPdf = (style) => `<div class="rect" style="${style}"></div>`;

const takePdf = (i, count) => {
    const {width, height, edging} = pieces[i];
    return `<tr><td>${i + 1}</td>${whPdf(width, height, edging)}<td>${count}</td></tr>`
}

const toCount = (t) => {
    const counts = t.reduce((acc, {i}) => {
        acc[i] = (acc[i] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(counts);
}

const takesPdf = (drags) => {
    const takes = toCount(drags).map(([i, count]) => takePdf(+i, count)).join('\n');

    return `<table class="takes">
    <thead><tr><th>#</th><th>Длина</th><th>Ширина</th><th>Кол-во</th></tr></thead>
    <tbody>${takes}</tbody>
</table>`;
}

const cuttingPdf = (w, h, drops, drags) => `<div class="cutting" style="${getSizeStyle(w, h)}">
     <div class="base"></div>
     ${tapePdf(w, h)}
     ${dragsPdf(drags)}
     ${dropsPdf(drops)}
</div>`;

const getCuts = () => zones.filter(({drags}) => drags.some(q => q.html));

const toScale = ({width, height, drops, drags}) => ({
    w: width * scalePdf,
    h: height * scalePdf,
    drops: drops.filter(({html}) => html && html.isConnected).map(({top, left, width, height}) => ({
        width, height, l: left * scalePdf, t: top * scalePdf, w: width * scalePdf, h: height * scalePdf
    })),
    drags: drags.filter(({html}) => html && html.isConnected).map(({top, left, width, height, take}) => ({
        width, height, i: take, l: left * scalePdf, t: top * scalePdf, w: width * scalePdf, h: height * scalePdf
    }))
});

// 5. Автоматический раскрой

const takesRect = () => takes.filter(
    ({count}) => count > 0).map(
    ({width, height, rotated, count}) => [width + task.kerf, height + task.kerf, rotated, count]);

const dropsRect = () => zones.flatMap(
    ({drops}) => drops.filter(({busy}) => busy === false)).map(
    ({width, height}) => [width + task.kerf, height + task.kerf]);

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
    return dst.sort((a, b) => b.height - a.height || b.width - a.width).slice(0, 16);
}

const getStates = (packs, counts, fit) => {
    const states = new Array(line.width + 1).fill(null);

    for (let k = 0; k < packs.length; k++) {
        const pack = packs[k];

        if (fit && pack.height < line.height) break;

        const s = {
            busy: pack.busy, counts: getCounts([pack], [...counts]), k, left: 0
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
                    busy: busy + pack.busy, counts: getCounts([pack], [...counts]), k, n, left
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

            const rotate = rotated && (width > pack.width || (width < height && height <= pack.width));

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
                    top,
                    n
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
                    takes: q.takes.map(([width, height, rotated], i) => [width, height, rotated, counts[i]]).filter(q => q[3] > 0)
                });
            });
        });
        src = dst;

        src.sort((a, b) => b.busy - a.busy || b.free - a.free);

        if (!src[0].takes.length) break;
        if (src.length > n) src.length = n;
    }
    const rects = src[0].rects;
    addRects(rects, drops);
}

// 5.2 Раскрой на сервере

const doCut = (drops, takes) => {
    fetch(ALGO_URL, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({drops, takes})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();

        })
        .then(rects => {
            rects && addRects(rects, drops);
        })
        .catch(error => {
            console.error(error);
        });
}

cutButton.onclick = (e) => {
    e.preventDefault();

    const takes = takesRect();
    const drops = dropsRect();

    // doCut(drops, takes);
    toCut(drops, takes);

    cuttingPage.style.gridTemplateRows = '1fr 6px auto';
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
    drag.rotated = take.rotated;
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

const findVerticalCut = (rects) => findCut(rects.map(([left, top, width, height]) => [left, left + width]).sort((a, b) => a[0] - b[0] || b[1] - a[1]));

const findHorizontalCut = (rects) => findCut(rects.map(([left, top, width, height]) => [top, top + height]).sort((a, b) => a[0] - b[0] || b[1] - a[1]));

const asDrop = ([left, top, width, height], busy = false) => ({
    left: left + drop.left, top: top + drop.top, width: width - task.kerf, height: height - task.kerf, busy
});

const asDrag = ([l, t, w, h]) => ({
    left: l + drop.left, top: t + drop.top, width: w - task.kerf, height: h - task.kerf
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

    const l = {
        drop: [left, top, width - W, height],
        rects: rects.filter(q => q[0] < L)
    };
    const r = {
        drop: [L, top, W, height],
        rects: rects.filter(q => q[0] >= L)
    };
    const t = {
        drop: [left, top, width, height - H],
        rects: rects.filter(q => q[1] < T)
    };
    const b = {
        drop: [left, T, width, H],
        rects: rects.filter(q => q[1] >= T)
    };

    if (W && H) {
        [l, r, t, b].forEach(q => q.score = getScore(q.drop, q.rects));

        const cutDirection = Math.max(l.score, r.score) >= Math.max(t.score, b.score);

        if (cutDirection) {
            addCut(l.drop, l.rects, false);
            addCut(r.drop, r.rects);
        } else {
            addCut(t.drop, t.rects, false);
            addCut(b.drop, b.rects);
        }
    } else if (W) {
        addCut(l.drop, l.rects, false);
        addCut(r.drop, r.rects);
    } else if (H) {
        addCut(t.drop, t.rects, false);
        addCut(b.drop, b.rects);
    }
}

const getScore = ([L, T, W, H], rects) => {
    if (rects.length === 0) return W * H;

    const R = L + W;
    const B = T + H;

    let l = R;
    let t = B;

    let r = L;
    let b = T;

    for (const [left, top, width, height] of rects) {
        const right = left + width;
        const bottom = top + height;
        if (left < l) l = left;
        if (top < t) t = top;
        if (right > r) r = right;
        if (bottom > b) b = bottom;
    }
    return Math.max(
        W * Math.max(t - T, B - b),
        H * Math.max(l - L, R - r)
    )
}

const addRects = (rects, drops) => {
    let i = 0;

    toSelect(null);
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

// 5. Рулоны

const getRollLength = (
    inner, outer, thick
) => Math.floor(Math.PI * (outer * outer - inner * inner) / 4 / thick);

// Начальная загрузка

(function () {
    loadTheme();
    loadTasks();

    tasksList.innerHTML = tasks.map(
        q => `<li id="${q.id}" onclick="toTask(event)" >${getTaskTitle(q)}</li>`).join('\n');
})();

