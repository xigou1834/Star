// 页面加载淡入
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';
setTimeout(() => {
  document.body.style.opacity = '1';
}, 100);

const dropdowns = document.querySelectorAll('.dropdown');
const searchDropdown = document.querySelector('.search-dropdown');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchPanel = document.querySelector('.search-panel');

let searchPanelHovered = false;
let searchInputFocused = false;

function closeAllDropdowns() {
  dropdowns.forEach(dropdown => {
    if (dropdown !== searchDropdown || !(searchPanelHovered || searchInputFocused)) {
      dropdown.classList.remove('active');
    }
  });
}

dropdowns.forEach(dropdown => {
  dropdown.addEventListener('mouseenter', function () {
    if (window.innerWidth > 768) {
      closeAllDropdowns();
      this.classList.add('active');
    }
  });

  dropdown.addEventListener('mouseleave', function () {
    if (window.innerWidth > 768 && this === searchDropdown) {
      setTimeout(() => {
        if (!searchPanelHovered && !searchInputFocused) {
          this.classList.remove('active');
        }
      }, 200);
    }
  });

  dropdown.addEventListener('click', function (e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const wasActive = this.classList.contains('active');
      closeAllDropdowns();
      if (!wasActive) {
        this.classList.add('active');
        if (this === searchDropdown) {
          searchInput?.focus();
        }
      }
    }
  });
});

searchPanel?.addEventListener('mouseenter', () => {
  searchPanelHovered = true;
  searchDropdown?.classList.add('active');
});

searchPanel?.addEventListener('mouseleave', () => {
  searchPanelHovered = false;
  setTimeout(() => {
    if (!searchInputFocused) {
      searchDropdown?.classList.remove('active');
    }
  }, 200);
});

searchInput?.addEventListener('focus', () => {
  searchInputFocused = true;
  searchDropdown?.classList.add('active');
});

searchInput?.addEventListener('blur', () => {
  searchInputFocused = false;
  setTimeout(() => {
    if (!searchPanelHovered) {
      searchDropdown?.classList.remove('active');
    }
  }, 200);
});

document.addEventListener('click', function (e) {
  if (!e.target.closest('.dropdown') &&
    !e.target.closest('.search-panel')) {
    closeAllDropdowns();
  }
});

searchForm?.addEventListener('submit', function (e) {
  e.preventDefault();
  const query = searchInput?.value.trim();
  if (query) {
    window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
  }
});
// 在原有代码基础上修改以下部分

let keepPanelOpen = false;

// 修改搜索表单提交处理
searchForm?.addEventListener('submit', function (e) {
  e.preventDefault();
  const query = searchInput?.value.trim();
  if (query) {
    keepPanelOpen = true;
    setTimeout(() => {
      window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
      keepPanelOpen = false;
    }, 500);
  }
});

// 修改 blur 事件处理
searchInput?.addEventListener('blur', () => {
  if (!keepPanelOpen) {
    searchInputFocused = false;
    setTimeout(() => {
      if (!searchPanelHovered && !searchInputFocused) {
        searchDropdown?.classList.remove('active');
      }
    }, 300);
  }
});