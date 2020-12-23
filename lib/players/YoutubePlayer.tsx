import React from 'react';
import { Platform, View, ViewProps } from 'react-native';
import Video, { VideoProperties } from 'react-native-video';
import { useVideoCtx } from '../ScreenContainer';
import useControllerStyles from '../useControllerStyles';
import {
  getContainCanvasLayout,
  getAutoFitCanvasLayout,
  LayoutData,
  Device,
} from '../LayoutUtil';
import useInsets from '../InsetInterface';
import { OrientationLocker } from '../LayoutCalc';
import { AspectRatio } from '../utils';
import Overlay from '../Overlay';
import Seeker, { SNAP_BOTTOM } from '../Seeker/Seeker';
import Timer from '../Timer';
import Center from '../Section/Center';
import FullscreenToggle from '../controls/FullscreenToggle';
import PlayPauseRefresh from '../controls/PlayPauseRefresh';
import Replay from '../controls/Replay';
import Forward from '../controls/Forward';
import { InternalProvider } from '../InternalCtx';
import { useDeviceOrientation } from '../OrientationInterface';

export type YoutubePlayerProps = {
  style?: ViewProps['style'];
  videoStyle?: VideoProperties['style'];
  initialPaused?: boolean;
  initialAspectRatio?: AspectRatio;
  mode: 'auto-fit' | 'contain';
} & Omit<VideoProperties, 'paused'>;

const YoutubePlayer = ({
  mode,
  initialPaused,
  initialAspectRatio = 'landscape',
  style,
  videoStyle,
  ...props
}: YoutubePlayerProps) => {
  const {
    fullscreen,
    isLandscape,
    setIsLandscape,
    consoleHidden,
  } = useVideoCtx();
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
    <InternalProvider initialPaused={initialPaused}>
      {({
        videoInstance,
        setState,
        mutableState,
        seekerRef,
        duration,
        bufferTime,
        paused,
        onSeek,
      }) => (
        <View style={styles.container}>
          <View style={fullscreen ? fullscreenStyle : normalStyle}>
            <Video
              style={styles.video}
              {...props}
              ref={(videoRef) => {
                if (videoRef) {
                  videoInstance.current = videoRef;
                }
              }}
              onEnd={() => {
                setState({ ended: true });
              }}
              onLoad={(data) => {
                setState({ ended: false, duration: data.duration });
                setIsLandscape(data.naturalSize.orientation === 'landscape');
              }}
              onProgress={(data) => {
                setState({ ended: false, bufferTime: data.playableDuration });
                if (!seekerRef.progressStopped) {
                  // console.log('currentTime', data.currentTime);
                  mutableState.currentTime = data.currentTime;
                  seekerRef.seek?.(data.currentTime / duration);
                }
              }}
              paused={paused}
              controls={false}
              resizeMode={'contain'}
            />
            <Overlay>
              <Center>
                <Replay />
                <PlayPauseRefresh />
                <Forward />
              </Center>
              <View style={{ flex: 1, alignSelf: 'stretch' }}>
                <View style={{ flex: 1 }} />
                <View
                  style={{
                    width: '100%',
                    bottom:
                      fullscreen || Platform.OS === 'android' ? 0 : SNAP_BOTTOM,
                    paddingHorizontal: fullscreen ? 20 : 0,
                  }}
                >
                  <FullscreenToggle
                    style={{
                      alignSelf: 'flex-end',
                      ...(!fullscreen && { marginRight: 8, marginBottom: -8 }),
                    }}
                  />
                  <Seeker
                    mode={mode}
                    innerRef={seekerRef}
                    buffer={duration ? bufferTime / duration : 0}
                    onSeek={onSeek}
                  >
                    <Timer
                      currentTime={mutableState.currentTime}
                      duration={duration}
                      hidden={consoleHidden}
                      style={!fullscreen && { marginLeft: 16 }}
                    />
                  </Seeker>
                </View>
              </View>
            </Overlay>
          </View>
        </View>
      )}
    </InternalProvider>
  );
};

export default YoutubePlayer;
