import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import Background from '../lib/Background';

import { getAutoFitCanvasLayout } from '../lib/LayoutUtil';
import { RootStackParamList } from '../App';

type LockNavigationProp = StackNavigationProp<RootStackParamList, 'Lock'>;

export type LockProps = {
  navigation: LockNavigationProp;
};

const Lock = ({ navigation }: LockProps) => {
  const isPortraitLocked = true;
  const insets = useSafeAreaInsets();
  const [fullscreen, setFullscreen] = useState(false);
  // useEffect(() => {
  //   const handleOrientation = (type: any) => {
  //     console.log('type', type);
  //   }
  //   Orientation.addDeviceOrientationListener(handleOrientation);
  //   return () => {
  //     Orientation.removeDeviceOrientationListener(handleOrientation);
  //   };
  // }, [])
  useEffect(() => {
    console.log('test');
    navigation.setOptions({
      headerShown: false,
    });
    if (isPortraitLocked) {
      Orientation.lockToPortrait();
    } else {
      Orientation.unlockAllOrientations();
    }
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Button title={'Enter'} onPress={() => setFullscreen(true)} />
      <Background fullscreen={fullscreen}>
        <TouchableOpacity
          style={{ top: 200, left: 100 }}
          onPress={() => setFullscreen(false)}
        >
          <Text style={{ color: '#fff' }}>Exit</Text>
        </TouchableOpacity>
      </Background>
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.38)',
          justifyContent: 'center',
          alignItems: 'center',
          ...getAutoFitCanvasLayout({
            isPortraitLocked: false,
            isLandscapeVideo: false,
            isLandscapeDevice: false,
            insets,
          }),
        }}
      >
        <Text style={{ color: '#fff' }}>Hello Test</Text>
      </View>
    </View>
  );
};

export default Lock;
