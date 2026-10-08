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

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 20_000_000;

const SUPPORTED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const PACKAGING_OPTIONS = [
  {
    value: 'open_crate',
    title: 'Open crate',
    description: 'Uncovered storage',
    symbol: '▤',
  },
  {
    value: 'sealed_bag',
    title: 'Sealed bag',
    description: 'Closed packaging',
    symbol: '▣',
  },
  {
    value: 'ventilated_box',
    title: 'Ventilated box',
    description: 'Airflow openings',
    symbol: '▦',
  },
] as const;

const FIELDS: {
  key: NumericField;
  label: string;
  unit: string;
  hint: string;
  placeholder: string;
}[] = [
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
    hint: 'Whole days since storage began',
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
    return 'Choose a JPEG, PNG or WebP image. The current backend does not support HEIC/HEIF.';
  }
  // Missing metadata is allowed here.
  // The backend must still validate the actual uploaded bytes.
  return null;
}

function SectionHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <View style={s.sectionHeader}>
      <View style={s.step}>
        <Text style={s.stepText}>{number}</Text>
      </View>

      <View style={s.sectionCopy}>
        <Text style={s.sectionTitle}>{title}</Text>
        <Text style={s.sectionSubtitle}>{description}</Text>
      </View>
    </View>
  );
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

  async function choose(camera: boolean) {
    if (operationLocked.current) return;

    operationLocked.current = true;
    setPicking(true);
    Keyboard.dismiss();

    try {
      if (camera) {
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

      const response = camera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (response.canceled) return;

      const selectedImage = response.assets?.[0];

      if (!selectedImage) {
        Alert.alert(
          'No image returned',
          'Please select your tomato photo again.',
        );
        return;
      }

      const error = validateImage(selectedImage);

      if (error) {
        Alert.alert('Check your image', error);
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

  async function submit() {
    if (operationLocked.current) return;

    if (!asset) {
      Alert.alert(
        'Add a tomato photo',
        'Take a photo or choose one from your gallery.',
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
        'Check temperature',
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
        'Check humidity',
        'Enter a humidity percentage from 0 to 100.',
      );
      return;
    }

    if (!/^\d+$/.test(daysText)) {
      Alert.alert(
        'Check storage duration',
        'Enter a whole number of days from 0 to 365.',
      );
      return;
    }

    const days = Number(daysText);

    if (!Number.isSafeInteger(days) || days > 365) {
      Alert.alert(
        'Check storage duration',
        'Enter a whole number of days from 0 to 365.',
      );
      return;
    }

    if (
      !PACKAGING_OPTIONS.some(
        option => option.value === context.packaging,
      )
    ) {
      Alert.alert(
        'Choose packaging',
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

    let assessment: Assessment;

    try {
      assessment = await predict(asset, requestContext);
    } catch (error: unknown) {
      Alert.alert(
        'Unable to assess',
        error instanceof Error
          ? error.message
          : 'Check your connection and try again.',
      );
      return;
    } finally {
      operationLocked.current = false;
      setBusy(false);
    }

    onResult(assessment);
  }

  return (
    <View style={s.container}>
      <View>
        <View style={s.badge}>
          <View style={s.badgeDot} />
          <Text style={s.badgeText}>TOMATO ASSESSMENT</Text>
        </View>

        <Text style={s.heading}>
          A clearer picture{'\n'}of your produce.
        </Text>

        <Text style={s.subtitle}>
          Add a photo and storage details to start your assessment.
        </Text>
      </View>

      <View style={s.card}>
        <SectionHeader
          number="01"
          title="Produce photo"
          description="Choose a clear image of your tomato."
        />

        {asset ? (
          <View style={s.preview}>
            <Image
              source={{uri: asset.uri}}
              style={s.previewImage}
              resizeMode="cover"
              accessibilityLabel="Selected tomato photo"
            />

            <View style={s.previewLabel}>
              <Text style={s.previewLabelText}>Photo selected</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remove selected photo"
              accessibilityState={{disabled}}
              disabled={disabled}
              onPress={() => setAsset(null)}
              hitSlop={8}
              style={({pressed}) => [
                s.removeButton,
                pressed && s.pressed,
                disabled && s.disabled,
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
            onPress={() => choose(false)}
            style={({pressed}) => [
              s.uploadArea,
              pressed && s.pressed,
              disabled && s.disabled,
            ]}>
            <View style={s.uploadIcon}>
              <Text style={s.uploadIconText}>＋</Text>
            </View>

            <Text style={s.uploadTitle}>Add your tomato photo</Text>
            <Text style={s.uploadDescription}>
              Tap to browse your gallery
            </Text>
            <Text style={s.uploadHint}>
              JPEG, PNG or WebP · Maximum 5 MB
            </Text>
          </Pressable>
        )}

        <View style={s.photoActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{disabled}}
            disabled={disabled}
            onPress={() => choose(true)}
            style={({pressed}) => [
              s.photoButton,
              s.cameraButton,
              pressed && s.pressed,
              disabled && s.disabled,
            ]}>
            <Text style={s.cameraText}>Take photo</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{disabled}}
            disabled={disabled}
            onPress={() => choose(false)}
            style={({pressed}) => [
              s.photoButton,
              s.galleryButton,
              pressed && s.pressed,
              disabled && s.disabled,
            ]}>
            <Text style={s.galleryText}>
              {asset ? 'Replace photo' : 'Choose image'}
            </Text>
          </Pressable>
        </View>

        {picking && (
          <View style={s.loadingRow}>
            <ActivityIndicator color="#1C6846" />
            <Text style={s.loadingText}>Opening image picker…</Text>
          </View>
        )}
      </View>

      <View style={s.card}>
        <SectionHeader
          number="02"
          title="Storage conditions"
          description="Enter the conditions for this produce."
        />

        <View style={s.fields}>
          {FIELDS.map(field => (
            <View
              key={field.key}
              style={
                field.key === 'days'
                  ? s.fullField
                  : s.halfField
              }>
              <Text style={s.fieldLabel}>{field.label}</Text>

              <View
                style={[
                  s.inputWrapper,
                  focusedField === field.key && s.inputFocused,
                  disabled && s.disabled,
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
                  keyboardType={
                    field.key === 'days'
                      ? 'number-pad'
                      : field.key === 'temperature'
                        ? Platform.OS === 'ios'
                          ? 'numbers-and-punctuation'
                          : 'numeric'
                        : 'decimal-pad'
                  }
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
          ))}
        </View>
      </View>

      <View style={s.card}>
        <SectionHeader
          number="03"
          title="Packaging type"
          description="Select how the tomato is stored."
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
                  selected && s.packagingSelected,
                  pressed && s.pressed,
                  disabled && s.disabled,
                ]}>
                <View
                  style={[
                    s.packagingIcon,
                    selected && s.packagingIconSelected,
                  ]}>
                  <Text style={s.packagingSymbol}>
                    {option.symbol}
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
                    selected && s.radioSelected,
                  ]}>
                  {selected && <View style={s.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={s.notice}>
        <Text style={s.noticeTitle}>Demo assessment</Text>
        <Text style={s.noticeText}>
          The current demo uses storage-context heuristics.
          Images are validated but not analyzed by a trained AI model.
          Packaging does not affect demo scoring.
          Results do not certify food safety.
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          busy ? 'Generating demo assessment' : 'Run demo assessment'
        }
        accessibilityState={{disabled, busy}}
        disabled={disabled}
        onPress={submit}
        style={({pressed}) => [
          s.submitButton,
          pressed && s.pressed,
          disabled && s.disabled,
        ]}>
        {busy ? (
          <>
            <ActivityIndicator color="#FFFFFF" />
            <Text style={s.submitText}>Assessing…</Text>
          </>
        ) : (
          <>
            <Text style={s.submitText}>Run demo assessment</Text>
            <Text style={s.submitArrow}>→</Text>
          </>
        )}
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
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
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
    color: '#65776B',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3EBE5',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38734F',
  },
  sectionCopy: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#203D2D',
  },
  sectionSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    color: '#687D6E',
    marginTop: 3,
  },
  uploadArea: {
    minHeight: 190,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#BFD5C6',
    borderRadius: 16,
    backgroundColor: '#F7FAF7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  uploadIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: '#E5F0E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadIconText: {
    color: '#26744E',
    fontSize: 30,
    lineHeight: 36,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#33563F',
    textAlign: 'center',
  },
  uploadDescription: {
    fontSize: 12,
    color: '#6D8273',
    marginTop: 5,
  },
  uploadHint: {
    fontSize: 10,
    color: '#718476',
    marginTop: 14,
    textAlign: 'center',
  },
  preview: {
    height: 225,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#EEF3EE',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewLabel: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(23,60,42,0.85)',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },
  previewLabelText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    fontSize: 25,
    color: '#31513C',
    lineHeight: 28,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  photoButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    backgroundColor: '#EAF3EC',
  },
  galleryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE7DF',
  },
  cameraText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#21623F',
  },
  galleryText: {
    fontSize: 12,
    fontWeight: '600',
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
    fontWeight: '600',
    color: '#526A59',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: '#F8FAF8',
    borderWidth: 1,
    borderColor: '#E1E9E2',
    paddingHorizontal: 12,
  },
  inputFocused: {
    borderColor: '#388557',
    backgroundColor: '#F3F9F4',
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 18,
    fontWeight: '600',
    color: '#244A32',
    paddingVertical: 12,
  },
  unit: {
    fontSize: 12,
    color: '#6C8172',
    marginLeft: 6,
  },
  fieldHint: {
    fontSize: 10,
    lineHeight: 15,
    color: '#748678',
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
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5EBE6',
    backgroundColor: '#FFFFFF',
  },
  packagingSelected: {
    backgroundColor: '#F1F8F2',
    borderColor: '#74A785',
  },
  packagingIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: '#F3F6F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  packagingIconSelected: {
    backgroundColor: '#E0EFE4',
  },
  packagingSymbol: {
    fontSize: 23,
    color: '#477353',
  },
  packagingCopy: {
    flex: 1,
  },
  packagingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#34543F',
  },
  packagingDescription: {
    fontSize: 11,
    lineHeight: 16,
    color: '#718577',
    marginTop: 3,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CCD8CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#2C7C4E',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2C7C4E',
  },
  notice: {
    backgroundColor: '#EEF3EF',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#A0BCA8',
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#526D5B',
    marginBottom: 5,
  },
  noticeText: {
    fontSize: 11,
    lineHeight: 17,
    color: '#657C6D',
  },
  submitButton: {
    minHeight: 56,
    backgroundColor: '#1C6846',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  submitText: {
    fontSize: 15,
    fontWeight: '700',
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
    color: '#718577',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.55,
  },
});