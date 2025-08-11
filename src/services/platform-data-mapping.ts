import type { PlatformDataMapping } from '../types/fedcampus-2.0-client-interfaces';

export const platformDataMapping: PlatformDataMapping = {
    android: {
        steps: 'DT_CONTINUOUS_STEPS_DELTA',
        distances: 'DT_CONTINUOUS_DISTANCE_DELTA',
        flight_climbed: 'DT_CONTINUOUS_STEPS_DELTA',
        active_calories: 'DT_CONTINUOUS_CALORIES_BURNT',
        sleep_duration: 'DT_HEALTH_RECORD_SLEEP',
        heart_rate: 'DT_INSTANTANEOUS_HEART_RATE',
        stress_level: 'DT_INSTANTANEOUS_STRESS',
    },
    ios: {
        steps: 'HealthDataType.STEPS',
        distances: 'HealthDataType.DISTANCE_WALKING_RUNNING',
        active_calories: 'HealthDataType.ACTIVE_ENERGY_BURNED',
        sleep_duration: 'HealthDataType.SLEEP_ASLEEP',
        heart_rate: 'HealthDataType.HEART_RATE',
    }
};
