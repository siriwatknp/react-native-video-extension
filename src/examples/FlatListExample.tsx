import React from 'react';
import { SafeAreaView, FlatList } from 'react-native';
import { FacebookPlayer, ScreenContainer } from '../../lib';
import { MoreVideo } from '../components/PostContent';

export type FlatListExampleProps = {};

const FlatListExample = ({}: FlatListExampleProps) => (
  <ScreenContainer
  // ScreenContainer store some state that we can hook in
  // ex, fullscreen, seeking, consoleHidden, loading
  >
    {({ fullscreen, seeking }) => {
      return (
        <SafeAreaView
          // always stretch to fill empty space
          style={{ flex: 1, backgroundColor: fullscreen ? '#000' : '#fff' }}
        >
          <FlatList
            data={[...Array(8)]}
            ListHeaderComponent={
              <FacebookPlayer
                source={{
                  uri:
                    'https://stream.mux.com/Tyu80069gbkJR2uIYlz2xARq8VOl4dLg3.m3u8',
                }}
                mode="contain"
              />
            }
            keyExtractor={(item, index) => index.toString()}
            renderItem={() => <MoreVideo />}
            // disable scrolling inside scroll view while in fullscreen or seeking
            scrollEnabled={!fullscreen && !seeking}
            style={{ flex: 1 }}
            // need to stretch with flex: 1 when fullscreen
            // because VideoPlayer will be absolute
            contentContainerStyle={{ flex: fullscreen ? 1 : 0 }}
          />
        </SafeAreaView>
      );
    }}
  </ScreenContainer>
);

export default FlatListExample;
