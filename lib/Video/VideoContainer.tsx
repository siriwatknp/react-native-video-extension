import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useVideoCtx } from '../ScreenContainer';
import { InternalProvider, InternalProviderProps } from '../InternalCtx';
import useInsets from '../InsetInterface';
import { useDeviceOrientation } from '../OrientationInterface';
import {
  getAutoFitCanvasLayout,
  getContainCanvasLayout,
  LayoutData,
} from '../LayoutUtil';
import { OrientationLocker } from '../LayoutCalc';
import { AspectRatio } from '../utils';

export type VideoContainerProps = {
  initialAspectRatio?: AspectRatio;
  mode: 'auto-fit' | 'contain';
} & InternalProviderProps;

const VideoContainer = ({
  mode,
  children,
}: PropsWithChildren<VideoContainerProps>) => {
  const { fullscreen, isLandscape } = useVideoCtx();
  const insets = useInsets();
  const deviceOrientation = useDeviceOrientation();
  const getLayoutStyle = {
    'auto-fit': getAutoFitCanvasLayout,
    contain: getContainCanvasLayout,
  };
  const fullscreenData: LayoutData = {
    isPortraitLocked: OrientationLocker.isPortraitLocked,
    isLandscapeVideo: isLandscape,
    isLandscapeDevice: deviceOrientation.startsWith('LANDSCAPE'),
    deviceOrientation,
    insets,
  };
  const normalStyle = {
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
  } as const;
  const fullscreenStyle = getLayoutStyle[mode]?.(fullscreenData);
  return (
    <InternalProvider>
      <View
        style={StyleSheet.flatten([
          styles.container,
          fullscreen ? styles.fullscreenContainer : styles.initialContainer,
        ])}
      >
        <View style={fullscreen ? fullscreenStyle : normalStyle}>
          {children}
        </View>
      </View>
    </InternalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    zIndex: 1000,
  },
  initialContainer: {
    width: '100%',
  },
  fullscreenContainer: {
    position: 'absolute',
    zIndex: 1000000,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default VideoContainer;
