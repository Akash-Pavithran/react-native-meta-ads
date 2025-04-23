import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): number;
  add(a: number, b: number): Promise<number>;
  initialize(): Promise<{ success: boolean; message: string }>;
  isInitialized(): boolean;
}

export default TurboModuleRegistry.get<Spec>('MetaAds');
