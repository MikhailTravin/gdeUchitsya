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

let customDropdownsInitialized = false;
let currentMediaQuery = null;

function debugElementInfo(selector, element, context = '') {
  if (!element) return;
}

function findAllTitleElements(column, index) {
  const titleSpan = column.querySelector('.block-intro-search__title span');
  return titleSpan;
}

function forceUpdateTitle(column, titleSpan, newText) {
  if (!titleSpan) {
    return false;
  }

  titleSpan.textContent = newText;
  titleSpan.innerText = newText;
  titleSpan.innerHTML = newText;

  if (titleSpan.textContent !== newText) {
    const parent = titleSpan.parentElement;
    if (parent) {
      const originalHtml = parent.innerHTML;
      const newHtml = originalHtml.replace(/<span>.*?<\/span>/, `<span>${newText}</span>`);
      parent.innerHTML = newHtml;
      return true;
    }
  }

  titleSpan.style.display = 'none';
  titleSpan.offsetHeight;
  titleSpan.style.display = '';

  const event = new Event('change', { bubbles: true });
  titleSpan.dispatchEvent(event);

  return titleSpan.textContent === newText;
}

function initCustomDropdowns() {
  if (customDropdownsInitialized) {
    return;
  }

  const searchColumns = document.querySelectorAll('.block-intro-search__column');

  if (!searchColumns.length) {
    return;
  }

  searchColumns.forEach((column) => {
    const button = column.querySelector('.block-intro-search__button');
    let titleSpan = column.querySelector('.block-intro-search__title span');
    const options = column.querySelectorAll('.options__input');

    if (!button || !titleSpan) {
      return;
    }

    function closeDropdown() {
      column.classList.remove('active');
    }

    function openDropdown() {
      column.classList.add('active');
    }

    function isSpollerActive() {
      return button && button.classList.contains('_spoller-active');
    }

    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    const updatedButton = column.querySelector('.block-intro-search__button');

    if (updatedButton) {
      updatedButton.addEventListener('click', (e) => {
        e.stopPropagation();

        if (isSpollerActive()) {
          return;
        }

        if (column.classList.contains('active')) {
          closeDropdown();
        } else {
          searchColumns.forEach(col => {
            if (col !== column && col.classList.contains('active')) {
              col.classList.remove('active');
            }
          });
          openDropdown();
        }
      });
    }

    options.forEach((option) => {
      const newOption = option.cloneNode(true);
      option.parentNode.replaceChild(newOption, option);

      const updatedOption = column.querySelector(`.options__input[value="${option.value}"]`);

      if (updatedOption) {
        updatedOption.addEventListener('click', (e) => {
          e.stopPropagation();

          const currentOptions = column.querySelectorAll('.options__input');
          currentOptions.forEach(opt => {
            if (opt !== updatedOption) {
              opt.checked = false;
            }
          });

          updatedOption.checked = true;

          const selectedItem = updatedOption.closest('.options__item');
          if (selectedItem) {
            const selectedTextElement = selectedItem.querySelector('.options__text');
            if (selectedTextElement) {
              const textContent = selectedTextElement.textContent;
              const currentTitleSpan = column.querySelector('.block-intro-search__title span');

              if (currentTitleSpan) {
                forceUpdateTitle(column, currentTitleSpan, textContent);
              }
            }
          }

          closeDropdown();
        });
      }
    });

    const checkedOption = column.querySelector('.options__input:checked');
    if (checkedOption && titleSpan) {
      const selectedItem = checkedOption.closest('.options__item');
      if (selectedItem) {
        const selectedText = selectedItem.querySelector('.options__text');
        if (selectedText) {
          forceUpdateTitle(column, titleSpan, selectedText.textContent);
        }
      }
    }
  });

  const globalClickHandler = (e) => {
    const isClickInside = e.target.closest('.block-intro-search__column');
    if (!isClickInside) {
      document.querySelectorAll('.block-intro-search__column.active').forEach(column => {
        column.classList.remove('active');
      });
    }
  };

  document.removeEventListener('click', globalClickHandler);
  document.addEventListener('click', globalClickHandler);

  customDropdownsInitialized = true;
}

function destroyCustomDropdowns() {
  if (!customDropdownsInitialized) {
    return;
  }

  const searchColumns = document.querySelectorAll('.block-intro-search__column');

  if (!searchColumns.length) {
    customDropdownsInitialized = false;
    return;
  }

  searchColumns.forEach((column) => {
    column.classList.remove('active');

    const button = column.querySelector('.block-intro-search__button');
    if (button) {
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
    }

    const options = column.querySelectorAll('.options__input');
    options.forEach(option => {
      const newOption = option.cloneNode(true);
      option.parentNode.replaceChild(newOption, option);
    });
  });

  customDropdownsInitialized = false;
}

function setupMobileOptionListeners() {
  const searchColumns = document.querySelectorAll('.block-intro-search__column');

  if (!searchColumns.length) {
    return;
  }

  searchColumns.forEach((column) => {
    const titleSpan = column.querySelector('.block-intro-search__title span');
    const spollerTitle = column.querySelector('[data-spoller]');
    const options = column.querySelectorAll('.options__input');

    options.forEach((option) => {
      const newOption = option.cloneNode(true);
      option.parentNode.replaceChild(newOption, option);

      const updatedOption = column.querySelector(`.options__input[value="${option.value}"]`);

      if (updatedOption) {
        updatedOption.addEventListener('click', (e) => {
          e.stopPropagation();

          const currentOptions = column.querySelectorAll('.options__input');
          currentOptions.forEach(opt => {
            if (opt !== updatedOption) {
              opt.checked = false;
            }
          });

          updatedOption.checked = true;

          const selectedItem = updatedOption.closest('.options__item');
          if (selectedItem) {
            const selectedText = selectedItem.querySelector('.options__text');
            if (selectedText && titleSpan) {
              forceUpdateTitle(column, titleSpan, selectedText.textContent);
            }
          }

          if (spollerTitle && spollerTitle.classList.contains('_spoller-active')) {
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            if (spollersBlock && spollersBlock.classList.contains('_spoller-init')) {
              const contentBlock = spollerTitle.nextElementSibling;
              const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
              spollerTitle.classList.remove('_spoller-active');
              if (contentBlock && typeof _slideUp === 'function') {
                _slideUp(contentBlock, spollerSpeed);
              } else if (contentBlock) {
                contentBlock.hidden = true;
              }
            }
          }
        });
      }
    });

    const checkedOption = column.querySelector('.options__input:checked');
    if (checkedOption && titleSpan) {
      const selectedItem = checkedOption.closest('.options__item');
      if (selectedItem) {
        const selectedText = selectedItem.querySelector('.options__text');
        if (selectedText) {
          forceUpdateTitle(column, titleSpan, selectedText.textContent);
        }
      }
    }
  });
}

function destroySpollerForDesktop() {
  const spollersBlocks = document.querySelectorAll('[data-spollers]');

  if (!spollersBlocks.length) {
    return;
  }

  spollersBlocks.forEach((block) => {
    if (block.classList.contains('_spoller-init')) {
      block.classList.remove('_spoller-init');

      const spollerTitles = block.querySelectorAll('[data-spoller]');
      spollerTitles.forEach(title => {
        title.removeAttribute('tabindex');
        if (title.nextElementSibling) {
          title.nextElementSibling.hidden = false;
        }
        title.classList.remove('_spoller-active');
      });
    }
  });
}

function reinitSpollerForMobile() {
  const spollersBlocks = document.querySelectorAll('[data-spollers]');

  if (!spollersBlocks.length) {
    return;
  }

  spollersBlocks.forEach((block) => {
    if (!block.classList.contains('_spoller-init')) {
      const spollerTitles = block.querySelectorAll('[data-spoller]');
      spollerTitles.forEach(title => {
        if (!title.classList.contains('_spoller-active')) {
          if (title.nextElementSibling) {
            title.nextElementSibling.hidden = true;
          }
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
        const [breakpoint, operator] = spollersBlock.dataset.spollers.split(",");
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
        spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
        spollerTitles.forEach((spollerTitle => {
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
        }));
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
      showMoreBlocks.forEach(block => {
        showmore(block);
      });
    }
  }
}

function checkAndSwitchMode() {
  const mediaQuery = window.matchMedia('(min-width: 601px)');
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
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      checkAndSwitchMode();
    });
  } else {
    checkAndSwitchMode();
  }

  window.addEventListener('resize', () => {
    checkAndSwitchMode();
  });
}

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
