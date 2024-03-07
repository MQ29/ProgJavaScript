//tworzenie img w js
const img1 = document.createElement('img')
const img2 = new Image()

img1.src=""

//setTimeout(), setInterval()
// setTimeout(()=>{
//     console.log('x')
//     const box = document.querySelector('#slider-inner')
//     box.style.transform = 'translate(200px,0px)'
// },2_000)

let positionX = 0
const anim = setInterval(()=>{
    console.log('x')
    const box = document.querySelector('#slider-inner')
    box.style.transform = `translate(${positionX}px,0px)`
},16)

setTimeout(()=>{
    clearInterval(anim)
},6_000)