import { StyleSheet } from 'react-native';
import { useAnimatedFullscreen } from './animation';
import { useVideoCtx } from './ScreenContainer';
import { AspectRatio } from './utils';
import DimensionManager from './DimensionManager';
import useInsets from './InsetInterface';

const useControllerStyles = (
  aspectRatio: AspectRatio,
  isLandscape: boolean,
) => {
  const insets = useInsets();
  const { fullscreen } = useVideoCtx();
  const {
    animatedTransform,
    animatedOpacity,
    staticTransform,
    fullscreenSize,
  } = useAnimatedFullscreen(fullscreen, isLandscape);
  return {
    container: StyleSheet.flatten([
      styles.container,
      fullscreen ? styles.fullscreenContainer : styles.initialContainer,
    ]),
    controller: StyleSheet.flatten([
      styles.controller,
      fullscreen && styles.fullscreenController,
      {
        transform: animatedTransform,
      },
      animatedOpacity,
      DimensionManager.getPlayerSize({
        insets,
        fullscreen: !!fullscreen,
        isLandscape,
      }),
    ]),
    video: {
      width: '100%',
      height: '100%',
    },
    playerBg: StyleSheet.flatten([
      styles.playerBg,
      fullscreen
        ? {
            ...fullscreenSize,
            transform: staticTransform,
          }
        : styles.fullscreenBgOverlay,
    ]),
    fullscreenToggle: {
      ...styles.fullscreenToggle,
      ...(fullscreen && { bottom: 56 }),
    },
    play: fullscreen ? styles.playFullscreen : styles.play,
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
});

export default useControllerStyles;
