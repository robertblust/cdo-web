'use strict';

/**
 * @ngdoc function
 * @name cdoWebApp.controller:DbCtrl
 * @description
 * # DbCtrl
 * Controller of the cdoWebApp
 */
angular.module('cdoWebApp')
  .controller('DbCtrl', function ($rootScope, $scope, $state, $log, RepoAccessService, CalculateUrlService, ContextService) {
    $scope.rowCollection = [];

    RepoAccessService.get('/obj/repo/db.Table', function (data, status) {

      if (status === 200) {
        var result = data.data

        for (var j = 0; j < result.length; j++) {

          var entry = {};
          entry.icon = CalculateUrlService.getUrl(result[j].icon);
          entry.name = result[j].attributes.name;
          entry.id = result[j].attributes.ID;
          entry.description = result[j].attributes.description;
          entry.url = result[j]._links.self.href;
          $scope.rowCollection.push(entry);
        }

      } else {

      }

    });

    $scope.setNewObject = function(url) {
      ContextService.setSelectedObject(url);
    };


    $scope.$on('objectSelected', function (scope, data, status) {

      $scope.selectedObject = data;
      $log.debug('DbCtrl.objectSelected - received event - id ' + $scope.selectedObject.id);

      $scope.status = status;
      $log.debug('>> set status to scope - ' + status.status);
    });

    $scope.$on('updateSelectedObject', function (scope, data) {
      $scope.selectedObject = data;
      $log.debug('DbCtrl.updateSelectedObject - received event');
    });
  });
