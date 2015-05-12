License
=======

# Concept

The license file is a ZIP file containing 2 files
 * infos.json
 * license.txt

The file ```infos.json``` contains the license information (such as name, number...)
you can put any informations you want. The only mandatory information is the ```expire``` date

The ```license.txt``` file contains the signature of the ```infos.json``` file created using
the *private key*.
You must do this with an independent tool because you should never distribute the *private key*
with the software.

The license check is done by check the signature contained in ```license.txt``` using the *public key*.
This operation check that the ```infos.json``` has not been altered (for example someone tried to change the expire date)
If the ```infos.json``` is OK, it checks that the expire date is not over.

This means that only the person that have the *private key* can create license file (that's why you must keep it secret
and never distribute it with the software)

# Create private / public keys

You should create a private/public keys pair for each software (don't re-use BAYROL keys for EMA !)

Run the following commands :

```
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```

The file ```private.pem``` contains the private key.

The file ```public.pem``` contains the public key.

# Generate a license file

The following code is used to generate the license file :

```javascript
licenseApi.genLicense(savePath, infos, function(err){
			if(err) {
				//Handle error
				return;
			}
			//Success
		}) ;

```

```savePath``` is the folder in which create the license file.

```infos``` is the javascript object that will be saved in ```infos.json``` file

# Check a license file

The following code is used to generate the license file :

```javascript
licenseApi.checkLicense(licencePath, function(err, infos){
			if(err){
				//Handle error (license check failed)
				return;
			}
			//License check OK
		}) ;

```

```infos``` is the javascript object that contains informations saved in ```infos.json``` file