import { createStore, useStore as baseUseStore, Store } from "vuex"
import { InjectionKey } from 'vue'
import { State, initState } from './state'
import mutations from "./mutation"
export * from './types'
import persistState from './persist_state'

export const key :InjectionKey<Store<State>> = Symbol()

const log = (store: Store<State>) => {
  store.subscribe((mutation, state) => {
    console.log('mutation', mutation.type, mutation.payload)
  })
}

export const store = createStore<State>({
  state: initState,
  mutations,
  plugins: [persistState(), log]
})

export function useStore() {
  return baseUseStore(key)
}

export {
  initState
}