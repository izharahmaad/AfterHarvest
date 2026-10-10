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
};

const C = {
  page: '#F5F6F2',
  surface: '#FFFFFF',
  ink: '#1F3025',
  body: '#5A6A5E',
  muted: '#7C897D',
  faint: '#9AA397',
  border: '#E5EAE2',
  green: '#216744',
  greenDark: '#193E2B',
  greenPale: '#E8F0E8',
  lime: '#D8E6B9',
};

const STATUS_STYLES: Record<string, StatusStyle> = {
  fresh: {
    label: 'Fresh',
    color: '#2B794D',
    background: '#EAF5ED',
    description: 'Fresh is the assigned quality-state label.',
  },
  aging: {
    label: 'Aging',
    color: '#9B722A',
    background: '#FBF3E3',
    description: 'Aging is the assigned quality-state label.',
  },
  spoiled: {
    label: 'Spoiled',
    color: '#AD5750',
    background: '#FBEDEB',
    description: 'Spoiled is the assigned quality-state label.',
  },
};

const UNKNOWN_STATUS: StatusStyle = {
  label: 'Uncertain',
  color: '#657A87',
  background: '#EDF2F5',
  description: 'Review this result with caution.',
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
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  return Math.round(clamp(value) * 100);
}

function getStatus(value: unknown): StatusStyle {
  return STATUS_STYLES[normalizeState(value)] ?? UNKNOWN_STATUS;
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
  color = C.green,
  background = C.greenPale,
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
        <Ionicons
          name={icon}
          size={15}
          color={C.muted}
          accessible={false}
        />
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
  const narrow = width < 360;
  const tablet = width >= 700;

  const isDemo = result.inference_mode === 'demo';
  const score = displayScore(result.quality_score);
  const confidence = displayScore(result.confidence);
  const status = getStatus(result.quality_state);

  const factors = Array.isArray(result.contributing_factors)
    ? result.contributing_factors
    : [];

  const recommendation = getRecommendation(result.recommendation);
  const produceName = getProduceName(result.produce_type);
  const modelVersion =
    normalizeString(result.model_version) || 'Unavailable';

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
        <View style={s.headerTop}>
          <View style={s.brand}>
            <View style={s.brandIcon}>
              <Ionicons name="analytics" size={18} color="#FFFFFF" />
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

        <Text
          accessibilityRole="header"
          style={[s.heading, narrow ? s.headingNarrow : null]}>
          Your assessment,{'\n'}
          <Text style={s.headingAccent}>explained.</Text>
        </Text>

        <Text style={s.subtitle}>
          Review the score, context indicators and recommendation
          together.
        </Text>
      </View>

      <View style={s.scoreCard}>
        <View style={s.scoreHeader}>
          <View
            style={[
              s.statusPill,
              {backgroundColor: status.background},
            ]}>
            <View
              style={[
                s.statusDot,
                {backgroundColor: status.color},
              ]}
            />

            <Text style={[s.statusLabel, {color: status.color}]}>
              {status.label}
            </Text>
          </View>

          <Text style={s.scoreCaption}>
            {isDemo
              ? 'Illustrative quality score'
              : 'Quality score'}
          </Text>
        </View>

        <View style={s.scoreValueRow}>
          <Text style={[s.scoreValue, {color: status.color}]}>
            {score === null ? '—' : score}
          </Text>
          <Text style={s.scoreMaximum}>/100</Text>
        </View>

        <View
          accessible
          accessibilityLabel={
            score === null
              ? 'Quality score unavailable'
              : `Quality score ${score} out of 100`
          }
          style={s.scoreTrack}>
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

        <Text style={s.stateDescription}>
          {isDemo
            ? `${status.label} is a demo label from storage-context heuristics, not an image-based finding.`
            : status.description}
        </Text>

        <View style={s.scoreDivider} />

        <View style={s.metadataRow}>
          <View style={s.metadataItem}>
            <Text style={s.metadataLabel}>PRODUCE</Text>
            <Text style={s.metadataValue}>{produceName}</Text>
          </View>

          <View style={s.metadataItem}>
            <Text style={s.metadataLabel}>ASSESSED</Text>
            <Text style={s.metadataValue}>
              {formatDate(result.created_at)}
            </Text>
          </View>
        </View>
      </View>

      <View style={s.recommendationCard}>
        <View style={s.sectionHeader}>
          <IconTile
            name="arrow-forward"
            color={C.green}
            background="#DDEDE1"
          />

          <View style={s.sectionCopy}>
            <Text accessibilityRole="header" style={s.sectionTitle}>
              Recommendation
            </Text>
            <Text style={s.sectionSubtitle}>
              Read alongside the prototype limitations.
            </Text>
          </View>
        </View>

        <Text style={s.recommendationText}>{recommendation}</Text>
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
                      {hasValidWeight
                        ? rawWeight.toFixed(2)
                        : '—'}
                    </Text>
                  </View>

                  <View
                    accessible
                    accessibilityLabel={`${label}: ${
                      hasValidWeight
                        ? rawWeight.toFixed(2)
                        : 'unavailable'
                    }`}
                    style={s.factorTrack}>
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
            value={
              isDemo ? 'Illustrative only' : 'Not a safety rating'
            }
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
          Inspect the produce manually. Do not use this result alone
          to decide whether food is safe to eat.
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start a new tomato assessment"
        accessibilityHint="Returns to the photo and storage details form"
        onPress={onNew}
        style={({pressed}) => [
          s.newButton,
          pressed ? s.newButtonPressed : null,
        ]}>
        <Ionicons
          name="add"
          size={22}
          color={C.greenDark}
          accessible={false}
        />

        <Text style={s.newButtonText}>New assessment</Text>

        <Ionicons
          name="arrow-forward"
          size={18}
          color={C.greenDark}
          accessible={false}
        />
      </Pressable>

      <Text style={s.footer}>
        Educational decision support · Not food-safety certification
      </Text>
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
    paddingBottom: 36,
    gap: 17,
  },
  contentTablet: {
    paddingHorizontal: 30,
    paddingTop: 24,
    gap: 20,
  },
  header: {
    paddingTop: 5,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
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
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#EAF1E7',
  },
  modeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#63814E',
  },
  modePillText: {
    color: '#647950',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  heading: {
    color: C.ink,
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.9,
    marginTop: 16,
  },
  headingNarrow: {
    fontSize: 27,
    lineHeight: 34,
  },
  headingAccent: {
    color: C.green,
  },
  subtitle: {
    color: C.body,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 9,
    maxWidth: 520,
  },
  scoreCard: {
    padding: 20,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
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
    borderRadius: 10,
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
    color: C.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  scoreValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
    marginTop: 18,
  },
  scoreValue: {
    fontSize: 60,
    lineHeight: 68,
    fontWeight: '800',
    letterSpacing: -2,
  },
  scoreMaximum: {
    color: C.faint,
    fontSize: 18,
    fontWeight: '700',
  },
  scoreTrack: {
    height: 9,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: '#EDF2EE',
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
    color: C.faint,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  stateDescription: {
    color: C.body,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 17,
  },
  scoreDivider: {
    height: 1,
    backgroundColor: '#EAF0EB',
    marginVertical: 17,
  },
  metadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  metadataItem: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 130,
  },
  metadataLabel: {
    color: C.faint,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  metadataValue: {
    color: '#5F7A66',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  recommendationCard: {
    padding: 17,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DCEBDD',
    backgroundColor: '#EDF6EF',
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
    borderRadius: 12,
  },
  sectionCopy: {
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    color: '#31523D',
    fontSize: 15,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#85998B',
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },
  recommendationText: {
    color: '#597761',
    fontSize: 13,
    lineHeight: 22,
  },
  card: {
    padding: 17,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  cardTitle: {
    color: '#2B4A36',
    fontSize: 15,
    fontWeight: '800',
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
    color: '#627C6A',
    fontSize: 12,
    fontWeight: '700',
  },
  factorValue: {
    color: '#51775D',
    fontSize: 11,
    fontWeight: '800',
  },
  factorTrack: {
    height: 7,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#EFF4F0',
  },
  factorFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#76A783',
  },
  factorNotice: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F5F8F5',
    marginTop: 18,
  },
  factorNoticeText: {
    color: '#8A9C8F',
    fontSize: 10,
    lineHeight: 17,
  },
  emptyText: {
    color: C.muted,
    fontSize: 12,
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
    color: C.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  detailValue: {
    flexShrink: 1,
    color: '#5B7864',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#EEF2EE',
  },
  notice: {
    padding: 16,
    borderRadius: 17,
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
    color: '#82754F',
    fontSize: 12,
    fontWeight: '800',
  },
  noticeText: {
    color: '#9A8E6D',
    fontSize: 11,
    lineHeight: 18,
  },
  noticeDivider: {
    height: 1,
    backgroundColor: '#E7E0CF',
    marginVertical: 11,
  },
  noticeFootnote: {
    color: '#958765',
    fontSize: 10,
    lineHeight: 17,
  },
  newButton: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 11,
    paddingHorizontal: 20,
    borderRadius: 17,
    backgroundColor: C.lime,
  },
  newButtonText: {
    color: C.greenDark,
    fontSize: 15,
    fontWeight: '800',
  },
  newButtonPressed: {
    opacity: 0.84,
    transform: [{scale: 0.99}],
  },
  footer: {
    color: C.faint,
    fontSize: 10,
    lineHeight: 17,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});