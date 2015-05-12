openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem



-------------------------------
The Commands to Run

Generate a 2048 bit RSA Key

You can generate a pubic and private RSA key pair like this:

openssl genrsa -des3 -out private.pem 2048

That generates a 2048-bit RSA key pair, encrypts them with a password you provide, and writes them to a file. You need to next extract the public key file. You will use this, for instance, on your web server to encrypt content so that it can only be read with the private key.

Export the RSA Public Key to a File

This is a command that is

openssl rsa -in private.pem -outform PEM -pubout -out public.pem

The -pubout flag is really important. Be sure to include it.

Next open the public.pem and ensure that it starts with a -----BEGIN PUBLIC KEY-----. This is how you know that this file is the public key of the pair and not a private key.

To check the file from the command line you can use the less command, like this:

less public.pem
