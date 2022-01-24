import { Wallet } from "./wallet";
import { 
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL
} from "@solana/web3.js"

export class PhantomWallet extends Wallet {

    constructor(){
        super();
        this.icon = "https://gblobscdn.gitbook.com/spaces%2F-MVOiF6Zqit57q_hxJYp%2Favatar-1615495356537.png?alt=media" ;
        this.name = "Phantom" ;
        //@ts-ignore
        if ( window.solana && window.solana.isPhantom ){
            this.installed = true ;
        }else if ( localStorage.getItem('phantom') ){
            this.installed = true ;
        }
    }
    async connect(){
        await super.connect();
        //@ts-ignore
        await window.solana.connect();
        //@ts-ignore
        if ( window.solana.publicKey ){
            //@ts-ignore
            this.provider = window.solana ;
            //@ts-ignore
            this.publicKey = new PublicKey(this.provider.publicKey) ;
        }
        return true ;
    }
    
    async disconnect(){
        //@ts-ignore
        await this.provider.disconnect();
        return true ;
    }
    async sendTransaction( destinationPublickKey : string, sol : number ){

        const payerPubKey = this.publicKey ;
        const destinationPubKey = new PublicKey(destinationPublickKey) ;
    
        // const senderAccountInfo = await Wallet.solanaConnection?.getAccountInfo(payerPubKey!);
        // const receiverAccountInfo = await Wallet.solanaConnection?.getAccountInfo(destinationPubKey);
    
        const transaction = new Transaction();
        transaction.add( SystemProgram.transfer({
          fromPubkey : payerPubKey!,
          toPubkey : destinationPubKey,
          lamports : sol*LAMPORTS_PER_SOL
        }));
    
        const blockhash = await Wallet.solanaConnection?.getRecentBlockhash();
        transaction.recentBlockhash = blockhash!.blockhash ;
        transaction.feePayer = payerPubKey! ;
    
        //@ts-ignore
        const transactionSigned = await this.provider.signTransaction(transaction) ;
        let signature = await Wallet.solanaConnection?.sendRawTransaction(transactionSigned.serialize());
        let result = await Wallet.solanaConnection?.confirmTransaction(signature!, "singleGossip" )! ;
        return signature ;

    }


}