import React, { useEffect, useReducer } from 'react';
import { View, TouchableOpacity, Text, Switch, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Orientation, { OrientationType } from 'react-native-orientation-locker';
import Background from '../lib/Background';

import {
  getAutoFitCanvasLayout,
  getContainCanvasLayout,
} from '../lib/LayoutUtil';
import { RootStackParamList } from '../App';
import { OrientationValue } from '../lib';

type CanvasNavigationProp = StackNavigationProp<RootStackParamList, 'Canvas'>;

export type CanvasProps = {
  navigation: CanvasNavigationProp;
};

type State = {
  fullscreen: boolean;
  isPortraitLocked: boolean;
  isLandscapeVideo: boolean;
  isLandscapeDevice: boolean;
  deviceOrientation: OrientationValue;
  mode: 'auto-fit' | 'contain' | '';
  hasInsets: boolean;
};
type Reducer = (s: State, a: Partial<State>) => State;

const Canvas = ({ navigation }: CanvasProps) => {
  const insets = useSafeAreaInsets();
  const [
    {
      mode,
      isPortraitLocked,
      deviceOrientation,
      isLandscapeVideo,
      isLandscapeDevice,
      fullscreen,
      hasInsets,
    },
    setState,
  ] = useReducer<Reducer>((s, a) => ({ ...s, ...a }), {
    fullscreen: false,
    isPortraitLocked: false,
    isLandscapeVideo: false,
    isLandscapeDevice: false,
    deviceOrientation: 'UNKNOWN',
    hasInsets: false,
    mode: '',
  });
  useEffect(() => {
    if (isPortraitLocked) {
      Orientation.lockToPortrait();
    } else {
      Orientation.unlockAllOrientations();
    }
  }, [isPortraitLocked]);
  useEffect(() => {
    const handleOrientation = (type: OrientationType) => {
      setState({
        isLandscapeDevice: type.startsWith('LANDSCAPE'),
        deviceOrientation: type,
      });
    };
    Orientation.addDeviceOrientationListener(handleOrientation);
    return () => {
      Orientation.removeDeviceOrientationListener(handleOrientation);
    };
  }, []);
  useEffect(() => {
    if (fullscreen) {
      navigation.setOptions({ headerShown: false });
    } else {
      navigation.setOptions({ headerShown: true });
    }
  }, [fullscreen]);
  const layoutData = {
    isPortraitLocked,
    isLandscapeVideo,
    isLandscapeDevice,
    deviceOrientation,
    insets: hasInsets ? insets : undefined,
  };
  const fullscreenStyle = (function () {
    if (mode === 'auto-fit') {
      return getAutoFitCanvasLayout(layoutData);
    }
    if (mode === 'contain') {
      return getContainCanvasLayout(layoutData);
    }
  })();
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.row}>
        <Text style={{ fontSize: 20 }}>isPortraitLocked</Text>
        <Switch
          value={isPortraitLocked}
          onValueChange={(bool) => setState({ isPortraitLocked: bool })}
        />
      </View>
      <View style={styles.row}>
        <Text style={{ fontSize: 20 }}>isLandscapeDevice</Text>
        <Switch
          value={isLandscapeDevice}
          onValueChange={(bool) => setState({ isLandscapeDevice: bool })}
        />
      </View>
      <View style={styles.row}>
        <Text style={{ fontSize: 20 }}>isLandscapeVideo</Text>
        <Switch
          value={isLandscapeVideo}
          onValueChange={(bool) => setState({ isLandscapeVideo: bool })}
        />
      </View>
      <View style={styles.row}>
        <Text style={{ fontSize: 20 }}>hasInsets</Text>
        <Switch
          value={hasInsets}
          onValueChange={(bool) => setState({ hasInsets: bool })}
        />
      </View>
      <View style={{ padding: 16 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setState({ fullscreen: true, mode: 'auto-fit' })}
        >
          <Text style={{ fontSize: 16 }}>Enter AutoFit Fullscreen</Text>
        </TouchableOpacity>
      </View>
      <View style={{ padding: 16, marginTop: -16 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setState({ fullscreen: true, mode: 'contain' })}
        >
          <Text style={{ fontSize: 16 }}>Enter Contain Fullscreen</Text>
        </TouchableOpacity>
      </View>
      <Background
        fullscreen={fullscreen}
        style={{ backgroundColor: 'rgba(0,0,0,0.54)' }}
      />
      <View
        style={
          fullscreen
            ? {
                backgroundColor: 'rgba(0,0,0,0.38)',
                justifyContent: 'center',
                alignItems: 'center',
                ...fullscreenStyle,
              }
            : { height: 0, width: 0 }
        }
      >
        <TouchableOpacity onPress={() => setState({ fullscreen: false })}>
          <Text style={{ color: '#fff' }}>Exit Fullscreen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e9e9e9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
  },
});

export default Canvas;
