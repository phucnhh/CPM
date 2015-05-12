#!/bin/bash

watchify src/gui.js -t debowerify -t cssify --standalone mainGui --debug true -o build/app/gui.js 
