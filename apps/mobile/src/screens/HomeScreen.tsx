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
  background: '#F5F6F2',
  surface: '#FFFFFF',
  ink: '#1F3025',
  text: '#526257',
  muted: '#7D897F',
  border: '#E5E9E2',
  green: '#225A3C',
  greenDark: '#193E2B',
  greenPale: '#E8F0E8',
  lime: '#D8E6B9',
  tomato: '#E47758',
};

const STEPS = [
  {
    number: '01',
    title: 'Photograph',
    description: 'Capture a tomato or select an existing photo.',
    icon: 'camera-outline' as const,
  },
  {
    number: '02',
    title: 'Add conditions',
    description: 'Enter temperature, humidity and storage days.',
    icon: 'options-outline' as const,
  },
  {
    number: '03',
    title: 'Explore results',
    description: 'Review the demo assessment and its context.',
    icon: 'analytics-outline' as const,
  },
];

function IconTile({
  name,
  color = C.green,
  background = C.greenPale,
  size = 19,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color?: string;
  background?: string;
  size?: number;
}) {
  return (
    <View style={[s.iconTile, {backgroundColor: background}]}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

function TomatoMark() {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={s.tomatoMark}>
      <View style={s.tomatoHalo} />
      <View style={s.tomatoBody} />
      <View style={s.tomatoHighlight} />
      <View style={s.tomatoStem} />
      <View style={s.tomatoLeafLeft} />
      <View style={s.tomatoLeafRight} />
    </View>
  );
}

export default function HomeScreen({onCapture, onHistory}: Props) {
  const {width} = useWindowDimensions();
  const narrow = width < 360;
  const tablet = width >= 700;

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={[
        s.content,
        tablet ? s.contentTablet : null,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <View style={s.header}>
        <View style={s.brand}>
          <View style={s.brandIcon}>
            <Ionicons name="leaf" size={19} color="#FFFFFF" />
          </View>

          <View>
            <Text style={s.brandName}>AfterHarvest</Text>
            <Text style={s.brandCaption}>PRODUCE INSIGHTS</Text>
          </View>
        </View>

        <View style={s.demoPill}>
          <View style={s.demoDot} />
          <Text style={s.demoText}>PROTOTYPE</Text>
        </View>
      </View>

      <View style={s.intro}>
        <Text style={s.eyebrow}>TOMATO QUALITY WORKSPACE</Text>

        <Text
          accessibilityRole="header"
          style={[s.heading, narrow ? s.headingNarrow : null]}>
          Understand your{'\n'}
          <Text style={s.headingAccent}>produce better.</Text>
        </Text>

        <Text style={s.introText}>
          Combine a tomato photo with its storage conditions to explore
          a clear, transparent demo assessment.
        </Text>
      </View>

      <View style={s.hero}>
        <View style={s.heroOrb} />

        <View style={s.heroHeader}>
          <View style={s.heroLabel}>
            <Ionicons
              name="sparkles-outline"
              size={13}
              color="#D9E8DA"
            />
            <Text style={s.heroLabelText}>CURRENT PILOT</Text>
          </View>

          <Ionicons
            name="arrow-up-right-box"
            size={19}
            color="#D7E4D8"
            accessible={false}
          />
        </View>

        <View style={s.heroContent}>
          <View style={s.heroCopy}>
            <Text style={s.heroTitle}>
              Tomato{'\n'}quality check
            </Text>
            <Text style={s.heroDescription}>
              Photo-led. Storage-aware.
            </Text>
          </View>

          <TomatoMark />
        </View>

        <View style={s.heroFooter}>
          <View style={s.heroMetadata}>
            <Ionicons
              name="image-outline"
              size={14}
              color="#D3E0D4"
            />
            <Text style={s.heroMetadataText}>PHOTO</Text>
          </View>

          <View style={s.heroMetadataDivider} />

          <View style={s.heroMetadata}>
            <Ionicons
              name="thermometer-outline"
              size={14}
              color="#D3E0D4"
            />
            <Text style={s.heroMetadataText}>STORAGE DATA</Text>
          </View>

          <View style={s.heroFooterSpace} />

          <Text style={s.heroDemo}>DEMO</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start a new tomato assessment"
        accessibilityHint="Opens the form to add a photo and storage conditions"
        onPress={onCapture}
        style={({pressed}) => [
          s.primaryAction,
          pressed ? s.primaryPressed : null,
        ]}>
        <View style={s.primaryIcon}>
          <Ionicons name="add" size={25} color={C.greenDark} />
        </View>

        <View style={s.primaryCopy}>
          <Text style={s.primaryOverline}>GET STARTED</Text>
          <Text style={s.primaryTitle}>New assessment</Text>
          <Text style={s.primaryDescription}>
            Add a photo and storage conditions
          </Text>
        </View>

        <View style={s.primaryArrow}>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open assessment history"
        accessibilityHint="View assessments saved during this session"
        onPress={onHistory}
        style={({pressed}) => [
          s.historyAction,
          pressed ? s.historyPressed : null,
        ]}>
        <IconTile name="time-outline" />

        <View style={s.historyCopy}>
          <Text style={s.historyTitle}>Assessment history</Text>
          <Text style={s.historyDescription}>
            Revisit results from this session
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={17}
          color={C.muted}
          accessible={false}
        />
      </Pressable>

      <View style={s.sectionHeader}>
        <View style={s.sectionHeadingCopy}>
          <Text accessibilityRole="header" style={s.sectionTitle}>
            How it works
          </Text>
          <Text style={s.sectionSubtitle}>
            Three steps from photo to result
          </Text>
        </View>

        <View style={s.stepCount}>
          <Text style={s.stepCountText}>03 STEPS</Text>
        </View>
      </View>

      <View style={s.stepsCard}>
        {STEPS.map((step, index) => (
          <View
            key={step.number}
            style={[
              s.stepRow,
              index < STEPS.length - 1 ? s.stepRowBorder : null,
            ]}>
            <IconTile
              name={step.icon}
              size={18}
              background="#EFF4ED"
            />

            <View style={s.stepCopy}>
              <View style={s.stepTitleRow}>
                <Text style={s.stepNumber}>{step.number}</Text>
                <Text style={s.stepTitle}>{step.title}</Text>
              </View>

              <Text style={s.stepDescription}>
                {step.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={s.infoRow}>
        <View style={s.infoCard}>
          <IconTile
            name="nutrition-outline"
            size={18}
            color="#57764F"
            background="#E6EEE1"
          />
          <Text style={s.infoTitle}>Tomato-first</Text>
          <Text style={s.infoDescription}>
            This prototype currently focuses on tomatoes.
          </Text>
        </View>

        <View style={s.infoCard}>
          <IconTile
            name="phone-portrait-outline"
            size={18}
            color="#57764F"
            background="#E6EEE1"
          />
          <Text style={s.infoTitle}>Session history</Text>
          <Text style={s.infoDescription}>
            History resets when the app restarts.
          </Text>
        </View>
      </View>

      <View style={s.disclosure}>
        <View style={s.disclosureHeader}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#776D49"
          />
          <Text style={s.disclosureTitle}>About this demo</Text>
        </View>

        <Text style={s.disclosureText}>
          Results use storage-context heuristics. Images are validated
          but not analyzed by a trained AI model. Packaging is recorded
          but does not affect demo scoring.
        </Text>

        <View style={s.disclosureDivider} />

        <Text style={s.disclosureFootnote}>
          Images are not permanently stored. Results do not certify food
          safety.
        </Text>
      </View>

      <View style={s.footer}>
        <Ionicons name="leaf-outline" size={14} color="#929C91" />
        <Text style={s.footerText}>PRESERVE QUALITY · REDUCE LOSS</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 36,
    gap: 17,
  },
  contentTablet: {
    paddingHorizontal: 30,
    paddingTop: 24,
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
    backgroundColor: C.green,
  },
  brandName: {
    color: C.ink,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  brandCaption: {
    color: C.muted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.9,
    marginTop: 3,
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#EAF1E7',
  },
  demoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#63814E',
  },
  demoText: {
    color: '#647950',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  intro: {
    paddingTop: 5,
  },
  eyebrow: {
    color: '#73836E',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  heading: {
    color: C.ink,
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.9,
    marginTop: 9,
  },
  headingNarrow: {
    fontSize: 27,
    lineHeight: 34,
  },
  headingAccent: {
    color: C.green,
  },
  introText: {
    maxWidth: 520,
    color: C.text,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 9,
  },
  hero: {
    minHeight: 210,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 23,
    backgroundColor: C.greenDark,
  },
  heroOrb: {
    position: 'absolute',
    width: 180,
    height: 180,
    top: -95,
    right: -55,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.045)',
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  heroLabelText: {
    color: '#E0EBDD',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  heroContent: {
    minHeight: 120,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroCopy: {
    flex: 1,
    zIndex: 1,
    maxWidth: '72%',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  heroDescription: {
    color: '#C8D9CA',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 7,
  },
  tomatoMark: {
    position: 'absolute',
    width: 132,
    height: 132,
    right: -6,
    top: -5,
  },
  tomatoHalo: {
    position: 'absolute',
    width: 122,
    height: 122,
    left: 5,
    top: 4,
    borderRadius: 61,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  tomatoBody: {
    position: 'absolute',
    width: 76,
    height: 73,
    left: 29,
    top: 39,
    borderRadius: 40,
    backgroundColor: C.tomato,
    borderBottomWidth: 6,
    borderBottomColor: '#CF684B',
    transform: [{rotate: '-8deg'}],
  },
  tomatoHighlight: {
    position: 'absolute',
    width: 13,
    height: 24,
    left: 44,
    top: 52,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.22)',
    transform: [{rotate: '24deg'}],
  },
  tomatoStem: {
    position: 'absolute',
    width: 6,
    height: 18,
    left: 64,
    top: 26,
    borderRadius: 4,
    backgroundColor: '#8CA66A',
    transform: [{rotate: '10deg'}],
  },
  tomatoLeafLeft: {
    position: 'absolute',
    width: 26,
    height: 10,
    left: 43,
    top: 38,
    borderRadius: 8,
    backgroundColor: '#9BB273',
    transform: [{rotate: '24deg'}],
  },
  tomatoLeafRight: {
    position: 'absolute',
    width: 26,
    height: 10,
    left: 61,
    top: 38,
    borderRadius: 8,
    backgroundColor: '#77945D',
    transform: [{rotate: '-24deg'}],
  },
  heroFooter: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
    paddingTop: 9,
  },
  heroMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  heroMetadataText: {
    color: '#D5E1D5',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  heroMetadataDivider: {
    width: 1,
    height: 13,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  heroFooterSpace: {
    flex: 1,
  },
  heroDemo: {
    color: '#C6D8C8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  primaryAction: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: C.green,
  },
  primaryIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: C.lime,
  },
  primaryCopy: {
    flex: 1,
    minWidth: 0,
  },
  primaryOverline: {
    color: '#C9DCCB',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  primaryTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },
  primaryDescription: {
    color: '#D1E1D4',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
  },
  primaryArrow: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  historyAction: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
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
    minWidth: 0,
  },
  historyTitle: {
    color: '#354A3B',
    fontSize: 12,
    fontWeight: '800',
  },
  historyDescription: {
    color: C.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 3,
    marginBottom: -5,
  },
  sectionHeadingCopy: {
    flex: 1,
  },
  sectionTitle: {
    color: C.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: C.muted,
    fontSize: 10,
    marginTop: 4,
  },
  stepCount: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EAF1E7',
  },
  stepCountText: {
    color: '#647A59',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  stepsCard: {
    paddingHorizontal: 13,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  stepRow: {
    minHeight: 77,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  stepRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1EB',
  },
  stepCopy: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 11,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  stepNumber: {
    color: '#83917C',
    fontSize: 8,
    fontWeight: '800',
  },
  stepTitle: {
    flex: 1,
    color: '#3C5140',
    fontSize: 11,
    fontWeight: '800',
  },
  stepDescription: {
    color: C.muted,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  infoCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 132,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4EAE0',
    backgroundColor: '#EFF3EA',
  },
  infoTitle: {
    color: '#4B6148',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 9,
  },
  infoDescription: {
    color: '#7C8979',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 5,
  },
  disclosure: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9E4D4',
    backgroundColor: '#F4F1E7',
  },
  disclosureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 7,
  },
  disclosureTitle: {
    color: '#696147',
    fontSize: 10,
    fontWeight: '800',
  },
  disclosureText: {
    color: '#79745F',
    fontSize: 9,
    lineHeight: 15,
  },
  disclosureDivider: {
    height: 1,
    backgroundColor: '#E4DFD0',
    marginVertical: 9,
  },
  disclosureFootnote: {
    color: '#88836E',
    fontSize: 9,
    lineHeight: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 1,
  },
  footerText: {
    color: '#929C91',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  primaryPressed: {
    opacity: 0.86,
    transform: [{scale: 0.99}],
  },
  historyPressed: {
    backgroundColor: '#F1F5F0',
    borderColor: '#C8D8C8',
  },
});