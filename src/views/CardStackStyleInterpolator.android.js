/* @flow */

import {
  I18nManager,
} from 'react-native';

import type {
  NavigationSceneRendererProps,
} from '../TypeDefinition';

/**
 * Utility that builds the style for the card in the cards stack.
 *
 *     +------------+
 *   +-+            |
 * +-+ |            |
 * | | |            |
 * | | |  Focused   |
 * | | |   Card     |
 * | | |            |
 * +-+ |            |
 *   +-+            |
 *     +------------+
 */

/**
 * Render the initial style when the initial layout isn't measured yet.
 */
function forInitial(props: NavigationSceneRendererProps): Object {
  const {
    navigationState,
    scene,
  } = props;

  const focused = navigationState.index === scene.index;
  // If not focused, move the scene far away.
  const translate = focused ? 0 : 1000000;
  return {
    transform: [
      { translateX: translate },
      { translateY: translate },
    ],
  };
}

/**
 * Standard iOS-style slide in from the right.
 */
function forHorizontal(props: NavigationSceneRendererProps): Object {
  const {
    layout,
    position,
    scene,
  } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }

  const index = scene.index;
  const inputRange = [index - 1, index, index + 0.99, index + 1];

  // Add ~30px to the interpolated width screens width for horizontal movement. This allows
  // the screen's shadow to go screen fully offscreen without abruptly dissapearing
  const width = layout.initWidth + 30;
  const outputRange = I18nManager.isRTL ?
    ([-width, 0, 10, 10]: Array<number>) :
    ([width, 0, -10, -10]: Array<number>);

  const translateY = 0;
  const translateX = position.interpolate({
    inputRange,
    outputRange,
  });

  return {
    transform: [
      { translateX },
      { translateY },
    ],
  };
}

/**
 * Standard iOS-style slide in from the bottom (used for modals).
 */
function forVertical(props: NavigationSceneRendererProps): Object {
  const {
    layout,
    position,
    scene,
  } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }

  const index = scene.index;
  const inputRange = [index - 1, index, index + 0.99, index + 1];
  const height = layout.initHeight;

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange,
    outputRange: ([height, 0, 0, 0]: Array<number>),
  });

  return {
    transform: [
      { translateX },
      { translateY },
    ],
  };
}

/**
 * Standard Android-style fade in from the bottom.
 */
function forFadeFromBottomAndroid(props: NavigationSceneRendererProps): Object {
  const {
    layout,
    position,
    scene,
  } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }

  const index = scene.index;
  const inputRange = [index - 1, index, index + 0.99, index + 1];
  const height = layout.initHeight;

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange,
    outputRange: ([50, 0, 0, 0]: Array<number>),
  });

  return {
    transform: [
      { translateX },
      { translateY },
    ],
  };
}

function canUseNativeDriver(isVertical: boolean): boolean {
  // The native driver can be enabled for this interpolator animating
  // opacity, translateX, and translateY is supported by the native animation
  // driver on iOS and Android.
  return true;
}

export default {
  forHorizontal,
  forVertical,
  forFadeFromBottomAndroid,
  canUseNativeDriver,
};
