<template>
  <div class="tabs-acc-wrap" style="display: none;">
    <slot name="tabs"></slot>
  </div>
</template>
  
<script>
export default {
  name: 'TabsWc',

  data() {
    return {
      tabsAccContainer: null,
      tabsAccContainerID: null,
      accordionSwitch: false,
      timeout: null,
      switchTimeout: null,
      observer: null,
      currentWidth: null
    }
  },

  props: {
    groupName: { default: '', type: String },
    accordionBreakpoint: { default: '', type: String },
  },

  created() {
    this.observer = new ResizeObserver(entries => {  this.onElementObserved(entries[0]) })
  },

  mounted() {
    this.setTabElements()
    if (this.groupName != '') this.buildTabs()
  },

  methods: {

    onElementObserved(entry) {
      if (entry.contentRect) { 
        if (entry.contentRect.width && entry.contentRect.width != this.currentWidth) this.currentWidth = entry.contentRect.width
      }
    },
    setTabElements() {
      if (this.tabsAccContainer == null) this.tabsAccContainer = this.$el
    },
    onResize() {
      // methods ran on resize with debounce
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => { window.requestAnimationFrame(this.checkOverflow) },800)
    },
    buildTabs() {
      this.tabsAccContainerID = this.groupName.trim().replaceAll(' ','-')
      let tab_html = this.tabListHTML(), panel_html = this.tabContentHTML(), acc_html = this.accordionHTML()
      let tabWrap = document.createElement('div')
      tabWrap.classList.add('component-tabs-acc')
      tabWrap.id = `${this.tabsAccContainerID}-tabs-acc`
      let tabTemplate = `
        <div class="tabs-control" id="${this.tabsAccContainerID}-tabs">
          <div class="tabs-nav" role="tablist"></div>
          <div class="tabs-panel"></div>
        </div
      `
      let accTemplate = `<div class="accordion-control" id="${this.tabsAccContainerID}-accordion"></div>`
      if (!document.getElementById(`${this.tabsAccContainerID}-tabs-acc`)) {
        this.$el.parentNode.insertBefore(tabWrap,null)
        if (this.accordionSwitch) {
          tabWrap.innerHTML = accTemplate
          tabWrap.querySelector('.accordion-control').innerHTML = acc_html
        }  else { 
          tabWrap.innerHTML = tabTemplate
          tabWrap.querySelector('.tabs-nav').innerHTML = tab_html
          tabWrap.querySelector('.tabs-panel').innerHTML = panel_html
        }
        this.bindControls(`${this.tabsAccContainerID}-tabs-acc`)
        this.observer.observe(document.getElementById(`${this.tabsAccContainerID}-tabs-acc`))
      }
    },
    tabListHTML() {
      let theHTML = ''
      let theTabs = Array.prototype.slice.call(this.tabsAccContainer.children[0].childNodes)
      if (theTabs.length > 0) {
        for (var t=0; t<theTabs.length; t++) {
          let thisTab = theTabs[t].childNodes[0].innerHTML
          let indexAttr = t>0 ? null : 'tabindex="-1"'
          theHTML += `<button id="tab-${t+1}" type="button" role="tab" aria-selected="${t==0}" ${indexAttr} aria-controls="tabpanel-${t+1}">${thisTab}</button>`
        }
      } return theHTML
    },
    tabContentHTML() {
      let theHTML = ''
      let theTabs = Array.prototype.slice.call(this.tabsAccContainer.children[0].childNodes)
      if (theTabs.length > 0) {
        for (var t=0; t<theTabs.length; t++) {
          let thisTab = theTabs[t].childNodes[1].innerHTML
          let hiddenAttr = t>0 ? 'hidden' : null
          theHTML += `<div id="tabpanel-${t+1}" role="tabpanel" tabindex="0" ${hiddenAttr} aria-labelledby="tab-${t+1}">${thisTab}</div>`
        }
      } return theHTML
    },
    accordionHTML() {
      let theHTML = ''
      let theTabs = Array.prototype.slice.call(this.tabsAccContainer.children[0].childNodes)
      if (theTabs.length > 0) {
        for (var t=0; t<theTabs.length; t++) {
          let thisTtl = theTabs[t].childNodes[0].innerHTML
          let thisTxt = theTabs[t].childNodes[1].innerHTML
          let indexAttr = t>0 ? null : 'tabindex="-1"'
          theHTML += `
          <button type="button" aria-expanded="${t==0}" ${indexAttr} class="accordion-trigger" aria-controls="sect${t+1}" id="accordion${t+1}id">${thisTtl}</button>
          <div id="sect${t+1}" role="region" aria-labelledby="accordion${t+1}id" tabindex="0" data-hidden="${!t==0}" class="accordion-panel"><span>${thisTxt}</span></div>
          `
        }
      } return theHTML
    },

    bindControls(id) {
      let tabContainer = document.getElementById(id)
      if (tabContainer) {
        // Tabs controller
        if (tabContainer.querySelector('[role="tab"]')) {
          tabContainer.querySelectorAll('[role="tab"]').forEach((t) => { 
            t.onclick = (e) => { e.target.focus() }
            t.onfocus = (e) => {
              tabContainer.querySelectorAll('[role="tab"]').forEach((s) => { s.setAttribute('aria-selected','false'); s.setAttribute('tabindex','-1') })
              tabContainer.querySelectorAll('[role="tabpanel"]').forEach((s) => { s.setAttribute('hidden','') })
              e.target.setAttribute('aria-selected','true'); e.target.removeAttribute('tabindex')
              tabContainer.querySelector('[aria-labelledby="'+e.target.id+'"]').removeAttribute('hidden')
            } 
          })
          tabContainer.onkeydown = (e) => {
            if (e.code == 'ArrowLeft') { 
              if (tabContainer.querySelector('[aria-selected="true"]').previousSibling != null) { e.preventDefault(); tabContainer.querySelector('[aria-selected="true"]').previousSibling.focus() }
            }
              
            if (e.code == 'ArrowRight') { 
              if (tabContainer.querySelector('[aria-selected="true"]').nextSibling != null) { e.preventDefault(); tabContainer.querySelector('[aria-selected="true"]').nextSibling.focus() }
            }
              
          }
        }
        // Accordion Controller
        if (tabContainer.querySelector('[role="region"]')) {
          tabContainer.querySelectorAll('button').forEach((t) => { 
            t.onfocus = (e) => {
              tabContainer.querySelectorAll('button').forEach((s) => { s.setAttribute('aria-expanded','false'); s.setAttribute('tabindex','-1') })
              tabContainer.querySelectorAll('[role="region"]').forEach((s) => { s.setAttribute('data-hidden','true') })
              e.target.setAttribute('aria-expanded','true'); e.target.removeAttribute('tabindex')
              tabContainer.querySelector('[aria-labelledby="'+e.target.id+'"]').setAttribute('data-hidden','false')
            } 
          })
          tabContainer.onkeydown = (e) => {
            let prevSib = tabContainer.querySelector('[aria-expanded="true"]').previousElementSibling
            let nextSib = tabContainer.querySelector('[aria-expanded="true"]').nextElementSibling || null
            if (e.code == 'ArrowUp' && prevSib) { 
              if (prevSib.previousElementSibling) { e.preventDefault(); prevSib.previousElementSibling.focus() }
            }
            if (e.code == 'ArrowDown' && nextSib) { 
              if (nextSib.nextElementSibling) { e.preventDefault(); nextSib.nextElementSibling.focus() }
            }
          }
        }
      }
    },
    checkOverflow() {
      this.accordionSwitch = false
      clearTimeout(this.switchTimeout)
      this.switchTimeout = setTimeout(() => {
        let theContainerW = document.getElementById(`${this.tabsAccContainerID}-tabs-acc`).clientWidth
        let theNavW = document.querySelector('.tabs-nav').clientWidth
        // console.log('container width: '+theContainerW+' | nav width: '+theNavW)
        if (theNavW > theContainerW) this.accordionSwitch = true
      }, 150)
    }
  },
    
  watch: {
    accordionSwitch() { 
      let gName = this.groupName.trim().replaceAll(' ','-')
      if (document.getElementById(`${gName}-tabs-acc`)) document.getElementById(`${gName}-tabs-acc`).remove()
      this.buildTabs() 
    },
    currentWidth() { this.onResize() }
  }
}
</script>
  
<style lang="scss">

.tabs-control {
  display: grid;
  justify-items: start;
  align-items: start;
}

.tabs-nav {
  width: auto;
  white-space: nowrap;
  display: inline-flex;
  overflow: hidden;
}

  [role="region"] {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s;
    

    > span { overflow: hidden; }

    &[data-hidden="false"] { grid-template-rows: 1fr; }
  }
</style>