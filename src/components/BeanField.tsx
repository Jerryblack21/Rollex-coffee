import { MutableRefObject, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function Beans({ count, progress }: { count: number; progress: MutableRefObject<number> }) {
  const body = useRef<THREE.InstancedMesh>(null);
  const crease = useRef<THREE.InstancedMesh>(null);

  const data = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (rnd(i) - 0.5) * 15,
        y: (rnd(i + 100) - 0.5) * 9,
        z: -rnd(i + 200) * 7 - 0.5,
        s: 0.22 + rnd(i + 300) * 0.32,
        rx: rnd(i + 400) * 6.28,
        ry: rnd(i + 500) * 6.28,
        sp: 0.12 + rnd(i + 600) * 0.4,
        ph: rnd(i + 700) * 6.28,
      })),
    [count],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const local = useMemo(
    () => new THREE.Matrix4().compose(new THREE.Vector3(0, 0.98, 0), new THREE.Quaternion(), new THREE.Vector3(0.62, 0.05, 0.1)),
    [],
  );
  const m = useMemo(() => new THREE.Matrix4(), []);

  useFrame(({ clock }) => {
    if (!body.current || !crease.current) return;
    const t = clock.elapsedTime;
    const p = progress.current;
    data.forEach((d, i) => {
      dummy.position.set(d.x + Math.cos(t * d.sp + d.ph) * 0.2, d.y + Math.sin(t * d.sp + d.ph) * 0.35 + p * 3.5 * (0.4 + d.s), d.z);
      dummy.rotation.set(d.rx + t * d.sp, d.ry + t * d.sp * 0.7 + p * 4, 0);
      dummy.scale.set(d.s, d.s * 0.62, d.s * 0.7);
      dummy.updateMatrix();
      body.current!.setMatrixAt(i, dummy.matrix);
      m.multiplyMatrices(dummy.matrix, local);
      crease.current!.setMatrixAt(i, m);
    });
    body.current.instanceMatrix.needsUpdate = true;
    crease.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={body} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 20, 14]} />
        <meshStandardMaterial color="#4b2a1a" roughness={0.42} metalness={0.15} />
      </instancedMesh>
      <instancedMesh ref={crease} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#1a0d07" roughness={0.9} />
      </instancedMesh>
    </>
  );
}

interface Props {
  progress: MutableRefObject<number>;
  active: boolean;
  count?: number;
}

/** Real WebGL scene: floating coffee beans lit by warm gold light. Renders only while on screen. */
export default function BeanField({ progress, active, count = 46 }: Props) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      frameloop={active ? 'always' : 'never'}
      aria-hidden="true"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#F4E7C5" />
      <pointLight position={[-4, -2, 3]} intensity={45} color="#D6B15E" />
      <Beans count={count} progress={progress} />
    </Canvas>
  );
}
