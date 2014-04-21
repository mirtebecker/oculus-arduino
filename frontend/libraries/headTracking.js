//via Ben Purdy from oculus-brdige https://github.com/Instrument/oculus-bridge/blob/master/docs/first_person_movement.md

function bridgeOrientationUpdated(quatValues) {

    var bodyAxis = new THREE.Vector3(0, 1, 0);

    // make a quaternion for the the body angle rotated about the Y axis
    var bodyQuat = new THREE.Quaternion();
    bodyQuat.setFromAxisAngle(bodyAxis, Config.bodyAngle);

    // make a quaternion for the current orientation of the Rift
    var riftQuat = new THREE.Quaternion(quatValues.x, quatValues.y, quatValues.z, quatValues.w);

    // multiply the body rotation by the Rift rotation.
    bodyQuat.multiply(riftQuat);


    // Make a vector pointing along the Z axis and rotate it 
    // according to the combined look+body angle.
    var xzVector = new THREE.Vector3(0, 0, 1);
    xzVector.applyQuaternion(bodyQuat);

    // Compute the X/Z angle based on the combined look/body angle.
    viewAngle = Math.atan2(xzVector.z, xzVector.x) + Math.PI;

    // Update the camera so it matches the current view orientation
    Config.camera.quaternion.copy(bodyQuat);
}

