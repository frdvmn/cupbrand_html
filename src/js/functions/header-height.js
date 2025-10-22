// export const getHeaderHeight = () => {
//   const headerHeight = document?.querySelector('.header').offsetHeight;
//   document.querySelector(':root').style.setProperty('--header-height', `${headerHeight}px`);
// }
const isMenuOpen = () => {
  return document.querySelector(".header__nav.menu--active") !== null;
};
// console.log(isMenuOpen);

// Получаем высоту хедера и устанавливаем CSS-переменную
export const getHeaderHeight = () => {
  const header = document.querySelector(".header");
  if (!header) return 0;
  const height = header.offsetHeight;
  document.documentElement.style.setProperty("--header-height", `${height}px`);
  return height;
};

// Логика скрытия/появления хедера
let lastScrollY = window.scrollY;
let ticking = false;

const updateHeaderVisibility = () => {
  const currentScrollY = window.scrollY;
  const header = document.querySelector(".header");

  if (!header) return;

  if (currentScrollY > lastScrollY && currentScrollY > 10 && !isMenuOpen()) {
    // Прокрутка ВНИЗ → скрыть
    header.classList.add("header-hidden");
  } else {
    // Прокрутка ВВЕРХ → показать
    header.classList.remove("header-hidden");
  }

  lastScrollY = currentScrollY;
  ticking = false;
};

const requestTick = () => {
  if (!ticking) {
    requestAnimationFrame(updateHeaderVisibility);
    ticking = true;
  }
};

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  getHeaderHeight();
  window.addEventListener("scroll", requestTick);
});

// Обновляем высоту при ресайзе (опционально, см. предыдущий ответ)
window.addEventListener("resize", () => {
  clearTimeout(window.resizeTimer);
  window.resizeTimer = setTimeout(getHeaderHeight, 100);
});
