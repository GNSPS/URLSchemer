angular.module("URLSchemer", [])

.factory("$urlschemer", ["$q", "$window", "$http", function($q, $window, $http){
    var schemes = [];
    
    $http.get("js/urlschemer.config.json")
    .then(
        function(resp){
            schemes = resp.data;
        },
        function(err){
            console.log("Error loading URLSchemer config (urlschemer.config.json)! Module will not work.");
        }
    );
    
    return {
        openLink: function(url, fallbackUrl){
            var d = $q.defer();
            var retObj = {};
            
            if(typeof(url) === "undefined"){
                retObj = {
                        "openedLink": false,
                        "appInstalled": undefined,
                        "diag": "Insufficient parameters. Provide app URL at least"
                };
                
                d.reject(retObj);
                
                return d.promise;
            }
            
            var urlArray = url.split(":");
            
            if(urlArray[0] in schemes){
                var androidAppId = schemes[urlArray[0]];
            }else{
                $window.open(encodeURI(url), "_system", "location=yes");
                
                retObj = {
                        "openedLink": url,
                        "appInstalled": undefined,
                        "diag": "URL scheme not recognized. Opening app url as provided."
                };
                
                d.reject(retObj);
                
                return d.promise;
            }
            
            var ua = navigator.userAgent.toLowerCase();
            var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

            if (typeof appAvailability === 'undefined') {
                if(fallbackUrl){
                    $window.open(encodeURI(fallbackUrl), "_system", "location=yes");
                }
                
                retObj = {
                        "openedLink": (fallbackUrl) ? fallbackUrl : undefined,
                        "appInstalled": undefined,
                        "diag": "AppAvailability plugin not available. Trying to open fallback url as we are probably in the browser testing! ;)"
                }

                d.resolve(retObj);
            }else{
                if(isAndroid) {
                    appAvailability.check(
                        androidAppId, //android package
                        function(){
                            $window.open(encodeURI(url), "_system", "location=yes");

                            retObj = {
                                    "openedLink": url,
                                    "appInstalled": true,
                                    "diag": "App installed. Opening app url as provided."
                            }

                            d.resolve(retObj);
                        },
                        function(){
                            if(fallbackUrl){
                                $window.open(encodeURI(fallbackUrl), "_system", "location=yes");
                            }

                            retObj = {
                                    "openedLink": (fallbackUrl) ? fallbackUrl : undefined,
                                    "appInstalled": false,
                                    "diag": "App not installed. Opening fallback url."
                            }

                            d.resolve(retObj);
                        }
                    );
                }else{
                    appAvailability.check(
                        urlArray[0]+"://", //app url scheme (for ios)
                        function(){
                            $window.open(encodeURI(url), "_system", "location=yes");

                            retObj = {
                                    "openedLink": url,
                                    "appInstalled": true,
                                    "diag": "App installed. Opening app url as provided."
                            }

                            d.resolve(retObj);
                        },
                        function(){
                            if(fallbackUrl){
                                $window.open(encodeURI(fallbackUrl), "_system", "location=yes");
                            }

                            retObj = {
                                    "openedLink": (fallbackUrl) ? fallbackUrl : undefined,
                                    "appInstalled": false,
                                    "diag": "App not installed. Opening fallback url."
                            }

                            d.resolve(retObj);
                        }
                    );
                }
            }
            
            return d.promise;
        },
        getAndroidAppId: function(url){
            var d = $q.defer();
            var urlArray = url.split(":");
            
            if(urlArray[0] in schemes){
                d.resolve(schemes[urlArray[0]]);
            }else{
                d.reject();
            }
            
            return d.promise;
        }
    }
}]);