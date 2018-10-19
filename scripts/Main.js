window.onload = function () {
    

    var spaceshipModel = new THREE.Group();

    var renderer = new THREE.WebGLRenderer();

    var audio;

    var shipChoice = '1';
    var rotationSpeed = 0.05; //de snelheid van de rotatie

    //gamevars
    var pause = 1;
    var gameSpeed = 0.5;

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
    var sideSpeed = 0.5;
    var curRotY = 0;
    var curRotZ = 0;
    var noseTurnSpeed = 0.03;

    //spelerscore
    var playerScore = 1;
    var a = 1;
    function updateScore() {
        a += (0.25 * pause);
        playerScore = Math.round(a);
        //tekst
        var text2 = document.getElementById("score");
        text2.style.position = 'absolute';
        text2.style.width = 100;
        text2.style.height = 20;
        text2.style.backgroundColor = "turquoise";
        text2.innerHTML = playerScore;
        text2.style.top = 50 + 'px';
        text2.style.left = 200 + 'px';
        document.body.appendChild(text2);
    }

    function init() {
        scene = new THREE.Scene();

        // camera 
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000000);
        //cameraControls = new THREE.OrbitControls(camera);
        //camera.position.set(103, 5, 10);

        //camera.rotation.z = Math.PI / 2;
        camera.position.set(93, 3, 10);
        camera.rotation.y = 180 * (Math.PI / 360);
        //cameraControls.update();
        //scene.add(camera);
        scene.add(camera);

        document.addEventListener("keydown", onDocumentKeyDown, false);
        document.addEventListener("keyup", onDocumentKeyUp, false);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight + 5);
        document.body.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);


        scene.add(spaceshipModel);

        var light = new THREE.AmbientLight(0x404040);
        scene.add(light);

        //var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        // scene.add(directionalLight);



        var geometry = new THREE.PlaneGeometry(1000, 30, 100);
        var material = new THREE.MeshBasicMaterial({ color: 0x404040, side: THREE.DoubleSide });
        var plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = Math.PI / 2.0;
        plane.position.x = 100;
        plane.position.y = -0.5;
        plane.position.z = 10;
        scene.add(plane);

        spaceship(shipChoice);

        playMusic();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function MakeObject() {
        group = new THREE.Group();

        //Het laden van het model en de materials(textures)
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setTexturePath("models/Obstacles/");
        mtlLoader.setPath("models/Obstacles/");
        mtlLoader.load("Boulder.mtl", function (materials) {
            materials.preload();

            var objLoader = new THREE.OBJLoader()
            objLoader.setMaterials(materials)
            objLoader.setPath("models/Obstacles/")
            objLoader.load("Boulder.obj", function (geometry) {
                //hier kunnen we later wel aanpassen hoeveel objecten er zijn(moeilijksheidgraad)
                for (var i = 0; i < 250; i++) {
                    var obstacle = geometry.clone();
                    obstacle.position.set(Math.random() * -200, Math.random() * 10, Math.random() * 50);
                    obstacle.scale.set(1, 1, 1);
                    group.add(obstacle);
                }
            });
        });
        scene.add(group);
    }

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        var keyCode = event.which;

        if (keyCode == 90) {  //z key voor rotatie over rechts
            rotateRight = true;

        } else if (keyCode == 88) { // x key voor rotatie over links
            rotateLeft = true;

        } else if (keyCode == 37) { // left key voor bewegen naar links
            moveLeft = true;
            rotateLeft = false;
        } else if (keyCode == 39) { // right key voor bewegen naar rechts
            rotateRight = false;
            moveRight = true;
        } else if (keyCode == 38) { // up key voor naar boven
            moveUp = true;
        } else if (keyCode == 40) { //down key voor naar beneden
            moveDown = true;
        } else if (keyCode == 80) { //down key voor naar pause
            if (pause == 1) {
                pause = 0;
                pauseMusic();
            } else {
                pause = 1;
                resumeMusic();
            }
        }else if (keyCode == 107){
            louderMusic();
        }else if (keyCode == 109){
            softerMusic();
        }
    };

    document.addEventListener("keyup", onDocumentKeyUp, false);
    function onDocumentKeyUp(event) {
        var keyCode = event.which;

        if (keyCode == 37) { // left key voor bewegen naar links
            moveLeft = false;
            stabiliseerSchip();
        } else if (keyCode == 39) { // right key voor bewegen naar rechts
            moveRight = false;
            stabiliseerSchip();

        } else if (keyCode == 38) { // up key voor naar boven
            moveUp = false;
            stabiliseerSchip();
        } else if (keyCode == 40) { //down key voor naar beneden
            moveDown = false;
            stabiliseerSchip();
        }
    };

    function stabiliseerSchip(){
        if( !(curRotLeftRight > -0.05) ) //links
        {
            rotateLeft = true;
        }
        else if( !(curRotLeftRight < 0.05 ) ) //rechts
        {
            rotateRight = true;
        }
        if( curRotY > 0.01 )
        {
            rotateYLeft = true;
        }
        if( curRotY < -0.01 )
        {
            rotateYRight = true;
        }
        if( curRotZ < -0.01 )
        {
            rotateZRight = true;
        }
        if( curRotZ > 0.01 )
        {
            rotateZLeft = true;
        }
        if(CurRotUpDown > 0.01)
        {
            rotateDown = true;
        }
        if(CurRotUpDown < -0.01)
        {
            rotateUp = true;
        }
    }
  
    
    function animate() {
        setTimeout(function () {
            
            requestAnimationFrame(animate);

            //cameraControls.update();
            updateScore();

            gameSpeed += 0.00025*pause;
            
            group.position.x += gameSpeed * pause;
            if (group.position.x > 300) {
                
                scene.remove(group);
                MakeObject();
            }

            if (moveRight == true) {
                spaceshipModel.position.z -= sideSpeed * pause; 
                camera.position.z -= sideSpeed * pause;

                if(curRotLeftRight < 0.5 && curRotLeftRight > -0.6){ //zorgt voor draaiing over eigen as naar rechts
                    curRotLeftRight += rotationSpeed;
                    spaceshipModel.rotation.x -= rotationSpeed * pause;
                }
                if(curRotLeftRight > 0.45) //als de rotatie over eigen as voldoende is, draai het schip naar rechts
                {
                    if(curRotY < 0.3 && curRotY > -0.4){
                        curRotY += noseTurnSpeed;
                        spaceshipModel.rotation.y -= noseTurnSpeed * pause;
                        //spaceshipModel.rotation.z -= noseTurnSpeed * pause;
                    }
                    if(curRotZ < 0.3 && curRotZ > -0.4) //test
                    {
                        curRotZ += noseTurnSpeed;
                        spaceshipModel.rotation.z -= noseTurnSpeed * pause;
                    }
                }
            }
            if (moveLeft == true) {
                spaceshipModel.position.z += sideSpeed * pause;
                camera.position.z += sideSpeed * pause;

                if(curRotLeftRight < 0.6 && curRotLeftRight > -0.5){ //zorgt voor draaiing over eigen as naar links
                    curRotLeftRight -= rotationSpeed;
                    spaceshipModel.rotation.x += rotationSpeed * pause;
                }
                if(curRotLeftRight<-0.45) //als de rotatie over eigen as voldoende is, draai het schip naar links
                {
                    if(curRotY < 0.4 && curRotY > -0.3){
                        curRotY -= noseTurnSpeed;
                        spaceshipModel.rotation.y += noseTurnSpeed * pause;
                        //spaceshipModel.rotation.z += noseTurnSpeed * pause;
                    }
                    if(curRotZ < 0.4 && curRotZ > -0.3) //test
                    {
                        curRotZ += noseTurnSpeed;
                        spaceshipModel.rotation.z -= noseTurnSpeed * pause;
                    }
                }
            }
            if(moveRight == true && moveLeft == true){
                stabiliseerSchip();
            }
            if (moveUp == true) {
                spaceshipModel.position.y += 0.2 * pause;
                camera.position.y += 0.2 * pause;
                    if(CurRotUpDown < 0.3 && CurRotUpDown > -0.3){
                        CurRotUpDown += noseTurnSpeed;
                        spaceshipModel.rotation.z -= noseTurnSpeed * pause;
                    }
            }
            if (moveDown == true) {
                spaceshipModel.position.y -= 0.2 * pause;
                camera.position.y -= 0.2 * pause;
                    if(CurRotUpDown < 0.3 && CurRotUpDown > -0.3){
                        CurRotUpDown -= noseTurnSpeed;
                        spaceshipModel.rotation.z += noseTurnSpeed * pause;
                    }
            }
            if (rotateRight == true) { //roteert het schip zijn rol over eigen as terug naar rechtop
                if(curRotLeftRight > 0.01){
                    spaceshipModel.rotation.x += 0.05 * pause;
                    curRotLeftRight -= 0.05;
                }else {
                    rotateRight = false;
                }
            }
            if (rotateLeft == true) { //roteert het schip zijn rol over eigen as terug naar rechtop
                if(curRotLeftRight < -0.01){
                    spaceshipModel.rotation.x -= 0.05 * pause;
                    curRotLeftRight += 0.05;
                }else {
                    rotateLeft = false;
                } 
            }
            if (rotateYLeft == true) {
                
                if(curRotY > 0.01){
                    spaceshipModel.rotation.y += 0.05 * pause;
                    curRotY -= 0.05;
                }else {
                    rotateYLeft = false;
                }
            }
            if (rotateYRight == true) {
                
                if(curRotY < -0.01){
                    spaceshipModel.rotation.y -= 0.05 * pause;
                    curRotY += 0.05;
                }else {
                    rotateYRight = false;
                }
            }
            if (rotateZLeft == true) {
        
                if(curRotZ > 0.01){
                    spaceshipModel.rotation.z += 0.05 * pause;
                    curRotZ -= 0.05;
                }else {
                    rotateZLeft = false;
                }
            }
            if (rotateZRight == true) {
                
                if(curRotZ > 0.01){
                    spaceshipModel.rotation.z -= 0.05 * pause;
                    curRotZ -= 0.05;
                }else {
                    rotateZRight = false;
                }
            }
            if (rotateUp == true) {
                if(CurRotUpDown < -0.01){
                    spaceshipModel.rotation.z -= 0.03 * pause;
                    CurRotUpDown += 0.03;
                }else{
                    rotateUp = false;
                }
            }
            if (rotateDown == true) {
                if(CurRotUpDown > 0.01){
                    spaceshipModel.rotation.z += 0.03 * pause;
                    CurRotUpDown -= 0.03;
                }else{
                    rotateDown = false;
                }
            }
        }, 1000 / 60);

        //renderer.render();
        renderer.render(scene, camera);
    }

    function spaceship(choice) {
        var scale, shipX = 0, shipY = 0, shipZ = 0, path, obj, mtl, shipRotationX = 0, shipRotationY = 0, shipRotationZ = 0;
        switch (choice) {
            case '1':
                scale = 0.01;
                path = 'models/spaceship/';
                obj = 'spaceship.obj';
                mtl = 'spaceship.mtl';
                shipX = 85;
                shipY = 1;
                shipZ = 10;
                shipRotationY = (Math.PI / 2) * 3;
                break;

            case '2':
                scale = 0.5;
                path = 'models/spaceshuttle/';
                obj = 'SpaceShuttle.obj';
                mtl = 'SpaceShuttle.mtl';
                shipRotationX = -1.413717;
                shipRotationZ = Math.PI;
                break;

            case '3':
                scale = 6;
                path = 'models/plane/';
                obj = 'plane.obj';
                mtl = 'plane.mtl';
                shipZ = 10;
                shipRotationY = 180 * (Math.PI / 180);
                break;

            default:
                scale = 0.01;
                path = 'models/spaceship/';
                obj = 'spaceship.obj';
                mtl = 'spaceship.mtl';
                break;
        }

        new THREE.MTLLoader()
            .setPath(path)
            .load(mtl, function (materials) {
                materials.preload();

                new THREE.OBJLoader()
                    .setMaterials(materials)
                    .setPath(path)
                    .load(obj, function (object) {
                        spaceshipModel.add(object);
                        spaceshipModel.position.set(shipX, shipY, shipZ);
                        object.scale.set(scale, scale, scale);
                        object.rotation.set(shipRotationX, shipRotationY, shipRotationZ);
                    });
            });
    }



    init();
    MakeObject();
    animate();
};