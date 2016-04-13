var scene, camera, renderer;

var moveForward,
    moveBackward,
    moveLeft,
    moveRight,
    canJump;

var hasPointerLock = checkForPointerLock();
var velocity = new THREE.Vector3();
var clock = new THREE.Clock();
var controlsEnabled;
function checkForPointerLock() {
    return 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
}

init();
animate();

function generateSurface(u, v) {
    var x,y,z;
    x = 1000 * (u - 0.5);
    z = 1000 * (v - 0.5);
    y = 0;
    return new THREE.Vector3(x, y, z);
}

function init() {

    initPointerLock();
    initControls();

    scene = new THREE.Scene();
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer = new THREE.WebGLRenderer({
        antialias:true
    });

    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 20000);
    camera.position.set(1,1,50);

    controls = new THREE.PointerLockControls(camera);
		scene.add(controls.getObject());

    window.addEventListener('resize', function() {
        var width = window.innerWidth,
            height = window.innerHeight;

        renderer.setSize(width, height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    renderer.setClearColor(0x333F47, 1);

    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100,200,100);
    scene.add(light);

    var material = new THREE.MeshPhongMaterial({
        color: "purple",
        specular: 0x020202,
        side: THREE.DoubleSide
    });


    //var geometry = new THREE.PlaneGeometry( 1, 1, 1 );
    var geometry = new THREE.ParametricGeometry(generateSurface, 64, 64);
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    updateControls();
}

function initPointerLock() {
    var element = document.body;

    if (hasPointerLock) {
        var pointerlockchange = function (event) {
            if (document.pointerLockElement === element ||
                document.mozPointerLockElement === element ||
                document.webkitPointerLockElement === element) {
                controlsEnabled = true;
                controls.enabled = true;
            } else {
                controlsEnabled = false;
                controls.enabled = false;
            }
        };

        var pointerlockerror = function (event) {
            element.innerHTML = 'PointerLock Error';
        };

        document.addEventListener('pointerlockchange', pointerlockchange, false);
        document.addEventListener('mozpointerlockchange', pointerlockchange, false);
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

        document.addEventListener('pointerlockerror', pointerlockerror, false);
        document.addEventListener('mozpointerlockerror', pointerlockerror, false);
        document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

        var requestPointerLock = function(event) {
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            element.requestPointerLock();
        };
        element.addEventListener('click', requestPointerLock, false);
    } else {
        element.innerHTML = 'Bad browser; No pointer lock';
    }
}

function initControls() {
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
}

function updateControls() {
    if (controlsEnabled) {
        var delta = clock.getDelta();
        var walkingSpeed = 2000.0;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta;

        if (moveForward) velocity.z -= walkingSpeed * delta;
        if (moveBackward) velocity.z += walkingSpeed * delta;
        if (moveLeft) velocity.x -= walkingSpeed * delta;
        if (moveRight) velocity.x += walkingSpeed * delta;

        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);

        if (controls.getObject().position.y < 10) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
    }
}

function onKeyDown(e) {
    switch (e.keyCode) {
    case 38: // up
    case 87: // w
        moveForward = true;
        break;
    case 37: // left
    case 65: // a
        moveLeft = true;
        break;
    case 40: // down
    case 83: // s
        moveBackward = true;
        break;
    case 39: // right
    case 68: // d
        moveRight = true;
        break;
    case 32: // space
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
}

function onKeyUp(e) {
    switch(e.keyCode) {
    case 38: // up
    case 87: // w
        moveForward = false;
        break;
    case 37: // left
    case 65: // a
        moveLeft = false;
        break;
    case 40: // down
    case 83: // s
        moveBackward = false;
        break;
    case 39: // right
    case 68: // d
        moveRight = false;
        break;
    }
}
