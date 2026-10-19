import React, {useCallback, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import CaptureScreen from './src/screens/CaptureScreen';
import ResultScreen from './src/screens/ResultScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import {colors} from './src/theme/tokens';
import type {Assessment} from './src/types/assessment';

type Route = 'home' | 'capture' | 'result' | 'history';

export default function App() {
  const [route, setRoute] = useState<Route>('home');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);

  const goToCapture = useCallback(() => {
    setRoute('capture');
  }, []);

  const goToHistory = useCallback(() => {
    setRoute('history');
  }, []);

  const goToHome = useCallback(() => {
    setRoute('home');
  }, []);

  const handleAssessmentCreated = useCallback(
    (assessment: Assessment) => {
      setAssessments(previous => [assessment, ...previous]);
      setSelectedAssessment(assessment);
      setRoute('result');
    },
    [],
  );

  const handleSelectAssessment = useCallback((assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setRoute('result');
  }, []);

  const handleNewAssessment = useCallback(() => {
    setSelectedAssessment(null);
    setRoute('capture');
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.safeArea} edges={['top', 'bottom']}>
        <StatusBar style="dark" backgroundColor={colors.surface} />

        {route === 'home' ? (
          <HomeScreen
            onCapture={goToCapture}
            onHistory={goToHistory}
          />
        ) : null}

        {route === 'capture' ? (
          <CaptureScreen
            onSubmit={handleAssessmentCreated}
            onBack={goToHome}
          />
        ) : null}

        {route === 'result' && selectedAssessment ? (
          <ResultScreen
            result={selectedAssessment}
            onNew={handleNewAssessment}
          />
        ) : null}

        {route === 'history' ? (
          <HistoryScreen
            items={assessments}
            onSelect={handleSelectAssessment}
          />
        ) : null}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = {
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
};