
export const environment = {
  production: false
};

const mailchainNodeBaseProtocol = "http"
const mailchainNodeBaseHost = "127.0.0.1"
const mailchainNodeBasePort = "8080"

export const applicationApiConfig = {
  "networks": ["ropsten"],
  "mailchainNodeBaseProtocol": mailchainNodeBaseProtocol,
  "mailchainNodeBaseHost": mailchainNodeBaseHost,
  "mailchainNodeBasePort": mailchainNodeBasePort,
  "mailchainNodeBaseUrl": `${mailchainNodeBaseProtocol}://${mailchainNodeBaseHost}:${mailchainNodeBasePort}`,
}

// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
