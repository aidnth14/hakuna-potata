import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface PotatoSceneProps {
  mood?: 'golden' | 'cosmic' | 'crispy' | 'disco';
}

export const PotatoScene3D: React.FC<PotatoSceneProps> = ({ mood = 'golden' }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Group for the potato and floating accessories
    const potatoGroup = new THREE.Group();
    scene.add(potatoGroup);

    // Create Organic 3D Potato Geometry
    // We start with a SphereGeometry and displace vertices to give an authentic bumpy potato shape
    const baseGeo = new THREE.SphereGeometry(1.2, 48, 48);
    const pos = baseGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // Elongate along X and distort irregularly for potato silhouette
      const elongation = 1.35;
      const nx = x * elongation;
      const ny = y * 0.95;
      const nz = z * 0.9;

      // Pseudo-noise bumps
      const bump =
        Math.sin(nx * 3.5) * 0.08 +
        Math.cos(ny * 4.2) * 0.07 +
        Math.sin(nz * 3.0 + nx) * 0.06;

      pos.setXYZ(i, nx + bump, ny + bump, nz + bump);
    }
    baseGeo.computeVertexNormals();

    // Potato Material
    const getPotatoColor = (m: string) => {
      switch (m) {
        case 'cosmic':
          return { color: 0x8b5cf6, emissive: 0x3b0764, roughness: 0.35, metalness: 0.2 };
        case 'crispy':
          return { color: 0xd97706, emissive: 0x451a03, roughness: 0.8, metalness: 0.05 };
        case 'disco':
          return { color: 0xec4899, emissive: 0x831843, roughness: 0.2, metalness: 0.6 };
        case 'golden':
        default:
          return { color: 0xc6924b, emissive: 0x3d2305, roughness: 0.65, metalness: 0.1 };
      }
    };

    const matProps = getPotatoColor(mood);
    const potatoMaterial = new THREE.MeshStandardMaterial({
      color: matProps.color,
      emissive: matProps.emissive,
      roughness: matProps.roughness,
      metalness: matProps.metalness,
      flatShading: false,
    });

    const potatoMesh = new THREE.Mesh(baseGeo, potatoMaterial);
    potatoMesh.castShadow = true;
    potatoMesh.receiveShadow = true;
    // Slight initial tilt to the right like the icon
    potatoMesh.rotation.z = -0.15;
    potatoMesh.rotation.y = 0.3;
    potatoGroup.add(potatoMesh);

    // Add Potato Eyes (Dimples)
    const eyeGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x452309,
      roughness: 0.9,
    });
    const eyePositions = [
      [0.6, 0.4, 0.9],
      [-0.7, -0.3, 0.8],
      [0.2, -0.5, 1.0],
      [-0.4, 0.5, 0.85],
      [0.9, -0.2, 0.5],
      [-0.8, 0.2, -0.6],
    ];
    eyePositions.forEach(([ex, ey, ez]) => {
      const eyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
      eyeMesh.position.set(ex, ey, ez);
      eyeMesh.scale.set(1.2, 0.5, 0.8);
      potatoMesh.add(eyeMesh);
    });

    // Cute 3D Eyes & Smile for Hakuna Potata
    const cuteGroup = new THREE.Group();
    const pupilGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
    const shineGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Left eye
    const leftEye = new THREE.Mesh(pupilGeo, pupilMat);
    leftEye.position.set(-0.35, 0.15, 1.12);
    const leftShine = new THREE.Mesh(shineGeo, shineMat);
    leftShine.position.set(-0.32, 0.18, 1.22);
    cuteGroup.add(leftEye, leftShine);

    // Right eye
    const rightEye = new THREE.Mesh(pupilGeo, pupilMat);
    rightEye.position.set(0.35, 0.15, 1.12);
    const rightShine = new THREE.Mesh(shineGeo, shineMat);
    rightShine.position.set(0.38, 0.18, 1.22);
    cuteGroup.add(rightEye, rightShine);

    // Rosy Cheeks
    const cheekGeo = new THREE.CircleGeometry(0.1, 16);
    const cheekMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.65 });
    const leftCheek = new THREE.Mesh(cheekGeo, cheekMat);
    leftCheek.position.set(-0.55, -0.02, 1.05);
    leftCheek.rotation.y = -0.35;
    const rightCheek = new THREE.Mesh(cheekGeo, cheekMat);
    rightCheek.position.set(0.55, -0.02, 1.05);
    rightCheek.rotation.y = 0.35;
    cuteGroup.add(leftCheek, rightCheek);

    // Smile
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.18, -0.08, 1.15),
      new THREE.Vector3(0, -0.25, 1.18),
      new THREE.Vector3(0.18, -0.08, 1.15)
    );
    const smilePoints = curve.getPoints(20);
    const smileGeo = new THREE.BufferGeometry().setFromPoints(smilePoints);
    const smileMat = new THREE.LineBasicMaterial({ color: 0x111827, linewidth: 3 });
    const smileMesh = new THREE.Line(smileGeo, smileMat);
    cuteGroup.add(smileMesh);

    potatoMesh.add(cuteGroup);

    // Halo / Orbiting Ring
    const ringGeo = new THREE.TorusGeometry(2.1, 0.035, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.6;
    ringMesh.rotation.y = 0.2;
    scene.add(ringMesh);

    // Floating Golden French Fries / Star Orbitals
    const fryGeo = new THREE.BoxGeometry(0.12, 0.6, 0.12);
    const fryMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.4,
      metalness: 0.1,
    });

    const fries: THREE.Mesh[] = [];
    const fryCount = 8;
    for (let i = 0; i < fryCount; i++) {
      const fry = new THREE.Mesh(fryGeo, fryMat);
      const angle = (i / fryCount) * Math.PI * 2;
      const radius = 2.4 + Math.sin(i) * 0.3;
      fry.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 1.5,
        Math.sin(angle) * radius
      );
      fry.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(fry);
      fries.push(fry);
    }

    // Particle Dust / Sparkles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 10;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.07,
      transparent: true,
      opacity: 0.85,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
    mainLight.position.set(4, 5, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-5, 2, -4);
    scene.add(rimLight);

    const warmUnderLight = new THREE.PointLight(0xf59e0b, 1.5, 10);
    warmUnderLight.position.set(0, -3, 2);
    scene.add(warmUnderLight);

    // Interactive Drag / Orbiting Logic
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domElem.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth idle floating and gentle rotation
      potatoGroup.position.y = Math.sin(elapsedTime * 2.2) * 0.15;
      
      // Interpolate rotation towards target if dragged, otherwise continuous slow spin
      if (!isDragging) {
        targetRotationY += 0.008;
      }
      potatoGroup.rotation.y += (targetRotationY - potatoGroup.rotation.y) * 0.1;
      potatoGroup.rotation.x += (targetRotationX - potatoGroup.rotation.x) * 0.1;

      // Gentle wobble
      potatoMesh.rotation.z = Math.sin(elapsedTime * 1.5) * 0.08 - 0.15; // keeps the iconic right tilt

      // Spin rings & particles
      ringMesh.rotation.z += 0.005;
      ringMesh.rotation.x = Math.PI / 2.6 + Math.sin(elapsedTime) * 0.05;
      particleSystem.rotation.y -= 0.001;

      // Animate floating french fries
      fries.forEach((fry, idx) => {
        const fryAngle = (idx / fryCount) * Math.PI * 2 + elapsedTime * 0.4;
        const r = 2.4 + Math.sin(elapsedTime + idx) * 0.25;
        fry.position.x = Math.cos(fryAngle) * r;
        fry.position.z = Math.sin(fryAngle) * r;
        fry.position.y = Math.sin(elapsedTime * 2 + idx) * 0.6;
        fry.rotation.x += 0.02;
        fry.rotation.y += 0.03;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domElem.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      baseGeo.dispose();
      potatoMaterial.dispose();
    };
  }, [mood]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
      <div
        ref={mountRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setClickCount(c => c + 1)}
        className="w-full h-[450px] cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden shadow-2xl relative"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, #fffbeb 0%, #f8fafc 55%, #f1f5f9 100%)',
        }}
      />
      
      {/* 3D Scene Controls & Overlays */}
      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between pointer-events-none text-xs text-slate-600 bg-white/85 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
        <span>🖱️ Drag to rotate in 3D • Scroll/Zoom</span>
        <span className="font-semibold text-amber-700">✨ 3D Potato Bounces: {clickCount}</span>
        <span className="hidden sm:inline text-slate-400">Three.js WebGL • 60 FPS</span>
      </div>

      {isHovered && (
        <div className="absolute top-4 right-4 pointer-events-none bg-amber-500 text-white font-bold px-3 py-1 rounded-full text-xs shadow-md animate-pulse">
          🥔 Petting Potata!
        </div>
      )}
    </div>
  );
};
