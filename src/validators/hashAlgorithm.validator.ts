import {ExpectedError, ValidationContext, Validator} from 'clime';
import {HashType} from 'nem2-sdk';

export class HashAlgorithmValidator implements Validator<number> {
    validate(value: number, context: ValidationContext): void {
        if (!(value in HashType)) {
            throw new ExpectedError('hashAlgorithm must be one of ' +
                '(0: Op_Sha3_256, 1: Op_Keccak_256, 2: Op_Hash_160, 3: Op_Hash_256)');
        }
    }
}
