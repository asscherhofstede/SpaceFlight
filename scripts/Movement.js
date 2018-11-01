//bewegingsvariabele
var moveRight = false;
var moveLeft = false;
var moveUp = false;
var moveDown = false;
var rotateLeft = false;
var rotateRight = false;
var rotateUp = false;
var rotateDown = false;
var rotateYLeft = false;
var rotateYRight = false;
var rotateZLeft = false;
var rotateZRight = false;
var curRotLeftRight = 0;
var CurRotUpDown = 0;
var sideSpeed = 0.3;
var curRotY = 0;
var curRotZ = 0;
var noseTurnSpeed = 0.03;
var pause = 1;
var rotationSpeed = 0.05;

document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp, false);

function onDocumentKeyDown(event) {
    switch (event.which){
        case 37:
            moveLeft = true;
            rotateLeft = false;
            break;
        case 38:
            moveUp = true;
            break;
        case 39:
            rotateRight = false;
            moveRight = true;
            break;
        case 40:
            moveDown = true;
            break;
        case 80:
            if(pause == 1){
                pause = 0;                
            } else {
                pause = 1;
            }            
            return pause;
    }
};

function onDocumentKeyUp(event) {
    switch (event.which){
       case 37:
           moveLeft = false;
           stabiliseerSchip();
           break;
       case 38:
           moveUp = false;
           stabiliseerSchip();
           break;
       case 39:
           moveRight = false;
           stabiliseerSchip();
           break;
       case 40:
           moveDown = false;
           stabiliseerSchip();
           break;
   }
};


function AnimateSpaceshipM(spaceshipModel, camera){
    //console.log(moveLeft);
    if (moveRight == true) {
        //Kijken of je bij de rechter border bent
        if(spaceshipModel.position.z >= 7.5){
            spaceshipModel.position.z -= sideSpeed; 
            camera.position.z -= sideSpeed;
            
            if(curRotLeftRight < 0.5 && curRotLeftRight > -0.6){ //zorgt voor draaiing over eigen as naar rechts
                curRotLeftRight += rotationSpeed;
                spaceshipModel.rotation.x -= rotationSpeed;
            }
        }

        if(curRotLeftRight > 0.45) //als de rotatie over eigen as voldoede is, draai het schip naar rechts
        {
            if(curRotY < 0.3 && curRotY > -0.4){
                curRotY += noseTurnSpeed;
                spaceshipModel.rotation.y -= noseTurnSpeed;
            }
            if(curRotZ < 0.3 && curRotZ > -0.4) //test
            {
                curRotZ += noseTurnSpeed;
                spaceshipModel.rotation.z -= noseTurnSpeed;
            }
        }
    }
    if (moveLeft == true) {
        //Kijken of je bij de linker border bent
        if(spaceshipModel.position.z <= 42.5){
            spaceshipModel.position.z += sideSpeed;
            camera.position.z += sideSpeed;
            
            if(curRotLeftRight < 0.6 && curRotLeftRight > -0.5){ //zorgt voor draaiing over eigen as naar links
                curRotLeftRight -= rotationSpeed;
                spaceshipModel.rotation.x += rotationSpeed;
            }
        }

        if(curRotLeftRight<-0.45) //als de rotatie over eigen as voldoende is, draai het schip naar links
        {
            if(curRotY < 0.4 && curRotY > -0.3){
                curRotY -= noseTurnSpeed;
                spaceshipModel.rotation.y += noseTurnSpeed;
            }
            if(curRotZ < 0.4 && curRotZ > -0.3) //test
            {
                curRotZ += noseTurnSpeed;
                spaceshipModel.rotation.z -= noseTurnSpeed;
            }
        }
    }
    if (moveUp == true) {
        //Kijken of je bij de bovenste border bent
        if(spaceshipModel.position.y <= 17.1){
            spaceshipModel.position.y += 0.2;
            camera.position.y += 0.2;
            
            if(CurRotUpDown < 0.3 && CurRotUpDown > -0.3){
                CurRotUpDown += noseTurnSpeed;
                spaceshipModel.rotation.z -= noseTurnSpeed;
            }
        }
    }
    if (moveDown == true) {
        //Kijken of je bij de onderste border bent
        if(spaceshipModel.position.y >= 0.7){
            spaceshipModel.position.y -= 0.2;
            camera.position.y -= 0.2;
            
            if(CurRotUpDown < 0.3 && CurRotUpDown > -0.3){
                CurRotUpDown -= noseTurnSpeed;
                spaceshipModel.rotation.z += noseTurnSpeed;
            }
        }
    }
    if (rotateRight == true) { //roteert het schip zijn rol over eigen as terug naar rechtop
        if(curRotLeftRight > 0.01){
            spaceshipModel.rotation.x += 0.05;
            curRotLeftRight -= 0.05;
        } else {
            rotateRight = false;
        }
    }
    if (rotateLeft == true) { //roteert het schip zijn rol over eigen as terug naar rechtop
        if(curRotLeftRight < -0.01){
            spaceshipModel.rotation.x -= 0.05;
            curRotLeftRight += 0.05;
        } else {
            rotateLeft = false;
        }
    }
    if (rotateYLeft == true) {
        
        if(curRotY > 0.01){
            spaceshipModel.rotation.y += 0.05;
            curRotY -= 0.05;
        } else {
            rotateYLeft = false;
        }
    }
    if (rotateYRight == true) {
        
        if(curRotY < -0.01){
            spaceshipModel.rotation.y -= 0.05;
            curRotY += 0.05;
        } else {
            rotateYRight = false;
        }
    }
    if (rotateZLeft == true) {
        if(curRotZ > 0.01){
            spaceshipModel.rotation.z += 0.05;
            curRotZ -= 0.05;
        }else {
            rotateZLeft = false;
        }
    }
    if (rotateZRight == true) {
        
        if(curRotZ > 0.01){
            spaceshipModel.rotation.z -= 0.05;
            curRotZ -= 0.05;
        }else {
            rotateZRight = false;
        }
    }
    if (rotateUp == true) {
        if(CurRotUpDown < -0.01){
            spaceshipModel.rotation.z -= 0.03;
            CurRotUpDown += 0.03;
        }else{
            rotateUp = false;
        }
    }
    if (rotateDown == true) {
        if(CurRotUpDown > 0.01){
            spaceshipModel.rotation.z += 0.03;
            CurRotUpDown -= 0.03;
        }else{
            rotateDown = false;
        }
    }
    return spaceshipModel;
}

function StabiliseShip(spaceshipModel){
    if (!(curRotLeftRight > -0.05)){
        rotateLeft = true;
    } else if (!(curRotLeftRight < 0.05)){
        rotateRight = true;
    }

    if (curRotY > 0.01) {
        rotateYLeft = true;
    }
    
    if (curRotY < -0.01) {
        rotateYRight = true;
    }
    
    if( curRotZ < -0.01 ){
        rotateZRight = true;
    }
    
    if( curRotZ > 0.01 ){
        rotateZLeft = true;
    }
    
    if(CurRotUpDown > 0.01){
        rotateDown = true;
    }
    
    if(CurRotUpDown < -0.01){
        rotateUp = true;
    }
    return spaceshipModel;
}

function stabiliseerSchip() {
    if (!(curRotLeftRight > -0.05)){
        rotateLeft = true;
    } else if (!(curRotLeftRight < 0.05)){
        rotateRight = true;
    }

    if (curRotY > 0.01) {
        rotateYLeft = true;
    }
    
    if (curRotY < -0.01) {
        rotateYRight = true;
    }
    
    if( curRotZ < -0.01 ){
        rotateZRight = true;
    }
    
    if( curRotZ > 0.01 ){
        rotateZLeft = true;
    }
    
    if(CurRotUpDown > 0.01){
        rotateDown = true;
    }
    
    if(CurRotUpDown < -0.01){
        rotateUp = true;
    }
}