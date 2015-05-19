'use strict'

var bebberCtrl = angular.module('bebberCtrl', []);

var buildJsonTagsStr = function (tags) {
  return "" 
}

bebberCtrl.controller('detailCtrl', ['$scope', '$http',
    function($scope, $http) {
      
    }]);

bebberCtrl.controller('mainCtrl', ['$scope', '$http', '$route', '$routeParams',
    function($scope, $http, $route, $routeParams) {

      $scope.errorMsg = false;
      $scope.successMsg = false;
      $http.get('/LoadAccFiles/')
        .success(function (data) {
          if (data.Status === 'fail') {
            $scope.errorMsg = true;
            $scope.err = data.Msg;
          } else {
            console.log(data);
            for (var x=0;x < data.AccFiles.length;x++) {
              data.AccFiles[x].FileDoc.CurrTags = [];
              angular.forEach(data.AccFiles[x].FileDoc.SimpleTags, function (value, key) {
                data.AccFiles[x].FileDoc.CurrTags.push(value.Tag);
              });
              angular.forEach(data.AccFiles[x].FileDoc.ValueTags, function (value, key) {
                data.AccFiles[x].FileDoc.CurrTags.push(value.Tag +":"+ value.Value);
              });
              angular.forEach(data.AccFiles[x].FileDoc.RangeTags, function (value, key) {
                var sd = value.Start.split("T")[0].split("-");
                var ed = value.End.split("T")[0].split("-");
                var sDate = sd[2] + sd[1] + sd[0];
                var eDate = ed[2] + ed[1] + ed[0];
                data.AccFiles[x].FileDoc.CurrTags.push(value.Tag +":"+ sDate +".."+ eDate);
              });
              data.AccFiles[x].FileDoc.CurrTags.sort()
            }
            $scope.AccFiles = data.AccFiles;
          }
        })
        .error(function (data, status) {
          $scope.errorMsg = true;
          $scope.err = data;
        });

      $scope.showDetail = function () {
        console.log("details")
      }


    }]);
