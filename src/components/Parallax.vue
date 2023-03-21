<template>
  <div class="parallax-wrap" :style="wrap_styles">
    <img :class="lazyLoaded && this.src !== '' ? 'loaded' : null" 
          src="data:image/gif;base64,R0lGODlhAwADAIAAAP///8zMzCh2BAAAAAAALAAAAAADAAMAAAIEBHIJBQA7" 
          :data-src="this.src" :alt="this.alt" :style="parallax + img_styles" />
    <slot name="svg"></slot>
  </div>
</template>

<script>
export default {
  name: 'ParallaxWc',

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
      parallax: '',
      topBounds: 0,
      btmBounds: 0,
      timeout: null,
      observer: null
    }
  },

  props: {
    src: { default: '', type: String },
    alt: { default: 'Parallax Image', type: String },
    maxw: { default: '', type: String },
    minw: { default: '', type: String },
    maxh: { default: '', type: String },
    minh: { default: '', type: String },
    percent: { default: '15', type: String },
    inline: { default: 'false', type: String },
    duration: { default: '0', type: String },
    attribute: { default: '', type: String },
    dasharray: { default: '', type: String }
  },

  computed: {

    img_styles() {
      return this.inline == 'false' ? `height: ${100 + parseInt(this.percent)*2}%;` : 'transform-origin: center;'
    },
    wrap_styles() {
      let str = ''
      str += this.maxWidth !== '0' ? `max-width: ${this.maxWidth}; ` : ''
      str += this.minWidth !== '0' ? `min-width: ${this.minWidth}; ` : ''
      str += this.maxHeight !== '0' ? `max-height: ${this.maxHeight}; ` : ''
      str += this.minHeight !== '0' ? `min-height: ${this.minHeight};` : ''
      str += this.inline == 'false' ? 'overflow: hidden;' : 'align-items: flex-end;'
      return str
    }

  },

  created() {
    this.observer = new IntersectionObserver(
      // sets an intersection oberver on the component
      this.onElementObserved, { root: this.$el, threshold: 0.1 }
    );
  },

  mounted() {
    this.parallax = ''
    this.getBreakPointValues()
    this.getBounds()
    window.addEventListener('resize', this.onResize)
    window.addEventListener('scroll', this.onScroll)
    this.observer.observe(this.$el)
  },

  beforeDestroy() { 
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('scroll', this.onScroll)
    this.observer.disconnect()
  },

  methods: {  

    onElementObserved(entries) {
      // use the observer to lazyload and track intersection ratio
      entries.forEach(({ isIntersecting}) => {
        if (isIntersecting) 
          if (!this.lazyLoaded) this.lazyLoaded = true
          else this.onScroll()
      });
    },
    onResize() {
      // debounced resize  
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => { 
        this.displayWidth = window.innerWidth 
        this.getBounds()
      }, 50)
    },
    onScroll() {
      window.requestAnimationFrame(() => {
        this.getBounds()
        this.animateImg()
      })
    },
    animateImg(offset) {
      if (offset) {
        if (this.attribute == '') {
          if (this.inline == 'true') this.parallax = `transform: translateY(${ (this.percent*2) * (offset*2)}%);`
          if (this.inline == 'false') this.parallax = `transform: translateY(${ - ((this.percent*2) * (offset)) }%);`
        } else {
          const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
          this.parallax = `${this.attribute}: ${ clamp(offset*(this.dasharray*2), 0, this.dasharray) }%;`
          this.$el.children.item(0).style = this.parallax + `stroke-dasharray: ${this.dasharray}%;`
        }
      }
    },
    getBounds() {
      let midScreen = window.innerHeight/2
      let ht = this.$el.getBoundingClientRect().height
      let hht = ht/2
      let mid = (this.topBounds+hht) - midScreen
      this.topBounds = this.$el.getBoundingClientRect().top - this.duration
      this.btmBounds = this.$el.getBoundingClientRect().bottom + this.duration
      let theDifference = mid/window.innerHeight
      if (this.topBounds < window.innerHeight && this.btmBounds > 0 && theDifference) this.animateImg( theDifference )
    },
    getBreakPointValues() {
      // set user input property values by breakpoint
      let theMaxw = this.maxw.split(',')
      let theMinw = this.minw.split(',')
      let theMaxh = this.maxh.split(',')
      let theMinh = this.minh.split(',')
      this.maxWidth = theMaxw[0]
      this.minWidth = theMinw[0]
      this.maxHeight = theMaxh[0]
      this.minHeight = theMinh[0]
      switch (true) {
        case this.displayWidth >= this.bp_sm && this.displayWidth < this.bp_md:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 2 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 2 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 2 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 2 ? theMinh[i] : this.minHeight
          break
        case this.displayWidth >= this.bp_md && this.displayWidth < this.bp_lg:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 3 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 3 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 3 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 3 ? theMinh[i] : this.minHeight
          break
        case this.displayWidth >= this.bp_lg && this.displayWidth < this.bp_xl:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 4 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 4 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 4 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 4 ? theMinh[i] : this.minHeight
          break
        case this.displayWidth >= this.bp_xl:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' ? theMinh[i] : this.minHeight
          break
      }
    },
    getImageSrc() {
      if (this.src == 'slot') {
        // replace template image if we have an SVG slot
        this.$el.replaceChild( this.$el.children.item(1).children.item(0), this.$el.children.item(0) )
      } else {
        // deteremine best source image based on device size
        let srcList = this.src.split(',')
        let imgSrc = srcList[0]
        switch (true) {
          case this.displayWidth >= this.bp_sm && this.displayWidth < this.bp_md:
            for (let i in srcList) imgSrc = srcList[i] != undefined && srcList[i] != '' && i < 2 ? srcList[i] : imgSrc
            this.$el.children.item(0).src = imgSrc
            break
          case this.displayWidth >= this.bp_md && this.displayWidth < this.bp_lg:
            for (let i in srcList) imgSrc = srcList[i] != undefined && srcList[i] != '' && i < 3 ? srcList[i] : imgSrc
            this.$el.children.item(0).src = imgSrc
            break
          case this.displayWidth >= this.bp_lg && this.displayWidth < this.bp_xl:
            for (let i in srcList) imgSrc = srcList[i] != undefined && srcList[i] != '' && i < 4 ? srcList[i] : imgSrc
            this.$el.children.item(0).src = imgSrc
            break
          case this.displayWidth >= this.bp_xl:
            for (let i in srcList) imgSrc = srcList[i] != undefined && srcList[i] != '' ? srcList[i] : imgSrc
            this.$el.children.item(0).src = imgSrc
            break
          default:
            this.$el.children.item(0).src = imgSrc
        }
      }
    }
  },

  watch: {
    displayWidth() { this.getBreakPointValues() },
    lazyLoaded() { if (this.src !== '') this.getImageSrc() }
  }
}
</script>

<style lang="scss">

  @keyframes gradient {
    0% { background-position: 0% }
    100% { background-position: 100%; }
  }

  .parallax-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    
    img {
      width: 100%;
      height: 100%;
      border-radius: 2.5rem;
      background: linear-gradient(100deg,#b3b3b3, #555454, #b3b3b3 , #515252,#b3b3b3, #555554);
      background-size: 600% 100%;
      background-clip: border-box;
      animation: gradient 5s linear infinite;
      animation-direction: alternate;
      opacity: 0.15;
      transform: translateY(0);
      transform-origin: center;
      transition: 0.1s;
      object-fit: cover;

      &.loaded { 
        border-radius: 0;
        background: none; 
        opacity: 1;
      }
    }


    svg {
      width: 100%;
      height: 100%;
    }
  }

</style>
