# Clone project

-   copy https link this project
-   git clone `https://github.com/SOA-Player-Dual/soa_banking_ui.git`
-   cd `soa_banking_ui`

# Environment

-   Node: v18.8.0
-   npm: 8.19.3

# Run

-   `npm install`
-   `npm start` (please waiting for a minutes for run server on some local, eg: windowOS - WLS2)
-   Run on localhost: 3000 (by https: `https://localhost:3000/`)

# Project manual

-   Browser: Chorme (https work best on Chorme, encourage don't try another browser because cookie unable set on browser (like safari))
-   You need access https on your local by step:
    -   Access `https://13.215.191.9/`
    -   Click advance button on warning screen
    -   Click `Process to https://13.215.191.9(unsafe)`
    -   Try to run project again

# Issue

```diff
- Unable to resolve dependency tree error when installing npm packages
```

-   Description error: Perhaps `resolve dependency` will be happen on another local.
-   Fix: npm install --force
-   Or: npm install --legacy-peer-deps
