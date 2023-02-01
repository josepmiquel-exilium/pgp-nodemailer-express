const openpgp = require('openpgp');
const userMail = process.env.MAIL_USER;
const passphrase = process.env.PGP_PASSWORD;
const pgpPrivateKey = process.env.PGP_PRIVATE_KEY;
const pgpPublicKey = process.env.PGP_PUBLIC_KEY;
const pgp = {};

pgp.generateKeys = async () => {
    const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
        type: 'ecc', // Type of the key, defaults to ECC
        curve: 'curve25519', // ECC curve name, defaults to curve25519
        userIDs: [{ name: 'Your name', email: userMail }], // you can pass multiple user IDs
        passphrase, // protects the private key
        format: 'armored', // output key format, defaults to 'armored' (other options: 'binary' or 'object')
    });

    console.log(privateKey); // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
    console.log(publicKey); // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
    console.log(revocationCertificate); // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
};

pgp.verifyKeys = async () => {
    const publicKey = await openpgp.readKey({ armoredKey: pgpPublicKey });

    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: pgpPrivateKey }),
        passphrase,
    });

    return new Promise((resolve, reject) => {
        resolve({ publicKey, privateKey });
    });
};

pgp.encrypt = async (text) => {
    const { publicKey, privateKey } = await pgp.verifyKeys();

    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text }), // input as Message object
        encryptionKeys: publicKey,
        signingKeys: privateKey,
    });

    return new Promise((resolve, reject) => {
        resolve(encrypted);
    });
};

pgp.decrypt = async (text) => {
    const { publicKey, privateKey } = await pgp.verifyKeys();

    const message = await openpgp.readMessage({
        armoredMessage: text, // parse armored message
    });
    const { data: decrypted, signatures } = await openpgp.decrypt({
        message,
        verificationKeys: publicKey, // optional
        decryptionKeys: privateKey,
    });

    // check signature validity (signed messages only)
    try {
        await signatures[0].verified; // throws on invalid signature
        console.log('Signature is valid');
    } catch (e) {
        throw new Error('Signature could not be verified: ' + e.message);
    }

    return new Promise((resolve, reject) => {
        resolve(decrypted);
    });
};

module.exports = pgp;
