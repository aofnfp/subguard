import { Platform } from 'react-native';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Production ad unit IDs — replace with real IDs from AdMob console
const PRODUCTION_ADS = {
  BANNER: Platform.select({
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
    default: '',
  }),
  INTERSTITIAL: Platform.select({
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
    default: '',
  }),
};

const INTERSTITIAL_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : (PRODUCTION_ADS.INTERSTITIAL ?? TestIds.INTERSTITIAL);

export const BANNER_ID = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : (PRODUCTION_ADS.BANNER ?? TestIds.ADAPTIVE_BANNER);

let interstitial: InterstitialAd | null = null;
let isInterstitialLoaded = false;

export function preloadInterstitial(): void {
  if (Platform.OS === 'web' || !INTERSTITIAL_ID) return;

  interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_ID, {
    requestNonPersonalizedAdsOnly: true,
  });

  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    isInterstitialLoaded = true;
  });

  interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    isInterstitialLoaded = false;
    preloadInterstitial();
  });

  interstitial.addAdEventListener(AdEventType.ERROR, () => {
    isInterstitialLoaded = false;
  });

  interstitial.load();
}

export async function showInterstitial(): Promise<boolean> {
  if (!isInterstitialLoaded || !interstitial) return false;
  try {
    await interstitial.show();
    isInterstitialLoaded = false;
    return true;
  } catch {
    return false;
  }
}
