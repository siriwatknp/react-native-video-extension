import React, { useEffect, useRef } from 'react';
import {
  useWindowDimensions,
  Animated,
  ViewProps,
  StyleSheet,
} from 'react-native';

export type BackgroundProps = {
  fullscreen?: boolean;
  children?: React.ReactNode;
} & ViewProps;

const Background = ({
  fullscreen,
  children,
  style,
  ...props
}: BackgroundProps) => {
  const { width, height } = useWindowDimensions();
  const scale = useRef(new Animated.Value(fullscreen ? 1 : 0)).current;
  useEffect(() => {
    // Animated.spring(scale, {
    //   toValue: fullscreen ? 1.2 : 0,
    //   useNativeDriver: true,
    //   friction: 8,
    // }).start();
    Animated.timing(scale, {
      toValue: fullscreen ? 1 : 0,
      useNativeDriver: true,
      duration: 0,
    }).start()
  }, [fullscreen, scale]);
  return (
    <Animated.View
      style={StyleSheet.flatten([
        { backgroundColor: '#000' },
        style,
        {
          width,
          height,
          zIndex: 1000,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [
            { translateX: -width / 2 },
            { translateY: -height / 2 },
            { scale },
          ],
        },
      ])}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

export default Background;
