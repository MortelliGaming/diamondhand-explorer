import { ClawbackVestingAccount } from '../../proto/evmos/vesting/tx';
export function createMsgClawback(funderAddress, accountAddress, destAddress) {
    const msg = new ClawbackVestingAccount({
        funderAddress,
        accountAddress,
        destAddress,
    });
    return {
        message: msg,
        path: ClawbackVestingAccount.typeName,
    };
}
//# sourceMappingURL=msgClawback.js.map