import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  PanResponderGestureState,
  useWindowDimensions,
} from 'react-native';
import Video from 'react-native-video';
import useSeekerStyles from './useSeekerStyles';
import { toTimeView, getSecondsToSeek, getThumbPosition } from './utils';
import { useVideoCtx } from './ScreenContainer';
import { useOpacity, useScaleSpring } from './animation';
import { OrientationLocker } from './LayoutCalc';

export type SeekerProps = {
  currentTime: number;
  duration: number;
  bufferTime: number;
  vertical: boolean;
  videoInstance?: Video;
  isLandscapeVideo: boolean;
};

const Seeker = ({
  currentTime,
  duration,
  bufferTime,
  videoInstance,
  vertical,
  isLandscapeVideo,
}: SeekerProps) => {
  const styles = useSeekerStyles();
  const {
    fullscreen,
    seeking,
    setSeeking,
    paused,
    setPaused,
    consoleHidden,
    config,
  } = useVideoCtx();
  const windowSize = useWindowDimensions();
  const timeOpacity = useOpacity(consoleHidden);
  const barOpacity = useOpacity(consoleHidden && !!fullscreen);
  const scaleAnim = useScaleSpring(consoleHidden);
  const [seekerWidth, setSeekerWidth] = useState(0);
  const position = getThumbPosition(
    duration,
    currentTime,
    seekerWidth,
    config.thumbRadius,
  );
  const bufferPosition = getThumbPosition(
    duration,
    bufferTime,
    seekerWidth,
    config.thumbRadius,
  );

  const pan = useRef(new Animated.Value(position)).current;
  useEffect(() => {
    if (!seeking) {
      pan.setValue(position);
    }
  }, [position]);
  let seekerRef = useRef({
    position,
    duration,
    currentTime,
    seekerWidth,
    videoInstance,
    vertical,
    fullscreen,
    paused,
    pausedOnRelease: false,
    isLandscapeDevice: false,
    isLandscapeVideo,
  }).current;
  seekerRef.videoInstance = videoInstance;
  seekerRef.duration = duration;
  seekerRef.seekerWidth = seekerWidth;
  seekerRef.vertical = vertical;
  seekerRef.fullscreen = fullscreen;
  seekerRef.paused = paused;
  seekerRef.position = position;
  seekerRef.isLandscapeDevice = windowSize.width > windowSize.height;
  seekerRef.isLandscapeVideo = isLandscapeVideo;
  if (!seeking) {
    seekerRef.currentTime = currentTime;
  }
  const handleSeek = (gestureState: PanResponderGestureState) => {
    const seconds = getSecondsToSeek(
      seekerRef.duration,
      seekerRef.currentTime,
      seekerRef.seekerWidth,
      getDiff(gestureState),
      8,
    );
    if (seekerRef.videoInstance) {
      seekerRef.videoInstance.seek(seconds);
    }
  };
  function getDiff(gestureState: PanResponderGestureState) {
    if (OrientationLocker.isPortraitLocked) {
      return seekerRef.vertical ? gestureState.dy : gestureState.dx;
    }
    if (!seekerRef.fullscreen) {
      return gestureState.dx;
    }
    if (seekerRef.isLandscapeDevice) {
      return seekerRef.isLandscapeVideo ? gestureState.dx : gestureState.dy;
    }
    return seekerRef.isLandscapeVideo ? gestureState.dy : gestureState.dx;
  }
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setSeeking(true);
        setPaused(true);
        seekerRef.pausedOnRelease = seekerRef.paused;
      },
      onPanResponderMove: (e, gestureState) => {
        pan.setValue(seekerRef.position + getDiff(gestureState));
      },
      onPanResponderRelease: (e, gestureState) => {
        handleSeek(gestureState);
        setPaused(seekerRef.pausedOnRelease);
      },
    }),
  ).current;
  return (
    <>
      <Animated.View
        style={StyleSheet.flatten([
          styles.seekbarContainer,
          { opacity: barOpacity },
        ])}
        onLayout={(e) => {
          setSeekerWidth(e.nativeEvent.layout.width);
        }}
      >
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
        <View
          style={StyleSheet.flatten([
            styles.seekbarBuffer,
            {
              width: bufferPosition,
            },
          ])}
        />
      </Animated.View>
      <View style={styles.seekerThumbWrapper}>
        <Animated.View
          style={{
            ...styles.seekerThumbRing,
            ...(seeking && styles.seekerThumbRingTouched),
            transform: [{ translateX: seeking ? pan : position }],
          }}
          {...panResponder.panHandlers}
        >
          <Animated.View
            style={{
              ...styles.seekbarThumb,
              ...(seeking && styles.seekbarThumbTouched),
              transform: [{ scale: scaleAnim }],
            }}
          />
        </Animated.View>
      </View>
    </>
  );
};

export default Seeker;
