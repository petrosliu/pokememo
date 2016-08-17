var pokememo = angular.module('pokememo', []);

function mainController($scope, $http) {
    $scope.formData = {};
    // when landing on the page, get all todos and show them
    $http.get('/api/todos')
        .success(function(data) {
            $scope.todos = data;
            console.log('23' + data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $http.get('/api/pokemons')
        .success(function(data) {
            $scope.pokemons = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}





pokememo.filter('spaceless',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '-');    
        }
    }
});

pokememo.filter('pokeidx',function() {
    return function(input) {
        if (input>=0 && input<=999) {
            return ("000" + input).slice(-3);    
        }
        else return ("???");
    }
});