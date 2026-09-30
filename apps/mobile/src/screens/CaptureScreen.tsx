import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import {predict} from '../services/api';
import {Assessment, Context} from '../types/assessment';

type Props = {
  onResult: (result: Assessment) => void;
};

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
];

export default function CaptureScreen({onResult}: Props) {
  const [asset, setAsset] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [busy, setBusy] = useState(false);
  const [picking, setPicking] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [context, setContext] = useState<Context>({
    temperature: '8.5',
    humidity: '72',
    days: '4',
    packaging: 'open_crate',
  });

  const disabled = busy || picking;

  function updateContext(key: keyof Context, value: string) {
    setContext(previous => ({
      ...previous,
      [key]: value,
    }));
  }

  async function choose(camera: boolean) {
    if (disabled) return;

    setPicking(true);

    try {
      if (camera) {
        const permission =
          await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            'Camera permission needed',
            'Allow camera access to photograph your tomato.',
          );
          return;
        }
      }

      const result = camera
        ? await ImagePicker.launchCameraAsync({
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
          });

      if (!result.canceled && result.assets[0]) {
        setAsset(result.assets[0]);
      }
    } catch (error) {
      Alert.alert(
        'Unable to open image',
        error instanceof Error
          ? error.message
          : 'Please try selecting your image again.',
      );
    } finally {
      setPicking(false);
    }
  }

  async function submit() {
    if (disabled) return;

    if (!asset) {
      Alert.alert(
        'Add a tomato photo',
        'Take a photo or choose one from your gallery.',
      );
      return;
    }

    const temperature = Number(context.temperature);
    const humidity = Number(context.humidity);
    const days = Number(context.days);

    const invalid =
      !context.temperature.trim() ||
      !context.humidity.trim() ||
      !context.days.trim() ||
      !Number.isFinite(temperature) ||
      temperature < -20 ||
      temperature > 60 ||
      !Number.isFinite(humidity) ||
      humidity < 0 ||
      humidity > 100 ||
      !Number.isInteger(days) ||
      days < 0 ||
      days > 365;

    if (invalid) {
      Alert.alert(
        'Check storage details',
        'Temperature: −20 to 60°C\nHumidity: 0–100%\nStorage days: a whole number from 0–365.',
      );
      return;
    }

    setBusy(true);

    try {
      const result = await predict(asset, context);
      onResult(result);
    } catch (error) {
      Alert.alert(
        'Unable to assess',
        error instanceof Error
          ? error.message
          : 'Check your connection and try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.badge}>
          <View style={s.badgeDot} />
          <Text style={s.badgeText}>TOMATO ASSESSMENT</Text>
        </View>

        <Text style={s.heading}>A clearer picture{'\n'}of your produce.</Text>

        <Text style={s.subtitle}>
          Add a photo and storage details to start your assessment.
        </Text>
      </View>

      {/* Photo section */}
      <View style={s.card}>
        <View style={s.sectionHeader}>
          <View style={s.step}>
            <Text style={s.stepText}>01</Text>
          </View>

          <View style={s.sectionCopy}>
            <Text style={s.sectionTitle}>Produce photo</Text>
            <Text style={s.sectionSubtitle}>
              Choose a clear image of your tomato.
            </Text>
          </View>

          <View style={s.smallBadge}>
            <Text style={s.smallBadgeText}>
              {asset ? 'Added' : 'Required'}
            </Text>
          </View>
        </View>

        {asset ? (
          <View style={s.preview}>
            <Image
              source={{uri: asset.uri}}
              style={s.previewImage}
              resizeMode="cover"
              accessibilityLabel="Selected tomato photo"
            />

            <View style={s.previewLabel}>
              <Text style={s.previewLabelText}>Photo ready</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remove selected photo"
              disabled={disabled}
              onPress={() => setAsset(null)}
              hitSlop={10}
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

            <Text style={s.uploadHint}>JPEG, PNG or WebP · Up to 5 MB</Text>
          </Pressable>
        )}

        <View style={s.photoActions}>
          <Pressable
            accessibilityRole="button"
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
          <ActivityIndicator
            color="#1C6846"
            style={s.pickerLoading}
          />
        )}
      </View>

      {/* Storage section */}
      <View style={s.card}>
        <View style={s.sectionHeader}>
          <View style={s.step}>
            <Text style={s.stepText}>02</Text>
          </View>

          <View style={s.sectionCopy}>
            <Text style={s.sectionTitle}>Storage conditions</Text>
            <Text style={s.sectionSubtitle}>
              Enter the conditions for this produce.
            </Text>
          </View>
        </View>

        <View style={s.fieldRow}>
          <View style={s.fieldHalf}>
            <Text style={s.fieldLabel}>Temperature</Text>

            <View
              style={[
                s.inputWrapper,
                focusedField === 'temperature' && s.inputFocused,
              ]}>
              <TextInput
                accessibilityLabel="Storage temperature in Celsius"
                editable={!disabled}
                value={context.temperature}
                onChangeText={value =>
                  updateContext('temperature', value)
                }
                onFocus={() => setFocusedField('temperature')}
                onBlur={() => setFocusedField(null)}
                keyboardType={
                  Platform.OS === 'ios'
                    ? 'numbers-and-punctuation'
                    : 'numeric'
                }
                placeholder="8.5"
                placeholderTextColor="#A1ADA5"
                style={s.input}
              />
              <Text style={s.unit}>°C</Text>
            </View>

            <Text style={s.fieldHint}>−20 to 60°C</Text>
          </View>

          <View style={s.fieldHalf}>
            <Text style={s.fieldLabel}>Humidity</Text>

            <View
              style={[
                s.inputWrapper,
                focusedField === 'humidity' && s.inputFocused,
              ]}>
              <TextInput
                accessibilityLabel="Storage humidity percentage"
                editable={!disabled}
                value={context.humidity}
                onChangeText={value =>
                  updateContext('humidity', value)
                }
                onFocus={() => setFocusedField('humidity')}
                onBlur={() => setFocusedField(null)}
                keyboardType="decimal-pad"
                placeholder="72"
                placeholderTextColor="#A1ADA5"
                style={s.input}
              />
              <Text style={s.unit}>%</Text>
            </View>

            <Text style={s.fieldHint}>0 to 100%</Text>
          </View>
        </View>

        <View style={s.durationField}>
          <Text style={s.fieldLabel}>Storage duration</Text>

          <View
            style={[
              s.inputWrapper,
              focusedField === 'days' && s.inputFocused,
            ]}>
            <TextInput
              accessibilityLabel="Number of storage days"
              editable={!disabled}
              value={context.days}
              onChangeText={value => updateContext('days', value)}
              onFocus={() => setFocusedField('days')}
              onBlur={() => setFocusedField(null)}
              keyboardType="number-pad"
              placeholder="4"
              placeholderTextColor="#A1ADA5"
              style={s.input}
            />
            <Text style={s.unit}>days</Text>
          </View>

          <Text style={s.fieldHint}>
            Whole days since storage began
          </Text>
        </View>
      </View>

      {/* Packaging section */}
      <View style={s.card}>
        <View style={s.sectionHeader}>
          <View style={s.step}>
            <Text style={s.stepText}>03</Text>
          </View>

          <View style={s.sectionCopy}>
            <Text style={s.sectionTitle}>Packaging type</Text>
            <Text style={s.sectionSubtitle}>
              Select how the tomato is stored.
            </Text>
          </View>
        </View>

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

      {/* Demo notice */}
      <View style={s.notice}>
        <Text style={s.noticeTitle}>Demo assessment</Text>
        <Text style={s.noticeText}>
          The current demo uses storage-context heuristics. Your image
          is validated, but not analyzed by a trained AI model.
          Results do not certify food safety.
        </Text>
      </View>

      {/* Main action */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={busy ? 'Analyzing quality' : 'Analyze quality'}
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
            <Text style={s.submitText}>Analyzing…</Text>
          </>
        ) : (
          <>
            <Text style={s.submitText}>Analyze quality</Text>
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
  header: {
    marginBottom: 2,
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
    color: '#718174',
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
    color: '#809084',
    marginTop: 3,
  },
  smallBadge: {
    backgroundColor: '#F2F6F3',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  smallBadgeText: {
    color: '#637B6A',
    fontSize: 10,
    fontWeight: '600',
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
    color: '#7C8E80',
    marginTop: 5,
  },
  uploadHint: {
    fontSize: 10,
    color: '#8B9B8F',
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
    width: 34,
    height: 34,
    borderRadius: 17,
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
  pickerLoading: {
    marginTop: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldHalf: {
    flex: 1,
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
    color: '#849487',
    marginLeft: 6,
  },
  fieldHint: {
    fontSize: 10,
    color: '#8D9B90',
    marginTop: 6,
  },
  durationField: {
    marginTop: 18,
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
    color: '#86958A',
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
    color: '#778A7C',
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
    fontSize: 16,
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
    color: '#91A095',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.55,
  },
});