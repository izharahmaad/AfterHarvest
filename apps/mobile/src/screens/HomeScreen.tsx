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
  page: '#F7F8F4',
  surface: '#FFFFFF',
  ink: '#1E3327',
  body: '#627267',
  muted: '#89958B',
  border: '#E5EBE5',
  green: '#216744',
  deepGreen: '#174D34',
  paleGreen: '#EAF3EC',
  lime: '#D9E8B8',
  coral: '#E77C5B',
};

const FLOW = [
  {
    number: '01',
    title: 'Add a produce photo',
    description: 'Take a picture or select one from your gallery.',
    icon: 'camera-outline' as const,
  },
  {
    number: '02',
    title: 'Enter storage conditions',
    description: 'Add temperature, humidity and storage duration.',
    icon: 'options-outline' as const,
  },
  {
    number: '03',
    title: 'Review the result',
    description: 'See the demo assessment and its context.',
    icon: 'analytics-outline' as const,
  },
];

function IconBox({
  name,
  color = C.green,
  background = C.paleGreen,
  size = 19,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color?: string;
  background?: string;
  size?: number;
}) {
  return (
    <View style={[s.iconBox, {backgroundColor: background}]}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

function TomatoArtwork() {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={s.artwork}>
      <View style={s.artworkHalo} />
      <View style={s.tomatoShadow} />
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

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={[
        s.content,
        width >= 720 ? s.contentTablet : null,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <View style={s.topBar}>
        <View style={s.brand}>
          <View style={s.brandMark}>
            <Ionicons name="leaf" size={19} color="#FFFFFF" />
          </View>

          <View>
            <Text style={s.brandName}>AfterHarvest</Text>
            <Text style={s.brandCaption}>PRODUCE QUALITY</Text>
          </View>
        </View>

        <View style={s.demoBadge}>
          <View style={s.demoDot} />
          <Text style={s.demoBadgeText}>DEMO</Text>
        </View>
      </View>

      <View style={s.intro}>
        <Text style={s.eyebrow}>YOUR QUALITY WORKSPACE</Text>

        <Text
          accessibilityRole="header"
          style={[s.headline, narrow ? s.headlineNarrow : null]}>
          Better context,{'\n'}
          <Text style={s.headlineAccent}>clearer decisions.</Text>
        </Text>

        <Text style={s.introBody}>
          Start with a tomato photo. Add its storage conditions.
          Review a transparent demo assessment.
        </Text>
      </View>

      <View style={s.feature}>
        <View style={s.featureTop}>
          <View style={s.featureTag}>
            <View style={s.featureTagDot} />
            <Text style={s.featureTagText}>CURRENT PILOT</Text>
          </View>

          <Text style={s.featureIndex}>01 / TOMATO</Text>
        </View>

        <View style={s.featureMain}>
          <View style={s.featureCopy}>
            <Text style={s.featureTitle}>Tomato quality</Text>
            <Text style={s.featureDescription}>
              Photo-led assessment with storage context.
            </Text>
          </View>

          <TomatoArtwork />
        </View>

        <View style={s.featureFooter}>
          <View style={s.featureMeta}>
            <Ionicons
              name="image-outline"
              size={14}
              color="#D7E6D9"
            />
            <Text style={s.featureMetaText}>PHOTO</Text>
          </View>

          <View style={s.metaDivider} />

          <View style={s.featureMeta}>
            <Ionicons
              name="thermometer-outline"
              size={14}
              color="#D7E6D9"
            />
            <Text style={s.featureMetaText}>STORAGE</Text>
          </View>

          <View style={s.metaSpacer} />
          <Text style={s.featureMode}>HEURISTIC DEMO</Text>
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
          <Ionicons name="add" size={25} color={C.deepGreen} />
        </View>

        <View style={s.primaryCopy}>
          <Text style={s.primaryOverline}>START HERE</Text>
          <Text style={s.primaryTitle}>New assessment</Text>
          <Text style={s.primarySubtitle}>
            Photo and storage details
          </Text>
        </View>

        <View style={s.arrowButton}>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open assessment history"
        accessibilityHint="View results saved during this session"
        onPress={onHistory}
        style={({pressed}) => [
          s.historyAction,
          pressed ? s.historyPressed : null,
        ]}>
        <IconBox name="time-outline" />

        <View style={s.historyCopy}>
          <Text style={s.historyTitle}>Assessment history</Text>
          <Text style={s.historySubtitle}>
            Revisit results from this session
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={17}
          color={C.muted}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      </Pressable>

      <View style={s.sectionHeader}>
        <View>
          <Text accessibilityRole="header" style={s.sectionTitle}>
            How it works
          </Text>
          <Text style={s.sectionSubtitle}>
            A guided process from photo to result
          </Text>
        </View>

        <View style={s.stepPill}>
          <Text style={s.stepPillText}>3 STEPS</Text>
        </View>
      </View>

      <View style={s.flowCard}>
        {FLOW.map((item, index) => (
          <View
            key={item.number}
            style={[
              s.flowItem,
              index < FLOW.length - 1 ? s.flowItemBorder : null,
            ]}>
            <IconBox
              name={item.icon}
              size={18}
              background="#EFF4EC"
            />

            <View style={s.flowCopy}>
              <View style={s.flowTitleRow}>
                <Text style={s.flowNumber}>{item.number}</Text>
                <Text style={s.flowTitle}>{item.title}</Text>
              </View>
              <Text style={s.flowDescription}>
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={s.infoRow}>
        <View style={s.infoCard}>
          <IconBox
            name="nutrition-outline"
            size={18}
            color="#57764F"
            background="#E7EFE2"
          />
          <Text style={s.infoTitle}>Tomato-only pilot</Text>
          <Text style={s.infoBody}>
            This prototype is currently focused on tomatoes.
          </Text>
        </View>

        <View style={s.infoCard}>
          <IconBox
            name="phone-portrait-outline"
            size={18}
            color="#57764F"
            background="#E7EFE2"
          />
          <Text style={s.infoTitle}>Session history</Text>
          <Text style={s.infoBody}>
            History resets when the app restarts.
          </Text>
        </View>
      </View>

      <View style={s.disclosure}>
        <View style={s.disclosureTitleRow}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#796F4C"
          />
          <Text style={s.disclosureTitle}>About this prototype</Text>
        </View>

        <Text style={s.disclosureBody}>
          Results use storage-context heuristics. Images are validated,
          not analyzed by a trained AI model. Packaging is recorded but
          does not affect demo scoring.
        </Text>

        <View style={s.disclosureRule} />

        <Text style={s.disclosureFoot}>
          Images are not permanently stored. Results do not certify
          food safety.
        </Text>
      </View>

      <View style={s.footer}>
        <Ionicons name="leaf-outline" size={14} color="#91A095" />
        <Text style={s.footerText}>PRESERVE QUALITY · REDUCE LOSS</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
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
    gap: 17,
  },
  contentTablet: {
    paddingHorizontal: 30,
    paddingTop: 24,
    gap: 20,
  },
  topBar: {
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
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#EAF1E6',
  },
  demoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#63814E',
  },
  demoBadgeText: {
    color: '#647950',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  intro: {
    paddingTop: 5,
  },
  eyebrow: {
    color: '#708269',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  headline: {
    color: C.ink,
    fontSize: 31,
    lineHeight: 38,
    letterSpacing: -0.9,
    fontWeight: '800',
    marginTop: 9,
  },
  headlineNarrow: {
    fontSize: 27,
    lineHeight: 34,
  },
  headlineAccent: {
    color: C.green,
  },
  introBody: {
    color: C.body,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 9,
    maxWidth: 520,
  },
  feature: {
    minHeight: 210,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 23,
    backgroundColor: C.deepGreen,
  },
  featureTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  featureTagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.lime,
  },
  featureTagText: {
    color: '#E0EBDD',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  featureIndex: {
    color: '#B5CDB7',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  featureMain: {
    minHeight: 120,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureCopy: {
    flex: 1,
    zIndex: 1,
    maxWidth: '72%',
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  featureDescription: {
    color: '#C7DACB',
    fontSize: 10,
    lineHeight: 16,
    marginTop: 7,
  },
  artwork: {
    position: 'absolute',
    width: 132,
    height: 132,
    right: -8,
    top: -5,
  },
  artworkHalo: {
    position: 'absolute',
    width: 122,
    height: 122,
    top: 4,
    left: 5,
    borderRadius: 61,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  tomatoShadow: {
    position: 'absolute',
    width: 70,
    height: 9,
    left: 31,
    bottom: 11,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.14)',
  },
  tomatoBody: {
    position: 'absolute',
    width: 76,
    height: 73,
    left: 29,
    top: 39,
    borderRadius: 40,
    backgroundColor: C.coral,
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
  primarySubtitle: {
    color: '#D1E1D4',
    fontSize: 10,
    marginTop: 3,
  },
  arrowButton: {
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
  iconBox: {
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
  historySubtitle: {
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
  stepPill: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EAF1E7',
  },
  stepPillText: {
    color: '#647A59',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  flowCard: {
    paddingHorizontal: 13,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  flowItem: {
    minHeight: 77,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  flowItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1EB',
  },
  flowCopy: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 11,
  },
  flowTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  flowNumber: {
    color: '#83917C',
    fontSize: 8,
    fontWeight: '800',
  },
  flowTitle: {
    flex: 1,
    color: '#3C5140',
    fontSize: 11,
    fontWeight: '800',
  },
  flowDescription: {
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
    minHeight: 131,
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
  infoBody: {
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
  disclosureTitleRow: {
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
  disclosureBody: {
    color: '#79745F',
    fontSize: 9,
    lineHeight: 15,
  },
  disclosureRule: {
    height: 1,
    backgroundColor: '#E4DFD0',
    marginVertical: 9,
  },
  disclosureFoot: {
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