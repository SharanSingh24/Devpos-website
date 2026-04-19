/*
  script.js
  Interactive behaviors for Protein Vend landing page.
  - handles preloader
  - builds vending simulation UI
  - simple cart + dispense simulation
*/

document.addEventListener('DOMContentLoaded', () => {
  // hide preloader
  const pre = document.getElementById('preloader')
  if(pre){
    setTimeout(()=>{pre.style.opacity = '0';pre.style.pointerEvents='none';pre.remove();},600)
  }

  // set year
  const year = document.getElementById('year')
  if(year) year.textContent = new Date().getFullYear()

  // Smooth nav link highlighting (optional)
  document.querySelectorAll('.nav-links a, .btn').forEach(a => {
    a.addEventListener('click', (e) => {
      // allow default anchor behavior (smooth scroll via CSS)
      // small click animation
      a.animate([{transform:'translateY(0)'},{transform:'translateY(-3px)'},{transform:'translateY(0)'}],{duration:220,iterations:1})
    })
  })

  // ----- vending simulation -----
  const brands = [
    {id:'on', name:'Optimum Nutrition'},
    {id:'mp', name:'MyProtein'},
    {id:'ms', name:'MuscleTech'}
  ]

  const products = [
    {id:'whey', name:'Whey Protein', price:29.99},
    {id:'isolate', name:'Isolate', price:34.99},
    {id:'gainer', name:'Mass Gainer', price:39.99}
  ]

  const startBtn = document.getElementById('startMachineBtn')
  const machineUI = document.getElementById('machineUI')
  const brandCards = document.getElementById('brandCards')
  const productOptions = document.getElementById('productOptions')
  const addSimBtn = document.getElementById('addSimBtn')
  const dispenseBtn = document.getElementById('dispenseBtn')
  const simCartList = document.getElementById('simCartList')
  const simTotal = document.getElementById('simTotal')

  let selectedBrand = brands[0].id
  let selectedProduct = products[0].id
  let simCart = []

  function renderBrands(){
    brandCards.innerHTML = ''
    brands.forEach(b => {
      const el = document.createElement('div')
      el.className = 'brand-card'
      el.dataset.id = b.id
      el.innerHTML = `<strong>${b.name}</strong>`
      if(b.id===selectedBrand) el.classList.add('selected')
      el.addEventListener('click', ()=>{
        selectedBrand = b.id
        document.querySelectorAll('.brand-card').forEach(n=>n.classList.remove('selected'))
        el.classList.add('selected')
      })
      brandCards.appendChild(el)
    })
  }

  function renderProducts(){
    productOptions.innerHTML = ''
    products.forEach(p => {
      const btn = document.createElement('button')
      btn.className = 'product-btn'
      btn.textContent = `${p.name} — $${p.price.toFixed(2)}`
      btn.dataset.id = p.id
      btn.addEventListener('click', ()=>{
        selectedProduct = p.id
        document.querySelectorAll('.product-btn').forEach(n=>n.classList.remove('selected'))
        btn.classList.add('selected')
      })
      productOptions.appendChild(btn)
    })
    // mark first selected
    const first = productOptions.querySelector('.product-btn')
    if(first) first.classList.add('selected')
  }

  function updateSimCart(){
    simCartList.innerHTML = ''
    simCart.forEach(item=>{
      const li = document.createElement('li')
      li.textContent = `${item.brand} — ${item.product} x${item.qty}`
      const span = document.createElement('span')
      span.textContent = `$${(item.price*item.qty).toFixed(2)}`
      li.appendChild(span)
      simCartList.appendChild(li)
    })
    const total = simCart.reduce((s,i)=>s + i.price*i.qty,0)
    simTotal.textContent = total.toFixed(2)
  }

  addSimBtn && addSimBtn.addEventListener('click', ()=>{
    const brand = brands.find(b=>b.id===selectedBrand)
    const product = products.find(p=>p.id===selectedProduct)
    if(!brand || !product) return
    simCart.push({brand:brand.name, product:product.name, price:product.price, qty:1})
    // small button feedback
    addSimBtn.animate([{transform:'scale(1)'},{transform:'scale(.98)'},{transform:'scale(1)'}],{duration:200})
    updateSimCart()
  })

  dispenseBtn && dispenseBtn.addEventListener('click', ()=>{
    if(simCart.length===0){
      dispenseBtn.animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}],{duration:250})
      return alert('Add an item to cart first')
    }
    // simulate dispensing animation: flash the machine and show success
    dispenseBtn.disabled = true
    dispenseBtn.textContent = 'Dispensing...'
    setTimeout(()=>{
      // success
      dispenseBtn.textContent = 'Dispense'
      dispenseBtn.disabled = false
      const total = simCart.reduce((s,i)=>s + i.price*i.qty,0)
      alert(`Simulated dispense — Total $${total.toFixed(2)}. Enjoy!`)
      simCart = []
      updateSimCart()
    }, 1400)
  })

  startBtn && startBtn.addEventListener('click', ()=>{
    if(machineUI.classList.contains('hidden')){
      machineUI.classList.remove('hidden')
      machineUI.setAttribute('aria-hidden','false')
      startBtn.textContent = 'Machine Ready'
      // build UI
      renderBrands()
      renderProducts()
    }
  })

})
