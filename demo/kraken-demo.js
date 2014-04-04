angular.module('krakenDemo', ['ks.kraken-drop']);

angular.module('krakenDemo').controller('KrakenCtrl', ['$scope', function ($scope) {
  $scope.tags = [{tag: 'Blues'}, {tag: 'House'}, {tag: 'Country'}, {tag: 'R & B'}];
  $scope.days = [{day: 'Monday', tags: []}, {day: 'Tuesday', tags: []}, {day: 'Wednesday', tags: []}];

  $scope.falseFn = function () {
    return false;
  };

  $scope.noDupes = function (index) {
    var day = $scope.days[index];
    return function (tag) {
      var i;
      for (i = 0; i < day.tags.length; i++) {
        if (tag.tag === day.tags[i].tag) {
          return false;
        }
      }
      return true;
    };
  };

  $scope.deleteTag = function (index, tag) {
    var day = $scope.days[index], i;
    for (i = 0; i < day.tags.length; i++) {
      if (tag === day.tags[i].tag) {
        day.tags.splice(i, 1);
        break;
      }
    }
  };
}]);

