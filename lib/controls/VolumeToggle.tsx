import React, { ReactElement } from 'react';
import { SvgVolumeUp, SvgVolumeOff } from '../icons';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useInternalCtx } from '../InternalCtx';

export type VolumeToggleProps = {
  volumeUpIcon?: ReactElement;
  volumeOffIcon?: ReactElement;
} & TouchableOpacityProps;

const VolumeToggle = ({
  style,
  volumeUpIcon,
  volumeOffIcon,
  ...props
}: VolumeToggleProps) => {
  const { muted, setMuted } = useInternalCtx();
  return (
    <TouchableOpacity
      style={StyleSheet.flatten([{ padding: 8 }, style])}
      {...props}
      onPress={() => setMuted((m) => !m)}
    >
      {muted
        ? volumeOffIcon ?? <SvgVolumeOff />
        : volumeUpIcon ?? <SvgVolumeUp />}
    </TouchableOpacity>
  );
};

export default VolumeToggle;
