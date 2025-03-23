function showSlide(index) {
    const swiper = document.getElementById('swiper');
    swiper.scrollTo({ left: index * swiper.offsetWidth, behavior: 'smooth' });
  }
  