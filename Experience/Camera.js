import * as THREE from "three";

import Experience from "./Experience";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.createPerspectiveCamera();
    this.createOrthographicCamera();
    this.setOrbitControls();
  }

  createPerspectiveCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      35,
      this.sizes.aspect,
      0.1,
      1000
    );

    this.scene.add(this.perspectiveCamera);
    this.perspectiveCamera.position.z = 12;
    this.perspectiveCamera.position.x = 29;
    this.perspectiveCamera.position.y = 14;
  }

  createOrthographicCamera() {
    this.frustrum = 5;

    this.orthographicCamera = new THREE.OrthographicCamera(
      (-this.sizes.aspect * this.sizes.frustrum) / 2,
      (this.sizes.aspect * this.sizes.frustrum) / 2,
      this.sizes.frustrum / 2,
      -this.sizes.frustrum / 2,
      -50,
      50
    );
    

    this.orthographicCamera.position.y = 3.5;
    this.orthographicCamera.position.z = 3;
    this.orthographicCamera.rotation.x = -Math.PI / 6;

    this.scene.add(this.orthographicCamera);

  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.enableZoom = false;
    this.controls.enableRotate = true;
  }

  resize() {
    // updating perspective camera on pezise
    this.perspectiveCamera.aspect = this.sizes.aspect;
    this.perspectiveCamera.updateProjectionMatrix();

    // updating orthographic camera on rezise
    this.orthographicCamera.left =
      (-this.sizes.aspect * this.sizes.frustrum) / 2;

    this.orthographicCamera.right =
      (this.sizes.aspect * this.sizes.frustrum) / 2;

    this.orthographicCamera.top = this.sizes.frustrum / 2;

    this.orthographicCamera.bottom = -this.sizes.frustrum / 2;

    this.orthographicCamera.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
