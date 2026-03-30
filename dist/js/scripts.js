const modules_flsModules = {};

let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    setTimeout((() => {
      lockPaddingElements.forEach((lockPaddingElement => {
        lockPaddingElement.style.paddingRight = "";
      }));
      document.body.style.paddingRight = "";
      document.documentElement.classList.remove("lock");
    }), delay);
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    }));
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.classList.add("lock");
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
function functions_FLS(message) {
  setTimeout((() => {
    if (window.FLS) console.log(message);
  }), 0);
}

let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout((() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout((() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};

function getHash() {
  if (location.hash) { return location.hash.replace('#', ''); }
}

function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter(function (item) {
    return item.dataset[dataSetValue];
  });

  if (media.length) {
    const breakpointsArray = media.map(item => {
      const params = item.dataset[dataSetValue];
      const paramsArray = params.split(",");
      return {
        value: paramsArray[0],
        type: paramsArray[1] ? paramsArray[1].trim() : "max",
        item: item
      };
    });

    const mdQueries = uniqArray(
      breakpointsArray.map(item => `(${item.type}-width: ${item.value}px),${item.value},${item.type}`)
    );

    const mdQueriesArray = mdQueries.map(breakpoint => {
      const [query, value, type] = breakpoint.split(",");
      const matchMedia = window.matchMedia(query);
      const itemsArray = breakpointsArray.filter(item => item.value === value && item.type === type);
      return { itemsArray, matchMedia };
    });

    return mdQueriesArray;
  }
}

function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}

//========================================================================================================================================================

function filterCatalog() {
  let customDropdownsInitialized = false;
  let currentMediaQuery = null;

  function getInputLabelText(input) {
    if (!input) return '';
    const item = input.closest('.options__item, .checkbox');
    if (!item) return '';
    const textEl = item.querySelector('.options__text, .checkbox__text');
    return textEl ? textEl.textContent.trim() : '';
  }

  function updateTitleState(column, titleSpan, newText) {
    if (!titleSpan) return false;

    titleSpan.textContent = newText;
    titleSpan.innerText = newText;
    titleSpan.innerHTML = newText;

    if (titleSpan.textContent !== newText) {
      const parent = titleSpan.parentElement;
      if (parent) {
        const originalHtml = parent.innerHTML;
        const safeText = newText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const newHtml = originalHtml.replace(/<span>.*?<\/span>/, `<span>${newText}</span>`);
        parent.innerHTML = newHtml;
        titleSpan = column.querySelector('.filter-catalog__title span');
      }
    }

    const event = new Event('change', { bubbles: true });
    if (titleSpan) titleSpan.dispatchEvent(event);

    if (column && titleSpan) {
      const textContent = titleSpan.textContent.trim();
      const hasCheckedInputs = column.querySelectorAll('.options__input:checked, .checkbox__input:checked').length > 0;

      if (hasCheckedInputs || (textContent && textContent.length > 0)) {
        column.classList.add('filled');
      } else {
        column.classList.remove('filled');
      }
    }

    return true;
  }

  function initCustomDropdowns() {
    if (customDropdownsInitialized) return;

    const searchColumns = document.querySelectorAll('.filter-catalog__column');
    if (!searchColumns.length) return;

    searchColumns.forEach((column) => {
      const button = column.querySelector('.filter-catalog__button');
      let titleSpan = column.querySelector('.filter-catalog__title span');

      const radioOptions = column.querySelectorAll('.options__input');
      const checkboxOptions = column.querySelectorAll('.checkbox__input');

      if (!button || !titleSpan) return;

      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      const updatedButton = column.querySelector('.filter-catalog__button');

      if (updatedButton) {
        updatedButton.addEventListener('click', (e) => {
          e.stopPropagation();

          if (button.classList.contains('_spoller-active')) return;

          if (column.classList.contains('active')) {
            column.classList.remove('active');
          } else {
            searchColumns.forEach(col => {
              if (col !== column && col.classList.contains('active')) {
                col.classList.remove('active');
              }
            });
            column.classList.add('active');
          }
        });
      }

      radioOptions.forEach((option) => {
        const newOption = option.cloneNode(true);
        option.parentNode.replaceChild(newOption, option);

        const updatedOption = column.querySelector(`.options__input[value="${option.value}"]`);

        if (updatedOption) {
          updatedOption.addEventListener('click', (e) => {
            e.stopPropagation();
            column.querySelectorAll('.options__input').forEach(opt => {
              if (opt !== updatedOption) opt.checked = false;
            });

            updatedOption.checked = true;

            const text = getInputLabelText(updatedOption);
            const currentTitleSpan = column.querySelector('.filter-catalog__title span');
            if (currentTitleSpan) {
              updateTitleState(column, currentTitleSpan, text);
            }

            column.classList.remove('active');
          });
        }
      });

      checkboxOptions.forEach((cb) => {
        const newCb = cb.cloneNode(true);
        cb.parentNode.replaceChild(newCb, cb);

        const updatedCb = column.querySelector(`.checkbox__input[value="${cb.value}"]`);

        if (updatedCb) {
          updatedCb.addEventListener('click', (e) => {
            e.stopPropagation();

            const text = getInputLabelText(updatedCb);
            const currentTitleSpan = column.querySelector('.filter-catalog__title span');

            if (currentTitleSpan) {
              updateTitleState(column, currentTitleSpan, text);
            }
          });
        }
      });

      const checkedRadio = column.querySelector('.options__input:checked');
      if (checkedRadio && titleSpan) {
        const text = getInputLabelText(checkedRadio);
        if (text) updateTitleState(column, titleSpan, text);
      }

      const checkedCheckboxes = column.querySelectorAll('.checkbox__input:checked');
      if (checkedCheckboxes.length > 0 && titleSpan) {
        const lastChecked = checkedCheckboxes[checkedCheckboxes.length - 1];
        const text = getInputLabelText(lastChecked);
        if (text) updateTitleState(column, titleSpan, text);
      }

      const anyChecked = column.querySelectorAll('.options__input:checked, .checkbox__input:checked').length > 0;
      if (anyChecked) {
        column.classList.add('filled');
      } else {
        column.classList.remove('filled');
      }
    });

    const globalClickHandler = (e) => {
      if (!e.target.closest('.filter-catalog__column')) {
        document.querySelectorAll('.filter-catalog__column.active').forEach(col => {
          col.classList.remove('active');
        });
      }
    };

    document.removeEventListener('click', globalClickHandler);
    document.addEventListener('click', globalClickHandler);

    customDropdownsInitialized = true;
  }

  function destroyCustomDropdowns() {
    if (!customDropdownsInitialized) return;

    const searchColumns = document.querySelectorAll('.filter-catalog__column');

    if (!searchColumns.length) {
      customDropdownsInitialized = false;
      return;
    }

    searchColumns.forEach((column) => {
      column.classList.remove('active');

      const button = column.querySelector('.filter-catalog__button');
      if (button) button.parentNode.replaceChild(button.cloneNode(true), button);

      const inputs = column.querySelectorAll('.options__input, .checkbox__input');
      inputs.forEach(opt => opt.parentNode.replaceChild(opt.cloneNode(true), opt));
    });

    customDropdownsInitialized = false;
  }

  function setupMobileOptionListeners() {
    const searchColumns = document.querySelectorAll('.filter-catalog__column');
    if (!searchColumns.length) return;

    searchColumns.forEach((column) => {
      const titleSpan = column.querySelector('.filter-catalog__title span');
      const spollerTitle = column.querySelector('[data-spoller]');

      const radioOptions = column.querySelectorAll('.options__input');
      const checkboxOptions = column.querySelectorAll('.checkbox__input');

      radioOptions.forEach((option) => {
        const newOption = option.cloneNode(true);
        option.parentNode.replaceChild(newOption, option);

        const updatedOption = column.querySelector(`.options__input[value="${option.value}"]`);

        if (updatedOption) {
          updatedOption.addEventListener('click', (e) => {
            e.stopPropagation();
            column.querySelectorAll('.options__input').forEach(opt => {
              if (opt !== updatedOption) opt.checked = false;
            });
            updatedOption.checked = true;

            const text = getInputLabelText(updatedOption);
            if (titleSpan) updateTitleState(column, titleSpan, text);

            if (spollerTitle && spollerTitle.classList.contains('_spoller-active')) {
              const spollersBlock = spollerTitle.closest('[data-spollers]');
              if (spollersBlock && spollersBlock.classList.contains('_spoller-init')) {
                const contentBlock = spollerTitle.nextElementSibling;
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

                spollerTitle.classList.remove('_spoller-active');

                if (typeof _slideUp === 'function' && contentBlock) {
                  _slideUp(contentBlock, spollerSpeed);
                } else if (contentBlock) {
                  contentBlock.hidden = true;
                }
              }
            }
          });
        }
      });

      checkboxOptions.forEach((cb) => {
        const newCb = cb.cloneNode(true);
        cb.parentNode.replaceChild(newCb, cb);

        const updatedCb = column.querySelector(`.checkbox__input[value="${cb.value}"]`);

        if (updatedCb) {
          updatedCb.addEventListener('click', (e) => {
            e.stopPropagation();

            const text = getInputLabelText(updatedCb);
            if (titleSpan) {
              updateTitleState(column, titleSpan, text);
            }
          });
        }
      });

      const checkedRadio = column.querySelector('.options__input:checked');
      if (checkedRadio && titleSpan) {
        const text = getInputLabelText(checkedRadio);
        if (text) updateTitleState(column, titleSpan, text);
      }

      const checkedCheckboxes = column.querySelectorAll('.checkbox__input:checked');
      if (checkedCheckboxes.length > 0 && titleSpan) {
        const lastChecked = checkedCheckboxes[checkedCheckboxes.length - 1];
        const text = getInputLabelText(lastChecked);
        if (text) updateTitleState(column, titleSpan, text);
      }
    });
  }

  function destroySpollerForDesktop() {
    const spollersBlocks = document.querySelectorAll('[data-spollers]');
    if (!spollersBlocks.length) return;

    spollersBlocks.forEach((block) => {
      if (block.classList.contains('_spoller-init')) {
        block.classList.remove('_spoller-init');

        const spollerTitles = block.querySelectorAll('[data-spoller]');
        spollerTitles.forEach(title => {
          title.removeAttribute('tabindex');
          if (title.nextElementSibling) title.nextElementSibling.hidden = false;
          title.classList.remove('_spoller-active');
        });
      }
    });
  }

  function reinitSpollerForMobile() {
    const spollersBlocks = document.querySelectorAll('[data-spollers]');
    if (!spollersBlocks.length) return;

    spollersBlocks.forEach((block) => {
      if (!block.classList.contains('_spoller-init')) {
        const spollerTitles = block.querySelectorAll('[data-spoller]');
        spollerTitles.forEach(title => {
          if (!title.classList.contains('_spoller-active') && title.nextElementSibling) {
            title.nextElementSibling.hidden = true;
          }
        });
      }
    });

    if (typeof spollers === 'function') {
      spollers();
    }
  }

  function spollers() {
    const spollersArray = document.querySelectorAll("[data-spollers]");

    if (spollersArray.length > 0) {
      const spollersMedia = Array.from(spollersArray).filter(item => item.dataset.spollers.split(",")[0]);
      const spollersRegular = Array.from(spollersArray).filter(item => !item.dataset.spollers.split(",")[0]);

      if (spollersRegular.length) initSpollers(spollersRegular);

      if (spollersMedia.length) {
        spollersMedia.forEach(spollersBlock => {
          const parts = spollersBlock.dataset.spollers.split(",");
          const breakpoint = parts[0];
          const operator = parts[1] || 'min';
          const matchMedia = window.matchMedia(`(${operator}-width: ${breakpoint}px)`);

          initSpollers([spollersBlock], matchMedia);

          matchMedia.addEventListener('change', (e) => {
            initSpollers([spollersBlock], e);
          });
        });
      }

      function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach(spollersBlock => {
          if (matchMedia) {
            const shouldInit = matchMedia.matches;

            if (shouldInit) {
              if (!spollersBlock.classList.contains("_spoller-init")) {
                spollersBlock.classList.add("_spoller-init");
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener("click", setSpollerAction);
              }
            } else {
              if (spollersBlock.classList.contains("_spoller-init")) {
                spollersBlock.classList.remove("_spoller-init");
                initSpollerBody(spollersBlock, false);
                spollersBlock.removeEventListener("click", setSpollerAction);
              }
            }
          } else {
            spollersBlock.classList.add("_spoller-init");
            initSpollerBody(spollersBlock);
            spollersBlock.addEventListener("click", setSpollerAction);
          }
        });
      }

      function initSpollerBody(spollersBlock, hideSpollerBody = true) {
        let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");

        if (spollerTitles.length) {
          spollerTitles = Array.from(spollerTitles).filter(item => item.closest("[data-spollers]") === spollersBlock);

          spollerTitles.forEach(spollerTitle => {
            if (hideSpollerBody) {
              spollerTitle.removeAttribute("tabindex");
              if (!spollerTitle.classList.contains("_spoller-active")) {
                spollerTitle.nextElementSibling.hidden = true;
              } else {
                setTimeout(() => initShowMoreInSpoller(spollerTitle.nextElementSibling), 10);
              }
            } else {
              spollerTitle.setAttribute("tabindex", "-1");
              spollerTitle.nextElementSibling.hidden = false;
            }
          });
        }
      }

      function setSpollerAction(e) {
        const el = e.target;

        if (el.closest("[data-spoller]")) {
          const spollerTitle = el.closest("[data-spoller]");
          const spollerItem = spollerTitle.closest(".spollers-item");
          const spollersBlock = spollerTitle.closest("[data-spollers]");

          if (!spollersBlock.classList.contains("_spoller-init")) return;

          const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
          const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

          if (!spollersBlock.querySelectorAll("._slide").length) {
            if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) {
              hideSpollersBody(spollersBlock);
            }

            spollerTitle.classList.toggle("_spoller-active");
            if (spollerItem) spollerItem.classList.toggle("_spoller-active");

            const contentBlock = spollerTitle.nextElementSibling;

            if (typeof _slideToggle === 'function') {
              _slideToggle(contentBlock, spollerSpeed, () => {
                if (spollerTitle.classList.contains("_spoller-active")) {
                  setTimeout(() => initShowMoreInSpoller(contentBlock), 10);
                }
              });
            }

            e.preventDefault();
          }
        }
      }

      function hideSpollersBody(spollersBlock) {
        const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

        if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
          spollerActiveTitle.classList.remove("_spoller-active");

          if (typeof _slideUp === 'function') {
            _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
          }
        }
      }
    }
  }

  function initShowMoreInSpoller(element) {
    if (element && element.querySelector && typeof showmore === 'function') {
      const showMoreBlocks = element.querySelectorAll('[data-showmore]');
      if (showMoreBlocks.length) {
        showMoreBlocks.forEach(block => showmore(block));
      }
    }
  }

  function checkAndSwitchMode() {
    const mediaQuery = window.matchMedia('(min-width: 701px)');
    const isDesktop = mediaQuery.matches;

    if (currentMediaQuery !== isDesktop) {
      currentMediaQuery = isDesktop;

      if (isDesktop) {
        destroySpollerForDesktop();
        destroyCustomDropdowns();
        initCustomDropdowns();
      } else {
        destroyCustomDropdowns();
        reinitSpollerForMobile();
        setupMobileOptionListeners();
      }
    }
  }

  if (typeof window !== 'undefined') {
    const runInit = () => {
      checkAndSwitchMode();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runInit);
    } else {
      runInit();
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkAndSwitchMode, 100);
    });
  }
}

filterCatalog();

//========================================================================================================================================================

const searchButton = document.querySelector('.header-search-button');

if (searchButton) {

  const searchBlock = document.querySelector('.header-search');
  const closeButton = document.querySelector('.header-search__close');
  const searchInput = document.querySelector('.header-search input');

  function isMobile() {
    return window.matchMedia('(max-width: 820px)').matches;
  }

  function setSearchRight() {
    const headerSearch = document.querySelector('.header-search');
    const headerRight = document.querySelector('.header__right');

    if (headerSearch && headerRight) {
      const rightWidth = headerRight.offsetWidth;
      const rightGap = 40;
      headerSearch.style.right = `${rightWidth - rightGap}px`;
      headerSearch.style.left = 'auto';
    }
  }

  function setSearchWidth() {
    const headerSearch = document.querySelector('.header-search');
    const headerLogo = document.querySelector('.header__logo');
    const headerRight = document.querySelector('.header__right');
    const headerContent = document.querySelector('.header__content');

    const isSearchOpen = document.documentElement.classList.contains('search-open');

    if (isSearchOpen && headerSearch && headerRight && headerContent) {
      let logoWidth = 0;
      let leftGap = 12;

      if (!isMobile() && headerLogo) {
        logoWidth = headerLogo.offsetWidth;
        leftGap = 12;
      } else {
        leftGap = 0;
      }

      const rightWidth = headerRight.offsetWidth;
      const rightGap = 40;

      const availableWidth = headerContent.offsetWidth - logoWidth - leftGap - rightWidth + rightGap;
      const minWidth = 200;
      const finalWidth = Math.max(minWidth, availableWidth);

      headerSearch.style.width = `${finalWidth}px`;
    }
  }

  function resetSearchWidth() {
    const headerSearch = document.querySelector('.header-search');
    if (headerSearch) {
      headerSearch.style.width = '';
    }
  }

  function toggleActiveClass() {
    if (searchInput && searchBlock) {
      const hasValue = searchInput.value.trim().length > 0;
      if (hasValue) {
        searchBlock.classList.add('active');
      } else {
        searchBlock.classList.remove('active');
      }
    }
  }

  function openSearch() {
    if (document.documentElement.classList.contains('menu-open')) {
      document.documentElement.classList.remove('menu-open');
    }

    document.documentElement.classList.add('search-open');
    setSearchRight();
    setSearchWidth();
    if (searchInput) {
      setTimeout(() => {
        searchInput.focus();
        toggleActiveClass();
      }, 100);
    }
  }

  function closeSearch() {
    document.documentElement.classList.remove('search-open');
    resetSearchWidth();
    if (searchInput) {
      searchInput.value = '';
      if (searchBlock) {
        searchBlock.classList.remove('active');
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', toggleActiveClass);
  }

  if (closeButton) {
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (searchInput && searchInput.value.trim().length > 0) {
        searchInput.value = '';
        if (searchBlock) {
          searchBlock.classList.remove('active');
        }
      } else {
        closeSearch();
      }
    });
  }

  searchButton.addEventListener('click', (e) => {
    e.stopPropagation();
    openSearch();
  });

  document.addEventListener('click', (e) => {
    const isClickInsideSearch = searchBlock?.contains(e.target);
    const isClickOnSearchButton = searchButton?.contains(e.target);

    if (!isClickInsideSearch && !isClickOnSearchButton) {
      closeSearch();
    }
  });

  window.addEventListener('resize', () => {
    setSearchRight();
    if (document.documentElement.classList.contains('search-open')) {
      setSearchWidth();
    }
  });

  setSearchRight();
}

//========================================================================================================================================================

const iconMenu = document.querySelector('.header-burger');
const headerBody = document.querySelector('.header__menu');

if (iconMenu) {
  iconMenu.addEventListener("click", function (e) {
    e.stopPropagation();

    if (document.documentElement.classList.contains('search-open')) {
      if (typeof closeSearch === 'function') {
        closeSearch();
      } else {
        document.documentElement.classList.remove('search-open');
        const searchBlockLocal = document.querySelector('.header-search');
        const searchInputLocal = document.querySelector('.header-search input');
        if (searchBlockLocal) {
          searchBlockLocal.classList.remove('active');
        }
        if (searchInputLocal) {
          searchInputLocal.value = '';
        }
        const headerSearch = document.querySelector('.header-search');
        if (headerSearch) {
          headerSearch.style.width = '';
        }
      }
    }

    document.documentElement.classList.toggle("menu-open");
  });

  document.addEventListener('click', function (e) {
    const isClickInsideHeaderBody = headerBody && headerBody.contains(e.target);
    const isClickOnMenuIcon = e.target === iconMenu || iconMenu.contains(e.target);

    if (!isClickInsideHeaderBody && !isClickOnMenuIcon) {
      document.documentElement.classList.remove("menu-open");
    }
  });
}

//========================================================================================================================================================

// Добавление к шапке при скролле
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 0) {
      header.classList.add('_header-scroll');
      document.documentElement.classList.add('header-scroll');
    } else {
      header.classList.remove('_header-scroll');
      document.documentElement.classList.remove('header-scroll');
    }
  });
}

//========================================================================================================================================================

//Попап
class Popup {
  constructor(options) {
    let config = {
      logging: true,
      init: true,
      attributeOpenButton: "data-popup",
      attributeCloseButton: "data-close",
      fixElementSelector: "[data-lp]",
      youtubeAttribute: "data-popup-youtube",
      youtubePlaceAttribute: "data-popup-youtube-place",
      setAutoplayYoutube: true,
      classes: {
        popup: "popup",
        popupContent: "popup__content",
        popupActive: "popup_show",
        bodyActive: "popup-show"
      },
      focusCatch: true,
      closeEsc: true,
      bodyLock: true,
      hashSettings: {
        goHash: true
      },
      on: {
        beforeOpen: function () { },
        afterOpen: function () { },
        beforeClose: function () { },
        afterClose: function () { }
      }
    };
    this.youTubeCode;
    this.isOpen = false;
    this.targetOpen = {
      selector: false,
      element: false
    };
    this.previousOpen = {
      selector: false,
      element: false
    };
    this.lastClosed = {
      selector: false,
      element: false
    };
    this._dataValue = false;
    this.hash = false;
    this._reopen = false;
    this._selectorOpen = false;
    this.lastFocusEl = false;
    this._focusEl = ["a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'];
    this.options = {
      ...config,
      ...options,
      classes: {
        ...config.classes,
        ...options?.classes
      },
      hashSettings: {
        ...config.hashSettings,
        ...options?.hashSettings
      },
      on: {
        ...config.on,
        ...options?.on
      }
    };
    this.bodyLock = false;
    this.previousMenuState = false;
    this.options.init ? this.initPopups() : null;
  }
  initPopups() {
    this.eventsPopup();
  }
  eventsPopup() {
    document.addEventListener("click", function (e) {
      const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
      if (buttonOpen) {
        e.preventDefault();
        this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
        this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
        if ("error" !== this._dataValue) {
          if (!this.isOpen) this.lastFocusEl = buttonOpen;
          this.targetOpen.selector = `${this._dataValue}`;
          this._selectorOpen = true;
          this.open();
          return;
        }
        return;
      }
      const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
      if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
    }.bind(this));
    document.addEventListener("keydown", function (e) {
      if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
      if (this.options.focusCatch && 9 == e.which && this.isOpen) {
        this._focusCatch(e);
        return;
      }
    }.bind(this));
    if (this.options.hashSettings.goHash) {
      window.addEventListener("hashchange", function () {
        if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
      }.bind(this));
      window.addEventListener("load", function () {
        if (window.location.hash) this._openToHash();
      }.bind(this));
    }
  }
  open(selectorValue) {
    if (bodyLockStatus) {
      this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
      if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
        this.targetOpen.selector = selectorValue;
        this._selectorOpen = true;
      }
      if (this.isOpen) {
        this._reopen = true;
        this.close();
      }
      if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
      if (!this._reopen) this.previousActiveElement = document.activeElement;
      this.targetOpen.element = document.querySelector(this.targetOpen.selector);
      if (this.targetOpen.element) {
        this.previousMenuState = document.documentElement.classList.contains('menu-open');
        if (this.previousMenuState) {
          if (typeof menuClose === 'function') {
            menuClose();
          } else {
            document.documentElement.classList.remove("menu-open");
            if (typeof bodyUnlock === 'function') bodyUnlock();
          }
        }
        if (this.youTubeCode) {
          const codeVideo = this.youTubeCode;
          const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
          const iframe = document.createElement("iframe");
          iframe.setAttribute("allowfullscreen", "");
          const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
          iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
          iframe.setAttribute("src", urlVideo);
          if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
          }
          this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
        }
        const videoElement = this.targetOpen.element.querySelector("video");
        if (videoElement) {
          videoElement.muted = true;
          videoElement.currentTime = 0;
          videoElement.play().catch((e => console.error("Autoplay error:", e)));
        }
        if (this.options.hashSettings.location) {
          this._getHash();
          this._setHash();
        }
        this.options.on.beforeOpen(this);
        document.dispatchEvent(new CustomEvent("beforePopupOpen", {
          detail: {
            popup: this
          }
        }));
        this.targetOpen.element.classList.add(this.options.classes.popupActive);
        document.documentElement.classList.add(this.options.classes.bodyActive);
        if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
        this.targetOpen.element.setAttribute("aria-hidden", "false");
        this.previousOpen.selector = this.targetOpen.selector;
        this.previousOpen.element = this.targetOpen.element;
        this._selectorOpen = false;
        this.isOpen = true;
        this.options.on.afterOpen(this);
        document.dispatchEvent(new CustomEvent("afterPopupOpen", {
          detail: {
            popup: this
          }
        }));
      }
    }
  }
  close(selectorValue) {
    if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
    if (!this.isOpen || !bodyLockStatus) return;
    this.options.on.beforeClose(this);
    document.dispatchEvent(new CustomEvent("beforePopupClose", {
      detail: {
        popup: this
      }
    }));
    if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
    this.previousOpen.element.classList.remove(this.options.classes.popupActive);
    const videoElement = this.previousOpen.element.querySelector("video");
    if (videoElement) videoElement.pause();
    this.previousOpen.element.setAttribute("aria-hidden", "true");
    if (!this._reopen) {
      document.documentElement.classList.remove(this.options.classes.bodyActive);
      !this.bodyLock ? bodyUnlock() : null;
      this.isOpen = false;
      if (this.previousMenuState) {
        if (typeof menuOpen === 'function') {
          menuOpen();
        } else {
          document.documentElement.classList.add("menu-open");
          if (typeof bodyLock === 'function') bodyLock();
        }
      }
    }
    document.dispatchEvent(new CustomEvent("afterPopupClose", {
      detail: {
        popup: this
      }
    }));
    this.options.on.afterClose(this);
  }
  _getHash() {
    if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
  }
  _openToHash() {
    let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
    const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
    if (buttons && classInHash) this.open(classInHash);
  }
  _setHash() {
    history.pushState("", "", this.hash);
  }
  _removeHash() {
    history.pushState("", "", window.location.href.split("#")[0]);
  }
  _focusCatch(e) {
    const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);
    if (e.shiftKey && 0 === focusedIndex) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }
}
modules_flsModules.popup = new Popup({});

function menuOpen() {
  bodyLock();
  document.documentElement.classList.add("menu-open");
}
function menuClose() {
  bodyUnlock();
  document.documentElement.classList.remove("menu-open");
}

//========================================================================================================================================================

//Маска
const telephone = document.querySelectorAll('.telephone');
if (telephone) {
  Inputmask({
    "mask": "+7 (999) 999 - 99 - 99",
    "showMaskOnHover": false,
  }).mask(telephone);
}

//========================================================================================================================================================

//Табы
function tabs() {
  const tabs = document.querySelectorAll('[data-tabs]');
  let tabsActiveHash = [];

  if (tabs.length > 0) {
    const hash = getHash();
    if (hash && hash.startsWith('tab-')) {
      tabsActiveHash = hash.replace('tab-', '').split('-');
    }
    tabs.forEach((tabsBlock, index) => {
      tabsBlock.classList.add('_tab-init');
      tabsBlock.setAttribute('data-tabs-index', index);
      tabsBlock.addEventListener("click", setTabsAction);
      initTabs(tabsBlock);
    });

    let mdQueriesArray = dataMediaQueries(tabs, "tabs");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach(mdQueriesItem => {
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }

  function setTitlePosition(tabsMediaArray, matchMedia) {
    tabsMediaArray.forEach(tabsMediaItem => {
      tabsMediaItem = tabsMediaItem.item;
      let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
      let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
      let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
      let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
      tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems.forEach((tabsContentItem, index) => {
        if (matchMedia.matches) {
          tabsContent.append(tabsTitleItems[index]);
          tabsContent.append(tabsContentItem);
          tabsMediaItem.classList.add('_tab-spoller');
        } else {
          tabsTitles.append(tabsTitleItems[index]);
          tabsMediaItem.classList.remove('_tab-spoller');
        }
      });
    });
  }

  function initTabs(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

    if (tabsActiveHashBlock) {
      const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
      tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
    }
    if (tabsContent.length) {
      tabsContent.forEach((tabsContentItem, index) => {
        tabsTitles[index].setAttribute('data-tabs-title', '');
        tabsContentItem.setAttribute('data-tabs-item', '');

        if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
          tabsTitles[index].classList.add('_tab-active');
        }
        tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
      });
    }
    setTabsStatus(tabsBlock);
  }

  function setTabsStatus(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;

    function isTabsAnimate(tabsBlock) {
      if (tabsBlock.hasAttribute('data-tabs-animate')) {
        return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
      }
      return false;
    }
    const tabsBlockAnimate = isTabsAnimate(tabsBlock);

    if (tabsContent.length > 0) {
      const isHash = tabsBlock.hasAttribute('data-tabs-hash');
      tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
        if (tabsTitles[index].classList.contains('_tab-active')) {
          if (tabsBlockAnimate) {
            _slideDown(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = false;
          }
          if (isHash && !tabsContentItem.closest('.popup')) {
            setHash(`tab-${tabsBlockIndex}-${index}`);
          }
        } else {
          if (tabsBlockAnimate) {
            _slideUp(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = true;
          }
        }
      });
    }
  }

  function setTabsAction(e) {
    const el = e.target;
    if (el.closest('[data-tabs-title]')) {
      const tabTitle = el.closest('[data-tabs-title]');
      const tabsBlock = tabTitle.closest('[data-tabs]');
      if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
        let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
        tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock);
        if (tabActiveTitle.length) tabActiveTitle[0].classList.remove('_tab-active');
        tabTitle.classList.add('_tab-active');
        setTabsStatus(tabsBlock);
      }
      e.preventDefault();
    }
  }
}
tabs();

//========================================================================================================================================================

//Форма
function formFieldsInit(options = { viewPass: true, autoHeight: false }) {
  document.body.addEventListener("focusin", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.add('_form-focus');
        targetElement.parentElement.classList.add('_form-focus');
      }
      formValidate.removeError(targetElement);
      targetElement.hasAttribute('data-validate') ? formValidate.removeError(targetElement) : null;
    }
  });
  const originalFocusoutHandler = document.body._focusoutHandler;
  document.body.addEventListener("focusout", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.remove('_form-focus');
        targetElement.parentElement.classList.remove('_form-focus');
      }
      if (targetElement.value.trim()) {
        targetElement.parentElement.classList.add('filled');
      } else {
        targetElement.parentElement.classList.remove('filled');
      }
      targetElement.hasAttribute('data-validate') ? formValidate.validateInput(targetElement) : null;

      const form = targetElement.closest('form');
      if (form) {
        const submitBtn = form.querySelector('.btn.disabled');
        if (submitBtn) {
          setTimeout(() => {
            const requiredFields = form.querySelectorAll('[data-required]');
            let allFilled = true;

            requiredFields.forEach(field => {
              if (field.type === 'checkbox') {
                if (!field.checked) allFilled = false;
              } else {
                if (!field.value.trim()) allFilled = false;
              }
            });

            if (allFilled) {
              submitBtn.classList.remove('disabled');
            } else {
              submitBtn.classList.add('disabled');
            }
          }, 50);
        }
      }
    }
  });
  if (options.viewPass) {
    document.addEventListener("click", function (e) {
      const targetElement = e.target;
      if (targetElement.closest('.form__viewpass')) {
        const viewpassBlock = targetElement.closest('.form__viewpass');
        const input = viewpassBlock.closest('.form__input').querySelector('input');

        if (input) {
          const isActive = viewpassBlock.classList.contains('_viewpass-active');
          input.setAttribute("type", isActive ? "password" : "text");
          viewpassBlock.classList.toggle('_viewpass-active');
        } else {
          console.error('Input не найден!');
        }
      }
    });
  }
  if (options.autoHeight) {
    const textareas = document.querySelectorAll('textarea[data-autoheight]');
    if (textareas.length) {
      textareas.forEach(textarea => {
        const startHeight = textarea.hasAttribute('data-autoheight-min') ?
          Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
        const maxHeight = textarea.hasAttribute('data-autoheight-max') ?
          Number(textarea.dataset.autoheightMax) : Infinity;
        setHeight(textarea, Math.min(startHeight, maxHeight))
        textarea.addEventListener('input', () => {
          if (textarea.scrollHeight > startHeight) {
            textarea.style.height = `auto`;
            setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
          }
        });
      });
      function setHeight(textarea, height) {
        textarea.style.height = `${height}px`;
      }
    }
  }
}
formFieldsInit({
  viewPass: true,
  autoHeight: false
});

let formValidate = {
  getErrors(form) {
    let error = 0;
    let formRequiredItems = form.querySelectorAll('*[data-required]');
    if (formRequiredItems.length) {
      formRequiredItems.forEach(formRequiredItem => {
        if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
          error += this.validateInput(formRequiredItem);
        }
      });
    }
    return error;
  },
  validateInput(formRequiredItem) {
    let error = 0;

    if (formRequiredItem.dataset.required === "email") {
      formRequiredItem.value = formRequiredItem.value.replace(" ", "");
      if (this.emailTest(formRequiredItem)) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
      this.addError(formRequiredItem);
      this.removeSuccess(formRequiredItem);
      error++;
    } else if (formRequiredItem.dataset.validate === "password-confirm") {
      const passwordInput = document.getElementById('password');
      if (!passwordInput) return error;

      if (formRequiredItem.value !== passwordInput.value) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else {
      if (!formRequiredItem.value.trim()) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    }

    return error;
  },
  addError(formRequiredItem) {
    formRequiredItem.classList.add('_form-error');
    formRequiredItem.parentElement.classList.add('_form-error');
    let inputError = formRequiredItem.parentElement.querySelector('.form-error');
    if (inputError) formRequiredItem.parentElement.removeChild(inputError);
    if (formRequiredItem.dataset.error) {
      formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div class="form-error">${formRequiredItem.dataset.error}</div>`);
    }
    formRequiredItem.parentElement.classList.remove('filled');
  },
  removeError(formRequiredItem) {
    formRequiredItem.classList.remove('_form-error');
    formRequiredItem.parentElement.classList.remove('_form-error');
    if (formRequiredItem.parentElement.querySelector('.form-error')) {
      formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector('.form-error'));
    }
  },
  addSuccess(formRequiredItem) {
    formRequiredItem.classList.add('_form-success');
    formRequiredItem.parentElement.classList.add('_form-success');
    if (formRequiredItem.value.trim()) {
      formRequiredItem.parentElement.classList.add('filled');
    }
  },
  removeSuccess(formRequiredItem) {
    formRequiredItem.classList.remove('_form-success');
    formRequiredItem.parentElement.classList.remove('_form-success');
    formRequiredItem.parentElement.classList.remove('filled');
  },
  formClean(form) {
    form.reset();
    setTimeout(() => {
      let inputs = form.querySelectorAll('input,textarea');
      for (let index = 0; index < inputs.length; index++) {
        const el = inputs[index];
        el.parentElement.classList.remove('_form-focus');
        el.classList.remove('_form-focus');

        el.classList.remove('_form-success');
        el.parentElement.classList.remove('_form-success');

        el.parentElement.classList.remove('filled');

        formValidate.removeError(el);

        if (el.classList.contains('telephone') && el.clearFilled) {
          el.clearFilled();
        }
      }

      let checkboxes = form.querySelectorAll('.checkbox__input');
      if (checkboxes.length > 0) {
        for (let index = 0; index < checkboxes.length; index++) {
          const checkbox = checkboxes[index];
          checkbox.checked = false;
          checkbox.classList.remove('_form-success');
          checkbox.closest('.checkbox')?.classList.remove('_form-success');
        }
      }

      if (modules_flsModules.select) {
        let selects = form.querySelectorAll('div.select');
        if (selects.length) {
          for (let index = 0; index < selects.length; index++) {
            const select = selects[index].querySelector('select');
            modules_flsModules.select.selectBuild(select);
          }
        }
      }
    }, 0);
  },
  emailTest(formRequiredItem) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
  }
};

function formSubmit() {
  const forms = document.forms;
  if (forms.length) {
    for (const form of forms) {
      form.addEventListener('submit', function (e) {
        const form = e.target;
        formSubmitAction(form, e);
      });
      form.addEventListener('reset', function (e) {
        const form = e.target;
        formValidate.formClean(form);
      });
    }
  }
  async function formSubmitAction(form, e) {
    const error = !form.hasAttribute('data-no-validate') ? formValidate.getErrors(form) : 0;
    if (error === 0) {
      const ajax = form.hasAttribute('data-ajax');
      if (ajax) {
        e.preventDefault();
        const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
        const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
        const formData = new FormData(form);

        form.classList.add('_sending');
        const response = await fetch(formAction, {
          method: formMethod,
          body: formData
        });
        if (response.ok) {
          let responseResult = await response.json();
          form.classList.remove('_sending');
          formSent(form, responseResult);
        } else {
          alert("Помилка");
          form.classList.remove('_sending');
        }
      } else if (form.hasAttribute('data-dev')) {
        e.preventDefault();
        formSent(form);
      }
    } else {
      e.preventDefault();
      if (form.querySelector('._form-error') && form.hasAttribute('data-goto-error')) {
        const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : '._form-error';
        gotoBlock(formGoToErrorClass, true, 1000);
      }
    }
  }
  function formSent(form, responseResult = ``) {
    document.dispatchEvent(new CustomEvent("formSent", {
      detail: {
        form: form
      }
    }));

    const telephoneInputs = form.querySelectorAll('.telephone');
    telephoneInputs.forEach(input => {
      const parent = input.closest('.form__input');
      if (parent) {
        parent.classList.remove('filled');
      }
    });

    setTimeout(() => {
      if (modules_flsModules.popup) {
        const popup = form.dataset.popupMessage;
        popup ? modules_flsModules.popup.open(popup) : null;
      }
    }, 0);

    formValidate.formClean(form);
  }
}

function initFormValidationObserver() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    const submitBtn = form.querySelector('.btn.disabled');
    if (!submitBtn) return;

    function checkRequiredFields() {
      const requiredFields = form.querySelectorAll('[data-required]');
      let allFilled = true;

      requiredFields.forEach(field => {
        if (field.type === 'checkbox') {
          if (!field.checked) {
            allFilled = false;
          }
        }
        else {
          const value = field.value.trim();
          const hasValue = value !== '';

          if (field.dataset.required === 'email' && hasValue) {
            const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(value);
            if (!isValidEmail) {
              allFilled = false;
            }
          }
          else if (field.dataset.validate === 'password-confirm') {
            const passwordInput = document.getElementById('password');
            if (passwordInput && field.value !== passwordInput.value) {
              allFilled = false;
            }
          }
          else if (!hasValue) {
            allFilled = false;
          }
        }
      });

      if (allFilled) {
        submitBtn.classList.remove('disabled');
      } else {
        submitBtn.classList.add('disabled');
      }

      return allFilled;
    }

    checkRequiredFields();

    const requiredFields = form.querySelectorAll('[data-required]');
    requiredFields.forEach(field => {
      if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA' || field.tagName === 'SELECT') {
        field.addEventListener('input', () => {
          setTimeout(checkRequiredFields, 0);
        });
        field.addEventListener('change', () => {
          setTimeout(checkRequiredFields, 0);
        });
      }

      if (field.type === 'checkbox') {
        field.addEventListener('change', () => {
          setTimeout(checkRequiredFields, 0);
        });
      }
    });

    const originalFocusout = document.body.addEventListener;
    form.addEventListener('focusout', (e) => {
      const target = e.target;
      if (target.hasAttribute && target.hasAttribute('data-required')) {
        setTimeout(checkRequiredFields, 100);
      }
    });
  });
}

function initCodeInputs() {
  const codeInputs = document.querySelectorAll('.popup-code__inputs input');
  if (!codeInputs.length) return;

  function setInputValue(input, value) {
    const digits = value.replace(/\D/g, '');
    input.value = digits.slice(0, 1);
    return input.value;
  }

  function focusNextInput(currentInput) {
    const inputs = Array.from(currentInput.parentElement.querySelectorAll('input'));
    const currentIndex = inputs.indexOf(currentInput);
    if (currentIndex < inputs.length - 1) {
      inputs[currentIndex + 1].focus();
      return true;
    }
    return false;
  }

  function focusPrevInput(currentInput) {
    const inputs = Array.from(currentInput.parentElement.querySelectorAll('input'));
    const currentIndex = inputs.indexOf(currentInput);
    if (currentIndex > 0) {
      inputs[currentIndex - 1].focus();
      return true;
    }
    return false;
  }

  codeInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const oldValue = input.value;
      const newValue = setInputValue(input, input.value);

      if (newValue && newValue !== oldValue) {
        focusNextInput(input);
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        if (input.value === '') {
          focusPrevInput(input);
        } else {
          input.value = '';
          e.preventDefault();
        }
      }

      if (e.key === 'Delete') {
        input.value = '';
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft') {
        focusPrevInput(input);
      }

      if (e.key === 'ArrowRight') {
        focusNextInput(input);
      }

      if (e.key === 'Home') {
        e.preventDefault();
        codeInputs[0].focus();
      }

      if (e.key === 'End') {
        e.preventDefault();
        codeInputs[codeInputs.length - 1].focus();
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      const digits = pastedText.replace(/\D/g, '').split('');

      digits.forEach((digit, i) => {
        const targetInput = codeInputs[index + i];
        if (targetInput && digit) {
          targetInput.value = digit;
        }
      });

      const nextEmptyIndex = codeInputs.findIndex(inp => inp.value === '');
      if (nextEmptyIndex !== -1) {
        codeInputs[nextEmptyIndex].focus();
      } else {
        codeInputs[codeInputs.length - 1].focus();
      }

      const form = input.closest('form');
      if (form) {
        const submitBtn = form.querySelector('.btn.disabled');
        if (submitBtn) {
          setTimeout(() => {
            const requiredFields = form.querySelectorAll('[data-required]');
            let allFilled = true;

            requiredFields.forEach(field => {
              if (!field.value.trim()) allFilled = false;
            });

            if (allFilled) {
              submitBtn.classList.remove('disabled');
            } else {
              submitBtn.classList.add('disabled');
            }
          }, 50);
        }
      }
    });
  });

  codeInputs[0].focus();
}

function clearCodeInputs() {
  const codeInputs = document.querySelectorAll('.popup-code__inputs input');
  codeInputs.forEach(input => {
    input.value = '';
  });
  if (codeInputs.length) {
    codeInputs[0].focus();
  }
}

initCodeInputs();
formSubmit();
initFormValidationObserver();

//========================================================================================================================================================

function initFilters() {
  const filterContainers = document.querySelectorAll('[data-filters]');

  filterContainers.forEach(container => {
    const filterTitles = container.querySelectorAll('.filter__title');
    const filterBodies = container.querySelectorAll('[data-filter]');

    if (!filterTitles.length) return;

    function activateFilter(filterValue) {
      filterTitles.forEach(title => {
        if (title.getAttribute('data-filter') === filterValue) {
          title.classList.add('active');
        } else {
          title.classList.remove('active');
        }
      });

      filterBodies.forEach(body => {
        if (body.getAttribute('data-filter') === filterValue) {
          body.classList.add('active');
        } else {
          body.classList.remove('active');
        }
      });

      const event = new CustomEvent('filterChanged', {
        detail: {
          container: container,
          filterValue: filterValue
        }
      });
      document.dispatchEvent(event);
    }

    filterTitles.forEach(title => {
      title.addEventListener('click', function () {
        const filterValue = this.getAttribute('data-filter');
        if (filterValue) {
          activateFilter(filterValue);
        }
      });
    });

    const activeFilter = container.querySelector('.filter__title.active');
    if (activeFilter) {
      const filterValue = activeFilter.getAttribute('data-filter');
      if (filterValue) {
        activateFilter(filterValue);
      }
    } else {
      const firstFilter = filterTitles[0];
      if (firstFilter) {
        const filterValue = firstFilter.getAttribute('data-filter');
        if (filterValue) {
          activateFilter(filterValue);
        }
      }
    }
  });
}
initFilters();

//========================================================================================================================================================

if (document.querySelector('.block-reviews__slider')) {
  const swiperReviews = new Swiper('.block-reviews__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 20,
    speed: 400,
    navigation: {
      prevEl: '.block-reviews-arrow-prev',
      nextEl: '.block-reviews-arrow-next',
    },
    breakpoints: {
      480: {
        slidesPerView: 'auto',
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 'auto',
        spaceBetween: 30,
      },
      1260: {
        slidesPerView: 'auto',
        spaceBetween: 0,
      },
    },
    on: {
      init: function () { checkSliderEnd(this); },
      slideChange: function () { checkSliderEnd(this); },
      resize: function () { checkSliderEnd(this); },
      update: function () { checkSliderEnd(this); },
      reachEnd: function () {
        this.el.classList.add('is-end');
      },
      reachBeginning: function () {
        this.el.classList.remove('is-end');
      }
    }
  });
}

function initBlockChoiceSliders() {
  let activeSlider = null;

  const blockChoice = document.querySelector('.block-choice');
  const prevBtn = blockChoice?.querySelector('.arrow-prev');
  const nextBtn = blockChoice?.querySelector('.arrow-next');
  const filters = document.querySelectorAll('.filter__title');

  function destroyActiveSlider() {
    if (activeSlider) {
      activeSlider.destroy(true, true);
      activeSlider = null;
    }
  }

  function initActiveSlider() {
    const activeSliderEl = document.querySelector('.block-choice__slider.active');
    if (!activeSliderEl) return;

    destroyActiveSlider();

    activeSlider = new Swiper(activeSliderEl, {
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      spaceBetween: 20,
      speed: 400,
      navigation: {
        prevEl: prevBtn,
        nextEl: nextBtn,
      },
      breakpoints: {
        480: { slidesPerView: 'auto', spaceBetween: 20 },
        768: { slidesPerView: 'auto', spaceBetween: 30 },
        1260: { slidesPerView: 'auto', spaceBetween: 0 },
      },
      on: {
        init: function () { checkSliderEnd(this); },
        slideChange: function () { checkSliderEnd(this); },
        resize: function () { checkSliderEnd(this); },
        update: function () { checkSliderEnd(this); },
        reachEnd: function () {
          this.el.classList.add('is-end');
        },
        reachBeginning: function () {
          this.el.classList.remove('is-end');
        }
      }
    });
  }

  function checkSliderEnd(swiperInstance) {
    const slider = swiperInstance.el;
    if (!slider) return;

    if (swiperInstance.isEnd) {
      slider.classList.add('is-end');
    } else {
      slider.classList.remove('is-end');
    }
  }

  filters.forEach(filter => {
    filter.addEventListener('click', function () {
      const filterType = this.dataset.filter;

      filters.forEach(f => f.classList.remove('active'));
      this.classList.add('active');

      document.querySelectorAll('.block-choice__slider').forEach(slider => {
        if (slider.dataset.filter === filterType) {
          slider.classList.add('active');
        } else {
          slider.classList.remove('active');
        }
      });

      setTimeout(() => {
        initActiveSlider();
      }, 50);
    });
  });

  initActiveSlider();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (activeSlider) {
        activeSlider.update();
      }
    }, 250);
  });
}

initBlockChoiceSliders();

function checkSliderEnd(swiperInstance) {
  const slider = swiperInstance.el;
  if (!slider) return;

  if (swiperInstance.isEnd) {
    slider.classList.add('is-end');
  } else {
    slider.classList.remove('is-end');
  }
}

function updateSlider(slider) {
  if (slider.swiper) {
    slider.swiper.update();
    setTimeout(() => {
      if (slider.swiper) checkSliderEnd(slider.swiper);
    }, 50);
  }
}

function updateSlidersInContainer(container) {
  if (!container) return;

  container.querySelectorAll('.swiper').forEach(slider => {
    if (slider.swiper) {
      updateSlider(slider);
    }
  });
}

document.addEventListener('filterChanged', (e) => {
  setTimeout(() => {
    const container = e.detail?.container;
    if (container) {
      updateSlidersInContainer(container);
    }
  }, 100);
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.querySelectorAll('.swiper').forEach(slider => {
      if (slider.swiper) updateSlider(slider);
    });
  }, 250);
});

//========================================================================================================================================================

//Звездный рейтинг
function formRating() {
  const ratings = document.querySelectorAll('[data-rating]');
  if (ratings) {
    ratings.forEach(rating => {
      const ratingValue = +rating.dataset.ratingValue;
      const ratingSize = +rating.dataset.ratingSize ? +rating.dataset.ratingSize : 5;
      formRatingInit(rating, ratingSize);
      ratingValue ? formRatingSet(rating, ratingValue) : null;
      document.addEventListener('click', formRatingAction);
    });
  }

  function formRatingAction(e) {
    const targetElement = e.target;
    if (targetElement.closest('.rating__input')) {
      const currentElement = targetElement.closest('.rating__input');
      const ratingValue = +currentElement.value;
      const rating = currentElement.closest('.rating');
      const ratingSet = rating.dataset.rating === 'set';
      ratingSet ? formRatingGet(rating, ratingValue) : null;
    }
  }

  function formRatingInit(rating, ratingSize) {
    let ratingItems = ``;
    for (let index = 0; index < ratingSize; index++) {
      index === 0 ? ratingItems += `<div class="rating__items">` : null;
      ratingItems += `
                <label class="rating__item">
                    <input class="rating__input" type="radio" name="rating" value="${index + 1}">
                </label>`;
      index === ratingSize ? ratingItems += `</div">` : null;
    }
    rating.insertAdjacentHTML("beforeend", ratingItems);
  }

  function formRatingGet(rating, ratingValue) {
    const resultRating = ratingValue;
    formRatingSet(rating, resultRating);
  }

  function formRatingSet(rating, value) {
    const ratingItems = rating.querySelectorAll('.rating__item');
    const resultFullItems = parseInt(value);
    const resultPartItem = value - resultFullItems;

    rating.hasAttribute('data-rating-title') ? rating.title = value : null;

    ratingItems.forEach((ratingItem, index) => {
      ratingItem.classList.remove('rating__item--active');
      ratingItem.querySelector('span') ? ratingItems[index].querySelector('span').remove() : null;

      if (index <= (resultFullItems - 1)) {
        ratingItem.classList.add('rating__item--active');
      }
      if (index === resultFullItems && resultPartItem) {
        ratingItem.insertAdjacentHTML("beforeend", `<span style="width:${resultPartItem * 100}%"></span>`);
      }
    });
  }

  function formRatingSend() {
  }
}
formRating();

//========================================================================================================================================================

const favoritesElements = document.querySelectorAll('.favorites');

if (favoritesElements) {
  favoritesElements.forEach(element => {
    element.addEventListener('click', function (e) {
      e.preventDefault();

      this.classList.toggle('active');

      e.stopPropagation();
    });
  });
}

//========================================================================================================================================================

//Селект
class SelectConstructor {
  constructor(props, data = null) {
    let defaultConfig = {
      init: true,
      logging: true,
      speed: 150
    }
    this.config = Object.assign(defaultConfig, props);
    this.selectClasses = {
      classSelect: "select",
      classSelectBody: "select__body",
      classSelectTitle: "select__title",
      classSelectValue: "select__value",
      classSelectLabel: "select__label",
      classSelectInput: "select__input",
      classSelectText: "select__text",
      classSelectLink: "select__link",
      classSelectOptions: "select__options",
      classSelectOptionsScroll: "select__scroll",
      classSelectOption: "select__option",
      classSelectContent: "select__content",
      classSelectRow: "select__row",
      classSelectData: "select__asset",
      classSelectDisabled: "_select-disabled",
      classSelectTag: "_select-tag",
      classSelectOpen: "_select-open",
      classSelectActive: "_select-active",
      classSelectFocus: "_select-focus",
      classSelectMultiple: "_select-multiple",
      classSelectCheckBox: "_select-checkbox",
      classSelectOptionSelected: "_select-selected",
      classSelectPseudoLabel: "_select-pseudo-label",
    }
    this._this = this;
    if (this.config.init) {
      const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll('select');
      if (selectItems.length) {
        this.selectsInit(selectItems);
      }
    }
  }

  getSelectClass(className) {
    return `.${className}`;
  }

  getSelectElement(selectItem, className) {
    return {
      originalSelect: selectItem.querySelector('select'),
      selectElement: selectItem.querySelector(this.getSelectClass(className)),
    }
  }

  selectsInit(selectItems) {
    selectItems.forEach((originalSelect, index) => {
      this.selectInit(originalSelect, index + 1);
    });

    document.addEventListener('click', function (e) {
      this.selectsActions(e);
    }.bind(this));

    document.addEventListener('keydown', function (e) {
      this.selectsActions(e);
    }.bind(this));

    document.addEventListener('focusin', function (e) {
      this.selectsActions(e);
    }.bind(this));

    document.addEventListener('focusout', function (e) {
      this.selectsActions(e);
    }.bind(this));
  }

  selectInit(originalSelect, index) {
    const _this = this;
    let selectItem = document.createElement("div");
    selectItem.classList.add(this.selectClasses.classSelect);

    originalSelect.parentNode.insertBefore(selectItem, originalSelect);

    selectItem.appendChild(originalSelect);

    originalSelect.hidden = true;

    index ? originalSelect.dataset.id = index : null;

    selectItem.insertAdjacentHTML('beforeend', `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);

    this.selectBuild(originalSelect);

    if (this.getSelectPlaceholder(originalSelect)) {
      originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;

      const selectElement = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle);
      const selectItemTitle = selectElement.selectElement;

      if (this.getSelectPlaceholder(originalSelect).label.show && selectItemTitle) {
        selectItemTitle.insertAdjacentHTML('afterbegin', `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
      }
    }

    originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : this.config.speed;
    this.config.speed = +originalSelect.dataset.speed;

    originalSelect.addEventListener('change', function (e) {
      _this.selectChange(e);

      const filterEvent = new CustomEvent('filterChange', {
        detail: {
          name: originalSelect.name,
          value: originalSelect.value
        }
      });
      document.dispatchEvent(filterEvent);
    });
  }

  selectBuild(originalSelect) {
    const selectItem = originalSelect.parentElement;
    selectItem.dataset.id = originalSelect.dataset.id;

    originalSelect.dataset.classModif ? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`) : null;

    originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);

    originalSelect.hasAttribute('data-checkbox') && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);

    this.setSelectTitleValue(selectItem, originalSelect);

    this.setOptions(selectItem, originalSelect);

    originalSelect.hasAttribute('data-search') ? this.searchActions(selectItem) : null;

    originalSelect.hasAttribute('data-open') ? this.selectAction(selectItem) : null;

    this.selectDisabled(selectItem, originalSelect);
  }

  selectsActions(e) {
    const targetElement = e.target;
    const targetType = e.type;

    if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
      const selectItem = targetElement.closest('.select') ? targetElement.closest('.select') : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
      const originalSelect = this.getSelectElement(selectItem).originalSelect;

      if (targetType === 'click') {
        if (!originalSelect.disabled) {
          if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
            const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
            const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
            this.optionAction(selectItem, originalSelect, optionItem);
          } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) {
            this.selectAction(selectItem);
          } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
            const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
            this.optionAction(selectItem, originalSelect, optionItem);
          }
        }
      } else if (targetType === 'focusin' || targetType === 'focusout') {
        if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) {
          targetType === 'focusin' ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
        }
      } else if (targetType === 'keydown' && e.code === 'Escape') {
        this.selectsСlose();
      }
    } else {
      this.selectsСlose();
    }
  }

  selectsСlose(selectOneGroup) {
    const selectsGroup = selectOneGroup ? selectOneGroup : document;
    const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
    if (selectActiveItems.length) {
      selectActiveItems.forEach(selectActiveItem => {
        this.selectСlose(selectActiveItem);
      });
    }
  }

  selectСlose(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    if (!selectOptions.classList.contains('_slide')) {
      selectItem.classList.remove(this.selectClasses.classSelectOpen);
      _slideUp(selectOptions, originalSelect.dataset.speed);
      setTimeout(() => {
        selectItem.style.zIndex = '';
      }, originalSelect.dataset.speed);
    }
  }

  selectAction(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;

    this.setOptionsPosition(selectItem);
    this.selectsСlose();

    setTimeout(() => {
      if (!selectOptions.classList.contains('_slide')) {
        selectItem.classList.toggle(this.selectClasses.classSelectOpen);
        _slideToggle(selectOptions, originalSelect.dataset.speed);

        if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
        } else {
          setTimeout(() => {
            selectItem.style.zIndex = '';
          }, originalSelect.dataset.speed);
        }
      }
    }, 0);
  }

  setSelectTitleValue(selectItem, originalSelect) {
    const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
    const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
    if (selectItemTitle) selectItemTitle.remove();
    selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
    originalSelect.hasAttribute('data-search') ? this.searchActions(selectItem) : null;
  }

  getSelectTitleValue(selectItem, originalSelect) {
    let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;

    if (originalSelect.multiple && originalSelect.hasAttribute('data-tags')) {
      selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map(option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`).join('');
      if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
        document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
        if (originalSelect.hasAttribute('data-search')) selectTitleValue = false;
      }
    }

    const selectedOptions = this.getSelectedOptionsData(originalSelect).elements;
    const hasRealSelection = selectedOptions.length > 0 && selectedOptions[0] && selectedOptions[0].value !== "";

    if (!hasRealSelection) {
      selectTitleValue = originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : '';
      selectItem.classList.remove(this.selectClasses.classSelectActive);
    } else {
      selectItem.classList.add(this.selectClasses.classSelectActive);
    }

    let pseudoAttribute = '';
    let pseudoAttributeClass = '';
    if (originalSelect.hasAttribute('data-pseudo-label')) {
      pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заповніть атрибут"`;
      pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
    }

    if (originalSelect.hasAttribute('data-search')) {
      return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`;
    } else {
      const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : '';

      let contentHTML = '';
      if (hasRealSelection) {
        const selectedOption = selectedOptions[0];
        contentHTML = this.getSelectElementContent(selectedOption, true);
      } else {
        contentHTML = `<span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span>`;
      }

      return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}">${contentHTML}</span></button>`;
    }
  }

  getSelectElementContent(selectOption, forTitle = false) {
    if (!selectOption) return '';

    const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : '';
    const selectOptionDataHTML = selectOptionData.indexOf('img') >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;

    if (forTitle) {
      if (selectOption.innerHTML.includes('<span>')) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = selectOption.innerHTML;
        const textContent = tempDiv.childNodes[0]?.nodeValue?.trim() || tempDiv.textContent;
        const spanContent = tempDiv.querySelector('span')?.outerHTML || '';
        return `<span class="${this.selectClasses.classSelectContent}">${textContent} ${spanContent}</span>`;
      }
    }

    let selectOptionContentHTML = ``;
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : '';
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : '';
    selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : '';
    selectOptionContentHTML += selectOptionData ? `</span>` : '';
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : '';

    if (selectOption.innerHTML.includes('<span>')) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = selectOption.innerHTML;
      const textContent = tempDiv.childNodes[0]?.nodeValue?.trim() || '';
      const spanContent = tempDiv.querySelector('span')?.outerHTML || '';
      selectOptionContentHTML += textContent + ' ' + spanContent;
    } else {
      selectOptionContentHTML += selectOption.textContent;
    }

    selectOptionContentHTML += selectOptionData ? `</span>` : '';
    selectOptionContentHTML += selectOptionData ? `</span>` : '';
    return selectOptionContentHTML;
  }

  getSelectPlaceholder(originalSelect) {
    const selectPlaceholder = Array.from(originalSelect.options).find(option => !option.value);
    if (selectPlaceholder) {
      return {
        value: selectPlaceholder.textContent,
        show: selectPlaceholder.hasAttribute("data-show"),
        label: {
          show: selectPlaceholder.hasAttribute("data-label"),
          text: selectPlaceholder.dataset.label
        }
      }
    }
  }

  getSelectedOptionsData(originalSelect, type) {
    let selectedOptions = [];
    if (originalSelect.multiple) {
      selectedOptions = Array.from(originalSelect.options).filter(option => option.value).filter(option => option.selected);
    } else {
      const selectedIndex = originalSelect.selectedIndex;
      if (selectedIndex >= 0) {
        const selectedOption = originalSelect.options[selectedIndex];
        if (selectedOption && selectedOption.value !== "") {
          selectedOptions.push(selectedOption);
        }
      }
    }
    return {
      elements: selectedOptions.map(option => option),
      values: selectedOptions.filter(option => option.value).map(option => option.value),
      html: selectedOptions.map(option => this.getSelectElementContent(option, true))
    }
  }

  getOptions(originalSelect) {
    const selectOptionsScroll = originalSelect.hasAttribute('data-scroll') ? `data-simplebar` : '';
    const customMaxHeightValue = +originalSelect.dataset.scroll ? +originalSelect.dataset.scroll : null;

    let selectOptions = Array.from(originalSelect.options);
    if (selectOptions.length > 0) {
      let selectOptionsHTML = ``;

      selectOptions = selectOptions.filter(option => option.value);

      selectOptionsHTML += `<div ${selectOptionsScroll} ${selectOptionsScroll ? `style="max-height: ${customMaxHeightValue}px"` : ''} class="${this.selectClasses.classSelectOptionsScroll}">`;

      selectOptions.forEach(selectOption => {
        selectOptionsHTML += this.getOption(selectOption, originalSelect);
      });

      selectOptionsHTML += `</div>`;
      return selectOptionsHTML;
    }
  }

  getOption(selectOption, originalSelect) {
    const isSelected = selectOption.selected;
    const selectOptionSelectedClass = isSelected ? ` ${this.selectClasses.classSelectOptionSelected}` : '';
    const selectOptionHide = ``;
    const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : '';
    const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
    const selectOptionLinkTarget = selectOption.hasAttribute('data-href-blank') ? `target="_blank"` : '';

    let selectOptionHTML = ``;
    selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelectedClass}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelectedClass}" data-value="${selectOption.value}" type="button">`;
    selectOptionHTML += this.getSelectElementContent(selectOption);
    selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
    return selectOptionHTML;
  }

  setOptions(selectItem, originalSelect) {
    const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    selectItemOptions.innerHTML = this.getOptions(originalSelect);
  }

  setOptionsPosition(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    const selectItemScroll = this.getSelectElement(selectItem, this.selectClasses.classSelectOptionsScroll).selectElement;
    const customMaxHeightValue = +originalSelect.dataset.scroll ? `${+originalSelect.dataset.scroll}px` : ``;
    const selectOptionsPosMargin = +originalSelect.dataset.optionsMargin ? +originalSelect.dataset.optionsMargin : 10;

    if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
      selectOptions.hidden = false;
      const selectItemScrollHeight = selectItemScroll.offsetHeight ? selectItemScroll.offsetHeight : parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue('max-height'));
      const selectOptionsHeight = selectOptions.offsetHeight > selectItemScrollHeight ? selectOptions.offsetHeight : selectItemScrollHeight + selectOptions.offsetHeight;
      const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
      selectOptions.hidden = true;

      const selectItemHeight = selectItem.offsetHeight;
      const selectItemPos = selectItem.getBoundingClientRect().top;
      const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
      const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);

      if (selectItemResult < 0) {
        const newMaxHeightValue = selectOptionsHeight + selectItemResult;
        if (newMaxHeightValue < 100) {
          selectItem.classList.add('select--show-top');
          selectItemScroll.style.maxHeight = selectItemPos < selectOptionsHeight ? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px` : customMaxHeightValue;
        } else {
          selectItem.classList.remove('select--show-top');
          selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
        }
      }
    } else {
      setTimeout(() => {
        selectItem.classList.remove('select--show-top');
        selectItemScroll.style.maxHeight = customMaxHeightValue;
      }, +originalSelect.dataset.speed);
    }
  }

  optionAction(selectItem, originalSelect, optionItem) {
    const selectOptions = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOptions)}`);
    if (!selectOptions.classList.contains('_slide')) {
      if (originalSelect.multiple) {
        optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
        const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
        originalSelectSelectedItems.forEach(originalSelectSelectedItem => {
          originalSelectSelectedItem.removeAttribute('selected');
        });

        const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
        selectSelectedItems.forEach(selectSelectedItems => {
          originalSelect.querySelector(`option[value = "${selectSelectedItems.dataset.value}"]`).setAttribute('selected', 'selected');
        });
      } else {
        const newValue = optionItem.hasAttribute('data-value') ? optionItem.dataset.value : optionItem.textContent;
        originalSelect.value = newValue;

        const changeEvent = new Event('change', { bubbles: true });
        originalSelect.dispatchEvent(changeEvent);

        this.selectAction(selectItem);
      }

      this.setSelectTitleValue(selectItem, originalSelect);
      this.setSelectChange(originalSelect);
    }
  }

  selectChange(e) {
    const originalSelect = e.target;
    this.selectBuild(originalSelect);
    this.setSelectChange(originalSelect);
  }

  setSelectChange(originalSelect) {
    if (originalSelect.hasAttribute('data-validate')) {
      formValidate.validateInput(originalSelect);
    }

    if (originalSelect.hasAttribute('data-submit') && originalSelect.value) {
      let tempButton = document.createElement("button");
      tempButton.type = "submit";
      originalSelect.closest('form').append(tempButton);
      tempButton.click();
      tempButton.remove();
    }

    const selectItem = originalSelect.parentElement;
    this.selectCallback(selectItem, originalSelect);
  }

  selectDisabled(selectItem, originalSelect) {
    if (originalSelect.disabled) {
      selectItem.classList.add(this.selectClasses.classSelectDisabled);
      this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
    } else {
      selectItem.classList.remove(this.selectClasses.classSelectDisabled);
      this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
    }
  }

  searchActions(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption} `);
    const _this = this;

    selectInput.addEventListener("input", function () {
      selectOptionsItems.forEach(selectOptionsItem => {
        if (selectOptionsItem.textContent.toUpperCase().includes(selectInput.value.toUpperCase())) {
          selectOptionsItem.hidden = false;
        } else {
          selectOptionsItem.hidden = true;
        }
      });
      selectOptions.hidden === true ? _this.selectAction(selectItem) : null;
    });
  }

  selectCallback(selectItem, originalSelect) {
    document.dispatchEvent(new CustomEvent("selectCallback", {
      detail: {
        select: originalSelect
      }
    }));
  }
}
modules_flsModules.select = new SelectConstructor({});