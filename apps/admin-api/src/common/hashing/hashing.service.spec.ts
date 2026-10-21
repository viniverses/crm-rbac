import { HashingService } from './hashing.service.ts';

describe('HashingService', () => {
  const hasher = new HashingService();

  it('hashes a password and verifies it', async () => {
    const passwordHash = await hasher.hash('Strong#Pass1');

    expect(passwordHash).not.toBe('Strong#Pass1');
    await expect(hasher.verify('Strong#Pass1', passwordHash)).resolves.toBe(true);
    await expect(hasher.verify('Wrong#Pass1', passwordHash)).resolves.toBe(false);
  });
});
