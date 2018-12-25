myAppConstructor.controller("ReportController", reportController);

function reportController($scope, $http, allServices) {
	$scope.timeperiods = [];
	$scope.selectedFacility = {};
	$scope.selectedSection = {};
	$scope.selectedSubsection = {};
	$scope.selectedTimepriod = {};
	$scope.sectorTimeperiods = [];
	$scope.sortReverse = false;
	$scope.sortType = "District";
	function convert(array){
	    var map = {};
	    for(var i = 0; i < array.length; i++){
	        var obj = array[i];
	        if(obj.iC_Parent_NId == -1)
	        	obj.iC_Parent_NId =  null;
	        if(!(obj.iC_NId in map)){
	            map[obj.iC_NId] = obj;
	            map[obj.iC_NId].children = [];
	        }

	        if(typeof map[obj.iC_NId].iC_Name == 'undefined'){
	            map[obj.iC_NId].iC_NId = String(obj.iC_NId);
	            map[obj.iC_NId].iC_Name = obj.iC_Name;
	            map[obj.iC_NId].iC_Parent_NId= String(obj.iC_Parent_NId);
	        }

	        var parent = obj.iC_Parent_NId || '-';
	        if(!(parent in map)){
	            map[parent] = {};
	            map[parent].children = [];
	        }

	        map[parent].children.push(map[obj.iC_NId]);
	    }
	    return map['-'];
	}
	
	allServices.getAllTimeperiods().then(function(data) {
		$scope.allTimeperiods = data;
		$scope.sectorTimeperiods = [];
	}, function() {
	});

	allServices.getAllSectors().then(function(data) {
		$scope.allSectors = data;
		$scope.allFacilities = convert($scope.allSectors).children;
	}, function() {
	});
	
	$scope.getSectorTimeperiod = function(idList){
		$scope.sectorTimeperiods = [];
		$scope.selectedTimepriod = {};
		for(var i=0; i<idList.length; i++){
			for(var j=0; j<$scope.allTimeperiods.length; j++){
				if(idList[i] == $scope.allTimeperiods[j].timePeriod_Nid){
					$scope.sectorTimeperiods.push($scope.allTimeperiods[j]);
				}
			}	
		}
	}
	$scope.removeRowId = function(item){
		 return item != 'rowId';
		};
	$scope.selectFacility = function(facility){
		$scope.selectedFacility = facility;
		$scope.selectedSection = {};
		$scope.selectedSubsection = {};
		$scope.tableData=[];
		$scope.columns=[];
	};
	$scope.selectSection = function(section){
		$scope.selectedSection = section;
		$scope.selectedSubsection = {};
		$scope.getSectorTimeperiod(section.utTimeperiods);
		$scope.tableData=[];
		$scope.columns=[];
	};
	$scope.selectSubsection = function(subsection){
		$scope.selectedSubsection = subsection;
		$scope.getSectorTimeperiod(subsection.utTimeperiods);
		$scope.tableData=[];
		$scope.columns=[];
	};
	$scope.selectTimeperiod = function(timeperiod){
		$scope.selectedTimepriod = timeperiod;
		$scope.tableData=[];
		$scope.columns=[];
	};
	$scope.getTableData = function(){
		if(!Object.keys($scope.selectedFacility).length){
			$scope.errorMsg = "Facility type";
			$("#errorMessage").modal("show");
			return false;
		}
		else if(!Object.keys($scope.selectedSection).length){
			$scope.errorMsg = "Section";
			$("#errorMessage").modal("show");
			return false;
		}
		else if(!Object.keys($scope.selectedTimepriod).length){
			$scope.errorMsg = "Time period";
			$("#errorMessage").modal("show");
			return false;
		}
		if(Object.keys($scope.selectedSubsection).length)
			$scope.selectedSectionSubsection = JSON.parse(JSON.stringify($scope.selectedSubsection));
		else
			$scope.selectedSectionSubsection = JSON.parse(JSON.stringify($scope.selectedSection));
		if(!Object.keys($scope.selectedFacility).length)
			$('#facilityType')[0].setCustomValidity('please input facility type');
		if(Object.keys($scope.selectedFacility).length && Object.keys($scope.selectedSectionSubsection).length && Object.keys($scope.selectedTimepriod).length){
			$(".loader").show()
			allServices.getSummary($scope.selectedFacility.iC_NId, $scope.selectedSectionSubsection.iC_NId, $scope.selectedTimepriod.timePeriod_Nid).then(function(data){
				$scope.tableData = data;
				for(var i=0; i<$scope.tableData.length; i++){
					if($scope.tableData[i]['District'] == "Total"){
						$scope.tableData[i]['District'] = "Assam";
					}
				}
				$scope.columns = Object.keys($scope.tableData[0]);
				$(".loader").fadeOut();
			});
		}
		
	};
	
	$scope.order = function (sortType) {  
        $scope.sortReverse = ($scope.sortType === sortType) ? !$scope.sortReverse : false;  
        $scope.sortType = sortType;  
      };
    $scope.filterType = function(val){
    	if(val['District'] == "Assam"){
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

        
        var tab_text=  "<h2>Summary Report</h2><h3>Facility Type : "+$scope.selectedFacility.iC_Name+"</h3><h3>Section : "+$scope.selectedSection.iC_Name+"</h3>"+($scope.selectedSection.children.length && $scope.selectedSubsection.iC_Name?"<h3>Sub-Section : "+$scope.selectedSubsection.iC_Name+"</h3>":"")+"<h3> Timeperiod : "+$scope.selectedTimepriod.timePeriod+(id=='dataTable'?"</h3>":"</h3><h3>District: "+$scope.facilityName);
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
        if(id=='dataTable')
        	{
        link.download = "Summary Report _"+$scope.selectedFacility.iC_Name+"_"+$scope.selectedSection.iC_Name+($scope.selectedSection.children.length && $scope.selectedSubsection.iC_Name?"_"+$scope.selectedSubsection.iC_Name:"")+"_"+$scope.selectedTimepriod.timePeriod+new Date().toLocaleDateString()+".xls";
        	}
        else
        	{
        	link.download = "Summary Report _"+$scope.selectedFacility.iC_Name+"_"+$scope.selectedSection.iC_Name+"_"+($scope.selectedSection.children.length && $scope.selectedSubsection.iC_Name?"_"+$scope.selectedSubsection.iC_Name:"")+"_"+$scope.selectedTimepriod.timePeriod+"_"+$scope.facilityName+new Date().toLocaleDateString()+".xls";
        	}
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
    	$scope.facilityName=row.District;
    	$(".loader").show()
    	allServices.getRawData(row.rowId, $scope.selectedFacility.iC_NId, $scope.selectedSectionSubsection.iC_NId, $scope.selectedTimepriod.timePeriod_Nid).then(function(data){
    		$(".loader").fadeOut()
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
        	}
}