import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useStyles } from './useStyles';
import { toTimeView } from './utils';

export type SeekerProps = {
  currentTime: number;
  duration: number;
};

const Seeker = ({ currentTime, duration }: SeekerProps) => {
  const styles = useStyles();
  return (
    <View style={styles.seekbarBg}>
      <View style={styles.seekbarTime}>
        <Text style={styles.time}>{toTimeView(currentTime)}</Text>
        <Text style={StyleSheet.flatten([styles.time, { color: '#c4c4c4', marginLeft: 5 }])}>
          / {toTimeView(duration)}
        </Text>
      </View>
      <View
        style={StyleSheet.flatten([
          styles.seekbarProgress,
          {
            width: `${(currentTime * 100) / duration}%`,
          },
        ])}
      />
    </View>
  );
};

export default Seeker;
