'use strict'

var bebberApp = angular.module("bebber", [
  "ngRoute",
  "bebberCtrl",
  "pdf",
]);


bebberApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/public/angular-tpls/main.html',
        controller: 'mainCtrl'
      }).
      when('/details/:id', {
        templateUrl: '/public/angular-tpls/details.html',
        controller: 'detailsCtrl'
      });
  }]);

bebberApp.filter('find', function() {
  return function(input, str) {
    var tmp = {};
    angular.forEach(input, function(val, key) {
      tmp = val.AccData.Belegnummernkreis + val.AccData.Belegnummer;
      //console.log(tmp)
      console.log(val.FileDoc)
      if (tmp.indexOf(str) !== -1 || val.AccData.Belegnummer === "") {
        tmp[key] = val;
      }
    });
    return tmp;
  };
})

bebberApp.factory("accData",function(){
        return {};
});
