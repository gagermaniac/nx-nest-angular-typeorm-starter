import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const roundSalt = 10;

@Injectable()
export class Encrypt {
    hash(value: string) {
        return bcrypt.hashSync(value, roundSalt);
    }

    compare(value: string, encrypted: string) {
        console.log(value)
        return bcrypt.compareSync(value, encrypted);
    }
}