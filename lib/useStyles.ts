import { StyleSheet, useWindowDimensions } from 'react-native';
import { useFullscreenTransform } from './animation';
import { useVideoCtx } from './ScreenContainer';
import { getThumbTopOffset } from './utils';

const BOTTOM_OFFSET = 40;
const THUMB_PADDING = 12;

export const useStyles = () => {
  const { fullscreen, config } = useVideoCtx();
  const { animatedTransform, staticTransform } = useFullscreenTransform(fullscreen, true);
  const { width, height } = useWindowDimensions();
  return {
    container: StyleSheet.flatten([
      styles.container,
      fullscreen ? styles.fullscreenContainer : styles.initialContainer,
    ]),
    controller: StyleSheet.flatten([
      styles.controller,
      fullscreen && {
        width: height,
        height: width,
        ...styles.fullscreenController,
      },
      {
        transform: animatedTransform,
      },
    ]),
    video: StyleSheet.flatten([
      fullscreen ? styles.fullscreenVideo : styles.initialVideo,
    ]),
    playerBg: StyleSheet.flatten([
      styles.playerBg,
      fullscreen
        ? {
            width: height,
            height: width,
            transform: staticTransform,
          }
        : styles.fullscreenBgOverlay,
    ]),
    fullscreenToggle: {
      ...styles.fullscreenToggle,
      ...(fullscreen && { bottom: BOTTOM_OFFSET + 24, right: 32 }),
    },
    play: fullscreen ? styles.playFullscreen : styles.play,
    seekbarBg: StyleSheet.flatten([
      fullscreen ? styles.fullscreenSeekbar : styles.seekbar,
      styles.seekbarBg,
    ]),
    seekbarProgress: StyleSheet.flatten([
      styles.seekbarProgress,
      { backgroundColor: config.seekerColor },
    ]),
    seekbarTime: styles.seekbarTime,
    seekbarBuffer: styles.seekbarBuffer,
    time: styles.time,
    seekerThumbRing: StyleSheet.flatten([
      styles.seekerThumbRing,
      {
        padding: THUMB_PADDING,
        top: getThumbTopOffset(
          config.seekerThickness,
          config.thumbRadius + THUMB_PADDING,
        ),
        left: -config.thumbRadius - THUMB_PADDING,
      }
    ]),
    seekerThumbRingTouched: {
      top: getThumbTopOffset(
        config.seekerThickness,
        config.thumbTouchedRadius + THUMB_PADDING,
      ),
      left: -config.thumbTouchedRadius - THUMB_PADDING,
    },
    seekbarThumb: StyleSheet.flatten([
      styles.seekbarThumb,
      {
        width: config.thumbRadius * 2,
        height: config.thumbRadius * 2,
        backgroundColor: config.seekerColor,
      },
    ]),
    seekbarThumbTouched: {
      width: config.thumbTouchedRadius * 2,
      height: config.thumbTouchedRadius * 2,
    },
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    zIndex: 1,
  },
  initialContainer: {
    width: '100%',
  },
  fullscreenContainer: {
    position: 'absolute',
    zIndex: 1000000,
    top: 0,
    left: 0,
  },
  controller: {
    zIndex: 1,
  },
  fullscreenController: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  playerBg: {
    backgroundColor: '#000',
    position: 'absolute',
  },
  fullscreenBgOverlay: {
    top: 0,
    left: 0,
  },
  initialVideo: {
    height: undefined,
    aspectRatio: 16 / 9,
    maxWidth: '100%',
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
  },
  fullscreenToggle: {
    padding: 8,
    position: 'absolute',
    bottom: 16,
    right: 8,
  },
  play: {
    marginHorizontal: 48,
  },
  playFullscreen: {
    marginHorizontal: '12%%',
  },
  seekbar: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '100%',
  },
  fullscreenSeekbar: {
    position: 'absolute',
    bottom: BOTTOM_OFFSET,
    height: 4,
    width: '90%',
    left: '5%',
  },
  seekbarBg: {
    backgroundColor: 'rgba(255,255,255,0.38)',
    zIndex: 1,
  },
  seekbarProgress: {
    // @ts-ignore
    ...StyleSheet.absoluteFill,
    zIndex: 2,
  },
  seekbarBuffer: {
    // @ts-ignore
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.38)',
    zIndex: 1,
  },
  seekbarTime: {
    left: 16,
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
  },
  time: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  seekerThumbRing: {
    position: 'absolute',
    padding: THUMB_PADDING,
    zIndex: 5,
  },
  seekbarThumb: {
    borderRadius: 40,
    zIndex: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.24,
    shadowRadius: 2,
    shadowOffset: {
      width: -1,
      height: 1,
    },
  },
});
