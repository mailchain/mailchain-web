import { version } from '../../package.json';

export const environment = {
  production: true,
  version: version,
  repositoryVersionLatestEndpoint: "https://api.github.com/repos/mailchain/mailchain/releases/latest",
};

const mailchainNodeBaseWebProtocol = "http"
const mailchainNodeBaseHost = "127.0.0.1"
const mailchainNodeBasePort = "8080"

export const applicationApiConfig = {
  "webProtocols": ["http","https"],
  "networks": [
    "mainnet",
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
