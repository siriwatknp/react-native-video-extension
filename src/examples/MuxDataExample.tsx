import React from 'react';
import { View, Text, Linking } from 'react-native';
import muxReactNativeVideo from 'mux-react-native-video-sdk';
import { YoutubePlayer } from '../../lib';

// wrap the `Video` component with Mux functionality
const MuxVideo = muxReactNativeVideo(YoutubePlayer);
// or
// const MuxVideo = muxReactNativeVideo(FacebookPlayer);

export type BasicProps = {};

const BasicExample = ({}: BasicProps) => (
  <View
    style={{
      paddingTop: 48,
      flex: 1, // important, try removing flex: 1 and enter fullscreen
    }}
  >
    <MuxVideo
      mode="contain"
      source={{
        uri:
          'https://stream.mux.com/RvflnSja01tV00MWLYllWwp6GhE7t6RT01jRPfZJIwJM7I.m3u8',
      }}
      renderToolbar={() => (
        <Text style={{ color: '#fff', padding: 16, fontSize: 16 }}>
          This is a video title.
        </Text>
      )}
      muxOptions={{
        application_name: 'ReactNativeVideoExtension', // (required) the name of your application
        application_version: 'app.version', // the version of your application (optional, but encouraged)
        data: {
          env_key: 'YOUR_ENVIRONMENT_KEY', // (required)
          player_software_version: '5.0.2', // (optionaal, but encouraged) the version of react-native-video that you are using
          player_name: 'React Native Player', // See metadata docs for available metadata fields https://docs.mux.com/docs/web-integration-guide#section-5-add-metadata
          video_id: 'My Video Id',
          video_title: 'My awesome video',
        },
      }}
    />
    <View style={{ padding: 16 }}>
      <Text>For more information, checkout</Text>
      <Text
        style={{ color: '#0077cc', textDecorationLine: 'underline' }}
        onPress={() =>
          Linking.openURL(
            'https://github.com/muxinc/mux-stats-sdk-react-native-video',
          )
        }
      >
        https://github.com/muxinc/mux-stats-sdk-react-native-video
      </Text>
    </View>
  </View>
);

export default BasicExample;
