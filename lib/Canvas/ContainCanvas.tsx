import React from 'react';
import {View, useWindowDimensions} from "react-native";

export type ContainCanvasProps = {
  fullscreen?: boolean
}

const ContainCanvas = ({  }: ContainCanvasProps) => {
  const { width, height } = useWindowDimensions()
  return (
    <View style={{}}>

    </View>
  );
};

export default ContainCanvas

