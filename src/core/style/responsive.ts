import { Dimensions, PixelRatio } from "react-native";

// Reference design dimensions (based on a standard iPhone 14 / 390×844)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * Scales a value horizontally based on screen width relative to the base design.
 * Use for horizontal dimensions: width, paddingHorizontal, marginHorizontal, fontSize, borderRadius.
 */
export const sw = (size: number): number =>
  PixelRatio.roundToNearestPixel((SCREEN_WIDTH / BASE_WIDTH) * size);

/**
 * Scales a value vertically based on screen height relative to the base design.
 * Use for vertical dimensions: height, paddingVertical, marginVertical, paddingTop/Bottom.
 */
export const sh = (size: number): number =>
  PixelRatio.roundToNearestPixel((SCREEN_HEIGHT / BASE_HEIGHT) * size);

/**
 * Moderate scale – blends horizontal scaling with a factor to avoid extreme stretching.
 * Good for font sizes and icon sizes that should scale but not too aggressively.
 */
export const ms = (size: number, factor: number = 0.5): number =>
  PixelRatio.roundToNearestPixel(size + (sw(size) - size) * factor);
