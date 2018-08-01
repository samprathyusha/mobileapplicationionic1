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

// .controller('MainController', function ($scope, nfcService) { 
    //adding services to use filters

    .controller('MainController', function ($scope, $filter, nfcService, $timeout,
        lookupService) {
            
            $scope.ok='';
            $scope.checked = false;
           $scope.tag = nfcService.tag;
           $scope.timeInMs = 0;
           $scope.status = '';
           $scope.tagid=false;

           
          
testok = function()
{
  $scope.checked = true;
   $scope.ok= true;
   $timeout($scope.reset, 3000);
   
}
testnotok=function(){
    $scope.checked=true;
    $scope.ok=false;
    $timeout($scope.reset, 3000);
}
$scope.reset=function(){
    //nfcService.clearTag();
    $scope.tag.id=false;
    $scope.checked=false;
    $scope.status='';
    

}
        $scope.clear = function() {
            nfcService.clearTag();
            $ionicHistory.clearCache();
             $scope.status = '';
             $scope.tagid='';
            $scope.checked = false;
            

        };
    
       $scope.checkstatus =function(record) {
    


        //alert("record="+record);
        var xx = $filter('decodePayload')(record);
      //  alert("xx="+xx);
    lookupService.checkIdValid(xx).then(function(status1){
        
    
         //    alert("status="+status);
               // alert(JSON.stringify(status));
                if(status1.status == 'ok'){
                    
                $scope.status = 'ok';
                
                testok();
                
                  
                }
              else {
                
                    $scope.status = 'notok';
                    testnotok();
                    
                   
                    
                 }
               //  $timeout($scope.clear, 10000);
                 
                    

            }, function(error){
                alert('network error');
                $scope.status="Network error";
                $scope.reset();
            });
        }
        })

    
    .factory('lookupService', function ($http) {

        var tag = {};
        return {
            checkIdValid(record){

                return $http.get('http://34.210.171.193:8080/api/manu/' + 
                record).then(function(response) {

                return response.data;

             }, function(error) {
                 alert("దయచేసి మీ ఇంటర్నెట్ కనెక్షన్ సరిచూసుకోండి");
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