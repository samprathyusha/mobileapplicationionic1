// (c) 2014 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

angular.module('ionicNFC', ['ionic', 'nfcFilters'])

    .controller('MainController', function ($scope, $filter, nfcService, lookupService) {

        $scope.tag = nfcService.tag;
        $scope.shipid = '';
        $scope.clear = function() {
            nfcService.clearTag();
        };

        $scope.status = 'notok';

        $scope.checkstatus =function(record) {
            var xx = $filter('decodePayload')(record);
            lookupService.checkIdValid(xx).then(function(status){
                alert(record);
                alert(JSON.stringify(status));
                if(status.status == 'ok')
                    $scope.status = 'ok';
                else 
                    $scope.status = 'check result';

            }, function(error){
                $scope.status="nothappy";
            });
        }

    })

    .factory('lookupService', function ($http) {

        var tag = {};
        return {
            checkIdValid(record){

                return $http.get('http://34.217.27.206:8080/api/manu/' + record).then(function(response) {

                return response.data;

             }, function(error) {
                console.log(error);
             });
            }
        }
        
    })


    .factory('nfcService', function ($rootScope, $ionicPlatform) {

        var tag = {};

        $ionicPlatform.ready(function() {
            nfc.addNdefListener(function (nfcEvent) {
                console.log(JSON.stringify(nfcEvent.tag, null, 4));
                $rootScope.$apply(function(){
                    angular.copy(nfcEvent.tag, tag);
                    // if necessary $state.go('some-route')
                });
            }, function () {
                console.log("Listening for NDEF Tags.");
            }, function (reason) {
                alert("Error adding NFC Listener " + reason);
            });

        });

        return {
            tag: tag,

            clearTag: function () {
                angular.copy({}, this.tag);
            }
        };
    });