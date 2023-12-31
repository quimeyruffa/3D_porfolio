import * as THREE from "three";
import GSAP from "gsap";

import Experience from "../Experience";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default class Room {
  constructor() {
    this.experience = new Experience();

    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.resources = this.experience.resources;
    this.room = this.resources.items.room;
    this.actualRoom = this.room.scene;

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    };

    this.setModel();
    this.setAnimation();
    this.onMouseMove();
  }

  setModel() {
    this.actualRoom.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child instanceof THREE.Group) {
        child.children.forEach((groupchild) => {
          groupchild.castShadow = true;
          groupchild.receiveShadow = true;
        });
      }

      if (child.name === "water") {
        child.material = new THREE.MeshPhysicalMaterial();
        child.material.roughness = 0;
        child.material.color.set(0xcaedff);
        child.material.ior = 3;
        child.material.transmission = 1;
        child.material.opacity = 1;
      }

      if (child.name === "VideoPlayer") {
        child.material = new THREE.MeshBasicMaterial({
          map: this.resources.items.screen,
        });
      }
    });
    const width = 0.5;
    const height = 0.7;
    const intensity = 1;
    const rectLight = new THREE.RectAreaLight(
      0xffffff,
      intensity,
      width,
      height
    );
    rectLight.position.set(110.636, 87.4618 , 0.5);
   

    this.actualRoom.add(rectLight);
    this.scene.add(this.actualRoom);
    this.actualRoom.scale.set(0.015, 0.015, 0.015);
  }

  setAnimation() {
    this.mixer = new THREE.AnimationMixer(this.actualRoom);
    this.swim = this.mixer.clipAction(this.room.animations[0]);
    this.swim.play();
  }

  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      this.rotation =
        ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
      this.lerp.target = this.rotation * 0.05;
    });
  }
  resize() {}

  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );
    this.actualRoom.rotation.y = this.lerp.current;

    this.mixer.update(this.time.delta * 0.0009);
  }
}
