import { command, metadata, option } from 'clime';
import {
    Account,
    AccountRestrictionModification,
    AccountRestrictionModificationAction,
    AccountRestrictionTransaction,
    AccountRestrictionType,
    Deadline,
    TransactionType,
    UInt64,
} from 'nem2-sdk';
import { AnnounceTransactionsCommand, AnnounceTransactionsOptions } from '../../announce.transactions.command';
import { OptionsResolver } from '../../options-resolver';
import { BinaryValidator } from '../../validators/binary.validator';
import { AccountRestrictionDirectionValidator, RestrictionTypeValidator } from '../../validators/modificationAction.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    public static transactionType = ['RESERVED', 'TRANSFER', 'REGISTER_NAMESPACE', 'ADDRESS_ALIAS', 'MOSAIC_ALIAS', 'MOSAIC_DEFINITION',
        'MOSAIC_SUPPLY_CHANGE', 'MODIFY_MULTISIG_ACCOUNT', 'AGGREGATE_COMPLETE', 'AGGREGATE_BONDED', 'LOCK', 'SECRET_LOCK',
        'SECRET_PROOF', 'ACCOUNT_RESTRICTION_ADDRESS', 'ACCOUNT_RESTRICTION_MOSAIC',
        'ACCOUNT_RESTRICTION_OPERATION', 'LINK_ACCOUNT', 'MOSAIC_ADDRESS_RESTRICTION', 'MOSAIC_GLOBAL_RESTRICTION',
        'ACCOUNT_METADATA_TRANSACTION', 'MOSAIC_METADATA_TRANSACTION', 'NAMESPACE_METADATA_TRANSACTION'];

    @option({
        flag: 'p',
        description: '(Optional) Select between your profiles, by providing a profile (blank means default profile)',
    })
    profile: string;

    @option({
        flag: 't',
        description: 'restriction type (allow / block)',
        validator: new RestrictionTypeValidator(),
    })
    restrictionType: string;

    @option({
        flag: 'd',
        description: '(Optional) incoming/outgoing (blank means incoming)',
        validator: new AccountRestrictionDirectionValidator(),
    })
    restrictionDirection: string;

    @option({
        flag: 'a',
        description: 'Modification action. (1: Add, 0: Remove)',
        validator: new BinaryValidator(),
    })
    modificationAction: string;

    @option({
        flag: 'v',
        description: 'Transaction Type [' + CommandOptions.transactionType + ']',
    })
    value: string;
}

@command({
    description: 'Allow or block outgoing transactions by transaction type.',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        options.restrictionType = OptionsResolver(options,
            'restrictionType',
            () => undefined,
            'Introduce the restriction type (allow / block): ');

        options.modificationAction = OptionsResolver(options,
            'modificationAction',
            () => undefined,
            'Introduce the modification action (1: Add, 0: Remove): ');

        if (!CommandOptions.transactionType.includes(options.value)) {
            options.value = OptionsResolver(options,
                'value',
                () => undefined,
                'Introduce the transaction Type (' + CommandOptions.transactionType + '): ');
        }

        let modificationAction;
        if ('1' === options.modificationAction) {
            modificationAction = AccountRestrictionModificationAction.Add;
        } else if ('0' === options.modificationAction) {
            modificationAction = AccountRestrictionModificationAction.Remove;
        } else {
            console.log('Wrong modificationAction. ModificationAction must be one of 1 or 0');
            return;
        }

        let restrictionType;
        if ('allow' === options.restrictionType.toLowerCase()) {
            if ('outgoing' === options.restrictionDirection.toLowerCase()) {
                restrictionType = AccountRestrictionType.AllowOutgoingTransactionType;
            } else {
                restrictionType = AccountRestrictionType.AllowIncomingTransactionType;
            }
        } else if ('block' === options.restrictionType.toLowerCase()) {
            if ('outgoing' === options.restrictionDirection.toLowerCase()) {
                restrictionType = AccountRestrictionType.BlockOutgoingTransactionType;
            } else {
                restrictionType = AccountRestrictionType.BlockIncomingTransactionType;
            }
        } else {
            console.log('Wrong restrictionType. restrictionType must be one of \'allow\' or \'block\'');
            return;
        }

        let transactionEntity;
        switch (options.value.toUpperCase()) {
            case 'TRANSFER': transactionEntity = TransactionType.TRANSFER; break;
            case 'REGISTER_NAMESPACE': transactionEntity = TransactionType.REGISTER_NAMESPACE; break;
            case 'ADDRESS_ALIAS': transactionEntity = TransactionType.ADDRESS_ALIAS; break;
            case 'MOSAIC_ALIAS': transactionEntity = TransactionType.MOSAIC_ALIAS; break;
            case 'MOSAIC_DEFINITION': transactionEntity = TransactionType.MOSAIC_DEFINITION; break;
            case 'MOSAIC_SUPPLY_CHANGE': transactionEntity = TransactionType.MOSAIC_SUPPLY_CHANGE; break;
            case 'MODIFY_MULTISIG_ACCOUNT': transactionEntity = TransactionType.MODIFY_MULTISIG_ACCOUNT; break;
            case 'AGGREGATE_COMPLETE': transactionEntity = TransactionType.AGGREGATE_COMPLETE; break;
            case 'AGGREGATE_BONDED': transactionEntity = TransactionType.AGGREGATE_BONDED; break;
            case 'LOCK': transactionEntity = TransactionType.LOCK; break;
            case 'SECRET_LOCK': transactionEntity = TransactionType.SECRET_LOCK; break;
            case 'SECRET_PROOF': transactionEntity = TransactionType.SECRET_PROOF; break;
            case 'ACCOUNT_RESTRICTION_ADDRESS': transactionEntity = TransactionType.ACCOUNT_RESTRICTION_ADDRESS; break;
            case 'ACCOUNT_RESTRICTION_MOSAIC': transactionEntity = TransactionType.ACCOUNT_RESTRICTION_MOSAIC; break;
            case 'ACCOUNT_RESTRICTION_OPERATION': transactionEntity = TransactionType.ACCOUNT_RESTRICTION_OPERATION; break;
            case 'LINK_ACCOUNT': transactionEntity = TransactionType.LINK_ACCOUNT; break;
            case 'MOSAIC_ADDRESS_RESTRICTION': transactionEntity = TransactionType.MOSAIC_ADDRESS_RESTRICTION; break;
            case 'MOSAIC_GLOBAL_RESTRICTION': transactionEntity = TransactionType.MOSAIC_GLOBAL_RESTRICTION; break;
            case 'ACCOUNT_METADATA_TRANSACTION': transactionEntity = TransactionType.ACCOUNT_METADATA_TRANSACTION; break;
            case 'MOSAIC_METADATA_TRANSACTION': transactionEntity = TransactionType.MOSAIC_METADATA_TRANSACTION; break;
            case 'NAMESPACE_METADATA_TRANSACTION': transactionEntity = TransactionType.NAMESPACE_METADATA_TRANSACTION; break;

            default: return console.log('Wrong transaction type. Transaction type must be one of ' + CommandOptions.transactionType);
        }

        const profile = this.getProfile(options);
        const entityRestriction = AccountRestrictionModification.createForOperation(
            modificationAction,
            transactionEntity,
        );
        const transaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.create(),
            restrictionType,
            [entityRestriction],
            profile.networkType,
            UInt64.fromUint(options.maxFee));

        const account = Account.createFromPrivateKey(profile.account.privateKey, profile.networkType);
        const signedTransaction = account.sign(transaction, profile.networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }
}
