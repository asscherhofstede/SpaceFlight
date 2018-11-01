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

    var menu = false;

    var spaceshipModel = new THREE.Group();
    var wall;
    var death = false;
    var menu = false;
    var menu1;
    var borderBottom, borderLeft, borderRight;

    var audio, camera, group, cameraControls, hitbox, deathPlane, resetGame;
    
    //gamevars
    var pause = false;
    var gameSpeed = 0.25;

    //spelerscore
    var playerScore = 1;
    var a = 1;
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
        //text2.style.backgroundColor = "turquoise";
        textHighscore.style.fontSize = 32 + "px";
        textHighscore.style.top = 44 + 'px';
        textHighscore.style.right = 150 + 'px';
        textHighscore.innerHTML = GetHighscore();
        document.body.appendChild(textHighscore);
    }

    function init() {
        // camera
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 150);
        //cameraControls = new THREE.OrbitControls(camera);
        camera.position.set(65, 7, 20);
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
        var borderGeo = new THREE.BoxGeometry(500, 20, 10);
        var borderMat = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({ color: 0x00FFFF }),
            .8, // high friction
            .3 // low restitution
        );

        borderRight = new Physijs.BoxMesh(
            borderGeo,
            borderMat,
            0
        );

        borderLeft = new Physijs.BoxMesh(
            borderGeo,
            borderMat,
            0
        );

        borderRight.position.set(0, 9.5, 0);
        borderLeft.position.set(0, 9.5, 50);

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



        var geometry = new THREE.BoxGeometry(500, 50, 0.1);
        var material = new THREE.MeshBasicMaterial({ color: 0x00FFFF, side: THREE.DoubleSide });

        borderBottom = new Physijs.BoxMesh(
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

        borderBottom.position.set(0, 19.6, 25);
        borderTop.position.set(0, -.6, 25);

        scene.add(borderBottom);
        scene.add(borderTop);
        //#endregion


        spaceship();
        scene.add(spaceshipModel);


        playMusic();
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
                if(death){
                    window.location.reload();
                }
                if(menu){
                    menu = false;
                    camera.position.set(65, 7, 20);
                    resumeMusic();
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
        }
    };

    function animate() {
        console.log("credits");
        console.log("Kevin visser the Paper boy");
        console.log("Sander Beijaard the pineapple/robot");
        console.log("Adriaan Beenen f3001 man");
        console.log("Asscher Hofstede the pineapple hater");
        setTimeout(function () {

            requestAnimationFrame(animate);

            if(!menu && !death){
                hitbox.__dirtyPosition = true;
                hitbox.__dirtyRotation = true;
    
                hitbox.position.set(spaceshipModel.position.x, spaceshipModel.position.y, spaceshipModel.position.z);
                hitbox.rotation.set(spaceshipModel.rotation.x, spaceshipModel.rotation.y, spaceshipModel.rotation.z);
    
                updateScore();
                
                gameSpeed += 0.000015;
    
                wall.position.x += gameSpeed;
    
                wall.__dirtyPosition = true;
    
                if (wall.position.x > 220) {
                    scene.remove(wall);
                    var random = Math.ceil(Math.random() * 4);
    
                    switch (random) {
                        case 1:
                            wall = BuildAWall(Math.ceil(Math.random() * 9));
                            scene.add(wall);
                            break;
                        case 2:
                            wall = smileyWall();
                            scene.add(wall);
                            break;
                        case 3:
                            wall = hoekenUitWall();
                            scene.add(wall);
                            break;
                        case 4:
                            wall = lolWall();
                            scene.add(wall);
                            break;
                    }
                }

                if(playerScore % 200 == 0){
                    var targetColor = new THREE.Color(Math.random() * 0xffffff);
                    console.log("Ja");
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

                scene.simulate();
                AnimateSpaceshipM(spaceshipModel, camera);
            }

            else if(death){
                
                if(deathPlane.position.x < 925 && deathPlane.material.opacity < 1){
                    deathPlane.material.opacity += 0.001;
                    deathPlane.position.x += 0.01;
                }
                else{
                    resetGame.material.opacity = 1;
                }
            }


        });

        renderer.render(scene, camera);
    }

    function spaceship() {
        //#region hitbox
        var mat = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({ color: 0xfff }),
            .6, // medium friction
            .3 // low restitution
        );

        hitbox = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 0.4, .8), mat, 1);

        var hitboxBack = new Physijs.BoxMesh(new THREE.BoxGeometry(0, 0.5, 2.4), mat);
        var hitboxUpDown = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 1, 1), mat);

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

        console.log(other_object);
        console.log("in collision");
        if (this.collisions != 0) {
            console.log("hit");
        }
        switch (++this.collisions) {
            case 1:
                console.log("1 hit");
                death = true;
                SetHighscore(playerScore);
                YouDiedMusic();
                YouDied();
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
    
    function YouDied(){
        a = 0;
        pause = 0;
        
        camera.position.set(1000, 1000, 1000);
        var deathGeo = new THREE.PlaneGeometry(80, 40);
        var deathMaterial = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("Images/YouDied.jpg")});

        deathPlane = new THREE.Mesh(deathGeo, deathMaterial);
        deathPlane.position.set(915, 1000, 1000);
        deathPlane.rotation.y = Math.PI / 2;
        deathPlane.material.transparent = true;
        deathPlane.material.opacity = 0;        
        scene.add(deathPlane);

        var resetGeo = new THREE.PlaneGeometry(65, 12);
        var resetMat = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("Images/Restart.png")})
        resetGame = new THREE.Mesh(resetGeo, resetMat);
        resetGame.position.set(950, 980, 999);
        resetGame.rotation.y = Math.PI / 2;
        resetGame.material.transparent = true;
        resetGame.material.opacity = 0;
        scene.add(resetGame)
    }
    function Menu(){
        menu = true;

        camera.position.set(-500,-500,-500);        

        var startGeo = new THREE.PlaneGeometry(240, 170);
        var startmenu = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("Images/startscherm.png")})

        var pressSpace = new THREE.Mesh(startGeo, startmenu);
        
        pressSpace.position.set(-600,-510,-500);
        pressSpace.rotation.y = Math.PI / 2;
        scene.add(pressSpace);

        // var spaceGeo = new THREE.PlaneGeometry(50, 15);
        // var resetspace = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/spaceinvaders.png")})

        // var logo = new THREE.Mesh(spaceGeo, resetspace);
        
        // logo.position.set(-600,-500,-500);
        // logo.rotation.y = Math.PI /2;
        // scene.add(logo);


    }
    
    init();
    wall = BuildAWall(Math.ceil(Math.random() * 9));
    scene.add(wall);
    animate();
};
