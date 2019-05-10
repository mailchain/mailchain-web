
export const environment = {
  production: false
};

const mailchainNodeBaseWebProtocol = "http"
const mailchainNodeBaseHost = "127.0.0.1"
const mailchainNodeBasePort = "8080"

export const applicationApiConfig = {
  "networks": ["ropsten"],
  "protocols": ["ethereum"],

  "mailchainNodeBaseWebProtocol": mailchainNodeBaseWebProtocol,
  "mailchainNodeBaseHost": mailchainNodeBaseHost,
  "mailchainNodeBasePort": mailchainNodeBasePort,
}

// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
