import React from 'react';
import { Animated, View, ViewProps, TouchableOpacity } from 'react-native';
import Video, { VideoProperties } from 'react-native-video';
import { useVideoCtx } from './ScreenContainer';
import { useStyles } from './useStyles';
import { SvgFullscreen, SvgExitFullscreen } from '../src/icons';

export interface VideoPlayerProps extends VideoProperties {
  style?: ViewProps['style'];
  videoStyle?: VideoProperties['style'];
}

// View Hierarchy
// |- Container
//    |- Controller
//    |  |- RNVideo
//    |- BgOverlay

const VideoPlayer = ({ style, videoStyle, ...props }: VideoPlayerProps) => {
  const { fullscreen, enterFullscreen, exitFullscreen } = useVideoCtx();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Animated.View style={styles.controller}>
        <Video style={styles.video} {...props} controls={false} />
        <TouchableOpacity
          style={styles.fullscreenToggle}
          onPress={fullscreen ? exitFullscreen : enterFullscreen}
        >
          {fullscreen ? (
            <SvgExitFullscreen color={'#fff'} />
          ) : (
            <SvgFullscreen color={'#fff'} />
          )}
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.bgOverlay} />
    </View>
  );
};

export default VideoPlayer;
