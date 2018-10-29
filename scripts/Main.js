window.onload = function () {

    'use strict';

    Physijs.scripts.worker = 'scripts/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';

    var scene = new Physijs.Scene;
    var borderMat, material;

    var renderer = new THREE.WebGLRenderer();
    scene.setGravity(new THREE.Vector3(0, 0, 0));
    scene.addEventListener(
        'update',
        function () {
            scene.simulate(undefined, 1);
        }
    );

    var spaceshipModel = new THREE.Group();
    var wall;

    var audio, camera, group, cameraControls, hitbox;

    //gamevars
    var pause = 1;
    var gameSpeed = 0.25;

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
        borderMat = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({ color: 0x00FFFF }),
            .8, // high friction
            .3 // low restitution
        );

        var borderRight = new Physijs.BoxMesh(
            borderGeo,
            borderMat,
            0
        );

        var borderLeft = new Physijs.BoxMesh(
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
        material = new THREE.MeshBasicMaterial({ color: 0x00FFFF, side: THREE.DoubleSide });

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
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentKeyDown(event) {
        switch (event.which) {
            case 80:
                if (pause == 1) {
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

            
            gameSpeed += 0.000015 * pause;

            wall.position.x += gameSpeed * pause;

            wall.__dirtyPosition = true;

            //console.log(wall.position.x);

            if (wall.position.x > 120) {
                scene.remove(wall);
                var random = 1 // Math.ceil(Math.random() * 2);

                switch (random) {
                    case 1:
                        wall = BuildAWall(Math.ceil(Math.random() * 9));
                        scene.add(wall);
                        break;
                }
            }
            
            scene.simulate();
            AnimateSpaceshipM(spaceshipModel, camera);
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

        hitbox.name = "Kevin";
        console.log(hitbox.name);
        console.log(hitbox.uuid);

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
                //End Game
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
    wall = BuildAWall(Math.ceil(Math.random() * 9), scene);
    scene.add(wall);
    console.log(wall);
    animate();
};