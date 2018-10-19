//Load Meteors
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
    return group;
}

//Bouw een muur
function BuildAWall(amount, scene){
    var wall = new Physijs.BoxMesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0xFFFFFF}));
    wall.position.set(0, 0, -10);
    var z = 10;

    for(var i = 0; i < 10; i++){

        var geo = new THREE.BoxGeometry(10, 20, 4);
        var meshWall = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("textures/Obstacle/Wall.jpg")}),
            0, // high friction
            0 // low restitution
        );
        var wallPiece = new Physijs.BoxMesh(
            geo,
            meshWall,
            0
        );

        if(i == amount){
            z += 4;
            continue;
        }
        if(i == amount + 1){
            z += 4;
            continue;
        }
        if(i == amount - 1 && amount == 9){
            z += 4;
            continue;
        }
        wallPiece.position.set(-50, 9.5, z + 7);
        
        wall.add(wallPiece);
        z += 4;
    }
    return wall;
}