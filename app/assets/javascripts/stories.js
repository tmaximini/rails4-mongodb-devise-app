angular.module('storiesApp', ['ngResource', 'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {

    //$routeProvider
    //  .when('/list', {
    //    templateUrl: '../templates/storiesIndex.html',
    //    controller: 'BackendCtrl'
    //  })
    //  .otherwise({
    //    redirectTo: '/'
    //  });

  }])
  .controller('BackendCtrl', [
    '$scope',
    'Story',
    function ($scope, Story) {

      $scope.stories = [];

      $scope.newStory = function () {
        var newStory = new Story();
        newStory.title = "Story_" + ($scope.stories.length + 1);
        newStory.date = new Date();
        var obj = {
          type: 'paragraph',
          position: 0,
          content: 'lorem ipsum'
        };
        newStory.elements = JSON.stringify(obj);
        newStory.$save(function (story) {
          $scope.stories.push(story);
        });

      };

      Story.query({}, function (data) {
        data.forEach(function (story) {
          story.elements = JSON.parse(story.elements);
        });
        $scope.stories = data;
      });


    }
  ])
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
  ])
  .directive('numberOfStories', [function () {
    return {
      restrict: 'A',
      controller: 'BackendCtrl',
      replace: true,
      template: '<span ng-model="stories">{{stories.length}}</span>',
      link: function (scope, iElement, iAttrs) {

      }
    };
  }])
  .directive('storyList', [function () {
    return {
      restrict: 'E',
      controller: 'BackendCtrl',
      replace: true,
      scope: {
        stories: '@'
      },
      templateUrl: '../assets/templates/storyList.html',
      link: function (scope, iElement, iAttrs) {

      }
    };
  }]);
