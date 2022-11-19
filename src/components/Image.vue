<template>
  <img  :class="lazyLoaded && this.src !== '' ? 'loaded' : null" src="data:image/gif;base64,R0lGODlhAwADAIAAAP///8zMzCh2BAAAAAAALAAAAAADAAMAAAIEBHIJBQA7" :data-src="this.src" :alt="this.alt" :style="img_styles" />
</template>

<script>
export default {
  name: 'ImageWc',

  data() {
    return {
      lazyLoaded: false,
      // use device size vs window size for intial source selection
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
      fitment: '',
      timeout: null,
      observer: null
    }
  },

  props: {
    src: { default: '', type: String },
    alt: { default: 'Feature Image', type: String },
    fit: { default: 'contain', type: String },
    maxw: { default: '', type: String },
    minw: { default: '', type: String },
    maxh: { default: '', type: String },
    minh: { default: '', type: String },
    align: { default: 'center center', type: String }
  },

  computed: {
    img_styles() {
      let str = ''
      str += this.maxWidth !== '0' ? `max-width: ${this.maxWidth}; ` : ''
      str += this.minWidth !== '0' ? `min-width: ${this.minWidth}; ` : ''
      str += this.maxHeight !== '0' ? `max-height: ${this.maxHeight}; ` : ''
      str += this.minHeight !== '0' ? `min-height: ${this.minHeight};` : ''
      str += `object-fit: ${this.fit}; background-position: ${this.alignment}`
      return str
    }
  },

  created() {
    this.observer = new IntersectionObserver(
      // sets an intersection oberver on the component
      this.onElementObserved, { root: this.$el, threshold: 0.1 }
    )
  },

  mounted() {
    this.getBreakPointValues()
    window.addEventListener('resize', this.onResize)
    this.observer.observe(this.$el)
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
      this.timeout = setTimeout(() => { this.displayWidth = window.innerWidth }, 150)
    },
    getBreakPointValues() {
      // set user input property values by breakpoint
      let theMaxw = this.maxw.split(',')
      let theMinw = this.minw.split(',')
      let theMaxh = this.maxh.split(',')
      let theMinh = this.minh.split(',')
      let theAlign = this.align.split(',') 
      let theFit = this.fit.split(',') 
      this.maxWidth = theMaxw[0]
      this.minWidth = theMinw[0]
      this.maxHeight = theMaxh[0]
      this.minHeight = theMinh[0]
      this.alignment = theAlign[0]
      this.fitment = theFit[0]
      switch (true) {
        case this.displayWidth >= this.bp_sm && this.displayWidth < this.bp_md:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 2 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 2 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 2 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 2 ? theMinh[i] : this.minHeight
          for (let i in theAlign) this.alignment = theAlign[i] != undefined && theAlign[i] != '' && i < 2 ? theAlign[i] : this.alignment
          for (let i in theFit) this.fitment = theFit[i] != undefined && theFit[i] != '' && i < 2 ? theFit[i] : this.fitment
          break
        case this.displayWidth >= this.bp_md && this.displayWidth < this.bp_lg:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 3 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 3 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 3 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 3 ? theMinh[i] : this.minHeight
          for (let i in theAlign) this.alignment = theAlign[i] != undefined && theAlign[i] != '' && i < 3 ? theAlign[i] : this.alignment
          for (let i in theFit) this.fitment = theFit[i] != undefined && theFit[i] != '' && i < 3 ? theFit[i] : this.fitment
          break
        case this.displayWidth >= this.bp_lg && this.displayWidth < this.bp_xl:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 4 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 4 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 4 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 4 ? theMinh[i] : this.minHeight
          for (let i in theAlign) this.alignment = theAlign[i] != undefined && theAlign[i] != '' && i < 4 ? theAlign[i] : this.alignment
          for (let i in theFit) this.fitment = theFit[i] != undefined && theFit[i] != '' && i < 4 ? theFit[i] : this.fitment
          break
        case this.displayWidth >= this.bp_xl:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' ? theMinh[i] : this.minHeight
          for (let i in theAlign) this.alignment = theAlign[i] != undefined && theAlign[i] != '' ? theAlign[i] : this.alignment
          for (let i in theFit) this.fitment = theFit[i] != undefined && theFit[i] != '' ? theFit[i] : this.fitment
          break
      }
    },
    getImageSrc() {
      // deteremine best source image based on device size
      let srcList = this.src.split(',')
      let imgSrc = srcList[0]
      switch (true) {
        case this.displayWidth >= this.bp_sm && this.displayWidth < this.bp_md:
          for (let i in srcList) imgSrc = srcList[i] != undefined && srcList[i] != '' && i < 2 ? srcList[i] : imgSrc
          this.$el.src = imgSrc
          break
        case this.displayWidth >= this.bp_md && this.displayWidth < this.bp_lg:
          for (let i in srcList) imgSrc = srcList[i] != undefined && srcList[i] != '' && i < 3 ? srcList[i] : imgSrc
          this.$el.src = imgSrc
          break
        case this.displayWidth >= this.bp_lg && this.displayWidth < this.bp_xl:
          for (let i in srcList) imgSrc = srcList[i] != undefined && srcList[i] != '' && i < 4 ? srcList[i] : imgSrc
          this.$el.src = imgSrc
          break
        case this.displayWidth >= this.bp_xl:
          for (let i in srcList) imgSrc = srcList[i] != undefined && srcList[i] != '' ? srcList[i] : imgSrc
          this.$el.src = imgSrc
          break
        default:
          this.$el.src = imgSrc
      }
    }
  },

  watch: {
    displayWidth() { this.getBreakPointValues() },
    lazyLoaded() { if (this.src !== '') this.getImageSrc() }
  }
}
</script>

<style lang="scss" scoped>

  @keyframes gradient {
    0% { background-position: 0% }
    100% { background-position: 100%; }
  }

  img {
    width: auto;
    max-width: 100%;
    height: 100%;
    border-radius: 2.5rem;
    position: relative;
    background: linear-gradient(100deg,#b3b3b3, #555454, #b3b3b3 , #515252,#b3b3b3, #555554);
    background-size: 600% 100%;
    background-clip: border-box;
    animation: gradient 5s linear infinite;
    animation-direction: alternate;
    opacity: 0.15;
    display: block;

    &.loaded { 
      width: 100%;
      border-radius: 0;
      background: none; 
      opacity: 1;
    }
  }

</style>
