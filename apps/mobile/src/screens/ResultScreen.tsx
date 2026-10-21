import React, {useMemo, useState} from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {
  colors,
  layout,
  radius,
  shadow,
  typography,
} from '../theme/tokens';
import type {Assessment} from '../types/assessment';

type Props = {
  result: Assessment;
  onNew: () => void;
};

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type StatusStyle = {
  label: string;
  color: string;
  background: string;
  description: string;
  action: string;
};

const STATUS_STYLES: Record<string, StatusStyle> = {
  fresh: {
    label: 'Fresh',
    color: colors.success,
    background: colors.successSoft,
    description: 'Fresh is the assigned quality-state label.',
    action: 'Continue normal storage and inspect the batch again before distribution.',
  },
  aging: {
    label: 'Aging',
    color: colors.warning,
    background: colors.warningSoft,
    description: 'Aging is the assigned quality-state label.',
    action: 'Prioritize this batch for earlier use and review storage conditions.',
  },
  spoiled: {
    label: 'Spoiled',
    color: colors.danger,
    background: colors.dangerSoft,
    description: 'Spoiled is the assigned quality-state label.',
    action: 'Isolate affected produce and inspect it manually before making any handling decision.',
  },
};

const UNKNOWN_STATUS: StatusStyle = {
  label: 'Uncertain',
  color: colors.neutral,
  background: colors.neutralSoft,
  description: 'Review this result with caution.',
  action: 'Review the available context and inspect the produce manually.',
};

const FACTOR_LABELS: Record<string, string> = {
  temperature: 'Temperature',
  storage_duration: 'Storage duration',
  humidity: 'Humidity',
  packaging: 'Packaging',
  visual_color_change: 'Visual color change',
};

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeState(value: unknown): string {
  return normalizeString(value).toLowerCase();
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function displayScore(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  return Math.round(clamp(value) * 100);
}

function getStatus(value: unknown): StatusStyle {
  return STATUS_STYLES[normalizeState(value)] ?? UNKNOWN_STATUS;
}

function getInterpretation(score: number | null) {
  if (score === null) {
    return {
      title: 'Score unavailable',
      description:
        'The service did not return a usable quality score for this assessment.',
    };
  }

  if (score >= 75) {
    return {
      title: 'Strong result',
      description:
        'The reported context suggests relatively favorable quality indicators.',
    };
  }

  if (score >= 50) {
    return {
      title: 'Moderate result',
      description:
        'Some indicators may need attention. Review storage and handling conditions.',
    };
  }

  return {
    title: 'Needs attention',
    description:
      'The reported context suggests a higher-priority review of this batch.',
  };
}

function formatDate(value: unknown): string {
  const rawDate = normalizeString(value);

  if (!rawDate) {
    return 'Date unavailable';
  }

  const date = new Date(rawDate);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getFactorLabel(value: unknown): string {
  const normalized = normalizeString(value);

  if (!normalized) {
    return 'Unknown factor';
  }

  if (FACTOR_LABELS[normalized]) {
    return FACTOR_LABELS[normalized];
  }

  return normalized
    .replace(/_/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase());
}

function getRecommendation(value: unknown): string {
  return (
    normalizeString(value) ||
    'No recommendation was returned for this assessment.'
  );
}

function getProduceName(value: unknown): string {
  const produce = normalizeString(value);

  if (!produce) {
    return 'Tomato';
  }

  return (
    produce.charAt(0).toUpperCase() +
    produce.slice(1).toLowerCase()
  );
}

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

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: IconName;
}) {
  return (
    <View style={s.detailRow}>
      <View style={s.detailLabelGroup}>
        <Ionicons name={icon} size={15} color={colors.muted} accessible={false} />
        <Text style={s.detailLabel}>{label}</Text>
      </View>

      <Text style={s.detailValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

export default function ResultScreen({result, onNew}: Props) {
  const {width} = useWindowDimensions();
  const narrow = width < layout.narrowBreakpoint;
  const tablet = width >= layout.tabletBreakpoint;

  const [sharing, setSharing] = useState(false);

  const isDemo = result.inference_mode === 'demo';
  const score = displayScore(result.quality_score);
  const confidence = displayScore(result.confidence);
  const status = getStatus(result.quality_state);
  const interpretation = getInterpretation(score);

  const factors = useMemo(() => {
    if (!Array.isArray(result.contributing_factors)) {
      return [];
    }

    return [...result.contributing_factors]
      .filter(
        factor =>
          factor &&
          typeof factor.weight === 'number' &&
          Number.isFinite(factor.weight),
      )
      .sort(
        (first, second) =>
          clamp(Number(second.weight)) - clamp(Number(first.weight)),
      );
  }, [result.contributing_factors]);

  const topFactors = factors.slice(0, 3);
  const recommendation = getRecommendation(result.recommendation);
  const produceName = getProduceName(result.produce_type);
  const modelVersion = normalizeString(result.model_version) || 'Unavailable';

  const resultSummary = [
    `AfterHarvest ${produceName.toLowerCase()} assessment`,
    `Quality state: ${status.label}`,
    `Quality score: ${score === null ? 'Unavailable' : `${score}/100`}`,
    `Mode: ${isDemo ? 'Demo inference' : 'Model inference'}`,
    `Assessed: ${formatDate(result.created_at)}`,
    '',
    `Recommendation: ${recommendation}`,
    '',
    'This is educational decision support, not food-safety certification.',
  ].join('\n');

  async function shareResult() {
    if (sharing) return;

    setSharing(true);

    try {
      await Share.share({
        message: resultSummary,
        title: 'AfterHarvest assessment result',
      });
    } catch {
      Alert.alert('Unable to share', 'Please try sharing this result again.');
    } finally {
      setSharing(false);
    }
  }

  return (
    <View style={s.screen}>
      <View style={s.topBar}>
        <View style={s.brand}>
          <View style={s.brandIcon}>
            <Ionicons name="analytics" size={17} color={colors.white} />
          </View>

          <View>
            <Text style={s.brandName}>Assessment result</Text>
            <Text style={s.brandCaption}>TOMATO QUALITY</Text>
          </View>
        </View>

        <View style={s.modePill}>
          <View style={s.modeDot} />
          <Text style={s.modePillText}>
            {isDemo ? 'DEMO MODE' : 'MODEL MODE'}
          </Text>
        </View>
      </View>

      <View style={s.progressRail}>
        <View
          style={[
            s.progressRailFill,
            {width: `${score ?? 0}%`, backgroundColor: status.color},
          ]}
        />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.content, tablet ? s.contentTablet : null]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={s.intro}>
          <Text
            accessibilityRole="header"
            style={[s.heading, narrow ? s.headingNarrow : null]}>
            Your assessment,{'\n'}
            <Text style={s.headingAccent}>explained.</Text>
          </Text>

          <Text style={s.subtitle}>
            Review the score, context indicators and recommendation together.
          </Text>
        </View>

        <View style={s.hero}>
          <View style={s.heroOrb} />

          <View style={s.heroHeader}>
            <View
              style={[
                s.heroStatus,
                {backgroundColor: 'rgba(255,255,255,0.12)'},
              ]}>
              <View
                style={[s.heroStatusDot, {backgroundColor: status.color}]}
              />

              <Text style={s.heroStatusText}>
                {status.label.toUpperCase()}
              </Text>
            </View>

            <Text style={s.heroMode}>
              {isDemo ? 'DEMO RESULT' : 'MODEL RESULT'}
            </Text>
          </View>

          <View style={s.heroBody}>
            <View style={s.heroScoreGroup}>
              <Text style={s.heroScore}>{score === null ? '—' : score}</Text>
              <Text style={s.heroScoreMax}>/100</Text>
            </View>

            <View style={s.heroCopy}>
              <Text style={s.heroTitle}>{interpretation.title}</Text>
              <Text style={s.heroDescription}>
                {produceName} · {formatDate(result.created_at)}
              </Text>
            </View>
          </View>

          <View style={s.heroProgress}>
            <View
              style={[
                s.heroProgressFill,
                {width: `${score ?? 0}%`, backgroundColor: status.color},
              ]}
            />
          </View>

          <View style={s.heroFooter}>
            <Text style={s.heroFooterText}>QUALITY SCORE</Text>
            <View style={s.heroFooterSpace} />
            <Text style={s.heroFooterText}>
              {isDemo ? 'ILLUSTRATIVE' : 'DECISION SUPPORT'}
            </Text>
          </View>
        </View>

        <View style={s.scoreCard}>
          <View style={s.scoreHeader}>
            <View
              style={[s.statusPill, {backgroundColor: status.background}]}>
              <View
                style={[s.statusDot, {backgroundColor: status.color}]}
              />

              <Text style={[s.statusLabel, {color: status.color}]}>
                {status.label}
              </Text>
            </View>

            <Text style={s.scoreCaption}>
              {isDemo ? 'Illustrative quality score' : 'Quality score'}
            </Text>
          </View>

          <View style={s.scoreValueRow}>
            <Text style={[s.scoreValue, {color: status.color}]}>
              {score === null ? '—' : score}
            </Text>
            <Text style={s.scoreMaximum}>/100</Text>
          </View>

          <View style={s.scoreTrack}>
            <View
              style={[
                s.scoreFill,
                {
                  width: `${score ?? 0}%`,
                  backgroundColor: status.color,
                },
              ]}
            />
          </View>

          <View style={s.scoreScale}>
            <Text style={s.scoreScaleText}>LOWER</Text>
            <Text style={s.scoreScaleText}>HIGHER</Text>
          </View>

          <View style={s.interpretation}>
            <Ionicons
              name="sparkles-outline"
              size={15}
              color={colors.primary}
            />

            <View style={s.interpretationCopy}>
              <Text style={s.interpretationTitle}>
                {interpretation.title}
              </Text>
              <Text style={s.interpretationText}>
                {interpretation.description}
              </Text>
            </View>
          </View>
        </View>

        <View style={s.actionCard}>
          <View style={s.sectionHeader}>
            <IconTile name="arrow-forward" />

            <View style={s.sectionCopy}>
              <Text accessibilityRole="header" style={s.sectionTitle}>
                Recommended next step
              </Text>
              <Text style={s.sectionSubtitle}>
                Practical guidance based on the assigned state.
              </Text>
            </View>
          </View>

          <Text style={s.actionText}>{status.action}</Text>

          <View style={s.recommendationBox}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={15}
              color={colors.primary}
            />

            <Text style={s.recommendationText}>{recommendation}</Text>
          </View>
        </View>

        <View style={s.card}>
          <View style={s.sectionHeader}>
            <IconTile name="options-outline" />

            <View style={s.sectionCopy}>
              <Text accessibilityRole="header" style={s.sectionTitle}>
                Context indicators
              </Text>
              <Text style={s.sectionSubtitle}>
                {isDemo
                  ? 'Heuristic values reported by the demo.'
                  : 'Factor values reported by the service.'}
              </Text>
            </View>
          </View>

          {factors.length === 0 ? (
            <Text style={s.emptyText}>
              No context indicators were returned.
            </Text>
          ) : (
            <View style={s.factorList}>
              {factors.map((factor, index) => {
                const rawWeight = factor?.weight;
                const hasValidWeight =
                  typeof rawWeight === 'number' &&
                  Number.isFinite(rawWeight);
                const percentage = hasValidWeight
                  ? clamp(rawWeight) * 100
                  : 0;
                const label = getFactorLabel(factor?.name);

                return (
                  <View key={`${label}-${index}`}>
                    <View style={s.factorHeader}>
                      <Text style={s.factorName}>{label}</Text>
                      <Text style={s.factorValue}>
                        {hasValidWeight ? rawWeight.toFixed(2) : '—'}
                      </Text>
                    </View>

                    <View style={s.factorTrack}>
                      <View
                        style={[
                          s.factorFill,
                          {width: `${percentage}%`},
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <View style={s.factorNotice}>
            <Text style={s.factorNoticeText}>
              {isDemo
                ? 'Bars show individual heuristic indicators on a 0–1 scale. They are not contribution percentages and do not need to sum to 1.'
                : 'Bars show factor values returned by the service. Their interpretation depends on the model implementation.'}
            </Text>
          </View>
        </View>

        {topFactors.length > 0 ? (
          <View style={s.card}>
            <View style={s.sectionHeader}>
              <IconTile name="star-outline" />

              <View style={s.sectionCopy}>
                <Text accessibilityRole="header" style={s.sectionTitle}>
                  Top indicators
                </Text>
                <Text style={s.sectionSubtitle}>
                  Highest reported values in this assessment.
                </Text>
              </View>
            </View>

            <View style={s.topFactorList}>
              {topFactors.map((factor, index) => (
                <View
                  key={`${getFactorLabel(factor?.name)}-${index}`}
                  style={s.topFactor}>
                  <View style={s.topFactorRank}>
                    <Text style={s.topFactorRankText}>{index + 1}</Text>
                  </View>

                  <Text style={s.topFactorName}>
                    {getFactorLabel(factor?.name)}
                  </Text>

                  <Text style={s.topFactorValue}>
                    {Number(factor.weight).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={s.card}>
          <Text accessibilityRole="header" style={s.cardTitle}>
            Inference details
          </Text>

          <View style={s.detailList}>
            <DetailRow
              label="Mode"
              value={isDemo ? 'Demo inference' : 'Model inference'}
              icon="sparkles-outline"
            />

            <View style={s.detailDivider} />

            <DetailRow
              label="Confidence"
              value={
                isDemo
                  ? 'Not estimated'
                  : confidence === null
                    ? 'Unavailable'
                    : `${confidence}% reported`
              }
              icon="pulse-outline"
            />

            <View style={s.detailDivider} />

            <DetailRow
              label="Score meaning"
              value={isDemo ? 'Illustrative only' : 'Not a safety rating'}
              icon="information-circle-outline"
            />

            <View style={s.detailDivider} />

            <DetailRow
              label="Model version"
              value={modelVersion}
              icon="cube-outline"
            />
          </View>
        </View>

        <View style={s.notice}>
          <View style={s.noticeHeader}>
            <IconTile
              name="shield-checkmark-outline"
              color="#776D49"
              background="#EAE3D1"
              size={17}
            />

            <Text style={s.noticeTitle}>
              Know what this result means
            </Text>
          </View>

          <Text style={s.noticeText}>
            {isDemo
              ? 'This demo validates the uploaded image but does not analyze it with a trained AI model. It does not predict remaining shelf life or provide a measured probability of freshness.'
              : 'This prototype result is decision support, not food-safety certification. A quality score must not be interpreted as proof that food is safe.'}
          </Text>

          <View style={s.noticeDivider} />

          <Text style={s.noticeFootnote}>
            Inspect the produce manually. Do not use this result alone to decide
            whether food is safe to eat.
          </Text>
        </View>

        <View style={s.exportRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Share assessment result summary"
            accessibilityState={{disabled: sharing}}
            disabled={sharing}
            onPress={shareResult}
            style={({pressed}) => [
              s.exportButton,
              s.shareButton,
              pressed ? s.pressed : null,
              sharing ? s.disabled : null,
            ]}>
            <Ionicons
              name="share-social-outline"
              size={17}
              color={colors.primary}
            />
            <Text style={s.shareButtonText}>
              {sharing ? 'Sharing…' : 'Share'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start a new tomato assessment"
            accessibilityHint="Returns to the photo and storage details form"
            onPress={onNew}
            style={({pressed}) => [
              s.exportButton,
              s.newButton,
              pressed ? s.pressed : null,
            ]}>
            <Ionicons name="add" size={18} color={colors.primaryDark} />
            <Text style={s.newButtonText}>New assessment</Text>
          </Pressable>
        </View>

        <Text style={s.footer}>
          Educational decision support · Not food-safety certification
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIcon: {
    width: 36,
    height: 36,
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
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  modeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  modePillText: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  progressRail: {
    height: 3,
    backgroundColor: colors.surfaceMuted,
  },
  progressRailFill: {
    height: '100%',
  },
  scroll: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: layout.screenMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 18,
    paddingBottom: 36,
    gap: 17,
  },
  contentTablet: {
    paddingHorizontal: layout.screenPaddingWide,
    paddingTop: 24,
    gap: 20,
  },
  intro: {
    paddingTop: 2,
  },
  heading: {
    ...typography.display,
    color: colors.ink,
  },
  headingNarrow: {
    fontSize: 27,
    lineHeight: 34,
  },
  headingAccent: {
    color: colors.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.text,
    marginTop: 9,
    maxWidth: 520,
  },
  hero: {
    overflow: 'hidden',
    padding: 18,
    borderRadius: radius.xxl,
    backgroundColor: colors.primaryDark,
    ...shadow.card,
  },
  heroOrb: {
    position: 'absolute',
    width: 190,
    height: 190,
    top: -105,
    right: -60,
    borderRadius: 95,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  heroStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  heroStatusText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroMode: {
    color: '#C6D8C8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  heroBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 20,
  },
  heroScoreGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  heroScore: {
    color: colors.white,
    fontSize: 52,
    lineHeight: 58,
    fontWeight: '800',
    letterSpacing: -2,
  },
  heroScoreMax: {
    color: '#C6D8C8',
    fontSize: 16,
    fontWeight: '700',
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  heroDescription: {
    color: '#C8D9CA',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 6,
  },
  heroProgress: {
    height: 8,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginTop: 20,
  },
  heroProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
  },
  heroFooterSpace: {
    flex: 1,
  },
  heroFooterText: {
    color: '#D5E1D5',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scoreCard: {
    padding: 20,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  scoreHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  scoreCaption: {
    ...typography.overline,
    color: colors.muted,
  },
  scoreValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
    marginTop: 18,
  },
  scoreValue: {
    fontSize: 54,
    lineHeight: 62,
    fontWeight: '800',
    letterSpacing: -2,
  },
  scoreMaximum: {
    color: colors.faint,
    fontSize: 18,
    fontWeight: '700',
  },
  scoreTrack: {
    height: 9,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: colors.surfaceMuted,
    marginTop: 12,
  },
  scoreFill: {
    height: '100%',
    borderRadius: 5,
  },
  scoreScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
  },
  scoreScaleText: {
    ...typography.overline,
    color: colors.faint,
  },
  interpretation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginTop: 17,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  interpretationCopy: {
    flex: 1,
    minWidth: 0,
  },
  interpretationTitle: {
    ...typography.label,
    color: colors.ink,
  },
  interpretationText: {
    ...typography.caption,
    color: colors.muted,
    marginTop: 3,
  },
  actionCard: {
    padding: 17,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    backgroundColor: colors.primarySoft,
    ...shadow.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 16,
  },
  iconTile: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  sectionCopy: {
    flex: 1,
    minWidth: 0,
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
  actionText: {
    ...typography.body,
    color: colors.ink,
  },
  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recommendationText: {
    flex: 1,
    ...typography.caption,
    color: colors.text,
  },
  card: {
    padding: 17,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  cardTitle: {
    ...typography.heading,
    color: colors.ink,
    marginBottom: 12,
  },
  factorList: {
    gap: 18,
  },
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  factorName: {
    flex: 1,
    minWidth: 0,
    ...typography.label,
    color: colors.text,
  },
  factorValue: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  factorTrack: {
    height: 7,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: colors.surfaceMuted,
  },
  factorFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  factorNotice: {
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    marginTop: 18,
  },
  factorNoticeText: {
    ...typography.caption,
    color: colors.muted,
  },
  emptyText: {
    ...typography.body,
    color: colors.muted,
  },
  topFactorList: {
    gap: 10,
  },
  topFactor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 11,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  topFactorRank: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  topFactorRankText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  topFactorName: {
    flex: 1,
    minWidth: 0,
    ...typography.label,
    color: colors.ink,
  },
  topFactorValue: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  detailList: {
    gap: 0,
  },
  detailRow: {
    minHeight: 48,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 13,
  },
  detailLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  detailLabel: {
    ...typography.label,
    color: colors.muted,
  },
  detailValue: {
    flexShrink: 1,
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
  detailDivider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  notice: {
    padding: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#EAE4D5',
    backgroundColor: '#F5F2E9',
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  noticeTitle: {
    flex: 1,
    ...typography.label,
    color: '#82754F',
  },
  noticeText: {
    ...typography.caption,
    lineHeight: 18,
    color: '#9A8E6D',
  },
  noticeDivider: {
    height: 1,
    backgroundColor: '#E7E0CF',
    marginVertical: 11,
  },
  noticeFootnote: {
    ...typography.caption,
    lineHeight: 17,
    color: '#958765',
  },
  exportRow: {
    flexDirection: 'row',
    gap: 10,
  },
  exportButton: {
    flex: 1,
    minHeight: layout.touchTarget + 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radius.md,
  },
  shareButton: {
    backgroundColor: colors.primarySoft,
  },
  newButton: {
    backgroundColor: colors.accent,
  },
  shareButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  newButtonText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.84,
  },
  disabled: {
    opacity: 0.52,
  },
  footer: {
    ...typography.overline,
    color: colors.faint,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
