import { Dimensions } from 'react-native';
import {
  AspectRatio,
  getAspectRatio,
  isZeroInsets,
} from './utils';
// isLocked
// insets
// normal => fullscreen (isLandscape)

interface Dimension {
  width: number;
  height: number;
}

export interface Inset {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const Gap = ({
  insets,
  fullscreen,
}: {
  insets?: Partial<Inset>;
  fullscreen: boolean;
}) => {
  return {
    left: fullscreen ? ((insets?.top ?? 0) > 20 ? insets?.top ?? 0 : 0) : 0,
    right: fullscreen ? insets?.bottom ?? 0 : 0,
    top: fullscreen ? ((insets?.top ?? 0) > 20 ? insets?.top ?? 0 : 0) : 0,
    bottom: fullscreen ? insets?.bottom ?? 0 : 0,
  };
};

type Info = {
  insets?: Partial<Inset>;
  fullscreen: boolean;
  isLandscape: boolean;
};

class DimensionManager {
  device: Dimension;
  isLockedToPortrait: boolean;
  aspectRatio: AspectRatio;
  constructor() {
    this.device = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    };
    this.isLockedToPortrait = false;
    this.aspectRatio = 'landscape';
  }

  getPlayerWidth({ insets, fullscreen, isLandscape }: Info) {
    const gap = Gap({ insets, fullscreen });
    return isLandscape && fullscreen
      ? this.device.height - gap.left - gap.right
      : this.device.width;
  }

  getPlayerHeight({ insets, fullscreen, isLandscape }: Info) {
    const gap = Gap({ insets, fullscreen });
    if (fullscreen) {
      return isLandscape
        ? this.device.width
        : this.device.height - gap.top - gap.bottom;
    }
    return this.device.width / getAspectRatio(this.aspectRatio);
  }

  getPlayerSize(data: Info) {
    const gap = Gap({ insets: data.insets, fullscreen: data.fullscreen });
    const width = this.getPlayerWidth(data);
    const height = this.getPlayerHeight(data);
    return {
      width,
      height,
      marginTop: data.fullscreen && !data.isLandscape ? gap.top : 0,
      marginLeft: data.fullscreen && data.isLandscape ? (gap.left + gap.right) / 2 : 0,
    };
  }

  getSeekerWidth({
    insets,
    fullscreen,
    isLandscape,
    gutter = 0,
  }: Info & { gutter?: number }) {
    if (fullscreen) {
      if (!isLandscape) return this.device.width - gutter * 2;
      if (!insets) return `${100 - gutter * 2}%`;
      if (isZeroInsets(insets)) return this.device.height - gutter * 2;
      return '100%';
    }
    return '100%';
  }
}

export default new DimensionManager();
