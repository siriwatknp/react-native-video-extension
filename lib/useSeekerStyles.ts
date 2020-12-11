import { StyleSheet } from 'react-native';
import { useVideoCtx } from './ScreenContainer';
import { getThumbTopOffset } from './utils';

const BOTTOM_OFFSET = 40;
const THUMB_PADDING = 12;

const useSeekerStyles = () => {
  const { fullscreen, config } = useVideoCtx();
  return {
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

export default useSeekerStyles;
