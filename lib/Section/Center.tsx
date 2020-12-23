import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

export type CenterProps = {
  height?: number;
} & ViewProps;

const Center = ({
  height = 80,
  style,
  ...props
}: PropsWithChildren<CenterProps>) => (
  <View
    style={StyleSheet.flatten([
      styles.root,
      style,
      {
        height,
        transform: [
          { translateY: -height / 2 },
          ...((style && 'transform' in style ? style?.transform : []) ?? []),
        ],
      },
    ])}
    {...props}
  />
);

const styles = StyleSheet.create({
  root: {
    zIndex: 1,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    top: '50%',
  },
});

export default Center;
