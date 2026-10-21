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
  layout,
  radius,
  shadow,
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

type TopBarProps = {
  title: string;
  caption?: string;
  icon?: IconName;
  trailing?: React.ReactNode;
};

type ProgressRailProps = {
  progress: number;
  color?: string;
};

type IconTileProps = {
  icon: IconName;
  color?: string;
  background?: string;
  size?: number;
};

type BadgeProps = {
  label: string;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  style?: StyleProp<ViewStyle>;
};

type MetricTileProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: IconName;
  emphasized?: boolean;
  onPress?: () => void;
};

type ButtonVariantStyle = {
  container: ViewStyle;
  textColor: string;
  spinnerColor: string;
};

const BUTTON_VARIANTS: Record<ButtonVariant, ButtonVariantStyle> = {
  primary: {
    container: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    textColor: colors.white,
    spinnerColor: colors.white,
  },
  secondary: {
    container: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primarySoft,
    },
    textColor: colors.primary,
    spinnerColor: colors.primary,
  },
  outline: {
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    textColor: colors.primary,
    spinnerColor: colors.primary,
  },
  danger: {
    container: {
      backgroundColor: colors.danger,
      borderColor: colors.danger,
    },
    textColor: colors.white,
    spinnerColor: colors.white,
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    textColor: colors.primary,
    spinnerColor: colors.primary,
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

const BADGE_TONES = {
  primary: {
    background: colors.primarySoft,
    color: colors.primary,
  },
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
    background: colors.surfaceMuted,
    color: colors.muted,
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
        <ActivityIndicator
          color={variantStyle.spinnerColor}
          size="small"
        />
      ) : icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={variantStyle.textColor}
        />
      ) : null}

      <Text
        numberOfLines={1}
        style={[
          styles.buttonText,
          {color: variantStyle.textColor},
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
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}

        <Text style={styles.sectionTitle}>{title}</Text>

        {description ? (
          <Text style={styles.sectionDescription}>{description}</Text>
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
          <Text style={styles.sectionActionText}>{actionLabel}</Text>
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
        style={[styles.statusDot, {backgroundColor: toneStyle.color}]}
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

export function TopBar({
  title,
  caption,
  icon = 'leaf',
  trailing,
}: TopBarProps) {
  return (
    <View style={styles.topBar}>
      <View style={styles.brand}>
        <View style={styles.brandIcon}>
          <Ionicons name={icon} size={17} color={colors.white} />
        </View>

        <View style={styles.brandCopy}>
          <Text style={styles.brandTitle}>{title}</Text>

          {caption ? (
            <Text style={styles.brandCaption}>{caption}</Text>
          ) : null}
        </View>
      </View>

      {trailing}
    </View>
  );
}

export function ProgressRail({
  progress,
  color = colors.primary,
}: ProgressRailProps) {
  const normalized = Math.max(0, Math.min(100, progress));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: 100,
        now: normalized,
      }}
      style={styles.progressRail}>
      <View
        style={[
          styles.progressRailFill,
          {width: `${normalized}%`, backgroundColor: color},
        ]}
      />
    </View>
  );
}

export function IconTile({
  icon,
  color = colors.primary,
  background = colors.primarySoft,
  size = 19,
}: IconTileProps) {
  return (
    <View style={[styles.iconTile, {backgroundColor: background}]}>
      <Ionicons name={icon} size={size} color={color} />
    </View>
  );
}

export function Badge({
  label,
  tone = 'primary',
  style,
}: BadgeProps) {
  const toneStyle = BADGE_TONES[tone];

  return (
    <View
      accessibilityRole="text"
      style={[
        styles.badge,
        {backgroundColor: toneStyle.background},
        style,
      ]}>
      <Text style={[styles.badgeText, {color: toneStyle.color}]}>
        {label}
      </Text>
    </View>
  );
}

export function MetricTile({
  label,
  value,
  hint,
  icon,
  emphasized = false,
  onPress,
}: MetricTileProps) {
  const content = (
    <>
      <View style={styles.metricTop}>
        <Text
          style={[
            styles.metricLabel,
            emphasized ? styles.metricLabelEmphasized : null,
          ]}>
          {label}
        </Text>

        {icon ? (
          <View
            style={[
              styles.metricIcon,
              emphasized ? styles.metricIconEmphasized : null,
            ]}>
            <Ionicons
              name={icon}
              size={15}
              color={emphasized ? colors.white : colors.primary}
            />
          </View>
        ) : null}
      </View>

      <Text
        style={[
          styles.metricValue,
          emphasized ? styles.metricValueEmphasized : null,
        ]}>
        {value}
      </Text>

      {hint ? (
        <Text
          style={[
            styles.metricHint,
            emphasized ? styles.metricHintEmphasized : null,
          ]}>
          {hint}
        </Text>
      ) : null}
    </>
  );

  if (!onPress) {
    return (
      <View
        style={[
          styles.metricTile,
          emphasized ? styles.metricTileEmphasized : null,
        ]}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      onPress={onPress}
      style={({pressed}) => [
        styles.metricTile,
        emphasized ? styles.metricTileEmphasized : null,
        pressed ? styles.pressed : null,
      ]}>
      {content}
    </Pressable>
  );
}

export function Divider({
  style,
}: {
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.divider, style]} />;
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: layout.screenMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 18,
    paddingBottom: 36,
    gap: 17,
  },
  button: {
    minHeight: layout.touchTarget + 8,
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
    borderRadius: radius.sm,
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
    borderRadius: radius.lg,
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  brandCopy: {
    minWidth: 0,
  },
  brandTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  brandCaption: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.9,
    marginTop: 3,
  },
  progressRail: {
    height: 3,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  progressRailFill: {
    height: '100%',
    borderRadius: 2,
  },
  iconTile: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  metricTile: {
    flex: 1,
    minWidth: 0,
    padding: 15,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  metricTileEmphasized: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  metricTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  metricLabel: {
    ...typography.overline,
    color: colors.muted,
  },
  metricLabelEmphasized: {
    color: colors.white,
  },
  metricIcon: {
    width: 27,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  metricIconEmphasized: {
    backgroundColor: colors.overlay,
  },
  metricValue: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: '800',
    marginTop: 10,
  },
  metricValueEmphasized: {
    color: colors.white,
  },
  metricHint: {
    ...typography.overline,
    color: colors.faint,
    marginTop: 4,
  },
  metricHintEmphasized: {
    color: colors.primaryDark,
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
  pressed: {
    opacity: 0.86,
    transform: [{scale: 0.99}],
  },
});