// --- MARKDOWN LOGIC ---
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

function updatePreview() {
    // Використовуємо marked для перетворення
    preview.innerHTML = marked.parse(editor.value);
}

editor.addEventListener('input', updatePreview);
// Перший запуск
updatePreview();

// --- RESIZE LOGIC ---
const resizerVert = document.getElementById('dragVertical');
const leftPane = document.getElementById('leftPane');
const resizerHoriz = document.getElementById('dragHorizontal');
const topPane = document.getElementById('topPane');

// 1. Vertical Resize (Left <-> Right)
resizerVert.addEventListener('mousedown', (e) => {
    e.preventDefault();
    resizerVert.classList.add('active');
    document.body.style.cursor = 'col-resize'; // Force cursor
    
    document.addEventListener('mousemove', resizeX);
    document.addEventListener('mouseup', stopResizeX);
});

function resizeX(e) {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 15 && newWidth < 85) {
        leftPane.style.width = `${newWidth}%`;
    }
}

function stopResizeX() {
    resizerVert.classList.remove('active');
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', resizeX);
    document.removeEventListener('mouseup', stopResizeX);
}

// 2. Horizontal Resize (Top <-> Bottom)
resizerHoriz.addEventListener('mousedown', (e) => {
    e.preventDefault();
    resizerHoriz.classList.add('active');
    document.body.style.cursor = 'row-resize';

    document.addEventListener('mousemove', resizeY);
    document.addEventListener('mouseup', stopResizeY);
});

function resizeY(e) {
    // Отримуємо висоту контейнера правої колонки
    const containerHeight = document.querySelector('.right-column').offsetHeight;
    // Отримуємо зміщення мишки відносно верху правої колонки
    const rightColTop = document.querySelector('.right-column').getBoundingClientRect().top;
    const relativeY = e.clientY - rightColTop;
    
    const newHeightPercent = (relativeY / containerHeight) * 100;

    if (newHeightPercent > 15 && newHeightPercent < 85) {
        topPane.style.height = `${newHeightPercent}%`;
    }
}

function stopResizeY() {
    resizerHoriz.classList.remove('active');
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', resizeY);
    document.removeEventListener('mouseup', stopResizeY);
}

const saveBtn = document.getElementById('saveBtn');
const backBtn = document.getElementById('backBtn');
const statusMsg = document.getElementById('statusMsg');

// Отримуємо ID з URL (якщо є)
const urlParams = new URLSearchParams(window.location.search);
const noteId = urlParams.get('id'); // буде null, якщо ми створюємо нову

let notes = JSON.parse(localStorage.getItem('eduverse_notes')) || [];
let currentNote = null;

// 1. Ініціалізація
if (noteId) {
    // Режим редагування: шукаємо нотатку
    currentNote = notes.find(n => n.id == noteId);
    if (currentNote) {
        editor.value = currentNote.content;
    }
} else {
    // Режим створення: готуємо об'єкт
    currentNote = {
        id: Date.now(), // Генеруємо унікальний ID
        content: "# Новий курс\n",
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    // Поки що не додаємо в масив, додамо при збереженні
}

// 2. Рендер прев'ю
function updatePreview() {
    preview.innerHTML = marked.parse(editor.value);
}
editor.addEventListener('input', updatePreview);
updatePreview(); // Старт

// 3. Функція збереження
function saveNote() {
    currentNote.content = editor.value;
    currentNote.updatedAt = Date.now();

    if (noteId) {
        // Оновлюємо існуючу (знаходимо індекс і замінюємо)
        const index = notes.findIndex(n => n.id == noteId);
        if (index !== -1) notes[index] = currentNote;
    } else {
        // Це нова нотатка. Але перевіримо, чи ми її вже не зберегли в цьому сеансі
        const exists = notes.find(n => n.id === currentNote.id);
        if (!exists) {
            notes.push(currentNote);
            // Оновлюємо URL, щоб при наступному F5 ми вже редагували цю нотатку
            const newUrl = `${window.location.pathname}?id=${currentNote.id}`;
            window.history.pushState({path: newUrl}, '', newUrl);
        } else {
             // Якщо вже є, просто оновимо
             const index = notes.findIndex(n => n.id === currentNote.id);
             notes[index] = currentNote;
        }
    }

    localStorage.setItem('eduverse_notes', JSON.stringify(notes));
    
    // Показуємо "Збережено"
    statusMsg.classList.add('visible');
    setTimeout(() => statusMsg.classList.remove('visible'), 2000);
}

// 4. Події
saveBtn.addEventListener('click', saveNote);

// Auto-save при втраті фокусу (коли клікаєш в інше місце)
editor.addEventListener('blur', saveNote);

backBtn.addEventListener('click', () => {
    saveNote(); // Зберегти перед виходом
    window.location.href = 'note_list.html';
});

// Логіка ресайзерів (скорочена версія з попереднього коду)
// ... (можна скопіювати Resizer логіку сюди, якщо потрібно, або залишити статичним)