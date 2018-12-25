myAppConstructor.controller("CrossTabReportController", reportController);
/**
 * @author Harsh Pratyush (harsh@sdrc.co.in)
 * @param $scope
 * @param $http
 * @param allServices
 */
function reportController($scope, $http,$filter ,allServices) {
	
	$scope.sortReverse = false;
	$scope.sortType = " ";

	$(".loader").show();
	allServices.getCrossTabDropDownData().then(function(data) {
		$scope.crosstabDropDownData = data;
		$scope.allIndicatorsList=data.indicatorFormXpathMappingModels;
		$scope.allFacilities=$scope.crosstabDropDownData.formXpathScoreMappingModels;
		$scope.allDistricts=$scope.crosstabDropDownData.areaList;
		$scope.allTimeperiods=$scope.crosstabDropDownData.timePeriodModels;
		$(".loader").fadeOut();
	}, function() {
	});
	
	$scope.selectFacility = function(facility){
		$scope.selectedFacility = facility;
		
		$scope.allIndicators=$filter('filter')($scope.allIndicatorsList, function (item) {
				if($scope.selectedFacility.formId==2)
			  return item.dhXpath != 0;
				
				else if	($scope.selectedFacility.formId==1)
					return item.chcXpath != 0;
				
				else if	($scope.selectedFacility.formId==3)
					return item.phcXpath != 0;
				
				else if	($scope.selectedFacility.formId==0)
					return (item.phcXpath != 0&&item.chcXpath != 0&&item.dhXpath != 0)||(item.phcXpath == 0&&item.chcXpath == 0&&item.dhXpath == 0);
					
		});
		$scope.rowIndicator=undefined;
		$scope.colIndicator=undefined;
	};
	
	$scope.selectDistrict = function(district){
		$scope.selectedDistrict = district;
	};
	$scope.selectTimeperiod = function(timeperiod){
		$scope.selectedTimepriod = timeperiod;
	};
	
	
	$("#searchRowIndicator").autocomplete({
		source : $scope.optArrayDashboard,
		 minLength: 0,
		appendTo : "#searchedRowIndicator",
		select: function(event, ui) {
			document.getElementById('searchRowIndicator').value = ui.item.value;
			$scope.rowIndicator=ui.item.value;
			$scope.$apply();
	    }
	});
	
	$("#searchColoumnIndicator").autocomplete({
		source : $scope.optArrayDashboard,
		  minLength: 0,
		appendTo : "#searchedColoumnIndicator",
		select: function(event, ui) {
			document.getElementById('searchColoumnIndicator').value = ui.item.value;
			 $scope.colIndicator=ui.item.value;
			$scope.$apply();
	    }
	});
	
	$scope.searchRowIndicator= function() {
		$scope.optArrayDashboard = [];
		$scope.nooptArrayDashboard = [];
		var selectedVal = document.getElementById('searchRowIndicator').value;
		var colVal = document.getElementById('searchColoumnIndicator').value;
		var node = [];
			$scope.optArrayDashboard = [];
			for(var i = 0; i<$scope.allIndicators.length; i++){
				if (!($scope.allIndicators[i].label.toUpperCase()==colVal.toUpperCase())&& !($scope.allIndicators[i].phcXpath == 0&&$scope.allIndicators[i].chcXpath == 0&&$scope.allIndicators[i].dhXpath == 0))
				node.push($scope.allIndicators[i]);
			}
				for(var i = 0; i<node.length; i++){
					if (node[i].label.toUpperCase().match(selectedVal.toUpperCase())||selectedVal=='') {
						$scope.optArrayDashboard.push(node[i].label);
					}
				}
				
				$("#searchRowIndicator").autocomplete({
					source : $scope.optArrayDashboard,
					 minLength: 0,
					appendTo : "#searchedRowIndicator",
					select: function(event, ui) {
						document.getElementById('searchRowIndicator').value = ui.item.value;
						$scope.rowIndicator=ui.item.value;
						$scope.$apply();
				    }
				});
			
	};
	
	
	$scope.searchColoumnIndicator= function() {
		$scope.optArrayDashboard = [];
		$scope.nooptArrayDashboard = [];
		var selectedVal = document.getElementById('searchColoumnIndicator').value;
		var rowVal = document.getElementById('searchRowIndicator').value;
		var node = [];
			$scope.optArrayDashboard = [];
			for(var i = 0; i<$scope.allIndicators.length; i++){
				if (!($scope.allIndicators[i].label.toUpperCase()==rowVal.toUpperCase()))
				node.push($scope.allIndicators[i]);
			}
				for(var i = 0; i<node.length; i++){
					if (node[i].label.toUpperCase().match(selectedVal.toUpperCase())||selectedVal=='') {
						$scope.optArrayDashboard.push(node[i].label);
					}
				}
				
				$("#searchColoumnIndicator").autocomplete({
					source : $scope.optArrayDashboard,
					  minLength: 0,
					appendTo : "#searchedColoumnIndicator",
					select: function(event, ui) {
						document.getElementById('searchColoumnIndicator').value = ui.item.value;
						$scope.colIndicator=ui.item.value;
						$scope.$apply();
				    }
				});
			
	};
	
	
	$scope.getTableData = function(){
		
		$scope.tableValue = [];
		$scope.tableHeader = [];
		$scope.lowHeader = [];
		$scope.upperHead=[];
		$scope.tableData = [];
		$scope.columns = [];
		
		$scope.selectedcolIndicator=$filter('filter')($scope.allIndicators,{'label':document.getElementById('searchColoumnIndicator').value},true);
		$scope.selectedrowIndicator=$filter('filter')($scope.allIndicators,{'label':document.getElementById('searchRowIndicator').value},true);
		
		if(!$scope.selectedFacility){
			$scope.errorMsg = "Facility type";
			$("#errorMessage").modal("show");
			return false;
		}
		else if(!$scope.selectedDistrict){
			$scope.errorMsg = "State/District";
			$("#errorMessage").modal("show");
			return false;
		}
		else if(!$scope.selectedTimepriod){
			$scope.errorMsg = "Time Period";
			$("#errorMessage").modal("show");
			return false;
		}
		
		else if(!$scope.selectedcolIndicator.length)
		{
			$scope.errorMsg = "Row Indicator";
			$("#errorMessage").modal("show");
			return false;
		}
		
		else if(!$scope.selectedrowIndicator.length)
			{
			$scope.errorMsg = "Column Indicator";
			$("#errorMessage").modal("show");
			return false;
			}

		else
			{
			$scope.sortReverse = false;
			$scope.sortType = " ";
			$scope.selectedFacilityResult=$scope.selectedFacility;
			$scope.selectedTimepriodResult=$scope.selectedTimepriod;
			$scope.selectedDistrictResult=$scope.selectedDistrict;
			
			var crossTabDataModel={
				colIndicatorFormXpathMappingId:$scope.selectedcolIndicator[0].indicatorFormXpathMappingId,

				colDhXpath:$scope.selectedFacility.formId==2||$scope.selectedFacility.formId==0?$scope.selectedcolIndicator[0].dhXpath:0,

				colChcXpath:$scope.selectedFacility.formId==1||$scope.selectedFacility.formId==0?$scope.selectedcolIndicator[0].chcXpath:0,

				colPhcXpath:$scope.selectedFacility.formId==3||$scope.selectedFacility.formId==0?$scope.selectedcolIndicator[0].phcXpath:0,
					
				coLabel:$scope.selectedcolIndicator[0].label,

				rowIndicatorFormXpathMappingId:$scope.selectedrowIndicator[0].indicatorFormXpathMappingId,
					
				rowDhXpath:$scope.selectedFacility.formId==2||$scope.selectedFacility.formId==0?$scope.selectedrowIndicator[0].dhXpath:0,
					
				rowChcXpath:$scope.selectedFacility.formId==1||$scope.selectedFacility.formId==0?$scope.selectedrowIndicator[0].chcXpath:0,

				rowPhcXpath:$scope.selectedFacility.formId==3||$scope.selectedFacility.formId==0?$scope.selectedrowIndicator[0].phcXpath:0,
					
				rowLabel:$scope.selectedrowIndicator[0].label,

				facilityTypeId:$scope.selectedFacility.formId,

				districtId:$scope.selectedDistrict.areaId,
					
				timePeriodId:$scope.selectedTimepriod.timePeriod_Nid,
				
				colIndicatorFormXpathMappingType:$scope.selectedcolIndicator[0].type,
				
				rowIndicatorFormXpathMappingType:$scope.selectedrowIndicator[0].type
			};
			
			allServices.getCrossTabTableData(crossTabDataModel).then(function(data) {
				$(".loader").fadeOut();
				$scope.tableValue = data;
				if($scope.tableValue['data'].length)
					{
				$scope.tableHeader = data['header'];
				if($scope.selectedTimepriodResult.timePeriod_Nid==0)
				$scope.lowHeader = data['lowHeader'];
				
				$scope.upperHead=Object.keys($scope.tableHeader);
				$scope.tableData = data['data'];
				$scope.columns = Object.keys($scope.tableData[0]);
					}
				else
					{
					$("#noDataModall").modal("show");
					}
				
			}, function() {
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

     
       var tab_text=  "<h2>Crosstab Report</h2><h3>Facility Type : "+$scope.selectedFacilityResult.label+"</h3><h3>Crosstab Type :"+$scope.selectedrowIndicator[0].label+" V/S "+$scope.selectedcolIndicator[0].label+" </h3><h3>District/State: "+$scope.selectedDistrictResult.areaName+" </h3><h3>TimePeriod: "+$scope.selectedTimepriodResult.timePeriod;
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
        link.download = "Crosstab _"+$scope.selectedFacilityResult.label+"_"+$scope.selectedrowIndicator[0].label+"_VS_"+$scope.selectedcolIndicator[0].label+"_"+$scope.selectedDistrictResult.areaName+"_"+$scope.selectedTimepriodResult.timePeriod+"_"+new Date().toLocaleDateString()+".xls";
        
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
	
}