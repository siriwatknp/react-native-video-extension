import { useEffect, useRef } from 'react';
import { Animated, TransformsStyle, useWindowDimensions } from 'react-native';
import { calculateRotationDegree } from './utils';
import { VideoContext } from './ScreenContainer';
import { Device, getPlayerRotationDegree } from './LayoutCalc';

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

// todo: split to useFullscreenRotation & useFullscreenOpacity
export const useAnimatedFullscreen = (
  fullscreen: VideoContext['fullscreen'],
  isLandscape: boolean,
) => {
  const shouldRotate = isLandscape && fullscreen;
  const windowSize = useWindowDimensions();
  const { width, height } = Device(windowSize);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: getPlayerRotationDegree(windowSize, { isLandscape, fullscreen }),
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [rotateAnim, isLandscape, fullscreen]);
  useEffect(() => {
    if (fullscreen && !isLandscape) {
      opacityAnim.setValue(0)
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [opacityAnim, fullscreen, isLandscape]);
  return {
    staticTransform: [
      { translateY: shouldRotate ? (height - width) / 2 : 0 },
      { translateX: shouldRotate ? -(height - width) / 2 : 0 },
      {
        rotate: `${calculateRotationDegree(isLandscape, fullscreen)}deg`,
      },
    ] as TransformsStyle['transform'],
    animatedTransform: [
      { translateY: shouldRotate ? (height - width) / 2 : 0 },
      { translateX: shouldRotate ? -(height - width) / 2 : 0 },
      {
        rotate: rotateAnim.interpolate({
          inputRange: [-90, 0, 90],
          outputRange: ['-90deg', '0deg', '90deg'],
        }),
      },
    ] as TransformsStyle['transform'],
    fullscreenSize: {
      width: isLandscape ? height : width,
      height: isLandscape ? width : height,
    },
    animatedOpacity: {
      opacity: opacityAnim,
    },
  };
};
