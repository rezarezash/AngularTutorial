var todoApp = angular.module("TodoApp", ["ngResource"]).config(function ($routeProvider) {
    $routeProvider.when('/', { controller: ListCtrl, templateUrl: 'List.html' })
    $routeProvider.when('/new', { controller: CreateCtrl, templateUrl: 'Details.html' })
    $routeProvider.when('/edit/:editId', { controller: EditCtrl, templateUrl: 'Details.html' }).
            otherwise({ redirectTo: '/' });
});
todoApp.factory('Todo', function ($resource) {
    return $resource('/api/Todo/:id', { id: '@id' }, { update: { method: 'PUT' } });
});

var EditCtrl = function ($scope, $location, $routeParams, Todo) {
    $scope.action = "Update ";
    var id = $routeParams.editId;
    $scope.item = Todo.get({ id: id });
    $scope.save = function () {
        Todo.update({ id: id }, $scope.item, function () {
            $location.path('/');
        });
    }
};
var CreateCtrl = function ($scope, $location, Todo) {
    $scope.action = "Add ";
    $scope.save = function () {
        //if ($scope.item.$valid) {            
        Todo.save($scope.item, function () {
            $location.path('/');
        });
        //}        
    }
};

var ListCtrl = function ($scope, $location, Todo) {
    $scope.search = function () {
        Todo.query({ q: $scope.query, sort: $scope.sort_Order, desc: $scope.is_Desc, offset: $scope.offset, limit: $scope.limit },
            function (data) {
                if (data.length > 0)
                    $scope.moreData = true;
                else
                    $scope.moreData = false;

                $scope.todoes = $scope.todoes.concat(data);
            });
    };

    $scope.reset = function () {
        $scope.limit = 20;
        $scope.offset = 0;
        $scope.todoes = [];
        $scope.moreData = true;
        $scope.search();
    }
    $scope.show_more = function () {
        $scope.offset += $scope.offset + $scope.limit;
        $scope.search();
    };

    $scope.sort = function (column) {
        if ($scope.sort_Order == column) {
            $scope.is_Desc = !$scope.is_Desc;
        }
        $scope.sort_Order = column;
        $scope.reset();
    };
    $scope.filter = function () {
        $scope.reset();
    }


    $scope.has_more = function () {
        return $scope.moreData;
    };

    $scope.delete = function () {
        var id = this.item.Id;
        Todo.delete({ id: id }, function () {
            $('#todo_' + id).fadeOut();
        });
    };
    $scope.is_Desc = true;
    $scope.sort_Order = "Id";
    $scope.query = "";

    $scope.reset();
};
