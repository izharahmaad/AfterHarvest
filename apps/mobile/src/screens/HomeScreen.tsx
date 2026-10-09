import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  onCapture: () => void;
  onHistory: () => void;
};

const STEPS = [
  {
    number: '01',
    title: 'Add a photo',
    description: 'Take a photo or choose one from your gallery.',
  },
  {
    number: '02',
    title: 'Add storage details',
    description: 'Enter temperature, humidity and storage days.',
  },
  {
    number: '03',
    title: 'Review your result',
    description: 'See the demo assessment and its context.',
  },
];

function Dot({color = '#6D9A78'}: {color?: string}) {
  return <View style={[s.dot, {backgroundColor: color}]} />;
}

function TomatoMark() {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={s.tomatoMark}>
      <View style={s.tomatoGlow} />
      <View style={s.tomatoBody} />
      <View style={s.tomatoShine} />
      <View style={s.tomatoStem} />
      <View style={s.tomatoLeafLeft} />
      <View style={s.tomatoLeafRight} />
    </View>
  );
}

function ActionArrow() {
  return (
    <View accessible={false} style={s.arrowCircle}>
      <Text style={s.arrowText}>→</Text>
    </View>
  );
}

function Workflow() {
  return (
    <View style={s.workflowCard}>
      {STEPS.map((step, index) => (
        <View key={step.number} style={s.workflowRow}>
          <View style={s.timeline}>
            <View style={s.stepCircle}>
              <Text style={s.stepNumber}>{step.number}</Text>
            </View>
            {index < STEPS.length - 1 ? (
              <View style={s.timelineLine} />
            ) : null}
          </View>

          <View
            style={[
              s.workflowCopy,
              index < STEPS.length - 1 ? s.workflowCopyBorder : null,
            ]}>
            <Text style={s.workflowTitle}>{step.title}</Text>
            <Text style={s.workflowDescription}>
              {step.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export default function HomeScreen({
  onCapture,
  onHistory,
}: Props) {
  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={s.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <View style={s.topBar}>
        <View style={s.brand}>
          <View style={s.brandMark}>
            <Text style={s.brandMarkText}>A</Text>
          </View>
          <View>
            <Text style={s.brandName}>AfterHarvest</Text>
            <Text style={s.brandCaption}>PRODUCE INSIGHTS</Text>
          </View>
        </View>

        <View style={s.statusPill}>
          <Dot color="#4B9362" />
          <Text style={s.statusText}>DEMO</Text>
        </View>
      </View>

      <View style={s.welcome}>
        <Text style={s.kicker}>TOMATO QUALITY WORKSPACE</Text>
        <Text style={s.heading}>
          Make better{'\n'}post-harvest decisions.
        </Text>
        <Text style={s.subtitle}>
          Start with a photo and a few storage details. Review a
          transparent demo assessment in minutes.
        </Text>
      </View>

      <View style={s.heroCard}>
        <View pointerEvents="none" style={s.heroOrbTop} />
        <View pointerEvents="none" style={s.heroOrbBottom} />

        <View style={s.heroTop}>
          <View style={s.heroTag}>
            <Dot color="#B4D6B8" />
            <Text style={s.heroTagText}>TOMATO EDITION</Text>
          </View>
          <Text style={s.heroEdition}>01 / MVP</Text>
        </View>

        <View style={s.heroMain}>
          <View style={s.heroCopy}>
            <Text style={s.heroTitle}>
              Every detail{'\n'}helps tell the story.
            </Text>
            <Text style={s.heroDescription}>
              Photo, temperature, humidity and storage duration.
            </Text>
          </View>
          <TomatoMark />
        </View>

        <View style={s.heroBottom}>
          <Text style={s.heroBottomText}>A guided quality check</Text>
          <Text style={s.heroBottomMeta}>3 SIMPLE STEPS</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start a new tomato assessment"
        onPress={onCapture}
        style={({pressed}) => [
          s.primaryAction,
          pressed ? s.primaryActionPressed : null,
        ]}>
        <View style={s.primaryCopy}>
          <Text style={s.primaryEyebrow}>READY WHEN YOU ARE</Text>
          <Text style={s.primaryTitle}>Start assessment</Text>
          <Text style={s.primaryDescription}>
            Add a produce photo and storage context
          </Text>
        </View>
        <ActionArrow />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open assessment history"
        onPress={onHistory}
        style={({pressed}) => [
          s.historyAction,
          pressed ? s.historyActionPressed : null,
        ]}>
        <View style={s.historyIcon}>
          <Text style={s.historyIconText}>↺</Text>
        </View>

        <View style={s.historyCopy}>
          <Text style={s.historyTitle}>Assessment history</Text>
          <Text style={s.historyDescription}>
            Revisit results saved in this session
          </Text>
        </View>

        <Text accessible={false} style={s.historyChevron}>›</Text>
      </Pressable>

      <View style={s.sectionHeader}>
        <View>
          <Text style={s.sectionTitle}>How it works</Text>
          <Text style={s.sectionSubtitle}>
            A simple, guided workflow
          </Text>
        </View>
        <View style={s.stepCount}>
          <Text style={s.stepCountText}>3 STEPS</Text>
        </View>
      </View>

      <Workflow />

      <View style={s.scopeRow}>
        <View style={s.scopeCard}>
          <View style={s.scopeIcon}>
            <Text style={s.scopeIconText}>01</Text>
          </View>
          <Text style={s.scopeTitle}>Focused scope</Text>
          <Text style={s.scopeDescription}>
            Built for tomato assessments in this prototype.
          </Text>
        </View>

        <View style={s.scopeCard}>
          <View style={s.scopeIcon}>
            <Text style={s.scopeIconText}>↺</Text>
          </View>
          <Text style={s.scopeTitle}>Session history</Text>
          <Text style={s.scopeDescription}>
            Results are available during the current app session.
          </Text>
        </View>
      </View>

      <View
        accessible
        accessibilityLabel="Prototype limitations. Results use demo storage-context heuristics. Images are validated but not analyzed by a trained AI model. Packaging does not affect demo scoring. Results do not certify food safety."
        style={s.disclosure}>
        <View style={s.disclosureHeader}>
          <View style={s.infoIcon}>
            <Text style={s.infoIconText}>i</Text>
          </View>
          <Text style={s.disclosureTitle}>
            Know what this demo does
          </Text>
        </View>

        <Text style={s.disclosureText}>
          Results use storage-context heuristics. Images are
          validated, not analyzed by a trained AI model. Packaging
          is recorded but does not affect demo scoring.
        </Text>

        <View style={s.disclosureDivider} />

        <Text style={s.disclosureFootnote}>
          Images are not permanently stored. This assessment does
          not certify food safety.
        </Text>
      </View>

      <Text style={s.footer}>
        PRESERVE QUALITY · REDUCE LOSS
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F8F5',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 16,
  },
  topBar: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#1C6846',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  brandName: {
    color: '#264934',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  brandCaption: {
    color: '#8A9A8D',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 3,
  },
  statusPill: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#E8F2EA',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    color: '#477452',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  welcome: {
    paddingTop: 7,
    paddingBottom: 3,
  },
  kicker: {
    color: '#548061',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heading: {
    color: '#183B29',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -1,
    marginTop: 10,
  },
  subtitle: {
    color: '#697C6E',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  heroCard: {
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#194E35',
    borderRadius: 24,
    padding: 19,
  },
  heroOrbTop: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    top: -95,
    right: -48,
    backgroundColor: 'rgba(114, 165, 119, 0.12)',
  },
  heroOrbBottom: {
    position: 'absolute',
    width: 125,
    height: 125,
    borderRadius: 63,
    bottom: -88,
    left: 98,
    backgroundColor: 'rgba(114, 165, 119, 0.09)',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  heroTag: {
    minHeight: 27,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 9,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  heroTagText: {
    color: '#D5E7D8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  heroEdition: {
    color: '#A8C4AF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  heroMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 145,
    paddingVertical: 14,
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    lineHeight: 29,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroDescription: {
    maxWidth: 210,
    color: '#BDD3C3',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 9,
  },
  tomatoMark: {
    width: 104,
    height: 112,
    flexShrink: 0,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tomatoGlow: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.055)',
  },
  tomatoBody: {
    position: 'absolute',
    width: 73,
    height: 72,
    top: 27,
    left: 16,
    borderRadius: 36,
    backgroundColor: '#E47758',
    borderBottomWidth: 6,
    borderBottomColor: '#D66348',
    transform: [{rotate: '-7deg'}],
  },
  tomatoShine: {
    position: 'absolute',
    width: 14,
    height: 24,
    top: 40,
    left: 28,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.22)',
    transform: [{rotate: '25deg'}],
  },
  tomatoStem: {
    position: 'absolute',
    width: 6,
    height: 21,
    top: 14,
    left: 50,
    borderRadius: 4,
    backgroundColor: '#83A96A',
    transform: [{rotate: '10deg'}],
  },
  tomatoLeafLeft: {
    position: 'absolute',
    width: 28,
    height: 11,
    top: 27,
    left: 28,
    borderRadius: 9,
    backgroundColor: '#8EB577',
    transform: [{rotate: '25deg'}],
  },
  tomatoLeafRight: {
    position: 'absolute',
    width: 28,
    height: 11,
    top: 27,
    left: 48,
    borderRadius: 9,
    backgroundColor: '#71985C',
    transform: [{rotate: '-25deg'}],
  },
  heroBottom: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.13)',
    paddingTop: 11,
  },
  heroBottomText: {
    color: '#C2D7C9',
    fontSize: 10,
  },
  heroBottomMeta: {
    color: '#AFC8B5',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  primaryAction: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 16,
    borderRadius: 19,
    backgroundColor: '#1C6846',
  },
  primaryCopy: {
    flex: 1,
  },
  primaryEyebrow: {
    color: '#B8D6C1',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  primaryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  primaryDescription: {
    color: '#C0D8C7',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },
  arrowCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 21,
    lineHeight: 24,
  },
  historyAction: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2EAE3',
    backgroundColor: '#FFFFFF',
  },
  historyIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF4EF',
  },
  historyIconText: {
    color: '#4C7A58',
    fontSize: 22,
    fontWeight: '600',
  },
  historyCopy: {
    flex: 1,
  },
  historyTitle: {
    color: '#34513D',
    fontSize: 13,
    fontWeight: '800',
  },
  historyDescription: {
    color: '#87968A',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },
  historyChevron: {
    color: '#84958A',
    fontSize: 27,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 5,
    marginBottom: -4,
  },
  sectionTitle: {
    color: '#2A4934',
    fontSize: 17,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#839186',
    fontSize: 11,
    marginTop: 4,
  },
  stepCount: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EAF2EB',
  },
  stepCountText: {
    color: '#5F8067',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  workflowCard: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E3EBE5',
    backgroundColor: '#FFFFFF',
  },
  workflowRow: {
    minHeight: 76,
    flexDirection: 'row',
    gap: 13,
  },
  timeline: {
    width: 34,
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    marginTop: 16,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF5EF',
  },
  stepNumber: {
    color: '#558362',
    fontSize: 9,
    fontWeight: '800',
  },
  timelineLine: {
    position: 'absolute',
    width: 1,
    top: 48,
    bottom: -1,
    backgroundColor: '#E5EDE6',
  },
  workflowCopy: {
    flex: 1,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2EE',
    paddingVertical: 12,
  },
  workflowCopyBorder: {
    borderBottomColor: '#EDF2EE',
  },
  workflowTitle: {
    color: '#385541',
    fontSize: 12,
    fontWeight: '800',
  },
  workflowDescription: {
    color: '#849388',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },
  scopeRow: {
    flexDirection: 'row',
    gap: 11,
  },
  scopeCard: {
    flex: 1,
    minHeight: 132,
    padding: 14,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E2EAE3',
    backgroundColor: '#EFF5F0',
  },
  scopeIcon: {
    width: 29,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#E0ECE3',
    marginBottom: 11,
  },
  scopeIconText: {
    color: '#5D8066',
    fontSize: 9,
    fontWeight: '800',
  },
  scopeTitle: {
    color: '#45634D',
    fontSize: 11,
    fontWeight: '800',
  },
  scopeDescription: {
    color: '#829387',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 5,
  },
  disclosure: {
    padding: 15,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E2E9E3',
    backgroundColor: '#F0F4F0',
  },
  disclosureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoIcon: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DFE9E1',
  },
  infoIconText: {
    color: '#587760',
    fontSize: 12,
    fontWeight: '800',
  },
  disclosureTitle: {
    color: '#526D59',
    fontSize: 11,
    fontWeight: '800',
  },
  disclosureText: {
    color: '#75877A',
    fontSize: 10,
    lineHeight: 16,
  },
  disclosureDivider: {
    height: 1,
    marginVertical: 10,
    backgroundColor: '#DEE7E0',
  },
  disclosureFootnote: {
    color: '#829286',
    fontSize: 9,
    lineHeight: 15,
  },
  footer: {
    color: '#9AA69D',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.1,
    textAlign: 'center',
    marginTop: 1,
  },
  primaryActionPressed: {
    opacity: 0.84,
    transform: [{scale: 0.99}],
  },
  historyActionPressed: {
    backgroundColor: '#F5F9F5',
    borderColor: '#C8D9CC',
  },
});