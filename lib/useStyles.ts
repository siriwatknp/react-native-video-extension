import { StyleSheet, useWindowDimensions } from 'react-native';
import { useFullscreenTransform } from './useFullscreenTransform';
import { useVideoCtx } from './ScreenContainer';

const BOTTOM_OFFSET = 40

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
    bgOverlay: StyleSheet.flatten([
      styles.bgOverlay,
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
    play: styles.play,
    seekbarBg: StyleSheet.flatten([
      fullscreen ? styles.fullscreenSeekbar : styles.seekbar,
      styles.seekbarBg,
    ]),
    seekbarProgress: styles.seekbarProgress,
    seekbarTime: styles.seekbarTime,
    time: styles.time
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
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
  bgOverlay: {
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
    padding: 8,
  },
  play: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
  },
  seekbar: {
    position: 'absolute',
    bottom: 0,
    height: 3,
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
    bottom: 20,
    flexDirection: 'row',
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  }
});
