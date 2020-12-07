import React, { useRef, useState } from 'react';
import {
  Animated,
  View,
  ViewProps,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Video, { VideoProperties } from 'react-native-video';
import { useVideoCtx } from './ScreenContainer';
import Seeker from './Seeker';
import { useStyles } from './useStyles';
import {
  SvgFullscreen,
  SvgExitFullscreen,
  SvgPlayArrow,
  SvgPause,
} from '../src/icons';

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
  const videoInstance = useRef(Video).current;
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [paused, setPaused] = useState(props.paused);
  const { fullscreen, enterFullscreen, exitFullscreen } = useVideoCtx();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Animated.View style={styles.controller}>
        <Video
          style={styles.video}
          {...props}
          onLoad={({ currentTime, duration }) => {
            setDuration(duration);
          }}
          onProgress={({ currentTime }) => {
            setCurrentTime(currentTime);
          }}
          paused={paused}
          controls={false}
        />
        <TouchableOpacity
          style={styles.play}
          onPress={() => setPaused((bool) => !bool)}
        >
          {paused ? (
            <SvgPlayArrow color={'#fff'} />
          ) : (
            <SvgPause color={'#fff'} />
          )}
        </TouchableOpacity>
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
        <Seeker duration={duration} currentTime={currentTime} />
      </Animated.View>
      <View style={styles.bgOverlay} />
    </View>
  );
};

export default VideoPlayer;
