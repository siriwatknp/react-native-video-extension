import React from 'react';
import { View, ViewProps } from 'react-native';
import { VideoProperties } from 'react-native-video';
import { AspectRatio, toTimeView } from '../utils';
import Overlay from '../controls/Overlay';
import EnhancedSeeker from '../Seeker/EnhancedSeeker';
import Center from '../Section/Center';
import FullscreenToggle from '../controls/FullscreenToggle';
import PlayPauseRefresh from '../controls/PlayPauseRefresh';
import Replay from '../controls/Replay';
import Forward from '../controls/Forward';
import RNVideo from '../Video/RNVideo';
import VideoContainer from '../Video/VideoContainer';
import { useInternalCtx } from '../InternalCtx';
import Text from '../controls/Text';
import VolumeToggle from '../controls/VolumeToggle';
import {useVideoCtx} from "../ScreenContainer";

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
  style?: ViewProps['style'];
  videoStyle?: VideoProperties['style'];
  initialPaused?: boolean;
  initialMuted?: boolean;
  initialAspectRatio?: AspectRatio;
  mode: 'auto-fit' | 'contain';
} & Omit<VideoProperties, 'paused'>;

const FacebookPlayer = ({
  mode,
  initialPaused = false,
  initialMuted = false,
  initialAspectRatio = 'landscape',
  style,
  videoStyle,
  ...props
}: FacebookPlayerProps) => {
  const { fullscreen } = useVideoCtx()
  return (
    <VideoContainer
      mode={mode}
      initialAspectRatio={initialAspectRatio}
      initialPaused={initialPaused}
      initialMuted={initialMuted}
    >
      <RNVideo style={{ width: '100%', height: '100%' }} {...props} />
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
            <VolumeToggle style={{ marginRight: 8 }} />
            <FullscreenToggle />
          </View>
        </View>
      </Overlay>
    </VideoContainer>
  );
};

export default FacebookPlayer;
