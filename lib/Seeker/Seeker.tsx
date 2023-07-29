import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { getAutoFitSeekDiff, getContainSeekDiff } from '../LayoutCalc';
import { useVideoCtx } from '../ScreenContainer';
import { useOpacity, useScaleSpring } from '../animation';
import TimelineBar from './TimelineBar';

export type SeekerEventData = {
  eventName: 'GRANT' | 'MOVE' | 'RELEASE';
  x: number;
  width: number;
  ratio: number;
};
export type SeekerProps = {
  mode: 'auto-fit' | 'contain';
  config?: Partial<{
    filledColor?: string;
    buttonColor?: string;
    thumbSize?: number;
    barHeight?: number;
    initialButtonSize?: number;
    touchedButtonSize?: number;
  }>;
  buffer?: number;
  thumbHidden?: boolean;
  onSeek?: (data: SeekerEventData) => void;
  innerRef?: any;
  progressObserver?: Animated.Value;
  styles?: Partial<{
    seeker: StyleProp<ViewStyle>;
    duration: StyleProp<ViewStyle>;
    buffer: StyleProp<ViewStyle>;
    played: StyleProp<ViewStyle>;
    thumb: StyleProp<ViewStyle>;
    innerThumb: StyleProp<ViewStyle>;
  }>;
};

const within = (min: number, number: number, max: number) => {
  if (number < min) return min;
  if (number > max) return max;
  return number;
};

const DEFAULT_COLOR = '#22D473';
const THUMB_SIZE = 40;
const BAR_HEIGHT = 2;
const INITIAL_BUTTON_SIZE = 16;
const TOUCHED_BUTTON_SIZE = 24;

export const SNAP_BOTTOM = -THUMB_SIZE / 2 + BAR_HEIGHT / 2;

/**
 * Note: Seeker's width should not changed when seeking, be careful!
 */
const Seeker = ({
  mode,
  thumbHidden,
  config = {},
  buffer = 0,
  onSeek,
  children,
  progressObserver,
  innerRef,
  styles,
}: React.PropsWithChildren<SeekerProps>) => {
  const {
    filledColor = DEFAULT_COLOR,
    buttonColor = DEFAULT_COLOR,
    thumbSize = THUMB_SIZE,
    barHeight = BAR_HEIGHT,
    initialButtonSize = INITIAL_BUTTON_SIZE,
    touchedButtonSize = TOUCHED_BUTTON_SIZE,
  } = config;
  const {
    fullscreen,
    isLandscape: isLandscapeVideo,
    consoleHidden,
  } = useVideoCtx();
  const barOpacity = useOpacity(consoleHidden && !!fullscreen);
  const scaleAnim = useScaleSpring(consoleHidden);
  const [seeking, setSeeking] = useState(false);
  const [seekerWidth, setSeekerWidth] = useState(0);
  const prevSeekerWidth = useRef(seekerWidth);
  const offset = initialButtonSize / 2;
  const totalWidth = Math.abs(seekerWidth - offset * 2);
  const position = useRef({
    x: offset,
    animated: new Animated.Value(offset),
  }).current;
  const seekerRef = useRef<any>({}).current;
  const getDiff = {
    'auto-fit': getAutoFitSeekDiff(!!fullscreen, isLandscapeVideo),
    contain: getContainSeekDiff(fullscreen),
  } as const;
  const diff = getDiff[mode];
  if (typeof innerRef === 'object') {
    innerRef.seek = (ratio: number) => {
      const nextPosition = ratio * totalWidth + offset;
      position.x = nextPosition;
      position.animated.setValue(nextPosition);
      progressObserver && progressObserver.setValue(nextPosition);
    };
  }
  useEffect(() => {
    if (seekerWidth) {
      const newX =
        (position.x * seekerWidth) / (prevSeekerWidth.current || seekerWidth);
      position.x = newX;
      position.animated.setValue(newX);
      progressObserver && progressObserver.setValue(newX);
      // update
      prevSeekerWidth.current = seekerWidth;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seekerWidth]); // update position & animated when seekerWidth change (I know what I'm doing)
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
    progressObserver && progressObserver.setValue(locationX);
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
      progressObserver && progressObserver.setValue(result);
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
      style={StyleSheet.flatten([
        staticStyles.container,
        styles?.seeker,
        { opacity: barOpacity, height: thumbSize },
      ])}
      onLayout={(event) => {
        setSeekerWidth(event.nativeEvent.layout.width);
      }}
      {...panResponder.panHandlers}
    >
      <TimelineBar
        styles={styles}
        barHeight={barHeight}
        buffer={buffer}
        filledColor={filledColor}
        progress={position.animated}
      />
      {!thumbHidden && (
        <Animated.View
          testID="seeker_thumb"
          style={StyleSheet.flatten([
            staticStyles.thumb,
            styles?.thumb,
            {
              height: thumbSize,
              width: thumbSize,
              left: -thumbSize / 2,
              transform: [{ translateX: position.animated }],
            },
          ])}
        >
          <Animated.View
            testID="seeker_thumb_button"
            style={StyleSheet.flatten([
              staticStyles.thumbButton,
              { backgroundColor: buttonColor },
              styles?.innerThumb,
              {
                borderRadius: thumbSize,
                width: seeking ? touchedButtonSize : initialButtonSize,
                height: seeking ? touchedButtonSize : initialButtonSize,
                transform: [{ scale: scaleAnim }],
              },
            ])}
          />
        </Animated.View>
      )}
      {children}
    </Animated.View>
  );
};

const staticStyles = StyleSheet.create({
  container: {
    left: 0,
    right: 0,
    justifyContent: 'center',
    zIndex: 1001,
  },
  duration: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.38)',
  },
  buffer: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.38)',
  },
  played: {
    position: 'absolute',
    left: 0,
  },
  thumb: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbButton: {
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
