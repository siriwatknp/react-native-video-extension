import React, { useState } from 'react';
import { StyleSheet, View, ViewProps, useWindowDimensions } from 'react-native';
import Video, { VideoProperties } from 'react-native-video';

export interface VideoPlayerProps extends VideoProperties {
  style?: ViewProps['style'];
  videoStyle?: VideoProperties['style'];
}

const VideoPlayer = ({ style, videoStyle, ...props }: VideoPlayerProps) => {
  const { width, height } = useWindowDimensions();
  const [fullscreen, setFullscreen] = useState(false);
  const fullscreenStyle = {
    view: {
      position: 'absolute' as const,
      width: height,
      height: width,
      top: 0,
      left: 0,
      transform: [
        { translateY: (height - width) / 2 },
        { translateX: -(height - width) / 2 },
        { rotate: '90deg' },
      ],
    },
    video: StyleSheet.absoluteFill,
  };
  return (
    <View style={[fullscreen ? fullscreenStyle.view : styles.container, style]}>
      <Video
        style={[fullscreen ? fullscreenStyle.video : styles.video, videoStyle]}
        {...props}
      />
    </View>
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
});

export default VideoPlayer;
