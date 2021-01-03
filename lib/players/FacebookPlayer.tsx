import React, { ReactNode, forwardRef } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';
import withDefaultScreenContainer from '../DefaultScreenContainer';
import { AspectRatio, toTimeView } from '../utils';
import Overlay from '../controls/Overlay';
import EnhancedSeeker from '../Seeker/EnhancedSeeker';
import Center from '../Section/Center';
import FullscreenToggle from '../controls/FullscreenToggle';
import PlayPauseRefresh from '../controls/PlayPauseRefresh';
import Replay from '../controls/Replay';
import Forward from '../controls/Forward';
import RNVideo, { RNVideoProps } from '../Video/RNVideo';
import VideoContainer from '../Video/VideoContainer';
import { useInternalCtx } from '../InternalCtx';
import Text from '../controls/Text';
import VolumeToggle from '../controls/VolumeToggle';
import { FullscreenOrientation, useVideoCtx } from '../ScreenContainer';
import { IconConfig } from '../icons';

const TimePlayed = () => {
  const { mutableState } = useInternalCtx();
  return (
    <Text style={{ width: 80 }}>{toTimeView(mutableState.currentTime)}</Text>
  );
};

const TimeLeft = () => {
  const { mutableState, duration } = useInternalCtx();
  return (
    <Text style={{ width: 80 }}>
      -{toTimeView(duration - mutableState.currentTime)}
    </Text>
  );
};

export type FacebookPlayerProps = {
  initialPaused?: boolean;
  initialMuted?: boolean;
  aspectRatio?: AspectRatio;
  mode: 'auto-fit' | 'contain';
  customIcon?: IconConfig;
  renderToolbar?: (fullscreen: false | FullscreenOrientation) => ReactNode;
} & RNVideoProps;

const FacebookPlayer = forwardRef<Video, FacebookPlayerProps>(
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
    const { fullscreen } = useVideoCtx();
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
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: fullscreen ? 16 : 0,
              }}
            >
              <TimePlayed />
              <EnhancedSeeker
                mode={mode}
                config={{
                  buttonColor: '#fff',
                  filledColor: '#1877f2',
                  barHeight: 4,
                  initialButtonSize: 18,
                  touchedButtonSize: 18,
                }}
                styles={{
                  seeker: { flex: 1 },
                  buffer: { borderRadius: 10 },
                  duration: { borderRadius: 10 },
                  played: { borderRadius: 10 },
                }}
              />
              <TimeLeft />
              <VolumeToggle {...customIcon} />
              <FullscreenToggle {...customIcon} />
            </View>
          </View>
        </Overlay>
      </VideoContainer>
    );
  },
);

export default withDefaultScreenContainer(FacebookPlayer);
