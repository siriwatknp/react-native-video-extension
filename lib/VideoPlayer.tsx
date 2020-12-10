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
import Overlay from "./Overlay";
import { useStyles } from './useStyles';
import {
  SvgFullscreen,
  SvgExitFullscreen,
  SvgPlayArrow,
  SvgPause,
  SvgReplay10,
  SvgForward10,
  SvgRefresh,
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
  let videoInstance = useRef<Video>();
  const [ended, setEnded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [bufferTime, setBufferTime] = useState(0);
  const {
    fullscreen,
    enterFullscreen,
    exitFullscreen,
    paused,
    setPaused,
    setSeeking,
  } = useVideoCtx();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Animated.View style={styles.controller}>
        <Video
          style={styles.video}
          {...props}
          ref={(videoRef) => {
            if (videoRef) {
              videoInstance.current = videoRef;
            }
          }}
          onEnd={() => {
            setEnded(true)
          }}
          onLoad={(data) => {
            setEnded(false)
            setDuration(data.duration);
          }}
          onProgress={(data) => {
            setCurrentTime(data.currentTime);
            setBufferTime(data.playableDuration);
          }}
          onSeek={(data) => {
            setCurrentTime(data.currentTime);
            setSeeking(false);
          }}
          paused={paused}
          controls={false}
        />
        <Overlay>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => {
                videoInstance.current?.seek(
                  currentTime - 10 < 0 ? 0.1 : currentTime - 10,
                );
              }}
            >
              <SvgReplay10 />
            </TouchableOpacity>
            {ended ? (
              <TouchableOpacity
                onPress={() => {
                  videoInstance.current?.seek(0)
                  setEnded(false)
                }}
                style={styles.play}
              >
                <SvgRefresh />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.play}
                onPress={() => setPaused((bool) => !bool)}
              >
                {paused ? <SvgPlayArrow /> : <SvgPause />}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => {
                videoInstance.current?.seek(
                  currentTime + 10 > duration
                    ? duration - 0.1
                    : currentTime + 10,
                );
              }}
            >
              <SvgForward10 />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.fullscreenToggle}
            onPress={fullscreen ? exitFullscreen : enterFullscreen}
          >
            {fullscreen ? <SvgExitFullscreen /> : <SvgFullscreen />}
          </TouchableOpacity>
        </Overlay>
        <Seeker
          videoInstance={videoInstance.current}
          duration={duration}
          currentTime={currentTime}
          bufferTime={bufferTime}
          vertical={fullscreen}
        />
      </Animated.View>
      <View style={styles.playerBg} />
    </View>
  );
};

export default VideoPlayer;
