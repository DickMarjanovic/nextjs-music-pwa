# NextJS Music Tools PWA

Features:
- Tempo detection (high precision) using Web Audio API
- Metronome (Tone.js) with performance mode (silent after 8 bars)
- Song library with local persistence and cloud sync placeholder

Run locally:

```bash
cd nextjs-music-pwa
npm install
npm run dev
```

Configure cloud sync in `/src/services/syncService.ts` using Firebase Firestore.

Quick setup (Firebase):

1. Create a Firebase project and enable Firestore.
2. Add a Web app and copy the SDK config.
3. In your app (for example in `app/layout.tsx` on first user interaction) call:

```ts
import { initCloudSync } from './src/services/syncService'
initCloudSync({
	apiKey: 'YOUR_API_KEY',
	authDomain: 'YOUR_AUTH_DOMAIN',
	projectId: 'YOUR_PROJECT_ID',
})
```

Songs will be synced to the `songs` collection. Implement authentication and security rules in Firebase as needed.
