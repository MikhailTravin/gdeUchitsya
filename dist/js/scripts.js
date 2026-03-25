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

function initCustomDropdowns() {
  if (customDropdownsInitialized) return;

  const searchColumns = document.querySelectorAll('.block-intro-search__column');

  if (searchColumns.length) {
    searchColumns.forEach(column => {
      const button = column.querySelector('.block-intro-search__button');
      const titleSpan = column.querySelector('.block-intro-search__title span');
      const options = column.querySelectorAll('.options__input');

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

      newButton.addEventListener('click', (e) => {
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

      options.forEach(option => {
        const newOption = option.cloneNode(true);
        option.parentNode.replaceChild(newOption, option);

        newOption.addEventListener('click', (e) => {
          e.stopPropagation();

          const currentOptions = column.querySelectorAll('.options__input');
          currentOptions.forEach(opt => {
            if (opt !== newOption) {
              opt.checked = false;
            }
          });

          newOption.checked = true;

          const selectedText = newOption.closest('.options__item')
            .querySelector('.options__text').textContent;

          if (titleSpan) {
            titleSpan.textContent = selectedText;
          }

          closeDropdown();
        });
      });
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
}

function destroyCustomDropdowns() {
  if (!customDropdownsInitialized) return;

  const searchColumns = document.querySelectorAll('.block-intro-search__column');
  searchColumns.forEach(column => {
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
          _slideToggle(contentBlock, spollerSpeed, () => {
            if (spollerTitle.classList.contains("_spoller-active")) {
              setTimeout(() => initShowMoreInSpoller(contentBlock), 10);
            }
          });

          e.preventDefault();
        }
      }
    }

    function hideSpollersBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
      const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
      if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
        spollerActiveTitle.classList.remove("_spoller-active");
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
      }
    }
  }
}

function setupMobileOptionListeners() {
  const searchColumns = document.querySelectorAll('.block-intro-search__column');

  searchColumns.forEach(column => {
    const titleSpan = column.querySelector('.block-intro-search__title span');
    const spollerTitle = column.querySelector('[data-spoller]');
    const options = column.querySelectorAll('.options__input');

    options.forEach(option => {
      const newOption = option.cloneNode(true);
      option.parentNode.replaceChild(newOption, option);

      newOption.addEventListener('click', (e) => {
        e.stopPropagation();

        const currentOptions = column.querySelectorAll('.options__input');
        currentOptions.forEach(opt => {
          if (opt !== newOption) {
            opt.checked = false;
          }
        });

        newOption.checked = true;

        const selectedText = newOption.closest('.options__item')
          .querySelector('.options__text').textContent;

        if (titleSpan) {
          titleSpan.textContent = selectedText;
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
    });
  });
}

function checkAndSwitchMode() {
  const mediaQuery = window.matchMedia('(min-width: 601px)');
  const isDesktop = mediaQuery.matches;

  if (currentMediaQuery !== isDesktop) {
    currentMediaQuery = isDesktop;

    if (isDesktop) {
      destroySpollerForDesktop();
      initCustomDropdowns();
    } else {
      destroyCustomDropdowns();
      reinitSpollerForMobile();
      setupMobileOptionListeners();
    }
  }
}

function destroySpollerForDesktop() {
  const spollersBlocks = document.querySelectorAll('[data-spollers]');
  spollersBlocks.forEach(block => {
    if (block.classList.contains('_spoller-init')) {
      block.classList.remove('_spoller-init');

      const spollerTitles = block.querySelectorAll('[data-spoller]');
      spollerTitles.forEach(title => {
        title.setAttribute('tabindex', '-1');
        if (title.nextElementSibling) {
          title.nextElementSibling.hidden = false;
        }
        title.classList.remove('_spoller-active');
      });

      const newBlock = block.cloneNode(true);
      block.parentNode.replaceChild(newBlock, block);
    }
  });
}

function reinitSpollerForMobile() {
  const spollersBlocks = document.querySelectorAll('[data-spollers]');
  spollersBlocks.forEach(block => {
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

  spollers();
}

function initShowMoreInSpoller(element) {
  if (element && element.querySelector) {
    const showMoreBlocks = element.querySelectorAll('[data-showmore]');
    if (showMoreBlocks.length) {
      showMoreBlocks.forEach(block => {
        if (typeof showmore === 'function') {
          showmore(block);
        }
      });
    }
  }
}

checkAndSwitchMode();
window.addEventListener('resize', () => {
  checkAndSwitchMode();
});

//========================================================================================================================================================

const searchButton = document.querySelector('.header-search-button');

if (searchButton) {

  const searchBlock = document.querySelector('.header-search');
  const closeButton = document.querySelector('.header-search__close');

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

    if (isSearchOpen && headerSearch && headerLogo && headerRight && headerContent) {
      const logoWidth = headerLogo.offsetWidth;
      const leftGap = 12;
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
  function openSearch() {
    document.documentElement.classList.add('search-open');
    setSearchWidth();
  }
  function closeSearch() {
    document.documentElement.classList.remove('search-open');
    resetSearchWidth();
  }

  if (closeButton) {
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSearch();
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