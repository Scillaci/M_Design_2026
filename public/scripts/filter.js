const filterButtons = document.querySelectorAll('.js-toggle-filter');
const projects = document.querySelectorAll('.js-project');
const featuredElements = document.querySelectorAll('.js-featured-project');
const featuredDataElements = document.querySelectorAll('.js-featured-data');
const indexButtons = document.querySelectorAll('.js-index');
const featuredState = document.querySelector('#featured-state');

const featuredMap = new Map();
const featuredDataMap = new Map();
const STORAGE_KEY = 'projectFilters';

featuredElements.forEach((element) => {
  const slug = element.dataset.featuredSlug;
  if (!slug) return;

  if (!featuredMap.has(slug)) {
    featuredMap.set(slug, []);
  }

  featuredMap.get(slug).push(element);
});

featuredDataElements.forEach((element) => {
  const slug = element.dataset.featuredSlug;
  if (!slug) return;

  featuredDataMap.set(slug, element);
});

function getElementValues(element, key) {
  return (element.dataset[key] || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function matchesFilters(element, activeCategoryFilters, activeExpertiseFilters) {
  const elementCategories = getElementValues(element, 'category');
  const elementExpertise = getElementValues(element, 'expertise');

  const categoryMatch =
    activeCategoryFilters.length === 0 ||
    activeCategoryFilters.some((filter) => elementCategories.includes(filter));

  const expertiseMatch =
    activeExpertiseFilters.length === 0 ||
    activeExpertiseFilters.some((filter) => elementExpertise.includes(filter));

  return categoryMatch && expertiseMatch;
}

function getActiveFilters(group) {
  return Array.from(filterButtons)
    .filter((button) =>
      button.dataset.filterGroup === group &&
      button.classList.contains('is-active')
    )
    .map((button) => button.dataset.filterValue)
    .filter(Boolean);
}

function saveFilters() {
  const filterState = {
    category: getActiveFilters('category'),
    expertise: getActiveFilters('expertise')
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filterState));
}

function restoreFilters() {
  const savedFilters = sessionStorage.getItem(STORAGE_KEY);
  if (!savedFilters) return;

  let filterState;

  try {
    filterState = JSON.parse(savedFilters);
  } catch {
    return;
  }

  const savedCategories = filterState.category || [];
  const savedExpertise = filterState.expertise || [];

  filterButtons.forEach((button) => {
    const group = button.dataset.filterGroup;
    const value = button.dataset.filterValue;

    const isActive =
      (group === 'category' && savedCategories.includes(value)) ||
      (group === 'expertise' && savedExpertise.includes(value));

    button.classList.toggle('is-active', isActive);
  });
}

function hasActiveFilters(activeCategoryFilters, activeExpertiseFilters) {
  return activeCategoryFilters.length > 0 || activeExpertiseFilters.length > 0;
}

function getMatchedRegularFeaturedSlugs(activeCategoryFilters, activeExpertiseFilters) {
  const matchedSlugs = [];

  featuredDataMap.forEach((dataElement, slug) => {
    const matches = matchesFilters(dataElement, activeCategoryFilters, activeExpertiseFilters);
    const isAlwaysFeatured = dataElement.dataset.alwaysFeatured === 'true';

    if (matches && !isAlwaysFeatured) {
      matchedSlugs.push(slug);
    }
  });

  return matchedSlugs;
}

function getFeaturedVisibility(slug, hasMatchedRegularFeatured, activeCategoryFilters, activeExpertiseFilters) {
  const dataElement = featuredDataMap.get(slug);
  if (!dataElement) return false;

  const filtersAreActive = hasActiveFilters(activeCategoryFilters, activeExpertiseFilters);
  const matches = matchesFilters(dataElement, activeCategoryFilters, activeExpertiseFilters);
  const isAlwaysFeatured = dataElement.dataset.alwaysFeatured === 'true';

  if (!filtersAreActive) {
    return true;
  }

  if (hasMatchedRegularFeatured) {
    return matches && !isAlwaysFeatured;
  }

  return isAlwaysFeatured;
}

function updateFeaturedVisibility(hasMatchedRegularFeatured, activeCategoryFilters, activeExpertiseFilters) {
  const visibleSlugs = [];

  featuredMap.forEach((elements, slug) => {
    const isVisible = getFeaturedVisibility(
      slug,
      hasMatchedRegularFeatured,
      activeCategoryFilters,
      activeExpertiseFilters
    );

    if (isVisible) {
      visibleSlugs.push(slug);
    }

    elements.forEach((element) => {
      element.classList.toggle('is-hidden', !isVisible);
    });
  });

  return visibleSlugs;
}

function getVisibleFeaturedSlugs() {
  if (!(featuredState instanceof HTMLElement)) return [];

  try {
    return JSON.parse(featuredState.dataset.visibleSlugs || '[]');
  } catch {
    return [];
  }
}

function setVisibleFeaturedSlugs(slugs) {
  if (!(featuredState instanceof HTMLElement)) return;
  featuredState.dataset.visibleSlugs = JSON.stringify(slugs);
}

function getActiveFeaturedSlug() {
  const activeElement = document.querySelector('.js-featured-project.is-active:not(.is-hidden)');
  return activeElement?.dataset.featuredSlug || null;
}

function setActiveFeaturedSlug(targetSlug) {
  featuredElements.forEach((element) => {
    const isTarget = element.dataset.featuredSlug === targetSlug;
    element.classList.toggle('is-active', isTarget);
  });
}

function updateFeaturedActiveState() {
  const visibleSlugs = getVisibleFeaturedSlugs();
  const currentActiveSlug = getActiveFeaturedSlug();

  if (visibleSlugs.length === 0) {
    featuredElements.forEach((element) => {
      element.classList.remove('is-active');
    });
    return;
  }

  const nextActiveSlug = visibleSlugs.includes(currentActiveSlug)
    ? currentActiveSlug
    : visibleSlugs[0];

  setActiveFeaturedSlug(nextActiveSlug);
}

function updateIndexButtonsVisibility() {
  const visibleSlugs = getVisibleFeaturedSlugs();
  const showButtons = visibleSlugs.length > 1;

  indexButtons.forEach((button) => {
    button.classList.toggle('is-hidden', !showButtons);
  });
}

function stepFeatured(step) {
  const visibleSlugs = getVisibleFeaturedSlugs();
  if (visibleSlugs.length === 0) return;

  const activeSlug = getActiveFeaturedSlug();
  let currentIndex = visibleSlugs.indexOf(activeSlug);

  if (currentIndex === -1) {
    currentIndex = 0;
  }

  const nextIndex = (currentIndex + step + visibleSlugs.length) % visibleSlugs.length;
  const nextSlug = visibleSlugs[nextIndex];

  setActiveFeaturedSlug(nextSlug);
  updateIndexButtonsVisibility();
}

function updateFilters() {
  const activeCategoryFilters = getActiveFilters('category');
  const activeExpertiseFilters = getActiveFilters('expertise');

  projects.forEach((item) => {
    const matches = matchesFilters(item, activeCategoryFilters, activeExpertiseFilters);
    item.classList.toggle('is-hidden', !matches);
  });

  const matchedRegularFeaturedSlugs = getMatchedRegularFeaturedSlugs(
    activeCategoryFilters,
    activeExpertiseFilters
  );

  const hasMatchedRegularFeatured = matchedRegularFeaturedSlugs.length > 0;

  const visibleFeaturedSlugs = updateFeaturedVisibility(
    hasMatchedRegularFeatured,
    activeCategoryFilters,
    activeExpertiseFilters
  );

  setVisibleFeaturedSlugs(visibleFeaturedSlugs);
  updateFeaturedActiveState();
  updateIndexButtonsVisibility();
  saveFilters();
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    button.classList.toggle('is-active');
    updateFilters();
  });
});

indexButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const step = Number(button.dataset.step || 0);
    if (!step) return;

    stepFeatured(step);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    stepFeatured(-1);
  }

  if (event.key === 'ArrowRight') {
    stepFeatured(1);
  }
});

restoreFilters();
updateFilters();