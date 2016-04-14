function controll3r(camera, scene) {
    this.controls = new THREE.PointerLockControls(camera);
    this.controlsEnabled = true;
    this.hasPointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;


    this.init = function () {
        scene.add(this.controls.getObject());
        //console.log(this.controls)
        var element = document.body;
        this.controls.enabled = true;
        if (this.hasPointerLock) {
            var pointerlockchange = function (event) {
                if (document.pointerLockElement === element ||
                    document.mozPointerLockElement === element ||
                    document.webkitPointerLockElement === element) {
                    this.controlsEnabled = true;
                    //controls.enabled = true;
                } else {
                    this.controlsEnabled = false;
                    //controls.enabled = false;
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

        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);


    };

    this.walkingSpeed = 2000.0;
    this.jumpHeight = 450;
    var moveForward,
        moveBackward,
        moveLeft,
        moveRight,
        canJump,
        jumping;

    //var hasPointerLock = checkForPointerLock();
    var velocity = new THREE.Vector3();

    this.updatePos = function(clock) {
        if (this.controlsEnabled) {
            var delta = clock.getDelta();

            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            velocity.y -= 9.8 * 100.0 * delta;

            if (moveForward) velocity.z -= this.walkingSpeed * delta;
            if (moveBackward) velocity.z += this.walkingSpeed * delta;
            if (moveLeft) velocity.x -= this.walkingSpeed * delta;
            if (moveRight) velocity.x += this.walkingSpeed * delta;
            if (jumping) velocity.y += this.jumpHeight; jumping = false;
            this.controls.getObject().translateX(velocity.x * delta);
            this.controls.getObject().translateY(velocity.y * delta);
            this.controls.getObject().translateZ(velocity.z * delta);

            if (this.controls.getObject().position.y < 10) {
                velocity.y = 0;
                this.controls.getObject().position.y = 10;
                canJump = true;
            }
        }
    };

    function onKeyDown (e) {
        console.log("keydown");
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
            if (canJump === true) jumping = true;
            canJump = false;
            break;
        }
    };

    function onKeyUp (e) {
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
    };


}
