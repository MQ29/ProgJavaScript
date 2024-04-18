// const clap = document.querySelector('#s1')
// const kick = document.querySelector('#s2')
// const hihat = document.querySelector('#s3')
// const boom = document.querySelector('#s4')
// const ride = document.querySelector('#s5')
// const snare = document.querySelector('#s6')
// const tink = document.querySelector('#s7')
// const tom = document.querySelector('#s8')
// const openhat = document.querySelector('#s9')

const date = Date.now
let data = []

const sounds = {
    'a': document.querySelector('#s1'),
    's': document.querySelector('#s2'),
    'd': document.querySelector('#s3'),
    'f': document.querySelector('#s4'),
    'g': document.querySelector('#s5'),
    'h': document.querySelector('#s6'),
    'j': document.querySelector('#s7'),
    'k': document.querySelector('#s8'),
    'l': document.querySelector('#s9'),
}
addEventListener('keypress', (ev)=>
{
    const key = ev.key
    const time = Date.now - date
    const sound = sounds[key]
    sound.currentTime = 0
    sound.play()
    data.push(key,time)
    console.log(data.length)
})

function StartRecord(){
}
