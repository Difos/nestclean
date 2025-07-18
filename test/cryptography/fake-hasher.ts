import { HashComparer } from '@/domain/forum/application/cryptography/hasher-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hasher-generator'

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') == hash
  }
}
