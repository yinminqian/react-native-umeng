# @minqian/react-native-umeng

面向 Expo / React Native 的友盟统计（统计上报）轻量封装。

- **同时支持 Android 与 iOS**，两端 API 完全一致，少量行为差异见下文。
- **Android 延迟 / 两段式初始化**，符合国内隐私合规要求；iOS 端 `preInit` 为 no-op。
- **自动会话跟踪**，基于 Expo 的 Activity 生命周期钩子实现（Android）。
- **内置 Expo Config Plugin**：Android 自动注入 `UMENG_APPKEY`、`UMENG_CHANNEL` 元数据及阿里云 Maven 镜像；iOS 自动为模拟器排除 `arm64` 架构以兼容老版本 Umeng framework。

## 安装

```
npm i file:../react-native-umeng    # 在你的 Expo 项目中执行
```

`app.json` 配置：

```json
{
  "expo": {
    "plugins": [
      ["@minqian/react-native-umeng", { "appKey": "<你的友盟 App Key>", "channel": "Umeng" }]
    ]
  }
}
```

然后执行 `npx expo prebuild --clean`，再按平台运行：

```
npx expo run:android
npx expo run:ios
```

## 使用

```ts
import Umeng from '@minqian/react-native-umeng';

// App 启动后即可调用（在用户同意隐私政策前也安全）。
Umeng.preInit('<appKey>', 'Umeng');

// 用户同意隐私政策之后再调用：
Umeng.init('<appKey>', 'Umeng', { logEnabled: __DEV__ });

// 上报自定义事件。
Umeng.onEvent('home_open', { source: 'tab' });

// 用户画像（可选）。
Umeng.onProfileSignIn('user-123');
Umeng.onProfileSignOff();
```

## API

| 方法 | 说明 |
|------|------|
| `setLogEnabled(enabled)` | 开关友盟 SDK 详细日志 |
| `preInit(appKey, channel?)` | 预初始化，不上报数据 |
| `init(appKey, channel?, options?)` | 正式初始化 |
| `isInitialized()` | 同步获取初始化状态 |
| `onEvent(eventId, properties?)` | 自定义事件上报 |
| `onProfileSignIn(userId, provider?)` | 标记当前会话的用户 |
| `onProfileSignOff()` | 清除用户标记 |
| `onPageStart(name)` / `onPageEnd(name)` | 手动页面统计 |
| `reportError(message)` | 自定义错误上报 |

会话生命周期（`onResume` / `onPause`）在 Android 上由 Expo Module 内部的 `OnActivityEntersForeground/Background` 钩子自动驱动，因此**无需**像旧版 SDK 文档建议的那样去重写 `MainActivity`。iOS 端由友盟 SDK 自身处理。

## 平台差异

| 行为 | Android | iOS |
|------|---------|-----|
| `preInit` | 真正的预初始化，仅做合规准备，不上报 | no-op（友盟 iOS SDK 没有两段式初始化） |
| `init` | 调用 `UMConfigure.init` | 调用 `UMConfigure setAppKey:channel:` |
| `reportError` | 调用 `MobclickAgent.reportError` | UMCAnalytics 6.0 无官方错误 API，退化为自定义事件 `rn_reported_error` |
| 模拟器架构 | 不涉及 | Config Plugin 自动在 pbxproj 中为 Debug 配置排除 `arm64`，以兼容老版 Umeng framework |

## 许可证

MIT
