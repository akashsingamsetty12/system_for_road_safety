/**
 * Modern Theme Configuration
 * Light and Dark mode support with consistent design system
 */

export const lightTheme = {
  // Primary Colors
  primary: '#667eea',
  primaryDark: '#5568d3',
  primaryLight: '#8b9aef',
  
  // Secondary Colors
  secondary: '#f093fb',
  secondaryDark: '#d46ef0',
  secondaryLight: '#f5a9fc',
  
  // Status Colors
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  
  // Severity Levels
  severityHigh: '#ef4444',
  severityMedium: '#f59e0b',
  severityLow: '#eab308',
  
  // Neutral Colors
  background: '#ffffff',
  surface: '#f8f9fa',
  surfaceAlt: '#f0f1f5',
  border: '#e5e7eb',
  divider: '#d1d5db',
  
  // Text Colors
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    disabled: '#d1d5db',
  },
  
  // Gradients
  gradientPrimary: ['#667eea', '#764ba2'],
  gradientSuccess: ['#10b981', '#059669'],
  gradientWarn: ['#f59e0b', '#d97706'],
  gradientDanger: ['#ef4444', '#dc2626'],
};

export const darkTheme = {
  // Primary Colors
  primary: '#667eea',
  primaryDark: '#5568d3',
  primaryLight: '#8b9aef',
  
  // Secondary Colors
  secondary: '#f093fb',
  secondaryDark: '#d46ef0',
  secondaryLight: '#f5a9fc',
  
  // Status Colors
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  info: '#60a5fa',
  
  // Severity Levels
  severityHigh: '#f87171',
  severityMedium: '#fbbf24',
  severityLow: '#fcd34d',
  
  // Neutral Colors
  background: '#111827',
  surface: '#1f2937',
  surfaceAlt: '#374151',
  border: '#4b5563',
  divider: '#6b7280',
  
  // Text Colors
  text: {
    primary: '#f3f4f6',
    secondary: '#d1d5db',
    tertiary: '#9ca3af',
    disabled: '#6b7280',
  },
  
  // Gradients
  gradientPrimary: ['#667eea', '#764ba2'],
  gradientSuccess: ['#34d399', '#10b981'],
  gradientWarn: ['#fbbf24', '#f59e0b'],
  gradientDanger: ['#f87171', '#ef4444'],
};

// Spacing Scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

// Typography
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  h6: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 23,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  smallMedium: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  caption: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
  },
  captionMedium: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
};

// Border Radius
export const borderRadius = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Shadows (for elevation)
export const shadows = {
  none: {
    shadowColor: 'transparent',
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    elevation: 12,
  },
};

// Component Sizes
export const sizes = {
  button: {
    small: { height: 32, paddingHorizontal: 12 },
    medium: { height: 40, paddingHorizontal: 16 },
    large: { height: 48, paddingHorizontal: 20 },
  },
  input: {
    height: 44,
    paddingHorizontal: 12,
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
};

export default {
  light: lightTheme,
  dark: darkTheme,
  spacing,
  typography,
  borderRadius,
  shadows,
  sizes,
};
