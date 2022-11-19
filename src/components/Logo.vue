<template>
  <div class="logo-wrap" :style="wrap_styles">
    <img :class="lazyLoaded && this.src !== '' ? 'loaded' : null" src="data:image/gif;base64,R0lGODlhAwADAIAAAP///8zMzCh2BAAAAAAALAAAAAADAAMAAAIEBHIJBQA7" :data-src="this.src" :alt="this.alt" :style="img_styles" />
  </div>
</template>

<script>
export default {
  name: 'LogoWc',

  data() {
    return {
      lazyLoaded: false,
      displayWidth: window.screen.width,
      bp_sm: 576,
      bp_md: 768,
      bp_lg: 992,
      bp_xl: 1200,
      maxWidth: '0',
      minWidth: '0',
      maxHeight: '0',
      minHeight: '0',
      alignment: '',
      padding: '',
      timeout: null,
      observer: null
    }
  },

  props: {
    src: { default: '', type: String },
    alt: { default: 'Logo', type: String },
    pad: { default: '10px', type: String },
    maxw: { default: '', type: String },
    minw: { default: '', type: String },
    maxh: { default: '', type: String },
    minh: { default: '', type: String },
    align: { default: 'left', type: String }
  },

  computed: {

    img_styles() {
      let str = ''
      str += this.maxWidth !== '0' ? `max-width: ${this.maxWidth}; ` : ''
      str += this.minWidth !== '0' ? `min-width: ${this.minWidth}; ` : ''
      str += this.maxHeight !== '0' ? `max-height: ${this.maxHeight}; ` : ''
      str += this.minHeight !== '0' ? `min-height: ${this.minHeight};` : ''
      return str
    },
    wrap_styles() {
      return `padding: ${this.padding};justify-content: ${this.alignment}`
    }

  },

  created() {
    this.observer = new IntersectionObserver(
      // sets an intersection oberver on the component
      this.onElementObserved, { root: this.$el, threshold: 0.1 }
    );
  },

  mounted() {
    this.getBreakPointValues()
    window.addEventListener('resize', this.onResize)
    this.observer.observe(this.$el);
  },

  beforeDestroy() { 
    window.removeEventListener('resize', this.onResize)
    this.observer.disconnect()
  },

  methods: {  

    onElementObserved(entries) {
      // use the observer to lazyload them disconnect it
      entries.forEach(({ isIntersecting}) => {
        if (!this.lazyLoaded && isIntersecting) { 
          this.lazyLoaded = true
          this.observer.disconnect()
        }
      });
    },
    onResize() {
      // methods ran on resize with debounce
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => { this.displayWidth = window.innerWidth })
    },
    getBreakPointValues() {
      // set user input property values by breakpoint
      let theMaxw = this.maxw.split(',')
      let theMinw = this.minw.split(',')
      let theMaxh = this.maxh.split(',')
      let theMinh = this.minh.split(',')
      let theAlign = this.align.split(',') 
      let thePad = this.pad.split(',') 
      this.maxWidth = theMaxw[0]
      this.minWidth = theMinw[0]
      this.maxHeight = theMaxh[0]
      this.minHeight = theMinh[0]
      this.alignment = theAlign[0]
      this.padding = thePad[0]
      switch (true) {
        case this.displayWidth >= this.bp_sm && this.displayWidth < this.bp_md:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 2 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 2 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 2 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 2 ? theMinh[i] : this.minHeight
          for (let i in theAlign) this.alignment = theAlign[i] != undefined && theAlign[i] != '' && i < 2 ? theAlign[i] : this.alignment
          for (let i in thePad) this.padding = thePad[i] != undefined && thePad[i] != '' && i < 2 ? thePad[i] : this.padding
          break
        case this.displayWidth >= this.bp_md && this.displayWidth < this.bp_lg:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 3 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 3 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 3 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 3 ? theMinh[i] : this.minHeight
          for (let i in theAlign) this.alignment = theAlign[i] != undefined && theAlign[i] != '' && i < 3 ? theAlign[i] : this.alignment
          for (let i in thePad) this.padding = thePad[i] != undefined && thePad[i] != '' && i < 3 ? thePad[i] : this.padding
          break
        case this.displayWidth >= this.bp_lg && this.displayWidth < this.bp_xl:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 4 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 4 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 4 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 4 ? theMinh[i] : this.minHeight
          for (let i in theAlign) this.alignment = theAlign[i] != undefined && theAlign[i] != '' && i < 4 ? theAlign[i] : this.alignment
          for (let i in thePad) this.padding = thePad[i] != undefined && thePad[i] != '' && i < 4 ? thePad[i] : this.padding
          break
        case this.displayWidth >= this.bp_xl:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' ? theMinh[i] : this.minHeight
          for (let i in theAlign) this.alignment = theAlign[i] != undefined && theAlign[i] != '' ? theAlign[i] : this.alignment
          for (let i in thePad) this.padding = thePad[i] != undefined && thePad[i] != '' ? thePad[i] : this.padding
          break
      }
    }
  },

  watch: {
    displayWidth() { this.getBreakPointValues() },
    lazyLoaded() { if (this.src !== '') this.$el.children.item(0).src = this.$el.children.item(0).dataset.src }
  }
}
</script>

<style lang="scss">

  @keyframes gradient {
    0% { background-position: 0% }
    100% { background-position: 100%; }
  }

  .logo-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(100deg,#b3b3b3, #555454, #b3b3b3 , #515252,#b3b3b3, #555554);
      background-size: 600% 100%;
      background-clip: border-box;
      animation: gradient 5s linear infinite;
      animation-direction: alternate;
      opacity: 0.15;
      object-fit: contain;

      &.loaded { 
        border-radius: 0;
        background: none; 
        opacity: 1;
      }
    }
  }

</style>
