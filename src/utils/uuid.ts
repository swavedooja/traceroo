import * as Crypto from 'expo-crypto';

export const generateUUID = async (): Promise<string> => {
  return await Crypto.randomUUID();
};

export const generateMultipleUUIDs = async (count: number): Promise<string[]> => {
  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    uuids.push(await generateUUID());
  }
  return uuids;
};