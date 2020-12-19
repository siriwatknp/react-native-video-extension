import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Orientation from 'react-native-orientation-locker';
import Background from '../lib/Background';

import { RootStackParamList } from '../App';

type LockNavigationProp = StackNavigationProp<RootStackParamList, 'Lock'>;

export type LockProps = {
  navigation: LockNavigationProp;
};

const Lock = ({ navigation }: LockProps) => {
  const isPortraitLocked = true;
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
          position: 'absolute',
          backgroundColor: 'rgba(0,0,0,0.38)',
          width: 500,
          height: 100,
          top: '50%',
          left: '50%',
          transform: [
            { translateX: -250 },
            { translateY: -50 },
            { rotate: '10deg' },
          ],
        }}
      />
    </View>
  );
};

export default Lock;
