import * as Location from 'expo-location';

/**
 * Request location permission if not already granted
 */
export async function requestLocationPermission() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('❌ Error requesting location permission:', error);
    return false;
  }
}

/**
 * Get current device location (latitude & longitude)
 * @returns {Promise<{latitude: number, longitude: number} | null>}
 */
export async function getCurrentLocation() {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      console.warn('⚠️ Location permission not granted');
      const granted = await requestLocationPermission();
      if (!granted) {
        console.warn('⚠️ User denied location permission');
        return null;
      }
    }

    console.log('📍 Getting current location...');
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = location.coords;
    console.log(`✅ Location acquired: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);

    return {
      latitude: parseFloat(latitude.toFixed(6)),
      longitude: parseFloat(longitude.toFixed(6)),
    };
  } catch (error) {
    console.error('❌ Error getting location:', error.message);
    return null;
  }
}

/**
 * Get location and return with timestamp
 * @returns {Promise<{latitude: number, longitude: number, timestamp: number} | null>}
 */
export async function getLocationWithTimestamp() {
  const location = await getCurrentLocation();
  if (location) {
    return {
      ...location,
      timestamp: Date.now(),
    };
  }
  return null;
}
