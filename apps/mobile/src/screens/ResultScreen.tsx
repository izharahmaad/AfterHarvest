import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type {Assessment} from '../types/assessment';

type Props = {
  result: Assessment;
  onNew: () => void;
};

type StatusStyle = {
  label: string;
  color: string;
  background: string;
  description: string;
};

const STATUS: Record<string, StatusStyle> = {
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
  return STATUS[normalizeState(value)] ?? UNKNOWN_STATUS;
}

function formatDate(value: unknown): string {
  if (typeof value !== 'string') {
    return 'Date unavailable';
  }

  const date = new Date(value);

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

  return (
    FACTOR_LABELS[normalized] ??
    normalized
      .replace(/_/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase())
  );
}

function getRecommendation(value: unknown): string {
  const recommendation = normalizeString(value);

  return (
    recommendation ||
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

export default function ResultScreen({result, onNew}: Props) {
  const demo = result.inference_mode === 'demo';
  const score = displayScore(result.quality_score);
  const confidence = displayScore(result.confidence);
  const status = getStatus(result.quality_state);
  const factors = Array.isArray(result.contributing_factors)
    ? result.contributing_factors
    : [];
  const recommendation = getRecommendation(result.recommendation);
  const produceName = getProduceName(result.produce_type);
  return (
    <View style={s.container}>
      <View>
        <View style={s.badge}>
          <View style={s.badgeDot} />
          <Text style={s.badgeText}>ASSESSMENT RESULT</Text>
        </View>

        <Text style={s.heading}>
          Your assessment,{'\n'}explained.
        </Text>

        <Text style={s.subtitle}>
          Review the score, storage-context indicators and
          recommendation together.
        </Text>
      </View>

      <View style={s.scoreCard}>
        <View style={s.scoreCardHeader}>
          <View
            style={[
              s.statusBadge,
              {backgroundColor: status.background},
            ]}>
            <View
              style={[
                s.statusDot,
                {backgroundColor: status.color},
              ]}
            />
            <Text style={[s.statusText, {color: status.color}]}>
              {status.label}
            </Text>
          </View>

          <View style={s.modeBadge}>
            <Text style={s.modeText}>
              {demo ? 'DEMO MODE' : 'MODEL MODE'}
            </Text>
          </View>
        </View>

        <Text style={s.scoreLabel}>
          {demo ? 'Illustrative quality score' : 'Quality score'}
        </Text>

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

        <View style={s.scaleLabels}>
          <Text style={s.scaleText}>Lower score</Text>
          <Text style={s.scaleText}>Higher score</Text>
        </View>

        <Text style={s.stateDescription}>
          {demo
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
          <View style={s.recommendationIcon}>
            <Text style={s.recommendationIconText}>→</Text>
          </View>

          <View style={s.sectionCopy}>
            <Text style={s.sectionTitle}>Recommendation</Text>
            <Text style={s.sectionSubtitle}>
              Read alongside the prototype limitations.
            </Text>
          </View>
        </View>

        <Text style={s.recommendationText}>
          {recommendation}
        </Text>
      </View>

      <View style={s.card}>
        <View style={s.sectionHeader}>
          <View style={s.sectionIcon}>
            <Text style={s.sectionIconText}>≡</Text>
          </View>

          <View style={s.sectionCopy}>
            <Text style={s.sectionTitle}>Context indicators</Text>
            <Text style={s.sectionSubtitle}>
              {demo
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
              const validWeight =
                typeof rawWeight === 'number' &&
                Number.isFinite(rawWeight);

              const value = validWeight ? clamp(rawWeight) : 0;
              const label = getFactorLabel(factor?.name);

              return (
                <View key={`${label}-${index}`}>
                  <View style={s.factorHeader}>
                    <Text style={s.factorName}>{label}</Text>

                    <Text style={s.factorValue}>
                      {validWeight ? rawWeight.toFixed(2) : '—'}
                    </Text>
                  </View>

                  <View
                    accessible
                    accessibilityLabel={`${label}: ${
                      validWeight
                        ? rawWeight.toFixed(2)
                        : 'unavailable'
                    }`}
                    style={s.factorTrack}>
                    <View
                      style={[
                        s.factorFill,
                        {width: `${value * 100}%`},
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
            {demo
              ? 'Bars show individual heuristic indicators on a 0–1 scale. They are not contribution percentages and do not need to sum to 1.'
              : 'Bars show the factor values returned by the service. Their interpretation depends on the model implementation.'}
          </Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.sectionTitle}>Inference details</Text>

        <View style={s.detailRow}>
          <Text style={s.detailLabel}>Mode</Text>
          <Text style={s.detailValue}>
            {demo ? 'Demo inference' : 'Model inference'}
          </Text>
        </View>

        <View style={s.detailDivider} />

        <View style={s.detailRow}>
          <Text style={s.detailLabel}>Confidence</Text>
          <Text style={s.detailValue}>
            {demo
              ? 'Not estimated'
              : confidence === null
                ? 'Unavailable'
                : `${confidence}% reported`}
          </Text>
        </View>

        <View style={s.detailDivider} />

        <View style={s.detailRow}>
          <Text style={s.detailLabel}>Score meaning</Text>
          <Text style={s.detailValue}>
            {demo ? 'Illustrative only' : 'Not a safety rating'}
          </Text>
        </View>

        <View style={s.detailDivider} />

        <View style={s.detailRow}>
          <Text style={s.detailLabel}>Model version</Text>
          <Text style={s.detailValue}>
            {normalizeString(result.model_version) || 'Unavailable'}
          </Text>
        </View>
      </View>

      <View style={s.notice}>
        <View style={s.noticeHeader}>
          <View style={s.noticeIcon}>
            <Text style={s.noticeIconText}>i</Text>
          </View>

          <Text style={s.noticeTitle}>
            Know what this result means
          </Text>
        </View>

        <Text style={s.noticeText}>
          {demo
            ? 'This demo validates the uploaded image but does not analyze it with a trained AI model. It does not predict remaining shelf life or provide a measured probability of freshness.'
            : 'This prototype result is decision support, not food-safety certification. A quality score must not be interpreted as proof that food is safe.'}
        </Text>

        <View style={s.noticeDivider} />

        <Text style={s.noticeFootnote}>
          Inspect the produce manually. Do not use this result
          alone to decide whether food is safe to eat.
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start a new tomato assessment"
        onPress={onNew}
        style={({pressed}) => [
          s.newButton,
          pressed ? s.pressed : null,
        ]}>
        <Text style={s.newButtonText}>New assessment</Text>
        <Text style={s.newButtonArrow}>→</Text>
      </Pressable>

      <Text style={s.footer}>
        Educational decision support · Not food-safety certification
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    gap: 18,
    paddingTop: 8,
    paddingBottom: 12,
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
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#26744E',
  },
  heading: {
    fontSize: 30,
    lineHeight: 37,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: '#173C2A',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#718174',
    marginTop: 10,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E3EBE5',
    padding: 22,
  },
  scoreCardHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  statusBadge: {
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
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modeBadge: {
    backgroundColor: '#F0F4F1',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 7,
  },
  modeText: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#829487',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#819386',
    marginTop: 25,
  },
  scoreValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
    marginTop: 4,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -2,
  },
  scoreMaximum: {
    fontSize: 19,
    color: '#A0AEA3',
  },
  scoreTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#EDF2EE',
    marginTop: 12,
  },
  scoreFill: {
    height: '100%',
    borderRadius: 4,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
  },
  scaleText: {
    fontSize: 9,
    color: '#9AAA9E',
  },
  stateDescription: {
    fontSize: 12,
    lineHeight: 19,
    color: '#748779',
    marginTop: 18,
  },
  scoreDivider: {
    height: 1,
    backgroundColor: '#EAF0EB',
    marginVertical: 18,
  },
  metadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  metadataItem: {
    flexGrow: 1,
    flexShrink: 1,
  },
  metadataLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#96A599',
  },
  metadataValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#607D69',
    marginTop: 6,
  },
  recommendationCard: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#EDF6EF',
    borderWidth: 1,
    borderColor: '#DCEBDD',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 17,
  },
  sectionCopy: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#31523D',
  },
  sectionSubtitle: {
    fontSize: 10,
    lineHeight: 16,
    color: '#85998B',
    marginTop: 4,
  },
  recommendationIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: '#DDEDE1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationIconText: {
    fontSize: 22,
    color: '#4E835E',
  },
  recommendationText: {
    fontSize: 13,
    lineHeight: 22,
    color: '#597761',
  },
  card: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3EBE5',
  },
  sectionIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: '#EEF5EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionIconText: {
    fontSize: 22,
    color: '#638A6D',
  },
  factorList: {
    gap: 19,
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  factorName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#627C6A',
  },
  factorValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#51775D',
  },
  factorTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: '#EFF4F0',
  },
  factorFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#76A783',
  },
  factorNotice: {
    backgroundColor: '#F5F8F5',
    padding: 12,
    borderRadius: 11,
    marginTop: 19,
  },
  factorNoticeText: {
    fontSize: 10,
    lineHeight: 17,
    color: '#8A9C8F',
  },
  emptyText: {
    fontSize: 12,
    color: '#8A9C8F',
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  detailLabel: {
    fontSize: 12,
    color: '#85978B',
  },
  detailValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: '600',
    color: '#5B7864',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#EEF2EE',
  },
  notice: {
    padding: 16,
    borderRadius: 17,
    backgroundColor: '#F5F2E9',
    borderWidth: 1,
    borderColor: '#EAE4D5',
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  noticeIcon: {
    width: 23,
    height: 23,
    borderRadius: 7,
    backgroundColor: '#EAE3D1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeIconText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#938253',
  },
  noticeTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#82754F',
  },
  noticeText: {
    fontSize: 11,
    lineHeight: 18,
    color: '#9A8E6D',
  },
  noticeDivider: {
    height: 1,
    backgroundColor: '#E7E0CF',
    marginVertical: 11,
  },
  noticeFootnote: {
    fontSize: 10,
    lineHeight: 17,
    color: '#958765',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 13,
    minHeight: 56,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#1C6846',
  },
  newButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  newButtonArrow: {
    fontSize: 22,
    color: '#D5EADB',
  },
  footer: {
    fontSize: 10,
    lineHeight: 17,
    color: '#91A095',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  pressed: {
    opacity: 0.8,
  },
});