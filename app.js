angular.module('formApp', ['ngAnimate', 'ui.router'])

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('form', {
            url: '/form',
            templateUrl: 'html/form.html',
            controller: 'formController'
        })

        .state('form.profile', {
            url: '/title',
            templateUrl: 'html/title.html'
        })

        .state('form.elements', {
            url: '/elements',
            templateUrl: 'html/elements.html'
        })

        .state('form.allowances', {
            url: '/allowances',
            templateUrl: 'html/allowances.html'
        })

        .state('stopwatch', {
            url: '/stopwatch',
            params: {title:null, elements:null, allowances:null},
            templateUrl: 'html/stopwatch.html',
            controller: 'stopwatchController',
        })

        .state('results', {
            url: '/results',
            params: {log: null, title: null, elements: null, allowances: null, log2: null},
            templateUrl: 'html/results.html',
            controller: 'resultsController',
        })

        .state('about', {
            url: '/about',
            templateUrl: 'html/about.html',
            controller: 'aboutController',
        })

        .state('credits', {
            url: '/credits',
            templateUrl: 'html/credits.html',
            controller: 'creditsController',
        })
    $urlRouterProvider.otherwise('/form/title');
})

.controller('formController', function($scope, $state) {
    $("#form").css("display", "flex").hide().fadeIn(1000);
    $scope.formData = {};

    $scope.choices = [{'id': '1'}];

    $scope.addNewChoice = function() {
      var newItemNo = $scope.choices.length+1;
      $scope.choices.push({'id':newItemNo.toString()});
    };

    $scope.removeChoice = function() {
      var lastItem = $scope.choices.length-1;
      $scope.choices.splice(lastItem);
    };

    $scope.formData.elements = $scope.choices;

    $scope.processForm = function() {
        $state.go('stopwatch', $scope.formData);
    };

})

.controller('stopwatchController', function($scope, $stateParams, $interval, $state) {
    $("#stopwatch").css("display", "flex").hide().fadeIn(1000);
    $scope.formData = $stateParams;
    $scope.formData = { title: "qqqq", elements: [{ id: "1", name: "dsad" }, { id: "2", name: "sada" }, { id: "3", name: "adada" }], allowances: "10" };
    $scope.time = {minutes: '00', seconds: '00.0'};
    $scope.running = false;
    $scope.lastElement = false;
    $scope.log = [];
    $scope.log2 = [];
    $scope.cycle = {};
    $scope.cycleNum = 1;

    var time = 0, elapsed = '0.0', currentIndex = 0, elements = [], cycleLog = [], cycleLog2 = [], cycle = 0;

    $scope.formData.elements.forEach(function(data) {
      elements.push(data.name);
    });
    $scope.currentElement = elements[0];
    $scope.lastElementValue = elements[elements.length-1];

    $scope.startStopwatch = function() {
      $scope.running = true;
      $scope.flag = $interval(function() {
          time += 100;
          elapsed = Math.floor(time / 100) / 10;
          if (elapsed % 60 == 0) {
            $scope.time.minutes++;
            if ($scope.time.minutes < 10) {
              $scope.time.minutes = '0' + $scope.time.minutes;
            }
          }
          $scope.time.seconds = Math.round((elapsed%60) * 10) / 10;
          if ($scope.time.seconds < 10) {
            $scope.time.seconds = '0' + $scope.time.seconds;
          }
          if (Math.round($scope.time.seconds) == $scope.time.seconds) $scope.time.seconds += '.0';
      }, 100);
    }

    $scope.pauseStopwatch = function() {
      if ($scope.flag) $interval.cancel($scope.flag);
      $scope.running = false;
    }

    $scope.resetStopwatch = function () {
      if ($scope.flag) $interval.cancel($scope.flag);
      $scope.running = false;
      $scope.time = {minutes: '00', seconds: '00.0'};
      time = 0;
      elapsed = '0.0';
    }

    $scope.nextElement = function () {
      addCycle();
      console.log(elements.length);
      if (currentIndex == elements.length-2) {
        $scope.lastElement = true;
      }
      if (currentIndex > elements.length-2) {
        newCycle();
        console.log(currentIndex);
      }
      else {
        currentIndex++;
        $scope.currentElement = elements[currentIndex];
        $scope.resetStopwatch();
        $scope.startStopwatch();
      }
    }

    $scope.stopStopwatch = function() {
      if (!checkRating()) {
        addCycle();
        resetEverything();
        $state.go('results', {'log': $scope.log, 'title': $scope.formData.title, 'elements': $scope.formData.elements, 'allowances': $scope.formData.allowances, 'log2': $scope.log2});
      }
    }

    function newCycle() {
      if (!checkRating()) resetEverything();
    }

    function checkRating() {
      $scope.cycle.rating = $("#stopwatch input[type='radio']:checked").val();
      if (!$scope.cycle.rating) {
        $scope.errorMessage = true;
        return true;
      } else return false;
    }

    function addCycle() {
      var copyOfTime = angular.copy(time);
      cycleLog.push(msToTime(copyOfTime));
      cycleLog2.push(copyOfTime);
      cycle += copyOfTime;
    }

    function resetEverything() {
      cycleLog.push(msToTime(cycle));
      cycleLog2.push(cycle);
      cycleLog.push(angular.copy($scope.cycle.rating));
      cycleLog2.push(angular.copy($scope.cycle.rating));
      $scope.log.push(angular.copy(cycleLog));
      $scope.log2.push(angular.copy(cycleLog2));
      $scope.errorMessage = false;
      $scope.lastElement = false;
      currentIndex = 0;
      cycleLog = [];
      cycleLog2 = [];
      cycle = 0;
      $scope.cycle = {};
      $scope.currentElement = elements[currentIndex];
      $scope.resetStopwatch();
      $scope.startStopwatch();
      $scope.cycleNum++;
    }
})

.controller('resultsController', function($scope, $stateParams) {
  $("#results").css("display", "flex").hide().fadeIn(1000);
  $scope.input = $stateParams;
  // $scope.input =  {log:[["0.2.8","0.6.3","0.5.1","0.14.2","0.9"],["0.2.7","0.2.4","0.3.5","0.8.6","1.0"]], title: "qqqq", elements: [{ id: "1", name: "dsad" }, { id: "2", name: "sada" }, { id: "3", name: "adada" }], allowances: "10", log2: [[2800,6300,5100,14200,"0.9"],[2700,2400,3500,8600,"0.1"]]};
  $scope.input.elements.push({id: "", name: "Total"});
  $scope.input.elements.push({id: "", name: "Rating"});
  $scope.input.elements.push({id: "", name: "NT"});
  $scope.input.average = [];
  $scope.aveNormalTime = 0;

  var log = $scope.input.log2, sum = 0, aveNormalTime = 0, average = [];

  /* find average time */
  for (var i = 0; i < log[0].length-1; i++) {
    for (var j = 0; j < log.length; j++) {
      sum += parseFloat(log[j][i]);
    }
    $scope.input.average.push(msToTime(sum/j));
    if (i < log[0].length-2) average.push(sum/j);
    sum = 0;
  }
  $scope.input.average.push("-");

  var indexOfMaxValue = average.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
  var indexOfMinValue = average.reduce((iMin, x, i, arr) => x < arr[iMin] ? i : iMin, 0);

  $scope.max = {element: $scope.input.elements[indexOfMaxValue].name, value: msToTime(average[indexOfMaxValue])};
  $scope.min = {element: $scope.input.elements[indexOfMinValue].name, value: msToTime(average[indexOfMinValue])}

  /* find normal time */
  for (var i = 0; i < log.length; i++) {
    var rating = parseFloat(log[i][log[i].length-1]);
    if (rating == '0.1') rating = '1.0';
    var normalTime = rating*log[i][log[i].length-2];
    $scope.input.log[i].push(msToTime(normalTime));
    sum += normalTime;
  }
  $scope.aveNormalTime = msToTime(sum/log.length-1);
  aveNormalTime = sum/log.length-1;
  $scope.standardTime = msToTime(((parseInt($scope.input.allowances)/100)+1)*aveNormalTime);

})

.controller('aboutController', function($scope) {
  $("#about").css("display", "flex").hide().fadeIn(1000);
})

.controller('creditsController', function($scope) {
  $("#credits").css("display", "flex").hide().fadeIn(1000);
});

function msToTime(ms) {
  var seconds = (ms/1000);
  var minutes = parseInt(seconds/60, 10);
  seconds = Math.round(seconds%60 * 100) / 100;
  if (seconds <  10) seconds = '0' + seconds.toString();
  return minutes + '.' + seconds;
};

$(document).ready(function(){
    $('[data-toggle="popover"]').popover();
    console.log($('[data-toggle="popover"]'));
});
