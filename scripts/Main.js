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

    //#region Variabelen
    var spaceshipModel = new THREE.Group();
    var death = false;
    var menu = false;
    var difficultyLast = 1;
    var difficultyNow = 1;
    var difficulty = 1;

    var wall, camera, hitbox, deathPlane, resetGame, borderBottom, borderLeft, borderRight, borderTop;

    //gamevars
    var pause = false;
    var gameSpeed = 0.25;

    //spelerscore
    var playerScore = 1;
    var a = 1;
    //#endregion

    function updateScore() {
        a += 0.25;
        playerScore = Math.round(a);
        //tekst
        var text2 = document.getElementById("score");
        text2.style.position = 'absolute';
        text2.style.width = 100;
        text2.style.height = 20;
        //text2.style.backgroundColor = "turquoise";
        text2.style.fontSize = 32 + "px";
        text2.style.top = 44 + 'px';
        text2.style.left = 240 + 'px';
        text2.innerHTML = playerScore;
        document.body.appendChild(text2);
    }

    function updateHighscore() {
        var textHighscore = document.getElementById("highscore");
        textHighscore.style.position = 'absolute';
        textHighscore.style.width = 100;
        textHighscore.style.height = 20;
        //textHighscore.style.backgroundColor = "turquoise";
        textHighscore.style.fontSize = 32 + "px";
        textHighscore.style.top = 44 + 'px';
        textHighscore.style.right = 150 + 'px';
        if (playerScore > GetHighscore()) {
            textHighscore.innerHTML = playerScore;
        }
        else {
            textHighscore.innerHTML = GetHighscore();
        }
        document.body.appendChild(textHighscore);
    }

    function init() {
        // camera
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 150);
        camera.position.set(65, 7, 20);
        camera.rotation.y = 180 * (Math.PI / 360);
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
        var borderGeoLR = new THREE.BoxBufferGeometry(500, 20, 10);
        var borderGeoTB = new THREE.BoxBufferGeometry(500, 50, 0.1);

        var borderMat = new THREE.MeshBasicMaterial({ color: 0x00FFFF, side: THREE.DoubleSide });

        //Maak alle muren aan
        borderRight = new THREE.Mesh(borderGeoLR, borderMat);
        borderLeft = new THREE.Mesh(borderGeoLR, borderMat);
        borderBottom = new THREE.Mesh(borderGeoTB, borderMat);
        borderTop = new THREE.Mesh(borderGeoTB, borderMat);   
        
        borderRight.position.set(0, 9.5, 0);
        borderLeft.position.set(0, 9.5, 50);
        borderBottom.position.set(0, 19.6, 25);
        borderTop.position.set(0, -.6, 25);
        
        borderBottom.rotation.x = Math.PI / 2.0;
        borderTop.rotation.x = Math.PI / 2.0;

        //Maak een zwarte rand rond de zijmuren
        var edge = new THREE.EdgesGeometry(borderGeoLR);

        var lineRight = new THREE.LineSegments(edge, new THREE.LineBasicMaterial({ color: 0x000000 }));
        var lineLeft = new THREE.LineSegments(edge, new THREE.LineBasicMaterial({ color: 0x000000 }));
        
        lineLeft.position.set(100, 9.5, 49.9);
        lineRight.position.set(100, 9.5, 0.1);
        
        //Zet alle muren in de scene
        scene.add(borderBottom);
        scene.add(borderTop);
        scene.add(borderRight);
        scene.add(borderLeft);
        scene.add(lineRight);
        scene.add(lineLeft);
        //#endregion


        spaceship();
        scene.add(spaceshipModel);


        //playMusic();
        requestAnimationFrame(animate);
        hitbox.addEventListener('collision', collisionHandler);
        scene.simulate();
        Menu();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentKeyDown(event) {
        switch (event.which) {
            case 32:
                if (death) {
                    window.location.reload();
                }
                if (menu) {
                    menu = false;
                    camera.position.set(65, 7, 20);
                    playMusic();
                }
                break;
            case 80:
                if (pause) {
                    pause = false;
                    //pauseMusic();
                } else {
                    pause = true;
                    //resumeMusic();
                }
                break;
            case 67:
                camera.position.z -= 30;
                break;
        }
    };

    function animate() {
        requestAnimationFrame(animate);

        if (!menu && !death) {
            hitbox.__dirtyPosition = true;
            hitbox.__dirtyRotation = true;

            hitbox.position.set(spaceshipModel.position.x, spaceshipModel.position.y, spaceshipModel.position.z);
            hitbox.rotation.set(spaceshipModel.rotation.x, spaceshipModel.rotation.y, spaceshipModel.rotation.z);

            updateScore();
            updateHighscore();
            if (gameSpeed < 0.50) {
                gameSpeed += 0.00003;
            }

            wall.position.x += gameSpeed;

            wall.__dirtyPosition = true;

            if (wall.position.x > camera.position.x + 5) {
                scene.remove(wall);
                //wall = null;

                wall = IncreaseDifficulty(difficulty);
                scene.add(wall);
            }

            //Na elke 200 punten word de moeilijkheidsgraad 1 omhoog gedaan(er spawnen meer obstakels)
            //en de kleur van de border verandert in een random andere kleur
            if (playerScore % 200 == 0) {
                
                var targetColor = new THREE.Color(Math.random() * 0xffffff);
                TweenMax.to(borderBottom.material.color, 2, {
                    r: targetColor.r,
                    g: targetColor.g,
                    b: targetColor.b
                });
                TweenMax.to(borderLeft.material.color, 2, {
                    r: targetColor.r,
                    g: targetColor.g,
                    b: targetColor.b
                });
            }

            if (playerScore % 500 == 0) {
                difficultyLast++;
                if (difficultyLast == (difficultyNow + 4)) {
                    difficultyNow = difficultyLast;
                    difficulty++;
                }
            }

            scene.simulate();
            AnimateSpaceshipM(spaceshipModel, camera);

        }

        else if (death) {
            if (deathPlane.position.x < 925 && deathPlane.material.opacity < 1) {
                deathPlane.material.opacity += 0.001;
                deathPlane.position.x += 0.01;
            }
            else {
                resetGame.material.opacity = 1;
            }
        }
        renderer.render(scene, camera);
    }

    function spaceship() {
        //#region hitbox
        var mat = Physijs.createMaterial(new THREE.MeshBasicMaterial({ color: 0xfff }), 0.6, 0.3);

        hitbox = new Physijs.BoxMesh(new THREE.BoxBufferGeometry(2, 0.4, .8), mat, 1);

        var hitboxBack = new Physijs.BoxMesh(new THREE.BoxBufferGeometry(0, 0.5, 2.4), mat);
        var hitboxUpDown = new Physijs.BoxMesh(new THREE.BoxBufferGeometry(1, 1, 1), mat);

        hitbox.position.set(85, 5, 15);
        hitboxBack.position.set(1, 0, 0);
        hitboxUpDown.position.set(1, 0, 0);

        hitbox.add(hitboxBack);
        hitbox.add(hitboxUpDown);

        hitbox.setLinearVelocity(0, 0, 0);
        hitbox.material.transparent = true;
        hitbox.material.opacity = 0;

        hitbox.collisions = 0;

        scene.add(hitbox);
        //#endregion

        new THREE.MTLLoader()
            .setPath('models/spaceship/')
            .load('spaceship.mtl', function (materials) {
                materials.preload();

                new THREE.OBJLoader()
                    .setMaterials(materials)
                    .setPath('models/spaceship/')
                    .load('spaceship.obj', function (object) {
                        spaceshipModel.add(object);
                        spaceshipModel.position.set(55, 5, 20);
                        object.scale.set(0.005, 0.005, 0.005);
                        object.rotation.set(0, (Math.PI / 2) * 3, 0);
                    });
            });
    }

    function collisionHandler(other_object, relative_velocity, relative_rotation, contact_normal) {
        // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
        switch (++this.collisions) {
            case 1:
                death = true;
                SetHighscore(playerScore);
                YouDiedMusic();
                YouDied();
                break;
        }
    }

    function GetHighscore() {
        //get cookie
        var highscore = document.cookie;
        highscore = highscore.substring(highscore.indexOf("=") + 1);
        return highscore;
    }

    function SetHighscore(score) {
        if (GetHighscore() < score) {
            //set cookie
            document.cookie = "highscore=" + score;
            console.log(">");
        }
    }

    function YouDied() {
        a = 0;
        pause = 0;
        console.log(wall);
        camera.position.set(1000, 1000, 1000);
        var deathGeo = new THREE.PlaneBufferGeometry(80, 40);
        var deathMaterial = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load("Images/YouDied.jpg") });

        deathPlane = new THREE.Mesh(deathGeo, deathMaterial);
        deathPlane.position.set(915, 1000, 1000);
        deathPlane.rotation.y = Math.PI / 2;
        deathPlane.material.transparent = true;
        deathPlane.material.opacity = 0;
        scene.add(deathPlane);

        var resetGeo = new THREE.PlaneBufferGeometry(65, 12);
        var resetMat = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load("Images/Restart.png") })
        resetGame = new THREE.Mesh(resetGeo, resetMat);
        resetGame.position.set(950, 980, 999);
        resetGame.rotation.y = Math.PI / 2;
        resetGame.material.transparent = true;
        resetGame.material.opacity = 0;
        scene.add(resetGame)

        //tekst
        var text2 = document.getElementById("eindscore");
        var text3 = document.getElementById("textEind");
        text2.style.position = 'absolute';
        text2.style.width = 100;
        text2.style.height = 20;
        text2.style.color = "white";
        text2.style.fontSize = 32 + "px";
        text2.style.top = 44 + 'px';
        text2.style.left = 960 + 'px';
        text2.innerHTML = playerScore;
        text3.innerHTML = "<h1>Eindscore: </h1>";
        document.body.appendChild(text2);

    }

    function Menu() {
        menu = true;

        camera.position.set(-500, -500, -500);

        var startGeo = new THREE.PlaneBufferGeometry(240, 170);
        var startmenu = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("Images/startscherm.png") })

        var pressSpace = new THREE.Mesh(startGeo, startmenu);

        pressSpace.position.set(-600, -510, -500);
        pressSpace.rotation.y = Math.PI / 2;
        scene.add(pressSpace);
    }

    init();
    wall = IncreaseDifficulty(difficulty);
    scene.add(wall);
    animate();
};
