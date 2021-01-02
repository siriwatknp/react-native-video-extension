import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      height={64}
      viewBox="0 0 24 24"
      width={64}
      fill="currentColor"
      color="#ffffff"
      {...props}
    >
      <Path d="M0 0h24v24H0z" fill="none" />
      <Path d="M8 5v14l11-7z" />
    </Svg>
  );
}

export default SvgComponent;
