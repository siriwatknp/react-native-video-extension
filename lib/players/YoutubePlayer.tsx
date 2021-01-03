import React, { forwardRef, ReactNode, useRef } from 'react';
import { Platform, View, Animated } from 'react-native';
import Video from 'react-native-video';
import withDefaultScreenContainer from '../DefaultScreenContainer';
import { FullscreenOrientation, useVideoCtx } from '../ScreenContainer';
import { useInternalCtx } from '../InternalCtx';
import { AspectRatio } from '../utils';
import Overlay from '../controls/Overlay';
import { SNAP_BOTTOM } from '../Seeker/Seeker';
import Timer from '../controls/Timer';
import Center from '../Section/Center';
import FullscreenToggle from '../controls/FullscreenToggle';
import VolumeToggle from '../controls/VolumeToggle';
import PlayPauseRefresh from '../controls/PlayPauseRefresh';
import Replay from '../controls/Replay';
import Forward from '../controls/Forward';
import RNVideo, { RNVideoProps } from '../Video/RNVideo';
import VideoContainer from '../Video/VideoContainer';
import EnhancedSeeker from '../Seeker/EnhancedSeeker';
import EnhancedTimelineBar from '../Seeker/EnhancedTimelineBar';
import { IconConfig } from '../icons';

const EnhancedTimer = () => {
  const { fullscreen } = useVideoCtx();
  const { mutableState, duration } = useInternalCtx();
  return (
    <Timer
      currentTime={mutableState.currentTime}
      duration={duration}
      style={!fullscreen && { marginLeft: 16 }}
    />
  );
};

export type YoutubePlayerProps = {
  initialPaused?: boolean;
  initialMuted?: boolean;
  aspectRatio?: AspectRatio;
  mode: 'auto-fit' | 'contain';
  customIcon?: IconConfig;
  renderToolbar?: (fullscreen: false | FullscreenOrientation) => ReactNode;
} & RNVideoProps;

const YoutubePlayer = forwardRef<Video, YoutubePlayerProps>(
  (
    {
      mode,
      initialPaused = false,
      initialMuted = false,
      aspectRatio = 'landscape',
      customIcon,
      renderToolbar,
      ...props
    },
    ref,
  ) => {
    const { fullscreen, consoleHidden } = useVideoCtx();
    const progressObserver = useRef(new Animated.Value(0)).current;
    return (
      <VideoContainer
        mode={mode}
        aspectRatio={aspectRatio}
        initialPaused={initialPaused}
        initialMuted={initialMuted}
      >
        <RNVideo
          style={{ width: '100%', height: '100%' }}
          {...props}
          ref={ref}
        />
        <Overlay>
          <Center>
            <Replay>{customIcon?.replayIcon}</Replay>
            <PlayPauseRefresh {...customIcon} />
            <Forward>{customIcon?.forwardIcon}</Forward>
          </Center>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            {renderToolbar?.(fullscreen)}
            <View style={{ flex: 1 }} />
            <View
              style={{
                width: '100%',
                bottom:
                  fullscreen || Platform.OS === 'android' ? 0 : SNAP_BOTTOM,
                paddingHorizontal: fullscreen ? 20 : 0,
              }}
            >
              <View
                style={{
                  alignSelf: 'flex-end',
                  flexDirection: 'row',
                  alignItems: 'center',
                  ...(!fullscreen && { marginRight: 8, marginBottom: -8 }),
                }}
              >
                <VolumeToggle style={{ marginRight: 8 }} {...customIcon} />
                <FullscreenToggle {...customIcon} />
              </View>
              <EnhancedSeeker mode={mode} progressObserver={progressObserver}>
                <EnhancedTimer />
              </EnhancedSeeker>
            </View>
          </View>
        </Overlay>
        <View
          style={{
            width: '100%',
            position: 'absolute',
            bottom: 2,
            opacity: !fullscreen && consoleHidden ? 1 : 0,
          }}
          pointerEvents={'none'}
        >
          <EnhancedTimelineBar progress={progressObserver} />
        </View>
      </VideoContainer>
    );
  },
);

export default withDefaultScreenContainer(YoutubePlayer);
