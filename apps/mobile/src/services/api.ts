import type {Assessment, Context} from '../types/assessment';

const base = (
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
).replace(/\/$/, '');

type ImageAsset = {
  uri: string;
  mimeType?: string;
  fileName?: string | null;
};

type ReactNativeFilePart = {
  uri: string;
  name: string;
  type: string;
};

function createImagePart(asset: ImageAsset): ReactNativeFilePart {
  return {
    uri: asset.uri,
    name: asset.fileName || 'tomato.jpg',
    type: asset.mimeType || 'image/jpeg',
  };
}

export async function predict(
  asset: ImageAsset,
  context: Context,
): Promise<Assessment> {
  if (!asset.uri) {
    throw new Error('No image was selected.');
  }

  const data = new FormData();

  data.append(
    'image',
    createImagePart(asset) as unknown as Blob,
  );

  data.append('produce_type', 'tomato');
  data.append('temperature', context.temperature);
  data.append('humidity', context.humidity);
  data.append('storage_days', context.days);
  data.append('packaging', context.packaging);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(
      `${base}/api/v1/quality/predict`,
      {
        method: 'POST',
        body: data,
        signal: controller.signal,
      },
    );

    const body = await response.json();

    if (!response.ok) {
      throw new Error(
        typeof body.detail === 'string'
          ? body.detail
          : 'Assessment failed. Check inputs.',
      );
    }

    return body as Assessment;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(
        `Could not reach the AfterHarvest API at ${base}. Check that the backend is running, your phone and PC are on the same Wi-Fi, and port 8000 is allowed through the firewall.`,
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}