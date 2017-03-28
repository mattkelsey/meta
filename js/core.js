var scene, camera, renderer;

var clock = new THREE.Clock();

var controller;

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

    controller = new controll3r(camera, scene);
    controller.init();

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

    var lines = new THREE.LineBasicMaterial({ color: 0xAAFFAA });
    // crosshair size
    var x = 0.001, y = 0.001;

    var geometry = new THREE.Geometry();

    // crosshair
    geometry.vertices.push(new THREE.Vector3(0, y, 0));
    geometry.vertices.push(new THREE.Vector3(0, -y, 0));
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(x, 0, 0));
    geometry.vertices.push(new THREE.Vector3(-x, 0, 0));

    var crosshair = new THREE.Line( geometry, lines );

    // place it in the center
    var crosshairPercentX = 50;
    var crosshairPercentY = 50;
    var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
    var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;

    crosshair.position.x = crosshairPositionX * camera.aspect;
    crosshair.position.y = crosshairPositionY;
    crosshair.position.z = -0.3;
    camera.add( crosshair );

    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshNormalMaterial());
    plane.material.side = THREE.DoubleSide;
    plane.overdraw = true;
    plane.position.set(0,20,0);
    scene.add(plane);
    controller.collidableMeshList.push(plane);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controller.updatePos(clock);
}
