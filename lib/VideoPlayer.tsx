import React, { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  ViewProps,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import Video, { VideoProperties } from 'react-native-video';
import { useVideoCtx } from './ScreenContainer';
import { SvgFullscreen, SvgExitFullscreen } from '../src/icons';

export interface VideoPlayerProps extends VideoProperties {
  style?: ViewProps['style'];
  videoStyle?: VideoProperties['style'];
}

const VideoPlayer = ({ style, videoStyle, ...props }: VideoPlayerProps) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { fullscreen, enterFullscreen, exitFullscreen } = useVideoCtx();

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: fullscreen ? 90 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [rotateAnim, fullscreen]);
  const { width, height } = useWindowDimensions();
  const fullscreenStyle = {
    view: {
      position: 'absolute' as const,
      zIndex: 1000000,
      width: height,
      height: width,
      top: 0,
      left: 0,
      backgroundColor: '#000',
      transform: [
        { translateY: (height - width) / 2 },
        { translateX: -(height - width) / 2 },
        {
          rotate: rotateAnim.interpolate({
            inputRange: [0, 90],
            outputRange: ['0deg', '90deg'],
          }),
        },
      ],
    },
    video: {
      width: '100%',
      height: '100%',
    },
  };
  return (
    <>
      <Animated.View
        style={[fullscreen ? fullscreenStyle.view : styles.container, style]}
      >
        <Video
          style={[
            fullscreen ? fullscreenStyle.video : styles.video,
            videoStyle,
          ]}
          {...props}
          controls={false}
        />
        <TouchableOpacity
          style={styles.fullscreen}
          onPress={fullscreen ? exitFullscreen : enterFullscreen}
        >
          {fullscreen ? (
            <SvgExitFullscreen color={'#fff'} />
          ) : (
            <SvgFullscreen color={'#fff'} />
          )}
        </TouchableOpacity>
      </Animated.View>
      <View
        style={[
          { backgroundColor: '#000' },
          fullscreen
            ? {
                width: height,
                height: width,
                zIndex: 100000,
                position: 'absolute' as const,
                top: 0,
                left: 0,
                transform: [
                  { translateY: (height - width) / 2 },
                  { translateX: -(height - width) / 2 },
                  {
                    rotate: '90deg',
                  },
                ],
              }
            : styles.hiddenDummy,
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  video: {
    height: undefined,
    aspectRatio: 16 / 9,
    maxWidth: '100%',
  },
  fullscreen: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    padding: 8,
  },
  hiddenDummy: {
    overflow: 'hidden',
    height: 0,
    flex: 0,
  },
});

export default VideoPlayer;
