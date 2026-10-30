import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import {predict} from '../services/api';
import type {Assessment, Context} from '../types/assessment';

type Props = {
  onResult: (result: Assessment) => void;
};

type NumericField = 'temperature' | 'humidity' | 'days';

type PackagingOption = {
  value: Context['packaging'];
  title: string;
  description: string;
  badge: string;
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
    badge: 'OPEN',
  },
  {
    value: 'sealed_bag',
    title: 'Sealed bag',
    description: 'Closed packaging',
    badge: 'SEALED',
  },
  {
    value: 'ventilated_box',
    title: 'Ventilated box',
    description: 'Airflow openings',
    badge: 'AIRFLOW',
  },
];

const FIELDS: Array<{
  key: NumericField;
  label: string;
  unit: string;
  hint: string;
  placeholder: string;
}> = [
  {
    key: 'temperature',
    label: 'Temperature',
    unit: '°C',
    hint: '−20 to 60°C',
    placeholder: '8.5',
  },
  {
    key: 'humidity',
    label: 'Humidity',
    unit: '%',
    hint: '0 to 100%',
    placeholder: '72',
  },
  {
    key: 'days',
    label: 'Storage duration',
    unit: 'days',
    hint: 'Whole days from 0 to 365',
    placeholder: '4',
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

function StepHeader({
  number,
  title,
  description,
  required = false,
}: {
  number: string;
  title: string;
  description: string;
  required?: boolean;
}) {
  return (
    <View style={s.stepHeader}>
      <View style={s.stepNumber}>
        <Text style={s.stepNumberText}>{number}</Text>
      </View>

      <View style={s.stepHeaderCopy}>
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

  function updateContext(key: keyof Context, value: string) {
    setContext(previous => ({
      ...previous,
      [key]: value,
    }));
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
    if (operationLocked.current) return;

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

    const temperature = parseDecimal(context.temperature);
    const humidity = parseDecimal(context.humidity);
    const daysText = context.days.trim();

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

    if (
      humidity === null ||
      humidity < 0 ||
      humidity > 100
    ) {
      Alert.alert(
        'Invalid humidity',
        'Enter humidity from 0 to 100%.',
      );
      return;
    }

    if (!/^\d+$/.test(daysText)) {
      Alert.alert(
        'Invalid storage duration',
        'Enter a whole number from 0 to 365.',
      );
      return;
    }

    const days = Number(daysText);

    if (!Number.isSafeInteger(days) || days > 365) {
      Alert.alert(
        'Invalid storage duration',
        'Enter a whole number from 0 to 365.',
      );
      return;
    }

    const packagingIsValid = PACKAGING_OPTIONS.some(
      option => option.value === context.packaging,
    );

    if (!packagingIsValid) {
      Alert.alert(
        'Packaging required',
        'Select one of the available packaging types.',
      );
      return;
    }

    const requestContext: Context = {
      temperature: String(temperature),
      humidity: String(humidity),
      days: String(days),
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

  return (
    <View style={s.container}>
      <View style={s.intro}>
        <View style={s.eyebrow}>
          <View style={s.eyebrowDot} />
          <Text style={s.eyebrowText}>TOMATO ASSESSMENT</Text>
        </View>

        <Text style={s.heading}>
          Assess quality{'\n'}with context.
        </Text>

        <Text style={s.subtitle}>
          Add a clear photo and the storage conditions for this
          tomato batch.
        </Text>
      </View>

      <View style={s.progressCard}>
        <View style={s.progressCopy}>
          <Text style={s.progressTitle}>Assessment checklist</Text>
          <Text style={s.progressDescription}>
            Complete three short steps to get a transparent demo
            result.
          </Text>
        </View>

        <Text style={s.progressValue}>3 STEPS</Text>
      </View>

      <View style={s.card}>
        <StepHeader
          number="01"
          title="Produce photo"
          description="Use one clear image of the tomato."
          required
        />

        {asset ? (
          <View style={s.preview}>
            <Image
              source={{uri: asset.uri}}
              style={s.previewImage}
              resizeMode="cover"
              accessibilityLabel="Selected tomato photo"
            />

            <View style={s.previewOverlay}>
              <View style={s.photoReadyBadge}>
                <View style={s.photoReadyDot} />
                <Text style={s.photoReadyText}>PHOTO READY</Text>
              </View>
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
              <Text style={s.removeText}>×</Text>
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
              <Text style={s.uploadIconText}>+</Text>
            </View>

            <Text style={s.uploadTitle}>Add a tomato photo</Text>

            <Text style={s.uploadDescription}>
              Tap here to choose an image from your gallery.
            </Text>

            <Text style={s.uploadHint}>
              JPEG, PNG or WebP · Maximum 5 MB
            </Text>
          </Pressable>
        )}

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
            <Text style={s.cameraButtonText}>Take photo</Text>
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
            <Text style={s.galleryButtonText}>
              {asset ? 'Replace photo' : 'Choose image'}
            </Text>
          </Pressable>
        </View>

        {picking ? (
          <View style={s.loadingRow}>
            <ActivityIndicator color="#1C6846" size="small" />
            <Text style={s.loadingText}>Opening image picker…</Text>
          </View>
        ) : null}
      </View>

      <View style={s.card}>
        <StepHeader
          number="02"
          title="Storage conditions"
          description="Enter the known storage environment."
        />

        <View style={s.fields}>
          {FIELDS.map(field => {
            const isDays = field.key === 'days';
            const isFocused = focusedField === field.key;

            return (
              <View
                key={field.key}
                style={isDays ? s.fullField : s.halfField}>
                <Text style={s.fieldLabel}>{field.label}</Text>

                <View
                  style={[
                    s.inputWrapper,
                    isFocused ? s.inputFocused : null,
                    disabled ? s.disabled : null,
                  ]}>
                  <TextInput
                    accessibilityLabel={`${field.label} in ${field.unit}`}
                    editable={!disabled}
                    value={context[field.key]}
                    onChangeText={value =>
                      updateContext(field.key, value)
                    }
                    onFocus={() => setFocusedField(field.key)}
                    onBlur={() => setFocusedField(null)}
                    keyboardType={getKeyboardType(field.key)}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder={field.placeholder}
                    placeholderTextColor="#94A298"
                    selectionColor="#26744E"
                    style={s.input}
                  />

                  <Text style={s.unit}>{field.unit}</Text>
                </View>

                <Text style={s.fieldHint}>{field.hint}</Text>
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
        />

        <View style={s.packagingList}>
          {PACKAGING_OPTIONS.map(option => {
            const selected = context.packaging === option.value;

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
                    s.packagingBadge,
                    selected ? s.packagingBadgeSelected : null,
                  ]}>
                  <Text
                    style={[
                      s.packagingBadgeText,
                      selected
                        ? s.packagingBadgeTextSelected
                        : null,
                    ]}>
                    {option.badge}
                  </Text>
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
                  {selected ? <View style={s.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={s.notice}>
        <View style={s.noticeHeader}>
          <View style={s.noticeIcon}>
            <Text style={s.noticeIconText}>i</Text>
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
          busy ? 'Generating demo assessment' : 'Run demo assessment'
        }
        accessibilityState={{disabled, busy}}
        disabled={disabled}
        onPress={submitAssessment}
        style={({pressed}) => [
          s.submitButton,
          pressed ? s.pressed : null,
          disabled ? s.disabled : null,
        ]}>
        {busy ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : null}

        <Text style={s.submitText}>
          {busy ? 'Assessing…' : 'Run demo assessment'}
        </Text>

        {!busy ? <Text style={s.submitArrow}>→</Text> : null}
      </Pressable>

      <Text style={s.footer}>
        Tomato-only prototype · Images are not permanently stored
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
  intro: {
    marginBottom: 2,
  },
  eyebrow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#E8F2EB',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#26744E',
  },
  eyebrowText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: '#26744E',
  },
  heading: {
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: '#173C2A',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#64796B',
    marginTop: 10,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#EEF6F0',
    borderWidth: 1,
    borderColor: '#DAEBDD',
  },
  progressCopy: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2D6242',
  },
  progressDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: '#6E8876',
    marginTop: 4,
  },
  progressValue: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#3C8057',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2EBE4',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 18,
  },
  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#EEF5EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#36764D',
  },
  stepHeaderCopy: {
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
    fontSize: 16,
    fontWeight: '700',
    color: '#203D2D',
  },
  stepDescription: {
    fontSize: 11,
    lineHeight: 16,
    color: '#6D8273',
    marginTop: 3,
  },
  requiredBadge: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F8EEE8',
  },
  requiredBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: '#A25647',
  },
  uploadArea: {
    minHeight: 202,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#BFD5C6',
    borderRadius: 18,
    backgroundColor: '#F8FBF8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  uploadIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#E1EFE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  uploadIconText: {
    color: '#26744E',
    fontSize: 29,
    lineHeight: 33,
    fontWeight: '400',
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#31563E',
    textAlign: 'center',
  },
  uploadDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6B8072',
    textAlign: 'center',
    marginTop: 5,
  },
  uploadHint: {
    fontSize: 10,
    color: '#829589',
    marginTop: 15,
    textAlign: 'center',
  },
  preview: {
    height: 230,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#EEF3EE',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  photoReadyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(24, 78, 53, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },
  photoReadyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A9D9B1',
  },
  photoReadyText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    fontSize: 25,
    lineHeight: 28,
    color: '#31513C',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  photoButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 13,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    backgroundColor: '#EAF4ED',
  },
  galleryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7E4DA',
  },
  cameraButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1C6642',
  },
  galleryButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#536D5C',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },
  loadingText: {
    fontSize: 11,
    color: '#647B6B',
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
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#496555',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: '#FAFCFA',
    borderWidth: 1,
    borderColor: '#DCE7DE',
    paddingHorizontal: 13,
  },
  inputFocused: {
    borderColor: '#2E7C50',
    backgroundColor: '#F4FAF5',
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 18,
    fontWeight: '700',
    color: '#244A32',
    paddingVertical: 12,
  },
  unit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718577',
    marginLeft: 6,
  },
  fieldHint: {
    fontSize: 10,
    lineHeight: 15,
    color: '#7B8D80',
    marginTop: 6,
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
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E2EAE3',
    backgroundColor: '#FFFFFF',
  },
  packagingSelected: {
    backgroundColor: '#F1F8F2',
    borderColor: '#71A685',
  },
  packagingBadge: {
    minWidth: 48,
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F0F4F1',
    alignItems: 'center',
  },
  packagingBadgeSelected: {
    backgroundColor: '#DDEDE1',
  },
  packagingBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#69806F',
  },
  packagingBadgeTextSelected: {
    color: '#36764D',
  },
  packagingCopy: {
    flex: 1,
    minWidth: 0,
  },
  packagingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#34543F',
  },
  packagingDescription: {
    fontSize: 11,
    lineHeight: 16,
    color: '#748679',
    marginTop: 3,
  },
  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#C6D4C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#2C7C4E',
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#2C7C4E',
  },
  notice: {
    padding: 16,
    borderRadius: 17,
    backgroundColor: '#F4F0E7',
    borderWidth: 1,
    borderColor: '#E9E1CF',
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 9,
  },
  noticeIcon: {
    width: 23,
    height: 23,
    borderRadius: 7,
    backgroundColor: '#EAE2CF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeIconText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#89784E',
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7D704E',
  },
  noticeText: {
    fontSize: 11,
    lineHeight: 18,
    color: '#8B8064',
  },
  submitButton: {
    minHeight: 58,
    backgroundColor: '#1B6A45',
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  submitText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  submitArrow: {
    fontSize: 22,
    color: '#D8EBDD',
  },
  footer: {
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    color: '#7E9083',
    paddingHorizontal: 8,
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.52,
  },
});