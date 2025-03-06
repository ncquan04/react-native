import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    startMusic(): void;
    stopMusic(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
    'NativeMusicPlayer',
);