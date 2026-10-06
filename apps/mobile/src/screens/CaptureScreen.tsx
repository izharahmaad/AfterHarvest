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

function parseDecimal(value: string): number | null {
  // Accept an ordinary decimal and an optional leading minus.
  // Reject blank values, scientific notation and hexadecimal input.
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
    return 'This image could not be opened. Please choose another photo.';
  }

  if (
    typeof image.fileSize === 'number' &&
    image.fileSize > MAX_IMAGE_BYTES
  ) {
    return 'Choose an image smaller than 5 MB.';
  }

  if (
    image.width > 0 &&
    image.height > 0 &&
    image.width * image.height > MAX_IMAGE_PIXELS
  ) {
    return 'Choose a smaller image with no more than 20 megapixels.';
  }

  const mimeType = image.mimeType
    ?.toLowerCase()
    .split(';')[0]
    .trim();

  if (mimeType && !SUPPORTED_MIME_TYPES.has(mimeType)) {
    return 'Choose a JPEG, PNG or WebP image. HEIC/HEIF images are not supported by the current backend.';
  }

  // Missing metadata does not establish that an image is valid.
  // The backend remains responsible for validating uploaded bytes.
  return null;
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

  // A ref blocks a second tap immediately, before React re-renders.
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
              : 'Camera access is disabled. Enable it in your device settings or choose an image from your gallery.',
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

      const imageError = validateImage(selectedImage);

      if (imageError) {
        Alert.alert('Unsupported image', imageError);
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
        'Enter storage days as a whole number from 0 to 365.',
      );
      return;
    }

    const days = Number(daysText);

    if (!Number.isSafeInteger(days) || days > 365) {
      Alert.alert(
        'Check storage duration',
        'Enter storage days as a whole number from 0 to 365.',
      );
      return;
    }

    const validPackaging = PACKAGING_OPTIONS.some(
      option => option.value === context.packaging,
    );

    if (!validPackaging) {
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

    // Keep navigation outside the API error handler.
    onResult(assessment);
  }
}