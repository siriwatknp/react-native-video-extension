import { StyleSheet, useWindowDimensions } from 'react-native';
import { useFullscreenTransform } from './useFullscreenTransform';
import { useVideoCtx } from './ScreenContainer';

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
    fullscreenToggle: styles.fullscreenToggle,
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
});
