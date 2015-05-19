'use strict'

var bebberApp = angular.module("bebber", [
  "ngRoute",
  "bebberCtrl"
]);


bebberApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/public/angular-tpls/main.html',
        controller: 'mainCtrl'
      }).
      when('/detail/:name', {
        templateUrl: '/public/angular-tpls/detail.html',
        controller: 'detailCtrl'
      });
  }]);

bebberApp.filter('Find', function() {
  return function(input, str) {
    var tmp = {};
    angular.forEach(input, function(val, key) {
      if (val.AccData.Belegnummer.indexOf(str) !== -1) {
        tmp[key] = val;
      }
    });
    return tmp;
  };
})
