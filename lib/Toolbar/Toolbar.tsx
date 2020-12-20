import React, { PropsWithChildren } from 'react';
import { FlexStyle, StyleSheet, View, ViewProps } from 'react-native';

export type ToolbarProps = {
  position: 'top' | 'left' | 'right' | 'bottom' | 'center';
  justify?: FlexStyle['justifyContent'];
} & ViewProps;

const FlexDirection = {
  top: 'row',
  left: 'column',
  right: 'column',
  bottom: 'row',
  center: 'row',
} as const;
const Layout = {
  top: {
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  left: {
    left: 0,
    top: 0,
    bottom: 0,
    alignItems: 'flex-start',
  },
  right: {
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'flex-end',
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
  },
} as const;

const Toolbar = ({
  children,
  position,
  style,
  justify,
}: PropsWithChildren<ToolbarProps>) => {
  return (
    <View
      style={StyleSheet.flatten([
        {
          position: 'absolute',
          flexDirection: FlexDirection[position],
          padding: 16,
          justifyContent: justify,
          ...Layout[position],
        },
        style,
      ])}
    >
      {children}
    </View>
  );
};

export default Toolbar;
