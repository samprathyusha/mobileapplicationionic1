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

var app=angular.module('ionicNFC', ['ionic', 'nfcFilters','ngCordova'])

// .controller('MainController', function ($scope, nfcService) { 
    //adding services to use filters



    app.controller('MainController', function ($scope, $filter,$cordovaBarcodeScanner,$http,LoginService,RegisterService, nfcService, lookupService,lookService) {
        $scope.form={};
        
            $scope.valid=false;
            $scope.test=false;
            $scope.ok='';
            $scope.checked = false;
            $scope.tag = nfcService.tag;
            $scope.timeInMs = 0;
            $scope.status = '';
            $scope.tagid=false;
            $scope.validtamper=false;
            
            // $scope.login=true;
            //         $scope.store=false;
            //          $scope.code=true;
           //var x1=$filter('decodePayload')(record);
           //alert(x1);
        //    $scope.$on('$ionicView.enter', function() {
        //     alert('Controller entered');
        //     });            
         

            if (window.localStorage.getItem("phonenumber") === null && window.localStorage.getItem("password") === null) {
        
                    console.log('DENY');
                    alert('Deny');
                    
                
             }
            else if (window.localStorage.getItem("phonenumber") !== null && window.localStorage.getItem("password") !== null) {
                //console.log('Next route: ', toState.name); 
                
                 console.log('ALLOW');
                     alert('Allow');
                    
                     $scope.login=true;
                    $scope.store=false;
                    $scope.code=true;
                    $scope.tagid='';
                    $scope.moving=false;
                   
                    
                
             }
         else {
                    
             }







             $scope.scanBarcode = function(){
                $cordovaBarcodeScanner.scan().then(function(imageData){
                    $scope.g1=imageData.text;
                    $scope.barcode=$scope.g1;


               // $scope.dataforce=true;
              alert(imageData.text);

              console.log("format"+imageData.format);
                },function(error){
              console.log("an error happened"+error);
                });
              }

   
              $scope.submitForm = function(barcode,nfc,uid,productid,trackingid,dealerid,retailerid,compositeid,stamp){
                  alert(barcode+","+nfc+","+uid+","+productid+","+trackingid+","+dealerid+","+retailerid+","+compositeid+","+stamp);
                  var address1=window.localStorage.getItem("validAddress");
                  alert(address1);
                  var DataToSent={
                      barcode:barcode,
                    data:nfc,
                    uid:uid,
                    productid:productid,
                    trackingid:trackingid,
                    dealerid:dealerid,
                    retailerid:retailerid,
                    compositeid:compositeid,
                    stamp:stamp,
                    validAddress:address1

                  }
                 // var den=JSON.stringify(DataToSent);
                alert(DataToSent);
                //alert(den);
                
            $http.post('http://192.168.0.142:8090/api/me',DataToSent).then(function(response) {
                alert(response.status);
                if(response.status='productdatainserted'){
                    alert('the data found');
                    
                    
                    
                    $scope.next=true;
                    $scope.login=true;
                    $scope.store=false;
                    $scope.code=true;
                    $scope.tagid='';
                    $scope.moving=false;
                    $scope.barcode='';
                    $scope.nfc='';
                    $scope.uid='';
                    
                
    
                }
                // Do any magic you need
                  }, function(errResponse) {
                      alert(errResponse);
                  });   
            }
          $scope.diversion=function(){
                $scope.dataforce=true;
                $scope.tagid='';
                $scope.dataentry=true;
              }
              $scope.divert = function(record,tagid){
                  alert(JSON.stringify(record));
                var r4 = $filter('decodePayload')(record);
                var r5= $filter('bytesToHexString')(tagid);
                  $scope.nfc=r4;
                  $scope.uid=r5;
                  alert(r5);
                  $scope.c2=r4;
                  $scope.c3=r5;
                $scope.moving=true;
                $scope.dataentry=true;
                $scope.dataforce=false;
              }
       $scope.screenchange =  function() {
            $scope.store=true;
            $scope.login=true;
            $scope.code=false;
        }
        $scope.loginscreen = function(){
            $scope.store=false;
            $scope.login=false;
            $scope.code=false;
        }
        $scope.moveScreen=function(){
            $scope.moving=true;
            $scope.dataentry=true;
            $scope.dataforce=false;
        }
testok = function()
{
  $scope.checked = true;
   $scope.ok= true;
   $scope.test=true;   
}
testnotok=function(){
    $scope.checked=true;
    $scope.ok=false;
    $scope.test=true;
}
$scope.reset=function(){
    $scope.tag.id=false;
    $scope.checked=false;
    $scope.status='';
    $scope.test=false;
    $scope.next=false;
    $scope.login=true;
    $scope.store=false;
    $scope.code=true;
    $scope.moving=false;
    $scope.tagid='';
  $scope.barcode='';
    $scope.nfc='';
    $scope.uid='';
}
        $scope.clear = function() {
            nfcService.clearTag();
            $ionicHistory.clearCache();
             $scope.status = '';
             $scope.tagid='';
            $scope.checked = false;
        };

        $scope.register = function(username,branchname,phonenumber,password){
            var y1=username;
            var y2=branchname;
            var y3=phonenumber;
            var y4=password;
            var combination=y1+','+y2+','+y3+','+y4;
            alert(combination);
            RegisterService.registerUser(combination).then(function(status3){
                if(status3.status=='inserted'){
                    alert(status3.status);
                    $scope.login=false;
                    $scope.store=false;
                }
                else{
                    alert('something went wrong');
                }
            })
        }
        $scope.viewing = function(phonenumber,password){
            var z1=phonenumber;
            var z2=password;
            var send=z1+'&'+z2;
            alert(send);
            LoginService.loginUser(send).then(function (status2){
                alert(status2.status);
                alert(status2.validAddress);
                alert(status2.invalidAddress);
                alert(status2.rejectAddress);
                if(status2.status=='valid'){
        window.localStorage['phonenumber']=phonenumber;
        window.localStorage['password']=password;
        window.localStorage['validAddress']=status2.validAddress;
        window.localStorage['invalidAddress']=status2.invalidAddress;
        window.localStorage['rejectAddress']=status2.rejectAddress;
        alert(window.localStorage['rejectAddress']=status2.rejectAddress);
        alert(window.localStorage['invalidAddress']=status2.invalidAddress);
        alert(window.localStorage['validAddress']=status2.validAddress);
            alert(window.localStorage['phonenumber']=phonenumber);
                    $scope.login=true;
                    $scope.store=false;
                    $scope.code=true;
                    $scope.tagid='';
                    $scope.moving=false;
                }
            })
        }
        $scope.submitForm = function(barcode,nfc,uid,productid,trackingid,dealerid,retailerid,compositeid,stamp){
            alert(barcode+","+nfc+","+uid+","+productid+","+trackingid+","+dealerid+","+retailerid+","+compositeid+","+stamp);
            var address1=window.localStorage.getItem("validAddress");
            alert(address1);
            var DataToSent={
                barcode:barcode, 
                data:nfc,
              uid:uid,  
              productid:productid,
              trackingid:trackingid, 
              dealerid:dealerid,
              retailerid:retailerid,
               compositeid:compositeid,
              stamp:stamp,
              validAddress:address1
            }
          alert(DataToSent);  
      $http.post('http://192.168.0.142:8090/api/me',DataToSent).then(function(response) {
          alert(response.status);
          if(response.status='productdatainserted'){
              alert('the data found'); 
              $scope.next=true;
              $scope.login=true;
              $scope.store=false;
              $scope.code=true;
              $scope.tagid='';
              $scope.moving=false;
              $scope.barcode='';
              $scope.nfc='';
              $scope.uid='';}
            }, function(errResponse) {
                alert(errResponse);
            });
      }
        
       $scope.checkstatus =function(record,tagid) {

    
        var xx =  $filter('decodePayload')(record);
        var yy= $filter('bytesToHexString')(tagid);
        alert(xx);
        if(xx.includes('OPENED')){
      var badaddress=window.localStorage.getItem("invalidAddress");
       var goodaddress=window.localStorage.getItem("validAddress");
       var rejectaddress=window.localStorage.getItem("rejectAddress");
       var Data={
           data:'OPENED',
           uid:yy,
           validAddress:goodaddress,
           invalidAddress:badaddress,
           rejectAddress:rejectaddress
       }
    }
    else{
        var badaddress=window.localStorage.getItem("invalidAddress");
       var goodaddress=window.localStorage.getItem("validAddress");
       var rejectaddress=window.localStorage.getItem("rejectAddress");
        var Data={
            data:'SECURED',
            uid:yy,
            validAddress:goodaddress,
            invalidAddress:badaddress,
            rejectAddress:rejectaddress
        }
    }
       alert(Data);
$http.post('http://192.168.0.142:8090/api/newscan',Data).then(function(response){
    var output=response.data;
    alert(output.message);
        if(output.message =='blockchainrecordfound'){
                    testok();
                    $scope.status = 'ok';
                    $scope.tagid='';
                    $scope.d1=string1;
                    $scope.d2=string2;
                    $scope.d3=string3;
                    $scope.d4='blockain record found';
                }
                else if(output.message=='blockchainrecordnotfound') {
                    testnotok();
                        $scope.status = 'notok';
                        $scope.valid=true;
                        $scope.validtamper=true;
                        $scope.blockchain=false;
                        $scope.read='blockchain record not found'
                        $scope.tagid='';
                        $scope.d1=string1;
                        $scope.d2=string2;
                        $scope.d3=string3;
                     }
              else if(output.message=='notok') {
                testnotok();
                    $scope.status = 'notok';
                    $scope.valid=false;
                    $scope.validtamper=false;
                    $scope.blockchain=false;
                    $scope.read='blockchain record not found';
                    $scope.tagid='';
                    $scope.d1=string1;
                    $scope.d2=string2;
                    $scope.d3=string3;
                     }
                     else if(output.message=='blockchainrecordfoundbuttamper'){
                        testnotok();
                        
                        $scope.valid=true;
                        $scope.validtamper=false;
                         $scope.tagid='';
                         $scope.blockchain=true;
                         $scope.result='blockchain record found';
                         $scope.d1=string1;
                         $scope.d2=string2;
                         $scope.d3=string3;
                         alert('this product is transfered to rejected address');
                        }
                        else if(output.message=='blockchainrecordnotfoundandtamper'){
                            testnotok();
                            $scope.valid=true;
                            $scope.validtamper=false;
                             $scope.tagid='';
                             $scope.blockchain=false;
                             $scope.read='blockchain record not found';
                             $scope.d1=string1;
                             $scope.d2=string2;
                             $scope.d3=string3;
                            }
                        
                        else if(output.message=='tamperok'){
                        testnotok();
                         $scope.valid=false;
                         $scope.validtamper=true;
                         $scope.blockchain=false;
                         $scope.read='blockchain record not found'
                         $scope.tagid='';
                         $scope.d1=string1;
                         $scope.d2=string2;
                         $scope.d3=string3;
                        }
                        else if(output.message=='assetnotfoundinyouraddress'){
                            alert('this assest doesnot exist in your address');
                            reset();

                        }
                    }),
                     function(error){
                $scope.status="Network error";
                $scope.reset();
             }
    
        }
    })
        .run(function($ionicPlatform, $ionicPopup) {
            $ionicPlatform.ready(function() {
              // Check for network connection
              if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                  $ionicPopup.confirm({
                    title: 'No Internet Connection',
                    content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
                  })
                  .then(function(error) {
                    if(error) {
                        ionic.Platform.exitApp();
                        alert("exit");                    
                    }
                    else{
                        ionic.Platform.exitApp();
                    }
                  });
                }
                }
            });
          })
        .factory('RegisterService', function ($http) {
        var username = {};
        var branchname={};
        var phonenumber={};
        var password={};
        return {
            registerUser(username,branchname,phonenumber,password){
                alert('comb'+username,branchname,phonenumber,password);
                return $http.get('http://192.168.0.142:8090/api/register/' + 
                username,branchname,phonenumber,password).then(function(response) {
                return response.data;
             }, function(error) {
                 alert('                         Network error!!!         Please Check Internet');
                console.log(error);
             });
            }
        }
        
    })


    .factory('LoginService', function ($http) {
        var phonenumber={};
        var password={};
        return {
            loginUser(phonenumber,password){
                alert('send'+phonenumber,password);
                return $http.get('http://192.168.0.142:8090/api/login/' + 
                phonenumber,password).then(function(response) {
                    
                return response.data;

             }, function(error) {
                 alert('                         Network error!!!         Please Check Internet');
                console.log(error);
             });
            }
        }
        
    })
    .factory('lookupService', function ($http) {
        var tag = {};
        return {
            checkIdValid(record){
                //alert(record+'record');
              /*  return $http.get('http://192.168.0.142:8090/api/manu/' + 
                record).then(function(response) {
                return response.data;*/
               return $http.post('http://192.168.0.142:8090/api/manu', 
               record).then(function(response) {
                   alert('data'+record);
               return response.data;
             }, function(error) {
                 alert('                         Network error!!!         Please Check Internet');
                 $scope.record=xx;
                 testnotok();
                 $scope.tagid='';
                console.log(error);
             });
            }
        }
        
    }) 
    
    
    .factory('lookService', function ($http) {
        var tag = {};
        return {
            checkValid(record){
               return $http.post('http://34.208.159.94:8060/api/testing', 
               record).then(function(response) {
               return response.data;

             }, function(error) {
                 alert('                         Network error!!!         Please Check Internet');
                 $scope.record=xx;
                 testnotok();
                 $scope.tagid='';
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
                   // Check for network connection
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



