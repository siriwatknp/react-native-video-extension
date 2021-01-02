import React, { PropsWithChildren } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
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
import { AspectRatio, getAspectRatio } from '../utils';

export type VideoContainerProps = {
  aspectRatio?: AspectRatio;
  mode: 'auto-fit' | 'contain';
} & InternalProviderProps;

const VideoContainer = ({
  mode,
  initialPaused,
  aspectRatio = 16 / 9,
  children,
}: PropsWithChildren<VideoContainerProps>) => {
  const { fullscreen, isLandscape, loading } = useVideoCtx();
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
    aspectRatio: getAspectRatio(aspectRatio),
  } as const;
  const fullscreenStyle = getLayoutStyle[mode]?.(fullscreenData);
  return (
    <InternalProvider initialPaused={initialPaused}>
      <View
        style={StyleSheet.flatten([
          styles.container,
          fullscreen ? styles.fullscreenContainer : styles.initialContainer,
        ])}
      >
        <View style={fullscreen ? fullscreenStyle : normalStyle}>
          {children}
        </View>
        {loading && (
          <View
            style={StyleSheet.flatten([
              styles.fullscreenContainer,
              styles.loadingContainer,
            ])}
          >
            <ActivityIndicator color="#fff" />
          </View>
        )}
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
  loadingContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VideoContainer;
