import React, { useRef, useState } from 'react';
import { Animated, View, ViewProps, TouchableOpacity } from 'react-native';
import Video, { VideoProperties } from 'react-native-video';
import { useVideoCtx } from './ScreenContainer';
// import Seeker from './Seeker';
import Seeker from './Seeker/Seeker';
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

const VideoPlayer = ({
  initialPaused,
  initialAspectRatio = 'landscape',
  style,
  videoStyle,
  ...props
}: VideoPlayerProps) => {
  let videoInstance = useRef<Video>();
  const [ended, setEnded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [bufferTime, setBufferTime] = useState(0);
  const paused = usePaused(initialPaused);
  const prevPaused = useRef(paused);
  const {
    fullscreen,
    enterFullscreen,
    exitFullscreen,
    isLandscape,
    setIsLandscape,
    setPaused,
    setSeeking,
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
            setEnded(true);
          }}
          onLoad={(data) => {
            setEnded(false);
            setDuration(data.duration);
            setIsLandscape(data.naturalSize.orientation === 'landscape');
          }}
          onProgress={(data) => {
            setEnded(false);
            setCurrentTime(data.currentTime);
            setBufferTime(data.playableDuration);
          }}
          onSeek={(data) => {
            setCurrentTime(data.currentTime);
            setSeeking(false);
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
                videoInstance.current?.seek(
                  currentTime - 10 < 0 ? 0.1 : currentTime - 10,
                );
              }}
            >
              <SvgReplay10 />
            </TouchableOpacity>
            {ended ? (
              <TouchableOpacity
                onPress={() => {
                  videoInstance.current?.seek(0);
                  setEnded(false);
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
                videoInstance.current?.seek(
                  currentTime + 10 > duration
                    ? duration - 0.1
                    : currentTime + 10,
                );
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
          progress={duration ? currentTime / duration : 0}
          buffer={duration ? bufferTime / duration : 0}
          onSeek={(data) => {
            console.log('data', data);
            if (data.eventName === 'GRANT') {
              // videoInstance.current?.seek(duration * data.ratio)
              setCurrentTime(duration * data.ratio)
              prevPaused.current = paused
              setPaused(true)
            }
            if (data.eventName === 'MOVE') {
              // videoInstance.current?.seek(duration * data.ratio)
              // setCurrentTime(duration * data.ratio)
            }
            if (data.eventName === 'RELEASE') {
              videoInstance.current?.seek(duration * data.ratio)
              setPaused(prevPaused.current)
            }
          }}
        />
        {/*<Seeker*/}
        {/*  videoInstance={videoInstance.current}*/}
        {/*  duration={duration}*/}
        {/*  currentTime={currentTime}*/}
        {/*  bufferTime={bufferTime}*/}
        {/*  isLandscapeVideo={isLandscape}*/}
        {/*  vertical={fullscreen && isLandscape}*/}
        {/*/>*/}
      </Animated.View>
      <View style={styles.playerBg} />
    </View>
  );
};

export default VideoPlayer;
