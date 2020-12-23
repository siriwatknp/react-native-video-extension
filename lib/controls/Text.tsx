import React, { PropsWithChildren } from 'react';
import {
  StyleSheet,
  Text as RNText,
  TextProps as RNTextProps,
} from 'react-native';

export type TextProps = {
  dim?: boolean;
} & RNTextProps;

const Text = ({ dim, style, ...props }: PropsWithChildren<TextProps>) => (
  <RNText
    style={StyleSheet.flatten([styles.text, dim && styles.dim, style])}
    {...props}
  />
);

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  dim: {
    color: '#c4c4c4',
  },
});

export default Text;
