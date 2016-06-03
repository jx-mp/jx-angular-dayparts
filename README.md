# angular dayparts

Angular directive for select hours in a week

Code based on [this StackOverflow answer](http://stackoverflow.com/questions/23163952/how-do-i-capture-table-td-elements-using-mousedown-dragselect-event)


![Sample](sample.jpg)


Install it with Bower or npm

```bash
bower install jx-angular-dayparts
```
```bash
npm install jx-angular-dayparts
```


Include the module in your app

```javascript
angular.module('myapp', ['angular-jx-dayparts'])
```


Configure the directive inside the controller

```javascript
$scope.options = {
    // Reset button
    reset: true, // default false

    // text to Reset button
    textReset: 'Restore', // default Reset

    //labels to show in days column and genrate days
    labelsDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
    //default [{name: 'monday', position: 1, label: 'monday'}, {name: 'tuesday', position: 2, label: 'tuesday'}, {name: 'wednesday', position: 3, label: 'wednesday'}, {name: 'thursday', position: 4, label: 'thursday'}, {name: 'friday', position: 5, label: 'friday'}, {name: 'saturday', position: 6, name: 'saturday'}, {name: 'sunday', position: 7, label: 'sunday'}]
    // Event triggered when selecting a cell
    onChange: function(selected) {
        console.log('selected: ', selected)
    },
    
    // Prepopulated cells
    selected: ['monday-14', 'monday-15'],
    
    // When true clicking on the day name it will select the entire row
    disableRowSelection: true, // default false
    
    // When true clicking on the hour it will select the entire columns
    disableColumnSelection: true // default false
};
```


Call the directive from your page

```html
<angular-dayparts options="options"></angular-dayparts>
```


## License

Released under the terms of MIT License.