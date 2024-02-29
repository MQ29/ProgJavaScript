// const input1 = document.querySelector('#val1')
// console.dir(input1)
// console.log(input1.value)
// input1.value = 20

//pobierz diva

//reagowanie na klikniecie
// const input1 = document.querySelector('#val1').value
// const input2 = document.querySelector('#val2').value
// const input3 = document.querySelector('#val3').value
// const input4 = document.querySelector('#val4').value
const pojemnikNaWyniki = document.querySelector('.wyniki')

const przeliczBtn = document.querySelector('#przelicz')
przeliczBtn.addEventListener('click',()=> {
    const input1 = document.querySelector('#val1').value
    const input2 = document.querySelector('#val2').value
    const input3 = document.querySelector('#val3').value
    const input4 = document.querySelector('#val4').value
    const suma = Number(input1) + Number(input2) + Number(input3) + Number(input4)
    const srednia = (suma/4)
    const min = Math.min(input1, input2, input3, input4)
    const max = Math.max(input1, input2, input3, input4)
    pojemnikNaWyniki.textContent = "Suma =" + suma + "Średnia =" + srednia + "Min =" + min + "Max=" + max

})