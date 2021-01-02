import React, { PropsWithChildren } from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native';

export type ButtonBaseProps = TouchableOpacityProps;

const ButtonBase = ({
  children,
  style,
  ...props
}: PropsWithChildren<ButtonBaseProps>) => (
  <TouchableOpacity
    style={StyleSheet.flatten([
      { padding: 8, backgroundColor: '#fff', borderRadius: 4 },
      style,
    ])}
    {...props}
  >
    <Text style={{ fontSize: 16, textAlign: 'center' }}>{children}</Text>
  </TouchableOpacity>
);

export default ButtonBase;
