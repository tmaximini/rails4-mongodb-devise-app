angular.module('storiesApp', ['ngResource', 'ngRoute', 'ngUpload', 'ui.sortable'])
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


    // CONTROLLER

  .controller('BackendCtrl', [
    '$scope',
    '$http',
    'Story',
    function ($scope, $http, Story) {

      var monthNames = [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ];

      $scope.storyElementTypes = ['paragraph', 'quotation', 'image'];

      $scope.stories = [];
      $scope.currentStory = null;



      $scope.sortableOptions = {
        axis: 'y',
        update: function() {
          return $scope.updateStory($scope.currentStory);
        }
      };

      $scope.setCurrentStory = function (story) {
        console.log('current story: ', story);
        $scope.currentStory = story;
      };

      $scope.newStory = function () {
        var newStory = new Story();
        newStory.title = "Story_" + ($scope.stories.length + 1);
        var d = new Date();
        newStory.date = monthNames[d.getMonth()] + ' ' + d.getFullYear();
        newStory.elements = [];
        var obj = {
          type: 'paragraph',
          position: 0,
          content: 'lorem ipsum'
        };
        newStory.elements.push(obj);
        newStory.elements = JSON.stringify(newStory.elements);
        newStory.saveOrUpdate(function (story) {
          story.elements = JSON.parse(story.elements);
          $scope.stories.push(story);
        });
      };

      Story.query({}, function (data) {
        data.forEach(function (story) {
          story.elements = JSON.parse(story.elements);
        });
        $scope.stories = data;
      });

      $scope.updateStory = function (story) {
        var _story = jQuery.extend(true, {}, story);
        _story.elements = JSON.stringify(_story.elements);
        _story.saveOrUpdate(function (savedStory) {
          console.log('story was successfully saved!', savedStory);
        });
      };

      $scope.addElement = function (story) {
        var obj = {
          type: 'paragraph',
          position: story.elements.length + 1,
          content: 'lorem ipsum'
        };
        story.elements.push(obj);
      };

      $scope.removeElement = function (index) {
        console.log('removing element ' + index, $scope.currentStory.elements.length);
        $scope.currentStory.elements.splice(index, 1);
        console.log('removed', $scope.currentStory.elements.length, $scope.currentStory.elements);
      }


    }
  ])

    // STORY FACTORY

  .factory('Story', [
    '$resource',
    '$http',
    function ($resource, $http) {

      // public api here
      var Story = $resource(
        '/stories/:id',
        { id: '@id' },
        { update: { method: 'PUT' }}
      );

      Story.prototype.saveOrUpdate = function (callback) {
        if (this._id) {
          console.log('called update', this);
          $http.put('/stories/' + this._id, this)
               .success(callback)
               .error(function (e) { console.log('an error occured', e); });
        } else {
          console.log('called create', this);
          return this.$save(callback);
        }
      };

      return Story;

    }
  ])


    // DIRECTIVES

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
      templateUrl: '../assets/templates/storyList.html',
      link: function (scope, iElement, iAttrs) {

      }
    };
  }])

  .directive('storyForm', [function () {
    return {
      restrict: 'E',
      controller: 'BackendCtrl',
      replace: true,
      templateUrl: '../assets/templates/storyForm.html',
      link: function (scope, iElement, iAttrs) {

      }
    };
  }])

  .directive('contentElementFields', [function () {
    return {
      restrict: 'EA',
      controller: 'BackendCtrl',
      replace: true,
      scope: {
        contentElement: '@'
      },
      templateUrl: '../assets/templates/contentElementFields.html'
    };
  }])

  .directive('paragraphFields', [function () {
    return {
      restrict: 'EA',
      controller: 'BackendCtrl',
      replace: true,
      templateUrl: '../assets/templates/stories/paragraph.html'
    };
  }])

  .directive('quoteFields', [function () {
    return {
      restrict: 'EA',
      controller: 'BackendCtrl',
      replace: true,
      templateUrl: '../assets/templates/stories/quote.html'
    };
  }])

  .directive('imageFields', [function () {
    return {
      restrict: 'EA',
      controller: 'BackendCtrl',
      replace: true,
      templateUrl: '../assets/templates/stories/image.html'
    };
  }])
