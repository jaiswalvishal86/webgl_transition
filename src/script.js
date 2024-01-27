import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import GUI from "lil-gui";
import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";
import testTexture from "./../static/Pink_tree.png";
import gsap from "gsap";
import barba from "@barba/core";

const materials = [];

barba.init({
  transitions: [
    {
      name: "default-transition",
      from: {
        namespace: ["home"],
      },
      leave(data) {
        return gsap.timeline().to(data.current.container, {
          // opacity: 0,
          onComplete: () => {},
        });
      },
      enter(data) {
        return gsap.timeline().from(data.next.container, {
          // opacity: 0,
          onComplete: () => {
            window.scrollTo(0, 0);
            // data.current.container.style.display = "none";
          },
        });
      },
    },
    {
      name: "from-inside-page-transition",
      from: {
        namespace: ["inside"],
      },
      leave(data) {
        return gsap
          .timeline()
          .to(".curtain", {
            duration: 0.3,
            y: 0,
          })
          .to(data.current.container, {
            opacity: 0,
            onComplete: () => {},
          });
      },
      enter(data) {
        setTimeout(() => {
          this.imageStore = [];
          addImages();
        }, 1000);
        return gsap
          .timeline()
          .to(".curtain", {
            duration: 0.3,
            y: "-100%",
          })
          .from(data.next.container, {
            opacity: 0,
            onComplete: () => {
              // data.next.container.style.display = "block";
            },
          });
      },
    },
  ],
});

const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
/**
 * Base
 */
function addImages() {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  // Debug
  // const gui = new GUI({ width: 340 });

  // const settings = {
  //   progress: 0,
  // };

  // gui.add(settings, "progress", 0, 1, 0.001);

  // Canvas
  const canvas = document.querySelector("canvas.webgl");

  // Scene
  const scene = new THREE.Scene();

  // Geometry

  const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);

  // Material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uTexture: { value: new THREE.TextureLoader().load(testTexture) },
      uTextureSize: { value: new THREE.Vector2(100, 100) },
      uCorners: { value: new THREE.Vector4(0, 0, 0, 0) },
      uResolution: { value: new THREE.Vector2(sizes.width, sizes.height) },
      uQuadSize: { value: new THREE.Vector2(500, 500) },
    },
    //   wireframe: true,
    side: THREE.DoubleSide,
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  const tl = gsap.timeline();

  tl.to(material.uniforms.uCorners.value, {
    x: 1,
    duration: 1,
  })
    .to(
      material.uniforms.uCorners.value,
      {
        y: 1,
        duration: 1,
      },
      "<+0.4"
    )
    .to(
      material.uniforms.uCorners.value,
      {
        z: 1,
        duration: 1,
      },
      "<+0.6"
    )
    .to(
      material.uniforms.uCorners.value,
      {
        w: 1,
        duration: 1,
      },
      "<+0.8"
    );

  // Mesh
  const mesh = new THREE.Mesh(geometry, material);
  // mesh.rotation.x = -Math.PI * 0.5;
  mesh.scale.set(500, 500, 1);
  // scene.add(mesh);
  // mesh.position.x = 100;

  let images = [...document.querySelectorAll(".work-image")];

  const imageStore = images.map((img) => {
    let bounds = img.getBoundingClientRect();
    let m = material.clone();
    materials.push(m);
    let texture = new THREE.TextureLoader().load(img.src);
    texture.needsUpdate = true;
    m.uniforms.uTexture.value = texture;

    img.addEventListener("click", () => {
      const tl = gsap.timeline();

      tl.to(m.uniforms.uCorners.value, {
        x: 1,
        duration: 0.4,
      })
        .to(
          m.uniforms.uCorners.value,
          {
            y: 1,
            duration: 0.4,
          },
          0.1
        )
        .to(
          m.uniforms.uCorners.value,
          {
            z: 1,
            duration: 0.4,
          },
          0.2
        )
        .to(
          m.uniforms.uCorners.value,
          {
            w: 1,
            duration: 0.4,
          },
          0.3
        );
    });

    // img.addEventListener("mouseout", () => {
    //   const tl = gsap.timeline();

    //   tl.to(m.uniforms.uCorners.value, {
    //     x: 0,
    //     duration: 0.4,
    //   })
    //     .to(
    //       m.uniforms.uCorners.value,
    //       {
    //         y: 0,
    //         duration: 0.4,
    //       },
    //       0.1
    //     )
    //     .to(
    //       m.uniforms.uCorners.value,
    //       {
    //         z: 0,
    //         duration: 0.4,
    //       },
    //       0.2
    //     )
    //     .to(
    //       m.uniforms.uCorners.value,
    //       {
    //         w: 0,
    //         duration: 0.4,
    //       },
    //       0.3
    //     );
    // });

    const mesh = new THREE.Mesh(geometry, m);

    mesh.scale.set(bounds.width, bounds.height, 1);
    // console.log(bounds.width, bounds.height);

    scene.add(mesh);

    return {
      img: img,
      mesh: mesh,
      width: bounds.width,
      height: bounds.height,
      top: bounds.top,
      left: bounds.left,
    };
  });

  lenis.on("scroll", (e) => {
    imageStore.forEach((obj) => {
      let bounds = obj.img.getBoundingClientRect();
      obj.mesh.scale.set(bounds.width, bounds.height, 1);
      obj.top = bounds.top + window.scrollY;
      obj.left = bounds.left;
      obj.width = bounds.width;
      obj.height = bounds.height;

      obj.mesh.position.x = obj.left - sizes.width / 2 + obj.width / 2;
      obj.mesh.position.y =
        e.animatedScroll - obj.top + sizes.height / 2 - obj.height / 2;

      obj.mesh.material.uniforms.uQuadSize.value.x = bounds.width;
      obj.mesh.material.uniforms.uQuadSize.value.y = bounds.height;

      obj.mesh.material.uniforms.uTextureSize.value.x = bounds.width;
      obj.mesh.material.uniforms.uTextureSize.value.y = bounds.height;
    });
  });

  imageStore.forEach((obj) => {
    obj.mesh.position.x = obj.left - sizes.width / 2 + obj.width / 2;
    obj.mesh.position.y = -obj.top + sizes.height / 2 - obj.height / 2;
  });

  window.addEventListener("resize", () => {
    // Update sizes
    if (
      canvas.width != canvas.clientWidth ||
      canvas.height != canvas.clientHeight
    ) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      renderer.setViewport(0, 0, canvas.width, canvas.height);
    }
    sizes.width = canvas.width;
    sizes.height = canvas.height;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    camera.fov = (2 * (Math.atan(sizes.height / 2 / 600) * 180)) / Math.PI;

    materials.forEach((m) => {
      m.uniforms.uResolution.value.x = sizes.width;
      m.uniforms.uResolution.value.y = sizes.height;
    });

    imageStore.forEach((item) => {
      let bounds = item.img.getBoundingClientRect();
      item.mesh.scale.set(bounds.width, bounds.height, 1);
      item.top = bounds.top + window.scrollY;
      item.left = bounds.left;
      item.width = bounds.width;
      item.height = bounds.height;

      item.mesh.position.x = item.left - sizes.width / 2 + item.width / 2;
      item.mesh.position.y =
        window.scrollY - item.top + sizes.height / 2 - item.height / 2;

      item.mesh.material.uniforms.uQuadSize.value.x = bounds.width;
      item.mesh.material.uniforms.uQuadSize.value.y = bounds.height;

      item.mesh.material.uniforms.uTextureSize.value.x = bounds.width;
      item.mesh.material.uniforms.uTextureSize.value.y = bounds.height;
    });

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    30,
    sizes.width / sizes.height,
    10,
    1000
  );
  camera.position.z = 600;
  camera.aspect = sizes.width / sizes.height;
  camera.fov = (2 * (Math.atan(sizes.height / 2 / 600) * 180)) / Math.PI;
  camera.updateProjectionMatrix();

  scene.add(camera);

  // Controls
  // const controls = new OrbitControls(camera, canvas);
  // controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /**
   * Animate
   */
  const clock = new THREE.Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    // controls.update();

    //send variables to shaders
    // material.uniforms.uTime.value = elapsedTime;
    // material.uniforms.uProgress.value = settings.progress;
    // tl.progress(settings.progress);

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };
  tick();
}

addImages();
