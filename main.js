/** background of the scene @type{string} */
const backgroundUrl =
  "https://i.ytimg.com/vi/1chpHQ6sdno/maxresdefault.jpg";
/** check game is played @type{boolean} */
let isPlayed = false;
/** Current cube is moving @type{THREE.Mesh} */
let currentCube;
/** List of stopped cube @type{Array<THREE.Mesh>} */
const stoppedCube = [];
/** Speed of Cube @type{number} */
const movementSpeed = 0.03;
/** Size of each cube in x @type{number} */
let cubeX = 2
/** Size of each cube in y @type{number} */
const cubeY = 0.5
/** Size of each cube in z @type{number} */
const cubeZ = 0.8
/** The init X of each cube @type{number} */
let initX = -2 
/** The direction of moving cube @type{THREE.Vector3} */
const direction = new THREE.Vector3(0.6, 0, 0);
/** The scene @type{THREE.Scene} */
const scene = new THREE.Scene();
/** The renderer @type{THREE.WebGLRenderer} */
const renderer = new THREE.WebGLRenderer();
/** The camera @type{THREE.PerspectiveCamera} */
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
/** Google color palette @type{Array<number>} */
const palette  = [0x4285F4,0x34A853,0xFBBC05,0xEA4335]

/**
 * Initialise game.
 * Simply setup :
 *  - scene
 *  - camera
 *  - renderer
 */
function init() {
  // Create a scene
  scene.background = new THREE.Color(0xdddddd);

  //Set background
  const loader = new THREE.TextureLoader();
  loader.load(backgroundUrl, function (texture) {
    scene.background = texture;
  });

  // Create a camera
  camera.position.z = 5;

  // Create a renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

/**
 * Create cube use BoxGeometry
 * 
 * @returns {THREE.BoxGeometry}
 */
function createCube() {
    // Create cube
    const geometry = new THREE.BoxGeometry(cubeX, cubeY, cubeZ);
    const material = new THREE.MeshBasicMaterial({
      // color: 0x00ff00,
      color: palette[stoppedCube.length%4],
      // transparent: true,
      // opacity: 0.2,
    });
    const newCube = new THREE.Mesh(geometry, material);
    scene.add(newCube);

    // Set up position
    newCube.position.x = initX;
    newCube.rotation.set(0, 0, 0);
    // Change next cube in other side
    initX*=-1

    // Add line edge
    // const wireframeGeometry = new THREE.WireframeGeometry(geometry);
    // const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    // const wireframe = new THREE.LineSegments(
    //   wireframeGeometry,
    //   wireframeMaterial
    // );
    const edgesGeometry = new THREE.EdgesGeometry( geometry );
		const wireframe = new THREE.LineSegments( edgesGeometry, new THREE.LineBasicMaterial( { color: 0x000000 } ) ); 
    
    newCube.add(wireframe);
    
    // Add Ox,Oy,Oz
    // Ox (red), Oy (green), and Oz (blue)
    const axesHelper = new THREE.AxesHelper(10);
    // newCube.add(axesHelper);
    return newCube;
}

/**
 * Handle when user click
 * 
 * @returns 
 */
function handleClick() {

  if (
    stoppedCube.length > 0 &&
    Math.abs(currentCube.position.x - stoppedCube[stoppedCube.length - 1].position.x) >
      cubeX
  ) {
    isPlayed = false;
    alert("GAME OVER.Refresh to play again =))");
    return;
  }

  cubeX = stoppedCube.length > 0 ? cubeX - Math.abs(currentCube.position.x - stoppedCube[stoppedCube.length - 1].position.x) : cubeX  

  if (stoppedCube.length > 0) {
    console.log(
        currentCube.position.x - stoppedCube[stoppedCube.length - 1].position.x
    );
  }
  stoppedCube.push(currentCube);
  // console.log(stoppedCube)
  stoppedCube.map((c) => {
    c.position.y -= 0.5;
  });
  currentCube = createCube();
}

/**
 * Run the animation
 * 
 * @returns 
 */
function animate(){
  if (isPlayed) {

    requestAnimationFrame(animate);

    //Move cube
    currentCube.position.add(direction.clone().multiplyScalar(movementSpeed));

    //Check cube if reach the edge will go backward
    if (currentCube.position.x <= -2) {
      direction.x = 0.6;
    }
    if (currentCube.position.x >= 2) {
      direction.x = -0.6;
    }

    // Render the scene
    renderer.render(scene, camera);
  }
};




// Run the Game 
init()
currentCube = createCube();
document.addEventListener("click", handleClick);
isPlayed = true;
animate();