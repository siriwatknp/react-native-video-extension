import { StyleSheet, useWindowDimensions } from 'react-native';
import useInsets from './InsetInterface';
import { useVideoCtx } from './ScreenContainer';
import { getThumbTopOffset } from './utils';
import { getSeekerLayout } from './LayoutCalc';

const BOTTOM_OFFSET = 40;
const THUMB_PADDING = 12;

const useSeekerStyles = () => {
  const { fullscreen, isLandscape, config } = useVideoCtx();
  const windowSize = useWindowDimensions();
  const insets = useInsets();
  const seekerLayout = getSeekerLayout(windowSize, {
    insets,
    fullscreen: !!fullscreen,
    isLandscape,
  });
  return {
    seekbarContainer: StyleSheet.flatten([
      styles.seekbar,
      fullscreen && styles.fullscreenSeekbar,
      seekerLayout,
    ]),
    seekbarProgress: StyleSheet.flatten([
      styles.seekbarProgress,
      { backgroundColor: config.seekerColor },
    ]),
    seekbarTime: {
      ...styles.seekbarTime,
      ...(fullscreen && styles.seekbarTimeFullscreen),
    },
    seekbarBuffer: styles.seekbarBuffer,
    time: styles.time,
    seekerThumbWrapper: StyleSheet.flatten([
      styles.seekerThumbWrapper,
      seekerLayout,
      {
        bottom: getThumbTopOffset(
          config.seekerThickness,
          config.thumbRadius + THUMB_PADDING,
        ),
      },
      fullscreen && { bottom: BOTTOM_OFFSET },
    ]),
    seekerThumbRing: StyleSheet.flatten([
      styles.seekerThumbRing,
      {
        padding: THUMB_PADDING,
        left: -config.thumbRadius - THUMB_PADDING,
      },
    ]),
    seekerThumbRingTouched: {
      top: (config.thumbRadius - config.thumbTouchedRadius),
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
  seekbar: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.38)',
    zIndex: 1,
  },
  fullscreenSeekbar: {
    bottom: BOTTOM_OFFSET,
    height: 4,
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
  seekbarTimeFullscreen: {
    left: 0,
    bottom: 20,
  },
  time: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  seekerThumbWrapper: {
    position: 'absolute',
    zIndex: 10,
    bottom: 0,
    height: 40,
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

export default useSeekerStyles;
