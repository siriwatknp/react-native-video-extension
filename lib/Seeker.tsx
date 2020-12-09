import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  PanResponderGestureState,
} from 'react-native';
import Video from 'react-native-video';
import { useStyles } from './useStyles';
import { toTimeView, getSecondsToSeek, getThumbPosition } from './utils';
import { useVideoCtx } from './ScreenContainer';
import { useOpacity, useScaleSpring } from './animation';

export type SeekerProps = {
  currentTime: number;
  duration: number;
  videoInstance?: Video;
};

const Seeker = ({ currentTime, duration, videoInstance }: SeekerProps) => {
  const styles = useStyles();
  const {
    fullscreen,
    seeking,
    setSeeking,
    paused,
    setPaused,
    consoleHidden,
  } = useVideoCtx();
  const timeOpacity = useOpacity(consoleHidden);
  const barOpacity = useOpacity(consoleHidden && fullscreen);
  const scaleAnim = useScaleSpring(consoleHidden);
  const [seekerWidth, setSeekerWidth] = useState(0);
  let seekerRef = useRef({
    duration,
    currentTime,
    seekerWidth,
    videoInstance,
    vertical: fullscreen,
    paused,
    pausedOnRelease: false,
  }).current;
  seekerRef.videoInstance = videoInstance;
  seekerRef.duration = duration;
  seekerRef.seekerWidth = seekerWidth;
  seekerRef.vertical = fullscreen;
  seekerRef.paused = paused;
  if (!seeking) {
    seekerRef.currentTime = currentTime;
  }
  const handleSeek = (gestureState: PanResponderGestureState) => {
    const seconds = getSecondsToSeek(
      seekerRef.duration,
      seekerRef.currentTime,
      seekerRef.seekerWidth,
      seekerRef.vertical ? gestureState.dy : gestureState.dx,
      8,
    );
    if (seekerRef.videoInstance) {
      seekerRef.videoInstance.seek(seconds);
    }
  };
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        setSeeking(true);
        setPaused(true);
        seekerRef.pausedOnRelease = seekerRef.paused;
      },
      onPanResponderMove: (e, gestureState) => {
        handleSeek(gestureState);
      },
      onPanResponderRelease: () => {
        setSeeking(false);
        setPaused(seekerRef.pausedOnRelease);
      },
    }),
  ).current;
  const position = getThumbPosition(duration, currentTime, seekerWidth, 8);
  return (
    <Animated.View
      style={StyleSheet.flatten([
        styles.seekbarBg,
        { opacity: barOpacity }
      ])}
      onLayout={(e) => {
        setSeekerWidth(e.nativeEvent.layout.width);
      }}
    >
      <Animated.View
        style={{
          ...styles.seekbarThumb,
          ...(seeking && styles.seekbarThumbTouched),
          left: position,
          transform: [
            ...(seeking
              ? styles.seekbarThumbTouched.transform
              : styles.seekbarThumb.transform),
            { scale: scaleAnim },
          ],
        }}
        {...panResponder.panHandlers}
      />
      <Animated.View
        style={StyleSheet.flatten([
          styles.seekbarTime,
          { opacity: timeOpacity },
        ])}
      >
        <Text style={styles.time}>{toTimeView(currentTime)}</Text>
        <Text
          style={StyleSheet.flatten([
            styles.time,
            { color: '#c4c4c4', marginLeft: 5 },
          ])}
        >
          / {toTimeView(duration)}
        </Text>
      </Animated.View>
      <View
        style={StyleSheet.flatten([
          styles.seekbarProgress,
          {
            width: position,
          },
        ])}
      />
    </Animated.View>
  );
};

export default Seeker;
