# Building PhoneNumber.js

[PhoneNumber.js](https://github.com/andreasgal/PhoneNumber.js) is a module made by Mozilla for Firefox OS

It get his inspiration from the Google [libphonenumber](https://code.google.com/p/libphonenumber/) but is much much lighter

As it is made for inclusion in Firefox OS, it can't be included directly in node or web project

[PhoneNumber.js-for-the-Web](https://github.com/andris9/PhoneNumber.js-for-the-Web) give us a version usable in classical web context

but it inclusion is not straightforward...

first, you must add it to your bower dependencies :
```
bower install git://github.com/andris9/PhoneNumber.js-for-the-Web.git --save
```

then, you must build it :
```
cd bower_components/PhoneNumber.js-for-the-Web
npm install
grunt
```
This will download the [phone format database maintained by Google](http://libphonenumber.googlecode.com/svn/trunk/resources/PhoneNumberMetadata.xml)
and transform it to JS format

# Using PhoneNumber.js

Now we are ready to use it. Include it  :
```
    <script src="externals/PhoneNumber.js-for-the-Web/PhoneNumberMetadata.js"></script>
    <script src="externals/PhoneNumber.js-for-the-Web/PhoneNumberNormalizer.js"></script>
    <script src="externals/PhoneNumber.js-for-the-Web/PhoneNumber.js"></script>
```
(externals is pointing the bower_components)

And play with it :

```javascript
PhoneNumber.Parse("06 01 02 03 04", "FR") ;
PhoneNumber.Parse("0601020304", "FR") ;
PhoneNumber.Parse("0033601020304", "FR") ;
PhoneNumber.Parse("+33601020304", "FR") ;
/*
give you :
{
  internationalFormat: "+33 6 01 02 03 04"
  internationalNumber: "+33601020304"
  nationalFormat: "06 01 02 03 04"
  nationalNumber: "601020304"
  region: "FR"
  regionMetaData: {...}
}
*/

PhoneNumber.Parse("+84838121212", "FR") ;
/* we give an international number with locale to FR, it recognize the country
{
  internationalFormat: "+84 8 3812 1212"
  internationalNumber: "+84838121212"
  nationalFormat: "08 3812 1212"
  nationalNumber: "838121212"
  region: "VN"
  regionMetaData: {...}
}
*/

```