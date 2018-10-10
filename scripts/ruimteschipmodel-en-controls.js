alert("");
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
var schipKeuze = 3;
var draaisnelheid = 0; //de snelheid van de rotatie

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
                            draaisnelheid = 0.2;
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
                            draaisnelheid = 0.075;
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
                            draaisnelheid = 0.5;
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

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

// White directional light at 70% intensity shining from the top.
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
scene.add( directionalLight );

// movement
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    
    if (keyCode == 90) {  //z key voor rotatie over rechts
        spaceship.rotation.z += draaisnelheid;
		
    } else if (keyCode == 88) { // x key voor rotatie over links
        spaceship.rotation.z -= draaisnelheid;
        
    } else if (keyCode == 37) { // left key voor bewegen naar links
        spaceship.position.x += 1;
        
    } else if (keyCode == 39) { // right key voor bewegen naar rechts
        spaceship.position.x -= 1;
        
    } else if (keyCode == 38) { // up key voor naar boven
        spaceship.position.y += 1;
		
	} else if (keyCode == 40) { //down key voor naar beneden
        spaceship.position.y -= 1;
	}
    render();
};

var render = function() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};

render()