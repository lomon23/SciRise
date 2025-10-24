export function loadHeader() {
  const container = document.getElementById('header-container');

  fetch('/src/components/main_comp/header.html')
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;

      // Логіка мобільного меню
      const btn = container.querySelector('.menu-btn');
      const nav = container.querySelector('.nav');

      btn.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        nav.style.flexDirection = 'column';
        nav.style.gap = '1rem';
      });
    });
}

