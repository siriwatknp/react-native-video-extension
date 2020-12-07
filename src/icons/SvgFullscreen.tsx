import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg height={32} viewBox="0 0 24 24" width={32} {...props}>
      <Path d="M0 0h24v24H0z" fill="none" />
      <Path
        d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
        fill="currentColor"
      />
    </Svg>
  );
}

export default SvgComponent;
