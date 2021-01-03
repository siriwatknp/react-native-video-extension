/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/Home';
import Players from './src/Players';
import Canvas from './src/Canvas';
import StackNavigationExample from './src/examples/StackNavigationExample';
import BasicExample from './src/examples/BasicExample';
import ScrollViewExample from './src/examples/ScrollViewExample';
import FlatListExample from './src/examples/FlatListExample';
import SafeAreaExample from './src/examples/SafeAreaExample';
import ButtonBase from './src/components/ButtonBase';

declare const global: { HermesInternal: null | {} };

const Stack = createStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  Players: undefined;
  Canvas: undefined;
  StackNavigationExample: undefined;
};

const SCREENS = [
  'basic',
  'safeArea',
  'scrollView',
  'flatList',
  'navigation',
] as const;

const App = () => {
  const [visible, setVisible] = useState(false);
  const [screen, setScreen] = useState<typeof SCREENS[number]>('navigation');
  return (
    <SafeAreaProvider>
      {screen === 'navigation' && (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Players" component={Players} />
            <Stack.Screen name="Canvas" component={Canvas} />
            <Stack.Screen
              name="StackNavigationExample"
              component={StackNavigationExample}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
      {screen === 'basic' && <BasicExample />}
      {screen === 'safeArea' && <SafeAreaExample />}
      {screen === 'scrollView' && <ScrollViewExample />}
      {screen === 'flatList' && <FlatListExample />}
      {global.HermesInternal == null ? null : (
        <View style={styles.engine}>
          <Text style={styles.footer}>Engine: Hermes</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.apps}
        onPress={() => setVisible(true)}
        activeOpacity={0.6}
      >
        <Image
          source={require('./src/baseline_apps_white_24pt_2x.png')}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>
      <Modal
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.paper}>
          {SCREENS.map((s, index) => (
            <ButtonBase
              key={s}
              onPress={() => {
                setScreen(s);
                setVisible(false);
              }}
              style={{ marginTop: index !== 0 ? 16 : 0 }}
            >
              {s.substr(0, 1).toUpperCase() + s.substring(1)}
            </ButtonBase>
          ))}
        </View>
      </Modal>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  apps: {
    position: 'absolute',
    top: 64,
    right: 16,
    padding: 12,
    backgroundColor: '#ff9800',
    borderRadius: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.38,
    shadowRadius: 8,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  paper: {
    justifyContent: 'center',
    padding: 16,
    flex: 1,
    backgroundColor: '#e9e9e9',
  },
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
