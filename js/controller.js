'use strict'

//
// txs steht für Accounting Transactions
//


var bebberCtrl = angular.module('bebberCtrl', []);

var findTx = function(id, txs) {
  var tx = undefined;
  angular.forEach(txs, function(val, key) {
    if ((val.doc_number_range + val.doc_number) === id) {
      console.log('-->', val);
      tx = val;
      return
    }
  });

  return tx
}

bebberCtrl.controller('init', function($scope, $rootScope, $http, txs) {

  $scope.txs = txs;

  $scope.sortByDate = function() {
    $scope.txs.sort(function(a, b) {
      var aD = a.doc_date;
      var bD = b.doc_date;
      if (aD < bD) {
        return -1;
      } else if (aD > bD) {
        return 1;
      } else {
        return 0
      }
    });
  }

  $http.get('/v1/accounting_txs')
    .then(function(resp) {
      console.log(resp)
      angular.forEach(resp.data, function(v, i) {
        $scope.txs.push(v);
      })
    })
    .catch(function(resp) {
      $rootScope.errorMsg = true;
      $rootScope.err = resp.message;
    });

});

bebberCtrl.controller('detailsCtrl', ['$scope', '$rootScope', '$routeParams', '$http', '$location', '$sce', 'txs', function($scope, $rootScope, $routeParams, $http, $location, $sce, txs) {
  $http.get('/v1/vouchers?id=' + $routeParams.id)
    .then(function(resp) {
      console.log(resp);
      if (resp.data.length == 0) {
        throw Error('Cannot find doc');
      }
      $scope.doc = resp.data[0];
      $scope.pdfURL = $sce.trustAsResourceUrl('/pdfviewer/viewer.html?file=/data/' + $scope.doc.name);
    })
    .catch(function(resp) {
      $rootScope.errorMsg = true;
      $rootScope.err = resp.message;
    });

  $scope.tx = findTx($routeParams.id, txs);

  $scope.showOverview = function() {
    $location.hash('tx' + $routeParams.id);
    $location.path('/overview');
  }
}
]);

bebberCtrl.controller('overviewCtrl', ['$scope', '$location', 'txs', '$anchorScroll', function($scope, $location, txs, $anchorScroll) {
  $scope.errorMsg = false;
  $scope.successMsg = false;

  if ($location.hash() !== "") {
    $anchorScroll();
  }

  $scope.showDetails = function(tx) {
    $location.path('/details/' + tx.doc_number_range + tx.doc_number);
  }

}
]);
