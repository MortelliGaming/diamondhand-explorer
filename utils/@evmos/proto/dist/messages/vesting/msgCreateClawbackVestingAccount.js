import { Timestamp } from '@bufbuild/protobuf';
import { Coin as ProtoCoin } from '../../proto/cosmos/base/coin.js';
import { ClawbackVestingAccount } from '../../proto/evmos/vesting/tx.js';
import { Period as ProtoPeriod } from '../../proto/cosmos/vesting/vesting.js';

/* global BigInt */

const toProtoPeriod = ({ length, amount }) => new ProtoPeriod({
    length: BigInt(length),
    amount: amount.map(({ denom, amount }) => new ProtoCoin({
        denom,
        amount,
    })),
});
export function createMsgCreateClawbackVestingAccount(fromAddress, toAddress, startTime, lockupPeriods, vestingPeriods, merge) {
    const msg = new ClawbackVestingAccount({
        fromAddress,
        toAddress,
        startTime: new Timestamp({
            seconds: BigInt(startTime),
        }),
        lockupPeriods: lockupPeriods.map(toProtoPeriod),
        vestingPeriods: vestingPeriods.map(toProtoPeriod),
        merge,
    });
    return {
        message: msg,
        path: ClawbackVestingAccount.typeName,
    };
}
//# sourceMappingURL=msgCreateClawbackVestingAccount.js.map