var mute = false;
var volume = 1;

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    switch (event.which) {
        case 77:
            if(!mute){
                mute = true;
                audio.volume = 0;
            }
            else{
                mute = false;
                audio.volume = volume;
            }
            break;
        case 107:
            louderMusic();
            break;
        case 109:
            softerMusic();
            break;
    }
};

function playMusic() {
    audio = new Audio('music/songs.mp3');
    audio.loop = true;
    audio.volume = volume;
    audio.play();
}

function YouDiedMusic(){
    audio.pause();

    audio = new Audio('music/YouDied.mp3');
    audio.loop = false;
    if(mute){
        audio.volume = 0;
    }
    else{
        audio.volume = volume;
    }
    audio.play();
}

function louderMusic(){ //LUIDER!!! HET MOET LUIDER!!!!!!!!!!!
    mute = false;
    if(volume < 1){
        volume += 0.01;
        audio.volume = volume;
    }
    if(volume == 1 || volume > 1){
        audio.volume = volume;
    }
}

function softerMusic(){ // sssh
    if(volume > 0){
        mute = false
        volume -= 0.01;
        audio.volume = volume;
    }
    if(volume == 0 || volume < 0){
        mute = true;
        volume = 0;
        audio.volume = volume;
    }
}

function pauseMusic() {
    console.log("pause");
    audio.pause();
}

function resumeMusic() {
    console.log("play");        
    audio.play();
}