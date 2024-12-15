import { create } from 'zustand';

export const useDrawerStore = create((set) => ({
    isOpen: false,
    popup: false,
    togglePopup : () => set((state) => ({ popup: !state.popup })), 
    toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
    
}));