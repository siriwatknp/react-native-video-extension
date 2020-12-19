import React, {useEffect, useState} from 'react';
import { View, SafeAreaView, Text, Dimensions, useWindowDimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Orientation from 'react-native-orientation-locker';
import { useDeviceOrientation } from "./useDeviceOrientation";

import { RootStackParamList } from '../App';

type LayoutNavigationProp = StackNavigationProp<RootStackParamList, 'Layout'>;

export type LayoutProps = {
  navigation: LayoutNavigationProp;
};

Orientation.lockToPortrait();
// Orientation.unlockAllOrientations();

const windowDim = Dimensions.get('window')
const screenDim = Dimensions.get('screen')
console.log('windowDim', windowDim);
console.log('screenDim', screenDim);


const Layout = ({}: LayoutProps) => {
  const forceUpdate = useState({})[1]
  const windowSize = useWindowDimensions();
  // console.log('windowSize', windowSize);
  useEffect(() => {
    const handleOrientation = (type: any) => {
      forceUpdate({})
      console.log('type', type);
    }
    Orientation.addDeviceOrientationListener(handleOrientation);
    return () => {
      Orientation.removeDeviceOrientationListener(handleOrientation);
    };
  }, []);
  const result = useDeviceOrientation()
  // console.log('result', result);
  return <View />;
};

export default Layout;
