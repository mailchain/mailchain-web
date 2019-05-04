# MailchainWeb Readme
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmailchain%2Fmailchain-web.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmailchain%2Fmailchain-web?ref=badge_shield)



<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
## Welcome to Mailchain

This repository contains the Mailchain Web Application that is powered by [https://github.com/mailchain/mailchain](https://github.com/mailchain/mailchain), built to the [Mailchain specification](https://github.com/mailchain/mailchain-specification).

---

## About Mailchain ###
Extract from the [Mailchain specification](https://github.com/mailchain/mailchain-specification):

### Introduction ###
Mailchain enables blockchain-based email-like messaging with plain or rich text and attachment capabilities. Using blockchain protocols and decentralized storage, Mailchain delivers a simple, secure, messaging experience.

Account holders or owners of a public address often need to communicate in the context of the account or public address. Communication may relate to transactions, account actions or some type of notification.

Examples of use cases for blockchain messaging include invoicing, receipts, contacting users of a service or application developers.

The majority of blockchain protocols provide no standard way to handle messaging. Some account holders have sent messages as an encrypted or unencrypted string included in transaction data. Some applications work around the problem by asking users to link another method of contact (e.g. email address, phone number etc.) to an application. This compromises anonymity by asking users to link or reveal an identity. It also increases exposure to security risks, and relies on additional centralized services.

This proposal outlines how Mailchain gives users the ability to send and receive rich-media HTML messages between public addresses through a simple, email-like interface. All message contents and attachments are encrypted so only the intended recipient of the message can decrypt and view messages.

### Mailchain Message Lifecycle ###

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

## Development Info

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).



## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmailchain%2Fmailchain-web.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmailchain%2Fmailchain-web?ref=badge_large)