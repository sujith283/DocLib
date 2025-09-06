let _latestCaptureUri: string | undefined;

export function setLatestCapture(uri: string | undefined) {
  _latestCaptureUri = uri;
}

export function getLatestCapture(): string | undefined {
  return _latestCaptureUri;
}
