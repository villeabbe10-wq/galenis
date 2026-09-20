import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapApp } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

/**
 * Initializes mobile native features (StatusBar, Splash, Hardware Back Button)
 */
export async function initNativeMobileBridge(onHardwareBackPress?: () => boolean | void) {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // 1. Status Bar Setup
    await StatusBar.setStyle({ style: Style.Light });
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#006A4E' });
    }
  } catch (err) {
    console.warn('Native StatusBar init error:', err);
  }

  try {
    // 2. Hide Splash Screen cleanly after initialization
    await SplashScreen.hide();
  } catch (err) {
    console.warn('Native SplashScreen init error:', err);
  }

  try {
    // 3. Android Hardware Back Button listener
    CapApp.addListener('backButton', ({ canGoBack }) => {
      if (onHardwareBackPress) {
        const handled = onHardwareBackPress();
        if (handled) return;
      }

      if (canGoBack) {
        window.history.back();
      } else {
        CapApp.exitApp();
      }
    });
  } catch (err) {
    console.warn('Native BackButton listener error:', err);
  }
}

/**
 * Helper to trigger native haptic feedback on button clicks / actions
 */
export async function triggerHaptic(style: ImpactStyle = ImpactStyle.Light) {
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.impact({ style });
    } catch {
      // Ignore if not supported on web/simulator
    }
  }
}
