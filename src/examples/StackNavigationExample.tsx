import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer, useVideoCtx, YoutubePlayer } from '../../lib';
import PostContent from '../components/PostContent';
import { RootStackParamList } from '../../App';

export type NavigationExampleProps = {
  navigation: StackNavigationProp<RootStackParamList, 'StackNavigationExample'>;
};

const HeaderAdjustment = ({ navigation }: NavigationExampleProps) => {
  const { fullscreen } = useVideoCtx();
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
    navigation.setOptions({ headerShown: !fullscreen });
  }, [fullscreen, navigation]);
  return null;
};

const StackNavigationExample = ({ navigation }: NavigationExampleProps) => (
  <ScreenContainer>
    {/* If you want to wrap with View, don't forget to add flex: 1 or flexGrow: 1 */}
    <HeaderAdjustment navigation={navigation} />
    <YoutubePlayer
      source={{
        uri: 'https://stream.mux.com/Tyu80069gbkJR2uIYlz2xARq8VOl4dLg3.m3u8',
      }}
      mode="auto-fit"
    />
    <ScrollView style={{ flex: 1 }}>
      <PostContent />
    </ScrollView>
  </ScreenContainer>
);

export default StackNavigationExample;
