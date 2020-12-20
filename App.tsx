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
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/Home';
import Player from './src/Player';
import Layout from './src/Layout';
import Lock from './src/Lock';
import Canvas from './src/Canvas';

declare const global: { HermesInternal: null | {} };

const Stack = createStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  Player: undefined;
  Layout: undefined;
  Lock: undefined;
  Canvas: undefined;
};

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Player" component={Player} />
          <Stack.Screen name="Layout" component={Layout} />
          <Stack.Screen name="Lock" component={Lock} />
          <Stack.Screen name="Canvas" component={Canvas} />
        </Stack.Navigator>
      </NavigationContainer>
      {global.HermesInternal == null ? null : (
        <View style={styles.engine}>
          <Text style={styles.footer}>Engine: Hermes</Text>
        </View>
      )}
    </SafeAreaProvider>
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
