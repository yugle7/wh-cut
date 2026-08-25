const testTask = {
    id: 0,
    start: "2026-06-01",
    finish: "2026-07-20",
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
};

const defaultTask = {
    title: "",
    kerf: 4,
    sheet: {width: 2800, height: 2070, edge: null, depth: 16},
    scraps: [],
    rolls: [],
    edgings: [{line: 0, thick: 2}, {line: 1, thick: 0.4}],
    pieces: []
};

const translations = {
    ru: {
        mailTo: "Написать нам",
        testTitle: "Мой первый раскрой",
        testMaterial: "Галечный",

        support: "Сказать спасибо",
        appName: "Раскрой",
        createTask: "Создать раскрой",
        material: "Материал",

        mm: "мм",
        m: "м",
        m2: "м²",
        pcs: "шт",

        removeTaskQuestion: "Вы действительно хотите удалить задание?",
        yes: "Да",
        no: "Нет",

        task: "Заказ",
        piecesCount: "Деталей",
        piecesArea: "Площадь деталей",
        scrapsArea: "Площадь листов",
        cutsLength: "Длина реза",

        title: "Название задачи",
        start: "Начало",
        finish: "Завершение",
        kerf: "Ширина реза",

        sheet: "Лист",
        length: "Длина",
        width: "Ширина",
        rotation: "Пов-от",
        edge: "Отступ",
        thickness: "Толщина",

        scraps: "Обрезки",
        scrap: "Обрезок",
        add: "Добавить",
        quantity: "Кол.",

        edgings: "Кромки",
        edging: "Кромка",
        line: "Линия",
        description: "Описание",

        rolls: "Бухты",
        roll: "Бухта",
        innerOuter: "Диаметр внутри и снаружи",
        inner: "Внутри",
        outer: "Снаружи",

        pieces: "Детали",
        piece: "Деталь",
        extra: "Доп.об.",

        deleteTask: "Удалить задание",

        save: "Сохранить",
        delete: "Удалить",
        revert: "Вернуть",
        close: "Закрыть",

        toCut: "Собрать раскрой",
        fastCut: "Раскроить",
        slowCut: "Улучшить раскрой",
        manualCut: "Пересобрать вручную",

        cutTipDirection: "задает направление волокон для новых деталей. Если выбрана деталь, меняет направление реза только у нее",
        cutTipRotate: "поворачивает выбранную деталь на 90°, если для нее разрешен поворот",
        cutTipAuto: "автоматически размещает все еще не размещенные детали на листах",
        cutTipClear: "убирает все детали с листов и возвращает их в список неразмещенных",

        cutTipNote: "автоматическое размещение может занять некоторое время",

        rollTipEdging: "Тип кромки",
        rollTipEdgingText: "влияет на плотность намотки кромочной ленты",

        rollTipInner: "Внутренний диаметр",
        rollTipInnerText: "диаметр отверстия втулки (картонного сердечника)",

        rollTipOuter: "Внешний диаметр",
        rollTipOuterText: "полный диаметр бухты с намотанной лентой",

        rollTipNote: "расчет — приблизительный, рекомендуется брать ленту с запасом",

        sheetTipRotation: "Поворот",
        sheetTipRotationText: "нужно ли учитывать направление волокон материала. Для новых деталей это значение устанавливается по умолчанию при создании",

        sheetTipEdge: "Отступ",
        sheetTipEdgeText: "ширина полосы, обрезаемой по краям листа перед распиловкой"
    },

    en: {
        mailTo: "Contact us",
        testTitle: "My First Cutting Plan",
        testMaterial: "Pebble",

        support: "Say thanks",
        appName: "Cutting Planner",
        createTask: "Create cutting plan",
        material: "Material",

        mm: "mm",
        m: "m",
        m2: "m²",
        pcs: "pcs",

        removeTaskQuestion: "Are you sure you want to delete this task?",
        yes: "Yes",
        no: "No",

        task: "Order",
        piecesCount: "Parts",
        piecesArea: "Parts area",
        scrapsArea: "Sheet area",
        cutsLength: "Cut length",

        title: "Task name",
        start: "Start",
        finish: "Finish",
        kerf: "Kerf width",

        sheet: "Sheet",
        length: "Length",
        width: "Width",
        rotation: "Rot.",
        edge: "Trim",
        thickness: "Thickness",

        scraps: "Offcuts",
        scrap: "Offcut",
        quantity: "Qty",

        edgings: "Edgings",
        line: "Line",
        description: "Description",

        rolls: "Rolls",
        roll: "Roll",
        edging: "Edging",
        innerOuter: "Inner and outer diameter",
        inner: "Inner",
        outer: "Outer",

        pieces: "Parts",
        piece: "Part",
        extra: "Extra",

        deleteTask: "Delete task",

        add: "Add",
        save: "Save",
        delete: "Delete",
        revert: "Revert",
        close: "Close",

        toCut: "Go to layout",
        fastCut: "Create layout",
        slowCut: "Optimize cut",
        manualCut: "Manual cut",

        cutTipDirection: "sets the grain direction for new parts. If a part is selected, changes the cutting direction only for that part",
        cutTipRotate: "rotates the selected part by 90° if rotation is allowed",
        cutTipAuto: "automatically places all unplaced parts on the sheets",
        cutTipClear: "removes all parts from the sheets and returns them to the unplaced list",
        cutTipNote: "automatic placement may take some time",

        rollTipInner: "Inner",
        rollTipInnerText: "diameter of the core opening (cardboard core)",
        rollTipOuter: "Outer",
        rollTipOuterText: "overall diameter of the roll with the edge band wound around it",
        rollTipEdging: "Edging type",
        rollTipEdgingText: "affects how tightly the edge band is wound",
        rollTipNote: "the calculation is approximate, so taking some extra edge band is recommended",

        sheetTipRotation: "Rotation",
        sheetTipRotationText: "whether the material grain direction should be taken into account. This value is set by default when creating new parts",

        sheetTipEdge: "Trim",
        sheetTipEdgeText: "width of the strip trimmed from the sheet edges before cutting"
    }
};