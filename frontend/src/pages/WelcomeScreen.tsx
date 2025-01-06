import React, { useCallback, useMemo, useState } from 'react';
import { Engine, MoveDirection, OutMode, ISourceOptions } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import { walletStore } from '@/stores';
import { HeroSection } from '@/components/welcome/HeroSection';
import { AboutSection } from '@/components/welcome/AboutSection';
import { FooterSection } from '@/components/welcome/FooterSection';
import { observer } from 'mobx-react-lite';
import { theme } from '@/theme';

const WelcomeScreen: React.FC = observer(() => {
  const [isConnecting, setIsConnecting] = useState(false);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesOptions = useMemo(() => ({
    fullScreen: { enable: false, zIndex: 0 },
    background: { color: { value: theme.colors.dark[1000] } },
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
      color: { value: theme.colors.dark[100] },
      links: { 
        color: theme.colors.yellow[500], 
        distance: 150, 
        enable: true, 
        opacity: 0.5, 
        width: 1 
      },
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

  const handleConnectWallet = useCallback(async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      await walletStore.connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setIsConnecting(false);
      
      const message = error instanceof Error 
        ? error.message
        : 'Could not connect wallet. Please make sure MetaMask is installed and try again.';
      
      alert(message);
    }
  }, [isConnecting]);

  return (
    <div 
      className="fixed inset-0 overflow-auto"
      style={{ 
        background: `linear-gradient(to bottom, ${theme.colors.dark[1000]} 50%, ${theme.colors.dark[900]})`,
        color: theme.colors.dark[100]
      }}
    >
      <main className="relative min-h-screen">
        <div className="relative z-10">
          <HeroSection 
            onConnectWallet={handleConnectWallet} 
            isConnecting={isConnecting}
            particlesInit={particlesInit}
            particlesOptions={particlesOptions}
          />
          <AboutSection />
          <FooterSection />
        </div>
      </main>
    </div>
  );
});

export default WelcomeScreen;
