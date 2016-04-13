function controll3r(camera, scene) {
    this.controls = new THREE.PointerLockControls(camera);
    this.controlsEnabled;
    this.init = function (document) {
        scene.add(this.controls.getObject());
        console.log(this.controls)
        var element = document.body;
        if (hasPointerLock) {
            console.log(this.controls.enabled);
            var pointerlockchange = function (event) {
                if (document.pointerLockElement === element ||
                    document.mozPointerLockElement === element ||
                    document.webkitPointerLockElement === element) {
                    this.controlsEnabled = true;
                    this.controls.enabled = true;
                } else {
                    this.controlsEnabled = false;
                    this.controls.enabled = false;
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
    };

    this.moveForward;
    this.moveBackward;
    this.moveLeft;
    this.moveRight;
    this.canJump;
    //var hasPointerLock = checkForPointerLock();
    this.velocity = new THREE.Vector3()

    this.update = function(clock) {
        if (this.controlsEnabled) {
            var delta = clock.getDelta();
            var walkingSpeed = 2000.0;

            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            velocity.y -= 9.8 * 100.0 * delta;

            if (moveForward) velocity.z -= walkingSpeed * delta;
            if (moveBackward) velocity.z += walkingSpeed * delta;
            if (moveLeft) velocity.x -= walkingSpeed * delta;
            if (moveRight) velocity.x += walkingSpeed * delta;

            this.controls.getObject().translateX(velocity.x * delta);
            this.controls.getObject().translateY(velocity.y * delta);
            this.controls.getObject().translateZ(velocity.z * delta);

            if (this.controls.getObject().position.y < 10) {
                velocity.y = 0;
                this.controls.getObject().position.y = 10;
                canJump = true;
            }
        }
    }
}
