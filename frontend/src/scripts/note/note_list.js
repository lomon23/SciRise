const notesGrid = document.getElementById('notesGrid');
const emptyState = document.getElementById('emptyState');
const createBtn = document.getElementById('createBtn');

// 1. Завантаження нотаток
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('eduverse_notes')) || [];

    if (notes.length === 0) {
        emptyState.classList.remove('hidden');
        notesGrid.innerHTML = '';
        return;
    }

    emptyState.classList.add('hidden');
    notesGrid.innerHTML = '';

    // Сортуємо: новіші перші
    notes.sort((a, b) => b.updatedAt - a.updatedAt).forEach(note => {
        createNoteCard(note);
    });
}

// 2. Створення картки (HTML)
function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = 'note-card';
    
    // Рендеримо Markdown в HTML для прев'ю
    const renderedHTML = marked.parse(note.content || "*(Без тексту)*");
    const date = new Date(note.updatedAt).toLocaleDateString('uk-UA');

    card.innerHTML = `
        <div class="note-date">${date}</div>
        <div class="note-preview markdown-body">${renderedHTML}</div>
        <button class="delete-btn" onclick="deleteNote(event, ${note.id})">
            <span class="material-symbols-rounded">delete</span>
        </button>
    `;

    // Клік на картку -> відкриває редактор
    card.addEventListener('click', (e) => {
        // Якщо клікнули не на кнопку видалення
        if (!e.target.closest('.delete-btn')) {
            window.location.href = `note.html?id=${note.id}`;
        }
    });

    notesGrid.appendChild(card);
}

// 3. Перехід на створення
if (createBtn) {
    console.log("Кнопка створення знайдена!"); // Це покаже в консолі, що все ок

    createBtn.addEventListener('click', () => {
        console.log("Клік відбувся! Переходимо...");
        
        // Спробуй цей варіант переходу, він надійніший для локальних файлів
        window.location.assign('note.html'); 
    });
} else {
    console.error("ПОМИЛКА: JS не знайшов кнопку з id='createBtn'. Перевір HTML!");
}

// 4. Видалення (глобальна функція)
window.deleteNote = function(event, id) {
    event.stopPropagation(); // Щоб не відкрилась картка при видаленні
    if(confirm('Видалити цей курс?')) {
        let notes = JSON.parse(localStorage.getItem('eduverse_notes')) || [];
        notes = notes.filter(n => n.id !== id);
        localStorage.setItem('eduverse_notes', JSON.stringify(notes));
        loadNotes(); // Перемалювати
    }
}

// Старт
loadNotes();