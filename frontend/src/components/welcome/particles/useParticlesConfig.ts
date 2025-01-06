import { useCallback, useMemo } from 'react';
import { Engine, MoveDirection, OutMode, ISourceOptions } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';

export const useParticlesConfig = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesOptions = useMemo(() => ({
    fullScreen: { enable: false, zIndex: 0 },
    background: { color: { value: '#0d47a1' } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: true, mode: 'push' as const },
        onHover: { enable: true, mode: 'repulse' as const },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      color: { value: '#ffffff' },
      links: { color: '#ffffff', distance: 150, enable: true, opacity: 0.5, width: 1 },
      collisions: { enable: true },
      move: {
        direction: 'none' as MoveDirection,
        enable: true,
        outModes: { default: 'bounce' as OutMode },
        random: false,
        speed: 3,
        straight: false,
      },
      number: { density: { enable: true, value_area: 1000 }, value: 100 },
      opacity: { value: 0.5 },
      shape: { type: 'circle' as const },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  }) as ISourceOptions, []);

  return {
    particlesInit,
    particlesOptions,
  };
}; 