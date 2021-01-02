import React from 'react';
import { View, Text } from 'react-native';

export type PostContentProps = {};

const MoreVideo = () => (
  <View style={{ padding: 16, flexDirection: 'row', width: '100%' }}>
    <View
      style={{
        backgroundColor: 'rgba(0,0,0,0.12)',
        width: 120,
        height: 100,
        marginRight: 16,
      }}
    />
    <View style={{ flexShrink: 1 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '500',
          color: 'rgba(0,0,0,0.87)',
          marginBottom: 8,
        }}
      >
        โปรดิวเซอร์ปูอัดเดอะรากหญ้า
      </Text>
      <Text style={{ color: 'rgba(0,0,0,0.6)' }}>
        อีแต๋นเบอร์รี รีดไถ แฟนตาซีเจ็ตโรแมนติคแซว กฤษณ์บอยคอต อิมพีเรียล
        กาญจนาภิเษกอวอร์ด
      </Text>
    </View>
  </View>
);

const PostContent = ({}: PostContentProps) => (
  <>
    <View style={{ padding: 16 }}>
      <Text style={{ color: 'rgb(4,77,205)' }}>#siriwatknp</Text>
      <Text style={{ fontSize: 20, marginVertical: 4 }}>
        React Native Video Extension is awesome!
      </Text>
      <Text style={{ color: 'rgba(0,0,0,0.6)' }}>1.2B views • just now</Text>
    </View>
    <MoreVideo />
    <MoreVideo />
    <MoreVideo />
    <MoreVideo />
    <MoreVideo />
    <MoreVideo />
    <MoreVideo />
    <MoreVideo />
  </>
);

export default PostContent;
