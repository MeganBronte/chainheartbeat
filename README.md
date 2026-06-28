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
