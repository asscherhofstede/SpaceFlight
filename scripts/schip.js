	var scene = new THREE.Scene();
	var spaceship = new THREE.Group();
	
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// end template here

//skybox
var skyboxgeo = new THREE.SphereGeometry(500, 32, 32);
        var skyboxmat = new THREE.MeshBasicMaterial({ color: new THREE.TextureLoader().load("textures/skybox.jpg"), side: THREE.DoubleSide });
        var skybox = new THREE.Mesh(skyboxgeo, skyboxmat);
        scene.add(skybox);

//schipvariabelen
var schipKeuze = prompt("voer een 1 in voor een generiek ruimteschip, 2 voor een spaceshuttle en 3 voor een vliegtuigje");
var draaisnelheid = 0; //de snelheid van de rotatie

//bewegingsvariabelen
var moveRight = false;
var moveLeft = false;
var moveUp = false;
var moveDown = false;
var rotateLeft = false;
var rotateRight = false;

if(schipKeuze == 1){ // het eerste ruimteschip
    
new THREE.MTLLoader() 
				.setPath( '3d/spaceship/' )
						.load( 'spaceship.mtl', function ( materials ) {
					materials.preload();

					new THREE.OBJLoader()
						.setMaterials( materials )
						.setPath( '3d/spaceship/' )
						.load( 'spaceship.obj', function ( object ) {
							object.position.z = 20;
							var a = 0.01;
							object.scale.x = a;
							object.scale.y = a;
							object.scale.z = a;
                            draaisnelheid = 0.1;
							spaceship.add( object );
						} );
				} );

}else if(schipKeuze == 2) { // een spaceshuttle als ruimteschip
    new THREE.MTLLoader()
				.setPath( '3d/spaceshuttle/' )
						.load( 'spaceshuttle.mtl', function ( materials ) {
					materials.preload();

					new THREE.OBJLoader()
						.setMaterials( materials )
						.setPath( '3d/spaceshuttle/' )
						.load( 'spaceshuttle.obj', function ( object ) {
							object.position.z = 20;
							var a = 0.5;
							object.scale.x = a;
							object.scale.y = a;
							object.scale.z = a;
                            object.position.z += 10;
                            object.rotation.x = -1.413717;
                            object.rotation.y = 0; //niet mee prutsen
                            object.rotation.z = Math.PI;
                            draaisnelheid = 0.05;
							spaceship.add( object );
						} );
				} );
}else if(schipKeuze == 3) { // een vliegtuigje als "ruimteschip"
    new THREE.MTLLoader()
				.setPath( '3d/plane/' )
						.load( 'plane.mtl', function ( materials ) {
					materials.preload();

					new THREE.OBJLoader()
						.setMaterials( materials )
						.setPath( '3d/plane/' )
						.load( 'plane.obj', function ( object ) {
							object.position.z = 20;
							var a = 6;
							object.scale.x = a;
							object.scale.y = a;
							object.scale.z = a;
                            draaisnelheid = 0.08;
                            object.position.z += 10;
                            object.rotation.y = -1.57;
							spaceship.add( object );
						} );
				} );
}else if(schipKeuze == 4) { // ananananananananas
new THREE.MTLLoader()
			.setPath( '3d/pine/' )
					.load( 'pine.mtl', function ( materials ) {
				materials.preload();

				new THREE.OBJLoader()
					.setMaterials( materials )
					.setPath( '3d/pine/' )
					.load( 'pine.obj', function ( object ) {
						object.position.z = 20;
						var a = 30;
						object.scale.x = a;
						object.scale.y = a;
						object.scale.z = a;
						draaisnelheid = 0.05;
						object.position.z += 10;
						object.rotation.y = -1.57;
						spaceship.add( object );
					} );
			} );
}

//scene.add();
camera.position.x = 0;
camera.position.y = 1.7;
camera.position.z = 9;
camera.rotation.y = 3;

scene.add(camera);
scene.add( spaceship );

//camera.position.x = 2;
//camera.position.y = 1;
//camera.position.z = 20;

var light = new THREE.AmbientLight( 0x404040 ); 
scene.add( light );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
scene.add( directionalLight );

//spelvariabelen
var pause = 1;


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
		
	}else if (keyCode == 80) { //down key voor naar beneden
        if(pause == 1){
			pause = 0;
		}else {
			pause = 1;
		}
	}
    
  
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

};

var playerScore = 1;
var a = 1;
function updateScore()
{
	a += (0.25 * pause);
	playerScore = Math.round(a);
	//tekst
	var text2 = document.createElement('div');
	text2.style.position = 'absolute';
	text2.style.width = 100;
	text2.style.height = 20;
	text2.style.backgroundColor = "turquoise";
	text2.innerHTML = playerScore;
	text2.style.top = 50 + 'px';
	text2.style.left = 200 + 'px';
	document.body.appendChild(text2);
}

var render = function() { //RENDARRRR!!11!1!2


	requestAnimationFrame(render);

	updateScore();
	if(moveRight == true)
	{
		spaceship.position.x -= 0.2 * pause;
	}
	if(moveLeft == true)
	{
		spaceship.position.x += 0.2 * pause;
	}
	if(moveUp == true)
	{
		spaceship.position.y += 0.2 * pause;
	}
	if(moveDown == true)
	{
		spaceship.position.y -= 0.2 * pause;
	}
	if(rotateRight == true)
	{
		spaceship.rotation.z += draaisnelheid * pause;
	}
	if(rotateLeft == true)
	{
		spaceship.rotation.z -= draaisnelheid * pause;
	}


	renderer.render(scene, camera);


};

render()