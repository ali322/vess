export const vless = {
  vnext: [
    {
      address: 'www.example.com',
      port: 443,
      users: [
        {
          encryption: 'none',
          id: 'abcd',
          level: 0,
          flow: ""
        }
      ]
    }
  ]
}

export const trojan = {
  servers: [
    {
      address: 'www.example.com',
      port: 443,
      password: 'password',
      email: 'anonymous@example.com',
      flow: ""
    }
  ]
}

export default {
  tag: 'foo',
  protocol: 'vless',
  settings: vless,
  streamSettings: {
    network: 'tcp',
    security: 'xtls',
    xtlsSettings: {
      allowInsecure: true,
      serverName: ''
    }
  }
}
