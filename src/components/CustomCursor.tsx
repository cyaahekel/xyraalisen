import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  return (
    <motion.div
      className="custom-cursor hidden md:block"
      animate={{
        x: mousePosition.x - 10,
        y: mousePosition.y - 10,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }}
    />
  );
}
