<template>
  <div id="carousel">
    <div class="carousel-wrap" :style="wrap_styles" @click="onClick" @mousemove="watchMouse">
      <slot name="slides"></slot>
    </div>
    <div class="dots" :data-count="slideCount" :data-curr="currIndex+1 + ' / '"></div>
    <div class="mouse-stalker index-start"></div>
  </div>
</template>

<script>
export default {
  name: 'CarouselWc',

  data() {
    return {
      carouselWrap: null,
      carouselSlides: null,
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
      viewable: '',
      timeout: null,
      loadObserver: null,
      mouseStalker: null,
      mouse_styles: '',
      mouseX: 0,
      mouseY: 0,
      move: 'next',
      slideCount: 0,
      scrollWidth: 0,
      currBounds: {},
      currWidth: 0,
      currLeft: 0,
      currIndex: 0,
      scrollTimeout: 0,
      scrolling: false
    }
  },

  props: {
    maxw: { default: '', type: String },
    minw: { default: '', type: String },
    maxh: { default: '', type: String },
    minh: { default: '', type: String },
    slideViewCount: { default: '1', type: String },
    align: { default: 'left', type: String },
    transition: { default: 'fade', type: String },
    arrows: { default: 'inside center apart', type: String },
    arrowsWrap: { default: '', type: String },
    dots: { default: 'outside center bottom', type: String },
    dotsType: { default: 'dot', type: String },
    dotsWrap: { default: '', type: String },
    infinite: { default: '', type: String }
  },

  computed: {

    wrap_styles() {
      let str = ''
      str += this.maxWidth !== '0' ? `max-width: ${this.maxWidth}; ` : ''
      str += this.minWidth !== '0' ? `min-width: ${this.minWidth}; ` : ''
      str += this.maxHeight !== '0' ? `max-height: ${this.maxHeight}; ` : ''
      str += this.minHeight !== '0' ? `min-height: ${this.minHeight};` : ''
      str += `justify-content: ${this.alignment}`
      return str
    }

  },

  created() {
    this.loadObserver = new IntersectionObserver(
      // sets an intersection oberver on the component
      this.onElementObserved, { root: this.$el, threshold: 0.1 }
    );
  },

  mounted() {
    this.getCarouselElements()
    this.getBreakPointValues()
    this.carouselWrap.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.onResize)
    this.loadObserver.observe(this.$el);
  },

  beforeDestroy() { 
    window.removeEventListener('resize', this.onResize)
    this.loadObserver.disconnect()
  },

  methods: {  

    onElementObserved(entries) {
      // use the observer to lazyload them disconnect it
      entries.forEach(({ isIntersecting}) => {
        if (!this.lazyLoaded && isIntersecting) { 
          this.lazyLoaded = true
          this.loadObserver.disconnect()
        }
      });
    },
    onResize() {
      // methods ran on resize with debounce
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => { this.displayWidth = window.innerWidth })
    },
    onScroll() {
      this.scrolling = true
      clearTimeout(this.scrollTimeout)
      this.scrollTimeout = setTimeout(() => {
        this.scrolling = false
        this.getIndex()
      },150)
    },
    watchMouse(e) { 
      this.mouseX = e.pageX 
      this.mouseY = e.pageY
      if (this.infinite == 'true') this.mouseStalker.classList.add('infinite')
      window.requestAnimationFrame(() => {
        this.mouseStalker.style.top = (this.mouseY - (window.scrollY + this.currBounds.top))-30 +'px'
        this.mouseStalker.style.left = (this.mouseX - this.currBounds.left)-20 +'px'
      })
    },
    onClick() {
      this.getDims()
      if (this.move == 'next') {
        if (this.currIndex == this.slideCount-1 && this.infinite == 'true') { 
          this.$el.querySelector('.clone-next').appendChild(this.$el.querySelectorAll('.slide')[0].cloneNode(true))
          this.carouselWrap.classList.add('over-next')
          this.$el.querySelector('.clone-next').classList.add('over-next')
          setTimeout(() => { 
            this.carouselWrap.classList.remove('over-next')
            this.$el.querySelector('.clone-next').classList.remove('over-next')
            this.carouselWrap.scrollTo({ left: 0, behavior: 'auto' })
          }, 300)
        }
        else this.carouselWrap.scrollTo({ left: this.currLeft+this.currWidth, behavior: 'smooth' })
      }
      if (this.move == 'prev') {
        if (this.currIndex == 0 && this.infinite == 'true') {
          this.$el.querySelector('.clone-prev').appendChild(this.$el.querySelectorAll('.slide')[this.slideCount-1].cloneNode(true))
          this.carouselWrap.classList.add('over-prev')
          this.$el.querySelector('.clone-prev').classList.add('over-prev')
          setTimeout(() => {
            this.carouselWrap.classList.remove('over-prev')
            this.$el.querySelector('.clone-prev').classList.remove('over-prev')
            this.carouselWrap.scrollTo({ left: this.scrollWidth-this.currWidth, behavior: 'auto' })
          }, 300)
        }
        else this.carouselWrap.scrollTo({ left: this.currLeft-this.currWidth, behavior: 'smooth' })
      }
    },
    getCarouselElements() {
      if (this.carouselWrap == null) this.carouselWrap = this.$el.querySelector('.carousel-wrap')
      if (this.carouselSlides == null) this.carouselSlides = this.$el.querySelector('.carousel-wrap').children.item(0)
      if (this.mouseStalker == null) this.mouseStalker = this.$el.querySelector('.mouse-stalker')
    },
    getIndex() {
      this.getDims()
      this.currIndex = Math.round(this.currLeft/this.currWidth)
    },
    getDims() {
      this.currBounds = this.carouselWrap.getBoundingClientRect()
      this.currWidth = this.carouselWrap.clientWidth
      this.currLeft = this.carouselWrap.scrollLeft
      this.scrollWidth = this.carouselWrap.scrollWidth
    },
    buildSlides() {
      // slides will be in our "slides" slot
      if (this.carouselSlides && this.carouselSlides.children.length > 0) {
        this.slideCount = this.carouselSlides.children.length
        let isActive = 0
        let prevClone = document.createElement('div') 
        let nextClone = document.createElement('div')
        while (this.carouselSlides.children[0]) {
          let theSlide = document.createElement('div')
          if (isActive == 0) { 
            theSlide.setAttribute('class','slide active')
            prevClone.setAttribute('class','clone clone-next')
          } else { 
            theSlide.setAttribute('class','slide') 
            nextClone.setAttribute('class','clone clone-prev')
          }
          theSlide.appendChild(this.carouselSlides.children[0])
          this.carouselWrap.appendChild(theSlide)
          isActive++ 
        }
        if (this.infinite == 'true') {
          this.$el.insertBefore(nextClone, this.carouselWrap)
          this.$el.insertBefore(prevClone, this.carouselWrap.nextSibling)
        }
      }
    },
    getBreakPointValues() {
      // set user input property values by breakpoint
      let theMaxw = this.maxw.split(',')
      let theMinw = this.minw.split(',')
      let theMaxh = this.maxh.split(',')
      let theMinh = this.minh.split(',')
      let theAlign = this.align.split(',') 
      let theCount = this.slideViewCount.split(',') 
      this.maxWidth = theMaxw[0]
      this.minWidth = theMinw[0]
      this.maxHeight = theMaxh[0]
      this.minHeight = theMinh[0]
      this.alignment = theAlign[0]
      this.viewable = theCount[0]
      switch (true) {
        case this.displayWidth >= this.bp_sm && this.displayWidth < this.bp_md:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 2 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 2 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 2 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 2 ? theMinh[i] : this.minHeight
          for (let i in theAlign) this.alignment = theAlign[i] != undefined && theAlign[i] != '' && i < 2 ? theAlign[i] : this.alignment
          for (let i in theCount) this.viewable = theCount[i] != undefined && theCount[i] != '' && i < 2 ? theCount[i] : this.viewable
          break
        case this.displayWidth >= this.bp_md && this.displayWidth < this.bp_lg:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 3 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 3 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 3 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 3 ? theMinh[i] : this.minHeight
          for (let i in theAlign) this.alignment = theAlign[i] != undefined && theAlign[i] != '' && i < 3 ? theAlign[i] : this.alignment
          for (let i in theCount) this.viewable = theCount[i] != undefined && theCount[i] != '' && i < 3 ? theCount[i] : this.viewable
          break
        case this.displayWidth >= this.bp_lg && this.displayWidth < this.bp_xl:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 4 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 4 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 4 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 4 ? theMinh[i] : this.minHeight
          for (let i in theAlign) this.alignment = theAlign[i] != undefined && theAlign[i] != '' && i < 4 ? theAlign[i] : this.alignment
          for (let i in theCount) this.viewable = theCount[i] != undefined && theCount[i] != '' && i < 4 ? theCount[i] : this.viewable
          break
        case this.displayWidth >= this.bp_xl:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' ? theMinh[i] : this.minHeight
          for (let i in theAlign) this.alignment = theAlign[i] != undefined && theAlign[i] != '' ? theAlign[i] : this.alignment
          for (let i in theCount) this.viewable = theCount[i] != undefined && theCount[i] != '' ? theCount[i] : this.viewable
          break
      }
    }
  },

  watch: {
    displayWidth() { this.getBreakPointValues() },
    lazyLoaded() { this.buildSlides() },
    mouseX() { 
      this.getDims()
      let thisMid = this.currBounds.left + (this.currWidth/2)
      this.move = this.mouseX > (thisMid) ? 'next' : 'prev' 
      this.mouseStalker.classList.remove('m-prev', 'm-next')
      if (this.move == 'next') this.mouseStalker.classList.add('m-next')
      if (this.move == 'prev') this.mouseStalker.classList.add('m-prev')
    },
    currIndex() { 
      // console.log(this.currIndex) 
      let theSlides = this.carouselWrap.querySelectorAll('.slide')
      let theSlug = ''
      this.mouseStalker.classList.remove('index-start', 'index-end')
      if (this.currIndex == 0) theSlug = 'index-start'
      if (this.currIndex == this.slideCount-1) theSlug = 'index-end'
      for (let x=0; x<theSlides.length; x++) { theSlides[x].classList.remove('active') }
      theSlides[this.currIndex].classList.add('active')
      if (theSlug != "") this.mouseStalker.classList.add(theSlug)
    }
  }
}
</script>

<style lang="scss">

  @keyframes gradient {
    0% { background-position: 0% }
    100% { background-position: 100%; }
  }

  #carousel {
    width: auto; 
    height: auto; 
    position: relative;
    overflow: hidden;

    > .clone {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      transition: 0s;
      overflow: hidden;

      &.clone-next { right: -100%; }
      &.clone-prev { left: -100%; }
      
      &.clone-next.over-next { 
        transform: translateX(-100%);
        transition: 0.45s;
      }
      &.clone-prev.over-prev { 
        transform: translateX(100%);
        transition: 0.45s;
      }
    }

    .mouse-stalker {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(0,0,0,0.2);
      color: white;
      font-size: 150%;
      display: grid;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: 0.1s;
      pointer-events: none;
      z-index: 100;
    }

    &:hover .mouse-stalker {
      opacity: 1;
      &.m-next::before { content: '\003E'; }
      &.m-prev::before { content: '\003C'; }
    }

    &:hover .mouse-stalker:not(.infinite) {
      &.m-next.index-end::before { content: '\00D7'; }
      &.m-prev.index-start::before { content: '\00D7'; }
    }
  }

  .carousel-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    transition: 0s;
    display: flex;
    justify-content: left;
    align-items: center;
    box-sizing: border-box;
    overflow: hidden;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    &::-webkit-scrollbar { display: none; } /* Chrome */

    &.over-prev { 
      transform: translateX(100%); 
      transition: 0.45s;
    }
    &.over-next { 
      transform: translateX(-100%); 
      transition: 0.45s;
    }
  }

  .slide {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(100deg,#b3b3b3, #555454, #b3b3b3 , #515252,#b3b3b3, #555554);
    background-size: 600% 100%;
    background-clip: border-box;
    animation: gradient 5s linear infinite;
    animation-direction: alternate;
    opacity: 0.15;
    flex: 1 0 auto;
    scroll-snap-align: center;

    &:not(:empty) { 
      border-radius: 0;
      background: none; 
      opacity: 1;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover !important;
    }
  }

  .dots {
    padding: 5px 10px;
    border-radius: 15px;
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.2);
    color: white;

    &::before {
      content: attr(data-curr);
    }

    &::after {
      content: attr(data-count);
    }
  }

</style>
