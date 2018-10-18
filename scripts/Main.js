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

    //gamevars
    var pause = 1;
    var gameSpeed = 0.5;

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

    function onDocumentKeyDown(event) {
        switch (event.which){
            case 80:
                if(pause == 1){
                    pause = 0;
                    pauseMusic();
                } else {
                    pause = 1;
                    resumeMusic();
                }
        }
    };    

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
                        wall = BuildAWall(Math.ceil(Math.random() * 9));
                        scene.add(wall);
                        break;
                    case 2:
                        group = MakeObject();
                        scene.add(group);
                        break;
                }
            }
            AnimateSpaceshipM(spaceshipModel, camera);
            
        }, 1000 / 60);
        
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
    group = MakeObject();
    scene.add(group);
    animate();
};