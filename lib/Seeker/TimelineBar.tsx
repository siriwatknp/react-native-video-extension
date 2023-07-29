import React from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useVideoCtx } from '../ScreenContainer';

export type TimelineBarProps = {
  barHeight?: number;
  buffer?: number;
  filledColor?: string;
  progress?: ViewStyle['width'] | Animated.Value; // in %
  styles?: Partial<{
    duration: StyleProp<ViewStyle>;
    buffer: StyleProp<ViewStyle>;
    played: StyleProp<ViewStyle>;
  }>;
};

const BAR_HEIGHT = 2;
const DEFAULT_COLOR = '#ff2525';

const TimelineBar = ({
  barHeight = BAR_HEIGHT,
  buffer = 0,
  filledColor = DEFAULT_COLOR,
  progress = 0,
  styles,
}: TimelineBarProps) => {
  const { config: ctxConfig } = useVideoCtx();
  return (
    <>
      <View
        testID="seeker_duration"
        style={StyleSheet.flatten([
          staticStyles.duration,
          styles?.duration,
          { height: barHeight },
        ])}
      />
      <View
        testID="seeker_buffer"
        style={StyleSheet.flatten([
          staticStyles.buffer,
          styles?.buffer,
          {
            width: `${buffer * 100}%`,
            height: barHeight,
          },
        ])}
      />
      <Animated.View
        testID="seeker_played"
        style={StyleSheet.flatten([
          staticStyles.played,
          { backgroundColor: ctxConfig?.seekerColor ?? filledColor },
          styles?.played,
          {
            height: barHeight,
            width: progress,
          },
        ])}
      />
    </>
  );
};

const staticStyles = StyleSheet.create({
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
});

export default TimelineBar;
