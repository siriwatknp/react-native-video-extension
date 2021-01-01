import React from 'react';
import { Platform, View, ViewProps } from 'react-native';
import { VideoProperties } from 'react-native-video';
import { useVideoCtx } from '../ScreenContainer';
import { useInternalCtx } from '../InternalCtx';
import { AspectRatio } from '../utils';
import Overlay from '../controls/Overlay';
import { SNAP_BOTTOM } from '../Seeker/Seeker';
import Timer from '../controls/Timer';
import Center from '../Section/Center';
import FullscreenToggle from '../controls/FullscreenToggle';
import PlayPauseRefresh from '../controls/PlayPauseRefresh';
import Replay from '../controls/Replay';
import Forward from '../controls/Forward';
import RNVideo from '../Video/RNVideo';
import VideoContainer from '../Video/VideoContainer';
import EnhancedSeeker from '../Seeker/EnhancedSeeker';

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
  const { fullscreen } = useVideoCtx();
  return (
    <VideoContainer
      mode={mode}
      initialAspectRatio={initialAspectRatio}
      initialPaused={initialPaused}
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
              bottom: fullscreen || Platform.OS === 'android' ? 0 : SNAP_BOTTOM,
              paddingHorizontal: fullscreen ? 20 : 0,
            }}
          >
            <FullscreenToggle
              style={{
                alignSelf: 'flex-end',
                ...(!fullscreen && { marginRight: 8, marginBottom: -8 }),
              }}
            />
            <EnhancedSeeker mode={mode}>
              <EnhancedTimer />
            </EnhancedSeeker>
          </View>
        </View>
      </Overlay>
    </VideoContainer>
  );
};

export default YoutubePlayer;
