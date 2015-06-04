angular.module('angular-dayparts', [])
.directive('angularDayparts', ['$window', '$document', function ($window, $document) {
    return {
        restrict: 'E',
        scope: {
            options: '=?'
        },
        templateUrl: '/src/template.html',
        controller: function($scope, $element, $attrs) {


            var klass = 'selected';
            var startCell = null;
            var isDragging = false;
            var selected = [];
            var isStartSelected = false;
            var selectedForAPI = [];
            $scope.days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            $scope.hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

            if (!$scope.options.reset === undefined) {
                $scope.options.reset = true;
            }


            function mouseUp(el) {
                if (!isDragging) {
                    return;
                }
                isDragging = false;
                dataForAPI();
                onChangeCallback();
            }


            function onChangeCallback () {
                if ($scope.options && $scope.options.onChange) {
                    $scope.options.onChange(selectedForAPI);
                }
            }


            function dataForAPI () {
                var newSelected = selected.map(function(item){
                    var a = item.split('-');
                    return {
                        day: a[0],
                        hour: parseInt(a[1])
                    };
                });

                selectedForAPI = [];

                newSelected = _.sortBy(( _.sortBy(newSelected, 'hour')), 'day');

                newSelected.forEach(function(item){

                    if (!_.contains(_.pluck(selectedForAPI, 'day'), item.day)) {
                        var b = {
                            day: item.day,
                            start_hour: item.hour,
                            end_hour: item.hour + 1
                        };
                        selectedForAPI.push(b);
                    } else {

                        var days = _.where(selectedForAPI, {day: item.day});
                        var push = false;

                        days.forEach(function (day) {
                            // Check if consecutive
                            if (day.start_hour - 1 === item.hour || day.end_hour + 1 === item.hour + 1) {
                                push = false;
                                if (day.start_hour > item.hour) {
                                    day.start_hour = item.hour;
                                }
                                if (day.end_hour < item.hour + 1) {
                                    day.end_hour = item.hour + 1;
                                }
                            } else {
                                push = true;
                            }
                        });

                        if (push) {
                            var b = {
                                day: item.day,
                                start_hour: item.hour,
                                end_hour: item.hour + 1
                            };
                            selectedForAPI.push(b);
                        }
                    }
                });
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


            $scope.reset = function () {
                selected = [];
                selectedForAPI = [];
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