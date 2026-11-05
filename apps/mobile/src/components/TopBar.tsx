import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {
  colors,
  layout,
  radius,
  shadow,
} from '../theme/tokens';

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
};

export default function TopBar({
  title,
  subtitle,
  showBack = false,
  onBack,
  right,
}: Props) {
  return (
    <View style={s.container}>
      <View style={s.left}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack}
            hitSlop={10}
            style={({pressed}) => [
              s.backButton,
              pressed ? s.pressed : null,
            ]}>
            <Ionicons
              name="chevron-back"
              size={20}
              color={colors.ink}
            />
          </Pressable>
        ) : (
          <View style={s.brandIcon}>
            <Ionicons
              name="leaf"
              size={16}
              color={colors.white}
            />
          </View>
        )}

        <View style={s.copy}>
          <Text
            numberOfLines={1}
            style={s.title}>
            {title}
          </Text>

          {subtitle ? (
            <Text
              numberOfLines={1}
              style={s.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {right ? <View style={s.right}>{right}</View> : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 64,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadow.subtle,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  brandIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pressed: {
    opacity: 0.7,
  },
});