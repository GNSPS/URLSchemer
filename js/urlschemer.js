angular.module("URLSchemer", [])

.factory("$urlschemer", ["$q", "$window", "$timeout", "$http", function($q, $window, $timeout, $http){
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
                $timeout(function(){ //wait for DOM to be ready
                    $window.open(encodeURI(url), "_system", "location=yes");
                });
                
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

            if(isAndroid) {
                appAvailability.check(
                    androidAppId, //android package
                    function(){
                        $timeout(function(){ //wait for DOM to be ready
                            $window.open(encodeURI(url), "_system", "location=yes");
                        });
                        
                        retObj = {
                                "openedLink": url,
                                "appInstalled": true,
                                "diag": "App installed. Opening app url as provided."
                        }
                        
                        d.resolve(retObj);
                    },
                    function(){
                        if(fallbackUrl){
                            $timeout(function(){ //wait for DOM to be ready
                                $window.open(encodeURI(fallbackUrl), "_system", "location=yes");
                            });
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
                        $timeout(function(){ //wait for DOM to be ready
                            $window.open(encodeURI(url), "_system", "location=yes");
                        });
                        
                        retObj = {
                                "openedLink": url,
                                "appInstalled": true,
                                "diag": "App installed. Opening app url as provided."
                        }
                        
                        d.resolve(retObj);
                    },
                    function(){
                        if(fallbackUrl){
                            $timeout(function(){ //wait for DOM to be ready
                                $window.open(encodeURI(fallbackUrl), "_system", "location=yes");
                            });
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
            
            return d.promise;
        },
        getAndroidAppId: function(url){
            var urlArray = url.split(":");
            
            return (urlArray[0] in schemes) ? schemes[urlArray[0]] : undefined;
        }
    }
}]);