import Swiper from "swiper";
import { Autoplay, Navigation, Pagination, Scrollbar, Mousewheel } from "swiper/modules";
Swiper.use([Navigation, Pagination, Scrollbar, Autoplay, Mousewheel]);
const swiper = new Swiper(".hero__swiper", {
  direction: "horizontal",
  slidesPerView: 1,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
  },
  navigation: {
    nextEl: ".hero__swiper-next",
    prevEl: ".hero__swiper-prev",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    650: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 1,
      spaceBetween: 0,
    }
  },
  observer: true,
  observeParents: true,
  updateOnWindowResize: true,
});

const subhero_swiper = new Swiper(".subhero__swiper", {
  direction: "horizontal",
  loop: false,
  slidesPerView: 2,
  spaceBetween: 20,
  scrollbar: {
    el: ".swiper-scrollbar",
    // hide: true,
    snapOnRelease: true,
    draggable: true,
  },
  autoplay: {
    delay: 3000,
    pauseOnMouseEnter: true,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 2,
      spaceBetween: 20,
    }
  },
  mousewheel: {
    enabled: false,
  },
  observer: true,
  observeParents: true,
  updateOnWindowResize: true,
});



