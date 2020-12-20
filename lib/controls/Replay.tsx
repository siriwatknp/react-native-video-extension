import React from 'react';
import { SvgReplay10 } from '../../src/icons';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useInternalCtx } from '../InternalCtx';

export type ReplayProps = TouchableOpacityProps;

const Replay = ({ style, onPress, ...props }: ReplayProps) => {
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
          mutableState.currentTime - 10 < 0
            ? 0.1
            : mutableState.currentTime - 10;
        videoInstance.current?.seek(seconds);
        seekerRef.seek?.(seconds / duration);
      }}
      {...props}
    >
      <SvgReplay10 />
    </TouchableOpacity>
  );
};

export default Replay;
