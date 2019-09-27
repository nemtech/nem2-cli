import chalk from 'chalk';
import {
    Address,
    ArtifactExpiryReceipt,
    BalanceChangeReceipt,
    BalanceTransferReceipt,
    InflationReceipt,
    ReceiptType,
    ResolutionEntry,
    ResolutionStatement,
    TransactionStatement,
} from 'nem2-sdk';

export class ReceiptService {
    constructor() {

    }

    /**
     * @description The logic of formatting transactionStatements
     * @param statement
     * @returns {string}
     */
    public formatTransactionStatements(statement: any): string {
        let txt = '';
        txt += chalk.green('transactionStatements:\t') + '\n';
        txt += '-'.repeat('transactionStatements:\t'.length) + '\n\n';
        statement.transactionStatements.map((transaction: TransactionStatement, transactionIndex: number) => {
            txt += 'height:\t\t' + transaction.height + '\n';
            transaction.receipts.map((receipt: any, receiptIndex: number) => {
                txt += '<index: ' + transactionIndex + '-' + receiptIndex + '>\t';
                if (receipt instanceof BalanceTransferReceipt) {
                    txt += 'version:\t' + receipt.version + '\n';
                    txt += '\t\ttype:\t\t' + ReceiptType[receipt.type]  + '\n';
                    txt += '\t\trecipientAddress:\t' +
                        (receipt.recipientAddress instanceof Address ?
                            receipt.recipientAddress.pretty() : receipt.recipientAddress.toHex()) + '\n';
                    txt += '\t\tsenderPublickey:\t' + receipt.sender.publicKey + '\n';
                    txt += '\t\tmosaicId:\t[ ' + receipt.mosaicId.id.lower + ', ' + receipt.mosaicId.id.higher + ' ]\n\n';
                    txt += '\t\tamount:\t\t' + receipt.amount.compact() + '\n';
                } else if (receipt instanceof BalanceChangeReceipt) {
                    txt += 'version:\t' + receipt.version + '\n';
                    txt += '\t\ttype:\t\t' + ReceiptType[receipt.type] + '\n';
                    txt += '\t\ttargetPublicKey:\t' + receipt.targetPublicAccount.publicKey + '\n';
                    txt += '\t\tmosaicId:\t[ ' + receipt.mosaicId.id.lower + ', '
                        + receipt.mosaicId.id.higher + ' ]\n\n';
                    txt += '\t\tamount:\t\t' + receipt.amount.compact() + '\n';
                }  else if (receipt instanceof ArtifactExpiryReceipt) {
                    txt += 'version:\t' + receipt.version + '\n';
                    txt += '\t\ttype:\t\t' + ReceiptType[receipt.type]  + '\n';
                    txt += '\t\tmosaicId:\t[ ' + receipt.artifactId.id.lower + ', '
                        + receipt.artifactId.id.higher + ' ]\n\n';
                }  else if (receipt instanceof InflationReceipt) {
                    txt += 'version:\t' + receipt.version + '\n';
                    txt += '\t\ttype:\t\t' + ReceiptType[receipt.type]  + '\n';
                    txt += '\t\tamount:\t\t' + receipt.amount.compact() + '\n';
                    txt += '\t\tmosaicId:\t[ ' + receipt.mosaicId.id.lower + ', '
                        + receipt.mosaicId.id.higher + ' ]\n\n';
                }
            });
        });
        return txt;
    }

    /**
     * @description The logic of formatting addressResolutionStatements
     * @param statement
     * @returns {string}
     */
    public formatAddressResolutionStatements(statement: any): string {
        let txt = '';
        txt += chalk.green('addressResolutionStatements:\t') + '\n';
        txt += '-'.repeat('addressResolutionStatements:\t'.length) + '\n\n';
        statement.addressResolutionStatements.map((addressResolution: ResolutionStatement, addressResolutionIndex: number) => {
            txt += 'height:\t\t' + addressResolution.height + '\n';
            txt += 'unresolved:\t' + addressResolution.unresolved + '\n\n';
            addressResolution.resolutionEntries.map((resolutionEntry: ResolutionEntry, resolutionEntryIndex: number) => {
                txt += '<index:' + addressResolutionIndex + '-' + resolutionEntryIndex + '>\t';
                txt += 'resolved:\t\t' + resolutionEntry.resolved + '\n';
                txt += '\t\tprimaryId:\t\t' + resolutionEntry.source.primaryId + '\n';
                txt += '\t\tsecondaryId:\t\t' + resolutionEntry.source.secondaryId + '\n\n';
            });
        });
        return txt;
    }

    /**
     * @description The logic of formatting mosaicResolutionStatements
     * @param statement
     * @return {string}
     */
    public formatMosaicResolutionStatements(statement: any): string {
        let txt = '';
        txt += chalk.green('mosaicResolutionStatements:\t') + '\n';
        txt += '-'.repeat('mosaicResolutionStatements:\t'.length) + '\n\n';
        statement.mosaicResolutionStatements.map((mosaicResolution: ResolutionStatement, mosaicResolutionIndex: number) => {
            txt += 'height:\t\t' + mosaicResolution.height + '\n';
            txt += 'unresolved:\t' + mosaicResolution.unresolved + '\n\n';
            mosaicResolution.resolutionEntries.map((resolutionEntry: ResolutionEntry, resolutionEntryIndex: number) => {
                txt += '<index:' + mosaicResolutionIndex + '-' + resolutionEntryIndex + '>\t';
                txt += 'resolved:\t\t' + resolutionEntry.resolved + '\n';
                txt += '\t\tprimaryId:\t\t' + resolutionEntry.source.primaryId + '\n';
                txt += '\t\tsecondaryId:\t\t' + resolutionEntry.source.secondaryId + '\n\n';
            });
        });
        return txt;
    }
}
