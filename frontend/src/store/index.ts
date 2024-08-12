import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { InjectionKey } from 'vue';
import { Hand } from '@/types/hand'; // Import the Hand type

export interface State {
  token: string;
  hands: Hand[];
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    token: localStorage.getItem('token') || '',
    hands: [],
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    clearToken(state) {
      state.token = '';
      localStorage.removeItem('token');
    },
    setHands(state, hands: Hand[]) {
      state.hands = hands;
    },
    addHand(state, hand: Hand) {
      state.hands.push(hand);
    },
  },
  actions: {
    login({ commit }, token) {
      commit('setToken', token);
    },
    logout({ commit }) {
      commit('clearToken');
    },
    setHands({ commit }, hands: Hand[]) {
      commit('setHands', hands);
    },
    addHand({ commit }, hand: Hand) {
      commit('addHand', hand);
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    hands: (state) => state.hands,
    totalHands: (state) => state.hands.length,
    averagePot: (state) => {
      const totalPot = state.hands.reduce((sum, hand) => sum + (hand.heroWon ? hand.potWon : -hand.potLost), 0);
      return state.hands.length ? totalPot / state.hands.length : 0;
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}
