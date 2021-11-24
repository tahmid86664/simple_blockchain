const SHA256 = require('crypto-js/sha256');

class Block {
    constructor (index, timestamp, data, previousHash='') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash = () => {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}


class Blockchain {
    constructor () {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock () {
        return new Block(0, "21/11/2021", "Genesis block", "0".repeat(64));
    }

    getLatestBlock () {
        return this.chain[this.chain.length - 1];
    }

    addBlock (newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    // validating the chain
    isChainValid () {
        for (let i=1; i<this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previouBlock = this.chain[i-1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previouBlock.hash) {
                return false;
            }
        }


        return true;
    }
}


let ourChain = new Blockchain();
ourChain.addBlock(new Block(1, "22//11/2021", {amount: 100, from: 'Tahmid', to: 'Prantick'}));
ourChain.addBlock(new Block(1, "23//11/2021", {amount: 200, from: 'Prantick', to: 'Mehedi'}));

/*
if (ourChain.isChainValid) {
    console.log("The block is valid");
    console.log(JSON.stringify(ourChain, null, 4));
} else {
    console.log("The block chain is not valid. Something wrong in it");
}
*/

console.log('Is the blockchain valid? ' + ourChain.isChainValid());

// let's tempering blockchain by changing some properties
console.log("After changing any property of a block");
ourChain.chain[1].data.amount = 400;
console.log('Is the blockchain valid? ' + ourChain.isChainValid());

// now if we're trying to re-calculate the hash, would the blockchain valid?
console.log("After re-calculate hash of a block");
ourChain.chain[1].hash = ourChain.chain[1].calculateHash();
console.log('Is the blockchain valid? ' + ourChain.isChainValid());
