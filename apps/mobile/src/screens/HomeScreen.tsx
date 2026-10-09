import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

type Props = {
  onCapture: () => void;
  onHistory: () => void;
};

const C = {
  page: '#F7F7F2',
  card: '#FFFFFF',
  ink: '#202B22',
  muted: '#788077',
  faint: '#9AA197',
  line: '#E9EAE2',
  green: '#244F38',
  greenLight: '#E8EFE7',
  lime: '#D2E3A6',
  coral: '#E27D5E',
};

const STEPS = [
  {
    n: '01',
    title: 'Photograph',
    description: 'Add a clear image of your tomato.',
    icon: 'camera-outline' as const,
  },
  {
    n: '02',
    title: 'Add context',
    description: 'Enter storage temperature, humidity and days.',
    icon: 'thermometer-outline' as const,
  },
  {
    n: '03',
    title: 'Review',
    description: 'See your demo result and its contributing factors.',
    icon: 'bar-chart-outline' as const,
  },
];

function IconButton({
  name,
  color,
  backgroundColor,
  size = 19,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  backgroundColor: string;
  size?: number;
}) {
  return (
    <View style={[styles.iconButton, {backgroundColor}]}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

function FruitArtwork() {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={styles.fruitArtwork}>
      <View style={styles.fruitHalo} />
      <View style={styles.fruitShadow} />
      <View style={styles.fruitBody} />
      <View style={styles.fruitShine} />
      <View style={styles.fruitStem} />
      <View style={styles.fruitLeafOne} />
      <View style={styles.fruitLeafTwo} />
      <View style={styles.fruitLeafThree} />
    </View>
  );
}

export default function HomeScreen({onCapture, onHistory}: Props) {
  const {width} = useWindowDimensions();
  const isNarrow = width < 360;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        width >= 720 ? styles.contentWide : null,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <View style={styles.brand}>
          <View style={styles.brandMark}>
            <Ionicons name="leaf" size={18} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.brandName}>AfterHarvest</Text>
            <Text style={styles.brandMeta}>FIELD QUALITY TOOLS</Text>
          </View>
        </View>

        <View style={styles.demoStatus}>
          <View style={styles.statusDot} />
          <Text style={styles.demoStatusText}>PROTOTYPE</Text>
        </View>
      </View>

      <View style={styles.greeting}>
        <Text style={styles.greetingOverline}>YOUR PRODUCE WORKSPACE</Text>
        <Text
          accessibilityRole="header"
          style={[
            styles.greetingTitle,
            isNarrow ? styles.greetingTitleNarrow : null,
          ]}>
          Quality starts{'\n'}with good context.
        </Text>
        <Text style={styles.greetingBody}>
          Explore a tomato assessment using a photo and the conditions
          it was stored in.
        </Text>
      </View>

      <View style={styles.featureCard}>
        <View style={styles.featureTopRow}>
          <View style={styles.featureLabel}>
            <View style={styles.featureLabelDot} />
            <Text style={styles.featureLabelText}>CURRENT PILOT</Text>
          </View>
          <Ionicons
            name="arrow-up-right"
            size={18}
            color="#D8E5D5"
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        </View>

        <View style={styles.featureMiddle}>
          <View style={styles.featureCopy}>
            <Text style={styles.featureTitle}>Tomato quality</Text>
            <Text style={styles.featureSubtitle}>
              Photo-led · Context-aware
            </Text>
          </View>
          <FruitArtwork />
        </View>

        <View style={styles.featureBottom}>
          <View style={styles.featureBottomItem}>
            <Ionicons
              name="image-outline"
              size={14}
              color="#D5E3D5"
            />
            <Text style={styles.featureBottomText}>PHOTO</Text>
          </View>
          <View style={styles.featureBottomDivider} />
          <View style={styles.featureBottomItem}>
            <Ionicons
              name="thermometer-outline"
              size={14}
              color="#D5E3D5"
            />
            <Text style={styles.featureBottomText}>STORAGE</Text>
          </View>
          <View style={styles.featureBottomDivider} />
          <Text style={styles.featureDemo}>DEMO MODEL</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Start a new tomato assessment"
          accessibilityHint="Opens the photo and storage details form"
          onPress={onCapture}
          style={({pressed}) => [
            styles.startAction,
            pressed ? styles.startActionPressed : null,
          ]}>
          <View style={styles.startIconWrap}>
            <Ionicons name="add" size={24} color={C.green} />
          </View>
          <View style={styles.startTextWrap}>
            <Text style={styles.startEyebrow}>START SOMETHING NEW</Text>
            <Text style={styles.startTitle}>Create assessment</Text>
          </View>
          <Ionicons
            name="arrow-forward"
            size={19}
            color="#EAF0E8"
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open assessment history"
          accessibilityHint="View assessments saved for this session"
          onPress={onHistory}
          style={({pressed}) => [
            styles.historyAction,
            pressed ? styles.historyActionPressed : null,
          ]}>
          <IconButton
            name="time-outline"
            color={C.green}
            backgroundColor={C.greenLight}
          />
          <View style={styles.historyTextWrap}>
            <Text style={styles.historyTitle}>Recent assessments</Text>
            <Text style={styles.historySubtitle}>
              View this session’s results
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={17}
            color="#879087"
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        </Pressable>
      </View>

      <View style={styles.sectionHeading}>
        <View>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            The process
          </Text>
          <Text style={styles.sectionCaption}>
            From a photo to a clearer picture
          </Text>
        </View>
        <Text style={styles.sectionCount}>03 STEPS</Text>
      </View>

      <View style={styles.stepsCard}>
        {STEPS.map((step, index) => (
          <View
            key={step.n}
            style={[
              styles.stepRow,
              index < STEPS.length - 1 ? styles.stepBorder : null,
            ]}>
            <View style={styles.stepIcon}>
              <Ionicons name={step.icon} size={18} color={C.green} />
            </View>

            <View style={styles.stepContent}>
              <View style={styles.stepTitleLine}>
                <Text style={styles.stepNumber}>{step.n}</Text>
                <Text style={styles.stepTitle}>{step.title}</Text>
              </View>
              <Text style={styles.stepDescription}>
                {step.description}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={15}
              color="#BAC3B8"
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
          </View>
        ))}
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <IconButton
            name="nutrition-outline"
            color="#557455"
            backgroundColor="#E9F0E5"
            size={18}
          />
          <Text style={styles.infoTitle}>Tomato-only pilot</Text>
          <Text style={styles.infoBody}>
            This prototype currently supports tomato assessments.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <IconButton
            name="phone-portrait-outline"
            color="#557455"
            backgroundColor="#E9F0E5"
            size={18}
          />
          <Text style={styles.infoTitle}>Session-based</Text>
          <Text style={styles.infoBody}>
            Saved history resets when the app restarts.
          </Text>
        </View>
      </View>

      <View style={styles.disclaimer}>
        <View style={styles.disclaimerHeading}>
          <Ionicons
            name="information-circle-outline"
            size={17}
            color="#756B49"
          />
          <Text style={styles.disclaimerTitle}>Prototype, clearly labeled</Text>
        </View>
        <Text style={styles.disclaimerBody}>
          Results currently use storage-context heuristics. Images are
          validated but not analyzed by a trained AI model. Packaging
          does not affect demo scoring.
        </Text>
        <Text style={styles.disclaimerFoot}>
          Images are not permanently stored. Results do not certify food
          safety.
        </Text>
      </View>

      <View style={styles.footer}>
        <Ionicons name="leaf-outline" size={14} color="#929B91" />
        <Text style={styles.footerText}>PRESERVE QUALITY · REDUCE LOSS</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.page,
  },
  content: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 34,
    gap: 18,
  },
  contentWide: {
    paddingHorizontal: 30,
    paddingTop: 24,
    gap: 21,
  },
  header: {
    minHeight: 44,
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
    borderRadius: 12,
    backgroundColor: C.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: C.ink,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.25,
  },
  brandMeta: {
    color: C.muted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.9,
    marginTop: 3,
  },
  demoStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#E9EFE6',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6D8A54',
  },
  demoStatusText: {
    color: '#687B50',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  greeting: {
    paddingTop: 5,
  },
  greetingOverline: {
    color: '#72836F',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  greetingTitle: {
    color: C.ink,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -1,
    fontWeight: '800',
    marginTop: 9,
  },
  greetingTitleNarrow: {
    fontSize: 28,
    lineHeight: 34,
  },
  greetingBody: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 9,
    maxWidth: 520,
  },
  featureCard: {
    minHeight: 226,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 22,
    backgroundColor: C.green,
  },
  featureTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featureLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  featureLabelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.lime,
  },
  featureLabelText: {
    color: '#E2EBDD',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  featureMiddle: {
    minHeight: 127,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureCopy: {
    flex: 1,
    zIndex: 1,
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  featureSubtitle: {
    color: '#D0DFD1',
    fontSize: 11,
    marginTop: 7,
  },
  fruitArtwork: {
    position: 'absolute',
    width: 145,
    height: 145,
    right: -13,
    top: -8,
  },
  fruitHalo: {
    position: 'absolute',
    width: 128,
    height: 128,
    left: 8,
    top: 6,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  fruitShadow: {
    position: 'absolute',
    width: 76,
    height: 10,
    left: 35,
    bottom: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.14)',
  },
  fruitBody: {
    position: 'absolute',
    width: 81,
    height: 77,
    left: 31,
    top: 42,
    borderRadius: 42,
    backgroundColor: C.coral,
    borderBottomWidth: 6,
    borderBottomColor: '#CF694F',
    transform: [{rotate: '-8deg'}],
  },
  fruitShine: {
    position: 'absolute',
    width: 14,
    height: 26,
    left: 47,
    top: 55,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.24)',
    transform: [{rotate: '25deg'}],
  },
  fruitStem: {
    position: 'absolute',
    width: 6,
    height: 19,
    left: 69,
    top: 27,
    borderRadius: 4,
    backgroundColor: '#91A96C',
    transform: [{rotate: '10deg'}],
  },
  fruitLeafOne: {
    position: 'absolute',
    width: 27,
    height: 11,
    left: 48,
    top: 40,
    borderRadius: 8,
    backgroundColor: '#A6B979',
    transform: [{rotate: '24deg'}],
  },
  fruitLeafTwo: {
    position: 'absolute',
    width: 27,
    height: 11,
    left: 66,
    top: 40,
    borderRadius: 8,
    backgroundColor: '#829C5D',
    transform: [{rotate: '-25deg'}],
  },
  fruitLeafThree: {
    position: 'absolute',
    width: 20,
    height: 9,
    left: 56,
    top: 36,
    borderRadius: 8,
    backgroundColor: '#90A767',
  },
  featureBottom: {
    minHeight: 33,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 10,
  },
  featureBottomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  featureBottomText: {
    color: '#D5E1D5',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  featureBottomDivider: {
    width: 1,
    height: 13,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  featureDemo: {
    marginLeft: 'auto',
    color: '#D5E1D5',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actions: {
    gap: 10,
  },
  startAction: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: C.green,
  },
  startIconWrap: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: C.lime,
  },
  startTextWrap: {
    flex: 1,
  },
  startEyebrow: {
    color: '#C8DCCB',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  startTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },
  historyAction: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.card,
  },
  iconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  historyTextWrap: {
    flex: 1,
  },
  historyTitle: {
    color: '#35483A',
    fontSize: 12,
    fontWeight: '800',
  },
  historySubtitle: {
    color: C.muted,
    fontSize: 10,
    marginTop: 4,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 3,
    marginBottom: -5,
  },
  sectionTitle: {
    color: C.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  sectionCaption: {
    color: C.muted,
    fontSize: 10,
    marginTop: 4,
  },
  sectionCount: {
    color: '#71836F',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  stepsCard: {
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 19,
    backgroundColor: C.card,
  },
  stepRow: {
    minHeight: 77,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  stepBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0EA',
  },
  stepIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#EEF3EA',
  },
  stepContent: {
    flex: 1,
    minWidth: 0,
  },
  stepTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  stepNumber: {
    color: '#82927A',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stepTitle: {
    flex: 1,
    color: '#35493A',
    fontSize: 11,
    fontWeight: '800',
  },
  stepDescription: {
    color: C.muted,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 4,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  infoCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 130,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5EAE1',
    backgroundColor: '#EFF3EB',
  },
  infoTitle: {
    color: '#465A44',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 9,
  },
  infoBody: {
    color: '#7D897B',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 5,
  },
  disclaimer: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9E4D5',
    backgroundColor: '#F3F0E5',
  },
  disclaimerHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 7,
  },
  disclaimerTitle: {
    color: '#696044',
    fontSize: 10,
    fontWeight: '800',
  },
  disclaimerBody: {
    color: '#79745F',
    fontSize: 9,
    lineHeight: 15,
  },
  disclaimerFoot: {
    color: '#89836D',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 1,
  },
  footerText: {
    color: C.faint,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  startActionPressed: {
    opacity: 0.85,
    transform: [{scale: 0.99}],
  },
  historyActionPressed: {
    backgroundColor: '#F0F4EE',
    borderColor: '#CAD8C8',
  },
});