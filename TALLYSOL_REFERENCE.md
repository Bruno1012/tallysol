TallySol — Full Project Reference
(Everything Claude Code needs in one file: concept, tech plan, design, SKR strategy, notifications)


═══════════════════════════════════════
1. PROJECT BRIEF
═══════════════════════════════════════

Building TallySol for the Solana Mobile Hackathon "Clock In" (deadline October 8,
registered as a solo entrant, must publish to the Solana dApp Store within 30 days
of winning to claim any prize).

CONCEPT
A mobile bill-splitting app. Creating a split *is* the payment request — each person
settles their share instantly via Solana Pay, one tap from their own wallet. Free
core loop, no app fee on splitting/settling (only Solana's tiny unavoidable network
fee applies) — this mirrors Venmo's free P2P transfers, not Splitwise's subscription
model, because TallySol IS the settlement rail, not just a ledger pointing elsewhere.

TECH STACK
React Native + Expo, scaffolded via `npm create solana-dapp@latest` (Solana Mobile
framework — comes with Mobile Wallet Adapter wiring built in). Testing on a physical
Solana Seeker phone via USB, not an emulator.

BEGINNER CONTEXT
Explain things clearly, step by step, no assumed knowledge.


═══════════════════════════════════════
2. MONETIZATION & SKR STRATEGY
═══════════════════════════════════════

REVENUE MODEL (Venmo-style)
- Core split/settle: free forever, any token, for everyone.
- "Plus" tier is the paid/gated layer: unlimited active groups, expense history/export,
  multi-currency display, and extra settlement token options (see below).

TOKEN TIERS
- Standard — free for everyone, always, no gate: SOL, USDC, USDT, SKR
  (SOL and stablecoins must NEVER be gated — SOL is needed for network fees regardless,
  and stablecoins are what keeps a split's dollar amount from drifting between creation
  and settlement. Gating these would undermine the app's core promise of exact,
  reliable amounts.)
- Free tier also caps at MAX_FREE_ACTIVE_GROUPS = 2 active/live splits at once
  (changed 2026-09-19 from an initial 10 — user's deliberate choice to make the
  Plus upgrade more compelling). Enforced in split-feature-index.tsx: once a
  non-Plus wallet has 2 active splits, the create form is replaced with an
  upsell card instead of a create button.
- Plus-only (unlocked at 1000+ SKR held) — extra settlement tokens: JUP, WIF,
  BONK, PENGU (CHANGED 2026-09-19: PUMP was tried first but dropped — it uses
  the Token-2022 program with a transfer hook, which needs hook account
  resolution the send logic doesn't support and can't be tested on devnet.
  WIF was verified as a drop-in classic-Token-Program replacement instead.
  USDT stays in the free Standard tier as originally specified, since gating a
  stablecoin would break the "exact amounts" promise — user confirmed this
  explicitly after being asked).
  Also unlocks the other Plus features listed above.
  NOTE: this is a curated whitelist, not literally "any token you hold" — a
  wallet holding some other token (e.g. PUMP) still can't use it to settle.
  Described in-app as "a growing list of popular tokens," not "whatever you hold."
- Future (post-hackathon, out of scope now): more tokens can be added later — build
  the token list as a simple config array so adding one later is just a new entry,
  not new logic. History/export and push notifications on split creation (see
  section 4) are also parked as post-hackathon-win Plus features.

KEY FACTS FOR THE SKR CHECK
- SKR token mint address (mainnet): SKRbvo6Gf7GondiT3BbTfuRDPqLWei4j2Qy2NPGZhW3
  VERIFIED 2026-09-19 via CoinGecik's platform-contract mapping AND by reading the
  actual mint account on mainnet (isInitialized=true, matches). Decimals: 6, NOT
  9 as originally guessed here — always read `tokenAmount.uiAmount` from the parsed
  account response rather than hand-computing from raw base units, and this
  discrepancy is moot. Mint authority is NOT null (FMNn5sorEBbEoGQGrh7y3xSbYGt116F12FpL2VTsohiw)
  — more SKR could be issued later, not necessarily a red flag but worth knowing.
- BONK mint (verified 2026-09-19, mainnet, kept for reference even though BONK
  was later swapped out for PUMP): DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263,
  5 decimals, mint authority null (fixed supply).
- JUP mint (verified 2026-09-19, mainnet): JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN,
  6 decimals, mint authority null (fixed supply).
- PUMP mint (verified 2026-09-19, mainnet): pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn,
  6 decimals, mint authority null. NOT USED — uses the Token-2022 program (has a
  transferHook + on-chain metadata extension), which needs transfer-hook account
  resolution the existing send logic doesn't support, and has no devnet
  equivalent to test against. Dropped in favor of WIF (below). Kept here so it's
  not re-added by mistake without solving the Token-2022 problem first.
- WIF mint (verified 2026-09-19, mainnet): EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm,
  6 decimals, mint authority null, freeze authority null (fixed supply, no one
  can freeze accounts). Classic Token Program — works with existing send logic.
- PENGU mint (verified 2026-09-19, mainnet): 2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv,
  6 decimals, mint authority null, freeze authority null. Classic Token Program.
- SKR_PLUS_THRESHOLD = 1000 (roughly $18-20 USD at time of writing — but this is a
  token-COUNT threshold, not a pegged dollar amount. SKR is volatile, having ranged
  from about $9 to $30+ within recent weeks, so the USD value will drift over time.)

WHEN TO RUN THE CHECK
Right after the wallet connects via Mobile Wallet Adapter — that's the first moment
the app knows the user's public key.

HOW THE CHECK WORKS (concept, @solana/web3.js — already in the Solana Mobile template)
1. Create a Connection to a Solana RPC endpoint (public/devnet for testing; a paid
   provider like Helius or Triton for production — free endpoints rate-limit heavily).
2. Call connection.getParsedTokenAccountsByOwner(walletPublicKey, { mint: SKR_MINT }).
3. No account returned → wallet holds 0 SKR → not Plus.
4. Account returned → read account.account.data.parsed.info.tokenAmount.uiAmount
   (already decimal-adjusted, human-readable).
5. Compare against SKR_PLUS_THRESHOLD (1000).
6. Set a boolean in app state: isPlus = balance >= SKR_PLUS_THRESHOLD.

WHERE isPlus PLUGS IN
- Store alongside wallet connection state (Context, Zustand, etc.).
- The settlement-token picker reads isPlus to decide whether to show BONK/JUP.
- Other Plus features (unlimited groups, history/export, multi-currency) also just
  read isPlus before rendering the full feature vs. a locked/upsell state.
- Re-check on wallet reconnect, and optionally on manual refresh.

EDGE CASES
- RPC call fails/times out → default isPlus = false, don't block the rest of the app,
  show a subtle retry rather than a blocking error.
- Wallet disconnects → reset isPlus to false immediately.
- Devnet testing: SKR won't have real value on devnet — either test against a devnet
  token you mint yourself, or demo live against mainnet with a real small SKR balance.

WHAT NOT TO BUILD YET
The paid-subscription path (pay USDC → unlock Plus without SKR) needs persistence
across sessions (a "paid until" date per wallet), which needs a real backend/database
— lower priority than the SKR check, can be a UI stub for the hackathon.

DEVNET/MAINNET LAUNCH PLAN (decided 2026-09-19, not yet built)
Right now the app has a Network switcher in Settings (Devnet/Testnet/Mainnet) —
this is a dev-only testing convenience and must NOT ship to real users: a live
user has no reason to pick Devnet and would just see $0 balances if they did.
Before actually publishing to the dApp Store:
1. Remove the Network switcher from Settings; lock constants/app-config.ts to
   Mainnet only.
2. The free-tier currencies (SOL, USDC, USDT, SKR) currently use devnet-only
   test mints in constants/currencies.ts (SOL is the exception — it's the same
   native asset on every cluster, not a separate mint). USDC/USDT/SKR need to
   be swapped for their real mainnet mint addresses first, verified the same
   way JUP/WIF/BONK/PENGU/the-real-SKR-gate-mint were (CoinGecko platform
   mapping + reading the mint account on-chain to confirm program/decimals/
   freeze authority).
Until then, keep devnet + the switcher for free, repeatable testing — this is
intentionally deferred until closer to actual launch, not needed for the
hackathon demo itself.


═══════════════════════════════════════
3. UI DESIGN SPEC
═══════════════════════════════════════

COLORS
- White (#FFFFFF) — base background for all app screens and the logo itself
- Bright green (#14F195) — active tab / selected state indicator, small accents
- Dark purple (#6B21A8) — primary action buttons (e.g. "Pay with wallet"), headings,
  key text
- Light purple tint (#F7F3FB) — background for secondary-info cards (e.g. split
  amount, share amount)
- Muted gray (~#8A8A8A) — inactive tab icons/labels

LOGO
Two interlocking arrow shapes: a purple (#6B21A8) arrow pointing right, overlapped
by a green (#14F195) arrow pointing left just below it, offset so they interlock
through the middle — represents two parties/flows meeting in a split. Paired with
the "TallySol" wordmark (dark purple, both capital S's). White background only,
everywhere — no colored tile version. See section 5 below for the raw SVG.

LAYOUT PATTERN
- Header: the arrows icon and "TallySol" wordmark sit together as ONE grouped unit
  (icon immediately left of text, small gap), aligned to the left of the screen.
  Never split apart (icon left, text right) — always one lockup, top-left, every page.
- Content cards: rounded corners (~12px), light purple tint (#F7F3FB) background —
  used for line items like "Dinner — $84.00" and "Your share — $21.00".
- Primary button: full-width, dark purple background, white text, rounded (~10px),
  e.g. "Pay with wallet".
- Bottom tab bar: currently 3 tabs (Home, Groups, Profile), built to expand — more
  tabs will be added later. Active tab icon+label in bright green; inactive in
  muted gray.

STYLE NOTES
- Sentence case everywhere ("Pay with wallet", not "Pay With Wallet").
- No gradients or drop shadows — flat design, matching the logo's clean look.


═══════════════════════════════════════
4. NOTIFICATIONS SCOPE
═══════════════════════════════════════

BUILD THESE, IN ORDER

1. DONE (2026-09-19) — In-app pending list. Splits are currently local-only per
   device (AsyncStorage, no backend), so this ended up as the organizer's-eye
   view rather than the original "you owe" framing: features/splits/pending-summary.tsx
   shows "X people still owe you $Y across Z active splits" on the Split tab,
   computed from unpaid members across active splits. Still the safety-net
   reminder the doc wanted, just scoped to what local-only data can support.

2. DEFERRED to post-hackathon-win — Push notification on split creation. Needs
   a real backend (splits aren't synced anywhere right now, only stored locally
   per device), a push-token registry, and a one-time native rebuild for FCM
   credentials. Decided 2026-09-19 to park this: highest infra risk, needs a
   second test device/wallet to verify at all, and isn't required to demo the
   core concept. If revisited: Firestore for split sync + token registry, Expo's
   push API called directly from the client (skip a custom server), deep-link
   via the notification's data payload (pass the split ID).

3. DONE (2026-09-19) — Plus unlock notification. features/plus/plus-unlock-toast.tsx
   watches isPlus flip false→true and shows a local "You've unlocked TallySol
   Plus!" banner for 4s. Fully client-side as the doc anticipated, no backend.

SKIP FOR THE HACKATHON (mention as roadmap in the pitch, don't build)
- Notification back to the creator when a participant pays. Nice polish, not
  essential to prove the concept.
- Reminder/nudge notifications for unpaid splits. Needs a scheduled job — real
  backend complexity judges won't see in a 3-minute demo.


═══════════════════════════════════════
5. LOGO — RAW SVG (canonical version)
═══════════════════════════════════════

<svg width="680" height="340" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" role="img">
  <title>TallySol logo</title>
  <desc>A rounded tile with a white background, two interlocking arrow shapes in purple and green forming a split flow, and the word TallySol below.</desc>
  <rect x="170" y="20" width="340" height="270" rx="30" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
  <polygon points="270,60 350,60 395,105 350,150 270,150 305,105" fill="#6B21A8"/>
  <polygon points="410,150 330,150 285,195 330,240 410,240 375,195" fill="#14F195"/>
  <text x="340" y="278" text-anchor="middle" font-size="26" font-weight="700" fill="#6B21A8" font-family="Arial, sans-serif">TallySol</text>
</svg>

For a compact inline header (icon only, no tile, ~20x26px, sitting immediately left
of the "TallySol" text on one line), use just the two polygon shapes above without
the surrounding rect.
