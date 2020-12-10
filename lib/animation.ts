import React, { useEffect, useRef } from 'react';
import { Animated, TransformsStyle, useWindowDimensions } from 'react-native';
import { getScaleX, getScaleY } from './utils';

export const useScaleSpring = (hidden: boolean) => {
  const scaleAnim = useRef(new Animated.Value(hidden ? 0 : 1)).current;
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: hidden ? 0 : 1,
      friction: hidden ? 10 : 4,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, hidden]);
  return scaleAnim;
};

export const useOpacity = (hidden: boolean) => {
  const opacityAnim = useRef(new Animated.Value(hidden ? 0 : 1)).current;
  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: hidden ? 0 : 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [opacityAnim, hidden]);
  return opacityAnim;
};

export const useFullscreenTransform = (
  fullscreen: boolean,
  isLandscape: boolean,
) => {
  const shouldRotate = isLandscape && fullscreen;
  const { width, height } = useWindowDimensions();
  const widescreenHeight = width * 0.5625;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleXAnim = useRef(new Animated.Value(1)).current;
  const scaleYAnim = useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: shouldRotate ? 90 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(scaleXAnim, {
      toValue: getScaleX({ width, height }, { fullscreen, isLandscape }),
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.timing(scaleYAnim, {
      toValue: getScaleY(
        { width, height },
        { height: widescreenHeight, fullscreen, isLandscape },
      ),
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [rotateAnim, isLandscape, fullscreen]);
  return {
    staticTransform: [
      { translateY: shouldRotate ? (height - width) / 2 : 0 },
      { translateX: shouldRotate ? -(height - width) / 2 : 0 },
      {
        rotate: shouldRotate ? '90deg' : '0',
      },
    ] as TransformsStyle['transform'],
    animatedTransform: [
      // { scaleX: scaleXAnim },
      // { scaleY: scaleYAnim },
      { translateY: shouldRotate ? (height - width) / 2 : 0 },
      { translateX: shouldRotate ? -(height - width) / 2 : 0 },
      {
        rotate: (rotateAnim.interpolate({
          inputRange: [0, 90],
          outputRange: ['0deg', '90deg'],
        }) as unknown) as string,
      },
    ] as TransformsStyle['transform'],
  };
};
