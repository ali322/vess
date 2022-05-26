import * as types from './types'
import { State, Setting } from './state'

export default {
  [types.LOAD_SERVERS](state: State, payload: Record<string, any>[]) {
    state.servers = payload.slice()
  },
  [types.CREATE_SERVER](state: State, payload: Record<string, any>) {
    state.servers = state.servers.slice().concat([payload])
  },
  [types.SAVE_SERVER](state: State, payload: Record<string, any>) {
    state.servers = state.servers
      .slice()
      .map((server: Record<string, any>, i: number) => {
        if (payload.index === i) {
          return payload.server
        }
        return server
      })
  },
  [types.DELETE_SERVER](state: State, payload: number) {
    state.servers = state.servers
      .slice()
      .filter((server: Record<string, any>, i: number) => i !== payload)
  },
  [types.TOGGLE_RUNNING](state: State, payload: boolean) {
    state.running = payload
  },
  [types.WRITE_OUTPUT](state: State, payload: string) {
    state.output = state.output.slice().concat([payload])
  },
  [types.PURGE_OUTPUT](state: State) {
    state.output = []
  },
  [types.SAVE_SETTING](
    state: State,
    payload: { field: string; value: string | number }
  ) {
    state.settings = Object.assign({}, state.settings, {
      [payload.field]: payload.value
    })
  },
  [types.LOAD_SETTING](state: State, payload: Record<string, any>) {
    state.settings = Object.assign({}, payload as Setting)
  }
}
