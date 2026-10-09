import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  onCapture: () => void;
  onHistory: () => void;
};

type WorkflowStep = {
  number: string;
  title: string;
  description: string;
};

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    number: '01',
    title: 'Add a photo',
    description: 'Capture a tomato or choose an image.',
  },
  {
    number: '02',
    title: 'Enter storage details',
    description: 'Add temperature, humidity and storage days.',
  },
  {
    number: '03',
    title: 'Review the assessment',
    description: 'Explore the demo score and context factors.',
  },
];

function TomatoIllustration() {
  return (
    <View
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={s.tomatoIllustration}>
      <View style={s.tomatoHalo} />
      <View style={s.tomatoShadow} />
      <View style={s.tomatoBody} />
      <View style={s.tomatoHighlight} />
      <View style={s.tomatoStem} />
      <View style={s.tomatoLeafLeft} />
      <View style={s.tomatoLeafRight} />
    </View>
  );
}

function WorkflowCard() {
  return (
    <View style={s.stepsCard}>
      {WORKFLOW_STEPS.map((step, index) => {
        const showDivider = index < WORKFLOW_STEPS.length - 1;

        return (
          <View
            key={step.number}
            style={[
              s.stepRow,
              showDivider ? s.stepRowBorder : null,
            ]}>
            <View style={s.stepNumber}>
              <Text style={s.stepNumberText}>{step.number}</Text>
            </View>

            <View style={s.stepCopy}>
              <Text style={s.stepTitle}>{step.title}</Text>
              <Text style={s.stepDescription}>
                {step.description}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
export default function HomeScreen({
  onCapture,
  onHistory,
}: Props) {
  return (
    <View style={s.container}>
      <View style={s.intro}>
        <View style={s.badge}>
          <View style={s.badgeDot} />
          <Text style={s.badgeText}>
            POST-HARVEST INTELLIGENCE
          </Text>
        </View>

        <Text style={s.heading}>
          Understand your{'\n'}produce better.
        </Text>

        <Text style={s.subtitle}>
          Bring your tomato photo and storage details together
          in one simple assessment.
        </Text>
      </View>

      <View style={s.hero}>
        <View
          pointerEvents="none"
          accessible={false}
          style={s.heroDecoration}
        />

        <View
          pointerEvents="none"
          accessible={false}
          style={s.heroDecorationSmall}
        />

        <View style={s.heroTop}>
          <View style={s.heroBadge}>
            <View style={s.heroBadgeDot} />
            <Text style={s.heroBadgeText}>TOMATO EDITION</Text>
          </View>

          <Text style={s.heroVersion}>MVP / 01</Text>
        </View>

        <View style={s.heroBody}>
          <View style={s.heroCopy}>
            <Text style={s.heroTitle}>
              Small details.{'\n'}Clearer insights.
            </Text>

            <Text style={s.heroDescription}>
              Start with a photo.{'\n'}Add the storage context.
            </Text>
          </View>

          <TomatoIllustration />
        </View>

        <View style={s.heroDivider} />

        <View style={s.heroFooter}>
          <Text style={s.heroFooterText}>
            Photo + storage context
          </Text>

          <View style={s.demoPill}>
            <Text style={s.demoPillText}>DEMO MODE</Text>
          </View>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start a new tomato assessment"
        onPress={onCapture}
        style={({pressed}) => [
          s.primaryAction,
          pressed ? s.pressed : null,
        ]}>
        <View style={s.primaryIcon}>
          <Text style={s.primaryIconText}>+</Text>
        </View>

        <View style={s.actionCopy}>
          <Text style={s.primaryTitle}>New assessment</Text>
          <Text style={s.primaryDescription}>
            Add a photo and storage details
          </Text>
        </View>

        <Text style={s.primaryArrow}>→</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open assessment history"
        onPress={onHistory}
        style={({pressed}) => [
          s.secondaryAction,
          pressed ? s.secondaryPressed : null,
        ]}>
        <View style={s.secondaryIcon}>
          <Text style={s.secondaryIconText}>H</Text>
        </View>

        <View style={s.actionCopy}>
          <Text style={s.secondaryTitle}>Assessment history</Text>
          <Text style={s.secondaryDescription}>
            Revisit results from this session
          </Text>
        </View>

        <Text style={s.secondaryArrow}>›</Text>
      </Pressable>

      <View style={s.section}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>A simple workflow</Text>
          <Text style={s.sectionLabel}>THREE STEPS</Text>
        </View>

        <WorkflowCard />
      </View>

      <View style={s.scopeRow}>
        <View style={s.scopeCard}>
          <View style={s.scopeIcon}>
            <Text style={s.scopeIconText}>T</Text>
          </View>

          <Text style={s.scopeTitle}>Tomato only</Text>
          <Text style={s.scopeDescription}>
            Focused first-release scope
          </Text>
        </View>

        <View style={s.scopeCard}>
          <View style={s.scopeIcon}>
            <Text style={s.scopeIconText}>S</Text>
          </View>

          <Text style={s.scopeTitle}>Session history</Text>
          <Text style={s.scopeDescription}>
            Resets when the app restarts
          </Text>
        </View>
      </View>

      <View style={s.notice}>
        <View style={s.noticeHeader}>
          <View style={s.noticeIcon}>
            <Text style={s.noticeIconText}>i</Text>
          </View>

          <Text style={s.noticeTitle}>
            A transparent prototype
          </Text>
        </View>

        <Text style={s.noticeDescription}>
          Current results use demo storage-context heuristics.
          Images are validated, not analyzed by a trained AI model.
          Packaging is recorded but does not affect demo scoring.
        </Text>

        <View style={s.noticeDivider} />

        <Text style={s.noticeFootnote}>
          Images are not permanently stored. Results do not
          certify food safety.
        </Text>
      </View>

      <Text style={s.footer}>
        Preserve quality. Reduce loss.
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    gap: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  intro: {
    marginBottom: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#E8F2EB',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#26744E',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#26744E',
  },
  heading: {
    fontSize: 32,
    lineHeight: 39,
    fontWeight: '800',
    letterSpacing: -0.9,
    color: '#173C2A',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#718174',
    marginTop: 10,
  },
  hero: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#194E35',
    borderRadius: 24,
    padding: 20,
  },
  heroDecoration: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: '#225C3F',
    top: -65,
    right: -70,
  },
  heroDecorationSmall: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#20563B',
    bottom: -70,
    left: -35,
  },
  heroTop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.09)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },
  heroBadgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#AAD0AE',
  },
  heroBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#D6E8D9',
  },
  heroVersion: {
    fontSize: 9,
    letterSpacing: 1,
    color: '#91B29D',
  },
  heroBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 22,
    marginBottom: 20,
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
  },
  heroTitle: {
    fontSize: 22,
    lineHeight: 29,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: '#FFFFFF',
  },
  heroDescription: {
    fontSize: 11,
    lineHeight: 18,
    color: '#AECCB8',
    marginTop: 10,
  },
  tomatoIllustration: {
    width: 104,
    height: 120,
    flexShrink: 0,
    position: 'relative',
  },
  tomatoHalo: {
    position: 'absolute',
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: 7,
    left: 3,
  },
  tomatoShadow: {
    position: 'absolute',
    width: 72,
    height: 12,
    borderRadius: 36,
    backgroundColor: 'rgba(0,0,0,0.15)',
    bottom: 9,
    left: 16,
  },
  tomatoBody: {
    position: 'absolute',
    width: 82,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E87859',
    top: 27,
    left: 11,
    borderBottomWidth: 7,
    borderBottomColor: '#D96649',
    transform: [{rotate: '-8deg'}],
  },
  tomatoHighlight: {
    position: 'absolute',
    width: 17,
    height: 28,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.19)',
    top: 41,
    left: 25,
    transform: [{rotate: '25deg'}],
  },
  tomatoStem: {
    position: 'absolute',
    width: 7,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#80A967',
    top: 13,
    left: 48,
    transform: [{rotate: '12deg'}],
  },
  tomatoLeafLeft: {
    position: 'absolute',
    width: 30,
    height: 12,
    borderRadius: 9,
    backgroundColor: '#8CB571',
    top: 27,
    left: 27,
    transform: [{rotate: '25deg'}],
  },
  tomatoLeafRight: {
    position: 'absolute',
    width: 29,
    height: 12,
    borderRadius: 9,
    backgroundColor: '#759D5E',
    top: 27,
    left: 48,
    transform: [{rotate: '-25deg'}],
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 13,
  },
  heroFooterText: {
    fontSize: 10,
    color: '#BDD4C4',
  },
  demoPill: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  demoPillText: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: '#C7DDCC',
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 82,
    borderRadius: 18,
    backgroundColor: '#1C6846',
    padding: 16,
  },
  primaryIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryIconText: {
    fontSize: 27,
    lineHeight: 32,
    color: '#E4F2E7',
  },
  actionCopy: {
    flex: 1,
    minWidth: 0,
  },
  primaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  primaryDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: '#B7D3C2',
    marginTop: 4,
  },
  primaryArrow: {
    fontSize: 23,
    color: '#D1E7D8',
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 82,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E9E2',
    padding: 16,
  },
  secondaryIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#EEF5EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryIconText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#5D8969',
  },
  secondaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#35533E',
  },
  secondaryDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: '#85968A',
    marginTop: 4,
  },
  secondaryArrow: {
    fontSize: 28,
    color: '#91A396',
  },
  section: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B4C36',
  },
  sectionLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#91A095',
  },
  stepsCard: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3EBE5',
    paddingHorizontal: 17,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 17,
  },
  stepRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2EE',
  },
  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#EEF5EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#558362',
  },
  stepCopy: {
    flex: 1,
    minWidth: 0,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B5944',
  },
  stepDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: '#8B9A90',
    marginTop: 4,
  },
  scopeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scopeCard: {
    flex: 1,
    padding: 15,
    borderRadius: 17,
    backgroundColor: '#EFF5F0',
    borderWidth: 1,
    borderColor: '#E2EBE4',
  },
  scopeIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#E1EDE4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 11,
  },
  scopeIconText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#5E8568',
  },
  scopeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#52705B',
  },
  scopeDescription: {
    fontSize: 10,
    lineHeight: 16,
    color: '#8A9C8F',
    marginTop: 5,
  },
  notice: {
    padding: 16,
    borderRadius: 17,
    backgroundColor: '#EEF3EF',
    borderWidth: 1,
    borderColor: '#DFE9E2',
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 9,
  },
  noticeIcon: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: '#DFEAE2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeIconText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5A7A63',
  },
  noticeTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#55735E',
  },
  noticeDescription: {
    fontSize: 11,
    lineHeight: 18,
    color: '#7C9083',
  },
  noticeDivider: {
    height: 1,
    backgroundColor: '#DCE6DF',
    marginVertical: 11,
  },
  noticeFootnote: {
    fontSize: 10,
    lineHeight: 17,
    color: '#879B8E',
  },
  footer: {
    fontSize: 10,
    letterSpacing: 0.4,
    textAlign: 'center',
    color: '#94A397',
    marginTop: 4,
  },
  pressed: {
    opacity: 0.8,
  },
  secondaryPressed: {
    backgroundColor: '#F3F8F4',
    borderColor: '#BDD3C4',
  },
});