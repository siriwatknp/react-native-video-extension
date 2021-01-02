import React from 'react';
import { View, Text } from 'react-native';

export type PostHeaderProps = {};

const PostHeader = ({}: PostHeaderProps) => (
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
);

export default PostHeader;
