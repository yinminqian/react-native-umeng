# @minqian/react-native-umeng

Minimal Umeng analytics (统计上报) wrapper for Expo / React Native.

- **Android only** — iOS calls are no-ops.
- **Lazy / two-stage init** to comply with China privacy-policy rules.
- **Automatic session tracking** via Expo's activity-lifecycle hooks.
- **Built-in Expo config plugin** that injects `UMENG_APPKEY`, `UMENG_CHANNEL`
  meta-data and the aliyun Maven mirror.

## Install

```
npm i file:../react-native-umeng    # from your Expo project
```

`app.json`:

```json
{
  "expo": {
    "plugins": [
      ["@minqian/react-native-umeng", { "appKey": "<your umeng app key>", "channel": "Umeng" }]
    ]
  }
}
```

Then `npx expo prebuild --clean` + `npx expo run:android`.

## Usage

```ts
import Umeng from '@minqian/react-native-umeng';

// Call as soon as the app boots (safe pre-consent).
Umeng.preInit('<appKey>', 'Umeng');

// Once the user accepts the privacy policy:
Umeng.init('<appKey>', 'Umeng', { logEnabled: __DEV__ });

// Track an event.
Umeng.onEvent('home_open', { source: 'tab' });

// Profile (optional).
Umeng.onProfileSignIn('user-123');
Umeng.onProfileSignOff();
```

## API

| Function | Notes |
|----------|-------|
| `setLogEnabled(enabled)` | Toggle Umeng SDK verbose log |
| `preInit(appKey, channel?)` | Pre-init, no upload |
| `init(appKey, channel?, options?)` | Full init |
| `isInitialized()` | Sync getter |
| `onEvent(eventId, properties?)` | Custom event |
| `onProfileSignIn(userId, provider?)` | Tag session with user |
| `onProfileSignOff()` | Drop user tag |
| `onPageStart(name)` / `onPageEnd(name)` | Manual page tracking |
| `reportError(message)` | Custom error |

Session lifecycle (`onResume`/`onPause`) is driven automatically by an
`OnActivityEntersForeground/Background` hook inside the Expo Module, so you
do not need to override `MainActivity` like the legacy SDK guide suggests.

## License

MIT
