import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGameStore = create(
    persist(
        (set) => ({
            // Setup
            gameMode: null,
            source: null,
            setUpComplete: false,

            // Game
            finished: false,


            // Actions
            setMode: (mode) => set({ gameMode: mode }),
            setSource: (source) => set({ source }),
            setSetUpComplete: (complete) => set({ setUpComplete: complete }),
            setFinished: (finished) => set({ finished }),

            resetGame: () =>
                set({
                    gameMode: null,
                    source: null,
                    setUpComplete: false,
                    finished: false,
                })
        }),
    )
)