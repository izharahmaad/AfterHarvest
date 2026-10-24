import React, {useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Ionicons} from '@expo/vector-icons';

import {predict} from '../services/api';
import {
  colors,
  layout,
  radius,
  shadow,
  typography,
} from '../theme/tokens';
import type {Assessment, Context} from '../types/assessment';

type Props = {
  onResult: (result: Assessment) => void;
};

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type NumericField = 'temperature' | 'humidity' | 'days';

type FieldStatus = 'empty' | 'invalid' | 'valid';

type PackagingOption = {
  value: Context['packaging'];
  title: string;
  description: string;
  icon: IconName;
};

type StoragePreset = {
  id: string;
  title: string;
  temperature: string;
  humidity: string;
  days: string;
  icon: IconName;
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 20_000_000;

const SUPPORTED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const PACKAGING_OPTIONS: PackagingOption[] = [
  {
    value: 'open_crate',
    title: 'Open crate',
    description: 'Uncovered storage',
    icon: 'grid-outline',
  },
  {
    value: 'sealed_bag',
    title: 'Sealed bag',
    description: 'Closed packaging',
    icon: 'lock-closed-outline',
  },
  {
    value: 'ventilated_box',
    title: 'Ventilated box',
    description: 'Airflow openings',
    icon: 'leaf-outline',
  },
];

const STORAGE_PRESETS: StoragePreset[] = [
  {
    id: 'room',
    title: 'Room',
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

const FIELDS: Array<{
  key: NumericField;
  label: string;
  unit: string;
  hint: string;
  error: string;
  placeholder: string;
  icon: IconName;
}> = [
  {
    key: 'temperature',
    label: 'Temperature',
    unit: '°C',
    hint: '−20 to 60°C',
    error: 'Enter −20 to 60',
    placeholder: '8.5',
    icon: 'thermometer-outline',
  },
  {
    key: 'humidity',
    label: 'Humidity',
    unit: '%',
    hint: '0 to 100%',
    error: 'Enter 0 to 100',
    placeholder: '72',
    icon: 'water-outline',
  },
  {
    key: 'days',
    label: 'Storage duration',
    unit: 'days',
    hint: 'Whole days, 0–365',
    error: 'Enter 0 to 365',
    placeholder: '4',
    icon: 'time-outline',
  },
];

function parseDecimal(value: string): number | null {
  const normalized = value.trim().replace(',', '.');

  if (!/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function validateImage(
  image: ImagePicker.ImagePickerAsset,
): string | null {
  if (!image.uri) {
    return 'This image could not be opened. Choose another photo.';
  }

  if (
    typeof image.fileSize === 'number' &&
    image.fileSize > MAX_IMAGE_BYTES
  ) {
    return 'Choose an image no larger than 5 MB.';
  }

  if (
    image.width > 0 &&
    image.height > 0 &&
    image.width * image.height > MAX_IMAGE_PIXELS
  ) {
    return 'Choose an image with no more than 20 megapixels.';
  }

  const mimeType = image.mimeType
    ?.toLowerCase()
    .split(';')[0]
    .trim();

  if (mimeType && !SUPPORTED_MIME_TYPES.has(mimeType)) {
    return 'Choose a JPEG, PNG or WebP image. HEIC and HEIF are not supported by the current backend.';
  }

  return null;
}

function formatBytes(value: number | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'Size unavailable';
  }

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function StepHeader({
  number,
  title,
  description,
  required = false,
  complete = false,
}: {
  number: string;
  title: string;
  description: string;
  required?: boolean;
  complete?: boolean;
}) {
  return (
    <View style={s.stepHeader}>
      <View
        style={[
          s.stepNumber,
          complete ? s.stepNumberComplete : null,
        ]}>
        {complete ? (
          <Ionicons
            name="checkmark"
            size={16}
            color={colors.white}
          />
        ) : (
          <Text style={s.stepNumberText}>{number}</Text>
        )}
      </View>

      <View style={s.stepCopy}>
        <View style={s.stepTitleRow}>
          <Text style={s.stepTitle}>{title}</Text>

          {required ? (
            <View style={s.requiredBadge}>
              <Text style={s.requiredBadgeText}>REQUIRED</Text>
            </View>
          ) : null}
        </View>

        <Text style={s.stepDescription}>{description}</Text>
      </View>
    </View>
  );
}

function getKeyboardType(field: NumericField) {
  if (field === 'days') {
    return 'number-pad' as const;
  }

  if (field === 'temperature') {
    return Platform.OS === 'ios'
      ? ('numbers-and-punctuation' as const)
      : ('numeric' as const);
  }

  return 'decimal-pad' as const;
}

export default function CaptureScreen({onResult}: Props) {
  const [asset, setAsset] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [busy, setBusy] = useState(false);
  const [picking, setPicking] = useState(false);
  const [focusedField, setFocusedField] =
    useState<NumericField | null>(null);

  const [context, setContext] = useState<Context>({
    temperature: '8.5',
    humidity: '72',
    days: '4',
    packaging: 'open_crate',
  });

  const operationLocked = useRef(false);
  const disabled = busy || picking;

  const photoReady = Boolean(asset);

  const temperature = parseDecimal(context.temperature);
  const humidity = parseDecimal(context.humidity);
  const days = Number(context.days.trim());

  const temperatureStatus: FieldStatus =
    temperature === null
      ? 'empty'
      : temperature >= -20 && temperature <= 60
        ? 'valid'
        : 'invalid';

  const humidityStatus: FieldStatus =
    humidity === null
      ? 'empty'
      : humidity >= 0 && humidity <= 100
        ? 'valid'
        : 'invalid';

  const daysStatus: FieldStatus =
    context.days.trim() === ''
      ? 'empty'
      : Number.isSafeInteger(days) &&
          days >= 0 &&
          days <= 365
        ? 'valid'
        : 'invalid';

  const conditionsReady =
    temperatureStatus === 'valid' &&
    humidityStatus === 'valid' &&
    daysStatus === 'valid';

  const packagingReady = PACKAGING_OPTIONS.some(
    option => option.value === context.packaging,
  );

  const completedSteps = [
    photoReady,
    conditionsReady,
    packagingReady,
  ].filter(Boolean).length;

  const progressPercent = Math.round(
    (completedSteps / 3) * 100,
  );

  const canSubmit =
    photoReady && conditionsReady && packagingReady && !disabled;

  const activePreset = useMemo(() => {
    return STORAGE_PRESETS.find(
      preset =>
        preset.temperature === context.temperature &&
        preset.humidity === context.humidity &&
        preset.days === context.days,
    );
  }, [context]);

  function updateContext(key: keyof Context, value: string) {
    setContext(previous => ({
      ...previous,
      [key]: value,
    }));
  }

  function applyPreset(preset: StoragePreset) {
    setContext(previous => ({
      ...previous,
      temperature: preset.temperature,
      humidity: preset.humidity,
      days: preset.days,
    }));
  }

  function resetForm() {
    if (busy || picking) {
      return;
    }

    Alert.alert(
      'Clear assessment',
      'Remove the selected photo and reset all storage details?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setAsset(null);
            setContext({
              temperature: '8.5',
              humidity: '72',
              days: '4',
              packaging: 'open_crate',
            });
          },
        },
      ],
    );
  }

  async function chooseImage(useCamera: boolean) {
    if (operationLocked.current) return;

    operationLocked.current = true;
    setPicking(true);
    Keyboard.dismiss();

    try {
      if (useCamera) {
        const permission =
          await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            'Camera permission needed',
            permission.canAskAgain
              ? 'Allow camera access to photograph your tomato.'
              : 'Enable camera access in your device settings, or choose an image from your gallery.',
          );
          return;
        }
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        allowsMultipleSelection: false,
        quality: 0.8,
      };

      const response = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (response.canceled) return;

      const selectedImage = response.assets?.[0];

      if (!selectedImage) {
        Alert.alert(
          'No image selected',
          'Please choose your tomato photo again.',
        );
        return;
      }

      const validationError = validateImage(selectedImage);

      if (validationError) {
        Alert.alert('Check your image', validationError);
        return;
      }

      setAsset(selectedImage);
    } catch (error: unknown) {
      Alert.alert(
        'Unable to open image',
        error instanceof Error
          ? error.message
          : 'Please try selecting your image again.',
      );
    } finally {
      operationLocked.current = false;
      setPicking(false);
    }
  }

  async function submitAssessment() {
    if (operationLocked.current || !canSubmit) return;

    if (!asset) {
      Alert.alert(
        'Photo required',
        'Take a photo or choose a tomato image.',
      );
      return;
    }

    const imageError = validateImage(asset);

    if (imageError) {
      Alert.alert('Check your image', imageError);
      return;
    }

    if (
      temperature === null ||
      temperature < -20 ||
      temperature > 60
    ) {
      Alert.alert(
        'Invalid temperature',
        'Enter a temperature from −20 to 60°C.',
      );
      return;
    }

    if (humidity === null || humidity < 0 || humidity > 100) {
      Alert.alert(
        'Invalid humidity',
        'Enter humidity from 0 to 100%.',
      );
      return;
    }

    const daysText = context.days.trim();

    if (!/^\d+$/.test(daysText)) {
      Alert.alert(
        'Invalid storage duration',
        'Enter a whole number from 0 to 365.',
      );
      return;
    }

    const currentDays = Number(daysText);

    if (!Number.isSafeInteger(currentDays) || currentDays > 365) {
      Alert.alert(
        'Invalid storage duration',
        'Enter a whole number from 0 to 365.',
      );
      return;
    }

    const requestContext: Context = {
      temperature: String(temperature),
      humidity: String(humidity),
      days: String(currentDays),
      packaging: context.packaging,
    };

    operationLocked.current = true;
    setBusy(true);
    Keyboard.dismiss();

    try {
      const assessment = await predict(asset, requestContext);
      onResult(assessment);
    } catch (error: unknown) {
      Alert.alert(
        'Unable to assess',
        error instanceof Error
          ? error.message
          : 'Check your connection and try again.',
      );
    } finally {
      operationLocked.current = false;
      setBusy(false);
    }
  }

  function getFieldStatus(field: NumericField): FieldStatus {
    if (field === 'temperature') {
      return temperatureStatus;
    }

    if (field === 'humidity') {
      return humidityStatus;
    }

    return daysStatus;
  }

  return (
    <View style={s.screen}>
      <View style={s.topBar}>
        <View style={s.brand}>
          <View style={s.brandIcon}>
            <Ionicons
              name="camera"
              size={17}
              color={colors.white}
            />
          </View>

          <View style={s.brandCopy}>
            <Text style={s.brandName}>New assessment</Text>
            <Text style={s.brandCaption}>TOMATO QUALITY</Text>
          </View>
        </View>

        <View style={s.topBarActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear assessment form"
            accessibilityState={{disabled}}
            disabled={disabled}
            onPress={resetForm}
            hitSlop={8}
            style={({pressed}) => [
              s.clearButton,
              pressed ? s.pressed : null,
              disabled ? s.disabled : null,
            ]}>
            <Ionicons
              name="refresh-outline"
              size={16}
              color={colors.muted}
            />
            <Text style={s.clearButtonText}>Clear</Text>
          </Pressable>

          <View style={s.progressChip}>
            <Text style={s.progressChipText}>
              {completedSteps}/3
            </Text>
          </View>
        </View>
      </View>

      <View style={s.progressRail}>
        <View
          style={[
            s.progressRailFill,
            {width: `${progressPercent}%`},
          ]}
        />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={s.intro}>
          <Text
            accessibilityRole="header"
            style={s.heading}>
            Assess quality{'\n'}
            <Text style={s.headingAccent}>with context.</Text>
          </Text>

          <Text style={s.subtitle}>
            Add a clear tomato photo and the conditions it was stored
            in.
          </Text>
        </View>

        <View style={s.card}>
          <StepHeader
            number="01"
            title="Produce photo"
            description="Use one clear image of the tomato."
            required
            complete={photoReady}
          />

          {asset ? (
            <View style={s.preview}>
              <Image
                source={{uri: asset.uri}}
                style={s.previewImage}
                resizeMode="cover"
                accessibilityLabel="Selected tomato photo"
              />

              <View style={s.previewBadge}>
                <View style={s.previewBadgeDot} />
                <Text style={s.previewBadgeText}>
                  PHOTO READY
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Remove selected photo"
                accessibilityState={{disabled}}
                disabled={disabled}
                onPress={() => setAsset(null)}
                hitSlop={10}
                style={({pressed}) => [
                  s.removeButton,
                  pressed ? s.pressed : null,
                  disabled ? s.disabled : null,
                ]}>
                <Ionicons
                  name="close"
                  size={20}
                  color={colors.ink}
                />
              </Pressable>
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Choose tomato photo from gallery"
              accessibilityState={{disabled}}
              disabled={disabled}
              onPress={() => chooseImage(false)}
              style={({pressed}) => [
                s.uploadArea,
                pressed ? s.pressed : null,
                disabled ? s.disabled : null,
              ]}>
              <View style={s.uploadIcon}>
                <Ionicons
                  name="image-outline"
                  size={26}
                  color={colors.primary}
                />
              </View>

              <Text style={s.uploadTitle}>
                Add a tomato photo
              </Text>
              <Text style={s.uploadDescription}>
                Choose a clear, well-lit image from your gallery.
              </Text>
              <Text style={s.uploadHint}>
                JPEG, PNG or WebP · Maximum 5 MB
              </Text>
            </Pressable>
          )}

          {asset ? (
            <View style={s.photoMetadata}>
              <View style={s.metadataItem}>
                <Ionicons
                  name="resize-outline"
                  size={13}
                  color={colors.muted}
                />
                <Text style={s.metadataText}>
                  {asset.width} × {asset.height}
                </Text>
              </View>

              <View style={s.metadataDivider} />

              <View style={s.metadataItem}>
                <Ionicons
                  name="document-outline"
                  size={13}
                  color={colors.muted}
                />
                <Text style={s.metadataText}>
                  {formatBytes(asset.fileSize)}
                </Text>
              </View>
            </View>
          ) : null}

          <View style={s.photoActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Take a tomato photo with the camera"
              accessibilityState={{disabled}}
              disabled={disabled}
              onPress={() => chooseImage(true)}
              style={({pressed}) => [
                s.photoButton,
                s.cameraButton,
                pressed ? s.pressed : null,
                disabled ? s.disabled : null,
              ]}>
              <Ionicons
                name="camera-outline"
                size={16}
                color={colors.primary}
              />
              <Text style={s.cameraButtonText}>Camera</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                asset
                  ? 'Replace the selected tomato photo'
                  : 'Choose a tomato image from gallery'
              }
              accessibilityState={{disabled}}
              disabled={disabled}
              onPress={() => chooseImage(false)}
              style={({pressed}) => [
                s.photoButton,
                s.galleryButton,
                pressed ? s.pressed : null,
                disabled ? s.disabled : null,
              ]}>
              <Ionicons
                name="images-outline"
                size={16}
                color={colors.text}
              />
              <Text style={s.galleryButtonText}>
                {asset ? 'Replace' : 'Gallery'}
              </Text>
            </Pressable>
          </View>

          {picking ? (
            <View style={s.loadingRow}>
              <ActivityIndicator
                color={colors.primary}
                size="small"
              />
              <Text style={s.loadingText}>
                Opening image picker…
              </Text>
            </View>
          ) : null}
        </View>

        <View style={s.tipsCard}>
          <View style={s.tipsHeader}>
            <View style={s.tipsIcon}>
              <Ionicons
                name="bulb-outline"
                size={17}
                color={colors.primary}
              />
            </View>

            <View style={s.tipsCopy}>
              <Text style={s.tipsTitle}>
                Take a better photo
              </Text>
              <Text style={s.tipsDescription}>
                Follow these tips for a more reliable assessment.
              </Text>
            </View>
          </View>

          <View style={s.tipsList}>
            <View style={s.tipRow}>
              <Ionicons
                name="sunny-outline"
                size={15}
                color={colors.primary}
              />
              <Text style={s.tipText}>
                Use bright, indirect light. Avoid dark or shadowed
                photos.
              </Text>
            </View>

            <View style={s.tipRow}>
              <Ionicons
                name="crop-outline"
                size={15}
                color={colors.primary}
              />
              <Text style={s.tipText}>
                Keep the tomato centered and fill most of the frame.
              </Text>
            </View>

            <View style={s.tipRow}>
              <Ionicons
                name="hand-left-outline"
                size={15}
                color={colors.primary}
              />
              <Text style={s.tipText}>
                Hold the phone steady and avoid blurred images.
              </Text>
            </View>
          </View>
        </View>

        <View style={s.card}>
          <StepHeader
            number="02"
            title="Storage conditions"
            description="Enter the known storage environment."
            complete={conditionsReady}
          />

          <View style={s.presetRow}>
            {STORAGE_PRESETS.map(preset => {
              const selected = activePreset?.id === preset.id;

              return (
                <Pressable
                  key={preset.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Use ${preset.title} storage preset`}
                  accessibilityState={{selected, disabled}}
                  disabled={disabled}
                  onPress={() => applyPreset(preset)}
                  style={({pressed}) => [
                    s.preset,
                    selected ? s.presetSelected : null,
                    pressed ? s.pressed : null,
                    disabled ? s.disabled : null,
                  ]}>
                  <Ionicons
                    name={preset.icon}
                    size={14}
                    color={
                      selected ? colors.primary : colors.muted
                    }
                  />
                  <Text
                    style={[
                      s.presetText,
                      selected ? s.presetTextSelected : null,
                    ]}>
                    {preset.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={s.fields}>
            {FIELDS.map(field => {
              const isDays = field.key === 'days';
              const isFocused = focusedField === field.key;
              const status = getFieldStatus(field.key);
              const hasError = status === 'invalid';

              return (
                <View
                  key={field.key}
                  style={isDays ? s.fullField : s.halfField}>
                  <View style={s.fieldLabelRow}>
                    <Ionicons
                      name={field.icon}
                      size={14}
                      color={colors.primary}
                    />
                    <Text style={s.fieldLabel}>
                      {field.label}
                    </Text>
                  </View>

                  <View
                    style={[
                      s.inputWrapper,
                      isFocused ? s.inputFocused : null,
                      hasError ? s.inputError : null,
                      status === 'valid'
                        ? s.inputValid
                        : null,
                      disabled ? s.disabled : null,
                    ]}>
                    <TextInput
                      accessibilityLabel={`${field.label} in ${field.unit}`}
                      editable={!disabled}
                      value={context[field.key]}
                      onChangeText={value =>
                        updateContext(field.key, value)
                      }
                      onFocus={() =>
                        setFocusedField(field.key)
                      }
                      onBlur={() => setFocusedField(null)}
                      keyboardType={getKeyboardType(field.key)}
                      returnKeyType={isDays ? 'done' : 'next'}
                      onSubmitEditing={() => Keyboard.dismiss()}
                      autoCorrect={false}
                      autoCapitalize="none"
                      placeholder={field.placeholder}
                      placeholderTextColor={colors.faint}
                      selectionColor={colors.primary}
                      style={s.input}
                    />

                    <Text style={s.unit}>{field.unit}</Text>

                    {status === 'valid' ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={17}
                        color={colors.success}
                      />
                    ) : null}

                    {hasError ? (
                      <Ionicons
                        name="alert-circle"
                        size={17}
                        color={colors.danger}
                      />
                    ) : null}
                  </View>

                  <Text
                    style={[
                      s.fieldHint,
                      hasError ? s.fieldHintError : null,
                    ]}>
                    {hasError ? field.error : field.hint}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={s.card}>
          <StepHeader
            number="03"
            title="Packaging type"
            description="Select how this tomato is currently stored."
            complete={packagingReady}
          />

          <View style={s.packagingList}>
            {PACKAGING_OPTIONS.map(option => {
              const selected =
                context.packaging === option.value;

              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="radio"
                  accessibilityLabel={option.title}
                  accessibilityState={{
                    checked: selected,
                    disabled,
                  }}
                  disabled={disabled}
                  onPress={() =>
                    updateContext('packaging', option.value)
                  }
                  style={({pressed}) => [
                    s.packagingOption,
                    selected ? s.packagingSelected : null,
                    pressed ? s.pressed : null,
                    disabled ? s.disabled : null,
                  ]}>
                  <View
                    style={[
                      s.packagingIcon,
                      selected
                        ? s.packagingIconSelected
                        : null,
                    ]}>
                    <Ionicons
                      name={option.icon}
                      size={19}
                      color={
                        selected
                          ? colors.primary
                          : colors.muted
                      }
                    />
                  </View>

                  <View style={s.packagingCopy}>
                    <Text style={s.packagingTitle}>
                      {option.title}
                    </Text>
                    <Text style={s.packagingDescription}>
                      {option.description}
                    </Text>
                  </View>

                  <View
                    style={[
                      s.radio,
                      selected ? s.radioSelected : null,
                    ]}>
                    {selected ? (
                      <View style={s.radioDot} />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={s.notice}>
          <View style={s.noticeHeader}>
            <View style={s.noticeIcon}>
              <Ionicons
                name="information-circle-outline"
                size={17}
                color="#776D49"
              />
            </View>

            <Text style={s.noticeTitle}>Demo assessment</Text>
          </View>

          <Text style={s.noticeText}>
            Results use storage-context heuristics. The selected image
            is validated for upload but is not yet analyzed by a trained
            AI model. Results do not certify food safety.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            busy
              ? 'Generating demo assessment'
              : 'Run demo assessment'
          }
          accessibilityState={{disabled, busy}}
          disabled={!canSubmit}
          onPress={submitAssessment}
          style={({pressed}) => [
            s.submitButton,
            pressed && canSubmit ? s.pressed : null,
            !canSubmit ? s.disabled : null,
          ]}>
          {busy ? (
            <ActivityIndicator
              color={colors.primaryDark}
              size="small"
            />
          ) : (
            <Ionicons
              name="analytics-outline"
              size={20}
              color={colors.primaryDark}
            />
          )}

          <Text style={s.submitText}>
            {busy ? 'Assessing…' : 'Run demo assessment'}
          </Text>

          {!busy ? (
            <Ionicons
              name="arrow-forward"
              size={18}
              color={colors.primaryDark}
            />
          ) : null}
        </Pressable>

        <Text style={s.footer}>
          Tomato-only prototype · Images are not permanently stored
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
  brandCopy: {
    minWidth: 0,
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
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minHeight: 34,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  clearButtonText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  progressChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  progressChipText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  progressRail: {
    height: 3,
    backgroundColor: colors.surfaceMuted,
  },
  progressRailFill: {
    height: '100%',
    backgroundColor: colors.primary,
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
  intro: {
    paddingTop: 2,
  },
  heading: {
    ...typography.display,
    color: colors.ink,
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 17,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 17,
  },
  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberComplete: {
    backgroundColor: colors.success,
  },
  stepNumberText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  stepCopy: {
    flex: 1,
    minWidth: 0,
  },
  stepTitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  stepTitle: {
    ...typography.heading,
    color: colors.ink,
  },
  stepDescription: {
    ...typography.caption,
    color: colors.muted,
    marginTop: 3,
  },
  requiredBadge: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.warningSoft,
  },
  requiredBadgeText: {
    color: colors.warning,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  uploadArea: {
    minHeight: 210,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceMuted,
  },
  uploadIcon: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    marginBottom: 13,
  },
  uploadTitle: {
    ...typography.label,
    color: colors.ink,
    textAlign: 'center',
  },
  uploadDescription: {
    ...typography.caption,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 5,
  },
  uploadHint: {
    ...typography.overline,
    color: colors.faint,
    textAlign: 'center',
    marginTop: 15,
  },
  preview: {
    height: 235,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.overlay,
  },
  previewBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  previewBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    ...shadow.subtle,
  },
  photoMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 11,
    paddingVertical: 9,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metadataText: {
    ...typography.caption,
    color: colors.muted,
  },
  metadataDivider: {
    width: 1,
    height: 13,
    backgroundColor: colors.divider,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  photoButton: {
    flex: 1,
    minHeight: layout.touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: radius.md,
    paddingHorizontal: 10,
  },
  cameraButton: {
    backgroundColor: colors.primarySoft,
  },
  galleryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cameraButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  galleryButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },
  loadingText: {
    ...typography.caption,
    color: colors.muted,
  },
  tipsCard: {
    padding: 15,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    backgroundColor: colors.primarySoft,
    ...shadow.card,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 13,
  },
  tipsIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  tipsCopy: {
    flex: 1,
    minWidth: 0,
  },
  tipsTitle: {
    ...typography.label,
    color: colors.ink,
  },
  tipsDescription: {
    ...typography.caption,
    color: colors.muted,
    marginTop: 3,
  },
  tipsList: {
    gap: 9,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    flex: 1,
    minWidth: 0,
    ...typography.caption,
    lineHeight: 17,
    color: colors.text,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  preset: {
    flex: 1,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  presetSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  presetText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  presetTextSelected: {
    color: colors.primary,
    fontWeight: '800',
  },
  fields: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },
  halfField: {
    width: '47%',
  },
  fullField: {
    width: '100%',
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.text,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 13,
    gap: 7,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  inputValid: {
    borderColor: colors.success,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
    paddingVertical: 12,
  },
  unit: {
    ...typography.label,
    color: colors.muted,
  },
  fieldHint: {
    ...typography.overline,
    color: colors.faint,
    marginTop: 6,
  },
  fieldHintError: {
    color: colors.danger,
  },
  packagingList: {
    gap: 10,
  },
  packagingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 72,
    padding: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  packagingSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  packagingIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  packagingIconSelected: {
    backgroundColor: colors.white,
  },
  packagingCopy: {
    flex: 1,
    minWidth: 0,
  },
  packagingTitle: {
    ...typography.label,
    color: colors.ink,
  },
  packagingDescription: {
    ...typography.caption,
    color: colors.muted,
    marginTop: 3,
  },
  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  notice: {
    padding: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#E9E4D4',
    backgroundColor: '#F4F1E7',
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 9,
  },
  noticeIcon: {
    width: 27,
    height: 27,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAE3D1',
  },
  noticeTitle: {
    ...typography.label,
    color: '#696147',
  },
  noticeText: {
    ...typography.caption,
    lineHeight: 17,
    color: '#79745F',
  },
  submitButton: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 11,
    paddingHorizontal: 20,
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
    ...shadow.raised,
  },
  submitText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '800',
  },
  footer: {
    ...typography.overline,
    color: colors.faint,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.52,
  },
});