import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Orientation from 'react-native-orientation-locker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import YoutubePlayer from '../lib/players/YoutubePlayer';
import FacebookPlayer from '../lib/players/FacebookPlayer';
import { RootStackParamList } from '../App';
import { ScreenContainer, useVideoCtx } from '../lib';
import { connectOrientationLib, connectUseInsets } from '../lib';

connectUseInsets(useSafeAreaInsets);
connectOrientationLib(Orientation);
// Orientation.unlockAllOrientations();

type PlayersNavigationProp = StackNavigationProp<RootStackParamList, 'Players'>;

export type PlayersProps = {
  navigation: PlayersNavigationProp;
};

const HeaderAdjustment = ({ navigation }: PlayersProps) => {
  const { fullscreen } = useVideoCtx();
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
    navigation.setOptions({ headerShown: !fullscreen });
  }, [fullscreen, navigation]);
  return null;
};

const getStyle = (active = false) =>
  ({
    touch: {
      alignItems: 'center',
      padding: 12,
      borderRadius: 4,
      backgroundColor: active ? '#e4f7ff' : '#fff',
      borderWidth: active ? 1 : 0,
      borderColor: '#045ea0',
    },
    text: {
      color: active ? '#045ea0' : 'rgba(0,0,0,0.87)',
      fontWeight: active ? 'bold' : 'normal',
    },
  } as const);

type Player = 'youtube' | 'facebook';
const PLAYERS: {
  [k in Player]: typeof FacebookPlayer | typeof YoutubePlayer;
} = {
  facebook: FacebookPlayer,
  youtube: YoutubePlayer,
};

const Players = ({ navigation }: PlayersProps) => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [type, setType] = useState<Player>('youtube');
  const { width, height } = useWindowDimensions();
  const APlayer = PLAYERS[type];
  return (
    <ScreenContainer>
      {({ fullscreen, seeking }) => (
        <ScrollView
          scrollEnabled={!fullscreen && !seeking}
          contentContainerStyle={fullscreen && { width, height }}
          style={{ flex: 1 }}
        >
          <HeaderAdjustment navigation={navigation} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ padding: 8, flex: 1 }}>
                <TouchableOpacity
                  style={getStyle(type === 'youtube').touch}
                  onPress={() => setType('youtube')}
                >
                  <Text style={getStyle(type === 'youtube').text}>Youtube</Text>
                </TouchableOpacity>
              </View>
              <View style={{ padding: 8, flex: 1 }}>
                <TouchableOpacity
                  style={getStyle(type === 'facebook').touch}
                  onPress={() => setType('facebook')}
                >
                  <Text style={getStyle(type === 'facebook').text}>
                    Facebook
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <APlayer
              mode={'auto-fit'}
              initialMuted
              aspectRatio={isLandscape ? 'landscape' : 'portrait'}
              source={{
                uri: isLandscape
                  ? 'https://stream.mux.com/RvflnSja01tV00MWLYllWwp6GhE7t6RT01jRPfZJIwJM7I.m3u8'
                  : 'https://stream.mux.com/Dr7x01RuyU2yQJmlY8fZ2FW62yeAV02RR5MMkys7DiG8M.m3u8',
              }}
            />
            <View style={{ padding: 16 }}>
              <TouchableOpacity
                style={{
                  padding: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#e9e9e9',
                }}
                onPress={() => setIsLandscape((bool) => !bool)}
              >
                <Text>Switch to {isLandscape ? 'Portrait' : 'Landscape'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </ScreenContainer>
  );
};

export default Players;
