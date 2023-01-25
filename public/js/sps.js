/*
SINGLE PAGE SITES JS CLASS
Dependencies: family, good food, good music and any browser that supports modern APIs
Authors: Ron L
*/
const SPS_CONSTRUCTOR = (function (config) {
  /* Base Configuration */
  const cfg = config;
  cfg.windowTop = 0,
  cfg.fixedHead = false,
  cfg.header_offset = 0,
  cfg.header_scrolled = false,
  cfg.page_list = [],
  cfg.ignore_list = [],
  cfg.nav_page_list = null,
  cfg.current_page = null,
  cfg.current_page_path = null,
  cfg.current_page_query = null,
  cfg.scroll_offset = 0,
  cfg.scrolling = false,
  cfg.scrollTimeout = null,
  cfg.header_id = cfg.header_id || 'header',
  cfg.wrapper = cfg.wrapper_id || 'wrapper',
  cfg.nav_selector= cfg.nav_item || '.nav-item';

  /* HELPER METHODS */
  const methods = {
    onScroll(event) {
      let oldHeader_state = cfg.header_scrolled;
      cfg.scrolling = true;
      cfg.windowTop = event.target.documentElement.scrollTop;
      cfg.header_scrolled = cfg.windowTop > (parseInt(cfg.header_offset)/2) ? true : false;
      clearTimeout(cfg.scrollTimeout);
      cfg.scrollTimeout = setTimeout(function(){ 
        cfg.scrolling = false; 
        methods.checkHead();
        methods.currentPage(); 
        if (cfg.header_scrolled != oldHeader_state) {
          if (cfg.fixedHead) {
            let duration = window.getComputedStyle(document.querySelector(cfg.header_id)).transitionDuration || 0; 
            setTimeout(function() { methods.checkHead(); }, parseFloat(duration)*1000 );
          }
        }
      }, 50);
    },

    checkHead() {
      let old_offset = cfg.scroll_offset;
      cfg.fixedHead = window.getComputedStyle(document.getElementById(cfg.header_id)).position == 'fixed';
      cfg.header_offset = cfg.fixedHead ? document.getElementById(cfg.header_id).offsetHeight+'px' : 0;
      cfg.scroll_offset = parseInt( cfg.header_offset );
      if (old_offset !== cfg.scroll_offset) document.getElementById(cfg.wrapper_id).style.paddingTop = cfg.scroll_offset;
    },

    getPages() {
      let pages_html = document.getElementsByClassName('block-area');
      Array.from(pages_html).forEach(function(e) { 
        let isIgnored = e.dataset.path || null;
        if (!isIgnored) cfg.page_list.push(e.id); 
        if (isIgnored == '/') cfg.ignore_list.push(e.id);
      });
    },

    updateNav(page_id) {
      let the_navs = document.querySelectorAll(cfg.nav_selector);
      Array.from(the_navs).forEach(function(e) { 
        e.classList.remove('active');
        if (e.id && e.id.replace('Nav','') == page_id) e.classList.add('active');
      });
    },

    currentPage() {
      let old_page = cfg.current_page || '', page_id = '';
      if (cfg.page_list.length > 1 && page_id == '') {
        for (var i=0; i<cfg.page_list.length; i++) {
          let curr_page_id = cfg.page_list[i];
          let curr_page = document.getElementById(curr_page_id);
          let curr_page_dims = curr_page.getBoundingClientRect();
          let curr_page_top = curr_page_dims.top - parseInt(cfg.header_offset);
          let curr_page_btm = curr_page_top + curr_page_dims.height; 
          if ( curr_page_top < 0 && curr_page_btm > 0 && !cfg.scrolling ) page_id = curr_page_id;
        }
      }
      if (cfg.ignore_list.length > 1 && page_id == '') {
        for (var i=0; i<cfg.ignore_list.length; i++) {
          let curr_page_id = cfg.ignore_list[i];
          let curr_page = document.getElementById(curr_page_id);
          let curr_page_dims = curr_page.getBoundingClientRect();
          let curr_page_top = curr_page_dims.top - parseInt(cfg.header_offset);
          let curr_page_btm = curr_page_top + curr_page_dims.height; 
          if ( curr_page_top < 0 && curr_page_btm > 0 && !cfg.scrolling ) page_id = curr_page_id;
        }
      }
      cfg.current_page = cfg.ignore_list.indexOf(page_id) < 0 ? page_id : '';
      if (cfg.current_page !== old_page) {
        methods.updateNav(page_id)
        let newPath = cfg.current_page_path +'/'+ cfg.current_page.replace('#','') + cfg.current_page_query
        if (window.history && window.history.pushState) history.replaceState({ page: cfg.current_page}, '', newPath);
      }
    },

    initPagePath() {
      cfg.current_page_query = window.location.search || '';
      let path_parts = window.location.pathname.split('/');
      cfg.current_page_path = '/' + (path_parts && path_parts.length > 1 ? path_parts[1] : '');
      let page_area = path_parts && path_parts.length > 0 ? path_parts[1] : null; 
      let scrollBehavior = window.matchMedia('(any-pointer: coarse)').matches ? 'auto' : 'smooth';
      if (page_area && cfg.page_list.indexOf(page_area) > -1) window.scrollTo({ top: (document.querySelector('#'+page_area).offsetTop - cfg.scroll_offset)+1, behavior: scrollBehavior }); //methods.scrollPage('#'+page_area); 
    },

    scrollPage(theTarget) {
      if ( theTarget && theTarget[0] == '#' && theTarget.length > 1 ) {
        let targetTop = document.querySelector(theTarget).getBoundingClientRect().top;
        let scrollBehavior = window.matchMedia('(any-pointer: coarse)').matches ? 'auto' : 'smooth';
        if ( (window.scrollY + cfg.scroll_offset) > document.querySelector(theTarget).offsetTop ) targetTop = document.querySelector(theTarget).offsetTop;
        window.scrollTo({ top: (targetTop - cfg.scroll_offset)+1, behavior: scrollBehavior });
      } 
    }

  };

  /* INIT METHOD - INITS SINGLE PAGE SITE, USUALLY IN WINDOW READY */
  const init = function () {
    methods.checkHead();
    methods.getPages();
    methods.initPagePath();
    window.addEventListener("scroll", methods.onScroll);
    window.addEventListener("resize", methods.checkHead);
    window.addEventListener("resize", methods.currentPage);
  };

  return { init: init };
});
