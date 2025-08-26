import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination, Scrollbar} from 'swiper/modules';
Swiper.use([Navigation, Pagination, Scrollbar, Autoplay]);
const swiper = new Swiper('.hero__swiper', {
  slidesPerView: 1,
  direction: 'horizontal',
  loop: true,
  pagination: {
    el: '.swiper-pagination',
  },
  navigation: {
    nextEl: '.hero__swiper-next',
    prevEl: '.hero__swiper-prev',
  },
});

const subhero_swiper = new Swiper('.subhero__swiper', {
  direction: 'horizontal',
  loop: false,
  slidesPerView: 2,
  spaceBetween: 20,
  scrollbar: {
    el: '.swiper-scrollbar',
    // hide: true,
    snapOnRelease: true,
    draggable: true
  },
  autoplay: {
    delay: 3000,
    pauseOnMouseEnter: true
  },

});
