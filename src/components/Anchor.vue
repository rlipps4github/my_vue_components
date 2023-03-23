<template>
  <a :id="aid" :onclick="anchor_onclick" :href="url" :title="atitle || lbl" :style="anchor_styles" @click="anchorClick" :target="sps=='false' ? '_blank' : ''">
    <div class="prefix" :style="slot1_styles"><slot name="prefix"></slot></div>
    {{ lbl }}
    <div class="suffix" :style="slot2_styles"><slot name="suffix"></slot></div>
  </a>
</template>

<script>
export default {
  name: 'AnchorWc',

  data() {
    return {
      window_top: 0,
      displayWidth: window.innerWidth,
      bp_sm: 576,
      bp_md: 768,
      bp_lg: 992,
      bp_xl: 1200,
      anchor_padding: '',
      slot_padding: '',
      fixed_head: false,
      header_offset: 0,
      page_target: null,
      target_top: 0,
      timeout: null
    }
  },

  props: {
    url: { default: 'javascript:;', type: String },
    anchorEvent: { default: '', type: String },
    popContainer: { default: '', type: String },
    pad: { default: '', type: String },
    slot_pad: { default: '', type: String },
    atitle: { default: '', type: String },
    aid: { default: '', type: String },
    lbl: { default: '', type: String },
    sps: { default: 'false', type: String },
    page_class: { default: 'block-area', type: String },
    page_depth: { default: '1', type: String }
  },

  computed: {

    anchor_onclick() {
      let theOnclick = this.anchorEvent != '' ? this.anchorEvent : ''
      return theOnclick
    },

    anchor_styles() {
      return `padding: ${this.anchor_padding};`
    },
    
    slot1_styles() {
      return `margin-right: ${this.slot_padding};`
    },
    
    slot2_styles() {
      return `margin-left: ${this.slot_padding};`
    },
  },

  mounted() {
    this.getPage()
    this.checkDims()
    window.addEventListener("scroll", this.onScroll)
    window.addEventListener("resize", this.checkDims)
    this.getBreakPointValues()
    if (this.popContainer != '' && !window.bindModalAnchorControls) this.bindModalControl()
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
      this.displayWidth = window.innerWidth
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
    getBreakPointValues() {
      // set user input property values by breakpoint
      let thePadding = this.pad.split(',')
      let theSlotPadding = this.slot_pad.split(',')
      this.anchor_padding = thePadding[0]
      this.slot_padding = theSlotPadding[0]
      switch (true) {
        case this.displayWidth >= this.bp_sm && this.displayWidth < this.bp_md:
          for (let i in thePadding) this.anchor_padding = thePadding[i] != undefined && thePadding[i] != '' && i < 2 ? thePadding[i] : this.anchor_padding
          for (let i in theSlotPadding) this.slot_padding = theSlotPadding[i] != undefined && theSlotPadding[i] != '' && i < 2 ? theSlotPadding[i] : this.slot_padding
          break
        case this.displayWidth >= this.bp_md && this.displayWidth < this.bp_lg:
          for (let i in thePadding) this.anchor_padding = thePadding[i] != undefined && thePadding[i] != '' && i < 3 ? thePadding[i] : this.anchor_padding
          for (let i in theSlotPadding) this.slot_padding = theSlotPadding[i] != undefined && theSlotPadding[i] != '' && i < 3 ? theSlotPadding[i] : this.slot_padding
          break
        case this.displayWidth >= this.bp_lg && this.displayWidth < this.bp_xl:
          for (let i in thePadding) this.anchor_padding = thePadding[i] != undefined && thePadding[i] != '' && i < 4 ? thePadding[i] : this.anchor_padding
          for (let i in theSlotPadding) this.slot_padding = theSlotPadding[i] != undefined && theSlotPadding[i] != '' && i < 4 ? theSlotPadding[i] : this.slot_padding
          break
        case this.displayWidth >= this.bp_xl:
          for (let i in thePadding) this.anchor_padding = thePadding[i] != undefined && thePadding[i] != '' ? thePadding[i] : this.anchor_padding
          for (let i in theSlotPadding) this.slot_padding = theSlotPadding[i] != undefined && theSlotPadding[i] != '' ? theSlotPadding[i] : this.slot_padding
          break
      }
    },
    buildPopup(html) {
      let popModal = document.createElement('div')
      popModal.classList.add('anchor-modal')
      popModal.setAttribute("style","width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,0.8);display:grid;z-index:9999;")
      let popTemplate = `
        <div class="modal-close" style="width:40px;height:40px;border-radius:50%;position:absolute;top:20px;right:20px;background:rgba(255,255,255,0.3);color:white;font-size:20px;display:flex;justify-content:center;align-items:center;">&times;</div>
        <div class="modal-img" style="width:100%;max-width:calc(100vw - 150px);height:100%;max-height:calc(100vh - 150px);margin:auto;display:flex;flex-direction:column;justify-content:center;align-items:center;"></div>  
      `
      if (document.querySelectorAll('.anchor-modal').length === 0) {
        document.body.append(popModal)
        let theModal = document.querySelector('.anchor-modal')
        theModal.innerHTML = popTemplate
        theModal.querySelector('.modal-img').innerHTML = html
        theModal.querySelector('.modal-close').addEventListener('click', () => { document.querySelector('.anchor-modal').remove() })
        theModal.focus()
      }
    },
    bindModalControl() {
      window.bindModalAnchorControls = true
      document.onkeydown = (e) => {
        if (document.querySelector('.anchor-modal')) {
          e.preventDefault()
          if (e.code == 'Escape') document.querySelector('.modal-close').click()
        }
      }
    },
    anchorClick(event) {
      let thePop = this.popContainer != '' ? document.querySelector(this.popContainer) : null
      // determine click event outcome- popup, onclick, external, internal or page nav
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
      if (thePop) {
        event.preventDefault();
        let thePopup = thePop.innerHTML
        this.buildPopup(thePopup)
      }
    }
  },
    
  watch: {
    displayWidth() { this.getBreakPointValues() },
  }
}


</script>

<style lang="scss">

a {
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;

  .suffix span,
  .prefix span { display: grid; }

  .suffix:empty,
  .prefix:empty { margin: 0 !important; }
}

</style>