import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  View,
} from 'react-native';

export type SeekerProps = {
  filledColor?: string;
  buttonColor?: string;
  progress?: number;
  buffer?: number;
  onSeek?: (data: {
    eventName: 'GRANT' | 'MOVE' | 'RELEASE';
    x: number;
    width: number;
    ratio: number;
  }) => void;
};

const DEFAULT_COLOR = '#ff2525';
const THUMB_SIZE = 40;
const BAR_HEIGHT = 2;
const INITIAL_BUTTON_SIZE = 16;
const TOUCHED_BUTTON_SIZE = 24;
const bundleData = (totalWidth: number, x: number) => ({
  x,
  width: totalWidth,
  ratio: x / totalWidth,
});
const Seeker = ({
  filledColor = DEFAULT_COLOR,
  buttonColor = DEFAULT_COLOR,
  progress = 0, // in ratio
  buffer = 0,
  onSeek,
}: SeekerProps) => {
  const [seeking, setSeeking] = useState(false);
  const [seekerWidth, setSeekerWidth] = useState(0);
  console.log('seekerWidth', seekerWidth);
  const offset = INITIAL_BUTTON_SIZE / 2;
  const totalWidth = Math.abs(seekerWidth - offset * 2);
  const currentPosition = progress * totalWidth + offset
  const position = useRef({
    x: currentPosition,
    animated: new Animated.Value(currentPosition),
  }).current;
  const seekerRef = useRef<any>({}).current;
  useEffect(() => {
    position.x = currentPosition;
    position.animated.setValue(currentPosition);
  }, [currentPosition]);
  seekerRef.onGrant = function (event: GestureResponderEvent) {
    const { locationX } = event.nativeEvent;
    setSeeking(true);
    position.x = locationX;
    position.animated.setValue(locationX);
    onSeek?.({
      eventName: 'GRANT',
      ...bundleData(totalWidth, position.x),
    });
  };
  seekerRef.onMove = function (
    event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) {
    const result = position.x + gestureState.dx;
    if (result >= offset && result <= seekerWidth - offset) {
      position.animated.setValue(result);
      onSeek?.({ eventName: 'MOVE', ...bundleData(totalWidth, result) });
    }
  };
  seekerRef.onRelease = function (gestureState: PanResponderGestureState) {
    position.x = position.x + gestureState.dx;
    onSeek?.({ eventName: 'RELEASE', ...bundleData(totalWidth, position.x) });
    setSeeking(false);
  };
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        seekerRef.onGrant(event);
      },
      onPanResponderMove: (event, gestureState) => {
        seekerRef.onMove(event, gestureState);
      },
      onPanResponderRelease: (e, gestureState) => {
        seekerRef.onRelease(gestureState);
      },
    }),
  ).current;
  return (
    <View
      testID="seeker_container"
      pointerEvents="box-only"
      style={staticStyles.container}
      onLayout={(event) => {
        setSeekerWidth(event.nativeEvent.layout.width);
      }}
      {...panResponder.panHandlers}
    >
      <View
        testID="seeker_duration"
        style={{
          ...staticStyles.duration,
          height: BAR_HEIGHT,
        }}
      />
      <View
        testID="seeker_buffer"
        style={{
          ...staticStyles.buffer,
          width: `${buffer * 100}%`,
          height: BAR_HEIGHT,
        }}
      />
      <Animated.View
        testID="seeker_played"
        style={{
          ...staticStyles.played,
          backgroundColor: filledColor,
          height: BAR_HEIGHT,
          right: position.animated.interpolate({
            inputRange: [0, seekerWidth],
            outputRange: [seekerWidth, 0],
          }),
        }}
      />
      <Animated.View
        testID="seeker_thumb"
        style={{
          ...staticStyles.thumb,
          transform: [{ translateX: position.animated }],
          left: -THUMB_SIZE / 2,
        }}
      >
        <View
          testID="seeker_thumb_button"
          style={{
            ...staticStyles.thumbButton,
            backgroundColor: buttonColor,
            width: seeking ? TOUCHED_BUTTON_SIZE : INITIAL_BUTTON_SIZE,
            height: seeking ? TOUCHED_BUTTON_SIZE : INITIAL_BUTTON_SIZE,
          }}
        />
      </Animated.View>
    </View>
  );
};

const staticStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 32,
    right: 32,
    justifyContent: 'center',
    height: THUMB_SIZE,
  },
  duration: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.38)',
  },
  buffer: {
    position: 'absolute',
    width: '70%',
    backgroundColor: 'rgba(255,255,255,0.38)',
  },
  played: {
    position: 'absolute',
    left: 0,
  },
  thumb: {
    position: 'absolute',
    height: THUMB_SIZE,
    width: THUMB_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbButton: {
    borderRadius: THUMB_SIZE,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.24,
    shadowRadius: 2,
    shadowOffset: {
      width: -1,
      height: 1,
    },
  },
});

export default Seeker;
