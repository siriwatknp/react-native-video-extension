import React, { useRef } from 'react';
import { Animated, TransformsStyle, useWindowDimensions } from 'react-native';
import { useVideoCtx } from './ScreenContainer';

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
