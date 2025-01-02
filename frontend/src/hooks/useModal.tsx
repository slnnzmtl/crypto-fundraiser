import React, { createContext, useContext, useState } from 'react';

export type ModalType = 'createCampaign';

interface ModalContextType {
  isOpen: (type: ModalType) => boolean;
  openModal: (type: ModalType) => void;
  closeModal: (type: ModalType) => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openModals, setOpenModals] = useState<Set<ModalType>>(new Set());

  const isOpen = (type: ModalType) => openModals.has(type);

  const openModal = (type: ModalType) => {
    setOpenModals(prev => new Set(prev).add(type));
  };

  const closeModal = (type: ModalType) => {
    setOpenModals(prev => {
      const newSet = new Set(prev);
      newSet.delete(type);
      return newSet;
    });
  };

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}; 