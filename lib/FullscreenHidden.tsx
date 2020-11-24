import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useVideoCtx } from './ScreenContainer';

export type FullscreenHiddenProps = React.PropsWithChildren<ViewProps>;

const FullscreenHidden = ({
  children,
  style,
  ...props
}: FullscreenHiddenProps) => {
  const { fullscreen } = useVideoCtx();
  return (
    <View
      style={[fullscreen ? styles.fullscreen : undefined, style]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreen: {
    overflow: 'hidden',
    height: 0,
  },
});

export default FullscreenHidden;
