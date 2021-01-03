![Publish Package](https://github.com/siriwatknp/react-native-video-extension/workflows/Publish%20Package/badge.svg)
![NPM](https://img.shields.io/npm/l/react-native-video-extension)

# React Native Video (Extension)

A wrapper library for [react-native-video](https://github.com/react-native-video/react-native-video) that provide great video experience for user.

- support fullscreen mode for both iOS & Android
- auto rotate video
- lightweight
- able to use with react-navigation (see example)
- icon & color configurable
- written in typescript
- works with Mux

**Currently, comes with 2 styles**

| Youtube                                                                                                         | Facebook                                                                                                        |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| ![image](https://user-images.githubusercontent.com/18292247/103453363-c7fa9800-4d0b-11eb-9ad0-48a3eb88b0f6.png) | ![image](https://user-images.githubusercontent.com/18292247/103453476-f2992080-4d0c-11eb-9b16-88ebf1c560a0.png) |

## Installation

```bash
yarn install react-native-video react-native-video-extension
```

## Usage

### Basic

```tsx
import React from 'react';
import { View } from 'react-native';
import { YoutubePlayer } from 'react-native-video-extension';
// or use facebook player style
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

See the [full code](/src/examples/BasicExample.tsx)

> Note: each screen should have only one type of player!

### More examples

- [SafeArea](/src/examples/SafeAreaExample.tsx)
- [ScrollView](/src/examples/ScrollViewExample.tsx)
- [FlatList](/src/examples/FlatListExample.tsx)
- [StackNavigation](/src/examples/StackNavigationExample.tsx)
- [MuxData](/src/examples/MuxDataExample.tsx)

## API

### YoutubePlayer, FacebookPlayer

|   PropName    | type                               | required |    default     | description                                                                                                                                                                                                                                 |
| :-----------: | ---------------------------------- | :------: | :------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     mode      | "auto-fit" \| "contain"            |    ✅    |                | `auto-fit` : When rotate device or enter fullscreen manually, the video will display on the orientation that it fit the device the most <br /><br /> `contain` : In fullscreen, the video will always display the same orientation as user. |
| initialPaused | boolean                            |          |    `false`     | pause video on mount                                                                                                                                                                                                                        |
| initialMuted  | boolean                            |          |    `false`     | mute video on mount                                                                                                                                                                                                                         |
|  aspecRatio   | number \| "portrait" \| "landscape |          |   `portrait`   | the ratio of the video when it is not in fullscreen mode <br /><br /> note: landscape is `16:9`, portrait is `3:4`                                                                                                                          |
|  customIcon   | object                             |          | material icons | override default icon                                                                                                                                                                                                                       |
|  renderToolbar   | (fullscreen) => ReactNode       |          |                | render something at the top (inside video), such as Title, Share button, More action                                                                                                                                                                                                                       |

**customIcon example**

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
        src={require('../your-assets/fullscreen-icon.png')}
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

### ScreenContainer

React Context that provide state of the video, useful when you want to do some fancy thing.
In this example, we need to disable scroll gesture in ScrollView while we are in fullscreen mode or dragging the thumb in the seeker.

```tsx
import { ScreenContainer, FacebookPlayer } from 'react-native-video-extension';

function App() {
  return (
    <ScreenContainer>
      {({ fullscreen, seeking }) => {
        return (
          <SafeAreaView
            style={{ flex: 1, backgroundColor: fullscreen ? '#000' : '#fff' }}
          >
            <ScrollView
              scrollEnabled={!fullscreen && !seeking}
              style={{ flex: 1 }}
              contentContainerStyle={{ flex: fullscreen ? 1 : 0 }}
            >
              {/* some header goes here */}
              <FacebookPlayer
                source={{
                  uri:
                    'https://stream.mux.com/Tyu80069gbkJR2uIYlz2xARq8VOl4dLg3.m3u8',
                }}
                mode="contain"
              />
              {/* some content goes here */}
            </ScrollView>
          </SafeAreaView>
        );
      }}
    </ScreenContainer>
  );
}
```

| name          | value                                                        | description                                                                    |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| fullscreen    | false \| "PORTRAIT" \| "LANDSCAPE-LEFT" \| "LANDSCAPE-RIGHT" | if not `false`, it provide the device orientation while in fullscreen mode     |
| seeking       | boolean                                                      | whether the thumb in seeker is dragging or not                                 |
| loading       | boolean                                                      | if `true`, video is not ready to play                                          |
| consoleHidden | boolean                                                      | if `true`, the controls is displaying (ex, play, forward, replay, seeker, ...) |
| isLandscape   | boolean                                                      | if `true`, the loaded video has naturalSize = "landscape"                      |

If you want to hook into the context in other component, use `useVideoCtx` like this.

```tsx
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useVideoCtx } from 'react-native-video-extension';

// This component must be rendered inside ScreenContainer only!
function Awesome() {
  const { fullscreen } = useVideoCtx();
  useEffect(() => {
    if (fullscreen) {
      // Logger.send('fullscreen', 'uid)
      // just an example, I have no idea what I just wrote
    }
  }, [fullscreen]);
  return (
    <View>
      <Text>{fullscreen ? 'Wow' : ''}</Text>
    </View>
  );
}
```

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
