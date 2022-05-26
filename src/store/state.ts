export interface Setting{
  socketPort: number
  httpPort: number
  extra?: Record<string, any>
}

export interface State {
  servers: Record<string, any>[]
  running: boolean
  output: string[]
  settings: Setting
}

export const initState: State = {
  servers: [],
  running: false,
  output: [],
  settings: {
    socketPort: 1088,
    httpPort: 1089,
  }
}
