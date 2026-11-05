import React, {useCallback, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import CaptureScreen from './src/screens/CaptureScreen';
import ResultScreen from './src/screens/ResultScreen';
import HistoryScreen from './src/screens/HistoryScreen';

import {
  colors,
  layout,
  radius,
  shadow,
  typography,
} from './src/theme/tokens';
import type {Assessment} from './src/types/assessment';

type ScreenName = 'home' | 'capture' | 'result' | 'history';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type NavigationItem = {
  name: ScreenName;
  label: string;
  icon: IconName;
};

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: 'home',
    label: 'Home',
    icon: 'home-outline',
  },
  {
    name: 'capture',
    label: 'Assess',
    icon: 'camera-outline',
  },
  {
    name: 'history',
    label: 'History',
    icon: 'time-outline',
  },
];

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('home');
  const [result, setResult] = useState<Assessment | null>(null);
  const [items, setItems] = useState<Assessment[]>([]);

  const goTo = useCallback((nextScreen: ScreenName) => {
    setScreen(nextScreen);
  }, []);

  const handleAssessmentResult = useCallback(
    (assessment: Assessment) => {
      setResult(assessment);
      setItems(previous => [assessment, ...previous]);
      setScreen('result');
    },
    [],
  );

  const handleSelectHistoryItem = useCallback(
    (assessment: Assessment) => {
      setResult(assessment);
      setScreen('result');
    },
    [],
  );

  const canShowResult = screen === 'result' && result !== null;

  return (
    <View style={s.app}>
      {screen === 'home' ? (
        <HomeScreen
          key="home"
          onCapture={() => goTo('capture')}
          onHistory={() => goTo('history')}
        />
      ) : null}

      {screen === 'capture' ? (
        <CaptureScreen
          key="capture"
          onResult={handleAssessmentResult}
        />
      ) : null}

      {canShowResult && result ? (
        <ResultScreen
          key={`result-${
            result.assessment_id ?? result.created_at ?? 'assessment'
          }`}
          result={result}
          onNew={() => goTo('capture')}
        />
      ) : null}

      {screen === 'history' ? (
        <HistoryScreen
          key="history"
          items={items}
          onSelect={handleSelectHistoryItem}
        />
      ) : null}

      {screen === 'result' && !result ? (
        <View style={s.emptyResult}>
          <View style={s.emptyIcon}>
            <Ionicons
              name="analytics-outline"
              size={24}
              color={colors.primary}
            />
          </View>

          <Text style={s.emptyResultTitle}>
            No assessment selected
          </Text>

          <Text style={s.emptyResultText}>
            Run a new assessment or choose one from history.
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start a new assessment"
            onPress={() => goTo('capture')}
            style={({pressed}) => [
              s.emptyAction,
              pressed ? s.pressed : null,
            ]}>
            <Ionicons
              name="add"
              size={17}
              color={colors.primary}
            />
            <Text style={s.emptyActionText}>New assessment</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={s.tabBar}>
        {NAVIGATION_ITEMS.map(item => {
          const active = screen === item.name;

          return (
            <Pressable
              key={item.name}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityState={{selected: active}}
              onPress={() => goTo(item.name)}
              style={({pressed}) => [
                s.tabItem,
                active ? s.tabItemActive : null,
                pressed ? s.tabPressed : null,
              ]}>
              <Ionicons
                name={item.icon}
                size={20}
                color={active ? colors.primary : colors.muted}
              />

              <Text
                style={[
                  s.tabLabel,
                  active ? s.tabLabelActive : null,
                ]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyResult: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: layout.screenPadding,
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  emptyIcon: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    marginBottom: 16,
  },
  emptyResultTitle: {
    ...typography.heading,
    color: colors.ink,
    textAlign: 'center',
  },
  emptyResultText: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyAction: {
    minHeight: layout.touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    marginTop: 16,
  },
  emptyActionText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 8,
    gap: 6,
  },
  tabItem: {
    flex: 1,
    minHeight: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: radius.md,
  },
  tabItemActive: {
    backgroundColor: colors.primarySoft,
  },
  tabPressed: {
    opacity: 0.72,
  },
  tabLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.8,
  },
});