import React, {useMemo, useState} from 'react';
import {
  Pressable,
  ScrollView,
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
  items: Assessment[];
  onSelect: (assessment: Assessment) => void;
};

type Filter = 'all' | 'fresh' | 'aging' | 'spoiled';

type StatusStyle = {
  label: string;
  color: string;
  background: string;
};

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const FILTERS: Array<{
  value: Filter;
  label: string;
  icon: IconName;
}> = [
  {value: 'all', label: 'All', icon: 'apps-outline'},
  {value: 'fresh', label: 'Fresh', icon: 'leaf-outline'},
  {value: 'aging', label: 'Aging', icon: 'hourglass-outline'},
  {value: 'spoiled', label: 'Spoiled', icon: 'warning-outline'},
];

const STATUS_STYLES: Record<string, StatusStyle> = {
  fresh: {
    label: 'Fresh',
    color: colors.success,
    background: colors.successSoft,
  },
  aging: {
    label: 'Aging',
    color: colors.warning,
    background: colors.warningSoft,
  },
  spoiled: {
    label: 'Spoiled',
    color: colors.danger,
    background: colors.dangerSoft,
  },
};

const UNKNOWN_STATUS: StatusStyle = {
  label: 'Uncertain',
  color: colors.neutral,
  background: colors.neutralSoft,
};

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeState(value: unknown): string {
  return normalizeString(value).toLowerCase();
}

function getStatus(value: unknown): StatusStyle {
  return STATUS_STYLES[normalizeState(value)] ?? UNKNOWN_STATUS;
}

function getScore(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  return Math.round(Math.max(0, Math.min(1, value)) * 100);
}

function getTimestamp(value: unknown): number {
  const createdAt = normalizeString(value);

  if (!createdAt) {
    return 0;
  }

  const timestamp = Date.parse(createdAt);

  return Number.isFinite(timestamp) ? timestamp : 0;
}

function formatDate(value: unknown): string {
  const createdAt = normalizeString(value);

  if (!createdAt) {
    return 'Date unavailable';
  }

  const date = new Date(createdAt);

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
  const createdAt = normalizeString(value);

  if (!createdAt) {
    return '';
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getRecommendation(value: unknown): string {
  return (
    normalizeString(value) ||
    'Open this assessment to review its details.'
  );
}

function getAssessmentKey(
  assessment: Assessment,
  index: number,
): string {
  const assessmentId = normalizeString(assessment.assessment_id);

  if (assessmentId) {
    return assessmentId;
  }

  return `assessment-${index}-${getTimestamp(assessment.created_at)}`;
}

function isDemoAssessment(assessment: Assessment): boolean {
  return assessment.inference_mode === 'demo';
}

function SummaryTile({
  label,
  value,
  hint,
  icon,
  emphasized = false,
}: {
  label: string;
  value: number;
  hint: string;
  icon: IconName;
  emphasized?: boolean;
}) {
  return (
    <View
      style={[
        s.summaryTile,
        emphasized ? s.summaryTileEmphasized : null,
      ]}>
      <View style={s.summaryTop}>
        <Text
          style={[
            s.summaryLabel,
            emphasized ? s.summaryLabelEmphasized : null,
          ]}>
          {label}
        </Text>

        <View
          style={[
            s.summaryIcon,
            emphasized ? s.summaryIconEmphasized : null,
          ]}>
          <Ionicons
            name={icon}
            size={15}
            color={emphasized ? colors.white : colors.primary}
          />
        </View>
      </View>

      <Text
        style={[
          s.summaryValue,
          emphasized ? s.summaryValueEmphasized : null,
        ]}>
        {value}
      </Text>

      <Text
        style={[
          s.summaryHint,
          emphasized ? s.summaryHintEmphasized : null,
        ]}>
        {hint}
      </Text>
    </View>
  );
}

function AssessmentCard({
  item,
  onPress,
}: {
  item: Assessment;
  onPress: () => void;
}) {
  const status = getStatus(item.quality_state);
  const score = getScore(item.quality_score);
  const time = formatTime(item.created_at);
  const demo = isDemoAssessment(item);
  const recommendation = getRecommendation(item.recommendation);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${status.label.toLowerCase()} tomato assessment${
        score === null
          ? ''
          : ` with score ${score} out of 100`
      }`}
      onPress={onPress}
      style={({pressed}) => [
        s.card,
        pressed ? s.cardPressed : null,
      ]}>
      <View style={s.cardHeader}>
        <View style={s.produceIcon}>
          <Ionicons
            name="nutrition-outline"
            size={19}
            color={colors.primary}
          />
        </View>

        <View style={s.produceCopy}>
          <Text style={s.produceTitle}>Tomato assessment</Text>
          <Text style={s.produceDate}>
            {formatDate(item.created_at)}
            {time ? ` · ${time}` : ''}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={17}
          color={colors.faint}
          accessible={false}
        />
      </View>

      <View style={s.cardDivider} />

      <View style={s.resultRow}>
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

        <View style={s.scoreGroup}>
          <Text style={s.scoreLabel}>
            {demo ? 'Demo score' : 'Quality score'}
          </Text>

          <View style={s.scoreRow}>
            <Text style={s.scoreValue}>
              {score === null ? '—' : score}
            </Text>
            <Text style={s.scoreMax}>/100</Text>
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

      <View style={s.recommendationRow}>
        <Ionicons
          name="sparkles-outline"
          size={14}
          color={colors.primary}
          accessible={false}
        />

        <Text style={s.recommendation} numberOfLines={2}>
          {recommendation}
        </Text>
      </View>

      <View style={s.cardFooter}>
        <View style={s.modePill}>
          <Text style={s.modeText}>
            {demo ? 'DEMO INFERENCE' : 'MODEL INFERENCE'}
          </Text>
        </View>

        <View style={s.detailsLink}>
          <Text style={s.detailsLinkText}>View details</Text>
          <Ionicons
            name="chevron-forward"
            size={14}
            color={colors.primary}
            accessible={false}
          />
        </View>
      </View>
    </Pressable>
  );
}

export default function HistoryScreen({
  items,
  onSelect,
}: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const {width} = useWindowDimensions();
  const narrow = width < 360;
  const tablet = width >= 700;

  const sortedItems = useMemo(() => {
    return [...items].sort(
      (first, second) =>
        getTimestamp(second.created_at) -
        getTimestamp(first.created_at),
    );
  }, [items]);

  const counts = useMemo(() => {
    return {
      all: items.length,
      fresh: items.filter(
        item => normalizeState(item.quality_state) === 'fresh',
      ).length,
      aging: items.filter(
        item => normalizeState(item.quality_state) === 'aging',
      ).length,
      spoiled: items.filter(
        item => normalizeState(item.quality_state) === 'spoiled',
      ).length,
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

  const selectedFilter =
    FILTERS.find(option => option.value === filter) ?? FILTERS[0];

  const listTitle =
    filter === 'all'
      ? 'Recent assessments'
      : `${selectedFilter.label} assessments`;

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
              <Ionicons
                name="time"
                size={18}
                color={colors.white}
              />
            </View>

            <View>
              <Text style={s.brandName}>Assessment history</Text>
              <Text style={s.brandCaption}>THIS SESSION</Text>
            </View>
          </View>

          <View style={s.sessionPill}>
            <View style={s.sessionDot} />
            <Text style={s.sessionPillText}>SESSION ONLY</Text>
          </View>
        </View>

        <Text
          accessibilityRole="header"
          style={[s.heading, narrow ? s.headingNarrow : null]}>
          Your produce,{'\n'}
          <Text style={s.headingAccent}>at a glance.</Text>
        </Text>

        <Text style={s.subtitle}>
          Review recent results and revisit the context behind each
          assessment.
        </Text>
      </View>

      <View style={s.metrics}>
        <SummaryTile
          label="Assessments"
          value={counts.all}
          hint="Saved this session"
          icon="layers-outline"
        />

        <SummaryTile
          label="Fresh results"
          value={counts.fresh}
          hint="Current session"
          icon="leaf-outline"
          emphasized
        />
      </View>

      <View style={s.sessionNotice}>
        <View style={s.noticeIcon}>
          <Ionicons
            name="information-circle-outline"
            size={17}
            color={colors.primary}
          />
        </View>

        <View style={s.noticeCopy}>
          <Text style={s.noticeTitle}>Session history</Text>
          <Text style={s.noticeDescription}>
            Records reset when the app restarts. Cloud persistence is
            not connected yet.
          </Text>
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
                pressed ? s.filterPressed : null,
              ]}>
              <Ionicons
                name={option.icon}
                size={14}
                color={selected ? colors.white : colors.muted}
                accessible={false}
              />

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
        <Text accessibilityRole="header" style={s.listTitle}>
          {listTitle}
        </Text>

        <Text style={s.listCount}>
          {visibleItems.length}{' '}
          {visibleItems.length === 1 ? 'record' : 'records'}
        </Text>
      </View>

      {visibleItems.length === 0 ? (
        <View style={s.emptyCard}>
          <View style={s.emptyIcon}>
            <Ionicons
              name={items.length === 0 ? 'leaf-outline' : 'search-outline'}
              size={25}
              color={colors.primary}
            />
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
              accessibilityLabel="View all assessments"
              onPress={() => setFilter('all')}
              style={({pressed}) => [
                s.resetButton,
                pressed ? s.resetPressed : null,
              ]}>
              <Ionicons
                name="apps-outline"
                size={15}
                color={colors.primary}
                accessible={false}
              />
              <Text style={s.resetButtonText}>View all results</Text>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <View style={s.list}>
          {visibleItems.map((item, index) => (
            <AssessmentCard
              key={getAssessmentKey(item, index)}
              item={item}
              onPress={() => onSelect(item)}
            />
          ))}
        </View>
      )}

      <Text style={s.footer}>
        Demo scores are not food-safety ratings or measured
        probabilities.
      </Text>
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
  sessionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  sessionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  sessionPillText: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  heading: {
    ...typography.display,
    color: colors.ink,
    marginTop: 16,
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
  metrics: {
    flexDirection: 'row',
    gap: 11,
  },
  summaryTile: {
    flex: 1,
    minWidth: 0,
    padding: 15,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  summaryTileEmphasized: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  summaryLabel: {
    ...typography.overline,
    color: colors.muted,
  },
  summaryLabelEmphasized: {
    color: colors.white,
  },
  summaryIcon: {
    width: 27,
    height: 27,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  summaryIconEmphasized: {
    backgroundColor: colors.overlay,
  },
  summaryValue: {
    color: colors.ink,
    fontSize: 31,
    fontWeight: '800',
    marginTop: 10,
  },
  summaryValueEmphasized: {
    color: colors.white,
  },
  summaryHint: {
    ...typography.overline,
    color: colors.faint,
    marginTop: 4,
  },
  summaryHintEmphasized: {
    color: colors.primaryDark,
  },
  sessionNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  noticeIcon: {
    width: 27,
    height: 27,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  noticeCopy: {
    flex: 1,
    minWidth: 0,
  },
  noticeTitle: {
    ...typography.label,
    color: colors.ink,
  },
  noticeDescription: {
    ...typography.caption,
    color: colors.muted,
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filter: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPressed: {
    opacity: 0.8,
  },
  filterText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  filterTextSelected: {
    color: colors.white,
  },
  filterCount: {
    minWidth: 20,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: radius.sm,
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  filterCountSelected: {
    backgroundColor: colors.overlay,
  },
  filterCountText: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '800',
  },
  filterCountTextSelected: {
    color: colors.white,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 2,
  },
  listTitle: {
    flex: 1,
    minWidth: 0,
    ...typography.heading,
    color: colors.ink,
  },
  listCount: {
    ...typography.overline,
    color: colors.faint,
  },
  list: {
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  cardPressed: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  produceIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  produceCopy: {
    flex: 1,
    minWidth: 0,
  },
  produceTitle: {
    ...typography.label,
    color: colors.ink,
  },
  produceDate: {
    ...typography.caption,
    color: colors.faint,
    marginTop: 4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 13,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.sm,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  scoreGroup: {
    alignItems: 'flex-end',
  },
  scoreLabel: {
    ...typography.overline,
    color: colors.faint,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    marginTop: 2,
  },
  scoreValue: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '800',
  },
  scoreMax: {
    ...typography.overline,
    color: colors.faint,
  },
  progressTrack: {
    height: 6,
    overflow: 'hidden',
    borderRadius: 3,
    backgroundColor: colors.surfaceMuted,
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  recommendationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginTop: 12,
  },
  recommendation: {
    flex: 1,
    ...typography.caption,
    lineHeight: 18,
    color: colors.text,
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 13,
  },
  modePill: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  modeText: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  detailsLinkText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 34,
    paddingHorizontal: 24,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  emptyIcon: {
    width: 61,
    height: 61,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
    backgroundColor: colors.primarySoft,
  },
  emptyTitle: {
    ...typography.heading,
    color: colors.ink,
    textAlign: 'center',
  },
  emptyDescription: {
    ...typography.body,
    color: colors.muted,
    marginTop: 8,
    textAlign: 'center',
  },
  resetButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    marginTop: 16,
  },
  resetPressed: {
    opacity: 0.8,
  },
  resetButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
    ...typography.overline,
    color: colors.faint,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
});