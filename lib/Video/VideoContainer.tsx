import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useVideoCtx } from '../ScreenContainer';
import { InternalProvider, InternalProviderProps } from '../InternalCtx';
import useInsets from '../InsetInterface';
import { useDeviceOrientation } from '../OrientationInterface';
import useControllerStyles from '../useControllerStyles';
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
  initialAspectRatio = 'landscape',
  children,
}: PropsWithChildren<VideoContainerProps>) => {
  const { fullscreen, isLandscape } = useVideoCtx();
  const insets = useInsets();
  const deviceOrientation = useDeviceOrientation();
  const styles = useControllerStyles(initialAspectRatio, isLandscape);
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
      <View style={styles.container}>
        <View style={fullscreen ? fullscreenStyle : normalStyle}>
          {children}
        </View>
      </View>
    </InternalProvider>
  );
};

export default VideoContainer;
