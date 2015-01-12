'use strict';

/**
 * @ngdoc function
 * @name cdoWebApp.controller:RepoTreeCtrl
 * @description
 * # RepoTreeCtrl
 * Controller of the cdoWebApp
 */
angular.module('cdoWebApp')
  .controller('RepoTreeCtrl', function ($rootScope, $scope, $log, TreeModelService, RepoAccessService, ContextService) {
    var newId = 0;
    var repoTree = this;

    repoTree.newNode = {};

    //repoTree.selectedObject;

    repoTree.treeConfig = {
      core : {
        multiple : false,
        animation: true,
        themes : {
          dots : false,
          variant: 'small'
        },
        /* jshint camelcase:false */
        check_callback : true,
        /* jshint camelcase:true */
        worker : true
      },
      plugins : [ 'wholerow' ],
      version : 1
    };

    repoTree.readyCB = function() {
      $log.debug('RepoTreeCtrl.readyCB');

      if ($rootScope.globals.currentUser !== undefined) {

        RepoAccessService.get('/node?crefs', function (data, status) {
          if (status === 200) {
            repoTree.treeData.length = 0;

            if (data.data.references.contents !== undefined) {

              var children = TreeModelService.transformChildren(data.data.references.contents, '#');
              children.forEach(function(node) {
                repoTree.treeData.push(node);

                RepoAccessService.get(node.url + '/references?crefs', function (data, status) {
                  if (status === 200) {

                    var children = TreeModelService.transformChildren(data.data, node.id);
                    children.forEach(function(node) {
                      repoTree.treeData.push(node);
                    });
                    node.resolved = true;
                  } else if (status === 404) {
                    node.resolved = true;
                  }
                });
              });
            }
          }
        });
      }
    };

    repoTree.selectNodeCB = function(e, item) {
      repoTree.selectedObject = item.node.data;
      $log.debug('RepoTreeCtrl.selectNodeCB - ' + item.node.id);
      ContextService.setSelectedObject(repoTree.selectedObject);

      //$scope.$apply();
    };

    repoTree.applyModelChanges = function() {
      $log.debug('RepoTreeCtrl.applyModelChanges');
      return true;
    };

    repoTree.isAddNodeDisabled = function() {
      if (repoTree.newNode.parent === undefined) {
        return true;
      }
      if (repoTree.newNode.text === undefined) {
        return true;
      }
      return false;
    };

    repoTree.beforeOpenNodeCB = function(e, item) {
      $log.debug('RepoTreeCtrl.beforeOpenNodeCB - ' + item.node.id);
    };

    repoTree.openNodeCB = function(e, item) {
      $log.debug('RepoTreeCtrl.openNodeCB - ' + item.node.id);

      repoTree.treeData.forEach(function(entry) {
        if (entry.parent.id === item.node.id && entry.resolved === false) {
          $log.debug('>> resolve childen');

          RepoAccessService.get(entry.url + '/references?crefs', function (data, status) {
            if (status === 200) {

              var children = TreeModelService.transformChildren(data.data, entry.id);
              children.forEach(function(node) {
                repoTree.treeData.push(node);
              });
              entry.resolved = true;
            } else if (status === 404) {
              entry.resolved = true;
            }
          });
        }
      });

    };

    repoTree.addNewNode = function() {
      repoTree.treeData.push({ id : (newId++).toString(), parent : repoTree.newNode.parent, text : repoTree.newNode.text });
    };

    repoTree.treeData = [];

    $scope.$on('repoRootNodeUpdated', function (scope, data) {
      $log.debug('RepoTreeCtrl.repoRootNodeUpdated - received event');

      repoTree.treeData.length = 0;
      var children = TreeModelService.transformChildren(data.data.references.contents, '#');
      children.forEach(function(node) {
        repoTree.treeData.push(node);
        RepoAccessService.get(node.url + '/references?crefs', function (data, status) {
          if (status === 200) {

            var children = TreeModelService.transformChildren(data.data, node.id);
            children.forEach(function(node) {
              repoTree.treeData.push(node);
            });
            node.resolved = true;
          } else if (status === 404) {
            node.resolved = true;
          }
        });
      });
    });

  });