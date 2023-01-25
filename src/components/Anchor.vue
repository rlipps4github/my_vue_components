<template>
  <a :id="aid" :href="url" :title="atitle || lbl" @click="anchorClick" :target="sps=='false' ? '_blank' : ''">
    <slot name="prefix"></slot>
    {{ lbl }}
    <slot name="suffix"></slot>
  </a>
</template>

<script>
export default {
  name: 'AnchorWc',

  data() {
    return {
      window_top: 0,
      fixed_head: false,
      header_offset: 0,
      page_target: null,
      target_top: 0,
      timeout: null
    }
  },

  props: {
    url: { default: '', type: String },
    atitle: { default: '', type: String },
    aid: { default: '', type: String },
    lbl: { default: '', type: String },
    sps: { default: 'false', type: String },
    page_class: { default: 'block-area', type: String },
    page_depth: { default: '1', type: String }
  },

  methods: {

    onScroll() {
      // methods to run on scroll with debounce
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.window_top = window.scrollY;
        this.checkDims();
      }, 150)
    },
    checkDims() {
      if (this.sps == 'true') {
        // get window, header and target dimentions
        this.window_top = window.scrollY;
        this.fixed_head = window.getComputedStyle(document.getElementById('header')).position == 'fixed';
        this.header_offset = this.fixed_head ? document.getElementById('header').offsetHeight : 0;
        this.target_top = document.querySelector(this.url).getBoundingClientRect().top;
      }
    },
    getPage() {
      // get the page target if this link is an sps nav link
      if (this.sps == 'true') {
        if (document.getElementById(this.url.replace('#',''))) {
          let linkedPage = document.getElementById(this.url.replace('#',''))
          if ( linkedPage.classList.contains(this.page_class) ) {
            this.page_target = linkedPage
            this.target_top = document.querySelector(this.url).getBoundingClientRect().top;
          }
        }
      }
    },
    getPath() {
      // get the initial path URL used to load the site
      let query = window.location.search;
      let oldPath = window.location.pathname.split('/');
      oldPath[parseInt(this.page_depth)] = this.url.replace('#','');
      return oldPath.join('/') + query
    },
    anchorClick(event) {
      // deteremine click event outcome- external, internal or page nav
      if (this.sps == 'true') {
        this.checkDims();
        event.preventDefault();
        let scrollBehavior = window.matchMedia('(any-pointer: coarse)').matches ? 'auto' : 'smooth'
        if (this.page_target !== null) {
          let newPath = this.getPath()
          if (window.history && window.history.pushState) history.pushState({ page: this.url }, '', newPath)
        }
        window.scrollTo({ top: this.target_top - parseInt(this.header_offset) + (this.window_top + 1), behavior: scrollBehavior })
      }
    }
  },

  mounted() {
    this.getPage()
    this.checkDims()
    window.addEventListener("scroll", this.onScroll)
    window.addEventListener("resize", this.checkDims)
  }
}
</script>

<style lang="scss">

a {
  color: inherit;
  text-decoration: none;
}

</style>