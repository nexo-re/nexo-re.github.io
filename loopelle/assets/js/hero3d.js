/* 3D hero: loads a .glb, makes a front-view snapshot for the crochet animation,
   then becomes the live 3D model (idle sway, 360-degree turn while it glides to the corner). */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export async function createHero3D(url, opt) {
  opt = opt || {};
  var MAXW = opt.maxW || 640, MAXH = opt.maxH || 800;

  var gltf = await new GLTFLoader().loadAsync(url);
  var model = gltf.scene;

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  var pm = new THREE.PMREMGenerator(renderer);
  var scene = new THREE.Scene();
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  model.traverse(function (o) {
    if (o.isMesh && o.material) { var ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(function (m) { m.envMapIntensity = 0.75; }); }
  });

  /* centre the model on its bounding box and measure it */
  var box = new THREE.Box3().setFromObject(model), ctr = box.getCenter(new THREE.Vector3());
  model.position.sub(ctr);
  var pivot = new THREE.Group(); pivot.add(model); scene.add(pivot);
  pivot.updateMatrixWorld(true);
  var R = 0, halfW = 0, v = new THREE.Vector3();
  model.traverse(function (o) {
    if (!o.isMesh) return;
    var p = o.geometry.attributes.position;
    for (var i = 0; i < p.count; i += 2) { v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld); R = Math.max(R, Math.hypot(v.x, v.z)); halfW = Math.max(halfW, Math.abs(v.x)); }
  });
  var size = box.getSize(new THREE.Vector3());
  var hw = Math.max(R, halfW) * 1.07, hh = size.y / 2 * 1.06;   /* spare room so the spin never clips */
  var A = hw / hh;                                              /* picture aspect = width / height */

  var FOV = 14, cam = new THREE.PerspectiveCamera(FOV, A, 0.01, 10);
  cam.position.set(0, 0, hh / Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
  cam.lookAt(0, 0, 0);
  var key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(-0.6, 1.0, 1.4); scene.add(key);
  var fill = new THREE.DirectionalLight(0xfff0f0, 0.45); fill.position.set(0.9, 0.2, 0.8); scene.add(fill);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xcfc4c4, 0.5));

  /* where the head / arms sit in the front view (the hanging crochets use this) */
  function proj(name, f) {
    var o = model.getObjectByName(name); if (!o) return null;
    var b = new THREE.Box3().setFromObject(o);
    return f(b);
  }
  var xL = -hw, W = 2 * hw, yT = hh, H = 2 * hh;
  var head = proj('Head', function (b) { return { l: (b.min.x - xL) / W, r: (b.max.x - xL) / W }; }) || { l: .25, r: .75 };
  var arm = proj('Arm_R', function (b) { return (yT - b.max.y) / H; });
  var zone = { left: head.l, right: head.r, sideBottom: arm != null ? Math.max(.2, arm - .03) : .44 };

  /* front-view snapshot (transparent PNG) that the crochet hook stitches */
  var sH = MAXH, sW = Math.round(sH * A); if (sW > MAXW) { sW = MAXW; sH = Math.round(sW / A); }
  renderer.setPixelRatio(1); renderer.setSize(sW, sH, false);
  pivot.rotation.y = 0; renderer.render(scene, cam);
  var src = renderer.domElement.toDataURL('image/png');

  /* live canvas */
  var el = document.createElement('div'); el.className = 'm3d';
  var cv = renderer.domElement; el.appendChild(cv);
  var spin = 0, vis = false, w = 0, h = 0, reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var api = {
    el: el, aspect: A,
    size: function (cw, ch, dpr) {
      cw = Math.round(cw); ch = Math.round(ch); if (cw < 2 || ch < 2) return;
      var pr = Math.min(2, dpr || 1); if (cw === w && ch === h && pr === renderer.getPixelRatio()) return;
      w = cw; h = ch; renderer.setPixelRatio(pr); renderer.setSize(cw, ch, false);
      cam.aspect = cw / ch; cam.updateProjectionMatrix();
    },
    vis: function (on) { if (on !== vis) { vis = on; el.style.opacity = on ? 1 : 0; } },
    spin: function (a) { spin = a; },
    /* e = glide progress 0..1: sway fades from big (hero) to small (helper) */
    frame: function (ts, e) {
      if (!vis || !w) return;
      var t = ts / 1000, amp = reduce ? 0 : .3 - .13 * (e || 0);
      pivot.rotation.y = spin + Math.sin(t * .9) * amp;
      pivot.rotation.x = reduce ? 0 : Math.sin(t * .7 + 1) * .04;
      renderer.render(scene, cam);
    }
  };
  return { src: src, zone: zone, api: api };
}
