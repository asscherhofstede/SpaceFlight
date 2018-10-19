    function playMusic() {
        audio = new Audio('music/songs.mp3');
        audio.loop = true;
        audio.volume = 0.3;
        audio.play();
    }

    function louderMusic(){ //LUIDER!!! HET MOET LUIDER!!!!!!!!!!! 
        audio.volume += 0.1;
    }

    function softerMusic(){ // sssh
        if(audio.volume <= 0.1){
            audio.volume = 0;
        }else{
            audio.volume -= 0.1;
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