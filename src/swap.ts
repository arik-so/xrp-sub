const ripple = require('ripple-lib');
const rippleBinaryCodec = require('ripple-binary-codec');

const crypto = require('crypto');

const RIPPLE_EPOCH = 946684800;

export default class Swap {

    /**
     * Create a submarine swap
     * @param sender The sender account
     * @param recipient The recipient account
     * @param amount Amount in drops to transfer
     * @param hash The invoice hash
     * @param duration Duration after which to expire the swap and return all money to the sender
     */
    static createSwap({
                          sender,
                          recipient,
                          amount,
                          hash,
                          expiryDuration = 24 * 3600
                      }: {
        sender: string,
        recipient: string,
        amount: number,
        hash: string,
        expiryDuration?: number
    }): string {

        const currentTime = Date.now() / 1000;
        const currentRippleEpoch = currentTime - RIPPLE_EPOCH;

        const txJson = {
            TransactionType: 'EscrowCreate',
            Account: sender,
            Destination: recipient,
            CancelAfter: currentRippleEpoch + expiryDuration,
            Amount: amount,
            Condition: hash,
            DestinationTag: 0,
            SourceTag: 0
        };
        const txHex = rippleBinaryCodec.encode(txJson);
        return txHex;
    }

    /**
     * Claim a submarine swap
     * @param sender The original provider of the swap
     * @param recipient The claimant that will sign this method
     * @param swapId The sequence id of the original swap transaction
     * @param preimage The preimage corresponding to the invoice hash
     */
    static claimSwap({
                         sender,
                         recipient,
                         swapId,
                         preimage
                     }: {
        sender: string,
        recipient: string,
        swapId: number,
        preimage: string
    }): string {

        const condition = crypto.createHash('sha256').update(preimage).digest('hex');
        const txJson = {
            TransactionType: 'EscrowFinish',
            Account: recipient,
            Owner: sender,
            OfferSequence: swapId,
            Condition: condition,
            Fulfillment: preimage
        };
        const txHex = rippleBinaryCodec.encode(txJson);
        return txHex;
    }

}