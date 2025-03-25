import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    startDetection(): Promise<string>;
    stopDetection(): Promise<string>;
    isAvailable(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
    'NativeAccelerometer',
);