# TV Live

一个基于 **React Native TV** 开发的 IPTV 电视直播播放器。

面向 Android TV / Android TV Emulator 等大屏设备，支持 M3U 播放列表、多直播源自动故障切换、频道切换，以及适合电视遥控器操作的频道选择界面。

## ✨ 功能

- 📺 IPTV 电视直播播放
- 📋 M3U / M3U8 播放列表解析
- 🔀 单个频道支持多个直播源
- ♻️ 直播源自动故障切换
- ⏱️ 直播源加载超时自动切换
- 🔄 所有直播源失败后循环尝试
- ⬆️⬇️ 上下键切换频道
- ⬅️➡️ 左右键切换直播源
- 🎮 TV 遥控器操作
- 📑 双栏频道选择菜单
- 📂 频道分组
- 🎯 打开菜单时自动定位当前频道
- 📡 显示当前使用的串流源
- 📊 显示实时带宽
- 🎬 全屏播放
- 📱 TypeScript 开发

## 🖥️ 运行环境

目前主要针对：

- Android TV
- Android TV Emulator
- 支持 Android TV 的设备

主要技术：

- React Native TV
- React Native
- TypeScript
- react-native-video

## 📦 安装

克隆项目：

```bash
git clone https://github.com/YOUR_USERNAME/tv-live.git
cd tv-live
```

安装依赖：

```bash
npm install
```

或者：

```bash
pnpm install
```

## 🚀 运行

启动 Android TV Emulator，或者连接 Android TV 设备。

检查设备：

```bash
adb devices
```

运行项目：

```bash
npx react-native run-android
```

## 📺 M3U 播放列表

项目使用 M3U 播放列表作为频道数据源。

示例：

```m3u
#EXTM3U

#EXTINF:-1 tvg-id="CCTV1" tvg-name="CCTV-1" group-title="央视",CCTV-1
https://example.com/cctv1.m3u8

#EXTINF:-1 tvg-id="CCTV5" tvg-name="CCTV-5" group-title="央视",CCTV-5
https://example.com/cctv5.m3u8
```

支持解析：

- `tvg-id`
- `tvg-name`
- `tvg-logo`
- `group-title`
- Stream URL

同一个频道存在多个直播源时，会自动合并：

```text
CCTV-1
├── Source 1
├── Source 2
├── Source 3
└── Source 4
```

## 🔄 直播源自动切换

播放器支持一个频道配置多个直播源。

当当前直播源加载失败或者长时间无法加载时，会自动切换到下一个直播源：

```text
Source 1
   ↓
加载失败 / 超时
   ↓
Source 2
   ↓
加载失败 / 超时
   ↓
Source 3
   ↓
播放成功
```

如果所有直播源都失败，则会重新循环：

```text
Source 1
   ↓
Source 2
   ↓
Source 3
   ↓
Source 4
   ↓
Source 1
   ↓
...
```

这样可以避免因为单个直播源失效导致播放器卡死。

## 🎮 遥控器操作

### 播放器

| 按键        | 功能         |
| ----------- | ------------ |
| ↑           | 上一个频道   |
| ↓           | 下一个频道   |
| ←           | 上一个直播源 |
| →           | 下一个直播源 |
| OK / Select | 打开频道菜单 |
| Back        | 关闭频道菜单 |

### 频道菜单

| 按键 | 功能              |
| ---- | ----------------- |
| ↑    | 上移              |
| ↓    | 下移              |
| ←    | 切换到分组        |
| →    | 切换到频道        |
| OK   | 确认              |
| Back | 返回上一级 / 关闭 |

## 📋 频道选择菜单

频道菜单采用双栏设计：

```text
┌──────────────────────────────────────────────┐
│                  选择频道                    │
├──────────────────┬───────────────────────────┤
│ 分组             │ 频道                      │
│                  │                           │
│ ▶ 央视           │   1  CCTV-1               │
│   卫视           │   2  CCTV-2               │
│   体育           │   3  CCTV-5               │
│   新闻           │   4  CCTV-13              │
│                  │                           │
└──────────────────┴───────────────────────────┘
```

打开菜单时，会自动定位到当前正在播放的频道。

支持：

- 分组导航
- 频道导航
- 当前频道定位
- 频道数量显示
- 直播源数量显示

## 📡 直播源信息

播放过程中会显示当前使用的直播源：

```text
当前串流源
源 2 / 5
```

表示当前频道共有 5 个直播源，播放器正在使用第 2 个。

## 📊 带宽监控

播放器支持显示当前视频流的实时带宽。

例如：

```text
2.35 Mbps
```

或者：

```text
856 kbps
```

可以用于观察当前直播流的网络状态。

## 🏗️ 项目结构

```text
App
│
├── AppContent
│   │
│   ├── M3U Channel Loader
│   ├── Channel State
│   ├── TV Remote Handler
│   │
│   └── Channel Drawer
│       ├── Group List
│       └── Channel List
│
└── Player
    │
    ├── Video Player
    ├── Stream Failover
    ├── Stream Timeout
    ├── Bandwidth Monitor
    └── Channel Banner
```

## ⚙️ 播放列表配置

可以在代码中配置 M3U 播放列表地址：

```ts
const SOURCE_URL = 'https://example.com/playlist.m3u';
```

替换为自己的播放列表即可：

```ts
const SOURCE_URL = 'https://example.com/iptv/playlist.m3u';
```

## ⚠️ 免责声明

本项目本身不提供任何电视直播内容，也不维护或分发第三方直播源。

本项目仅用于 IPTV 播放器开发、学习和研究。

请确保你使用的直播源拥有合法的使用权，并遵守当地法律法规以及相关服务条款。

## 🛠️ 开发计划

- [ ] EPG 节目单
- [ ] XMLTV 支持
- [ ] 收藏频道
- [ ] 播放源测速
- [ ] 播放源质量评分
- [ ] 自动选择最佳直播源
- [ ] 设置页面
- [ ] 播放历史

## 🤝 Contributing

欢迎提交 Issue、Pull Request 或功能建议。

如果发现 Bug，请尽量提供：

1. Bug 描述
2. Android / Android TV 版本
3. 设备型号或 Emulator 配置
4. React Native TV 版本
5. 相关日志

## 📄 License

本项目使用 MIT License。详见 [LICENSE](LICENSE)。
