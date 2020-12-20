import React, { useReducer, useRef, useState } from 'react';
import { Animated, View, ViewProps, TouchableOpacity } from 'react-native';
import Video, { VideoProperties } from 'react-native-video';
import { useVideoCtx } from './ScreenContainer';
import Seeker from './Seeker/Seeker';
import Timer from './Timer';
import Overlay from './Overlay';
import useControllerStyles from './useControllerStyles';
import usePaused from './usePause';
import {
  SvgFullscreen,
  SvgExitFullscreen,
  SvgPlayArrow,
  SvgPause,
  SvgReplay10,
  SvgForward10,
  SvgRefresh,
} from '../src/icons';
import { AspectRatio } from './utils';

export interface VideoPlayerProps extends Omit<VideoProperties, 'paused'> {
  style?: ViewProps['style'];
  videoStyle?: VideoProperties['style'];
  initialPaused?: boolean;
  initialAspectRatio?: AspectRatio;
}

// View Hierarchy
// |- Container
//    |- Controller
//    |  |- RNVideo
//    |- BgOverlay

type State = {
  ended: boolean;
  duration: number;
  bufferTime: number;
};
interface Reducer {
  (s: State, a: Partial<State>): State;
}

const VideoPlayer = ({
  initialPaused,
  initialAspectRatio = 'landscape',
  style,
  videoStyle,
  ...props
}: VideoPlayerProps) => {
  let videoInstance = useRef<Video>();
  const seekerRef = useRef<any>({}).current;
  const [{ duration, bufferTime, ended }, setState] = useReducer<Reducer>(
    (s, a) => ({ ...s, ...a }),
    {
      duration: 0,
      bufferTime: 0,
      ended: false,
    },
  );
  const paused = usePaused(initialPaused);
  const forceUpdate = useState({})[1];
  const mutableState = useRef({
    prevPaused: paused,
    currentTime: 0,
  }).current;
  const {
    fullscreen,
    enterFullscreen,
    exitFullscreen,
    isLandscape,
    setIsLandscape,
    setPaused,
    setSeeking,
    consoleHidden,
  } = useVideoCtx();
  const styles = useControllerStyles(initialAspectRatio, isLandscape);
  return (
    <View style={styles.container}>
      <Animated.View style={styles.controller}>
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
            mutableState.currentTime = data.currentTime;
            seekerRef.seek?.(data.currentTime / duration)
          }}
          paused={paused}
          controls={false}
          resizeMode={'contain'}
        />
        <Overlay>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => {
                forceUpdate({});
                const seconds =
                  mutableState.currentTime - 10 < 0
                    ? 0.1
                    : mutableState.currentTime - 10;
                videoInstance.current?.seek(seconds);
                seekerRef.seek?.(seconds / duration)
              }}
            >
              <SvgReplay10 />
            </TouchableOpacity>
            {ended ? (
              <TouchableOpacity
                onPress={() => {
                  videoInstance.current?.seek(0);
                  setState({ ended: false });
                }}
                style={styles.play}
              >
                <SvgRefresh />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.play}
                onPress={() => setPaused((bool) => !bool)}
              >
                {paused ? <SvgPlayArrow /> : <SvgPause />}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => {
                forceUpdate({});
                const seconds =
                  mutableState.currentTime + 10 > duration
                    ? duration - 0.1
                    : mutableState.currentTime + 10;
                videoInstance.current?.seek(seconds);
                seekerRef.seek?.(seconds / duration)
              }}
            >
              <SvgForward10 />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.fullscreenToggle}
            onPress={fullscreen ? exitFullscreen : enterFullscreen}
          >
            {fullscreen ? <SvgExitFullscreen /> : <SvgFullscreen />}
          </TouchableOpacity>
        </Overlay>
        <Seeker
          innerRef={seekerRef}
          buffer={duration ? bufferTime / duration : 0}
          onSeek={(data) => {
            if (data.eventName === 'GRANT') {
              mutableState.prevPaused = paused;
              setPaused(true);
              setSeeking(true);
            }
            if (data.eventName === 'MOVE') {
              mutableState.currentTime = duration * data.ratio;
              forceUpdate({}); // to trigger timer update when dragging thumb
            }
            if (data.eventName === 'RELEASE') {
              videoInstance.current?.seek(duration * data.ratio);
              setPaused(mutableState.prevPaused);
              setSeeking(false);
            }
          }}
        >
          <Timer
            currentTime={mutableState.currentTime}
            duration={duration}
            hidden={consoleHidden}
          />
        </Seeker>
      </Animated.View>
      <View style={styles.playerBg} />
    </View>
  );
};

export default VideoPlayer;
