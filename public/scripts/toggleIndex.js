const dataEl = document.getElementById('featured-data');

if (dataEl) {
  const featuredProjects = JSON.parse(dataEl.dataset.projects);
  let currentIndex = parseInt(dataEl.dataset.currentIndex || '0', 10);

  const titleEl = document.getElementById('featured-title');
  const subtitleEl = document.getElementById('featured-subtitle');
  const vimeoSlides = document.querySelectorAll('.slide');
  const detailsSlides = document.querySelectorAll('.details-slide');
  const titleSlides = document.querySelectorAll('.title-slide');

  function updateIndex(step) {
    const length = featuredProjects.length;
    const nextIndex = (currentIndex + step + length) % length;

  if (titleEl) {
      titleEl.textContent = featuredProjects[nextIndex].title ?? '';
    }

    if (subtitleEl) {
      subtitleEl.textContent = featuredProjects[nextIndex].subtitle ?? '';
    }

    if (vimeoSlides.length) {
      vimeoSlides[currentIndex].classList.remove('is-active');
      vimeoSlides[nextIndex].classList.add('is-active');
    }

    if (detailsSlides.length) {
      detailsSlides[currentIndex].classList.remove('is-active');
      detailsSlides[nextIndex].classList.add('is-active');
    }

    if (titleSlides.length) {
      titleSlides[currentIndex].classList.remove('is-active');
      titleSlides[nextIndex].classList.add('is-active');
    }

    currentIndex = nextIndex;
  }

  document.querySelectorAll('.js-index').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      updateIndex(parseInt(btn.dataset.step, 10));
    });
  });

  document.addEventListener('keydown', (event) => {

  let step = null;

  if (event.key === 'ArrowLeft') {
    step = '-1';
  }

  if (event.key === 'ArrowRight') {
    step = '1';
  }

  if (step) {
    event.preventDefault(); // verhindert Scrollen

    const el = document.querySelector(`.js-index[data-step="${step}"]`);
    el?.click();
  }
});
}