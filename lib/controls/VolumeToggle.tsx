import React from 'react';
import { SvgVolumeUp, SvgVolumeOff } from '../../src/icons';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useInternalCtx } from '../InternalCtx';

export type VolumeToggleProps = TouchableOpacityProps;

const VolumeToggle = ({ style, ...props }: VolumeToggleProps) => {
  const { muted, setMuted } = useInternalCtx();
  return (
    <TouchableOpacity
      style={StyleSheet.flatten([{ padding: 8 }, style])}
      {...props}
      onPress={() => setMuted((m) => !m)}
    >
      {muted ? <SvgVolumeOff /> : <SvgVolumeUp />}
    </TouchableOpacity>
  );
};

export default VolumeToggle;
