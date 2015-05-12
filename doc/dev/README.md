# install environnment

## install browserify

It is the tool to compile javascript files

`sudo npm install -g browserify watchify`

## install build system gulp.js

It is the build system that will create our release files

`sudo npm install gulp -g`

## install innosetup

from https://katastrophos.net/andre/blog/2009/03/16/setting-up-the-inno-setup-compiler-on-debian/

```
# sudo apt-get install wine 
# mkdir /tmp/innosetup  
# cd /tmp/innosetup  
# wget http://files.jrsoftware.org/ispack/ispack-5.2.3.exe  
# wine ./ispack-5.2.3.exe
```

Create a file iscc and put this content :
 
```
#!/bin/sh  
unset DISPLAY  
scriptname=$1  
[ -f "$scriptname" ] && scriptname=$(winepath -w "$scriptname")  
wine "C:\Program Files (x86)\Inno Setup 5\ISCC.exe" "$scriptname" "$2" "$3" "$4" "$5" "$6" "$7" "$8" "$9"  
```

(check the install path C:\Program Files (x86)\... is correct)

put this file somewhere in your path (~/bin for example)

# Build the software

first, get your NPM modules : 
`npm install`

then launch build :
`gulp prod`

it will create a build directory as following : 
```
build/
	setup/
		win/setup.exe 	<--- this is Windows installer
	DesktopExample/
		win/ 			<--- Windows executable
		linux64/		<--- 64bit Linux executable
		linux32/		<--- 32bit Linux executable
		osx/			<--- MacOS X executable
```

*Note* be careful to adjust the informations in setup.iss file and in particular the AppId that must be unique for each software
(if not unique they will be seen as the same software by Windows)

# Developpement run

The client use browserify. All JS source files will be compiled in one global gui.js.
when you are working on source, run
```
cd BAYROLab/
./watchify.sh
```
(run it one time only, it is a deamon that looks for modification and automatically compile source

Run the software :
```
gulp run
```

this run the software in dev mode. On the toolbar, you have access to chrome dev tools for debugging

# Create icon

From SVG file create all size png file in resources (16x16, 24x24, 32x32, 40x40, 48x48, 64x64, 96x96, 128x128, 256x256)
Then run the gen_ico.sh

# License

## Generate key pair

First you must generate a private/public key pair un resources/keys.

The private key is used to create the license file. It is never distributed.
The public key is used to check the license file. It is bundled in the software.
You should do a new key pair for each software to avoid affect all softwares in case of private key pair compromission

## Create a new license file

Run the license generation application
```
gulp licapp-run
```

You should adjust the licapp code (look at licapp_index.js, licapp_index.html, licapp_gui.js) to have the
license information you need. Only the expire date is required.

## Build he license generation application

To generate installation setup of license application, run
```
gulp licapp-prod
```

## Distribute the license with the software

There is 2 ways to install license file on the end-user workstation :
 * distribute the license.lic file with the setup file. If it is in the same directory, the setup will automatically install it
 * copy it after in the install directory (C:\Program Files\MyApplication\)