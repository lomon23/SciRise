// frontend/src/scripts/components/side_bar.js

// 1. Шлях до CSS: ../../style/components/side_bar.css
// (Два кроки назад до src, потім style/components)
import '../../style/components/side_bar.css'; 

export function loadSidebar(containerId, triggerButtonSelector) {
    
    const container = document.getElementById(containerId); 
    if (!container) {
        console.warn(`Контейнер з ID '${containerId}' не знайдено.`);
    }

    // 2. Завантажуємо HTML сайдбару: ../../components/WS_components/side_bar.html
    // (Два кроки назад до src, потім components/WS_components)
    fetch('../../../components/WS_components/side_bar.html') 
        .then(res => {
            if (!res.ok) {
                // Додаємо детальнішу помилку для діагностики 404
                throw new Error(`Помилка завантаження HTML: ${res.status} ${res.statusText}. Перевірте шлях: '../../components/WS_components/side_bar.html'`);
            }
            return res.text();
        })
        .then(html => {
            const body = document.body;
            body.insertAdjacentHTML('beforeend', html); 

            // ... (решта логіки, яка вже була виправлена) ...

            const sidebar = document.getElementById('sidebar-menu');
            const overlay = document.getElementById('sidebar-overlay');
            const menuBtn = document.querySelector(triggerButtonSelector);

            if (!sidebar || !overlay || !menuBtn) {
                console.error('Не знайдено елементів сайдбару, оверлея або кнопки-тригера.');
                return;
            }

            const toggleSidebar = () => {
                const isActive = sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
                document.body.style.overflow = isActive ? 'hidden' : ''; 
            };

            menuBtn.addEventListener('click', toggleSidebar); 
            overlay.addEventListener('click', toggleSidebar); 

            const sidebarLinks = sidebar.querySelectorAll('a');
            sidebarLinks.forEach(link => {
                link.addEventListener('click', () => { 
                    if (sidebar.classList.contains('active')) {
                         setTimeout(toggleSidebar, 150);
                    }
                });
            });

            console.log('Сайдбар завантажено та логіку додано.');
            console.log(`✅ Кнопка-тригер ${triggerButtonSelector} знайдена.`);
        })
        .catch(error => {
            console.error('Помилка завантаження/ініціалізації сайдбару:', error); 
        });
}