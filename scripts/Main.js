window.onload = function () {
    var scene = new THREE.Scene();
    var spaceshipModel = new THREE.Group();

    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // end template here

    //skybox
    // var skyboxgeo = new THREE.SphereGeometry(500, 32, 32);
    // var skyboxmat = new THREE.MeshBasicMaterial({ color: new THREE.TextureLoader().load("textures/skybox.jpg"), side: THREE.DoubleSide });
    // var skybox = new THREE.Mesh(skyboxgeo, skyboxmat);
    // scene.add(skybox);

    //schipvariabelen
    var shipChoice = prompt("voer een 1 in voor een generiek ruimteschip, 2 voor een spaceshuttle en 3 voor een vliegtuigje");
    var rotationSpeed = 0; //de snelheid van de rotatie

    //bewegingsvariabele
    var moveRight = false;
    var moveLeft = false;
    var moveUp = false;
    var moveDown = false;
    var rotateLeft = false;
    var rotateRight = false;

    //scene.add();
    camera.position.x = 0;
    camera.position.y = 1.7;
    camera.position.z = 9;
    camera.rotation.y = 3;

    scene.add(camera);
    scene.add(spaceshipModel);

    var light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    scene.add(directionalLight);

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

        render();
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

        render();
    };

    var render = function () {
        requestAnimationFrame(render);

        if (moveRight == true) {
            spaceship.position.x -= 0.01;
        }
        if (moveLeft == true) {
            spaceship.position.x += 0.01;
        }
        if (moveUp == true) {
            spaceship.position.y += 0.01;
        }
        if (moveDown == true) {
            spaceship.position.y -= 0.01;
        }
        if (rotateRight == true) {
            spaceship.rotation.z += rotationSpeed;
        }
        if (rotateLeft == true) {
            spaceship.rotation.z -= rotationSpeed;
        }

        renderer.render(scene, camera);
    };

    function spaceship() {
        var scale, rotateSpeed = 0.005, shipX = 0, shipY = 0, shipZ = 20, path, obj, mtl, shipRotationX = 0, shipRotationY = 0, shipRotationZ = 0;
        switch (shipChoice) {
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
                        rotationSpeed = rotateSpeed;
                        spaceshipModel.add(object);
                    });
            });
    }

    render();
};