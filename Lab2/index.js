document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelector('.slides');
    const slideItems = document.querySelectorAll('.slide');
    const controls = document.querySelectorAll('.control');

    let index = 0;
    const slideWidth = slideItems[0].clientWidth;

    function goToSlide(x){
        slides.style.transform = `translateX(-${slideWidth * x}px)`;
        index = x;
        updateControls();
    }

    function updateControls(){
        controls.forEach((control, x) =>{
            control.classList.toggle('active', x === index);
        });
    }

    controls.forEach((control, x) => {
        control.addEventListener('click', () => {
            goToSlide(x);
        });
    });

    setInterval(()=>{
        index = (index + 1) % slideItems.length;
        goToSlide(index);
    },3000);
});


// tworzenie img w js-ie
// const img1 = document.createElement('img')
// const img2 = new Image()
// img1.src=""

// odkładanie wykonania kodu w czasie
// setTimeout(
//     ()=>{
//         console.log('Ouc!')
//         const box = document.querySelector('#slider-inner')
//         box.style.transform = 'translate(200px,0px)'
//         setTimeout()
//     },2_000)

// let positionX = 0
// const anim = setInterval(
//     ()=>{
//         const box = document.querySelector('#slider-inner')
//         box.style.transform = `translate(${positionX}px,0px)`
//         positionX++
// },16)

// // przerywanie setInterval
// setTimeout(() => {
//     clearInterval(anim)
// }, 6_000)