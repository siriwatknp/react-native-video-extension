![Publish Package](https://github.com/siriwatknp/react-native-video-extension/workflows/Publish%20Package/badge.svg)

# React Native Video (Extension)

> Origin, I need to implement video player for my client but there is no library that works well with our requirement, we used `react-native-video-controls` but it is not support real fullscreen mode
> and orientation works only horizontal, so I spent 2 weeks building this library from real world requirements (of course in my free time), and I hope that it saves a lot of your time as well.

A wrapper library for [react-native-video](https://github.com/react-native-video/react-native-video) that provide great video experience for user.

- support fullscreen mode for both iOS & Android
- auto rotate video
- able to use with react-navigation (see example)
- icon & color configurable
- written in typescript

**Currently, comes with 2 styles**

| Youtube                                                                                                         | Facebook                                                                                                        |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| ![image](https://user-images.githubusercontent.com/18292247/103453363-c7fa9800-4d0b-11eb-9ad0-48a3eb88b0f6.png) | ![image](https://user-images.githubusercontent.com/18292247/103453476-f2992080-4d0c-11eb-9b16-88ebf1c560a0.png) |

## Installation

```bash
yarn install react-native-video react-native-video-extension
```

## Usage

#### Basic

```tsx
import React from 'react';
import { View } from 'react-native';
import { YoutubePlayer } from 'react-native-video-extension';
// import { FacebookPlayer } from "react-native-video-extension";

function Screen() {
  return (
    <View>
      <YoutubePlayer
        mode="auto-fit"
        source={{
          uri: 'https://stream.mux.com/Tyu80069gbkJR2uIYlz2xARq8VOl4dLg3.m3u8',
        }}
      />
    </View>
  );
}
```

> Note: each screen should have only one type of player!

#### ScrollView



#### `react-navigation` v5

## Configure

`props` that you can pass to `FacebookPlayer`, `YoutubePlayer` or other player in the future.

#### `mode`

- required: true

| mode       | description                                                                                                                |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `auto-fit` | When rotate device or enter fullscreen manually, the video will display on the orientation that it fit the device the most |
| `contain`  | In fullscreen, the video will always display the same orientation as user.                                                 |

#### `customIcon`

- type: `ReactElement`
- default: icons from material.io

```tsx
import { Image } from 'react-native';

<YoutubePlayer
  mode="auto-fit"
  source={{
    uri: 'https://stream.mux.com/Tyu80069gbkJR2uIYlz2xARq8VOl4dLg3.m3u8',
  }}
  customIcon={{
    fullscreenIcon: (
      <Image
        src={require('../assets/fullscreen-icon.png')}
        style={{ width: 24, height: 24 }}
      />
    ),
    // exitFullscreenIcon: <SomeIcon />,
    // playIcon,
    // pauseIcon,
    // replayIcon,
    // forwardIcon,
    // refreshIcon,
    // volumeOffIcon,
    // volumeUpIcon,
  }}
/>;
```

#### `initialPaused`

paused video on mount

- type: `boolean`
- default: `false`

#### `initialMuted`

mute video on mount

- type: `boolean`
- default: `false`

#### `aspecRatio`

the ratio of the video when it is not in fullscreen mode

- type: `number | "portrait" | "landscape"`
- default: `"landscape"`

> note: landscape is `16:9`, portrait is 3:4`

## Integration

By default, this extension works without additional libraries, but the experience is not perfect.

#### Lock to Portrait

One thing to improve is to lock the screen to "Portrait" mode before entering fullscreen.

Install `react-native-orientation-locker` ([follow instruction here](https://github.com/wonday/react-native-orientation-locker#installation))

```tsx
// in app.tsx or the file that renders video
// ...other import
import {
  connectOrientationLib,
  YoutubePlayer,
} from 'react-native-video-extension';
import Orientation from 'react-native-orientation-locker';

connectOrientationLib(Orientation);

function Screen() {
  // ... code that render <YoutubePlayer />
}
```

That's it, try to restart the metro & simulator. navigate to the screen and press `⌘ + ←`. The video should enter fullscreen automatically.

#### Provide insets for some devices

Ex, iPhone 11 up has notch & spacing at the top, bottom or left,right. We can improve the experience by rendering the video in safe area.

Install `react-native-safe-area-context` ([follow instruction here](https://github.com/th3rdwave/react-native-safe-area-context#getting-started))

```tsx
// in app.tsx or the file that renders video
// ...other import
import { connectUseInsets, YoutubePlayer } from 'react-native-video-extension';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

connectUseInsets(useSafeAreaInsets);

function Screen() {
  // ... code that render <YoutubePlayer />
}
```

Restart the metro & simulator, you should see the difference like the image below.

| Before                                                                                                          | After                                                                                                           |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| ![image](https://user-images.githubusercontent.com/18292247/103458307-4c174480-4d39-11eb-9e75-77f43024032e.png) | ![image](https://user-images.githubusercontent.com/18292247/103458311-546f7f80-4d39-11eb-8b82-ee9e9e8e82e1.png) |

## Incoming Feature

Take a look at [MVP project board](https://github.com/siriwatknp/react-native-video-extension/projects/1)
