/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';

declare const global: { HermesInternal: null | {} };

import { VideoPlayer, ScreenContainer, FullscreenHidden } from './lib';

const App = () => {
  return (
    <ScreenContainer>
      {({ fullscreen, seeking }) => (
        <>
          <StatusBar barStyle="dark-content" />
          <FullscreenHidden>
            <View>
              <Text style={{ fontSize: 24, padding: 16 }}>Fixed Title</Text>
            </View>
          </FullscreenHidden>
          <ScrollView scrollEnabled={!fullscreen && !seeking} style={styles.scrollView}>
            <View
              style={{
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 40,
                  backgroundColor: '#a5a5a5',
                  marginRight: 16,
                }}
              />
              <View>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Author</Text>
                <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.6)' }}>
                  {new Date().toDateString()}
                </Text>
              </View>
            </View>
            <VideoPlayer
              muted
              source={{
                uri:
                  'https://stream.mux.com/G00t93XO3sf44WxV9N9ts1fpIHvXgLy72x86wW00lq8s4.m3u8',
              }}
            />
            <View style={{ padding: 16 }}>
              <Text style={{ color: 'rgb(4,77,205)' }}>#siriwatknp</Text>
              <Text style={{ fontSize: 20, marginVertical: 4 }}>
                React Native Video Extension is awesome!
              </Text>
              <Text style={{ color: 'rgba(0,0,0,0.6)' }}>
                1.2B views • just now
              </Text>
            </View>
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
          </ScrollView>
        </>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {},
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
