# URLSchemer for iOS and Android

`Version 0.0.1`

An Angular.js module to open external apps' urls on the device for Cordova / PhoneGap apps by GNSPS

1. [Description](https://github.com/GNSPS/URLSchemer#1-description)
2. [Requirements](https://github.com/GNSPS/URLSchemer#2-requirements)
3. [Installation](https://github.com/GNSPS/URLSchemer#3-installation)
4. [Usage](https://github.com/GNSPS/URLSchemer#4-usage)
5. [License](https://github.com/GNSPS/URLSchemer#5-license)

## 1. Description

The module checks if the app is installed on the device and opens the native app with the URL scheme provided if it is, otherwise just opens another provided http URL.
It always opens an external app. Even if the wanted app is not installed on the device it opens the provided fallback on the system's default browser.

It works with just an URL Scheme (e.g. "fb://") on both platforms, iOS and Android.

### Supported Platforms

* iOS
* Android

## 2. Requirements

The module requires two other plugins to be installed:

[AppAvailability](https://github.com/ohh2ahh/AppAvailability) by [ohh2ahh](http://ohh2ahh.com)

[InAppBrowser](https://github.com/apache/cordova-plugin-inappbrowser/blob/master/doc/index.md) by Adobe

Run these commands to add those plugins to your project:
```
$ cordova plugin add https://github.com/ohh2ahh/AppAvailability.git
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git
```

## 3. Installation

Just copy the files urlschemer.js and urlschemer.config.json to a `/js` folder inside the `www` root of your Cordova / PhoneGap project.

Reference the `urlschemer.js` file in your `index.html`:
> <script src="js/urlschemer.js"></script>

And inject it into your app module:
> angular.module('myApp', ['URLSchemer']);

--

Note: if you wish to change the `/js` path just change this line (6) in `urlschemer.js`:
```javascript
[...]
    var schemes = [];
    
    $http.get("js/urlschemer.config.json")
    .then(
[...]
```

## 4. Usage

URLSchemers has two methods: openLink() and getAndroidAppId(), both return promises.

### openLink()

The openLink(appUrl, normalUrl) method has two parameters:

*The first is an app URL scheme like "fb://event?id=123" (Mandatory)

*And the second is a fallback URL in case the app is not installed, like "http://www.facebook.com/event/123" (Optional)

Note: In case there is no fallback URL provided the link will only be opened if the app is installed in the device

--

The method's promise resolves whenever the URL scheme was recognized and rejects otherwise and always returns an object with the following format:

`retObj.openedLink` : string with the link that was open, if no link was open it is undefined (String/Undefined)
`retObj.appInstalled` : boolean to check if the app is available in the device, if no check was made it is undefined (Boolean/Undefined)
`retObj.diag` : string with the action performed, either error or success messages (to be used while developing or for log outputting) (String)

--

###### Example:

```javascript
$urlschemer.openLink("fb://event?id=12345", "http://www.facebook.com/event/12345")
.then(
    function(resp) { // The URL scheme was recognized and all went good
        console.log("Was the app installed in the device? "+resp.appInstalled);
        console.log("So the app url scheme was opened: "+resp.openedLink);
    },
    function(resp) { // URL scheme was not recognized or no parameters error
        if(resp.openedLink){
            console.log("URL scheme was not recognized but still opened this link: "+resp.openedLink);
        }else{
            console.log("URLSchemer failed with error: "+resp.diag);
        }
    }
);
```

### getAndroidAppId()

This method just resolves to a string with the Android package ID if you want it for something else.

###### Example:

```
$urlschemer.getAndroidAppId("fb://event?id=12345")
.then(
    function(androidAppId) { // The URL scheme was recognized and all went good
        console.log("URL scheme recognized. The corresponding Android app ID is: "+androidAppId);
    },
    function() { // URL scheme was not recognized or no parameters error
        console.log("URL scheme was not recognized, so no Android app ID to return.");
    }
);
```

### Add More App Schemes

In the config file there are already the major apps' URL schemes, however feel free to add more app schemes to the `urlschemer.config.json` file for URLSchemer to recognize them.

## 5. License

[The MIT License (MIT)](http://www.opensource.org/licenses/mit-license.html)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.