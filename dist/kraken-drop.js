/**
 * angular-kraken-drop v0.1.0
 * Copyright (c) 2014 Ken Sheedlo
 * @license MIT
 *
 * Made with love in Colorado by @kensheedlo
 */
(function (angular) {
'use strict';
function normalizeOptions (scope, attr) {
  var options;

  options = {
    duplicate: attr.hasOwnProperty('ksKrakenDuplicate'),
    accept: scope.$eval(attr.ksKrakenAccept),
    cancel: attr.ksKrakenCancel,
    handle: attr.ksKrakenHandle
  };
  if (attr.ksKrakenOpts) {
    angular.extend(options, scope.$eval(attr.ksKrakenOpts));
  }
  return options;
}

function addDragData(collection, item, key) {
  if (angular.isArray(collection)) {
    collection.push(item);
  } else {
    collection[key] = item;
  }
}

function deleteKey(collection, key) {
  if (angular.isArray(collection)) {
    collection.splice(key, 1);
  } else {
    delete collection[key];
  }
}

angular.module('ks.kraken-drop', []).directive('ksKraken', ['$compile', function ($compile) {
  
  var krakenKey = 0,
    dragData = null;

  return {
    restrict: 'A',
    compile: function (tElement, tAttr) {
      var expression = tAttr.ksKraken,
        match = expression.match(/^\s*(.+)\s+in\s+(.*?)\s*$/),
        template = tElement.html(),
        collectionIdentifier,
        keyIdentifier,
        valueIdentifier;

      if (!match) {
        throw new Error("[ks.kraken:badexpr] Expected ksKraken in form of " +
          "'_item_ in _collection_', but got '" + expression + "'.");
      }

      collectionIdentifier = match[2];
      match = match[1].match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);

      valueIdentifier = match[3] || match[1];
      keyIdentifier = match[2] || '$index';

      // wrap text nodes
      try {
        template = angular.element(template.trim());
        if (template.length === 0) {
          throw new Error('');
        }
      }
      catch (e) {
        template = angular.element('<span>' + template + '</span>');
      }

      tElement.html('');

      return function ($scope, $element, $attrs) {
        var options = normalizeOptions($scope, $attrs),
          accept,
          draggableConfig,
          droppableConfig,
          oldScopes,
          reloadContents,
          instanceKey = krakenKey++;
        
        accept = function (key) {
          if (key === instanceKey) {
            return false;
          }
          return options.accept ? options.accept(dragData.item) : true;
        };

        $element.droppable({
          drop: function (event, ui) {
            var key = ui.draggable.data('krakenkey');
            if (accept(key)) {
              $scope.$apply(function () {
                addDragData($scope.$eval(collectionIdentifier), dragData.item, dragData.key);
                dragData = null;
              });
            }
          }
        });

        draggableConfig = function (item, key) {
          var config = {
            revert: true,
            revertDuration: 0,
            zIndex: 99999,
            start: function () {
              dragData = {item: item, key: key};
            },
            stop: function () {
              if (!dragData && !options.duplicate) {
                $scope.$apply(function () {
                  deleteKey($scope.$eval(collectionIdentifier), key);
                });
              }
            }
          };
          if (options.cancel) {
            config.cancel = options.cancel;
          }
          if (options.handle) {
            config.handle = options.handle;
          }
          return config;
        };

        reloadContents = function () {
          angular.forEach(oldScopes, function (scope) {
            scope.$destroy();
          });
          oldScopes = [];

          $element.html('');
          angular.forEach($scope.$eval(collectionIdentifier), function (item, index) {
            var elt = template.clone(),
              scope = $scope.$new();

            scope[valueIdentifier] = item;
            scope[keyIdentifier] = index;
            $compile(elt)(scope);
            elt.draggable(draggableConfig(item, index));
            elt.data('krakenkey', instanceKey);
            $element.append(elt);
            oldScopes.push(scope);
          });
        };

        $scope.$watchCollection(collectionIdentifier, function () {
          reloadContents();
        });
      };
    }
  };
}]);


})(angular);