# Apex Insurance — Web Frontend

One app at **http://localhost:4200**. The sidebar is a single product menu (Dashboard, Submissions, Policies, …). You should not see “classic” vs “modern” labels — that split is only under the hood for the .NET migration demo.

## Run

```bash
# API (separate terminal)
dotnet run --project ../src/ApexInsurance.Api

# UI — Node 12 required to build Angular 8 screens
nvm use 12
cd web
npm run build:ng8   # once, or after changing apex-ng8
npm start           # → :4200
```

Open **http://localhost:4200/#!/login**. Use a **Demo roles** button (all passwords `Password1!`), or add personas in [`apex-shell/config.js`](apex-shell/config.js) `demoAccounts`.

**Underwriting path:** Submissions → **+ New submission** → Quotes tab → **Create quote** → **Select** → **Bind** (or use Case Hub for the same quote/bind flow).

## Config

- Shell: [`apex-shell/config.js`](apex-shell/config.js) — `demoAccounts` list
- Ng8: [`apex-ng8/src/environments/environment.ts`](apex-ng8/src/environments/environment.ts) — keep `demoAccounts` in sync
