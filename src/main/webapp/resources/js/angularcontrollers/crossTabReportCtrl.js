myAppConstructor.controller("CrossTabReportController", reportController);

function reportController($scope, $http, allServices) {
	$scope.timeperiods = [];
	$scope.selectedFacility = {};
	$scope.selectedCrosstab = {};
	$scope.selectedDistrict = {};
//	$scope.selectedTimepriod = {};
	$scope.sortReverse = false;
	$scope.sortType = "District";
	function convert(array){
	    var map = {};
	    for(var i = 0; i < array.length; i++){
	        var obj = array[i];
	        if(obj.parentid == -1)
	        	obj.parentid =  null;
	        if(!(obj.id in map)){
	            map[obj.id] = obj;
	            map[obj.id].children = [];
	        }

	        if(typeof map[obj.id].name == 'undefined'){
	            map[obj.id].id = String(obj.id);
	            map[obj.id].name = obj.name;
	            map[obj.id].parentid= String(obj.parentid);
	        }

	        var parent = obj.parentid || '-';
	        if(!(parent in map)){
	            map[parent] = {};
	            map[parent].children = [];
	        }

	        map[parent].children.push(map[obj.id]);
	    }
	    return map['-'];
	}
	/*
	allServices.getAllTimeperiods().then(function(data) {
		$scope.allTimeperiods = data;
	}, function() {
	});*/

	allServices.getFacilitiesForCrossTab().then(function(data) {
		$scope.FacilitiesForCrossTab = data;
		$scope.allFacilities = convert($scope.FacilitiesForCrossTab).children;
		console.log($scope.allFacilities);
	}, function() {
	});
	allServices.getAllDistricts().then(function(data) {
		$scope.allDistricts = data;
	}, function() {
	});
	/*$scope.removeRowId = function(item){
		 return item != 'Facility Level';
		};*/
	$scope.selectFacility = function(facility){
		$scope.selectedFacility = facility;
		$scope.selectedCrosstab = {};
	};
	$scope.selectCrosstab = function(crosstab){
		$scope.selectedCrosstab = crosstab;
	};
	$scope.selectDistrict = function(district){
		$scope.selectedDistrict = district;
	};
	/*$scope.selectTimeperiod = function(timeperiod){
		$scope.selectedTimepriod = timeperiod;
	};*/
	$scope.getTableData = function(){
		if(!Object.keys($scope.selectedFacility).length){
			$scope.errorMsg = "Facility type";
			$("#errorMessage").modal("show");
			return false;
		}
		else if(!Object.keys($scope.selectedCrosstab).length){
			$scope.errorMsg = "Crosstab";
			$("#errorMessage").modal("show");
			return false;
		}
		else if(!Object.keys($scope.selectedDistrict).length){
			$scope.errorMsg = "District";
			$("#errorMessage").modal("show");
			return false;
		}
//		if(Object.keys($scope.selectedSubsection).length)
//			$scope.selectedSectionSubsection = JSON.parse(JSON.stringify($scope.selectedSubsection));
//		else
//			$scope.selectedSectionSubsection = JSON.parse(JSON.stringify($scope.selectedSection));
//		if(!Object.keys($scope.selectedFacility).length)
//			$('#facilityType')[0].setCustomValidity('please input facility type');
		if(Object.keys($scope.selectedFacility).length && Object.keys($scope.selectedCrosstab).length && Object.keys($scope.selectedDistrict).length){
			$(".loader").show();
			allServices.getCrossTabData($scope.selectedCrosstab, $scope.selectedDistrict.areaId).then(function(data){
				$scope.tableValue = data;
				if($scope.tableValue['data'])
					{
				$scope.tableHeader = data['header']
				$scope.lowHeader = data['lowHeader']
				$scope.upperHead=Object.keys($scope.tableHeader);
				$scope.tableData = data['data']
				$scope.columns = Object.keys($scope.tableData[0]);
					}
				else
					{
					$("#noDataModall").modal("show");
					}
//				var kala = $scope.columns.indexOf("Facility Level");
//				if(kala != -1){
//					$scope.columns[kala] = $scope.columns[0];
//					$scope.columns[0] = "Facility Level";
//				}
				$(".loader").fadeOut();
			});
		}
		
	};
	
	$scope.order = function (sortType) {  
        $scope.sortReverse = ($scope.sortType === sortType) ? !$scope.sortReverse : false;  
        $scope.sortType = sortType;  
      };
    $scope.filterType = function(val){
    	if(val['District'] == "Chhattisgarh"){
    		if(isNaN(parseInt(val[$scope.sortType]))){
	    		if($scope.sortReverse == true)
	    			return "";
	    		else
	    			return "zzz";
    		}	
    		else{
    			if($scope.sortReverse == true)
	    			return -1;
	    		else
	    			return 9e12;
    		}
    	}
    	if(isNaN(parseInt(val[$scope.sortType])))
    	return val[$scope.sortType];
    	else
    		return parseInt(val[$scope.sortType]);
    };
    $scope.exportTableData = function(id){
    	var htmls = "";
        var uri = 'data:application/vnd.ms-excel;base64,';
        var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'; 
        var base64 = function(s) {
            return window.btoa(unescape(encodeURIComponent(s)));
        };

        var format = function(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) {
                return c[p];
            });
        };

     
       var tab_text=  "<h2>Crosstab Report</h2><h3>Facility Type : "+$scope.selectedFacility.name+"</h3><h3>Crosstab Type : "+$scope.selectedCrosstab.name+"</h3><h3>District/State: "+$scope.selectedDistrict.areaName;
      tab_text+="<table border='2px'><tr bgcolor='#87AFC6'>";
       
       var textRange; var j=0;
        tab = document.getElementById(id); // id of table

        for(j = 0 ; j < tab.rows.length ; j++) 
        {     
            tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
            //tab_text=tab_text+"</tr>";
        }

        tab_text=tab_text+"</table>";
        tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
        tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
        tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params


        var ctx = {
            worksheet : 'Worksheet',
            table : tab_text
        };


        var link = document.createElement("a");
        link.download = "Crosstab _"+$scope.selectedFacility.name+"_"+$scope.selectedCrosstab.name+"_"+$scope.selectedDistrict.areaName+new Date().toLocaleDateString()+".xls";
        
        var exceldata = new Blob([(format(template, ctx))], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }); 
        if (window.navigator.msSaveBlob) { // IE 10+
            window.navigator.msSaveOrOpenBlob(exceldata, link.download);
        }
        
        else {
            link.href = window.URL.createObjectURL(exceldata); // set url for link download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
    };
    $scope.getBlockTable = function(row){
    	$(".loader").show();
    	allServices.getRawData(row.rowId, $scope.selectedFacility.iC_NId, $scope.selectedSectionSubsection.iC_NId, $scope.selectedTimepriod.timePeriod_Nid).then(function(data){
    		$(".loader").fadeOut();
    		$scope.divisionalTableData = data;
			$scope.divisionalTableColumns = Object.keys($scope.divisionalTableData[0]);
			$("#divisionTable").modal("show");
		});
    };
    $scope.filterFloat = function(value) {
        if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
        	      .test(value))
        	      return Number(value);
        	  return value;
    };
}