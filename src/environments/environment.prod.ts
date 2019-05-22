export const environment = {
  production: true
};

const mailchainNodeBaseWebProtocol = "http"
const mailchainNodeBaseHost = "127.0.0.1"
const mailchainNodeBasePort = "8080"

export const applicationApiConfig = {
  "webProtocols": ["http","https"],
  "networks": [
    "ropsten", 
    "rinkeby", 
    "kovan", 
    "goerli"
  ],
  "protocols": ["ethereum"],

  "mailchainNodeBaseWebProtocol": mailchainNodeBaseWebProtocol,
  "mailchainNodeBaseHost": mailchainNodeBaseHost,
  "mailchainNodeBasePort": mailchainNodeBasePort,
}
