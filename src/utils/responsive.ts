import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const isSmallScreen = screenWidth < 375;
export const isLargeScreen = screenWidth > 768;
export const isTablet = screenWidth >= 768;
export const isLandscape = screenWidth > screenHeight;

export const getResponsiveFontSize = (baseSize: number, factor: number = 0.5) => {
    if (isSmallScreen) return baseSize - 2;
    if (isLargeScreen) return baseSize + factor;
    return baseSize;
};

export const getResponsivePadding = (basePadding: number) => {
    if (isSmallScreen) return basePadding - 6;
    if (isLargeScreen) return basePadding + 4;
    return basePadding;
};

export const getResponsiveMargin = (baseMargin: number) => {
    if (isSmallScreen) return baseMargin - 6;
    if (isLargeScreen) return baseMargin + 4;
    return baseMargin;
};
