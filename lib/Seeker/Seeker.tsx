import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  View,
} from 'react-native';
import { getSeekDiff, getSeekerOffset } from '../LayoutCalc';
import { useVideoCtx } from '../ScreenContainer';
import useInsets from '../InsetInterface';
import { useOpacity, useScaleSpring } from '../animation';

export type SeekerProps = {
  filledColor?: string;
  buttonColor?: string;
  buffer?: number;
  onSeek?: (data: {
    eventName: 'GRANT' | 'MOVE' | 'RELEASE';
    x: number;
    width: number;
    ratio: number;
  }) => void;
  innerRef?: any;
};

const within = (min: number, number: number, max: number) => {
  if (number < min) return min;
  if (number > max) return max;
  return number;
};

const DEFAULT_COLOR = '#ff2525';
const THUMB_SIZE = 40;
const BAR_HEIGHT = 2;
const INITIAL_BUTTON_SIZE = 16;
const TOUCHED_BUTTON_SIZE = 24;
const Seeker = ({
  filledColor = DEFAULT_COLOR,
  buttonColor = DEFAULT_COLOR,
  buffer = 0,
  onSeek,
  children,
  innerRef,
}: React.PropsWithChildren<SeekerProps>) => {
  const insets = useInsets();
  const {
    fullscreen,
    isLandscape: isLandscapeVideo,
    consoleHidden,
  } = useVideoCtx();
  const barOpacity = useOpacity(consoleHidden && !!fullscreen);
  const scaleAnim = useScaleSpring(consoleHidden);
  const [seeking, setSeeking] = useState(false);
  const [seekerWidth, setSeekerWidth] = useState(0);
  const offset = INITIAL_BUTTON_SIZE / 2;
  const totalWidth = Math.abs(seekerWidth - offset * 2);
  const position = useRef({
    x: 0,
    animated: new Animated.Value(0),
  }).current;
  const seekerRef = useRef<any>({}).current;
  const diff = getSeekDiff(!!fullscreen, isLandscapeVideo);
  if (typeof innerRef === 'object') {
    innerRef.seek = (ratio: number) => {
      const nextPosition = ratio * totalWidth + offset;
      position.x = nextPosition;
      position.animated.setValue(nextPosition);
    };
  }
  const bundleData = (totalWidth: number, x: number) => {
    const interpolatedX = x - offset;
    return {
      x: interpolatedX,
      width: totalWidth,
      ratio: interpolatedX / totalWidth,
    };
  };
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
    const result = position.x + gestureState[diff];
    if (result >= offset && result <= seekerWidth - offset) {
      position.animated.setValue(result);
      onSeek?.({ eventName: 'MOVE', ...bundleData(totalWidth, result) });
    }
  };
  seekerRef.onRelease = function (gestureState: PanResponderGestureState) {
    position.x = position.x + gestureState[diff];
    onSeek?.({
      eventName: 'RELEASE',
      ...bundleData(
        totalWidth,
        within(offset, position.x, seekerWidth - offset),
      ),
    });
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
    <Animated.View
      testID="seeker_container"
      pointerEvents="box-only"
      style={{
        ...staticStyles.container,
        ...(fullscreen && { bottom: 0 }),
        ...getSeekerOffset({
          insets,
          fullscreen: !!fullscreen,
          isLandscape: isLandscapeVideo,
        }),
        opacity: barOpacity,
      }}
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
        <Animated.View
          testID="seeker_thumb_button"
          style={{
            ...staticStyles.thumbButton,
            backgroundColor: buttonColor,
            width: seeking ? TOUCHED_BUTTON_SIZE : INITIAL_BUTTON_SIZE,
            height: seeking ? TOUCHED_BUTTON_SIZE : INITIAL_BUTTON_SIZE,
            transform: [{ scale: scaleAnim }],
          }}
        />
      </Animated.View>
      {children}
    </Animated.View>
  );
};

const staticStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -THUMB_SIZE / 2 + BAR_HEIGHT / 2,
    left: 0,
    right: 0,
    justifyContent: 'center',
    height: THUMB_SIZE,
    zIndex: 1001,
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
