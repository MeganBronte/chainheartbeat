# ChainHeartbeat

ChainHeartbeat is a Base mini app for recording unlimited onchain heartbeats.

Each heartbeat is written by calling the deployed `heartbeat()` contract function.
There is no platform fee for using the app; each interaction only requires Base gas.

Repository: https://github.com/MeganBronte/chainheartbeat.git

## Overview

ChainHeartbeat provides a simple interface for connecting a wallet on Base and sending a heartbeat transaction.

The app is designed to be lightweight and direct:

- Connect a supported wallet.
- Submit a heartbeat.
- Confirm the transaction on Base.
- View the result in the app interface.

## Features

- Base mini app experience
- Onchain heartbeat recording
- Direct calls to the deployed `heartbeat()` function
- No platform fee
- Base mainnet support
- Native injected wallet discovery
- External Coinbase Wallet support
- Type-safe frontend code with TypeScript
- Next.js App Router structure

## Stack

- Next.js App Router
- TypeScript
- Wagmi
- Viem
- Base mainnet

## Wallet Support

The app uses Wagmi connectors for wallet access.

Supported connector setup:

- `injected()` for Base App, MetaMask, OKX, and other injected wallets
- `coinbaseWallet()` for external Coinbase Wallet

The app does not use:

- RainbowKit
- WalletConnect connector

## Contract

The heartbeat contract is deployed at:

`0xFaed9B9BE7765Fa1d4ef80a0420522C956D3CBDE`

The frontend calls the contract's `heartbeat()` function when a user records a heartbeat.

## Attribution Setup

The app is prepared for base.dev attribution in two places.

### Offchain Attribution

Edit:

`app/layout.tsx`

Find the `base:app_id` meta tag and fill in the content value provided by base.dev:

`<meta name="base:app_id" content="" />`

### Onchain Attribution

Edit:

`lib/wagmi.ts`

Fill `BUILDER_CODE` with the Builder Code from base.dev.

Example format:

`bc_abcd1234`

The `builderDataSuffix` value is configured in Wagmi and is also passed explicitly to `writeContract`.

After updating both attribution values, redeploy the app.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local development URL shown in your terminal.

## Checks

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Usage

1. Open the app.
2. Connect a supported wallet.
3. Make sure the wallet is using Base mainnet.
4. Press the heartbeat action in the interface.
5. Confirm the transaction in your wallet.
6. Wait for the transaction to complete.

## Deployment Notes
