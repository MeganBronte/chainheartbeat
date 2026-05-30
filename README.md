# ChainHeartbeat

ChainHeartbeat is a Base mini app for recording unlimited onchain heartbeats.
Users do not need to buy an app token or pay a platform fee. Each interaction
calls the deployed `heartbeat()` contract function and only requires Base gas.

## Stack

- Next.js App Router
- TypeScript
- Wagmi with native injected wallet discovery
- Viem
- Base mainnet

## Wallets

- `injected()` for Base App, MetaMask, OKX, and other injected wallets
- `coinbaseWallet()` for external Coinbase Wallet
- No RainbowKit
- No WalletConnect connector

## Contract

`0xFaed9B9BE7765Fa1d4ef80a0420522C956D3CBDE`

## Attribution Setup

The app is prepared for base.dev attribution in two places:

1. Offchain attribution:
   - Edit `app/layout.tsx`
   - Fill `<meta name="base:app_id" content="" />` with the base.dev verify token.

2. Onchain attribution:
   - Edit `lib/wagmi.ts`
   - Fill `BUILDER_CODE` with the Builder Code from base.dev, for example `bc_abcd1234`.
   - `builderDataSuffix` is configured in Wagmi and is also passed explicitly to `writeContract`.

After filling both values, redeploy to Vercel.

## Local Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```
