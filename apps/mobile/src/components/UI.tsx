import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

type StatusPillProps = {
  label: string;
  tone?: 'success' | 'warning' | 'danger' | 'neutral';
  style?: StyleProp<ViewStyle>;
};

const BUTTON_STYLES: Record<
  ButtonVariant,
  {
    container: ViewStyle;
    text: TextStyle;
    spinner: string;
  }
> = {
  primary: {
    container: {
      backgroundColor: '#176B46',
      borderColor: '#176B46',
    },
    text: {
      color: '#FFFFFF',
    },
    spinner: '#FFFFFF',
  },
  secondary: {
    container: {
      backgroundColor: '#EAF4ED',
      borderColor: '#EAF4ED',
    },
    text: {
      color: '#1B633F',
    },
    spinner: '#1B633F',
  },
  outline: {
    container: {
      backgroundColor: '#FFFFFF',
      borderColor: '#BFD8C6',
    },
    text: {
      color: '#1B633F',
    },
    spinner: '#1B633F',
  },
  danger: {
    container: {
      backgroundColor: '#B94C45',
      borderColor: '#B94C45',
    },
    text: {
      color: '#FFFFFF',
    },
    spinner: '#FFFFFF',
  },
};

const PILL_STYLES = {
  success: {
    backgroundColor: '#E6F4EA',
    textColor: '#28764A',
  },
  warning: {
    backgroundColor: '#FBF1DC',
    textColor: '#9A6B20',
  },
  danger: {
    backgroundColor: '#FBEAE7',
    textColor: '#AD514B',
  },
  neutral: {
    backgroundColor: '#EEF2EF',
    textColor: '#63766A',
  },
};

export function Button({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  accessibilityLabel,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyle = BUTTON_STYLES[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      disabled={isDisabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        buttonStyle.container,
        pressed && !isDisabled ? styles.buttonPressed : null,
        isDisabled ? styles.buttonDisabled : null,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={buttonStyle.spinner}
          size="small"
        />
      ) : null}

      <Text
        numberOfLines={1}
        style={[
          styles.buttonText,
          buttonStyle.text,
          loading ? styles.buttonTextLoading : null,
          textStyle,
        ]}>
        {loading ? 'Please wait…' : label}
      </Text>
    </Pressable>
  );
}

export function Card({
  children,
  style,
  accessibilityLabel,
}: CardProps) {
  return (
    <View
      accessible={Boolean(accessibilityLabel)}
      accessibilityLabel={accessibilityLabel}
      style={[styles.card, style]}>
      {children}
    </View>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionCopy}>
        {eyebrow ? (
          <Text style={styles.eyebrow}>{eyebrow}</Text>
        ) : null}

        <Text style={styles.sectionTitle}>{title}</Text>

        {description ? (
          <Text style={styles.sectionDescription}>
            {description}
          </Text>
        ) : null}
      </View>

      {actionLabel && onActionPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onActionPress}
          hitSlop={8}
          style={({pressed}) => [
            styles.sectionAction,
            pressed ? styles.sectionActionPressed : null,
          ]}>
          <Text style={styles.sectionActionText}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function StatusPill({
  label,
  tone = 'neutral',
  style,
}: StatusPillProps) {
  const pillStyle = PILL_STYLES[tone];

  return (
    <View
      accessibilityRole="text"
      style={[
        styles.statusPill,
        {backgroundColor: pillStyle.backgroundColor},
        style,
      ]}>
      <View
        style={[
          styles.statusDot,
          {backgroundColor: pillStyle.textColor},
        ]}
      />

      <Text
        style={[
          styles.statusPillText,
          {color: pillStyle.textColor},
        ]}>
        {label}
      </Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F9F6',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  button: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 18,
    marginVertical: 6,
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{scale: 0.985}],
  },
  buttonDisabled: {
    opacity: 0.52,
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  buttonTextLoading: {
    opacity: 0.94,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1EAE3',
    padding: 18,
    marginVertical: 8,
    gap: 10,
    shadowColor: '#183C29',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
    marginTop: 12,
    marginBottom: 8,
  },
  sectionCopy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: '#398058',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: '#1A3C2A',
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6B8072',
    marginTop: 6,
  },
  sectionAction: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#EAF4ED',
  },
  sectionActionPressed: {
    opacity: 0.72,
  },
  sectionActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1B633F',
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  title: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '800',
    letterSpacing: -0.7,
    color: '#18382A',
    marginTop: 12,
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    lineHeight: 23,
    color: '#647A6D',
  },
  caption: {
    fontSize: 11,
    lineHeight: 17,
    color: '#85978B',
  },
  label: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    color: '#496555',
    marginBottom: 7,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#D6E3D9',
    backgroundColor: '#FBFDFC',
    color: '#203E2D',
    fontSize: 16,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginVertical: 6,
  },
  inputFocused: {
    borderColor: '#2F8052',
    backgroundColor: '#F4FAF5',
  },
  divider: {
    height: 1,
    backgroundColor: '#EDF2EE',
    marginVertical: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
});