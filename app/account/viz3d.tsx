'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// 3D Radar Chart Component
export function Radar3D({
  data,
  color = '#e63946',
  size = 300
}: {
  data: { label: string; value: number }[];
  color?: string;
  size?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Create 3D radar
    const radarGroup = new THREE.Group();
    const segments = data.length;
    const maxValue = 100;

    // Center sphere
    const centerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const centerMaterial = new THREE.MeshPhongMaterial({ color });
    const centerSphere = new THREE.Mesh(centerGeometry, centerMaterial);
    radarGroup.add(centerSphere);

    // Grid lines and points
    const gridGeometry = new THREE.BufferGeometry();
    const gridPoints: THREE.Vector3[] = [];

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle);
      const y = Math.sin(angle);

      // Grid rings
      for (let ring = 0; ring <= 5; ring++) {
        const radius = (ring / 5) * 1.5;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (ring > 0) {
          gridPoints.push(new THREE.Vector3(px, py, 0));
        }
      }

      // Connecting line between rings
      if (i < segments - 1) {
        const nextAngle = ((i + 1) / segments) * Math.PI * 2;
        for (let ring = 1; ring <= 5; ring++) {
          const radius = (ring / 5) * 1.5;
          gridPoints.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
          gridPoints.push(new THREE.Vector3(Math.cos(nextAngle) * radius, Math.sin(nextAngle) * radius, 0));
        }
      }
    }

    gridGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(gridPoints.flatMap(p => [p.x, p.y, p.z])), 3));
    const gridMaterial = new THREE.LineBasicMaterial({ color: '#e5e7eb', linewidth: 1 });
    const gridLines = new THREE.LineSegments(gridGeometry, gridMaterial);
    radarGroup.add(gridLines);

    // Data points and surface
    const dataPoints: THREE.Vector3[] = [];
    const indices: number[] = [];

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const value = data[i]?.value || 0;
      const normalizedValue = (value / maxValue) * 1.5;

      const x = Math.cos(angle) * normalizedValue;
      const y = Math.sin(angle) * normalizedValue;
      const z = (Math.sin(angle * 2) * 0.3);

      const point = new THREE.Vector3(x, y, z);
      dataPoints.push(point);

      // Sphere at each data point
      const pointGeometry = new THREE.SphereGeometry(0.12, 16, 16);
      const pointMaterial = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3
      });
      const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
      pointMesh.position.copy(point);
      radarGroup.add(pointMesh);
    }

    // Surface geometry
    const surfaceGeometry = new THREE.BufferGeometry();
    dataPoints.push(new THREE.Vector3(0, 0, 0));

    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments;
      indices.push(i, next, segments);
    }

    surfaceGeometry.setAttribute('position', new THREE.BufferAttribute(
      new Float32Array(dataPoints.flatMap(p => [p.x, p.y, p.z])),
      3
    ));
    surfaceGeometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
    surfaceGeometry.computeVertexNormals();

    const surfaceMaterial = new THREE.MeshPhongMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.2,
      wireframe: false,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });

    const surfaceMesh = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    radarGroup.add(surfaceMesh);

    scene.add(radarGroup);

    // Lighting
    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.4);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Animation
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      radarGroup.rotation.z += 0.002;
      radarGroup.rotation.x = 0.3 + Math.sin(Date.now() * 0.0003) * 0.2;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      gridGeometry.dispose();
      gridMaterial.dispose();
      centerGeometry.dispose();
      centerMaterial.dispose();
      surfaceGeometry.dispose();
      surfaceMaterial.dispose();
    };
  }, [data, color, size]);

  return <div ref={containerRef} style={{ width: size, height: size }} />;
}

// 3D RIASEC Hexagon Component
export function RIASECHexagon3D({
  scores,
  size = 300
}: {
  scores: Record<string, number>;
  size?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const hexagonGroup = new THREE.Group();

    // Hexagon vertices
    const vertices = [];
    const colors = ['#e63946', '#f77f00', '#fcbf49', '#06a77d', '#118ab2', '#073b4c'];
    const labels = ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'];

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const score = scores[labels[i]] || 50;
      const radius = (score / 100) * 1.5;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = Math.cos(angle * 3) * 0.2;

      vertices.push(new THREE.Vector3(x, y, z));

      // Add colored sphere at each vertex
      const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const sphereMaterial = new THREE.MeshPhongMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 0.4
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(vertices[i]);
      hexagonGroup.add(sphere);

      // Label at each vertex
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = colors[i];
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], 128, 60);
      ctx.fillStyle = '#333';
      ctx.font = '20px Arial';
      ctx.fillText(score.toFixed(0), 128, 100);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.copy(vertices[i]);
      sprite.scale.set(0.6, 0.3, 1);
      hexagonGroup.add(sprite);
    }

    // Hexagon surface
    const surfaceGeometry = new THREE.BufferGeometry();
    vertices.push(new THREE.Vector3(0, 0, 0));

    const indices = [];
    for (let i = 0; i < 6; i++) {
      const next = (i + 1) % 6;
      indices.push(i, next, 6);
    }

    surfaceGeometry.setAttribute('position', new THREE.BufferAttribute(
      new Float32Array(vertices.flatMap(v => [v.x, v.y, v.z])),
      3
    ));
    surfaceGeometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
    surfaceGeometry.computeVertexNormals();

    const surfaceMaterial = new THREE.MeshPhongMaterial({
      color: '#e63946',
      emissive: '#e63946',
      emissiveIntensity: 0.15,
      wireframe: false,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });

    const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    hexagonGroup.add(surface);

    scene.add(hexagonGroup);

    // Lighting
    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.4);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Animation
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      hexagonGroup.rotation.z += 0.001;
      hexagonGroup.rotation.x = 0.2 + Math.sin(Date.now() * 0.0002) * 0.15;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      surfaceGeometry.dispose();
      surfaceMaterial.dispose();
    };
  }, [scores, size]);

  return <div ref={containerRef} style={{ width: size, height: size }} />;
}

// 3D Career Sphere (for career clusters visualization)
export function CareerSphere3D({
  careers,
  size = 350
}: {
  careers: Array<{ name: string; category: string; score: number }>;
  size?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const sphereGroup = new THREE.Group();

    // Category colors
    const categoryColors: Record<string, string> = {
      'STEM': '#e63946',
      'Creative': '#f77f00',
      'Business': '#fcbf49',
      'Healthcare': '#06a77d',
      'Social': '#118ab2',
      'Other': '#073b4c'
    };

    // Create spheres for each career
    careers.forEach((career, index) => {
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI;
      const radius = 2.5;

      const x = radius * Math.sin(angle2) * Math.cos(angle1);
      const y = radius * Math.sin(angle2) * Math.sin(angle1);
      const z = radius * Math.cos(angle2);

      const sphereGeometry = new THREE.SphereGeometry(
        0.15 + (career.score / 100) * 0.15,
        16,
        16
      );
      const color = categoryColors[career.category] || '#888888';
      const sphereMaterial = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(x, y, z);
      sphereGroup.add(sphere);
    });

    scene.add(sphereGroup);

    // Lighting
    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Animation
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      sphereGroup.rotation.x += 0.0005;
      sphereGroup.rotation.y += 0.0008;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [careers, size]);

  return <div ref={containerRef} style={{ width: size, height: size, margin: '0 auto' }} />;
}
