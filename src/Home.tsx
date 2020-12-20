import React from 'react';
import { View, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../App';

type HomeNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export type HomeProps = {
  navigation: HomeNavigationProp;
};

const Home = ({ navigation }: HomeProps) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Button
      title="Video Player"
      onPress={() => navigation.navigate("Player")}
    />
    <View style={{ height: 24 }} />
    <Button
      title="Layout"
      onPress={() => navigation.navigate("Layout")}
    />
    <View style={{ height: 24 }} />
    <Button
      title="Lock"
      onPress={() => navigation.navigate("Lock")}
    />
    <View style={{ height: 24 }} />
    <Button
      title="Canvas"
      onPress={() => navigation.navigate("Canvas")}
    />
  </View>
);

export default Home;
