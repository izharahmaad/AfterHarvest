import React, {useMemo, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type {Assessment} from '../types/assessment';

type Props = {
  items: Assessment[];
  onSelect: (assessment: Assessment) => void;
};

type Filter = 'all' | 'fresh' | 'aging' | 'spoiled';

type StatusStyle = {
  label: string;
  color: string;
  background: string;
};

const FILTERS: Array<{value: Filter; label: string}> = [
  {value: 'all', label: 'All'},
  {value: 'fresh', label: 'Fresh'},
  {value: 'aging', label: 'Aging'},
  {value: 'spoiled', label: 'Spoiled'},
];

const STATUS_STYLES: Record<string, StatusStyle> = {
  fresh: {
    label: 'Fresh',
    color: '#28764A',
    background: '#EAF5EC',
  },
  aging: {
    label: 'Aging',
    color: '#9A6B20',
    background: '#FBF2DE',
  },
  spoiled: {
    label: 'Spoiled',
    color: '#AD514B',
    background: '#FBECE9',
  },
};

const UNKNOWN_STATUS: StatusStyle = {
  label: 'Uncertain',
  color: '#64748B',
  background: '#EDF1F4',
};

function normalizeState(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function getStatus(state: unknown): StatusStyle {
  return STATUS_STYLES[normalizeState(state)] ?? UNKNOWN_STATUS;
}

function getScore(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  return Math.round(Math.max(0, Math.min(1, value)) * 100);
}

function getTimestamp(value: unknown): number {
  if (typeof value !== 'string') {
    return 0;
  }

  const timestamp = Date.parse(value);

  return Number.isFinite(timestamp) ? timestamp : 0;
}

function formatDate(value: unknown): string {
  if (typeof value !== 'string') {
    return 'Date unavailable';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getRecommendation(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) {
    return 'Open this assessment to review its details.';
  }

  return value.trim();
}

function isDemoAssessment(item: Assessment): boolean {
  return item.inference_mode === 'demo';
}

export default function HistoryScreen({items, onSelect}: Props) {
  const [filter, setFilter] = useState<Filter>('all');

  const sortedItems = useMemo(() => {
    return [...items].sort(
      (first, second) =>
        getTimestamp(second.created_at) -
        getTimestamp(first.created_at),
    );
  }, [items]);

  const counts = useMemo(() => {
    const fresh = items.filter(
      item => normalizeState(item.quality_state) === 'fresh',
    ).length;

    const aging = items.filter(
      item => normalizeState(item.quality_state) === 'aging',
    ).length;

    const spoiled = items.filter(
      item => normalizeState(item.quality_state) === 'spoiled',
    ).length;

    return {
      all: items.length,
      fresh,
      aging,
      spoiled,
    };
  }, [items]);

  const visibleItems = useMemo(() => {
    if (filter === 'all') {
      return sortedItems;
    }

    return sortedItems.filter(
      item => normalizeState(item.quality_state) === filter,
    );
  }, [filter, sortedItems]);

  const listTitle =
    filter === 'all'
      ? 'Recent assessments'
      : `${FILTERS.find(option => option.value === filter)?.label ?? 'Filtered'} assessments`;

  return (
    <View style={s.container}>
      <View>
        <View style={s.badge}>
          <View style={s.badgeDot} />
          <Text style={s.badgeText}>YOUR ASSESSMENTS</Text>
        </View>

        <Text style={s.heading}>
          Your produce,{'\n'}at a glance.
        </Text>

        <Text style={s.subtitle}>
          Review recent assessments and revisit the details behind
          each result.
        </Text>
      </View>

      <View style={s.sessionNotice}>
        <View style={s.sessionIcon}>
          <Text style={s.sessionIconText}>i</Text>
        </View>

        <View style={s.sessionCopy}>
          <Text style={s.sessionTitle}>Session history</Text>
          <Text style={s.sessionDescription}>
            These records reset when the app restarts. Cloud
            persistence is not connected yet.
          </Text>
        </View>
      </View>

      <View style={s.summaryRow}>
        <View style={s.summaryCard}>
          <Text style={s.summaryLabel}>Assessments</Text>
          <Text style={s.summaryValue}>{counts.all}</Text>
          <Text style={s.summaryHint}>This session</Text>
        </View>

        <View style={[s.summaryCard, s.summaryCardGreen]}>
          <Text style={s.summaryLabel}>Fresh results</Text>
          <Text style={[s.summaryValue, s.summaryValueGreen]}>
            {counts.fresh}
          </Text>
          <Text style={s.summaryHint}>Demo state labels</Text>
        </View>
      </View>

      <View style={s.filterRow}>
        {FILTERS.map(option => {
          const selected = filter === option.value;

          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityLabel={`Show ${option.label.toLowerCase()} assessments`}
              accessibilityState={{selected}}
              onPress={() => setFilter(option.value)}
              style={({pressed}) => [
                s.filter,
                selected ? s.filterSelected : null,
                pressed ? s.pressed : null,
              ]}>
              <Text
                style={[
                  s.filterText,
                  selected ? s.filterTextSelected : null,
                ]}>
                {option.label}
              </Text>

              <View
                style={[
                  s.filterCount,
                  selected ? s.filterCountSelected : null,
                ]}>
                <Text
                  style={[
                    s.filterCountText,
                    selected ? s.filterCountTextSelected : null,
                  ]}>
                  {counts[option.value]}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={s.listHeader}>
        <Text style={s.listTitle}>{listTitle}</Text>

        <Text style={s.listCount}>
          {visibleItems.length}{' '}
          {visibleItems.length === 1 ? 'record' : 'records'}
        </Text>
      </View>

      {visibleItems.length === 0 ? (
        <View style={s.emptyCard}>
          <View style={s.emptyIcon}>
            <Text style={s.emptyIconText}>H</Text>
          </View>

          <Text style={s.emptyTitle}>
            {items.length === 0
              ? 'Your history starts here'
              : 'No matching assessments'}
          </Text>

          <Text style={s.emptyDescription}>
            {items.length === 0
              ? 'Complete your first tomato assessment and it will appear here.'
              : `There are no ${filter} results in this session. Try another filter.`}
          </Text>

          {filter !== 'all' ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View all assessment results"
              onPress={() => setFilter('all')}
              style={({pressed}) => [
                s.resetButton,
                pressed ? s.pressed : null,
              ]}>
              <Text style={s.resetButtonText}>View all results</Text>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <View style={s.list}>
          {visibleItems.map(item => {
            const status = getStatus(item.quality_state);
            const score = getScore(item.quality_score);
            const time = formatTime(item.created_at);
            const demo = isDemoAssessment(item);
            const recommendation = getRecommendation(item.recommendation);

            return (
              <Pressable
                key={item.assessment_id}
                accessibilityRole="button"
                accessibilityLabel={`Open ${status.label.toLowerCase()} tomato assessment, ${
                  score === null
                    ? 'score unavailable'
                    : `score ${score} out of 100`
                }`}
                onPress={() => onSelect(item)}
                style={({pressed}) => [
                  s.assessmentCard,
                  pressed ? s.cardPressed : null,
                ]}>
                <View style={s.cardTop}>
                  <View style={s.produceIcon}>
                    <Text style={s.produceIconText}>T</Text>
                  </View>

                  <View style={s.produceCopy}>
                    <Text style={s.produceTitle}>
                      Tomato assessment
                    </Text>

                    <Text style={s.date}>
                      {formatDate(item.created_at)}
                      {time ? ` · ${time}` : ''}
                    </Text>
                  </View>

                  <Text style={s.chevron}>›</Text>
                </View>

                <View style={s.cardDivider} />

                <View style={s.resultRow}>
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

                    <Text
                      style={[
                        s.statusText,
                        {color: status.color},
                      ]}>
                      {status.label}
                    </Text>
                  </View>

                  <View style={s.scoreGroup}>
                    <Text style={s.scoreLabel}>
                      {demo ? 'Demo score' : 'Quality score'}
                    </Text>

                    <View style={s.scoreValueRow}>
                      <Text style={s.scoreValue}>
                        {score === null ? '—' : score}
                      </Text>
                      <Text style={s.scoreMaximum}>/100</Text>
                    </View>
                  </View>
                </View>

                <View style={s.progressTrack}>
                  <View
                    style={[
                      s.progressFill,
                      {
                        width: `${score ?? 0}%`,
                        backgroundColor: status.color,
                      },
                    ]}
                  />
                </View>

                <Text style={s.recommendation} numberOfLines={2}>
                  {recommendation}
                </Text>

                <View style={s.cardFooter}>
                  <View style={s.modeBadge}>
                    <Text style={s.modeText}>
                      {demo ? 'DEMO INFERENCE' : 'MODEL INFERENCE'}
                    </Text>
                  </View>

                  <Text style={s.detailsLink}>View details</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      <Text style={s.footer}>
        Demo scores are not food-safety ratings or measured
        probabilities.
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
  sessionNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    padding: 14,
    borderRadius: 15,
    backgroundColor: '#EEF3EF',
    borderWidth: 1,
    borderColor: '#E0E9E2',
  },
  sessionIcon: {
    width: 25,
    height: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DEEADF',
  },
  sessionIconText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#52715B',
  },
  sessionCopy: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#526D5B',
  },
  sessionDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: '#778A7C',
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3EBE5',
  },
  summaryCardGreen: {
    backgroundColor: '#EDF6EF',
    borderColor: '#D9E9DD',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#718174',
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#264733',
    marginTop: 8,
  },
  summaryValueGreen: {
    color: '#2A7548',
  },
  summaryHint: {
    fontSize: 10,
    color: '#87978B',
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E9E3',
  },
  filterSelected: {
    backgroundColor: '#1C6846',
    borderColor: '#1C6846',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718174',
  },
  filterTextSelected: {
    color: '#FFFFFF',
  },
  filterCount: {
    minWidth: 20,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 7,
    backgroundColor: '#F0F4F1',
    alignItems: 'center',
  },
  filterCountSelected: {
    backgroundColor: '#3B805C',
  },
  filterCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7D9082',
  },
  filterCountTextSelected: {
    color: '#E8F5EB',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 2,
  },
  listTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#284A35',
  },
  listCount: {
    fontSize: 11,
    color: '#8A9A8E',
  },
  list: {
    gap: 12,
  },
  assessmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
    borderColor: '#E3EBE5',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  produceIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#EDF4EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  produceIconText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#447852',
  },
  produceCopy: {
    flex: 1,
  },
  produceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D4D38',
  },
  date: {
    fontSize: 10,
    lineHeight: 16,
    color: '#8A998E',
    marginTop: 4,
  },
  chevron: {
    fontSize: 28,
    color: '#9BAA9E',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#EDF1ED',
    marginVertical: 14,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scoreGroup: {
    alignItems: 'flex-end',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#8C9B90',
  },
  scoreValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    marginTop: 2,
  },
  scoreValue: {
    fontSize: 25,
    fontWeight: '800',
    color: '#31553D',
  },
  scoreMaximum: {
    fontSize: 11,
    color: '#91A095',
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#EFF3EF',
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  recommendation: {
    fontSize: 12,
    lineHeight: 19,
    color: '#748678',
    marginTop: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 14,
  },
  modeBadge: {
    backgroundColor: '#F2F5F2',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 6,
  },
  modeText: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#85958A',
  },
  detailsLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#377A50',
  },
  emptyCard: {
    paddingHorizontal: 24,
    paddingVertical: 34,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3EBE5',
  },
  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: '#EDF5EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyIconText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#639273',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#34553E',
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 12,
    lineHeight: 20,
    color: '#8A998E',
    textAlign: 'center',
    marginTop: 8,
  },
  resetButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#EAF3EC',
    marginTop: 16,
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#31734B',
  },
  footer: {
    fontSize: 10,
    lineHeight: 17,
    textAlign: 'center',
    color: '#91A095',
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.8,
  },
  cardPressed: {
    backgroundColor: '#F5FAF6',
    borderColor: '#B9D2C1',
  },
});