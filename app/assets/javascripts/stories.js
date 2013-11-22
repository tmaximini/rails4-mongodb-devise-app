angular.module('storiesApp', ['ngResource', 'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {

    $routeProvider
      .when('/list', {
        templateUrl: '../templates/storiesIndex.html',
        controller: 'BackendCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

  }])
  .controller('BackendCtrl', function ($scope) {

    $scope.stories = [];

    Story.query({}, function (data) {
      $scope.stories = data;
    });



    console.log($scope.test);

  })
  .factory('Story', [
    '$resource',
    '$http',
    function ($resource, $http) {

      // public api here
      return $resource(

        '/stories/:id',
        { id: '@id' },
        { update: { method: 'PUT' }}

      );
    }
  ]);
