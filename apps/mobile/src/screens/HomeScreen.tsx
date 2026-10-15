import React, {useState} from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import {
  colors,
  layout,
  radius,
  shadow,
  typography,
} from '../theme/tokens';

type Props = {
  onCapture: () => void;
  onHistory: () => void;
};

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type StoragePreset = {
  id: string;
  title: string;
  temperature: string;
  humidity: string;
  days: string;
  icon: IconName;
};

type StorageTip = {
  title: string;
  description: string;
  icon: IconName;
};

const SUPPORT_EMAIL = 'support@afterharvest.app';

const STORAGE_PRESETS: StoragePreset[] = [
  {
    id: 'room',
    title: 'Room storage',
    temperature: '22',
    humidity: '65',
    days: '2',
    icon: 'home-outline',
  },
  {
    id: 'cooler',
    title: 'Cooler',
    temperature: '8',
    humidity: '80',
    days: '4',
    icon: 'snow-outline',
  },
  {
    id: 'transport',
    title: 'Transport',
    temperature: '12',
    humidity: '75',
    days: '1',
    icon: 'car-outline',
  },
];

const STORAGE_TIPS: StorageTip[] = [
  {
    title: 'Keep tomatoes dry',
    description:
      'Avoid washing before storage. Moisture can accelerate spoilage.',
    icon: 'water-outline',
  },
  {
    title: 'Maintain airflow',
    description:
      'Ventilated packaging reduces trapped humidity around produce.',
    icon: 'leaf-outline',
  },
  {
    title: 'Check daily',
    description:
      'Separate soft or damaged tomatoes to slow spread within a batch.',
    icon: 'eye-outline',
  },
];

const READINESS_ITEMS = [
  {
    title: 'Clear tomato photo',
    description: 'JPEG, PNG or WebP up to 5 MB',
    icon: 'image-outline' as IconName,
  },
  {
    title: 'Storage conditions',
    description: 'Temperature, humidity and duration',
    icon: 'options-outline' as IconName,
  },
  {
    title: 'Packaging type',
    description: 'Open crate, sealed bag or ventilated box',
    icon: 'cube-outline' as IconName,
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Photograph',
    description: 'Capture a tomato or select an existing photo.',
    icon: 'camera-outline' as IconName,
  },
  {
    number: '02',
    title: 'Add conditions',
    description: 'Enter temperature, humidity and storage days.',
    icon: 'options-outline' as IconName,
  },
  {
    number: '03',
    title: 'Explore results',
    description: 'Review the demo assessment and its context.',
    icon: 'analytics-outline' as IconName,
  },
];

function IconTile({
  name,
  color = colors.primary,
  background = colors.primarySoft,
  size = 19,
}: {
  name: IconName;
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

  const [copiedEmail, setCopiedEmail] = useState(false);

  async function copySupportEmail() {
    try {
      await Clipboard.setStringAsync(SUPPORT_EMAIL);

      setCopiedEmail(true);
      Alert.alert(
        'Email copied',
        `${SUPPORT_EMAIL} has been copied to your clipboard.`,
      );

      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      Alert.alert(
        'Unable to copy',
        'Please copy the support email manually.',
      );
    }
  }

  async function openFeedbackEmail() {
    const subject = encodeURIComponent(
      'AfterHarvest prototype feedback',
    );
    const body = encodeURIComponent(
      'Hi AfterHarvest team,\n\nI would like to share feedback about the mobile prototype:\n\n',
    );
    const url = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        'Email unavailable',
        'No email app is available. The support email has been copied instead.',
      );

      try {
        await Clipboard.setStringAsync(SUPPORT_EMAIL);
      } catch {
        // Keep the user experience simple; no extra error prompt.
      }
    }
  }

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
            <Ionicons name="leaf" size={19} color={colors.white} />
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
          <Ionicons name="add" size={25} color={colors.primaryDark} />
        </View>

        <View style={s.primaryCopy}>
          <Text style={s.primaryOverline}>GET STARTED</Text>
          <Text style={s.primaryTitle}>New assessment</Text>
          <Text style={s.primaryDescription}>
            Add a photo and storage conditions
          </Text>
        </View>

        <View style={s.primaryArrow}>
          <Ionicons
            name="arrow-forward"
            size={18}
            color={colors.white}
          />
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
          color={colors.muted}
          accessible={false}
        />
      </Pressable>

      <View style={s.sectionHeader}>
        <View style={s.sectionHeadingCopy}>
          <Text accessibilityRole="header" style={s.sectionTitle}>
            Quick-start presets
          </Text>
          <Text style={s.sectionSubtitle}>
            Start with common storage conditions
          </Text>
        </View>

        <View style={s.stepCount}>
          <Text style={s.stepCountText}>3 OPTIONS</Text>
        </View>
      </View>

      <View style={s.presetRow}>
        {STORAGE_PRESETS.map(preset => (
          <Pressable
            key={preset.id}
            accessibilityRole="button"
            accessibilityLabel={`Use ${preset.title} preset`}
            accessibilityHint="Opens a new assessment with these storage conditions"
            onPress={onCapture}
            style={({pressed}) => [
              s.presetCard,
              pressed ? s.pressed : null,
            ]}>
            <IconTile
              name={preset.icon}
              size={17}
              color={colors.primary}
              background={colors.primarySoft}
            />

            <Text style={s.presetTitle}>{preset.title}</Text>
            <Text style={s.presetValue}>
              {preset.temperature}°C · {preset.humidity}% ·{' '}
              {preset.days}d
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={s.sectionHeader}>
        <View style={s.sectionHeadingCopy}>
          <Text accessibilityRole="header" style={s.sectionTitle}>
            Before you start
          </Text>
          <Text style={s.sectionSubtitle}>
            Have these details ready
          </Text>
        </View>
      </View>

      <View style={s.readinessCard}>
        {READINESS_ITEMS.map((item, index) => (
          <View
            key={item.title}
            style={[
              s.readinessRow,
              index < READINESS_ITEMS.length - 1
                ? s.readinessRowBorder
                : null,
            ]}>
            <IconTile
              name={item.icon}
              size={16}
              color={colors.primary}
              background={colors.primarySoft}
            />

            <View style={s.readinessCopy}>
              <Text style={s.readinessTitle}>{item.title}</Text>
              <Text style={s.readinessDescription}>
                {item.description}
              </Text>
            </View>

            <Ionicons
              name="checkmark-circle"
              size={19}
              color={colors.success}
              accessible={false}
            />
          </View>
        ))}
      </View>

      <View style={s.sectionHeader}>
        <View style={s.sectionHeadingCopy}>
          <Text accessibilityRole="header" style={s.sectionTitle}>
            Storage tips
          </Text>
          <Text style={s.sectionSubtitle}>
            Practical guidance for tomato batches
          </Text>
        </View>
      </View>

      <View style={s.tipsCard}>
        {STORAGE_TIPS.map((tip, index) => (
          <View
            key={tip.title}
            style={[
              s.tipRow,
              index < STORAGE_TIPS.length - 1
                ? s.tipRowBorder
                : null,
            ]}>
            <IconTile
              name={tip.icon}
              size={17}
              color={colors.primary}
              background={colors.primarySoft}
            />

            <View style={s.tipCopy}>
              <Text style={s.tipTitle}>{tip.title}</Text>
              <Text style={s.tipDescription}>
                {tip.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

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
              background={colors.primarySoft}
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

      <View style={s.supportCard}>
        <View style={s.supportHeader}>
          <View style={s.supportIcon}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={18}
              color={colors.primary}
            />
          </View>

          <View style={s.supportCopy}>
            <Text style={s.supportTitle}>Need help?</Text>
            <Text style={s.supportDescription}>
              Share feedback or report an issue with the prototype.
            </Text>
          </View>
        </View>

        <View style={s.supportActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send feedback by email"
            onPress={openFeedbackEmail}
            style={({pressed}) => [
              s.supportPrimary,
              pressed ? s.pressed : null,
            ]}>
            <Ionicons
              name="mail-outline"
              size={16}
              color={colors.primary}
            />
            <Text style={s.supportPrimaryText}>Send feedback</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Copy support email address"
            onPress={copySupportEmail}
            style={({pressed}) => [
              s.supportSecondary,
              pressed ? s.pressed : null,
            ]}>
            <Ionicons
              name={copiedEmail ? 'checkmark' : 'copy-outline'}
              size={16}
              color={colors.text}
            />
            <Text style={s.supportSecondaryText}>
              {copiedEmail ? 'Copied' : 'Copy email'}
            </Text>
          </Pressable>
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
        <Ionicons
          name="leaf-outline"
          size={14}
          color={colors.faint}
        />
        <Text style={s.footerText}>
          PRESERVE QUALITY · REDUCE LOSS
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: layout.screenMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
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
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  brandName: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  brandCaption: {
    color: colors.muted,
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
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  demoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  demoText: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  intro: {
    paddingTop: 5,
  },
  eyebrow: {
    ...typography.overline,
    color: colors.muted,
  },
  heading: {
    ...typography.display,
    color: colors.ink,
    marginTop: 9,
  },
  headingNarrow: {
    fontSize: 27,
    lineHeight: 34,
  },
  headingAccent: {
    color: colors.primary,
  },
  introText: {
    maxWidth: 520,
    ...typography.body,
    color: colors.text,
    marginTop: 9,
  },
  hero: {
    minHeight: 210,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryDark,
    ...shadow.card,
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
    borderRadius: radius.pill,
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
    color: colors.white,
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
    backgroundColor: '#E47758',
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
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
  },
  primaryIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.accent,
  },
  primaryCopy: {
    flex: 1,
    minWidth: 0,
  },
  primaryOverline: {
    color: colors.primaryDark,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  primaryTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },
  primaryDescription: {
    color: colors.primaryDark,
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
    backgroundColor: colors.overlay,
  },
  historyAction: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  iconTile: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  historyCopy: {
    flex: 1,
    minWidth: 0,
  },
  historyTitle: {
    ...typography.label,
    color: colors.ink,
  },
  historyDescription: {
    ...typography.caption,
    color: colors.muted,
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
    ...typography.heading,
    color: colors.ink,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.muted,
    marginTop: 4,
  },
  stepCount: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  stepCountText: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 10,
  },
  presetCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 112,
    padding: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  presetTitle: {
    ...typography.label,
    color: colors.ink,
    marginTop: 10,
  },
  presetValue: {
    ...typography.caption,
    color: colors.muted,
    marginTop: 4,
  },
  readinessCard: {
    paddingHorizontal: 13,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  readinessRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  readinessRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  readinessCopy: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 11,
  },
  readinessTitle: {
    ...typography.label,
    color: colors.ink,
  },
  readinessDescription: {
    ...typography.caption,
    color: colors.muted,
    marginTop: 3,
  },
  tipsCard: {
    paddingHorizontal: 13,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  tipRow: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  tipRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  tipCopy: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 11,
  },
  tipTitle: {
    ...typography.label,
    color: colors.ink,
  },
  tipDescription: {
    ...typography.caption,
    color: colors.muted,
    marginTop: 4,
  },
  stepsCard: {
    paddingHorizontal: 13,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  stepRow: {
    minHeight: 77,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  stepRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
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
    color: colors.faint,
    fontSize: 8,
    fontWeight: '800',
  },
  stepTitle: {
    flex: 1,
    ...typography.label,
    color: colors.ink,
  },
  stepDescription: {
    ...typography.caption,
    color: colors.muted,
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
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  infoTitle: {
    ...typography.label,
    color: colors.ink,
    marginTop: 9,
  },
  infoDescription: {