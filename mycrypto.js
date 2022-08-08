// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = process.env.ENCRYPTIONKEY;
const iv = crypto.randomBytes(16);

module.exports = {
    encrypt:
        function encrypt(text) {
            let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
            let encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
        },
    decrypt:
        function decrypt(text) {
            let iv = Buffer.from(text.iv, 'hex');
            let encryptedText = Buffer.from(text.encryptedData, 'hex');
            let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        }
}

/*var hw = encrypt("46f29735-c58a-4e29-ac31-c53279c28e80")
console.log(hw)
console.log(decrypt(hw))*/