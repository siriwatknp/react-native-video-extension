import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  PanResponder,
  PanResponderGestureState,
} from 'react-native';
import Video from 'react-native-video';
import { useStyles } from './useStyles';
import { toTimeView, getSecondsToSeek } from './utils';
import { useVideoCtx } from './ScreenContainer';

export type SeekerProps = {
  currentTime: number;
  duration: number;
  videoInstance?: Video;
};

const Seeker = ({
  currentTime,
  duration,
  videoInstance,
}: SeekerProps) => {
  const styles = useStyles();
  const { fullscreen, seeking, setSeeking, setPaused } = useVideoCtx();
  const [seekerWidth, setSeekerWidth] = useState(0);
  let seekerRef = useRef({
    duration,
    currentTime,
    seekerWidth,
    videoInstance,
    vertical: fullscreen,
  }).current;
  seekerRef.videoInstance = videoInstance;
  seekerRef.duration = duration;
  seekerRef.seekerWidth = seekerWidth;
  seekerRef.vertical = fullscreen;
  if (!seeking) {
    seekerRef.currentTime = currentTime;
  }
  const handleSeek = (gestureState: PanResponderGestureState) => {
    const seconds = getSecondsToSeek(
      seekerRef.duration,
      seekerRef.currentTime,
      seekerRef.seekerWidth,
      seekerRef.vertical ? gestureState.dy : gestureState.dx,
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
      },
      onPanResponderMove: (e, gestureState) => {
        handleSeek(gestureState);
      },
      onPanResponderRelease: () => {
        setSeeking(false);
        setPaused(false);
      },
    }),
  ).current;
  return (
    <View
      style={styles.seekbarBg}
      onLayout={(e) => {
        setSeekerWidth(e.nativeEvent.layout.width);
      }}
    >
      <View
        style={{
          ...styles.seekbarThumb,
          ...(seeking && styles.seekbarThumbTouched),
          left: `${(currentTime * 100) / duration}%`,
        }}
        {...panResponder.panHandlers}
      />
      <View style={styles.seekbarTime}>
        <Text style={styles.time}>{toTimeView(currentTime)}</Text>
        <Text
          style={StyleSheet.flatten([
            styles.time,
            { color: '#c4c4c4', marginLeft: 5 },
          ])}
        >
          / {toTimeView(duration)}
        </Text>
      </View>
      <View
        style={StyleSheet.flatten([
          styles.seekbarProgress,
          {
            width: `${(currentTime * 100) / duration}%`,
          },
        ])}
      />
    </View>
  );
};

export default Seeker;
