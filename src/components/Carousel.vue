<template>
  <div data-id="carousel" :style="wrap_styles" :data-row="sRows" :data-col="sColumns" :data-count="slideCount" :show-arrows="arrowsWrap=='' ? 'true' : 'false'" :data-modal="carouselPopup">
    <div class="carousel-wrap" :style="wrap_styles" @mouseup="clickHandler" @mousemove="watchMouse">
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
      sColumns: '',
      sRows: '',
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
      popIndex: 0,
      scrollTimeout: 0,
      scrolling: false
    }
  },

  props: {
    maxw: { default: '', type: String },
    minw: { default: '', type: String },
    maxh: { default: '', type: String },
    minh: { default: '', type: String },
    slideViewColumns: { default: '1', type: String },
    slideViewRows: { default: '1', type: String },
    slideViewGap: { default: '0', type: String },
    align: { default: 'left', type: String },
    transition: { default: 'fade', type: String },
    arrowsWrap: { default: '', type: String },
    dotsWrap: { default: '', type: String },
    dotsType: { default: '', type: String },
    infinite: { default: '', type: String },
    carouselPopup: { default: '', type: String },
    slidesWrap: { default: '', type: String },
    autoAdvance: { default: '', type: String }
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
    this.loadObserver.observe(this.$el)
    this.$el.addEventListener('contextmenu', (e) => { e.preventDefault(); return false; })
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
      },50)
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
      for (var i=0; i< imgset.length; i++) {
        if (imgset[i].getAttribute('data-src')) {
          imgset[i].setAttribute('src', imgset[i].getAttribute('data-src'))
          imgset[i].classList.add('loaded')
        }
      }
    },
    showCaption(img) {
      let imgTitle = img.getAttribute('title') || null
      if (imgTitle) {
        let theCap = document.createElement('caption')
        theCap.setAttribute('style','width:100%;color:white;')
        theCap.innerText = imgTitle
        img.parentNode.append(theCap)
      }
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
            this.$el.querySelector('.clone-next').setAttribute('style', `grid-gap: ${this.slideViewGap};`)
            setTimeout(() => { 
              this.carouselWrap.classList.remove('over-next')
              this.$el.querySelector('.clone-next').classList.remove('over-next')
              window.requestAnimationFrame(() => { this.carouselWrap.scrollTo({ left: 0, behavior: 'auto' }) })
            }, 250)
          }
          else window.requestAnimationFrame(() => { this.carouselWrap.scrollTo({ left: this.currLeft+this.currWidth, behavior: 'smooth' }) })
        }
        if (this.move == 'prev') {
          if (this.currIndex == 0 && this.infinite == 'true') {
            if (this.$el.querySelector('.clone-prev').childNodes.length == 0) 
              this.$el.querySelector('.clone-prev').appendChild(this.$el.querySelectorAll('.carousel-wrap .slide')[this.slideCount-1].cloneNode(true))
              this.lazyLoader(this.$el.querySelector('.clone-prev').querySelector('.slide')) 
            this.carouselWrap.classList.add('over-prev')
            this.$el.querySelector('.clone-prev').classList.add('over-prev')
            this.$el.querySelector('.clone-prev').setAttribute('style', `grid-gap: ${this.slideViewGap};`)
            setTimeout(() => {
              this.carouselWrap.classList.remove('over-prev')
              this.$el.querySelector('.clone-prev').classList.remove('over-prev')
              window.requestAnimationFrame(() => {  this.carouselWrap.scrollTo({ left: this.scrollWidth-this.currWidth, behavior: 'auto' }) })
            }, 250)
          }
          else window.requestAnimationFrame(() => {  this.carouselWrap.scrollTo({ left: this.currLeft-this.currWidth, behavior: 'smooth' }) })
        }
      }
    },
    dblClick(e) {
      let theSrc = e.target.hasAttribute('src') ? e.target.getAttribute('src') : null
          theSrc = theSrc == null && e.target.hasAttribute('data-src') ? e.target.getAttribute('data-src') : theSrc
      for (var x=0;x<this.carouselSlides.children.length;x++) {
        let idxSrc = this.carouselSlides.children[x].hasAttribute('data-src') ? this.carouselSlides.children[x].getAttribute('data-src') : null
            idxSrc = idxSrc == null && this.carouselSlides.children[x].hasAttribute('src') ? this.carouselSlides.children[x].getAttribute('src') : idxSrc
        if (theSrc && idxSrc) if (theSrc === idxSrc) {
          this.popIndex = x
          if (this.displayWidth > this.bp_sm) return this.buildPopup(x)
          else {
            if (e.target.hasAttribute('data-pop')) return window.open( e.target.getAttribute('data-pop') )
            else return window.open( theSrc )
          }
        }
      }
    },
    goTo(idx) {
      this.setDims()
      if (this.currIndex != idx) {
        if (idx > this.currIndex) {
          let offset = this.currLeft + ((idx-this.currIndex) * this.currWidth)
          window.requestAnimationFrame(() => {  this.carouselWrap.scrollTo({ left: offset, behavior: 'smooth' }) })
        }
        if (idx < this.currIndex) {
          let offset = this.currLeft - ((this.currIndex-idx) * this.currWidth)
          window.requestAnimationFrame(() => { this.carouselWrap.scrollTo({ left: offset, behavior: 'smooth' }) })
        }
      }
    },
    clickHandler(e) {
      e.preventDefault()
      if (e.which === 1 || e.button === 1) if (this.arrowsWrap == '') this.onClick()
      if (e.which === 3 || e.button === 2) if (this.carouselPopup == 'true') this.dblClick(e)
    },
    modalClickHandler(idx) {
      let theModal = document.querySelector('.carousel-modal')
      theModal.querySelector('.modal-img').innerHTML = '' 
      if (this.carouselSlides.children[idx].hasAttribute('data-pop')) {
        let thePopSrc = this.carouselSlides.children[idx].getAttribute('data-pop')
        if (thePopSrc.indexOf('.jpg') == -1 && thePopSrc.indexOf('.png') == -1 && thePopSrc.indexOf('.gif') == -1 && thePopSrc.indexOf('.webp')) theModal.querySelector('.modal-img').append(this.buildVideoPop(thePopSrc))
        else theModal.querySelector('.modal-img').innerHTML = `<img src="${this.carouselSlides.children[idx].getAttribute('data-pop')}" />`
      }
      else theModal.querySelector('.modal-img').append(this.carouselSlides.children[idx].cloneNode(true))
      theModal.querySelector('.modal-count').innerHTML = `${idx+1} / ${this.carouselSlides.children.length}`
      this.lazyLoader(theModal.querySelector('.modal-img'))
      if (theModal.querySelector('.modal-img > img')) {
        theModal.querySelector('.modal-img > img').setAttribute('style','max-width: 100%;max-height:100%;object-fit:contain;')
        this.showCaption(theModal.querySelector('.modal-img > img'))
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
          for (let a=0; a<this.sColumns*this.sRows; a++) {
            let blank = document.createElement('div')
            if (slideSet.children[0]) theSlide.appendChild(slideSet.children[0])
            else theSlide.appendChild(blank)
          }
          this.lazyLoader(theSlide)
          theSlide.setAttribute('style', `grid-gap: ${this.slideViewGap};`)
          this.carouselWrap.appendChild(theSlide)
          this.slideCount = this.slideCount + 1
          isActive++ 
        }
        if (this.infinite == 'true') {
          this.$el.insertBefore(nextClone, this.carouselWrap)
          this.$el.insertBefore(prevClone, this.carouselWrap.nextSibling)
        }
      }
      if (this.arrowsWrap != '' && this.arrowsWrap != 'off') this.bindArrows()
      if (this.dotsWrap != '' && this.dotsWrap != 'off') this.bindDots()
      if (this.slidesWrap != '') this.bindSlides()
      if (this.autoAdvance != '') this.autoPlay()
    },
    buildPopup(idx) {
      let popModal = document.createElement('div')
      popModal.classList.add('carousel-modal')
      popModal.setAttribute("style","width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,0.8);display:grid;z-index:9999;")
      let popTemplate = `
          <div class="modal-count" style="width:100px;height:40px;border-radius:20px;position:absolute;top:20px;left:calc(50% - 50px);background:rgba(255,255,255,0.3);color:white;font-size:20px;display:flex;justify-content:center;align-items:center;"></div>
          <div class="modal-close" style="width:40px;height:40px;border-radius:50%;position:absolute;top:20px;right:20px;background:rgba(255,255,255,0.3);color:white;font-size:20px;display:flex;justify-content:center;align-items:center;">&times;</div>
          <div class="modal-prev" style="width:40px;height:30px;border-radius:50%;position:absolute;top:calc(50% - 20px);left:20px;background:rgba(255,255,255,0.3);color:white;font-size:20px;display:flex;justify-content:center;align-items:center;transform:scaleY(133%);">&lt;</div>
          <div class="modal-img" style="width:100%;max-width:calc(100vw - 150px);height:100%;max-height:calc(100vh - 150px);margin:auto;display:flex;flex-direction:column;justify-content:center;align-items:center;"></div>  
          <div class="modal-next" style="width:40px;height:30px;border-radius:50%;position:absolute;top:calc(50% - 20px);right:20px;background:rgba(255,255,255,0.3);color:white;font-size:20px;display:flex;justify-content:center;align-items:center;transform:scaleY(133%);">&gt;</div>
      `
      if (document.querySelectorAll('.carousel-modal').length === 0) {
        document.body.append(popModal)
        let theModal = document.querySelector('.carousel-modal')
        theModal.innerHTML = popTemplate
        this.modalClickHandler(idx)
        theModal.querySelector('.modal-close').addEventListener('click', () => { document.querySelector('.carousel-modal').remove() })
        theModal.querySelector('.modal-prev').addEventListener('click', () => { 
          this.popIndex = this.popIndex-1 < 0 ? this.carouselSlides.children.length-1 : this.popIndex-1
          this.modalClickHandler(this.popIndex)
        })
        theModal.querySelector('.modal-next').addEventListener('click', () => { 
          this.popIndex = this.popIndex+1 == this.carouselSlides.children.length ? 0 : this.popIndex+1
          this.modalClickHandler(this.popIndex)
        })
      }
    },
    buildVideoPop(src) {
      var provider, vid_id, vid_src
      switch(true) { 
        case src.indexOf('youtube') > 0: 
          provider = 'youtube'
          vid_id = src.split('v=')[1]
          vid_src = `//www.youtube.com/embed/${vid_id}?version=3&enablejsapi=1&playlist=${vid_id}&loop=1&mute=1&autoplay=1`
          break
        case src.indexOf('vimeo') > 0: 
          provider = 'vimeo'
          vid_id = src.split('vimeo.com/')[1]
          vid_src = `//player.vimeo.com/video/${vid_id}?autoplay=1&loop=1&muted=1&background=1&title=0&byline=0&portrait=0&sidedock=0`
          break
        case src.indexOf('.mpg') > 0 || src.indexOf('.mp4') > 0 || src.indexOf('.webm') > 0 || src.indexOf('.mov') > 0:
          provider = 'html5'
          vid_src = src
          break
        default:
          provider = 'unk'
          vid_src = src
        }
      let vid_el = provider == 'html5' ? document.createElement('video') : document.createElement('iframe')
      if (provider == 'html5') {
        let src_el = document.createElement('source')
        let attribs = { 'class': this.fit, 'preload': true, 'autoplay': true, 'loop': true,  'defaultMuted': true, 'playsinline': true, 'muted': true }
        for(var key in attribs) { vid_el.setAttribute(key, attribs[key]); }
        src_el.src = vid_src
        vid_el.appendChild(src_el)
      } else { 
        vid_el.src = vid_src 
        vid_el.title = this.title
        vid_el.style = 'width: 100%; height: 100%; max-width: 80vw; max-height: 80vh; border: none;'
      }
      return vid_el
    },
    getBreakPointValues() {
      // set user input property values by breakpoint
      let theMaxw = this.maxw.split(',')
      let theMinw = this.minw.split(',')
      let theMaxh = this.maxh.split(',')
      let theMinh = this.minh.split(',')
      let theAlign = this.align.split(',') 
      let theCount = this.slideViewColumns.split(',') 
      let theRCount = this.slideViewRows.split(',') 
      this.maxWidth = theMaxw[0]
      this.minWidth = theMinw[0]
      this.maxHeight = theMaxh[0]
      this.minHeight = theMinh[0]
      this.alignment = theAlign[0]
      this.sColumns = theCount[0]
      this.sRows = theRCount[0]
      switch (true) {
        case this.displayWidth >= this.bp_sm && this.displayWidth < this.bp_md:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 2 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 2 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 2 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 2 ? theMinh[i] : this.minHeight
          for (let i in theAlign) this.alignment = theAlign[i] != undefined && theAlign[i] != '' && i < 2 ? theAlign[i] : this.alignment
          for (let i in theCount) this.sColumns = theCount[i] != undefined && theCount[i] != '' && i < 2 ? theCount[i] : this.sColumns
          for (let i in theRCount) this.sRows = theRCount[i] != undefined && theRCount[i] != '' && i < 2 ? theRCount[i] : this.sRows
          break
        case this.displayWidth >= this.bp_md && this.displayWidth < this.bp_lg:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 3 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 3 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 3 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 3 ? theMinh[i] : this.minHeight
          for (let i in theAlign) this.alignment = theAlign[i] != undefined && theAlign[i] != '' && i < 3 ? theAlign[i] : this.alignment
          for (let i in theCount) this.sColumns = theCount[i] != undefined && theCount[i] != '' && i < 3 ? theCount[i] : this.sColumns
          for (let i in theRCount) this.sRows = theRCount[i] != undefined && theRCount[i] != '' && i < 3 ? theRCount[i] : this.sRows
          break
        case this.displayWidth >= this.bp_lg && this.displayWidth < this.bp_xl:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 4 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 4 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 4 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 4 ? theMinh[i] : this.minHeight
          for (let i in theAlign) this.alignment = theAlign[i] != undefined && theAlign[i] != '' && i < 4 ? theAlign[i] : this.alignment
          for (let i in theCount) this.sColumns = theCount[i] != undefined && theCount[i] != '' && i < 4 ? theCount[i] : this.sColumns
          for (let i in theRCount) this.sRows = theRCount[i] != undefined && theRCount[i] != '' && i < 4 ? theRCount[i] : this.sRows
          break
        case this.displayWidth >= this.bp_xl:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' ? theMinh[i] : this.minHeight
          for (let i in theAlign) this.alignment = theAlign[i] != undefined && theAlign[i] != '' ? theAlign[i] : this.alignment
          for (let i in theCount) this.sColumns = theCount[i] != undefined && theCount[i] != '' ? theCount[i] : this.sColumns
          for (let i in theRCount) this.sRows = theRCount[i] != undefined && theRCount[i] != '' ? theRCount[i] : this.sRows
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
    bindDots(redo = false) {
      let theWrap = document.querySelector(this.dotsWrap)
      if (theWrap.innerHTML == '' || redo) {
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
    bindSlides() {
      let theCarousel = this.$el
      let theStyles = this.$el.parentNode.childNodes[0].nodeName == 'STYLE' ? this.$el.parentNode.childNodes[0] : null
      let theTarget = document.querySelector(this.slidesWrap)
      if (theStyles) theTarget.appendChild(theStyles)
      theTarget.appendChild(theCarousel)
    },
    updateDots() {
      if (this.dotsType == 'dots' && this.dotsWrap != '' ) {
        this.setDims()
        let theWrap = document.querySelector(this.dotsWrap)
        let theDots = theWrap.querySelectorAll('.dot')
        theDots.forEach((d) => { d.classList.remove('active') })
        theDots[this.currIndex].classList.add('active')
      } else { this.bindDots(true) }
    },
    autoPlay() {
      if (!this.$el.matches(':hover')) {  
        this.move = 'next'
        this.onClick()
      }
      setTimeout(this.autoPlay, `${parseInt(this.autoAdvance)*1000}`)
    }
  },

  watch: {
    displayWidth() { this.getBreakPointValues() },
    lazyLoaded() { this.buildSlides() },
    sColumns() { this.buildSlides(); this.getIndex() },
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
      if (theSlug != '') this.mouseStalker.classList.add(theSlug)
      if (this.dotsWrap != '' && this.dotsWrap != 'off') this.updateDots()
    },
    slideCount() { if (this.dotsWrap != '' && this.dotsWrap != 'off') this.bindDots(true) }
  }
}
</script>

<style lang="scss">

  @keyframes gradient {
    0% { background-position: 0% }
    100% { background-position: 100%; }
  }

  [data-id="carousel"] {
    width: auto; 
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
        transition: 0.25s ease-out;
      }
      &.clone-prev.over-prev { 
        transform: translateX(100%);
        transition: 0.25s ease-out;
      }

      > .slide {
        display: grid;
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
      &.m-next,
      &.m-prev {
        opacity: 1;
      }

      &.m-next::before { 
        content: '\003E'; 
        transform: scaleY(1.5); 
      }

      &.m-prev::before { 
        content: '\003C'; 
        transform: scaleY(1.5); 
      }
    }

    &:hover .mouse-stalker:not(.infinite) {
      &.m-next.index-end::before { 
        content: '\00D7'; 
        transform: scaleY(1);
        color: black; 
      }
      &.m-prev.index-start::before { 
        content: '\00D7'; 
        transform: scaleY(1); 
        color: black;
      }
    }

    &[data-count="1"] .mouse-stalker,
    &[show-arrows="false"] .mouse-stalker { display: none; }

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
        transition: 0.25s ease-out;
      }
      &.over-next { 
        transform: translateX(-100%); 
        transition: 0.25s ease-out;
      }

      > :not(.slide) { display: none; }
    }

    .slide {
      min-width: 100%;
      max-height: 100%;
      border-radius: 50%;
      position: relative;
      background: linear-gradient(100deg,#b3b3b3, #555454, #b3b3b3 , #515252,#b3b3b3, #555554);
      background-size: 600% 100%;
      background-clip: border-box;
      animation: gradient 5s linear infinite;
      animation-direction: alternate;
      opacity: 0.15;
      scroll-snap-align: center;
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: 1fr;

      &:not(:empty) { 
        border-radius: 0;
        background: none; 
        opacity: 1;
      }

      > * {
        width: 100%;
        height: 100%;
        border-radius: 0;
        object-fit: cover !important;
        opacity: 1;
        transition: 0.3s;
      }
    }

    &[data-row="2"] .slide { grid-template-rows: repeat(2, 1fr); }
    &[data-row="3"] .slide { grid-template-rows: repeat(3, 1fr); }
    &[data-row="4"] .slide { grid-template-rows: repeat(4, 1fr); }
    &[data-row="5"] .slide { grid-template-rows: repeat(5, 1fr); }
    &[data-row="6"] .slide { grid-template-rows: repeat(6, 1fr); }
    &[data-row="7"] .slide { grid-template-rows: repeat(7, 1fr); }
    &[data-row="8"] .slide { grid-template-rows: repeat(8, 1fr); }
    &[data-row="9"] .slide { grid-template-rows: repeat(9, 1fr); }
    &[data-row="10"] .slide { grid-template-rows: repeat(10, 1fr); }

    &[data-col="2"] .slide { grid-template-columns: repeat(2, 1fr); }
    &[data-col="3"] .slide { grid-template-columns: repeat(3, 1fr); }
    &[data-col="4"] .slide { grid-template-columns: repeat(4, 1fr); }
    &[data-col="5"] .slide { grid-template-columns: repeat(5, 1fr); }
    &[data-col="6"] .slide { grid-template-columns: repeat(6, 1fr); }
    &[data-col="7"] .slide { grid-template-columns: repeat(7, 1fr); }
    &[data-col="8"] .slide { grid-template-columns: repeat(8, 1fr); }
    &[data-col="9"] .slide { grid-template-columns: repeat(9, 1fr); }
    &[data-col="10"] .slide { grid-template-columns: repeat(10, 1fr); }

    &[data-modal="true"] .slide:hover {
      &::before {
        content: url("data:image/svg+xml,%3Csvg enable-background='new 0 0 417.031 417.031' width='36' height='30' viewBox='0 0 417.031 417.031' fill='white' stroke-color='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m219.683 92.146c-.279-.315-.52-.627-.849-.925-3.644-3.272-3.742-2.306.247-5.983 2.955-2.712 6.541-4.834 9.79-7.18 8.596-6.213 14.254-14.534 18.079-24.399 8.582-22.15-16.706-37.453-29.396-50.562-9.168-9.485-23.603 4.982-14.444 14.447 7.076 7.325 16.19 13.264 22.349 21.407 6.897 9.116-3.613 19.174-10.814 24.249-11.133 7.844-20.757 18.262-18.533 29.434-49.964 4.668-96.16 32.052-96.16 80.327v135.51c0 59.862 48.698 108.562 108.564 108.562 59.863 0 108.566-48.7 108.566-108.562v-135.521c.003-52.703-49.032-78.227-97.399-80.804zm-99.292 80.804c0-35.833 38.898-56.581 79.186-60.027v124.982c-36.751-1.85-66.589-10.222-79.186-14.309zm176.257 135.511c0 48.604-39.537 88.133-88.129 88.133-48.59 0-88.128-39.529-88.128-88.133v-63.381c18.249 5.516 52.6 13.882 93.202 13.882 26.003 0 54.556-3.479 83.056-13.286v62.785zm0-84.521c-25.844 9.883-52.237 13.746-76.635 14.271v-125.59c39.407 2.363 76.635 21.264 76.635 60.337zm-6.913-7.737s-46.688 13.073-62.567 10.271v-103.661c42.261 7.94 69.457 20.72 62.567 93.39z'/%3E%3C/svg%3E");
        padding: 5px;
        border-radius: 25px;
        position: absolute;
        top: 30px;
        right: 30px;
        background: rgba(0,0,0,0.33);
        pointer-events: none;
        z-index: 20;
      }
    }

    &[data-modal="true"]:not([data-row="1"][data-col="1"]) .slide:hover img:hover { filter: brightness(0.66); }


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
