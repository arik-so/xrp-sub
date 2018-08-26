export default class Swap {
    /**
     * Create a submarine swap
     * @param sender The sender account
     * @param recipient The recipient account
     * @param amount Amount in drops to transfer
     * @param hash The invoice hash
     * @param duration Duration after which to expire the swap and return all money to the sender
     */
    static createSwap({ sender, recipient, amount, hash, expiryDuration }: {
        sender: string;
        recipient: string;
        amount: number;
        hash: string;
        expiryDuration?: number;
    }): string;
    /**
     * Claim a submarine swap
     * @param sender The original provider of the swap
     * @param recipient The claimant that will sign this method
     * @param swapId The sequence id of the original swap transaction
     * @param preimage The preimage corresponding to the invoice hash
     */
    static claimSwap({ sender, recipient, swapId, preimage }: {
        sender: string;
        recipient: string;
        swapId: number;
        preimage: string;
    }): string;
}
