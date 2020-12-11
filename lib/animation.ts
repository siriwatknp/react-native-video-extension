import { useEffect, useRef } from 'react';
import { Animated, TransformsStyle, useWindowDimensions } from 'react-native';

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

export const useAnimatedFullscreen = (
  fullscreen: boolean,
  isLandscape: boolean,
) => {
  const shouldRotate = isLandscape && fullscreen;
  const { width, height } = useWindowDimensions();
  const prevFullscreen = useRef(fullscreen)
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: shouldRotate ? 90 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [rotateAnim, shouldRotate]);
  useEffect(() => {
    if (prevFullscreen.current !== fullscreen && !isLandscape) {
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start()
    }
  }, [opacityAnim, fullscreen, isLandscape])
  useEffect(() => {
    prevFullscreen.current = fullscreen
  }, [fullscreen])
  return {
    staticTransform: [
      { translateY: shouldRotate ? (height - width) / 2 : 0 },
      { translateX: shouldRotate ? -(height - width) / 2 : 0 },
      {
        rotate: shouldRotate ? '90deg' : '0',
      },
    ] as TransformsStyle['transform'],
    animatedTransform: [
      { translateY: shouldRotate ? (height - width) / 2 : 0 },
      { translateX: shouldRotate ? -(height - width) / 2 : 0 },
      {
        rotate: (rotateAnim.interpolate({
          inputRange: [0, 90],
          outputRange: ['0deg', '90deg'],
        }) as unknown) as string,
      },
    ] as TransformsStyle['transform'],
    fullscreenSize: {
      width: isLandscape ? height : width,
      height: isLandscape ? width : height,
    },
    animatedOpacity: {
      opacity: opacityAnim
    }
  };
};
