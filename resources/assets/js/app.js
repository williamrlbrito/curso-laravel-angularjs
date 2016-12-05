var app = angular.module('app', [
    'ngRoute',
    'angular-oauth2',
    'app.controllers'
]);

angular.module('app.controllers', ['angular-oauth2']);

app.provider('appConfig', function () {
    var config = {
        baseUrl: 'http://localhost:8000'
    };

    return {
        config: config,
        $get: function () {
            return config;
        }
    }
});

app.config(['$routeProvider', 'OAuthProvider', 'appConfigProvider',
    function ($routeProvider, OAuthProvider, appConfigProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'build/views/login.html',
                controller: 'loginController'
            })
            .when('/home', {
                templateUrl: 'build/views/home.html',
                controller: 'homeController'
            })
            .when('/clients', {
                templateUrl: 'build/views/client/index.html',
                controller: 'clientIndexController'
            });

        OAuthProvider.configure({
            baseUrl: appConfigProvider.config.baseUrl,
            clientId: 'appid1',
            clientSecret: 'secret',
            grantPath: 'oauth/access_token'
        });
    }]);

app.run(['$rootScope', '$window', 'OAuth',
    function ($rootScope, $window, OAuth) {
        $rootScope.$on('oauth:error', function (event, rejection) {

            if ('invalid_grant' === rejection.data.error) {
                return;
            }

            if ('invalid_token' === rejection.data.error) {
                return OAuth.getRefreshToken();
            }

            return $window.location.href = '/login?error_reason=' + rejection.data.error;
        });
    }]);