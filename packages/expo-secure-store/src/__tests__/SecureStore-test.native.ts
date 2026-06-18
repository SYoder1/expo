import ExpoSecureStore from '../ExpoSecureStore';
import * as SecureStore from '../SecureStore';

it(`sets values`, async () => {
  const testKey = 'key-test_0.0';
  const testValue = 'value `~!@#$%^&*();:\'"-_.,<>';
  const options = { keychainService: 'test' };
  await SecureStore.setItemAsync(testKey, testValue, options);

  expect(ExpoSecureStore.setValueWithKeyAsync).toHaveBeenCalledTimes(1);
  expect(ExpoSecureStore.setValueWithKeyAsync).toHaveBeenCalledWith(testValue, testKey, options);
});

it(`provides default options when setting values`, async () => {
  await SecureStore.setItemAsync('key', 'value');
  expect(ExpoSecureStore.setValueWithKeyAsync).toHaveBeenCalledWith('value', 'key', {});
});

it(`gets values`, async () => {
  ExpoSecureStore.getValueWithKeyAsync.mockImplementation(async () => 'value');

  const options = { keychainService: 'test' };
  const result = await SecureStore.getItemAsync('key', options);
  expect(result).toBe('value');
  expect(ExpoSecureStore.getValueWithKeyAsync).toHaveBeenCalledWith('key', options);
});

it(`deletes values`, async () => {
  const options = { keychainService: 'test' };
  await SecureStore.deleteItemAsync('key', options);
  expect(ExpoSecureStore.deleteValueWithKeyAsync).toHaveBeenCalledWith('key', options);
});

it(`has key`, async () => {
  ExpoSecureStore.hasValueWithKeyAsync.mockImplementation(async () => true);

  const options = { keychainService: 'test' };
  const result = await SecureStore.hasItemAsync('key', options);
  expect(result).toBe(true);
  expect(ExpoSecureStore.hasValueWithKeyAsync).toHaveBeenCalledWith('key', options);
});

it(`has key synchronously`, () => {
  ExpoSecureStore.hasValueWithKeySync.mockImplementation(() => true);

  const options = { keychainService: 'test' };
  const result = SecureStore.hasItem('key', options);
  expect(result).toBe(true);
  expect(ExpoSecureStore.hasValueWithKeySync).toHaveBeenCalledWith('key', options);
});

it(`checks for invalid keys`, async () => {
  ExpoSecureStore.getValueWithKeyAsync.mockImplementation(async () => `unexpected value`);

  await expect(SecureStore.getItemAsync(null as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.getItemAsync(true as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.getItemAsync({} as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.getItemAsync((() => {}) as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.getItemAsync('@')).rejects.toMatchSnapshot();

  expect(ExpoSecureStore.getValueWithKeyAsync).not.toHaveBeenCalled();
});

it(`checks for invalid values`, async () => {
  await expect(SecureStore.setItemAsync('key', null as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.setItemAsync('key', true as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.setItemAsync('key', {} as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.setItemAsync('key', (() => {}) as any)).rejects.toMatchSnapshot();

  expect(ExpoSecureStore.setValueWithKeyAsync).not.toHaveBeenCalled();
});

it(`checks for invalid keys when checking existence`, async () => {
  await expect(SecureStore.hasItemAsync(null as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.hasItemAsync(true as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.hasItemAsync({} as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.hasItemAsync((() => {}) as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.hasItemAsync('@')).rejects.toMatchSnapshot();

  expect(ExpoSecureStore.hasValueWithKeyAsync).not.toHaveBeenCalled();
});
