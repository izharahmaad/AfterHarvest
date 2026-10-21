import {Platform, TextStyle, ViewStyle} from 'react-native';

export const colors = {
  // Surfaces
  background: '#F4F6F2',
  surface: '#FFFFFF',
  surfaceMuted: '#EFF3EA',
  surfaceElevated: '#FAFCF8',

  // Text
  ink: '#1C2B22',
  text: '#526257',
  muted: '#7D897F',
  faint: '#A0A89E',
  inverse: '#FFFFFF',

  // Lines
  border: '#E4E8E0',
  borderStrong: '#D3DCCF',
  divider: '#EDF1EB',

  // Brand
  primary: '#20603F',
  primaryDark: '#153C28',
  primarySoft: '#E9F1E8',
  primaryMuted: '#D8E6D6',
  accent: '#D9E8B8',
  accentDark: '#B9D08C',

  // Produce
  tomato: '#E47758',
  tomatoDark: '#CF684B',
  tomatoSoft: '#FBEDE9',

  // Status
  success: '#2B794D',
  successSoft: '#EAF5ED',
  warning: '#9B722A',
  warningSoft: '#FBF3E3',
  danger: '#AD5750',
  dangerSoft: '#FBEDEB',
  neutral: '#657A87',
  neutralSoft: '#EDF2F5',

  // Utility
  white: '#FFFFFF',
  overlay: 'rgba(21, 60, 40, 0.90)',
  overlayLight: 'rgba(21, 60, 40, 0.55)',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 26,
  pill: 999,
} as const;

export const typography = {
  display: {
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -0.9,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -0.4,
  },
  heading: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800' as TextStyle['fontWeight'],
  },
  subheading: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  label: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
  caption: {
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  overline: {
    fontSize: 8,
    lineHeight: 12,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: 0.8,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
} as const;

export type ShadowToken = Pick<
  ViewStyle,
  | 'shadowColor'
  | 'shadowOffset'
  | 'shadowOpacity'
  | 'shadowRadius'
  | 'elevation'
>;

export const shadow = {
  none: {} as ShadowToken,

  subtle: Platform.select<ShadowToken>({
    ios: {
      shadowColor: colors.primaryDark,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.04,
      shadowRadius: 8,
    },
    android: {
      elevation: 1,
    },
    default: {},
  }) as ShadowToken,

  card: Platform.select<ShadowToken>({
    ios: {
      shadowColor: colors.primaryDark,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.05,
      shadowRadius: 12,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }) as ShadowToken,

  raised: Platform.select<ShadowToken>({
    ios: {
      shadowColor: colors.primaryDark,
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.09,
      shadowRadius: 18,
    },
    android: {
      elevation: 5,
    },
    default: {},
  }) as ShadowToken,
} as const;

export const layout = {
  screenMaxWidth: 640,
  screenPadding: 20,
  screenPaddingWide: 30,
  tabletBreakpoint: 700,
  narrowBreakpoint: 360,
  touchTarget: 44,
} as const;
export const motion = {
  fast: 120,
  normal: 180,
  slow: 260,
} as const;

export const opacity = {
  pressed: 0.82,
  disabled: 0.52,
  subtle: 0.72,
} as const;