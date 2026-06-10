import { describe, expect, test } from 'vitest';
import packageJson from '../package.json';

describe('依赖版本', () => {
  test('运行时依赖不能使用 latest', () => {
    for (const [name, version] of Object.entries(packageJson.dependencies)) {
      expect(version, `${name} 不应使用 latest`).not.toBe('latest');
    }
  });

  test('构建和测试工具不能使用 latest', () => {
    for (const [name, version] of Object.entries(packageJson.devDependencies)) {
      expect(version, `${name} 不应使用 latest`).not.toBe('latest');
    }
  });
});
