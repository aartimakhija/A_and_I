"use client";
import { useRef, useEffect } from "react";
import { SANS } from "./theme";

export function Hero3D({ rm, heroImage, caption }: { rm: boolean; heroImage?: string; caption?: string }) {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let alive = true;
    let renderer: any, frame: number, ro: ResizeObserver, timer: any;
    const el = mount.current;
    const listeners: [any, string, any][] = [];
    const on = (t: any, ev: string, fn: any, o?: any) => { t.addEventListener(ev, fn, o); listeners.push([t, ev, fn]); };
    const SRC = heroImage ? [heroImage] : [];

    const init = (THREE: any) => {
      if (!alive || !el || SRC.length === 0) return;
      const W = () => el.clientWidth || 1, H = () => el.clientHeight || 1;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W(), H());
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
      renderer.domElement.style.display = "block";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0d0c0b, 0.072);
      const camera = new THREE.PerspectiveCamera(42, W() / H(), 0.1, 100);
      camera.position.set(0, 0.5, 7.4);

      const floor = new THREE.Mesh(new THREE.CircleGeometry(16, 64),
        new THREE.MeshStandardMaterial({ color: 0x0a0908, roughness: 0.35, metalness: 0.6 }));
      floor.rotation.x = -Math.PI / 2; floor.position.y = -3.0; scene.add(floor);
      const pool = new THREE.Mesh(new THREE.CircleGeometry(3.2, 64),
        new THREE.MeshBasicMaterial({ color: 0xC4A96A, transparent: true, opacity: 0.12 }));
      pool.rotation.x = -Math.PI / 2; pool.position.y = -2.98; scene.add(pool);

      scene.add(new THREE.HemisphereLight(0x3a3530, 0x05040a, 0.55));
      const key = new THREE.SpotLight(0xfff4e0, 9, 28, Math.PI / 6, 0.6, 1.3);
      key.position.set(0, 9, 3.5); scene.add(key); scene.add(key.target);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(3, 11, 48, 1, true),
        new THREE.MeshBasicMaterial({ color: 0xfff0d8, transparent: true, opacity: 0.04, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
      cone.position.set(0, 4.2, -0.6); scene.add(cone);
      const dN = 170, dp = new Float32Array(dN * 3);
      for (let i = 0; i < dN; i++) { dp[i*3] = (Math.random()-0.5)*7; dp[i*3+1] = Math.random()*6-2.5; dp[i*3+2] = (Math.random()-0.5)*5; }
      const dg = new THREE.BufferGeometry(); dg.setAttribute("position", new THREE.BufferAttribute(dp, 3));
      const dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0xC4A96A, size: 0.02, transparent: true, opacity: 0.5, depthWrite: false }));
      scene.add(dust);

      const makeFeather = (aspect: number) => {
        const cw = 256, ch = Math.max(64, Math.round(256 / aspect));
        const c = document.createElement("canvas"); c.width = cw; c.height = ch;
        const x = c.getContext("2d")!;
        x.fillStyle = "#000"; x.fillRect(0, 0, cw, ch);
        const mn = Math.min(cw, ch), m = Math.round(mn * 0.055);
        x.filter = "blur(" + Math.round(mn * 0.05) + "px)";
        x.fillStyle = "#fff"; x.fillRect(m, m, cw - 2 * m, ch - 2 * m);
        const t = new THREE.CanvasTexture(c); t.needsUpdate = true; return t;
      };

      const loader = new THREE.TextureLoader();
      const group = new THREE.Group(); scene.add(group);
      const planes: any[] = []; let active = 0;
      const HH = 4.8;
      SRC.forEach((s, i) => {
        const tex = loader.load(s, (t: any) => {
          const a = (t.image.width || 3) / (t.image.height || 4);
          planes[i].scale.set(HH * a, HH, 1);
          planes[i].material.alphaMap = makeFeather(a);
          planes[i].material.needsUpdate = true;
        });
        tex.encoding = THREE.sRGBEncoding;
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: i === 0 ? 1 : 0, fog: false });
        const p = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
        p.position.y = 0.35; p.scale.set(HH * 0.7, HH, 1); group.add(p); planes.push(p);
      });
      if (SRC.length > 1 && !rm) timer = setInterval(() => { active = (active + 1) % SRC.length; }, 4400);

      let az = 0, mx = 0, my = 0;
      on(el, "mousemove", (e: MouseEvent) => { const r = el.getBoundingClientRect(); mx = (e.clientX-r.left)/r.width-0.5; my = (e.clientY-r.top)/r.height-0.5; });

      const clock = new THREE.Clock();
      const render = () => {
        const t = clock.getElapsedTime();
        const sway = rm ? 0 : Math.sin(t * 0.45) * 0.12;
        group.rotation.y = sway;
        group.position.y = rm ? 0.35 : 0.35 + Math.sin(t * 0.8) * 0.07;
        planes.forEach((p, i) => { p.material.opacity += ((i === active ? 1 : 0) - p.material.opacity) * 0.05; });
        if (!rm) dust.rotation.y = t * 0.02;
        az += ((rm ? 0 : mx * 0.35) - az) * 0.05;
        camera.position.x = Math.sin(az) * 7.4; camera.position.z = Math.cos(az) * 7.4;
        camera.position.y += ((0.5 - my * 0.7) - camera.position.y) * 0.05;
        camera.lookAt(0, 0.35, 0);
        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      };
      render();
      const resize = () => { if (!el) return; camera.aspect = W() / H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H()); };
      ro = new ResizeObserver(resize); ro.observe(el);
    };

    if ((window as any).THREE) init((window as any).THREE);
    else if (SRC.length > 0) {
      let s = document.querySelector("script[data-three-r128]") as HTMLScriptElement | null;
      if (!s) {
        s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
        s.async = true; s.setAttribute("data-three-r128", "1"); document.head.appendChild(s);
      }
      const goload = () => (window as any).THREE && init((window as any).THREE);
      s.addEventListener("load", goload); listeners.push([s, "load", goload]);
      if ((window as any).THREE) init((window as any).THREE);
    }

    return () => {
      alive = false;
      if (frame) cancelAnimationFrame(frame);
      if (timer) clearInterval(timer);
      if (ro) ro.disconnect();
      listeners.forEach(([t, ev, fn]) => t.removeEventListener(ev, fn));
      if (renderer) { renderer.dispose(); if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); }
    };
  }, [rm, heroImage]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "radial-gradient(120% 90% at 55% 32%, #1a1714 0%, #0D0C0B 60%, #060504 100%)" }}>
      <div ref={mount} style={{ position: "absolute", inset: 0 }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(72% 62% at 50% 42%, transparent 46%, rgba(6,5,4,0.5) 100%)" }} />
      {caption && (
        <span style={{ position: "absolute", bottom: 18, right: 20, fontFamily: SANS, fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "rgba(196,169,106,0.75)", fontWeight: 300, pointerEvents: "none" }}>{caption}</span>
      )}
    </div>
  );
}
