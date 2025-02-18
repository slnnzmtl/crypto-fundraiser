import React from "react";
import Particles from "react-tsparticles";
import { Engine, ISourceOptions } from "tsparticles-engine";
import { FaWallet } from "react-icons/fa";

interface HeroSectionProps {
  onConnectWallet: () => void;
  isConnecting: boolean;
  isCorrectNetwork: boolean;
  particlesInit: (engine: Engine) => Promise<void>;
  particlesOptions: ISourceOptions;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onConnectWallet,
  isConnecting,
  isCorrectNetwork,
  particlesInit,
  particlesOptions,
}) => (
  <section className="relative min-h-screen flex items-center justify-center py-20">
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particlesOptions as ISourceOptions}
      className="absolute inset-0 -z-10"
    />

    <div className="mx-auto">
      <header className="max-w-[1200px] mx-auto px-12 py-16 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="animate-fadeIn max-w-[1400px] mx-auto">
          <h1 className="text-center text-5xl md:text-6xl xl:text-7xl font-bold mb-8 font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-300 to-yellow-500 leading-tight">
            Welcome to Crypto Fundraiser
          </h1>
          <p className="text-center text-lg md:text-xl xl:text-2xl text-gray-200 mb-12 mx-auto font-light leading-relaxed">
            <span>
              Join our community and start exploring the world of decentralized
              fundraising
            </span>
            <br />
            <span className="text-yellow-400 text-sm">
              It's a pet-project to demonstrate my skills in React, Typescript,
              MobX, Tailwind, and Web3
            </span>
          </p>
          <button
            onClick={onConnectWallet}
            disabled={isConnecting || !isCorrectNetwork}
            className={`group bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold
              py-4 px-12 rounded-xl flex items-center justify-center space-x-2 mx-auto
              transition-all duration-300 transform shadow-lg shadow-yellow-500/25
              hover:shadow-yellow-500/40 ${isConnecting || !isCorrectNetwork ? "opacity-75 cursor-not-allowed" : "hover:scale-105 hover:-translate-y-1 hover:from-yellow-600 hover:to-yellow-700"}`}
          >
            <FaWallet className="text-2xl mr-2 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl">
              {!isCorrectNetwork
                ? "Please Switch to Sepolia Network"
                : isConnecting
                  ? "Connecting..."
                  : "Connect Wallet"}
            </span>
          </button>
        </div>
      </header>
    </div>
  </section>
);
