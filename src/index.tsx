import MetaAds from './NativeMetaAds';

export async function multiply(a: number, b: number): Promise<number> {
  if (MetaAds) {
    const result = await MetaAds.add(a, b);
    console.log(result, '----');
    return result;
  }
  return 0;
}

export async function initialize(): Promise<{
  success: boolean;
  message: string;
}> {
  if (MetaAds) {
    return await MetaAds.initialize();
  }
  return { success: false, message: 'MetaAds module not available' };
}

export function isInitialized(): boolean {
  if (MetaAds) {
    return MetaAds.isInitialized();
  }
  return false;
}
