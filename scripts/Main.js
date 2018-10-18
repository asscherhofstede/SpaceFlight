window.onload = function () {

    'use strict';

    Physijs.scripts.worker = 'scripts/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';

    var scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3(0, -30, 0));
    // scene.addEventListener(
    // 	'update',
    // 	function() {
    // 		scene.simulate( undefined, 1 );
    // 		physics_stats.update();
    // 	}
    // );

    var spaceshipModel = new THREE.Group();
    var wall = new THREE.Group();

    var renderer = new THREE.WebGLRenderer();

    var audio, camera, group, cameraControls;
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

        var light = new THREE.AmbientLight(0xFFFFFF);
        scene.add(light);

        //skybox
        var skyboxGeo = new THREE.PlaneGeometry(50, 20);
        var skyboxMat = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/skybox.jpg"), side: THREE.DoubleSide});
        var skybox = new THREE.Mesh(skyboxGeo, skyboxMat);

        skybox.position.set(-50, 9.5, 22);
        skybox.rotation.y = Math.PI / 2 ;
        scene.add(skybox);

        //Eindfoto
        var endPlaneGeo = new THREE.PlaneGeometry(50, 20);
        var endPlaneMat = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/skybox/skybox.png"), side: THREE.DoubleSide});
        var endPlane = new THREE.Mesh(endPlaneGeo, endPlaneMat);

        endPlane.position.set(-60, 9.5, 22);
        endPlane.rotation.y = Math.PI / 2 ;
        scene.add(endPlane);

        //var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        // scene.add(directionalLight);

        var borderGeo = new THREE.BoxBufferGeometry(1000, 20, 10);
        var borderMat = new THREE.MeshBasicMaterial({color: 0x00FFFF});
        var borderRight = new THREE.Mesh(borderGeo, borderMat);
        var borderLeft = new THREE.Mesh(borderGeo, borderMat);
        borderRight.position.set(100, 9.5, 0);
        borderLeft.position.set(100, 9.5, 50);

        var edgeRight = new THREE.EdgesGeometry(borderGeo);
        var lineRight = new THREE.LineSegments(edgeRight, new THREE.LineBasicMaterial({color: 0x000000}))
        lineRight.position.set(100, 9.5, 0.1);

        var edgeLeft = new THREE.EdgesGeometry(borderGeo);
        var lineLeft = new THREE.LineSegments(edgeLeft, new THREE.LineBasicMaterial({color: 0x000000}))
        lineLeft.position.set(100, 9.5, 49.9);

        
        scene.add(borderRight);
        scene.add(borderLeft);
        scene.add(lineRight);
        scene.add(lineLeft);

        var geometry = new THREE.PlaneGeometry(1000, 100, 100);
        var material = new THREE.MeshBasicMaterial({ color: 0x00FFFF, side: THREE.DoubleSide });
        var borderBottom = new THREE.Mesh(geometry, material);
        var borderTop = new THREE.Mesh(geometry, material);
        borderBottom.rotation.x = Math.PI / 2.0;
        borderTop.rotation.x = Math.PI / 2.0;

        borderBottom.position.set(100, 19.5, 0);
        borderTop.position.set(100, -0.5, 0);

        scene.add(borderBottom);
        scene.add(borderTop);

        spaceship(shipChoice);

        playMusic();
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
            updateScore();

            gameSpeed += 0.00025 * pause;
                
            group.position.x += gameSpeed * pause;
            wall.position.x += gameSpeed * pause;
            if (group.position.x > 300 && wall.position.x > 200) {
                
                scene.remove(group);
                scene.remove(wall);
                var random = Math.ceil(Math.random() * 2);

                switch (random){
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

        var hitboxFront = new Physijs.BoxMesh(
            new THREE.BoxGeometry(200, 50, 500),
            new THREE.MeshBasicMaterial({ color: 0xfff })
        );
        hitboxFront.position.z = 50;
        hitboxFront.material.transparent = true;
        hitboxFront.material.opacity = 0;

        var hitboxBack = new Physijs.BoxMesh(
            new THREE.BoxGeometry(1000, 50, 200),
            new THREE.MeshBasicMaterial({ color: 0x888888 })
        );
        hitboxBack.position.z = -200;
        hitboxBack.material.transparent = true;
        hitboxBack.material.opacity = 0;

        var hitboxUpDown = new Physijs.BoxMesh(
            new THREE.BoxGeometry(300, 300, 200),
            new THREE.MeshBasicMaterial({ color: 0xF4F1F2 })
        );
        hitboxUpDown.position.z = -200;
        hitboxUpDown.material.transparent = true;
        hitboxUpDown.material.opacity = 0;

        hitboxFront.addEventListener( 'collision', collisionHandler);
        hitboxBack.addEventListener( 'collision', collisionHandler);
        hitboxUpDown.addEventListener( 'collision', collisionHandler);
        

        spaceshipModel.add(hitboxFront);
        spaceshipModel.add(hitboxBack);
        spaceshipModel.add(hitboxUpDown);
    }

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

    function collisionHandler( other_object, relative_velocity, relative_rotation, contact_normal ) {
        // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
        if(this.collisions != 0) {
            console.log("hit");
        }
    }

    
    init();
    group = MakeObject();
    scene.add(group);
    animate();
};