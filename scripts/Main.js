window.onload = function () {

    'use strict';

    Physijs.scripts.worker = 'scripts/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';

    var scene = new Physijs.Scene;

    var renderer = new THREE.WebGLRenderer();

    scene.setGravity(new THREE.Vector3(0, 0, 0));
    scene.addEventListener(
        'update',
        function () {
            scene.simulate(undefined, 1);
        }
    );

    var spaceshipModel = new THREE.Group();
    var wall = new THREE.Group();

    var audio, camera, group, cameraControls, hitbox;
    // end template here

    //schipvariabelen
    //var shipChoice = prompt("voer een 1 in voor een generiek ruimteschip, 2 voor een spaceshuttle en 3 voor een vliegtuigje");
    var shipChoice = '1';
    var rotationSpeed = 0.05; //de snelheid van de rotatie

    //gamevars
    var pause = 1;
    var gameSpeed = 0.5;

    //#region bewegingsvariabele
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
    //#endregion

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
        // camera
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 150);
        //cameraControls = new THREE.OrbitControls(camera);
        camera.position.set(93, 7, 15);
        camera.rotation.y = 180 * (Math.PI / 360);
        //cameraControls.update();
        scene.add(camera);

        document.addEventListener("keydown", onDocumentKeyDown, false);
        document.addEventListener("keyup", onDocumentKeyUp, false);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight + 5);
        document.body.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);

        var light = new THREE.AmbientLight(0xFFFFFF);
        scene.add(light);

        //#region borders
        var borderGeo = new THREE.BoxGeometry(1000, 20, 10);
        var borderMat = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({ color: 0x00FFFF }),
            .8, // high friction
            .3 // low restitution
        );

        var borderRight = new Physijs.BoxMesh(
            borderGeo,
            borderMat,
            0
        );
        //var borderRight = new THREE.Mesh(borderGeo, borderMat);
        var borderLeft = new Physijs.BoxMesh(
            borderGeo,
            borderMat,
            0
        );
        //var borderLeft = new THREE.Mesh(borderGeo, borderMat);
        borderRight.position.set(100, 9.5, 0);
        borderLeft.position.set(100, 9.5, 50);

        var edgeRight = new THREE.EdgesGeometry(borderGeo);
        var lineRight = new THREE.LineSegments(edgeRight, new THREE.LineBasicMaterial({ color: 0x000000 }));
        lineRight.position.set(100, 9.5, 0.1);

        var edgeLeft = new THREE.EdgesGeometry(borderGeo);
        var lineLeft = new THREE.LineSegments(edgeLeft, new THREE.LineBasicMaterial({ color: 0x000000 }));
        lineLeft.position.set(100, 9.5, 49.9);
        
        
        scene.add(borderRight);
        scene.add(borderLeft);
        scene.add(lineRight);
        scene.add(lineLeft);
        
        
        
        var geometry = new THREE.BoxGeometry(500, 50, 2);
        var material = new THREE.MeshBasicMaterial({ color: 0x00FFFF, side: THREE.DoubleSide });
        
        var borderBottom = new Physijs.BoxMesh(
            geometry,
            material,
            0
            );
            
            var borderTop = new Physijs.BoxMesh(
                geometry,
                material,
                0
                );
                
                //var borderBottom = new THREE.Mesh(geometry, material);
                //var borderTop = new THREE.Mesh(geometry, material);
                borderBottom.rotation.x = Math.PI / 2.0;
                borderTop.rotation.x = Math.PI / 2.0;
                
                borderBottom.position.set(0, 20.5, 25);
                borderTop.position.set(0, -1.5, 25);
                
        scene.add(borderBottom);
        scene.add(borderTop);
        //#endregion
        
        
        spaceship(shipChoice);
        //spaceshipModel.addEventListener("collision", collisionHandler);
        scene.add(spaceshipModel);

        
        //playMusic();
        requestAnimationFrame(animate);
        console.log(spaceshipModel);
        console.log(hitbox.uuid);
        hitbox.addEventListener('collision', collisionHandler);
        scene.simulate();
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
                    obstacle.position.set(Math.random() * -200, Math.random() * 10, Math.random() * 39 + 5.5);
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
        }
    };

    document.addEventListener("keyup", onDocumentKeyUp, false);
    function onDocumentKeyUp(event) {
        var keyCode = event.which;

        if (keyCode == 90) {  //z key voor rotatie over rechts
            //rotateRight = false;

        } else if (keyCode == 88) { // x key voor rotatie over links
            //rotateLeft = false;

        } else if (keyCode == 37) { // left key voor bewegen naar links
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

    function stabiliseerSchip() {
        if (!(curRotLeftRight > -0.05)) //links
        {
            rotateLeft = true;
        }
        else if (!(curRotLeftRight < 0.05)) //rechts
        {
            rotateRight = true;
        }
        if (curRotY > 0.01) {
            rotateYLeft = true;
        }
        if (curRotY < -0.01) {
            rotateYRight = true;
        }
        if (curRotZ < -0.01) {
            rotateZRight = true;
        }
        if (curRotZ > 0.01) {
            rotateZLeft = true;
        }
        if (CurRotUpDown > 0.01) {
            rotateDown = true;
        }
        if (CurRotUpDown < -0.01) {
            rotateUp = true;
        }
    }

    function BuildAWall(amount) {
        wall = new THREE.Group();
        var z = 0;
        console.log(amount);

        for (var i = 0; i < 10; i++) {
            var geo = new THREE.BoxGeometry(10, 20, 4);
            var meshWall = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
            var wallPiece = new THREE.Mesh(geo, meshWall);


            if (i == amount) {
                z += 4;
                continue;
            }
            if (i == amount + 1) {
                z += 4;
                continue;
            }
            if (i == amount - 1 && amount == 9) {
                z += 4;
                continue;
            }

            wallPiece.position.set(0, 9.5, z + 7);

            wall.add(wallPiece);
            z += 4;
        }
        scene.add(wall);
    }

    function animate() {
        setTimeout(function () {

            requestAnimationFrame(animate);

            hitbox.__dirtyPosition = true;
            hitbox.__dirtyRotation = true;

            hitbox.position.set(spaceshipModel.position.x, spaceshipModel.position.y, spaceshipModel.position.z);
            hitbox.rotation.set(spaceshipModel.rotation.x, spaceshipModel.rotation.y, spaceshipModel.rotation.z);
            

            //cameraControls.update();
            updateScore();

            gameSpeed += 0.00025 * pause;

            group.position.x += gameSpeed * pause;
            wall.position.x += gameSpeed * pause;

            //#region movement
            if (group.position.x > 300 && wall.position.x > 120) {
                scene.remove(group);
                scene.remove(wall);
                var random = Math.ceil(Math.random() * 2);

                switch (random) {
                    case 1:
                        MakeObject();
                        break;
                    case 2:
                        BuildAWall(Math.ceil(Math.random() * 9))
                        break;
                }
            }

            if (moveRight == true) {
                spaceshipModel.position.z -= sideSpeed * pause;
                camera.position.z -= sideSpeed * pause;

                if (curRotLeftRight < 0.5 && curRotLeftRight > -0.6) { //zorgt voor draaiing over eigen as naar rechts
                    curRotLeftRight += rotationSpeed;
                    spaceshipModel.rotation.x -= rotationSpeed * pause;
                }
                if (curRotLeftRight > 0.45) //als de rotatie over eigen as voldoende is, draai het schip naar rechts
                {
                    if (curRotY < 0.3 && curRotY > -0.4) {
                        curRotY += noseTurnSpeed;
                        spaceshipModel.rotation.y -= noseTurnSpeed * pause;
                        //spaceshipModel.rotation.z -= noseTurnSpeed * pause;
                    }
                    if (curRotZ < 0.3 && curRotZ > -0.4) //test
                    {
                        curRotZ += noseTurnSpeed;
                        spaceshipModel.rotation.z -= noseTurnSpeed * pause;
                    }
                }
            }
            if (moveLeft == true) {
                spaceshipModel.position.z += sideSpeed * pause;
                camera.position.z += sideSpeed * pause;
                //hitbox.position.z += sideSpeed * pause;

                if (curRotLeftRight < 0.6 && curRotLeftRight > -0.5) { //zorgt voor draaiing over eigen as naar links
                    curRotLeftRight -= rotationSpeed;
                    spaceshipModel.rotation.x += rotationSpeed * pause;
                }
                if (curRotLeftRight < -0.45) //als de rotatie over eigen as voldoende is, draai het schip naar links
                {
                    if (curRotY < 0.4 && curRotY > -0.3) {
                        curRotY -= noseTurnSpeed;
                        spaceshipModel.rotation.y += noseTurnSpeed * pause;
                        //spaceshipModel.rotation.z += noseTurnSpeed * pause;
                    }
                    if (curRotZ < 0.4 && curRotZ > -0.3) //test
                    {
                        curRotZ += noseTurnSpeed;
                        spaceshipModel.rotation.z -= noseTurnSpeed * pause;
                    }
                }
            }
            if (moveUp == true) {
                spaceshipModel.position.y += 0.2 * pause;
                camera.position.y += 0.2 * pause;
                if (CurRotUpDown < 0.3 && CurRotUpDown > -0.3) {
                    CurRotUpDown += noseTurnSpeed;
                    spaceshipModel.rotation.z -= noseTurnSpeed * pause;
                }
            }
            if (moveDown == true) {
                spaceshipModel.position.y -= 0.2 * pause;
                camera.position.y -= 0.2 * pause;
                if (CurRotUpDown < 0.3 && CurRotUpDown > -0.3) {
                    CurRotUpDown -= noseTurnSpeed;
                    spaceshipModel.rotation.z += noseTurnSpeed * pause;
                }
            }
            if (rotateRight == true) { //roteert het schip zijn rol over eigen as terug naar rechtop
                if (curRotLeftRight > 0.01) {
                    spaceshipModel.rotation.x += 0.05 * pause;
                    curRotLeftRight -= 0.05;
                } else {
                    rotateRight = false;
                }
            }
            if (rotateLeft == true) { //roteert het schip zijn rol over eigen as terug naar rechtop
                if (curRotLeftRight < -0.01) {
                    spaceshipModel.rotation.x -= 0.05 * pause;
                    curRotLeftRight += 0.05;
                } else {
                    rotateLeft = false;
                }
            }
            if (rotateYLeft == true) {

                if (curRotY > 0.01) {
                    spaceshipModel.rotation.y += 0.05 * pause;
                    curRotY -= 0.05;
                } else {
                    rotateYLeft = false;
                }
            }
            if (rotateYRight == true) {

                if (curRotY < -0.01) {
                    spaceshipModel.rotation.y -= 0.05 * pause;
                    curRotY += 0.05;
                } else {
                    rotateYRight = false;
                }
            }
            if (rotateZLeft == true) {

                if (curRotZ > 0.01) {
                    spaceshipModel.rotation.z += 0.05 * pause;
                    curRotZ -= 0.05;
                } else {
                    rotateZLeft = false;
                }
            }
            if (rotateZRight == true) {

                if (curRotZ > 0.01) {
                    spaceshipModel.rotation.z -= 0.05 * pause;
                    curRotZ -= 0.05;
                } else {
                    rotateZRight = false;
                }
            }
            if (rotateUp == true) {
                if (CurRotUpDown < -0.01) {
                    spaceshipModel.rotation.z -= 0.03 * pause;
                    CurRotUpDown += 0.03;
                } else {
                    rotateUp = false;
                }
            }
            if (rotateDown == true) {
                if (CurRotUpDown > 0.01) {
                    spaceshipModel.rotation.z += 0.03 * pause;
                    CurRotUpDown -= 0.03;
                } else {
                    rotateDown = false;
                }
            }
            
            //#endregion
        }, 1000 / 60);

        //renderer.render();
        scene.simulate();
        renderer.render(scene, camera);
    }

    function spaceship(choice) {
        var scale, shipX = 0, shipY = 0, shipZ = 0, path, obj, mtl, shipRotationX = 0, shipRotationY = 0, shipRotationZ = 0, mat;

        //#region hitbox
        mat = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({ color: 0xfff }),
            .6, // medium friction
            .3 // low restitution
        );

        hitbox = new Physijs.BoxMesh(
            new THREE.BoxGeometry(5, 0, 3),
            mat,
            1
        );
        hitbox.position.set(85, 5, 15);
        console.log(hitbox);
        hitbox.setLinearVelocity(0, 0, 0);
        //hitbox.material.transparent = true;
        hitbox.material.opacity = 0;

        var hitboxBack = new Physijs.BoxMesh(
            new THREE.BoxGeometry(0, 0.5, 7),
            mat
        );
        hitboxBack.position.set(2.5, 0, 0);
        hitboxBack.material.transparent = true;
        hitboxBack.material.opacity = 0;

        var hitboxUpDown = new Physijs.BoxMesh(
            new THREE.BoxGeometry(1, 3, 3),
            mat
        );
        hitboxUpDown.position.set(2.5, 0, 0);
        //hitboxUpDown.material.transparent = true;
        hitboxUpDown.material.opacity = 0;

        //hitbox.add(hitboxBack);
        //hitbox.add(hitboxUpDown);

        hitbox.collisions = 0;

        hitbox.name = "Kevin";
        console.log(hitbox.name);
        console.log(hitbox.uuid);

        
        // hitboxFront.addEventListener('collision', collisionHandler);
        // hitboxBack.addEventListener('collision', collisionHandler);
        // hitboxUpDown.addEventListener('collision', collisionHandler);
        
        
        scene.add(hitbox);        
       
        //#endregion
        
        switch (choice) {
            case '1':
                scale = 0.01;
                path = 'models/spaceship/';
                obj = 'spaceship.obj';
                mtl = 'spaceship.mtl';
                shipX = 85;
                shipY = 5;
                shipZ = 15;
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
                // spaceshipModel.add(hitboxBack);
        // spaceshipModel.add(hitboxUpDown);
    }

    //#region music
    function playMusic() {
        audio = new Audio('music/500miles.mp3');
        audio.volume = 0.3;
        console.log(audio);
        audio.loop = true;
        audio.play();

    }

    function pauseMusic() {
        console.log("pause");
        audio.pause();
    }

    function resumeMusic() {
        console.log("play");
        audio.play();
    }
    //#endregion

    function collisionHandler(other_object, relative_velocity, relative_rotation, contact_normal) {
        // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`

        console.log(other_object);
        console.log("in collision");
        if (this.collisions != 0) {
            console.log("hit");
        }
        switch (++this.collisions) {
            case 1:
                console.log("1 hit");
                break;
            case 2:
                console.log("2 hit");
                break;
            case 3:
                console.log("3 hit");
                break;
        }
        if (other_object.name !== "spaceshipModel") {
            console.log("shap");
        }
    }

    init();
    MakeObject();
    animate();
};