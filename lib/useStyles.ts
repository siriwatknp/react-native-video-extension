import { StyleSheet, useWindowDimensions } from 'react-native';
import { useFullscreenTransform } from './animation';
import { useVideoCtx } from './ScreenContainer';

const BOTTOM_OFFSET = 40;

export const useStyles = () => {
  const { fullscreen } = useVideoCtx();
  const { animatedTransform, staticTransform } = useFullscreenTransform();
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
    seekbarProgress: styles.seekbarProgress,
    seekbarTime: styles.seekbarTime,
    time: styles.time,
    seekbarThumb: styles.seekbarThumb,
    seekbarThumbTouched: styles.seekbarThumbTouched,
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
    position: 'absolute',
    bottom: 16,
    right: 16,
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
    backgroundColor: 'rgba(255,255,255,0.5)',
    zIndex: 1,
  },
  seekbarProgress: {
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#ff2525',
    position: 'absolute',
  },
  seekbarTime: {
    left: 16,
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  seekbarThumb: {
    backgroundColor: '#ff2525',
    borderRadius: 40,
    zIndex: 100,
    width: 16,
    height: 16,
    top: -7,
    transform: [{ translateX: -8 }],
  },
  seekbarThumbTouched: {
    width: 24,
    height: 24,
    top: -10,
    transform: [{ translateX: -12 }],
  },
});
