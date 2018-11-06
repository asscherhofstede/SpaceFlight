//#region Variabelen
var meshWall = Physijs.createMaterial(new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/Obstacle/test.png")}), 0, 0);

var meshWall2 = Physijs.createMaterial(new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/Obstacle/test2.png")}), 0, 0);

var meshWall3 = Physijs.createMaterial(new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/Obstacle/test3.png")}), 0, 0);

var geo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
//#endregion

//#region Obstakels
function WallOne(x, z, wall) {
    for (var j = 0.5; j <= 18; j += 2.5) {
        for (var i = 6; i <= 45; i += 2.5) {
            if (j == 13 && (i == 21 || i == 28.5)) {


            } else if (j == 8 && (i == 18.5 || i == 21 || i == 23.5 || i == 26 || i == 28.5 || i == 31)) {


            } else if (j == 5.5 && (i == 21 || i == 23.5 || i == 26 || i == 28.5)) {


            } else if (j == 3 && (i == 23.5 || i == 26)) {


            } else {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            }
        }
    }
}

function WallTwo(x, z, wall) {
    for (var j = 0.5; j <= 18; j += 2.5) {
        for (var i = 6; i <= 45; i += 2.5) {
            if ((j == 15.5 || j == 13) && (i == 8.5 || i == 11 || i == 13.5 || i == 16)) {} else if ((j == 3 || j == 5.5) && (i == 33.5 || i == 36 || i == 38.5 || i == 41)) {} else if ((j == 15.5 || j == 3) && (i == 41 || i == 38.5 || i == 36 || i == 33.5 || i == 31 || i == 28.5 || i == 26 || i == 23.5 || i == 21 || i == 18.5 || i == 16 || i == 13.5 || i == 11 || i == 8.5)) {} else if ((j == 15.5 || j == 10.5 || j == 13 || j == 10.5 || j == 8 || j == 5.5) && (i == 41 || i == 8.5)) {} else if (j == 10.5 && (i == 36 || i == 31 || i == 26 || i == 23.5)) {} else if (j == 8 && (i == 13.5 || i == 18.5 || i == 23.5 || i == 26)) {} else {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall3, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            }
        }
    }

    for (var j = 0.5; j <= 18; j += 2.5) {
        for (var i = 6; i <= 45; i += 2.5) {
            if ((j == 18 || j == 15.5 || j == 10.5 || j == 8 || j == 3 || j == 0.5) && (i == 6 || i == 8.5 || i == 11 || i == 13.5 || i == 16 || i == 18.5 || i == 21 || i == 23.5 || i == 26 || i == 28.5 || i == 31 || i == 33.5 || i == 36 || i == 38.5 || i == 41 || i == 43.5)) {} else if (j == 13 && (i == 6 || i == 8.5 || i == 11 || i == 13.5 || i == 18.5 || i == 21 || i == 23.5 || i == 26 || i == 28.5 || i == 31 || i == 33.5 || i == 36 || i == 38.5 || i == 41 || i == 43.5)) {} else if (j == 5.5 && (i == 6 || i == 8.5 || i == 11 || i == 13.5 || i == 16 || i == 18.5 || i == 21 || i == 23.5 || i == 26 || i == 28.5 || i == 31 || i == 36 || i == 38.5 || i == 41 || i == 43.5)) {} else {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall2, 0);
                wallPiece.position.set(x + 15, j, i + z);
                wall.add(wallPiece);
            }
        }
    }
}

function WallThree(x, z, wall) {
    for (var j = 0.5; j <= 18; j += 2.5) {
        for (var i = 6; i <= 45; i += 2.5) {
            if ((j == 18 || j == 0.5 && (i == 6 || i == 8.5 || i == 11 || i == 13.5 || i == 16 || i == 18.5 || i == 21 || i == 23.5 || i == 26 || i == 28.5 || i == 31 || i == 33.5 || i == 36 || i == 38.5 || i == 41 || i == 43.5))) {

            } else if ((j == 15.5 || j == 13 || j == 10.5 || j == 8 || j == 5.5 || j == 3 || j == 0.5) && (i == 6 || i == 18.5 || i == 31 || i == 43.5)) {} else if ((j == 15.5 || j == 13 || j == 10.5 || j == 8) && (i == 38.5 || i == 36 || i == 33.5 || i == 11 || i == 8.5 || i == 13.5)) {} else if ((j == 10.5 || j == 8 || j == 5.5) && (i == 26 || i == 23.5)) {} else {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall2, 0);
                wallPiece.position.set(x + 25, j, i + z);
                wall.add(wallPiece);
            }
        }
    }
    for (var j = 0.5; j <= 18; j += 2.5) {
        for (var i = 6; i <= 45; i += 2.5) {
            if ((j == 15.5 || j == 13 || j == 10.5 || j == 8 || j == 5.5 || j == 3) && (i == 41 || i == 28.5 || i == 21 || i == 16)) {

            } else if (j == 3 && (i == 41 || i == 38.5 || i == 36 || i == 33.5 || i == 28.5 || i == 26 || i == 23.5 || i == 21 || i == 16 || i == 13.5 || i == 11 || i == 8.5)) {

            } else if (j == 5.5 && (i == 38.5 || i == 36 || i == 33.5 || i == 8.5 || i == 11 || i == 13.5)) {} else if ((j == 15.5 || j == 13) && (i == 23.5 || i == 26)) {} else {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall3, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            }
        }
    }
}

function WallFour(x, z, wall) {
    for (var j = 0.5; j <= 18; j += 2.5) {
        for (var i = 6; i <= 45; i += 2.5) {
            if (j == 3 && (i == 41 || i == 38.5 || i == 33.5 || i == 28.5 || i == 23.5 || i == 18.5 || i == 13.5 || i == 8.5)) {

            } else if (j == 5.5 && (i == 33.5 || i == 28.5 || i == 23.5 || i == 18.5 || i == 13.5 || i == 8.5)) {

            } else if (j == 8 && (i == 38.5 || i == 33.5 || i == 28.5 || i == 23.5 || i == 18.5 || i == 13.5 || i == 8.5)) {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall3, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else if (j == 15.5 && (i == 41 || i == 36 || i == 31 || i == 26 || i == 21 || i == 16 || i == 11 || i == 8.5)) {

            } else if (j == 13 && (i == 41 || i == 36 || i == 31 || i == 26 || i == 21 || i == 16)) {

            } else if (j == 10.5 && (i == 41 || i == 36 || i == 31 || i == 26 || i == 21 || i == 16 || i == 11)) {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall3, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall2, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            }
        }
    }
}

function WallFive(x, z, wall) {
    for (var j = 0.5; j <= 18; j += 2.5) {
        for (var i = 6; i <= 45; i += 2.5) {
            if ((j == 15.5 || j == 10.5 || j == 5.5) && (i == 6 || i == 8.5 || i == 11 || i == 13.5 || i == 16 || i == 18.5 || i == 21 || i == 23.5 || i == 26 || i == 28.5 || i == 31 || i == 33.5 || i == 36 || i == 38.5 || i == 41 || i == 43.5)) {} else {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall2, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            }
        }
    }
    for (var j = 0.5; j <= 18; j += 2.5) {
        for (var i = 6; i <= 45; i += 2.5) {
            if ((j == 18 || j == 13 || j == 8 || j == 3 || j == 0.5) && (i == 6 || i == 8.5 || i == 11 || i == 13.5 || i == 16 || i == 18.5 || i == 21 || i == 23.5 || i == 26 || i == 28.5 || i == 31 || i == 33.5 || i == 36 || i == 38.5 || i == 41 || i == 43.5)) {} else {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall, 0);
                wallPiece.position.set(x + 25, j, i + z);
                wall.add(wallPiece);
            }
        }
    }
}

function WallSix(x, z, wall) {
    for (var j = 0.5; j <= 18; j += 2.5) {
        for (var i = 6; i <= 45; i += 2.5) {
            if ((j == 18 || j == 15.5 || j == 13 || j == 10.5) && (i == 41 || i == 43.5 || i == 38.5 || i == 36 || i == 23.5 || i == 21 || i == 18.5 || i == 16)) {} else {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall3, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            }
        }
        for (var i = 6; i <= 45; i += 2.5) {
            if ((j == 18 || j == 15.5 || j == 13 || j == 10.5) && (i == 33.5 || i == 31 || i == 28.5 || i == 26 || i == 13.5 || i == 11 || i == 8.5 || i == 6)) {} else {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall, 0);
                wallPiece.position.set(x + 15, j, i + z);
                wall.add(wallPiece);
            }
        }
    }
}

function WallSeven(x, z, wall) {
    for (var j = 0.5; j <= 18; j += 2.5) {
        for (var i = 6; i <= 45; i += 2.5) {
            if ((j == 0.5 || j == 3 || j == 5.5 || j == 8) && (i == 41 || i == 43.5 || i == 38.5 || i == 36 || i == 23.5 || i == 21 || i == 18.5 || i == 16)) {} else {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall2, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            }
        }
        for (var i = 6; i <= 45; i += 2.5) {
            if ((j == 18 || j == 15.5 || j == 13 || j == 10.5) && (i == 33.5 || i == 31 || i == 28.5 || i == 26 || i == 13.5 || i == 11 || i == 8.5 || i == 6)) {} else {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall, 0);
                wallPiece.position.set(x + 25, j, i + z);
                wall.add(wallPiece);
            }
        }
    }
}

function WallEight(x, z, wall) {
    for (var j = 0.5; j <= 18; j += 2.5) {
        for (var i = 6; i <= 45; i += 2.5) {
            if ((j == 0.5 || j == 3 || j == 5.5 || j == 8) && (i == 41 || i == 43.5 || i == 38.5 || i == 36 || i == 23.5 || i == 21 || i == 18.5 || i == 16)) {} else {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall2, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            }
        }
        for (var i = 6; i <= 45; i += 2.5) {
            if ((j == 18 || j == 15.5 || j == 13 || j == 10.5) && (i == 41 || i == 43.5 || i == 38.5 || i == 36 || i == 23.5 || i == 21 || i == 18.5 || i == 16)) {} else {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall3, 0);
                wallPiece.position.set(x + 25, j, i + z);
                wall.add(wallPiece);
            }
        }
    }
}

function WallNine(x, z, wall) {
    for (var j = 0.5; j <= 18; j += 2.5) {
        for (var i = 6; i <= 45; i += 2.5) {
            if ((j == 18 || j == 10.5) && (i == 43.5 || i == 41 || i == 38.5 || i == 36 || i == 23.5 || i == 21 || i == 18.5 || i == 16)) // blok 1 en 3
            {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall2, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else if ((j == 15.5 || j == 13) && (i == 43.5 || i == 36 || i == 16 || i == 23.5)) {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall2, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else if ((j == 18 || j == 10.5) && (i == 26 || i == 28.5 || i == 31 || i == 33.5 || i == 6 || i == 8.5 || i == 11 || i == 13.5)) // blok 2 en 4
            {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else if ((j == 15.5 || j == 13) && (i == 26 || i == 33.5 || i == 13.5 || i == 6)) {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else if ((j == 0.5 || j == 8) && (i == 43.5 || i == 41 || i == 38.5 || i == 36 || i == 23.5 || i == 21 || i == 18.5 || i == 16)) // blok 5 en 7
            {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else if ((j == 3 || j == 5.5) && (i == 43.5 || i == 36 || i == 16 || i == 23.5)) {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else if ((j == 0.5 || j == 8) && (i == 26 || i == 28.5 || i == 31 || i == 33.5 || i == 6 || i == 8.5 || i == 11 || i == 13.5)) // blok 6 en 8
            {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall2, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else if ((j == 3 || j == 5.5) && (i == 26 || i == 33.5 || i == 13.5 || i == 6)) {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall2, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else {

            }
        }
    }
}

function WallTen(x, z, wall) {
    for (var j = 0.5; j <= 18; j += 2.5) {
        for (var i = 6; i <= 45; i += 2.5) {
            if ((j == 18) && (i == 41 || i == 33.5 || i == 26 || i == 18.5 || i == 11)) {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall3, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else if ((j == 15.5) && (i == 43.5 || i == 36 || i == 28.5 || i == 21 || i == 13.5 || i == 6)) {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall2, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else if ((j == 13) && (i == 38.5 || i == 31 || i == 23.5 || i == 16 || i == 8.5)) {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else if ((j == 10.5) && (i == 41 || i == 33.5 || i == 26 || i == 18.5 || i == 11)) {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall3, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else if ((j == 8) && (i == 43.5 || i == 36 || i == 28.5 || i == 21 || i == 13.5 || i == 6)) {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall2, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else if ((j == 5.5) && (i == 38.5 || i == 31 || i == 23.5 || i == 16 || i == 8.5)) {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else if ((j == 3) && (i == 41 || i == 33.5 || i == 26 || i == 18.5 || i == 11)) {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall3, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else if ((j == 0.5) && (i == 43.5 || i == 36 || i == 28.5 || i == 21 || i == 13.5 || i == 6)) {
                var wallPiece = new Physijs.BoxMesh(geo, meshWall2, 0);
                wallPiece.position.set(x, j, i + z);
                wall.add(wallPiece);
            } else {

            }
        }
    }
}
//#endregion

//Naar mate je verder komt in het spel moeten er meerder walls spawnen.
function IncreaseDifficulty(difficulty) {
    var wall = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xFFFFFF}), 0);
    wall.position.set((-75 * (difficulty - 1)) -25, 0, -20);
    
    var z = 20;

    for (var i = 0; i < difficulty; i++) {
        var random = Math.ceil(Math.random() * 10);
        var x = (-75 * i) * -1;

        switch (random) {
            case 2:
                WallOne(x, z, wall);
                break;
            case 3:
                WallTwo(x, z, wall);
                break;
            case 4:
                WallThree(x, z, wall);
                break;
            case 5:
                WallFour(x, z, wall);
                break;
            case 6:
                WallFive(x, z, wall);
                break;
            case 7:
                WallSix(x, z, wall);
                break;
            case 8:
                WallSeven(x, z, wall);
                break;
            case 9:
                WallEight(x, z, wall);
                break;
            case 10:
                WallNine(x, z, wall);
                break;
            case 1:
                WallTen(x, z, wall);
                break;
        }
    }
    return wall;
}