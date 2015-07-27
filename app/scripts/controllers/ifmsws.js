'use strict';

/**
 * @ngdoc function
 * @name cdoWebApp.controller:IfmswsCtrl
 * @description
 * # IfmswsCtrl
 * Controller of the cdoWebApp
 */
angular.module('cdoWebApp')
  .controller('IfmswsCtrl', ['$scope', '$log', 'RepoAccessService', 'CalculateUrlService', 'ContextService',  function (scope, log, RepoAccessService, CalculateUrlService, ContextService) {
    log.debug("IfmswsCtrl")

    scope.rowCollection = [];

    RepoAccessService.get('/obj/repo/ifms.WebServiceInterface', function (data, status) {

      if (status === 200) {
        var result = data.data

        for (var j = 0; j < result.length; j++) {

          var entry = {};
          entry.icon = CalculateUrlService.getUrl(result[j].icon);
          entry.name = result[j].attributes.name;
          entry.id = result[j].ID;
          entry.description = result[j].attributes.description;
          entry.url = result[j]._links.self.href;
          scope.rowCollection.push(entry);
        }

      } else {

      }

    });

    scope.setNewObject = function(url) {
      ContextService.setSelectedObject(url);
    };
  }]);