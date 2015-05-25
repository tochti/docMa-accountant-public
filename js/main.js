'use strict'

var bebberApp = angular.module("bebber", [
  "ngRoute",
  "bebberCtrl",
  "pdf",
]);

bebberApp.run(['$anchorScroll', function($anchorScroll) {
  $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels
}]);


bebberApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/overview', {
        templateUrl: '/public/angular-tpls/overview.html',
        controller: 'overviewCtrl'
      }).
      when('/details/:id', {
        templateUrl: '/public/angular-tpls/details.html',
        controller: 'detailsCtrl'
      }).
      otherwise({
        redirectTo: '/overview',
      });
  }]);

bebberApp.filter('find', function() {
  return function(input, str) {
    var tmp = [];
    if (str === "") {
      return input;
    }
    angular.forEach(input, function(val, key) {
      var number = val.AccData.Belegnummernkreis + val.AccData.Belegnummer;
      if (number.indexOf(str) !== -1) {
        tmp.push(val);
      }
    });
    return tmp;
  };
});

bebberApp.filter('euro', function() {
  return function(price) {
    return price.formatMoney(2, ',', '.') + ' €'
  }
});

bebberApp.factory("accData",function(){
        return {};
});

Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };
