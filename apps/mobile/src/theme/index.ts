export const colors = {
  background: '#F4F6F2',
  surface: '#FFFFFF',
  surfaceMuted: '#EFF3EA',

  ink: '#1C2B22',
  text: '#526257',
  muted: '#7D897F',
  faint: '#A0A89E',
  border: '#E4E8E0',
  divider: '#EDF1EB',

  primary: '#20603F',
  primaryDark: '#153C28',
  primarySoft: '#E9F1E8',
  accent: '#D9E8B8',

  tomato: '#E47758',
  tomatoDark: '#CF684B',

  success: '#2B794D',
  successSoft: '#EAF5ED',
  warning: '#9B722A',
  warningSoft: '#FBF3E3',
  danger: '#AD5750',
  dangerSoft: '#FBEDEB',
  neutral: '#657A87',
  neutralSoft: '#EDF2F5',

  white: '#FFFFFF',
  overlay: 'rgba(21, 60, 40, 0.90)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const typography = {
  display: {
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800' as const,
    letterSpacing: -0.9,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800' as const,
    letterSpacing: -0.4,
  },
  heading: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800' as const,
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  label: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700' as const,
  },
  caption: {
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '600' as const,
  },
  overline: {
    fontSize: 8,
    lineHeight: 12,
    fontWeight: '800' as const,
    letterSpacing: 0.8,
  },
} as const;

export const shadow = {
  card: {
    shadowColor: '#153C28',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
} as const;

export const layout = {
  screenMaxWidth: 640,
  screenPadding: 20,
  screenPaddingWide: 30,
  tabletBreakpoint: 700,
  narrowBreakpoint: 360,
} as const;