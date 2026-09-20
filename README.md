# TallySol

A mobile bill-splitting app for Solana Seeker, built for the Solana Mobile "Clock In" hackathon. Creating a split is the payment request: each person settles their share from their own wallet, with a Solana Pay QR code available for in-person payment. There is no app fee on splitting or settling, only Solana's network fee.

Built with React Native, Expo and Mobile Wallet Adapter. Tested on a physical Solana Seeker.

## What works today

- **Wallet connection** through Mobile Wallet Adapter, with a header pill to copy your address or disconnect.
- **Splits:** create a split with a description, a USD total and any number of people (paste or QR-scan their wallet address). The total is divided equally, counting the organizer as one share.
- **Pay in the currency you choose:** each person picks a currency and the app converts the USD share at live CoinGecko prices. A Solana Pay QR code is available for each unpaid share.
- **Tabs:** Split, Transfer (send and receive), History (completed splits), Wallet (balances and portfolio value) and Settings.
- **Pending summary:** the Split tab shows how many people still owe you and how much.
- **TallySol Plus (SKR-gated):** holding 1,000 or more real mainnet SKR unlocks Plus. The balance is read from mainnet through Helius, and nothing is spent or locked. Plus removes the free-tier limit of 2 active splits and adds four extra settlement tokens: JUP, WIF, BONK and PENGU. A progress bar shows how close you are, and a banner appears when Plus unlocks.

## Honest limitations

- **Devnet for the free tier.** SOL, USDC, USDT and SKR in the currency list run on Solana devnet, and USDC, USDT and SKR there are test tokens we minted, not the real mainnet assets. Only the Plus check reads real mainnet SKR.
- **Plus tokens are mainnet-only.** JUP, WIF, BONK and PENGU exist only on mainnet, and we have not yet tested sending them on mainnet.
- **Splits are stored on the device only.** There is no backend, so other people's phones do not receive your splits.
- **Curated token list.** Settlement uses a fixed, verified list of tokens, not any token a wallet holds.

## Roadmap (not built)

- Push notifications when someone is added to a split (needs a backend)
- Expense history and export as a Plus feature
- Mainnet-only release with real USDC, USDT and SKR mints, then Solana dApp Store publishing

## Run it

```bash
npm install
```

Copy `.env.example` to `.env` and add your own free Helius key (used for the mainnet SKR check). Without a key the app still runs, but the Plus check shows an error.

```bash
copy .env.example .env
```

```bash
npx expo prebuild -p android
npm run android
npx expo start --dev-client
```

Requires Node.js, JDK 17, the Android SDK, and an Android device with a Mobile Wallet Adapter wallet installed.
