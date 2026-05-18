# @minqian/react-native-umeng

面向 Expo / React Native 的友盟统计（统计上报）轻量封装。

- **仅支持 Android** —— iOS 端调用为空实现（no-op）。
- **延迟 / 两段式初始化**，符合国内隐私合规要求。
- **自动会话跟踪**，基于 Expo 的 Activity 生命周期钩子实现。
- **内置 Expo Config Plugin**，自动注入 `UMENG_APPKEY`、`UMENG_CHANNEL` 元数据以及阿里云 Maven 镜像。

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

然后执行 `npx expo prebuild --clean` 和 `npx expo run:android`。

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

会话生命周期（`onResume` / `onPause`）由 Expo Module 内部的 `OnActivityEntersForeground/Background` 钩子自动驱动，因此**无需**像旧版 SDK 文档建议的那样去重写 `MainActivity`。

## 许可证

MIT
