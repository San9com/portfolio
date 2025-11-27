"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { Group, Vector3 } from "three";

type GlassLensProps = {
  position?: [number, number, number];
  speed?: number;
  startOffset?: number;
  radius?: number;
  travelWidth?: number;
  scale?: number;
  isMobile?: boolean;
};

export function GlassLens({
  position = [0, 0, 0],
  speed = 0.5,
  startOffset = 0,
  radius = 0.4,
  travelWidth = 8,
  scale = 1,
  isMobile = false,
}: GlassLensProps) {
  const ref = useRef<Group>(null);
  const lensRef = useRef<Group>(null);
  const { camera, size, viewport } = useThree();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  
  // Physics state for mobile gyroscope
  const velocity = useRef(new Vector3(0, 0, 0));
  const position3D = useRef(new Vector3(position[0], position[1], position[2]));
  const [gyroData, setGyroData] = useState({ beta: 0, gamma: 0, alpha: 0 });
  
  // Initialize position when component mounts or position changes
  const posX = position[0];
  const posY = position[1];
  const posZ = position[2];
  useEffect(() => {
    position3D.current.set(posX, posY, posZ);
  }, [posX, posY, posZ]);
  
  // Physics constants
  const GRAVITY = -0.05;
  const BOUNCE_DAMPING = 0.8;
  const FRICTION = 0.98;
  const GYRO_SENSITIVITY = 0.002; // Increased sensitivity for gyroscope
  
  // Initialize bounds based on viewport
  const BOUNDS = useRef({
    x: viewport.width / 2,
    y: viewport.height / 2,
    z: 2,
  });
  
  // Update bounds when viewport changes
  useEffect(() => {
    BOUNDS.current = {
      x: viewport.width / 2,
      y: viewport.height / 2,
      z: 2,
    };
  }, [viewport.width, viewport.height]);

  // Gyroscope handler for mobile
  useEffect(() => {
    if (!isMobile) {
      const handleMouseMove = (event: MouseEvent) => {
        const x = (event.clientX / size.width) * 2 - 1;
        const y = -(event.clientY / size.height) * 2 + 1;
        setMouse({ x, y });
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }

    // Mobile: gyroscope
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        setGyroData({
          beta: event.beta || 0, // Front-back tilt (-180 to 180)
          gamma: event.gamma || 0, // Left-right tilt (-90 to 90)
          alpha: event.alpha || 0, // Compass direction (0 to 360)
        });
      }
    };

    if (typeof DeviceOrientationEvent !== "undefined") {
      // Request permission on iOS
      const DeviceOrientationEventWithPermission = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<string>;
      };
      
      if (typeof DeviceOrientationEventWithPermission.requestPermission === "function") {
        DeviceOrientationEventWithPermission
          .requestPermission()
          .then((response: string) => {
            if (response === "granted") {
              window.addEventListener("deviceorientation", handleDeviceOrientation, { passive: true });
            }
          })
          .catch(() => {
            // Permission denied, fallback to mouse
            console.log("Gyroscope permission denied");
          });
      } else {
        // Android and other browsers
        window.addEventListener("deviceorientation", handleDeviceOrientation, { passive: true });
      }
      
      // Also try deviceorientationabsolute for better accuracy
      const handleDeviceOrientationAbsolute = (event: DeviceOrientationEvent) => {
        if (event.beta !== null && event.gamma !== null) {
          setGyroData({
            beta: event.beta || 0,
            gamma: event.gamma || 0,
            alpha: event.alpha || 0,
          });
        }
      };
      
      window.addEventListener("deviceorientationabsolute", handleDeviceOrientationAbsolute, { passive: true });
      
      return () => {
        window.removeEventListener("deviceorientation", handleDeviceOrientation);
        window.removeEventListener("deviceorientationabsolute", handleDeviceOrientationAbsolute);
      };
    }

    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, [isMobile, size]);

  useFrame(() => {
    if (!ref.current) return;

    if (isMobile) {
      // Mobile: Physics-based ball jumping with gyroscope
      // Normalize gyroscope data: beta (-180 to 180), gamma (-90 to 90)
      // Convert to normalized values (-1 to 1) and apply as acceleration
      const normalizedGamma = Math.max(-1, Math.min(1, gyroData.gamma / 90)); // Left-right tilt
      const normalizedBeta = Math.max(-1, Math.min(1, (gyroData.beta - 90) / 90)); // Front-back tilt (center at 90)
      
      // Apply tilt as acceleration (stronger effect)
      velocity.current.x += normalizedGamma * GYRO_SENSITIVITY * 100;
      velocity.current.y += normalizedBeta * GYRO_SENSITIVITY * 100;
      velocity.current.z += GRAVITY; // Gravity always pulls down
      
      // Apply friction
      velocity.current.multiplyScalar(FRICTION);
      
      // Update position
      position3D.current.add(velocity.current);
      
      // Bounce off boundaries with more visible effect
      if (Math.abs(position3D.current.x) > BOUNDS.current.x) {
        position3D.current.x = Math.sign(position3D.current.x) * BOUNDS.current.x;
        velocity.current.x *= -BOUNCE_DAMPING;
      }
      if (Math.abs(position3D.current.y) > BOUNDS.current.y) {
        position3D.current.y = Math.sign(position3D.current.y) * BOUNDS.current.y;
        velocity.current.y *= -BOUNCE_DAMPING;
      }
      if (position3D.current.z < position[2] - 1) {
        position3D.current.z = position[2] - 1;
        velocity.current.z *= -BOUNCE_DAMPING;
        // Add some upward bounce when hitting bottom
        velocity.current.z += 0.1;
      }
      if (position3D.current.z > position[2] + 1) {
        position3D.current.z = position[2] + 1;
        velocity.current.z *= -BOUNCE_DAMPING;
      }
      
      // Apply position
      ref.current.position.copy(position3D.current);
    } else {
      // Desktop: Follow mouse
      const worldPosition = new Vector3(
        mouse.x * viewport.width / 2,
        mouse.y * viewport.height / 2,
        position[2]
      );
      ref.current.position.copy(worldPosition);
    }
  });

  return (
    <group ref={ref} position={position} scale={scale * 0.9}>
      <group ref={lensRef}>
        {/* Uniform glass blob - perfectly circular sphere */}
        <mesh>
          <sphereGeometry args={[radius, 64, 64]} />
          <MeshTransmissionMaterial
            transmission={1}
            roughness={0.01}
            thickness={0.3}
            ior={1.5}
            envMapIntensity={2}
            clearcoat={1}
            clearcoatRoughness={0.01}
            chromaticAberration={0.15}
            distortion={0.2}
            distortionScale={0.5}
            temporalDistortion={0.1}
            iridescence={1}
            iridescenceIOR={1.3}
            iridescenceThicknessRange={[100, 400]}
          />
        </mesh>
      </group>
    </group>
  );
}

