import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../App';

type HomeNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export type HomeProps = {
  navigation: HomeNavigationProp;
};

const Home = ({ navigation }: HomeProps) => {
  useEffect(() => {
    navigation.navigate('StackNavigationExample');
  }, [navigation]);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Stack Navigation Example"
        onPress={() => navigation.navigate('StackNavigationExample')}
      />
      <View style={{ height: 24 }} />
      <Button title="Players" onPress={() => navigation.navigate('Players')} />
      <View style={{ height: 24 }} />
      <Button title="Canvas" onPress={() => navigation.navigate('Canvas')} />
    </View>
  );
};

export default Home;
