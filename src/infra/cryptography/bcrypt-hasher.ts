import { hash, compare } from 'bcryptjs'

import { HashComparer } from "@/domain/forum/application/cryptography/hasher-comparer";
import { HashGenerator } from "@/domain/forum/application/cryptography/hasher-generator";

export class BcryptHasher implements HashGenerator, HashComparer {
    hash(plain: string): Promise<string> {
        return hash(plain, 8)
    }

    compare(plain: string, hash: string): Promise<boolean> {
        return compare(plain, hash)
    }
    
}