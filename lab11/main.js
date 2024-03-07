
// const input1 = document.querySelector('#val1')
// console.dir(input1)
// console.log(input1.value)
// input1.value = 20

//pobierz diva

// reagowanie na klikniecie
const inputContainer = document.querySelector('#inputContainer')
const resultsContainer = document.querySelector('#results')
const calculateBtn = document.querySelector('#calculate')
const addInputBtn = document.querySelector('#addInput')

function calculateResults()
{
    const valueInputs = document.querySelectorAll('.valueInput')
    let sum = 0
    let min = Number(valueInputs[0].value)
    let max = Number(valueInputs[0].value)

    valueInputs.forEach(input => {
        const value = Number(input.value)
        sum += value
        min = Math.min(min, value)
        max = Math.max(max, value)
    })

    const average = sum / valueInputs.length
    resultsContainer.innerHTML =
    `
        <p>Suma: ${sum}</p>
        <p>Średnia: ${average}</p>
        <p>Min: ${min}</p>
        <p>Max: ${max}</p>
    `
}

calculateBtn.addEventListener('click', calculateResults);

inputContainer.addEventListener('input', calculateResults)

addInputBtn.addEventListener('click', () =>{
    const newInput = document.createElement('input')
    newInput.type = "text"
    newInput.classList.add('valueInput')
    newInput.value = ''
    inputContainer.insertBefore(newInput, addInputBtn)
})

inputContainer.addEventListener('blur', (event) => {
    const target = event.target
    if(target.matches('.valueInput') && target.value === '')
    {
        inputContainer.removeChild(target);
    }
}, true)

// przeliczBtn.addEventListener('click',()=> {
//     const input1 = document.querySelector('#val1').value
//     const input2 = document.querySelector('#val2').value
//     const input3 = document.querySelector('#val3').value
//     const input4 = document.querySelector('#val4').value
//     const suma = Number(input1) + Number(input2) + Number(input3) + Number(input4)
//     const srednia = (suma/4)
//     const min = Math.min(input1, input2, input3, input4)
//     const max = Math.max(input1, input2, input3, input4)
//     pojemnikNaWyniki.textContent = "Suma =" + suma + "Średnia =" + srednia + "Min =" + min + "Max=" + max

// })