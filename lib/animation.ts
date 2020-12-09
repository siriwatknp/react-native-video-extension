import React, { useEffect, useRef } from 'react';
import { Animated, TransformsStyle, useWindowDimensions } from 'react-native';
import { useVideoCtx } from './ScreenContainer';

export const useScaleSpring = (hidden: boolean) => {
  const scaleAnim = useRef(new Animated.Value(hidden ? 0 : 1)).current;
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: hidden ? 0 : 1,
      friction: hidden ? 10 : 4,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, hidden]);
  return scaleAnim
}

export const useOpacity = (hidden: boolean) => {
  const opacityAnim = useRef(new Animated.Value(hidden ? 0 : 1)).current;
  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: hidden ? 0 : 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [opacityAnim, hidden]);
  return opacityAnim
};

export const useFullscreenTransform = () => {
  const { width, height } = useWindowDimensions();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { fullscreen } = useVideoCtx();

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: fullscreen ? 90 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [rotateAnim, fullscreen]);
  return {
    staticTransform: [
      { translateY: (height - width) / 2 },
      { translateX: -(height - width) / 2 },
      {
        rotate: '90deg',
      },
    ] as TransformsStyle['transform'],
    animatedTransform: [
      { translateY: fullscreen ? (height - width) / 2 : 0 },
      { translateX: fullscreen ? -(height - width) / 2 : 0 },
      {
        rotate: (rotateAnim.interpolate({
          inputRange: [0, 90],
          outputRange: ['0deg', '90deg'],
        }) as unknown) as string,
      },
    ] as TransformsStyle['transform'],
  };
};
