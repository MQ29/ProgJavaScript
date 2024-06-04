let isRecording = [false, false, false, false];
let startTime = [0, 0, 0, 0];
let recordedSounds = [[], [], [], []];

const sounds = {};

document.querySelectorAll('audio').forEach(audio => {
    const key = audio.getAttribute('data-key');
    sounds[key] = audio;
});

document.addEventListener('keypress', (ev) => {
    const key = ev.key;
    const sound = sounds[key];
    if (sound) {
        sound.currentTime = 0;
        sound.play();
        for (let i = 0; i < 4; i++) {
            if (isRecording[i]) {
                const time = Date.now() - startTime[i];
                recordedSounds[i].push({ key, time });
            }
        }
    }
});

function startRecording(channel) {
    isRecording[channel] = true;
    startTime[channel] = Date.now();
    recordedSounds[channel] = [];
    console.log(`Recording started on channel ${channel + 1}`);
}

function stopRecording(channel) {
    isRecording[channel] = false;
    console.log(`Recording stopped on channel ${channel + 1}`);
    console.log(recordedSounds[channel]);
}

function playRecording(channel) {
    if (recordedSounds[channel].length === 0) {
        console.log(`No sounds recorded on channel ${channel + 1}`);
        return;
    }
    console.log(`Playing recording on channel ${channel + 1}`);
    recordedSounds[channel].forEach(sound => {
        setTimeout(() => {
            sounds[sound.key].currentTime = 0;
            sounds[sound.key].play();
        }, sound.time);
    });
}

function playAllRecordings() {
    console.log('Playing all recordings');
    for (let i = 0; i < 4; i++) {
        playRecording(i);
    }
}
