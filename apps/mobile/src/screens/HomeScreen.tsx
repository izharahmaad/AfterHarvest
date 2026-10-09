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

const COLORS = {
  background: '#F6F8F5',
  surface: '#FFFFFF',
  ink: '#18372A',
  muted: '#748277',
  subtle: '#A0ACA3',
  line: '#E6ECE6',
  green: '#236B49',
  greenDark: '#164B34',
  greenSoft: '#EAF3EC',
  orange: '#E98761',
};

const STEPS = [
  {
    number: '01',
    title: 'Photograph your produce',
    description: 'Take a photo or choose one from your gallery.',
    icon: 'camera-outline' as const,
  },
  {
    number: '02',
    title: 'Add storage conditions',
    description: 'Record temperature, humidity and duration.',
    icon: 'options-outline' as const,
  },
  {
    number: '03',
    title: 'Review the assessment',
    description: 'See the result and the factors behind it.',
    icon: 'analytics-outline' as const,
  },
];

function IconTile({
  name,
  size = 20,
  color = COLORS.green,
  background = COLORS.greenSoft,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  size?: number;
  color?: string;
  background?: string;
}) {
  return (
    <View style={[styles.iconTile, {backgroundColor: background}]}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

function WorkflowCard() {
  return (
    <View style={styles.workflowCard}>
      {STEPS.map((step, index) => (
        <View
          key={step.number}
          style={[
            styles.workflowItem,
            index < STEPS.length - 1 ? styles.workflowItemBorder : null,
          ]}>
          <View style={styles.workflowIconWrap}>
            <Ionicons name={step.icon} size={19} color={COLORS.green} />
          </View>

          <View style={styles.workflowCopy}>
            <Text style={styles.workflowNumber}>STEP {step.number}</Text>
            <Text style={styles.workflowTitle}>{step.title}</Text>
            <Text style={styles.workflowDescription}>
              {step.description}
            </Text>
          </View>

          <Ionicons
            name="checkmark-circle-outline"
            size={18}
            color="#C5D4C8"
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        </View>
      ))}
    </View>
  );
}

export default function HomeScreen({onCapture, onHistory}: Props) {
  const {width} = useWindowDimensions();
  const compact = width < 360;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        width >= 700 ? styles.contentWide : null,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <View style={styles.brand}>
          <View style={styles.brandIcon}>
            <Ionicons name="leaf" size={19} color="#FFFFFF" />
          </View>

          <View>
            <Text style={styles.brandName}>AfterHarvest</Text>
            <Text style={styles.brandCaption}>PRODUCE INTELLIGENCE</Text>
          </View>
        </View>

        <View style={styles.modeBadge}>
          <View style={styles.modeDot} />
          <Text style={styles.modeText}>DEMO</Text>
        </View>
      </View>

      <View style={[styles.intro, compact ? styles.introCompact : null]}>
        <Text style={styles.eyebrow}>TOMATO QUALITY WORKSPACE</Text>

        <Text
          accessibilityRole="header"
          style={[styles.heading, compact ? styles.headingCompact : null]}>
          Know your produce.{'\n'}
          <Text style={styles.headingAccent}>Make informed decisions.</Text>
        </Text>

        <Text style={styles.introDescription}>
          Assess a tomato using its photo and storage conditions—all in
          one simple workflow.
        </Text>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <View style={styles.heroPill}>
            <Ionicons
              name="sparkles-outline"
              size={13}
              color="#D6E8DA"
            />
            <Text style={styles.heroPillText}>A SIMPLE QUALITY CHECK</Text>
          </View>

          <Text style={styles.heroTitle}>
            Small inputs.{'\n'}Clearer context.
          </Text>

          <Text style={styles.heroDescription}>
            Photo + storage information
          </Text>
        </View>

        <View
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          style={styles.produceArt}>
          <View style={styles.produceHalo} />
          <View style={styles.produceLeafLeft} />
          <View style={styles.produceLeafRight} />
          <View style={styles.produceStem} />
          <View style={styles.produceFruit} />
          <View style={styles.produceShine} />
        </View>

        <View style={styles.heroBottom}>
          <View style={styles.heroBottomLabel}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color="#C7DDCD"
            />
            <Text style={styles.heroBottomText}>
              Demo results use storage heuristics
            </Text>
          </View>
          <Text style={styles.heroEdition}>TOMATO · 01</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start a new tomato assessment"
        accessibilityHint="Opens the screen to add a photo and storage conditions"
        onPress={onCapture}
        style={({pressed}) => [
          styles.startButton,
          pressed ? styles.startButtonPressed : null,
        ]}>
        <View style={styles.startIcon}>
          <Ionicons name="add" size={25} color="#FFFFFF" />
        </View>

        <View style={styles.startCopy}>
          <Text style={styles.startEyebrow}>GET STARTED</Text>
          <Text style={styles.startTitle}>New assessment</Text>
          <Text style={styles.startDescription}>
            Add a photo and storage details
          </Text>
        </View>

        <Ionicons
          name="arrow-forward"
          size={20}
          color="#E3F0E6"
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open assessment history"
        accessibilityHint="Shows results saved during this app session"
        onPress={onHistory}
        style={({pressed}) => [
          styles.historyButton,
          pressed ? styles.historyButtonPressed : null,
        ]}>
        <IconTile name="time-outline" size={19} />

        <View style={styles.historyCopy}>
          <Text style={styles.historyTitle}>Assessment history</Text>
          <Text style={styles.historyDescription}>
            Revisit results from this session
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color="#89988D"
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      </Pressable>

      <View style={styles.sectionHeadingRow}>
        <View>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            How it works
          </Text>
          <Text style={styles.sectionSubtitle}>
            Three clear steps, from photo to result
          </Text>
        </View>

        <View style={styles.stepsBadge}>
          <Text style={styles.stepsBadgeText}>3 STEPS</Text>
        </View>
      </View>

      <WorkflowCard />

      <View style={styles.scopeGrid}>
        <View style={styles.scopeCard}>
          <IconTile
            name="nutrition-outline"
            size={18}
            color="#517957"
            background="#E6F0E7"
          />
          <Text style={styles.scopeTitle}>Focused prototype</Text>
          <Text style={styles.scopeText}>
            This release is designed for tomatoes.
          </Text>
        </View>

        <View style={styles.scopeCard}>
          <IconTile
            name="phone-portrait-outline"
            size={18}
            color="#517957"
            background="#E6F0E7"
          />
          <Text style={styles.scopeTitle}>Session history</Text>
          <Text style={styles.scopeText}>
            History resets when the app restarts.
          </Text>
        </View>
      </View>

      <View style={styles.disclosure}>
        <View style={styles.disclosureTitleRow}>
          <IconTile
            name="information-circle-outline"
            size={17}
            color="#7B704A"
            background="#F0EBD9"
          />
          <Text style={styles.disclosureTitle}>
            What this demo does—and doesn’t do
          </Text>
        </View>

        <Text style={styles.disclosureText}>
          The current result uses storage-context heuristics. The image
          is validated but not analyzed by a trained AI model. Packaging
          is recorded but does not affect demo scoring.
        </Text>

        <View style={styles.disclosureDivider} />

        <Text style={styles.disclosureFootnote}>
          Images are not permanently stored. Results do not certify food
          safety.
        </Text>
      </View>

      <View style={styles.footer}>
        <Ionicons name="leaf-outline" size={14} color="#91A397" />
        <Text style={styles.footerText}>PRESERVE QUALITY · REDUCE LOSS</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 36,
    gap: 17,
  },
  contentWide: {
    paddingHorizontal: 28,
    paddingTop: 22,
    gap: 20,
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
  brandIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.green,
  },
  brandName: {
    color: COLORS.ink,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  brandCaption: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 3,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#EAF3EC',
  },
  modeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#458556',
  },
  modeText: {
    color: '#477452',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  intro: {
    paddingTop: 8,
  },
  introCompact: {
    paddingTop: 2,
  },
  eyebrow: {
    color: '#548061',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heading: {
    color: COLORS.ink,
    fontSize: 30,
    lineHeight: 37,
    fontWeight: '800',
    letterSpacing: -0.9,
    marginTop: 9,
  },
  headingCompact: {
    fontSize: 27,
    lineHeight: 34,
  },
  headingAccent: {
    color: COLORS.green,
  },
  introDescription: {
    maxWidth: 500,
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
  },
  hero: {
    minHeight: 198,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
    padding: 19,
    borderRadius: 24,
    backgroundColor: COLORS.greenDark,
  },
  heroCopy: {
    maxWidth: '76%',
    zIndex: 1,
  },
  heroPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.11)',
  },
  heroPillText: {
    color: '#D6E8DA',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    lineHeight: 29,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 15,
  },
  heroDescription: {
    color: '#C2D8C8',
    fontSize: 11,
    marginTop: 8,
  },
  produceArt: {
    position: 'absolute',
    width: 145,
    height: 145,
    right: 5,
    top: 25,
  },
  produceHalo: {
    position: 'absolute',
    width: 130,
    height: 130,
    top: 4,
    left: 8,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.055)',
  },
  produceFruit: {
    position: 'absolute',
    width: 82,
    height: 78,
    top: 39,
    left: 33,
    borderRadius: 42,
    backgroundColor: COLORS.orange,
    borderBottomWidth: 6,
    borderBottomColor: '#D96D4E',
    transform: [{rotate: '-8deg'}],
  },
  produceShine: {
    position: 'absolute',
    width: 15,
    height: 27,
    top: 53,
    left: 49,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.24)',
    transform: [{rotate: '24deg'}],
  },
  produceStem: {
    position: 'absolute',
    width: 6,
    height: 20,
    top: 25,
    left: 70,
    borderRadius: 4,
    backgroundColor: '#83A96A',
    transform: [{rotate: '10deg'}],
  },
  produceLeafLeft: {
    position: 'absolute',
    width: 29,
    height: 12,
    top: 39,
    left: 48,
    borderRadius: 10,
    backgroundColor: '#91B779',
    transform: [{rotate: '25deg'}],
  },
  produceLeafRight: {
    position: 'absolute',
    width: 29,
    height: 12,
    top: 39,
    left: 68,
    borderRadius: 10,
    backgroundColor: '#72995E',
    transform: [{rotate: '-25deg'}],
  },
  heroBottom: {
    minHeight: 31,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 7,
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
  },
  heroBottomLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBottomText: {
    color: '#C7DCCB',
    fontSize: 9,
  },
  heroEdition: {
    color: '#A7C3AE',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  startButton: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 19,
    backgroundColor: COLORS.green,
  },
  startIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
  },
  startCopy: {
    flex: 1,
    minWidth: 0,
  },
  startEyebrow: {
    color: '#C2DCC9',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  startTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 3,
  },
  startDescription: {
    color: '#C8DDD0',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },
  historyButton: {
    minHeight: 67,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
  },
  iconTile: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  historyCopy: {
    flex: 1,
  },
  historyTitle: {
    color: '#304C38',
    fontSize: 12,
    fontWeight: '800',
  },
  historyDescription: {
    color: '#839187',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 5,
  },
  sectionTitle: {
    color: '#284633',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#829087',
    fontSize: 10,
    marginTop: 4,
  },
  stepsBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EAF2EB',
  },
  stepsBadgeText: {
    color: '#5C7C64',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  workflowCard: {
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.surface,
  },
  workflowItem: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  workflowItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EDF1ED',
  },
  workflowIconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#EDF4EE',
  },
  workflowCopy: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 12,
  },
  workflowNumber: {
    color: '#75917B',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  workflowTitle: {
    color: '#354F3C',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
  },
  workflowDescription: {
    color: '#829087',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },
  scopeGrid: {
    flexDirection: 'row',
    gap: 11,
  },
  scopeCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 137,
    padding: 13,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E2EAE3',
    backgroundColor: '#EFF5F0',
  },
  scopeTitle: {
    color: '#45614C',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 10,
  },
  scopeText: {
    color: '#819087',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 5,
  },
  disclosure: {
    padding: 15,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E8E5D8',
    backgroundColor: '#F4F2E9',
  },
  disclosureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 9,
  },
  disclosureTitle: {
    flex: 1,
    color: '#655F47',
    fontSize: 11,
    fontWeight: '800',
  },
  disclosureText: {
    color: '#77745F',
    fontSize: 10,
    lineHeight: 16,
  },
  disclosureDivider: {
    height: 1,
    backgroundColor: '#E4E0D0',
    marginVertical: 10,
  },
  disclosureFootnote: {
    color: '#88836C',
    fontSize: 9,
    lineHeight: 15,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingTop: 1,
  },
  footerText: {
    color: '#91A095',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  startButtonPressed: {
    opacity: 0.86,
    transform: [{scale: 0.99}],
  },
  historyButtonPressed: {
    backgroundColor: '#F1F6F2',
    borderColor: '#C9D9CC',
  },
});