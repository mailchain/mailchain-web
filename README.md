# MailchainWeb Readme
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmailchain%2Fmailchain-web.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmailchain%2Fmailchain-web?ref=badge_shield)
[![Build Status](https://travis-ci.com/mailchain/mailchain-web.svg?branch=master)](https://travis-ci.com/mailchain/mailchain-web)
[![Coverage Status](https://coveralls.io/repos/github/mailchain/mailchain-web/badge.svg?branch=master)](https://coveralls.io/github/mailchain/mailchain-web?branch=master)
 [![Join the chat at https://gitter.im/Mailchain/community](https://badges.gitter.im/Mailchain/mailchain.svg)](https://gitter.im/Mailchain/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

* [MailchainWeb Readme](#mailchainweb-readme)
	* [Welcome to Mailchain](#welcome-to-mailchain)
	* [About Mailchain](#about-mailchain)
		* [Introduction](#introduction)
		* [Mailchain Message Lifecycle](#mailchain-message-lifecycle)
	* [Getting Started](#getting-started)
	* [Address Formats](#address-formats)
		* [URL and Port Settings](#url-and-port-settings)
		* [Browser Storage](#browser-storage)
		* [Message Storage](#message-storage)
	* [Development Info](#development-info)
		* [Development server](#development-server)
		* [Build](#build)
		* [Running unit tests](#running-unit-tests)
		* [Running end-to-end tests](#running-end-to-end-tests)
	* [License](#license)

<!-- /code_chunk_output -->

## Welcome to Mailchain

This repository contains the Mailchain Web Application that is powered by [https://github.com/mailchain/mailchain](https://github.com/mailchain/mailchain), built to the [Mailchain specification](https://github.com/mailchain/mailchain-specification).

---


## About Mailchain 
Extract from the [Mailchain specification](https://github.com/mailchain/mailchain-specification):

### Introduction 
Mailchain enables blockchain-based email-like messaging with plain or rich text and attachment capabilities. Using blockchain protocols and decentralized storage, Mailchain delivers a simple, secure, messaging experience.

Account holders or owners of a public address often need to communicate in the context of the account or public address. Communication may relate to transactions, account actions or some type of notification.

Examples of use cases for blockchain messaging include invoicing, receipts, contacting users of a service or application developers.

The majority of blockchain protocols provide no standard way to handle messaging. Some account holders have sent messages as an encrypted or unencrypted string included in transaction data. Some applications work around the problem by asking users to link another method of contact (e.g. email address, phone number etc.) to an application. This compromises anonymity by asking users to link or reveal an identity. It also increases exposure to security risks, and relies on additional centralized services.

This proposal outlines how Mailchain gives users the ability to send and receive rich-media HTML messages between public addresses through a simple, email-like interface. All message contents and attachments are encrypted so only the intended recipient of the message can decrypt and view messages.

### Mailchain Message Lifecycle

Mailchain is a simple, secure and practical standard which can be implemented across different blockchains. It uses underlying native blockchain protocol capabilities including addressing, immutability, data transmission, and cryptography.

The basic message flow is as follows:

* A user sends a message. The message is encrypted and stored using the recipient’s public key so that only the recipient can locate and decrypt the message contents. The encrypted location of the message is sent by the sender to the recipient in the data field of a transaction.

* To read a message, a recipient uses a corresponding private key to decrypt the location of the message from the data field of a transaction and decrypt the message contents.

---

## Getting Started

1. To use the Mailchain Web Application, you need to be running the [mailchain application](https://github.com/mailchain/mailchain) which contains the api and configuration for messaging.

2. Then to use the mailchain web interface, either:

    * download the files in `/dist`, or
    * go to https://mailchain.xyz/inbox

## Address Formats

The following address formats are referenced:

| Address Format | Example | Notes |
| --- | --- | --- |
| Ethereum | `0xd5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6` | Case insensitive |
| Mailchain | `<0xd5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6@ropsten.ethereum>` | Case insensitive |

### URL and Port Settings
By default, the Mailchain web interface expects to communicate with the Mailchain application running on the localhost using port 8080.

To change this:

#### Change server settings on the Inbox page

1. Click 'Settings' on the Inbox page
1. Make any updates
1. Click 'save'

#### Change server settings using url query parameters

It is possible to change the settings programatically using a url with params. For example, `http://localhost:4200/#/?web-protocol=http&host=localhost&port=8080` will configure the Inbox to use: `http` to contact `localhost` on port `8080`. The Inbox will set the values, then refresh the page.

| Query Parameter | Description |
| --- | --- | 
| `web-protocol` | The Internet protocol e.g. `http` or `https` | 
| `host` | The host e.g. `localhost`, `127.0.0.1` or another host | 
| `port` | The port e.g. `8080` |

### Browser Storage
The following values are cached in the browser session storage:

Key | Value
| - | - |
currentNetwork: | The current selected network (e.g. `ropsten`, `mainnet`)
currentAccount: | The current selected account for this network
currentProtocol: | The current selected blockchain protocol
currentWebProtocol: | The current selected web protocol (e.g. `https` or `http`) for contacting the mailchian application
currentPort: | The current selected port (e.g. `8080`) for contacting the mailchian application
currentHost: | The current selected host (e.g. `127.0.0.1`, `localhost`, etc.) for contacting the mailchian application

### Message Storage
The Mailchain web application does not store message contents.

## Development Info

### Requirements

node_js version 13

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmailchain%2Fmailchain-web.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmailchain%2Fmailchain-web?ref=badge_large)
