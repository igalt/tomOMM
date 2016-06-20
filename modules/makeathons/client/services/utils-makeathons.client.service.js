//Makeathons service used to communicate Makeathons REST endpoints
(function () {
  'use strict';

  angular
    .module('makeathons')
    .factory('MakeathonsUtils', MakeathonsUtils);

  MakeathonsUtils.$inject = ['$filter', '$stateParams', 'Authentication', 'MakeathonsService'];

  function MakeathonsUtils($filter, $stateParams, Authentication, MakeathonsService) {

    function isUserTeamMember(makeathon){
      var currUser = Authentication.user;
      var userRoles = makeathon.userRoles.find(function(user) {
        return currUser.email === user.email &&
            user.role === 'Core team';
      });
      return userRoles? true:false;
    }

    function datesDisplayFormat(makeathon){
      makeathon.startDate = $filter('date')(new Date(makeathon.startDate), 'EEE MMM dd yyyy');
      makeathon.endDate = $filter('date')(new Date(makeathon.endDate), 'EEE MMM dd yyyy');
      makeathon.preTomDate = $filter('date')(new Date(makeathon.preTomDate), 'EEE MMM dd yyyy');
      makeathon.regDeadline = $filter('date')(new Date(makeathon.regDeadline), 'EEE MMM dd yyyy');
    }

    function isAllow(makeathon) {
      return (Authentication.isAdmin() || isUserTeamMember(makeathon));
    }

    function getMakeathonById() {
      return MakeathonsService.get({ makeathonId: $stateParams.makeathonId });
    }

    function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
      //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
      var arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;

      //Set Report title in first row or line
      var CSV = '';   // Ex. 'MyReport_'

      CSV += ReportTitle + '\r\n\n';

      //This condition will generate the Label/Header
      var row = '';
      if (ShowLabel) {


        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

          //Now convert each value to string and comma-seprated
          row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
      }

      //1st loop is to extract each row
      for (var i = 0; i < arrData.length; i++) {
        row = '';

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index2 in arrData[i]) {
          row += '"' + arrData[i][index2] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
      }

      if (CSV === '') {
        alert('Invalid data');
        return;
      }

      //Generate a file name
      var fileName = 'MyReport_';
      //this will remove the blank-spaces from the title and replace it with an underscore
      fileName += ReportTitle.replace(/ /g,'_');

      //Initialize file format you want csv or xls
      var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

      // Now the little tricky part.
      // you can use either>> window.open(uri);
      // but this will not work in some browsers
      // or you will not get the correct file extension

      //this trick will generate a temp <a /> tag
      var link = document.createElement('a');
      link.href = uri;

      //set the visibility hidden so it will not effect on your web-layout
      link.style = 'visibility:hidden';
      link.download = fileName + '.csv';

      //this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    return {
      datesDisplayFormat: datesDisplayFormat ,
      isAllow: isAllow ,
      getMakeathonById: getMakeathonById,
      jsonToCSV: JSONToCSVConvertor
    };
  }
})();
