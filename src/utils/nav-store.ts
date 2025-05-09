import { create } from 'zustand';

type NavStore = {
    isOpen: boolean;
    toggle: () => void;
};

const useNavStore = create<NavStore>((set) => ({
    isOpen: false,
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useNavStore;