var app = angular.module('myApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when('/home/:uname', {
        templateUrl: 'views/home.html',
        controller: 'homeController',
        resolve: ['authService', function (authService) {
            return authService.isLoggedInFn()
        }]
    }).when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginController',
        resolve: ['authService', function (authService) {
            return authService.isLoggedInFn(true)
        }]
    }).when('/register', {
        templateUrl: 'views/register.html',
        controller: 'registerController',
        resolve: ['authService', function (authService) {
            return authService.isLoggedInFn(true)
        }]
    }).when('/post', {
        templateUrl: 'views/post.html',
        controller: 'postJobController',
        resolve: ['authService', function (authService) {
            return authService.isLoggedInFn()
        }]
    }).when('/searchjob', {
        templateUrl: 'views/search.html',
        controller: 'searchJobController',
        resolve: ['authService', function (authService) {
            return authService.isLoggedInFn()
        }]
    })
});



app.factory('authService', function ($q, $location, loginService) {
    var isLoggedInService = {};

    isLoggedInService.isLoggedInFn = function (success) {
        var Promise = $q.defer();
        var flg = loginService.isLoggedIn.flg;

        if (!flg) {
            if (!success) {
                $location.path('/login');
            }
            Promise.resolve();
        } else {
            if (success) {
                $location.path('/home');
            }
            Promise.resolve();
        }
        return Promise.promise;
    }

    return isLoggedInService;

});

app.controller('mainController', ['$scope', '$rootScope', '$location', 'loginService', function ($scope, $rootScope, $location, loginService) {
    $scope.$on('checkUserType', function (err, data) {
        console.log(data);
        $scope.isLoggedIn = true;
        $scope.toggleEmployee = data.selecteduser;
    });
    $scope.logout = function () {
        loginService.isLoggedIn = {
            flg: false,
            name: null
        };
        $scope.isLoggedIn = false;
    }
    $scope.search = function () {
        $location.path('/search');
    };
    $scope.post = function () {
        $location.path('/post');
    }
}]);

app.service('loginService', function () {
    this.isLoggedIn = {
        flg: false,
        name: null
    }
});

app.controller('registerController', ['$scope', '$rootScope', '$http', '$location', 'loginService', function ($scope, $rootScope, $http, $location, loginService) {
    $scope.options = ['Company', 'Job Seeker'];
    $scope.form1 = {};

    $scope.registerNewEmployee = function () {
        $http.post('http://localhost:1200/register', $scope.form1).then(function (response) {
            console.log(JSON.stringify(response, undefined, 2));
            $location.path('/login');
        });
    };
}]);

app.controller('loginController', ['$scope', '$rootScope', '$http', '$location', 'loginService', function ($scope, $rootScope, $http, $location, loginService) {
    $scope.formLogin = {};
    $scope.login = function () {
        $http.post('http://localhost:1200/login', $scope.formLogin).then(function (response) {
            loginService.isLoggedIn = response.data;
            if (response.data.flg == true) {
                $location.path('/home/' + response.data.name);
                $rootScope.isLoggedIn = true;
            } else {
                $location.path('/login');
                $scope.formLogin = {};
            }
        });
    };
}]);

app.controller('homeController', ['$scope', '$http', '$routeParams', 'loginService', function ($scope, $http, $routeParams, loginService) {
    var uname = $routeParams.uname;
    $scope.employee = {};
    $http.get('/getEmployee/' + uname).then(function (response) {
        if (response.data.flg == true) {
            $scope.employee = response.data.doc[0];
            $scope.selectedUser = response.data.doc[0].selecteduser;
            console.log($scope.employee);
            $scope.$emit('checkUserType', {
                flg: true,
                selecteduser: response.data.doc[0].selecteduser
            });
        }
    });
}]);

app.controller('postJobController', ['$scope', '$http', function ($scope, $http) {
    $scope.postNewJob = {};

    $scope.postJob = function () {
        $scope.postNewJob.keyword = $scope.allKeywords.split(',');
        for (var i = 0; i < $scope.postNewJob.keyword.length; i++) {
            $scope.postNewJob.keyword[i] = $scope.postNewJob.keyword[i].trim();
        }
        $http.post('http://localhost:1200/post', $scope.postNewJob).then(function (response) {
            if (response.data) {
                console.log(response.data);
            } else {
                $scope.postNewJob = {};
            }
        });
    }
}]);


app.controller('searchJobController', ['$scope','$http',function ($scope,$http){

$scope.search = function( searchbykeyword) {
   
    if (searchby.keyword) {
        $scope.advancedSearchFilter = {}; 
        
        if (searchbyKeyword) {
            $scope.advancedSearchFilter.keyword = searchbyKeyword; 
        }
       
        app.searchLimit = undefined; 
    }
    $http.post('http://localhost:1200/search', $scope.searchby).then(function (response) {
        if (response.data) {
            $scope.searchedItems = response.data;
            console.log($scope.show);
        }
    });
};

}]);

app.directive('search', function () {
    return {
        templateUrl: 'views/show.html'
    }
});
