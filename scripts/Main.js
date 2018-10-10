window.onload = function () {
    var spaceshipModel = new THREE.Group();

    var renderer = new THREE.WebGLRenderer();
    // end template here

    //skybox
    // var skyboxgeo = new THREE.SphereGeometry(500, 32, 32);
    // var skyboxmat = new THREE.MeshBasicMaterial({ color: new THREE.TextureLoader().load("textures/skybox.jpg"), side: THREE.DoubleSide });
    // var skybox = new THREE.Mesh(skyboxgeo, skyboxmat);
    // scene.add(skybox);

    //schipvariabelen
    var shipChoice = prompt("voer een 1 in voor een generiek ruimteschip, 2 voor een spaceshuttle en 3 voor een vliegtuigje");
    var rotationSpeed = 0.005; //de snelheid van de rotatie

    //bewegingsvariabele
    var moveRight = false;
    var moveLeft = false;
    var moveUp = false;
    var moveDown = false;
    var rotateLeft = false;
    var rotateRight = false;

    function init() {
        scene = new THREE.Scene();

        // camera 
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        cameraControls = new THREE.OrbitControls(camera);
        camera.position.set(10, 0, 100);
        cameraControls.update();
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

        } else if (keyCode == 39) { // right key voor bewegen naar rechts
            moveRight = true;

        } else if (keyCode == 38) { // up key voor naar boven
            moveUp = true;

        } else if (keyCode == 40) { //down key voor naar beneden
            moveDown = true;
        }

        animate();
    };

    document.addEventListener("keyup", onDocumentKeyUp, false);
    function onDocumentKeyUp(event) {
        var keyCode = event.which;

        if (keyCode == 90) {  //z key voor rotatie over rechts
            rotateRight = false;

        } else if (keyCode == 88) { // x key voor rotatie over links
            rotateLeft = false;

        } else if (keyCode == 37) { // left key voor bewegen naar links
            moveLeft = false;

        } else if (keyCode == 39) { // right key voor bewegen naar rechts
            moveRight = false;

        } else if (keyCode == 38) { // up key voor naar boven
            moveUp = false;

        } else if (keyCode == 40) { //down key voor naar beneden
            moveDown = false;
        }

        animate();
    };

    function animate() {
        requestAnimationFrame(animate);
        cameraControls.update();
        group.position.x += 0.5;
        if (group.position.x > 300) {
            scene.remove(group);
            MakeObject();
        }

        if (moveRight == true) {
            spaceshipModel.position.x -= 0.01;
        }
        if (moveLeft == true) {
            spaceshipModel.position.x += 0.01;
        }
        if (moveUp == true) {
            spaceshipModel.position.y += 0.01;
        }
        if (moveDown == true) {
            spaceshipModel.position.y -= 0.01;
        }
        if (rotateRight == true) {
            spaceshipModel.rotation.z += rotationSpeed;
        }
        if (rotateLeft == true) {
            spaceshipModel.rotation.z -= rotationSpeed;
        }

        renderer.render(scene, camera);
    }

    function spaceship(choice) {
        var scale, shipX = 0, shipY = 0, shipZ = 20, path, obj, mtl, shipRotationX = 0, shipRotationY = 0, shipRotationZ = 0;
        switch (choice) {
            case 1:
                scale = 0.01;
                path = 'models/spaceship/';
                obj = 'spaceship.obj';
                mtl = 'spaceship.mtl';
                break;

            case 2:
                scale = 0.5;
                path = 'models/spaceshuttle/';
                obj = 'spaceshuttle.obj';
                mtl = 'spaceshuttle.mtl';
                shipRotationX = -1.413717;
                shipRotationZ = Math.PI;
                break;

            case 3:
                scale = 6;
                path = 'models/plane/';
                obj = 'plane.obj';
                mtl = 'plane.mtl';
                shipZ = 10;
                shipRotationY = -1.57;
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
                        object.position.set(shipX, shipY, shipZ);
                        object.scale.set(scale, scale, scale);
                        object.rotation.set(shipRotationX, shipRotationY, shipRotationZ);
                        spaceshipModel.add(object);
                    });
            });
    }

    init();
    MakeObject();
    animate();
};