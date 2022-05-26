import base from './base'
import * as outbounds from './outbound'

export const mergeSettings = (
  server: Record<string, any>,
  settings: Record<string, any>
): Record<string, any> => {
  let config = Object.assign({}, base, {
    inbounds: base.inbounds.map((v: Record<string, any>) => {
      v.protocol === 'socks' && (v.port = settings.socketPort)
      v.protocol === 'http' && (v.port = settings.httpPort)
      return v
    }),
    outbounds: [Object.assign({}, server, { tag: 'proxy' })].concat(
      base.outbounds
    )
  })
  if (settings.extra) {
    config = Object.assign({}, config, settings.extra)
  }
  console.log('config', config)
  return config
}

export const outboundByProtocol = (
  protocol: string
) => {
  return (outbounds as Record<string, any>)[protocol] || {}
}
