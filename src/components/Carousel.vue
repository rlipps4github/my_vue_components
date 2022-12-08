<template>
  <div data-id="carousel" :data-view="viewable" :data-count="slideCount" :show-arrows="arrowsWrap=='' ? 'true' : 'false'">
    <div class="carousel-wrap" :style="wrap_styles" @click="onClick" @mousemove="watchMouse">
      <slot name="slides"></slot>
    </div>
    <div class="dots" :data-count="slideCount" :data-curr="currIndex+1 + '/'" :show-dots="dotsWrap =='' ? 'true' : 'false'"></div>
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
      displayWidth: window.innerWidth,
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
    arrowsWrap: { default: '', type: String },
    dotsWrap: { default: '', type: String },
    dotsType: { default: '', type: String },
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
      // attach an intersection oberver on the component
      this.onElementObserved, { root: this.$el, threshold: 0.1 }
    );
  },

  mounted() {
    this.setCarouselElements()
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
    lazyLoader(parent) {
      let imgset = parent.querySelectorAll('img')
      for (var i=0; i< imgset.length; i++) if (imgset[i].getAttribute('data-src')) imgset[i].setAttribute('src', imgset[i].getAttribute('data-src'))
    },
    onClick() {
      this.setDims()
      if (this.slideCount > 1) {
        if (this.move == 'next') {
          if (this.currIndex == this.slideCount-1 && this.infinite == 'true') { 
            if (this.$el.querySelector('.clone-next').childNodes.length == 0)
              this.$el.querySelector('.clone-next').appendChild(this.$el.querySelectorAll('.carousel-wrap .slide')[0].cloneNode(true))
              this.lazyLoader(this.$el.querySelector('.clone-next').querySelector('.slide'))
            this.carouselWrap.classList.add('over-next')
            this.$el.querySelector('.clone-next').classList.add('over-next')
            setTimeout(() => { 
              this.carouselWrap.classList.remove('over-next')
              this.$el.querySelector('.clone-next').classList.remove('over-next')
              this.carouselWrap.scrollTo({ left: 0, behavior: 'auto' })
            }, 450)
          }
          else this.carouselWrap.scrollTo({ left: this.currLeft+this.currWidth, behavior: 'smooth' })
        }
        if (this.move == 'prev') {
          if (this.currIndex == 0 && this.infinite == 'true') {
            if (this.$el.querySelector('.clone-prev').childNodes.length == 0) 
              this.$el.querySelector('.clone-prev').appendChild(this.$el.querySelectorAll('.carousel-wrap .slide')[this.slideCount-1].cloneNode(true))
              this.lazyLoader(this.$el.querySelector('.clone-prev').querySelector('.slide')) 
            this.carouselWrap.classList.add('over-prev')
            this.$el.querySelector('.clone-prev').classList.add('over-prev')
            setTimeout(() => {
              this.carouselWrap.classList.remove('over-prev')
              this.$el.querySelector('.clone-prev').classList.remove('over-prev')
              this.carouselWrap.scrollTo({ left: this.scrollWidth-this.currWidth, behavior: 'auto' })
            }, 450)
          }
          else this.carouselWrap.scrollTo({ left: this.currLeft-this.currWidth, behavior: 'smooth' })
        }
      }
    },
    goTo(idx) {
      this.setDims()
      if (this.currIndex != idx) {
        if (idx > this.currIndex) {
          let offset = this.currLeft + ((idx-this.currIndex) * this.currWidth)
          this.carouselWrap.scrollTo({ left: offset, behavior: 'smooth' })
        }
        if (idx < this.currIndex) {
          let offset = this.currLeft - ((this.currIndex-idx) * this.currWidth)
          this.carouselWrap.scrollTo({ left: offset, behavior: 'smooth' })
        }
      }
    },
    setCarouselElements() {
      if (this.carouselWrap == null) this.carouselWrap = this.$el.querySelector('.carousel-wrap')
      if (this.carouselSlides == null) this.carouselSlides = this.$el.querySelector('.carousel-wrap').children.item(0)
      if (this.mouseStalker == null) this.mouseStalker = this.$el.querySelector('.mouse-stalker')
    },
    getIndex() {
      this.setDims()
      this.currIndex = Math.round(this.currLeft/this.currWidth) || 0
    },
    setDims() {
      this.currBounds = this.carouselWrap.getBoundingClientRect()
      this.currWidth = this.carouselWrap.clientWidth
      this.currLeft = this.carouselWrap.scrollLeft
      this.scrollWidth = this.carouselWrap.scrollWidth
    },
    buildSlides() {
      // slides will be in our "slides" slot
      while (this.carouselWrap.children[1]) this.carouselWrap.removeChild(this.carouselWrap.children[1])
      if (this.$el.querySelectorAll('.clone-next').length == 1) this.$el.querySelector('.clone-next').remove()
      if (this.$el.querySelectorAll('.clone-prev').length == 1) this.$el.querySelector('.clone-prev').remove()
      if (this.carouselSlides && this.carouselSlides.children.length > 0) {
        this.slideCount = 0
        let slideSet = this.carouselSlides.cloneNode(true)
        let isActive = 0
        let prevClone = document.createElement('div') 
        let nextClone = document.createElement('div')
        while (slideSet.children[0]) {
          let theSlide = document.createElement('div')
          if (isActive == 0) { 
            theSlide.setAttribute('class','slide active')
            if (this.$el.querySelectorAll('.clone-next').length == 0) prevClone.setAttribute('class','clone clone-next')
          } else { 
            theSlide.setAttribute('class','slide') 
            if (this.$el.querySelectorAll('.clone-prev').length == 0) nextClone.setAttribute('class','clone clone-prev')
          }
          for (let a=0; a<this.viewable; a++) {
            let blank = document.createElement('div')
            if (slideSet.children[0]) theSlide.appendChild(slideSet.children[0])
            else theSlide.appendChild(blank)
          }
          this.lazyLoader(theSlide)
          this.carouselWrap.appendChild(theSlide)
          this.slideCount = this.slideCount + 1
          isActive++ 
        }
        if (this.infinite == 'true') {
          this.$el.insertBefore(nextClone, this.carouselWrap)
          this.$el.insertBefore(prevClone, this.carouselWrap.nextSibling)
        }
      }
      if (this.arrowsWrap != '') this.bindArrows()
      if (this.arrowsWrap != '') this.bindDots()
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
    },
    bindArrows() {
      let theWrap = document.querySelector(this.arrowsWrap)
      if (theWrap) {
        let thePrev = theWrap.querySelector('.prev')
        let theNext = theWrap.querySelector('.next')
        if (thePrev) thePrev.addEventListener('click', () => { this.move = 'prev'; this.onClick() })
        if (theNext) theNext.addEventListener('click', () => { this.move = 'next'; this.onClick() })
      }
    },
    bindDots() {
      let theWrap = document.querySelector(this.dotsWrap)
      theWrap.innerHTML = ''
      if (this.dotsType != 'dots') {
        theWrap.innerHTML = `<span>${this.currIndex+1}</span><span>/</span><span>${this.slideCount}</span>`
      } else {
        let theDots = document.createElement('ul')
        theDots.classList.add('dots')
        for (var d=0; d<this.slideCount; d++) {
          let theDot = document.createElement('li')
          theDot.classList.add('dot')
          theDot.setAttribute('data-idx',d)
          if (d==this.currIndex) { theDot.classList.add('active') }
          theDots.append(theDot)
          theDot.addEventListener('click', (e) => { this.goTo( parseInt(e.target.getAttribute('data-idx')) ) })
        }
        theWrap.append(theDots)
      }
    }
  },

  watch: {
    displayWidth() { this.getBreakPointValues() },
    lazyLoaded() { this.buildSlides() },
    viewable() { this.buildSlides(); this.getIndex() },
    mouseX() { 
      this.setDims()
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
      this.bindDots()
    }
  }
}
</script>

<style lang="scss">

  @keyframes gradient {
    0% { background-position: 0% }
    100% { background-position: 100%; }
  }

  [data-id="carousel"] {
    width: 100%; 
    height: auto; 
    position: relative;
    overflow: hidden;

    > .clone {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: stretch;
      transition: 0s linear;
      overflow: hidden;

      &.clone-next { right: -100%; }
      &.clone-prev { left: -100%; }
      
      &.clone-next.over-next { 
        transform: translateX(-100%);
        transition: 0.45s linear;
      }
      &.clone-prev.over-prev { 
        transform: translateX(100%);
        transition: 0.45s linear;
      }

      > .slide {
        display: flex;
        justify-content: center;
        align-items: center;
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
      &.m-next::before { content: '\003E'; transform: scaleY(1.5); }
      &.m-prev::before { content: '\003C'; transform: scaleY(1.5); }
    }

    &:hover .mouse-stalker:not(.infinite) {
      &.m-next.index-end::before { content: '\00D7'; transform: scaleY(1); }
      &.m-prev.index-start::before { content: '\00D7'; transform: scaleY(1); }
    }

    &[data-count="1"] .mouse-stalker { display: none; }
    &[show-arrows="false"] {
      pointer-events: none;

      .slide *:not(img) { pointer-events: auto; }

      .mouse-stalker { display: none; }
    }

    .carousel-wrap {
      width: 100%;
      height: 100%;
      position: relative;
      transition: 0s;
      display: flex;
      justify-content: left;
      align-items: stretch;
      box-sizing: border-box;
      overflow: hidden;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
      &::-webkit-scrollbar { display: none; } /* Chrome */

      &.over-prev { 
        transform: translateX(100%); 
        transition: 0.5s linear;
      }
      &.over-next { 
        transform: translateX(-100%); 
        transition: 0.5s linear;
      }

      > :not(.slide) { display: none; }
    }

    .slide {
      width: 100%;
      min-height: 100%;
      border-radius: 50%;
      background: linear-gradient(100deg,#b3b3b3, #555454, #b3b3b3 , #515252,#b3b3b3, #555554);
      background-size: 600% 100%;
      background-clip: border-box;
      animation: gradient 5s linear infinite;
      animation-direction: alternate;
      opacity: 0.15;
      flex: 0 0 100%;
      scroll-snap-align: center;
      display: flex;

      &:not(:empty) { 
        border-radius: 0;
        background: none; 
        opacity: 1;
      }

      > img, div {
        width: 100%;
        height: 100%;
        border-radius: 0;
        object-fit: cover !important;
        opacity: 1;
      }
    }

    &[data-view="2"] .slide > img,
    &[data-view="2"] .slide > div { width: 50%; }
    &[data-view="3"] .slide > img,
    &[data-view="3"] .slide > div { width: 33.33%; }
    &[data-view="4"] .slide > img,
    &[data-view="4"] .slide > div { width: 25%; }
    &[data-view="5"] .slide > img,
    &[data-view="5"] .slide > div { width: 20%; }
    &[data-view="6"] .slide > img,
    &[data-view="6"] .slide > div { width: 16.66%; }
    &[data-view="7"] .slide > img,
    &[data-view="7"] .slide > div { width: 14.28%; }
    &[data-view="8"] .slide > img,
    &[data-view="8"] .slide > div { width: 12.5%; }
    &[data-view="9"] .slide > img,
    &[data-view="9"] .slide > div { width: 11.11%; }
    &[data-view="10"] .slide > img,
    &[data-view="10"] .slide > div { width: 10%; }

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
        letter-spacing: 3px;
      }

      &::after {
        content: attr(data-count);
        letter-spacing: 3px;
      }

      &[data-count="1"],
      &[show-dots="false"] { display: none; }
    }
  }

</style>
