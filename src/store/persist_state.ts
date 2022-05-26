import { Store } from "vuex";
import mutation from "./mutation";
import { State } from './state'

function saveState(key: string, state: State) {
  window.localStorage.setItem(key, JSON.stringify(state))
}

function getState(key: string) {
  const value = window.localStorage.getItem(key)
  return typeof value === 'undefined' ? null : JSON.parse(value as string)
}

export default function ():(store: Store<State>) => void {
  const key = 'vuex'
  return (store: Store<State>) => {
    const savedState = getState(key)
    if (savedState) {
      store.replaceState(Object.assign({}, savedState, {
        running: false, output: []
      }))
    }
    store.subscribe((mutation, state) => {
      saveState(key, state)
    })
  }
}