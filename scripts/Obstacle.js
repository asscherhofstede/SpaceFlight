//vars
var meshWall = Physijs.createMaterial(
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("textures/Obstacle/test.png")}),
    0, // high friction
    0 // low restitution
);

var meshWall2 = Physijs.createMaterial(
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("textures/Obstacle/test2.png")}),
    0, // high friction
    0 // low restitution
);

var meshWall3 = Physijs.createMaterial(
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("textures/Obstacle/test3.png")}),
    0, // high friction
    0 // low restitution
);

var geo = new THREE.BoxGeometry(2.5, 2.5, 2.5);


//walls
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
function BuildAWall(amount, x, z, wall){
    for(var i = 0; i < 10; i++){
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
        wallPiece.position.set(x, 8.5, z + 7);
        
        wall.add(wallPiece);
        z += 4;
    }
    console.log(wall);
    return wall;
}

function smileyWall(){
    wall = new Physijs.BoxMesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0xFFFFFF}));
    wall.position.set(0, 0, -10);
    var z = 10;
    for(var j = 0.5; j <= 18; j +=2.5){
        for(var i = 6; i <=45; i += 2.5)
        {
            if(j == 13 && (i == 21 || i == 28.5)){

            
            }
            else if(j == 8 && (i == 18.5 || i == 21 || i == 23.5 || i == 26 || i == 28.5 || i == 31)){

            
            }
            else if(j == 5.5 && ( i == 21 || i == 23.5 || i == 26 || i == 28.5)){

            
            }
            else if(j == 3 && ( i == 23.5 || i == 26)){

            
            }
            else{
                var wallPiece = new Physijs.BoxMesh(
                    geo,
                    meshWall,
                    0
                );
                wallPiece.position.set(0, j, i+z);
                wall.add(wallPiece);
            }
        }
    }

    return wall;
}

function hoekenUitWall(){
    wall = new Physijs.BoxMesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0xFFFFFF}));
    wall.position.set(-50, 0, -10);
    var z = 10;
    for(var j = 0.5; j <= 18; j +=2.5){
        for(var i = 6; i <=45; i += 2.5)
        {
            if((j == 15.5 || j == 13) && (i == 8.5 || i == 11 || i == 13.5 || i == 16))
            {}
            else if((j == 3 || j == 5.5) && (i == 33.5 || i == 36 || i == 38.5 || i == 41))
            {}
            else if ((j == 15.5|| j == 3) && (i == 41 || i == 38.5  || i == 36  || i == 33.5 || i == 31 || i == 28.5 || i == 26 || i == 23.5 || i == 21 || i == 18.5 || i == 16 || i == 13.5 || i == 11 || i == 8.5))
            {}
            else if ((j == 15.5 || j == 10.5 || j == 13 || j == 10.5 || j == 8 || j == 5.5) && (i == 41 || i == 8.5))
            {}
            else if (j == 10.5 && (i == 36 || i == 31 || i == 26 || i == 23.5))
            {}
            else if (j == 8 && (i == 13.5 || i == 18.5 || i == 23.5 || i == 26))
            {}
            else{
                var wallPiece = new Physijs.BoxMesh(
                    geo,
                    meshWall3,
                    0
                );
                wallPiece.position.set(0, j, i+z);
                wall.add(wallPiece);
            }
        }
    }
    
    for(var j = 0.5; j <= 18; j +=2.5){
        for(var i = 6; i <=45; i += 2.5)
        {
            if((j == 18 || j == 15.5 || j == 10.5 || j == 8 || j == 3 || j == 0.5) && (i == 6 || i == 8.5 || i == 11 || i == 13.5 || i == 16 || i == 18.5 ||i == 21 || i == 23.5 || i == 26 || i == 28.5 || i == 31 || i == 33.5 || i == 36 || i == 38.5 || i == 41 || i == 43.5) )
            {}
            else if (j == 13 && (i == 6 || i == 8.5 || i == 11 || i == 13.5 || i == 18.5 ||i == 21 || i == 23.5 || i == 26 || i == 28.5 || i == 31 || i == 33.5 || i == 36 || i == 38.5 || i == 41 || i == 43.5))
            {}
            else if (j == 5.5 && (i == 6 || i == 8.5 || i == 11 || i == 13.5 || i == 16 || i == 18.5 ||i == 21 || i == 23.5 || i == 26 || i == 28.5 || i == 31 || i == 36 || i == 38.5 || i == 41 || i == 43.5)){}
            else{
                var wallPiece = new Physijs.BoxMesh(
                    geo,
                    meshWall2,
                    0
                );
                wallPiece.position.set(15, j, i+z);
                wall.add(wallPiece);
            }
        }
    }
    

    return wall;
}

function lolWall(){

    var wall = new Physijs.BoxMesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0xFFFFFF}), 0);
    wall.position.set(-50, 0, -10);
    var z = 10;
    for(var j = 0.5; j <= 18; j +=2.5){
        for(var i = 6; i <=45; i += 2.5)
        {
            if( (j == 18 || j == 0.5&& (i == 6 || i == 8.5 || i == 11 || i == 13.5 || i == 16 || i == 18.5 ||i == 21 || i == 23.5 || i == 26 || i == 28.5 || i == 31 || i == 33.5 || i == 36 || i == 38.5 || i == 41 || i == 43.5))){
            
            }
            else if((j == 15.5 || j == 13 || j == 10.5 || j == 8 || j == 5.5 || j == 3 || j == 0.5) && (i == 6  || i == 18.5 || i == 31 || i == 43.5))
            {}
            else if ((j == 15.5 || j == 13 || j == 10.5 || j == 8) && (i == 38.5 || i == 36 || i == 33.5 || i == 11 || i == 8.5 || i == 13.5))
            {}
            else if ((j == 10.5 || j == 8 || j == 5.5) && (i == 26 || i == 23.5))
            {}
            else{
                var wallPiece = new Physijs.BoxMesh(
                    geo,
                    meshWall2,
                    0
                );
                wallPiece.position.set(50, j, i+z);
                wall.add(wallPiece);
            }
        }
    }
    for(var j = 0.5; j <= 18; j +=2.5){
        for(var i = 6; i <=45; i += 2.5)
        {
            if((j == 15.5 || j == 13 || j == 10.5 || j == 8 || j == 5.5 || j == 3) && (i == 41 || i == 28.5  || i ==  21 || i == 16)){
            
            }
            else if(j == 3 && (i == 41 || i == 38.5 || i == 36 || i == 33.5 || i == 28.5 || i == 26 || i == 23.5 || i == 21 || i == 16 || i == 13.5 || i == 11 || i == 8.5)){

            }
            else if(j == 5.5 &&(i == 38.5 || i == 36 || i == 33.5 || i == 8.5 || i == 11 || i == 13.5))
            {}
            else if ((j == 15.5 || j == 13) &&(i == 23.5  || i == 26))
            {}
            else{
                var wallPiece = new Physijs.BoxMesh(
                    geo,
                    meshWall3,
                    0
                );
                wallPiece.position.set(0, j, i+z);
                wall.add(wallPiece);
            }
        }
    }
    return wall;
}

function IncreaseDifficulty(difficulty){
    //Naar mate je verder komt in het spel moeten er meerder walls spawnen.
    var wall = new Physijs.BoxMesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0xFFFFFF}));
    wall.position.set(-50 * (difficulty - 1), 0, -10);
    var z = 10;
        
    for (var i = 0; i < difficulty; i++){
        var random = 1; //Math.ceil(Math.random() * 4);
        var x = (-50 * i) * -1;

        switch(random){
            case 1:
                wall.add(BuildAWall(Math.ceil(Math.random() * 9), x, z, wall));
                break;
        }
    }
    console.log(wall);
    return wall;
}