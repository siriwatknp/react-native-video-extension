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
      <Path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </Svg>
  );
}

export default SvgComponent;
