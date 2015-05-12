# Coding

## Work with views

The client code use a view/controller structure.

All views are in src/views.

Each view has a set of 3 file : HTML, CSS and JS
one view is a part of a screen (you can see it as a component). It will be load in a DIV container

Views follow convention as following :
 * avoid using id inside the view HTML because id in unique and we may want to use it twice in a screen, use class instead
 * name are named as folder_viewname__elementId
 * the 3 HTML/CSS/JS are in the same folder with the same filename
 * the JS file extends the BaseView class. The BaseView will automatically load HTML and CSS for you
 * by default the view will load itself in a DIV with id folder_viewname__container but it can be loaded somewhere else by giving a specific element to init()

Controllers know views but views don't know controllers. So the controllers called views methods and listen to views events
and views only display information and emit events.

## Where to start ?

The starting points are :
 * index.html : this is the main HTML page. You will have all views DIV container in it
 * gui.js : this is the software GUI starting point. All controllers and main views are initialized here
 * index.js : this is the software start code, it run the code that is outside browser, such as menubar or interact with external programs

## External UI libs

The external UI libs (such as jQuery for example) are managed using bower.
They are copied to the build target by the "scripts-external" (in gulpfile.js) and referenced
in the index.html

## External tools

### wkhtmltopdf

The wkhtmltopdf executable is used to convert the HTML to PDF for export.

It is used in pdf.js. It must be called from index.js because it must be called from NodeJS context
so the pdf generation functions are passed to the gui.js script from index.js.

The HTML version is displayed by the "viewer" view.

Note : be careful the rendering is not the same on Linux and Windows

### ghostscript

The ghostscript executable is used to print the PDF directly using standard Windows print dialog

## Generate help manual

The manual is written in HTML and the CHM file is generated using Microsoft HTML Help Workshop
(http://www.microsoft.com/en-us/download/details.aspx?id=21138)

## The starter.html

This HTML screen is only to have a splash screen on startup.

It is not required, you can modify the package.json to point directly at index.html instead if you don't want it.

If you need a splash screen, use it like this. There is many ways to do it but some have hidden performance issue
(for example I tried to have an other frameless window but the whole application became unresponsive)

## The app.core

At first, I bundled the application in a single .exe file.

But it have big performance issue on startup (it is a known issue : https://github.com/nwjs/nw.js/issues/514)

I tried many ways to improve it but the only way that give really good startup performance is to not bundle in exe file
and to distribute the unzipped application files and run them with the nw.exe runtime (see comment https://github.com/nwjs/nw.js/issues/514#issuecomment-17709142)

So I end up to create an app.core zip at build which contains the application files and to unzipping it in the
setup process (see setup.iss).
Icon an name stuff is handle by create appropriate shortcut file in start menu and desktop