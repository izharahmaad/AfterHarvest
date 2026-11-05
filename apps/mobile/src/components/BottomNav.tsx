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
  id: string;
  title: string;
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
        const active = item.id === activeId;

        return (
          <Pressable
            key={item.id}
            accessibilityRole="tab"
            accessibilityLabel={item.title}
            accessibilityState={{selected: active}}
            onPress={() => onChange(item.id)}
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
                size={19}
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
              {item.title}
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
    minHeight: 72,
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
    width: 42,
    height: 32,
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