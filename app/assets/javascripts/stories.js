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

      var monthNames = [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ];

      $scope.storyElementTypes = ['paragraph', 'quotation', 'image'];

      $scope.stories = [];
      $scope.currentStory = null;

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


    }
  ])
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
    }]);
