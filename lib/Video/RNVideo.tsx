import React, { forwardRef } from 'react';
import Video, { VideoProperties } from 'react-native-video';
import { useInternalCtx } from '../InternalCtx';
import { useVideoCtx } from '../ScreenContainer';

const RNVideo = forwardRef<
  Video,
  Omit<VideoProperties, 'resizeMode' | 'controls' | 'paused'>
>(({ onEnd, onLoad, onProgress, ...props }, ref) => {
  const {
    videoInstance,
    setState,
    mutableState,
    seekerRef,
    duration,
    paused,
  } = useInternalCtx();
  const { setIsLandscape } = useVideoCtx();
  return (
    <Video
      {...props}
      ref={(videoRef) => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(videoRef);
          } else {
            ref.current = videoRef;
          }
        }
        if (videoRef) {
          videoInstance.current = videoRef;
        }
      }}
      onEnd={() => {
        onEnd?.();
        setState({ ended: true });
      }}
      onLoad={(data) => {
        onLoad?.(data);
        setState({ ended: false, duration: data.duration });
        setIsLandscape(data.naturalSize.orientation === 'landscape');
      }}
      onProgress={(data) => {
        onProgress?.(data);
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
  );
});

export default RNVideo;
