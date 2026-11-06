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

type NavItem = {
  name: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

type Props = {
  activeId: string;
  items: NavItem[];
  onChange: (id: string) => void;
};

export default function BottomNav({
  activeId,
  items,
  onChange,
}: Props) {
  return (
    <View style={s.container}>
      {items.map(item => {
        const active = item.name === activeId;

        return (
          <Pressable
            key={item.name}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{selected: active}}
            onPress={() => onChange(item.name)}
            style={({pressed}) => [
              s.item,
              pressed ? s.pressed : null,
            ]}>
            <View
              style={[
                s.iconWrapper,
                active ? s.iconWrapperActive : null,
              ]}>
              <Ionicons
                name={item.icon}
                size={20}
                color={
                  active ? colors.primary : colors.muted
                }
              />
            </View>

            <Text
              style={[
                s.label,
                active ? s.labelActive : null,
              ]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: 74,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadow.raised,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconWrapper: {
    width: 46,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
  },
  iconWrapperActive: {
    backgroundColor: colors.primarySoft,
  },
  label: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.75,
  },
});