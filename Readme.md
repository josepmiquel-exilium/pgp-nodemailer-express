
# Nodemailer Encryption with PGP in Express and Node.js

This repository provides a solution for encrypting contact form submissions and sending encrypted emails using Nodemailer, Express, and Node.js.

## Usage

1.  Install the dependencies by running `npm install` or `yarn install`.
2.  Modify the `.env` file to configure your environment variables.
3.  If you don't already have a PGP Key, you can generate a new one by invoking the `generateKeys` method in `utils/pgp.js`.
4.  Ensure your application stays secure by following best practices for handling sensitive data.

With this solution, you can encrypt contact form submissions on your website and send encrypted emails, ensuring the privacy and security of the transmitted information.

Note: It's important to handle encryption and security carefully to protect sensitive data.
