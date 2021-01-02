import React, { PropsWithChildren } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { SvgForward10 } from '../icons';
import { useInternalCtx } from '../InternalCtx';

export type ForwardProps = PropsWithChildren<TouchableOpacityProps>;

const Forward = ({ style, onPress, children, ...props }: ForwardProps) => {
  const {
    duration,
    forceUpdate,
    mutableState,
    videoInstance,
    seekerRef,
  } = useInternalCtx();
  return (
    <TouchableOpacity
      style={StyleSheet.flatten([{ padding: 8 }, style])}
      onPress={(e) => {
        onPress?.(e);
        forceUpdate({});
        const seconds =
          mutableState.currentTime + 10 > duration
            ? duration - 0.1
            : mutableState.currentTime + 10;
        videoInstance.current?.seek(seconds);
        seekerRef.seek?.(seconds / duration);
      }}
      {...props}
    >
      {children ?? <SvgForward10 />}
    </TouchableOpacity>
  );
};

export default Forward;
