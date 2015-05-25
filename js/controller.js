'use strict'

var bebberCtrl = angular.module('bebberCtrl', []);

var getId = function(id, data) {
  var tmp = false;
  angular.forEach(data, function (val, key) {
    if (String(val.Id) === id) {
      tmp = data[key];
      return
    }
  });
  return tmp;
}

bebberCtrl.controller('init', function($scope, $http, accData) {
  $scope.belegnummer = "";

  $scope.sortByDate = function() {
    console.log("bydate");
    $scope.accData = accData;
    $scope.accData.data.sort(function(a, b) {
      var aD = a.AccData.Belegdatum;
      var bD = b.AccData.Belegdatum;
      if (aD < bD) {
        return -1;
      } else if (aD > bD) {
        return 1;
      } else {
        return 0
      }
    });
  }

  $http.get('/LoadAccFiles/')
    .success(function (data) {
      if (data.Status === 'fail') {
        $scope.errorMsg = true;
        $scope.err = data.Msg;
      } else {
        //console.log(data);
        for (var x=0;x < data.AccFiles.length;x++) {
          data.AccFiles[x].FileDoc.CurrTags = [];
          data.AccFiles[x].Id = x;
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
        //$scope.AccFiles = data.AccFiles;
        //accData = data.AccFiles
        $scope.accData = accData
        $scope.accData.data = data.AccFiles
      }
    })
    .error(function (data, status) {
      $scope.errorMsg = true;
      $scope.err = data;
    });

});

bebberCtrl.controller('detailsCtrl', ['$scope', '$routeParams', '$location', 'accData', 'pdfDelegate', '$timeout',
  function($scope, $routeParams, $location, accData, pdfDelegate, $timeout) {
    $scope.params = $routeParams;
    $scope.accData = accData
    $scope.details = getId($routeParams.id, $scope.accData.data);
    $scope.pdfUrl = '/data/'+ $scope.details.FileDoc.Filename;
    $scope.currentPage = 1;

    $timeout(function() { 
      $scope.totalPages = pdfDelegate.$getByHandle('accPdf').getPageCount();
    }, 800);

    $scope.nextPage = function() {
      var pdfDoc = pdfDelegate.$getByHandle('accPdf')
      pdfDoc.next();
      $scope.currentPage = pdfDoc.getCurrentPage();
      $scope.totalPages = pdfDoc.getPageCount();
    }

    $scope.prevPage = function() {
      var pdfDoc = pdfDelegate.$getByHandle('accPdf')
      pdfDoc.prev();
      $scope.currentPage = pdfDoc.getCurrentPage();
      $scope.totalPages = pdfDoc.getPageCount();
    }

    $scope.zoomIn = function() {
      pdfDelegate.$getByHandle('accPdf').zoomIn();
    }

    $scope.zoomOut = function() {
      pdfDelegate.$getByHandle('accPdf').zoomOut();
    }

    $scope.showOverview = function() {
      $location.hash('record'+ $routeParams.id);
      $location.path('/overview');
    }
  }
]);

bebberCtrl.controller('overviewCtrl', ['$scope', '$location', 'accData', '$anchorScroll',
  function($scope, $location, accData, $anchorScroll) {
    $scope.errorMsg = false;
    $scope.successMsg = false;

    if ($location.hash() !== "") {
      $anchorScroll();
    }

    $scope.showDetails = function(id) {
      $location.path('/details/'+ id);
    }

  }
]);
