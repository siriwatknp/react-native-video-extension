import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Video, { VideoProperties } from 'react-native-video';

export interface VideoPlusProps extends VideoProperties {
  style?: ViewProps['style'];
  videoStyle?: VideoProperties['style'];
}

const VideoPlus = ({ style, videoStyle, ...props }: VideoPlusProps) => {
  return (
    <View style={[styles.container, style]}>
      <Video style={[styles.video, videoStyle]} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  video: {
    height: undefined,
    aspectRatio: 16 / 9,
  },
});

export default VideoPlus;
