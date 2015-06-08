angular.module('angular-dayparts', [])
.directive('angularDayparts', ['$window', '$document', '$timeout', function ($window, $document, $timeout) {
    return {
        restrict: 'E',
        scope: {
            options: '=?'
        },
        templateUrl: 'template.html',
        controller: function($scope, $element, $attrs) {

            $scope.options = $scope.options || {};
            $scope.options.reset = ($scope.options.reset === undefined) ? true : $scope.options.reset;

            $scope.days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            $scope.hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

            var klass = 'selected';
            var startCell = null;
            var isDragging = false;
            var selected = [];
            var isStartSelected = false;


            if ($scope.options.selected) {
                $timeout(function(){
                    repopulate($scope.options.selected);
                }, 100);
            }


            function mouseUp(el) {
                if (!isDragging) {
                    return;
                }
                isDragging = false;
                onChangeCallback();
            }


            function onChangeCallback () {
                if ($scope.options && $scope.options.onChange) {
                    $scope.options.onChange(selected);
                }
            }


            function mouseDown(el) {
                isDragging = true;
                setStartCell(el);
                setEndCell(el);
            }


            function mouseEnter(el) {
                if (!isDragging) {
                    return;
                }
                setEndCell(el);
            }


            function setStartCell(el) {
                startCell = el;
                isStartSelected = _.contains(selected, el.data('time'));
            }


            function setEndCell(el) {
                cellsBetween(startCell, el).each(function() {
                    var el = angular.element(this);

                    if (!isStartSelected) {
                        el.addClass(klass);
                        if (!_.contains(selected, el.data('time'))) {
                            selected.push(el.data('time'));
                        }
                    } else {
                        el.removeClass(klass);
                        selected = _.without(selected, el.data('time'));
                    }
                });
            }


            function cellsBetween(start, end) {
                var coordsStart = getCoords(start);
                var coordsEnd = getCoords(end);
                var topLeft = {
                    column: $window.Math.min(coordsStart.column, coordsEnd.column),
                    row: $window.Math.min(coordsStart.row, coordsEnd.row),
                };
                var bottomRight = {
                    column: $window.Math.max(coordsStart.column, coordsEnd.column),
                    row: $window.Math.max(coordsStart.row, coordsEnd.row),
                };
                return $element.find('td').filter(function() {
                    var el = angular.element(this);
                    var coords = getCoords(el);
                    return coords.column >= topLeft.column
                        && coords.column <= bottomRight.column
                        && coords.row >= topLeft.row
                        && coords.row <= bottomRight.row;
                });
            }


            function getCoords(cell) {
                var row = cell.parents('row');
                return {
                    column: cell[0].cellIndex, 
                    row: cell.parent()[0].rowIndex
                };
            }


            function repopulate () {
                selected = _.clone($scope.options.selected);
                $element.find('td').each(function(i, el){
                    if (_.contains(selected, $(el).data('time'))) {
                        $(el).addClass(klass);
                    }
                });
            }


            $scope.reset = function () {
                selected = [];
                $element.find('td').each(function(i, el){
                    $(el).removeClass(klass);
                });
                onChangeCallback();
            };


            function wrap(fn) {
                return function() {
                    var el = angular.element(this);
                    $scope.$apply(function() {
                        fn(el);
                    });
                }
            }


            $element.delegate('td', 'mousedown', wrap(mouseDown));
            $element.delegate('td', 'mouseenter', wrap(mouseEnter));
            $document.delegate('body', 'mouseup', wrap(mouseUp));
        }
    }
}]);

(function(module) {
try {
  module = angular.module('angular-dayparts');
} catch (e) {
  module = angular.module('angular-dayparts', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template.html',
    '<div class="dayparts">\n' +
    '\n' +
    '    <table border="0" cellspacing="0" cellpadding="0">\n' +
    '        <tr>\n' +
    '            <th></th>\n' +
    '            <th ng-repeat="hour in hours"><span ng-show="hour !== 0">{{hour}}</span></th>\n' +
    '        </tr>\n' +
    '        <tr ng-repeat="day in days">\n' +
    '            <th>{{day}}</th>\n' +
    '            <td ng-repeat="hour in hours" data-time="{{day}}-{{hour}}"></td>\n' +
    '        </tr>\n' +
    '    </table>\n' +
    '\n' +
    '    <button type="button" ng-click="reset()" ng-if="options.reset">Reset</button>\n' +
    '\n' +
    '</div>');
}]);
})();