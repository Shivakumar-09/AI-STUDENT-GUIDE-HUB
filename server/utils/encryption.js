const crypto = require('crypto');

// Generate a random 32-byte key if not provided in environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
    if (!text) return text;
    
    // Convert a hex string key to buffer if necessary, or just use as is if it's already a correct length string
    // Let's ensure the key is exactly 32 bytes for aes-256-cbc
    let keyBuffer;
    if (Buffer.from(ENCRYPTION_KEY, 'hex').length === 32) {
        keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');
    } else {
        // Fallback: hash the key to ensure it's 32 bytes
        keyBuffer = crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest();
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
    
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    if (!text) return text;
    // Check if the text matches the encrypted pattern (iv:encryptedText)
    const textParts = text.split(':');
    if (textParts.length !== 2) return text; // Not encrypted or invalid format
    
    try {
        let keyBuffer;
        if (Buffer.from(ENCRYPTION_KEY, 'hex').length === 32) {
            keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');
        } else {
            keyBuffer = crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest();
        }

        const iv = Buffer.from(textParts[0], 'hex');
        const encryptedText = Buffer.from(textParts[1], 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
        
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        
        return decrypted.toString();
    } catch (error) {
        console.error('Decryption failed:', error.message);
        return text; // Return original if decryption fails (e.g. key changed, or corrupted)
    }
}

module.exports = { encrypt, decrypt };
