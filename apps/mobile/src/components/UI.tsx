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
import {Ionicons} from '@expo/vector-icons';

import {
  colors,
  radius,
  shadow,
  spacing,
  typography,
} from '../theme/tokens';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'ghost';

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  icon?: IconName;
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

type EmptyStateProps = {
  icon: IconName;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

type ListRowProps = {
  icon: IconName;
  title: string;
  description?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const BUTTON_VARIANTS: Record<
  ButtonVariant,
  {
    container: ViewStyle;
    text: TextStyle;
    spinner: string;
  }
> = {
  primary: {
    container: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    text: {
      color: colors.white,
    },
    spinner: colors.white,
  },
  secondary: {
    container: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primarySoft,
    },
    text: {
      color: colors.primary,
    },
    spinner: colors.primary,
  },
  outline: {
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    text: {
      color: colors.primary,
    },
    spinner: colors.primary,
  },
  danger: {
    container: {
      backgroundColor: colors.danger,
      borderColor: colors.danger,
    },
    text: {
      color: colors.white,
    },
    spinner: colors.white,
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    text: {
      color: colors.primary,
    },
    spinner: colors.primary,
  },
};

const PILL_TONES = {
  success: {
    background: colors.successSoft,
    color: colors.success,
  },
  warning: {
    background: colors.warningSoft,
    color: colors.warning,
  },
  danger: {
    background: colors.dangerSoft,
    color: colors.danger,
  },
  neutral: {
    background: colors.neutralSoft,
    color: colors.neutral,
  },
} as const;

export function Button({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  icon,
  accessibilityLabel,
  style,
  textStyle,
}: ButtonProps) {
  const variantStyle = BUTTON_VARIANTS[variant];
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
        variantStyle.container,
        pressed && !isDisabled ? styles.buttonPressed : null,
        isDisabled ? styles.buttonDisabled : null,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={variantStyle.spinner} size="small" />
      ) : icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={variantStyle.text.color}
        />
      ) : null}

      <Text
        numberOfLines={1}
        style={[
          styles.buttonText,
          variantStyle.text,
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
  const toneStyle = PILL_TONES[tone];

  return (
    <View
      accessibilityRole="text"
      style={[
        styles.statusPill,
        {backgroundColor: toneStyle.background},
        style,
      ]}>
      <View
        style={[
          styles.statusDot,
          {backgroundColor: toneStyle.color},
        ]}
      />

      <Text style={[styles.statusPillText, {color: toneStyle.color}]}>
        {label}
      </Text>
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={26} color={colors.primary} />
      </View>

      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>

      {actionLabel && onActionPress ? (
        <Button
          label={actionLabel}
          onPress={onActionPress}
          variant="secondary"
          style={styles.emptyAction}
        />
      ) : null}
    </View>
  );
}

export function ListRow({
  icon,
  title,
  description,
  trailing,
  onPress,
  disabled = false,
  style,
}: ListRowProps) {
  const content = (
    <>
      <View style={styles.listIcon}>
        <Ionicons name={icon} size={19} color={colors.primary} />
      </View>

      <View style={styles.listCopy}>
        <Text style={styles.listTitle} numberOfLines={1}>
          {title}
        </Text>

        {description ? (
          <Text style={styles.listDescription} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
      </View>

      {trailing ?? (
        <Ionicons
          name="chevron-forward"
          size={17}
          color={colors.faint}
        />
      )}
    </>
  );

  if (!onPress) {
    return <View style={[styles.listRow, style]}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{disabled}}
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.listRow,
        pressed ? styles.listRowPressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}>
      {content}
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 36,
    gap: 17,
  },
  button: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: radius.lg,
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginVertical: 8,
    gap: 10,
    ...shadow.card,
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
    ...typography.overline,
    color: colors.primary,
    marginBottom: 6,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.ink,
  },
  sectionDescription: {
    ...typography.body,
    color: colors.muted,
    marginTop: 6,
  },
  sectionAction: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  sectionActionPressed: {
    opacity: 0.72,
  },
  sectionActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.md,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    marginBottom: 16,
  },
  emptyTitle: {
    ...typography.heading,
    color: colors.ink,
    textAlign: 'center',
  },
  emptyDescription: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyAction: {
    marginTop: 16,
    minWidth: 180,
  },
  listRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  listRowPressed: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  listIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  listCopy: {
    flex: 1,
    minWidth: 0,
  },
  listTitle: {
    ...typography.label,
    color: colors.ink,
  },
  listDescription: {
    ...typography.caption,
    color: colors.muted,
    marginTop: 3,
  },
  title: {
    ...typography.display,
    color: colors.ink,
    marginTop: 12,
    marginBottom: 8,
  },
  text: {
    ...typography.body,
    color: colors.text,
  },
  caption: {
    ...typography.caption,
    color: colors.faint,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: 7,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.ink,
    fontSize: 16,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginVertical: 6,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 8,
  },
  disabled: {
    opacity: 0.52,
  },
});