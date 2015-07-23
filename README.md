# angular dayparts

Angular directive for select hours in a week

Code based on [this StackOverflow answer](http://stackoverflow.com/questions/23163952/how-do-i-capture-table-td-elements-using-mousedown-dragselect-event)


![Sample](sample.jpg)


Include module in your app

```javascript
angular.module('myapp', ['angular-dayparts'])
```


Config the directive inside the controller

```javascript
$scope.options = {
    reset: true, // default false
    onChange: function(selected) {
        console.log('selected: ', selected)
    },
    selected: ['monday-14', 'monday-15'],
    disableRowSelection: true, // default false
    disableColumnSelection: true // default false
};
```


Call the directive from your page

```html
<angular-dayparts options="options"></angular-dayparts>
```


## License

Released under the terms of MIT License.