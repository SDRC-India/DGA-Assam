function ValueObject(key, value) {
	this.key = key;
	this.value = value;
};

myAppConstructor.controller("DashboardController", DashboardController);

function DashboardController($scope, $http, $window, $timeout, $filter,
		ngTableParams, allServices) {

	$scope.roleId = $window.roleId;
	$scope.selectedGranularitySpider = "";
	$scope.selectedSectorName = "CHC";
	$scope.isPushpinClicked = false;
	$scope.lastVisiDataId = 0;
	$scope.isShowTable = false;
	$scope.isShowChart = true;
	$scope.lastVisitDataId = 0;
	$scope.allDistricts = [];
	$scope.sectors = [];
	$scope.pushpinDataCallDone = false;
	$scope.percentileFacility = 0;
	// $scope.map = "[]";
	// $scope.map.markers ="[]";
	$scope.progressBarUpdateCalled = false;
	$scope.noOfFacilities = 0;
	$scope.hoverwindow = [];
	$scope.noOfFacilitiesPlanned = 0;
	$scope.todayDate = new Date().toLocaleDateString();
	var w = angular.element($window);
	$scope.getWindowDimensions = function() {
		return {
			"h" : w.height(),
			"w" : (w.width() * 90 / 100)
		};
	};
	// this is to make sure that scope gets changes as window get resized.
	w.on("resize", function() {
		if (!$scope.$$phase)
			$scope.$apply();
	});
	$(".loader").show();
	$scope.pixelOffset = {

		pixelOffset : new google.maps.Size(0, -28)
	};

	function convert(array) {
		var map = {};
		for (var i = 0; i < array.length; i++) {
			var obj = array[i];
			if (obj.parentXpathScoreId == -1)
				obj.parentXpathScoreId = null;
			if (!(obj.formXpathScoreId in map)) {
				map[obj.formXpathScoreId] = obj;
				map[obj.formXpathScoreId].children = [];
			}

			if (typeof map[obj.formXpathScoreId].name == 'undefined') {
				map[obj.formXpathScoreId].formXpathScoreId = String(obj.formXpathScoreId);
				map[obj.formXpathScoreId].name = obj.name;
				map[obj.formXpathScoreId].parentXpathScoreId = String(obj.parentXpathScoreId);
				map[obj.formXpathScoreId].score = String(obj.score);
				map[obj.formXpathScoreId].maxScore = String(obj.maxScore);
				map[obj.formXpathScoreId].percentScore = obj.percentScore;
			}

			var parent = obj.parentXpathScoreId || '-';
			if (!(parent in map)) {
				map[parent] = {};
				map[parent].children = [];
			}

			map[parent].children.push(map[obj.formXpathScoreId]);
		}
		return map['-'];
	}

	$scope.map = {
		center : {
			latitude : 26.344159,
			longitude : 92.673618
		},
		bounds : {},
		clickMarkers : [],
		zoom : 7,
		events : {
			"mouseover" : function(mapModel, eventName, originalEventArgs) {
				for (var i = 0; i < $scope.map.markers.length; i++) {
					if ($scope.map.markers[i].id == originalEventArgs.id) {
						$scope.map.markers[i].showWindow = true;
						break;
					}
				}
				if (!$scope.$$phase)
					$scope.$apply();
			},
			"mouseout" : function(mapModel, eventName, originalEventArgs) {
				for (var i = 0; i < $scope.map.markers.length; i++) {
					if ($scope.map.markers[i].id == originalEventArgs.id) {
						$scope.map.markers[i].showWindow = false;
						break;
					}
				}
				if (!$scope.$$phase)
					$scope.$apply();
			},
			"click" : function(mapModel, eventName, originalEventArgs) {
				$(".loader").show();
				$scope.selectedPushpin = '';
				$scope.isPushpinClicked = true;
				$scope.selectedPushpin = originalEventArgs.title;
				$scope.lastVisiDataId = originalEventArgs.id;

				$scope.getSpiderData($scope.selectedParentSector.formId,
						originalEventArgs.id, $scope.selectedDistrict.areaId);
				$('html, body').animate({
					scrollTop : $("#charts").offset().top
				}, 1000);
				if (!$scope.$$phase)
					$scope.$apply();

			}
		}
	};
	/*
	 * $scope.getChhatisgarhMap = function() {
	 * allServices.getChhatisgarhMap().then(function(data){ $scope.polygons =
	 * JSON.parse(data.selectedRegion); }); };
	 */

	$scope.polygons = [ {
		id : 1,
		path : [ {
			longitude : 91.2952212,
			latitude : 26.7943297
		}, {
			longitude : 91.3049361,
			latitude : 26.7890352
		}, {
			longitude : 91.2829994,
			latitude : 26.8008963
		}, {
			longitude : 91.2395086,
			latitude : 26.8140329
		}, {
			longitude : 91.1818609,
			latitude : 26.8149256
		}, {
			longitude : 91.1492109,
			latitude : 26.8125024
		}, {
			longitude : 91.1015113,
			latitude : 26.8241085
		}, {
			longitude : 91.0555972,
			latitude : 26.7812553
		}, {
			longitude : 91.0104723,
			latitude : 26.7883451
		}, {
			longitude : 90.9955263,
			latitude : 26.7906932
		}, {
			longitude : 90.9620027,
			latitude : 26.7876105
		}, {
			longitude : 90.9578986,
			latitude : 26.7843387
		}, {
			longitude : 90.9571687,
			latitude : 26.782587
		}, {
			longitude : 90.8221725,
			latitude : 26.7763569
		}, {
			longitude : 90.7423558,
			latitude : 26.7743982
		}, {
			longitude : 90.7252656,
			latitude : 26.7686589
		}, {
			longitude : 90.6996971,
			latitude : 26.769361
		}, {
			longitude : 90.6786945,
			latitude : 26.785848
		}, {
			longitude : 90.6462372,
			latitude : 26.7781774
		}, {
			longitude : 90.6338268,
			latitude : 26.7948556
		}, {
			longitude : 90.5857578,
			latitude : 26.8035035
		}, {
			longitude : 90.5465613,
			latitude : 26.8165877
		}, {
			longitude : 90.5399524,
			latitude : 26.820291
		}, {
			longitude : 90.5264577,
			latitude : 26.8307389
		}, {
			longitude : 90.4953476,
			latitude : 26.8523025
		}, {
			longitude : 90.4837524,
			latitude : 26.8599652
		}, {
			longitude : 90.4308251,
			latitude : 26.8957107
		}, {
			longitude : 90.4178532,
			latitude : 26.9046394
		}, {
			longitude : 90.3551837,
			latitude : 26.8989115
		}, {
			longitude : 90.3550153,
			latitude : 26.898013
		}, {
			longitude : 90.3533868,
			latitude : 26.8964968
		}, {
			longitude : 90.3529375,
			latitude : 26.8946437
		}, {
			longitude : 90.3518706,
			latitude : 26.8922852
		}, {
			longitude : 90.348052,
			latitude : 26.8879051
		}, {
			longitude : 90.3473781,
			latitude : 26.8874558
		}, {
			longitude : 90.3474343,
			latitude : 26.8836934
		}, {
			longitude : 90.3477712,
			latitude : 26.8823457
		}, {
			longitude : 90.3474904,
			latitude : 26.8810541
		}, {
			longitude : 90.3474904,
			latitude : 26.8796502
		}, {
			longitude : 90.3464796,
			latitude : 26.8777971
		}, {
			longitude : 90.3453565,
			latitude : 26.8756632
		}, {
			longitude : 90.3438965,
			latitude : 26.8731362
		}, {
			longitude : 90.3546783,
			latitude : 26.90127
		}, {
			longitude : 90.302173,
			latitude : 26.8498879
		}, {
			longitude : 90.2478708,
			latitude : 26.8597712
		}, {
			longitude : 90.2197576,
			latitude : 26.8495549
		}, {
			longitude : 90.2004194,
			latitude : 26.8350067
		}, {
			longitude : 90.1918277,
			latitude : 26.8159138
		}, {
			longitude : 90.1836851,
			latitude : 26.7992918
		}, {
			longitude : 90.1853698,
			latitude : 26.789577
		}, {
			longitude : 90.1909292,
			latitude : 26.78705
		}, {
			longitude : 90.1914907,
			latitude : 26.7862076
		}, {
			longitude : 90.1923047,
			latitude : 26.7852315
		}, {
			longitude : 90.1925015,
			latitude : 26.7844668
		}, {
			longitude : 90.1930631,
			latitude : 26.7836245
		}, {
			longitude : 90.195197,
			latitude : 26.7813221
		}, {
			longitude : 90.195197,
			latitude : 26.7811536
		}, {
			longitude : 90.1950285,
			latitude : 26.7807606
		}, {
			longitude : 90.1942423,
			latitude : 26.7798059
		}, {
			longitude : 90.1942423,
			latitude : 26.7780089
		}, {
			longitude : 90.1940739,
			latitude : 26.7774474
		}, {
			longitude : 90.1923331,
			latitude : 26.7750327
		}, {
			longitude : 90.1904799,
			latitude : 26.773348
		}, {
			longitude : 90.1899745,
			latitude : 26.7714949
		}, {
			longitude : 90.1906371,
			latitude : 26.7679982
		}, {
			longitude : 90.1216701,
			latitude : 26.7490386
		}, {
			longitude : 90.0735158,
			latitude : 26.7360978
		}, {
			longitude : 90.0449532,
			latitude : 26.7298078
		}, {
			longitude : 90.0164443,
			latitude : 26.7321288
		}, {
			longitude : 89.9685727,
			latitude : 26.7219913
		}, {
			longitude : 89.9021157,
			latitude : 26.7228361
		}, {
			longitude : 89.8638809,
			latitude : 26.7197192
		}, {
			longitude : 89.8637096,
			latitude : 26.7170352
		}, {
			longitude : 89.8630814,
			latitude : 26.7137801
		}, {
			longitude : 89.8626245,
			latitude : 26.7106392
		}, {
			longitude : 89.8624532,
			latitude : 26.7064704
		}, {
			longitude : 89.8625674,
			latitude : 26.70253
		}, {
			longitude : 89.8630814,
			latitude : 26.7231456
		}, {
			longitude : 89.8623961,
			latitude : 26.7253728
		}, {
			longitude : 89.8614253,
			latitude : 26.7280569
		}, {
			longitude : 89.8610255,
			latitude : 26.7297701
		}, {
			longitude : 89.8608542,
			latitude : 26.7321686
		}, {
			longitude : 89.8603404,
			latitude : 26.7350824
		}, {
			longitude : 89.8605957,
			latitude : 26.7366285
		}, {
			longitude : 89.8649555,
			latitude : 26.735659
		}, {
			longitude : 89.8713243,
			latitude : 26.6833141
		}, {
			longitude : 89.8682022,
			latitude : 26.6565535
		}, {
			longitude : 89.8762304,
			latitude : 26.6494173
		}, {
			longitude : 89.8574979,
			latitude : 26.6320228
		}, {
			longitude : 89.8570519,
			latitude : 26.6235486
		}, {
			longitude : 89.861958,
			latitude : 26.6150744
		}, {
			longitude : 89.8771224,
			latitude : 26.6128443
		}, {
			longitude : 89.8722163,
			latitude : 26.5945579
		}, {
			longitude : 89.8775684,
			latitude : 26.5842996
		}, {
			longitude : 89.861958,
			latitude : 26.5780555
		}, {
			longitude : 89.862404,
			latitude : 26.5374684
		}, {
			longitude : 89.861958,
			latitude : 26.5303322
		}, {
			longitude : 89.8534838,
			latitude : 26.5173979
		}, {
			longitude : 89.8525918,
			latitude : 26.4879611
		}, {
			longitude : 89.8704323,
			latitude : 26.4598624
		}, {
			longitude : 89.8695402,
			latitude : 26.4482661
		}, {
			longitude : 89.8574979,
			latitude : 26.4380079
		}, {
			longitude : 89.8552679,
			latitude : 26.4339938
		}, {
			longitude : 89.8499157,
			latitude : 26.4143693
		}, {
			longitude : 89.8467936,
			latitude : 26.402773
		}, {
			longitude : 89.8405495,
			latitude : 26.3907307
		}, {
			longitude : 89.8307372,
			latitude : 26.3902846
		}, {
			longitude : 89.8271691,
			latitude : 26.3965288
		}, {
			longitude : 89.8333425,
			latitude : 26.4121653
		}, {
			longitude : 89.8253851,
			latitude : 26.3791344
		}, {
			longitude : 89.820479,
			latitude : 26.3706601
		}, {
			longitude : 89.8115587,
			latitude : 26.3581718
		}, {
			longitude : 89.8039766,
			latitude : 26.3621859
		}, {
			longitude : 89.7901502,
			latitude : 26.3581718
		}, {
			longitude : 89.7789999,
			latitude : 26.3474675
		}, {
			longitude : 89.7789999,
			latitude : 26.3430074
		}, {
			longitude : 89.780784,
			latitude : 26.3309651
		}, {
			longitude : 89.7620515,
			latitude : 26.3171388
		}, {
			longitude : 89.7504552,
			latitude : 26.3215989
		}, {
			longitude : 89.7228025,
			latitude : 26.3077725
		}, {
			longitude : 89.7156663,
			latitude : 26.3019744
		}, {
			longitude : 89.7170043,
			latitude : 26.2930541
		}, {
			longitude : 89.7232485,
			latitude : 26.2948382
		}, {
			longitude : 89.7375208,
			latitude : 26.2711996
		}, {
			longitude : 89.7321687,
			latitude : 26.2604953
		}, {
			longitude : 89.7174503,
			latitude : 26.2591573
		}, {
			longitude : 89.7152203,
			latitude : 26.2564812
		}, {
			longitude : 89.7156663,
			latitude : 26.2462229
		}, {
			longitude : 89.7286006,
			latitude : 26.2381947
		}, {
			longitude : 89.7129902,
			latitude : 26.2288285
		}, {
			longitude : 89.7103142,
			latitude : 26.2190163
		}, {
			longitude : 89.6973798,
			latitude : 26.2172322
		}, {
			longitude : 89.7116522,
			latitude : 26.2034059
		}, {
			longitude : 89.7178963,
			latitude : 26.1967157
		}, {
			longitude : 89.7138822,
			latitude : 26.1895795
		}, {
			longitude : 89.7078538,
			latitude : 26.1865421
		}, {
			longitude : 89.7063,
			latitude : 26.1730771
		}, {
			longitude : 89.7193152,
			latitude : 26.166381
		}, {
			longitude : 89.7191457,
			latitude : 26.1654395
		}, {
			longitude : 89.7191363,
			latitude : 26.1651288
		}, {
			longitude : 89.7194752,
			latitude : 26.1635565
		}, {
			longitude : 89.7200778,
			latitude : 26.1616716
		}, {
			longitude : 89.7202755,
			latitude : 26.1602688
		}, {
			longitude : 89.720445,
			latitude : 26.1595467
		}, {
			longitude : 89.7205203,
			latitude : 26.1588688
		}, {
			longitude : 89.720373,
			latitude : 26.1563577
		}, {
			longitude : 89.728333,
			latitude : 26.16
		}, {
			longitude : 89.734167,
			latitude : 26.158611
		}, {
			longitude : 89.739167,
			latitude : 26.156389
		}, {
			longitude : 89.742222,
			latitude : 26.151944
		}, {
			longitude : 89.745278,
			latitude : 26.1475
		}, {
			longitude : 89.746944,
			latitude : 26.141389
		}, {
			longitude : 89.748056,
			latitude : 26.134722
		}, {
			longitude : 89.75,
			latitude : 26.128611
		}, {
			longitude : 89.751111,
			latitude : 26.121667
		}, {
			longitude : 89.753333,
			latitude : 26.116389
		}, {
			longitude : 89.755833,
			latitude : 26.111111
		}, {
			longitude : 89.759444,
			latitude : 26.1075
		}, {
			longitude : 89.763333,
			latitude : 26.103889
		}, {
			longitude : 89.767778,
			latitude : 26.100278
		}, {
			longitude : 89.771389,
			latitude : 26.096389
		}, {
			longitude : 89.775278,
			latitude : 26.092778
		}, {
			longitude : 89.778889,
			latitude : 26.088889
		}, {
			longitude : 89.781389,
			latitude : 26.083889
		}, {
			longitude : 89.783056,
			latitude : 26.077778
		}, {
			longitude : 89.783333,
			latitude : 26.071389
		}, {
			longitude : 89.780833,
			latitude : 26.066944
		}, {
			longitude : 89.778611,
			latitude : 26.0625
		}, {
			longitude : 89.776111,
			latitude : 26.057778
		}, {
			longitude : 89.775556,
			latitude : 26.052222
		}, {
			longitude : 89.775,
			latitude : 26.046667
		}, {
			longitude : 89.778056,
			latitude : 26.041944
		}, {
			longitude : 89.783611,
			latitude : 26.040833
		}, {
			longitude : 89.788611,
			latitude : 26.038611
		}, {
			longitude : 89.793056,
			latitude : 26.035556
		}, {
			longitude : 89.796111,
			latitude : 26.031111
		}, {
			longitude : 89.798333,
			latitude : 26.025833
		}, {
			longitude : 89.800278,
			latitude : 26.019722
		}, {
			longitude : 89.8025,
			latitude : 26.014722
		}, {
			longitude : 89.805,
			latitude : 26.009167
		}, {
			longitude : 89.8075,
			latitude : 26.004167
		}, {
			longitude : 89.809167,
			latitude : 25.998056
		}, {
			longitude : 89.812222,
			latitude : 25.993333
		}, {
			longitude : 89.816111,
			latitude : 25.989722
		}, {
			longitude : 89.823333,
			latitude : 25.991389
		}, {
			longitude : 89.826667,
			latitude : 25.995278
		}, {
			longitude : 89.83,
			latitude : 25.999167
		}, {
			longitude : 89.834167,
			latitude : 26.0025
		}, {
			longitude : 89.840556,
			latitude : 26.001944
		}, {
			longitude : 89.844167,
			latitude : 25.998333
		}, {
			longitude : 89.847778,
			latitude : 25.994444
		}, {
			longitude : 89.851389,
			latitude : 25.990833
		}, {
			longitude : 89.855833,
			latitude : 25.988056
		}, {
			longitude : 89.856944,
			latitude : 25.981111
		}, {
			longitude : 89.853611,
			latitude : 25.977222
		}, {
			longitude : 89.848611,
			latitude : 25.974444
		}, {
			longitude : 89.843889,
			latitude : 25.971667
		}, {
			longitude : 89.838889,
			latitude : 25.968889
		}, {
			longitude : 89.833889,
			latitude : 25.966111
		}, {
			longitude : 89.829722,
			latitude : 25.962778
		}, {
			longitude : 89.825556,
			latitude : 25.959444
		}, {
			longitude : 89.821389,
			latitude : 25.956111
		}, {
			longitude : 89.818889,
			latitude : 25.951667
		}, {
			longitude : 89.820556,
			latitude : 25.946944
		}, {
			longitude : 89.826111,
			latitude : 25.945556
		}, {
			longitude : 89.833056,
			latitude : 25.945833
		}, {
			longitude : 89.839444,
			latitude : 25.945278
		}, {
			longitude : 89.845833,
			latitude : 25.944722
		}, {
			longitude : 89.851944,
			latitude : 25.944167
		}, {
			longitude : 89.858333,
			latitude : 25.943611
		}, {
			longitude : 89.863333,
			latitude : 25.941389
		}, {
			longitude : 89.865833,
			latitude : 25.936111
		}, {
			longitude : 89.865,
			latitude : 25.930556
		}, {
			longitude : 89.862778,
			latitude : 25.926111
		}, {
			longitude : 89.860278,
			latitude : 25.921389
		}, {
			longitude : 89.858056,
			latitude : 25.916944
		}, {
			longitude : 89.854722,
			latitude : 25.913056
		}, {
			longitude : 89.851389,
			latitude : 25.909167
		}, {
			longitude : 89.848333,
			latitude : 25.905278
		}, {
			longitude : 89.846667,
			latitude : 25.900278
		}, {
			longitude : 89.843611,
			latitude : 25.896111
		}, {
			longitude : 89.841944,
			latitude : 25.891111
		}, {
			longitude : 89.839722,
			latitude : 25.886667
		}, {
			longitude : 89.836389,
			latitude : 25.882778
		}, {
			longitude : 89.833889,
			latitude : 25.878333
		}, {
			longitude : 89.830556,
			latitude : 25.874444
		}, {
			longitude : 89.828333,
			latitude : 25.869722
		}, {
			longitude : 89.825833,
			latitude : 25.865278
		}, {
			longitude : 89.823611,
			latitude : 25.860833
		}, {
			longitude : 89.821111,
			latitude : 25.856389
		}, {
			longitude : 89.818056,
			latitude : 25.8525
		}, {
			longitude : 89.815556,
			latitude : 25.848056
		}, {
			longitude : 89.813333,
			latitude : 25.843333
		}, {
			longitude : 89.810833,
			latitude : 25.838889
		}, {
			longitude : 89.808333,
			latitude : 25.834444
		}, {
			longitude : 89.807778,
			latitude : 25.828889
		}, {
			longitude : 89.807222,
			latitude : 25.823056
		}, {
			longitude : 89.808333,
			latitude : 25.816111
		}, {
			longitude : 89.810556,
			latitude : 25.810833
		}, {
			longitude : 89.813611,
			latitude : 25.806389
		}, {
			longitude : 89.815556,
			latitude : 25.800278
		}, {
			longitude : 89.817222,
			latitude : 25.794444
		}, {
			longitude : 89.818333,
			latitude : 25.7875
		}, {
			longitude : 89.820833,
			latitude : 25.782222
		}, {
			longitude : 89.8225,
			latitude : 25.776111
		}, {
			longitude : 89.824167,
			latitude : 25.77
		}, {
			longitude : 89.826111,
			latitude : 25.764167
		}, {
			longitude : 89.825278,
			latitude : 25.758333
		}, {
			longitude : 89.823889,
			latitude : 25.753333
		}, {
			longitude : 89.822222,
			latitude : 25.748333
		}, {
			longitude : 89.821667,
			latitude : 25.7425
		}, {
			longitude : 89.820278,
			latitude : 25.7375
		}, {
			longitude : 89.819444,
			latitude : 25.731944
		}, {
			longitude : 89.819722,
			latitude : 25.725556
		}, {
			longitude : 89.822222,
			latitude : 25.720278
		}, {
			longitude : 89.826667,
			latitude : 25.7175
		}, {
			longitude : 89.830278,
			latitude : 25.713611
		}, {
			longitude : 89.834444,
			latitude : 25.710833
		}, {
			longitude : 89.838333,
			latitude : 25.706944
		}, {
			longitude : 89.841389,
			latitude : 25.7025
		}, {
			longitude : 89.843611,
			latitude : 25.697222
		}, {
			longitude : 89.846111,
			latitude : 25.691944
		}, {
			longitude : 89.847778,
			latitude : 25.685833
		}, {
			longitude : 89.848889,
			latitude : 25.679167
		}, {
			longitude : 89.850556,
			latitude : 25.673056
		}, {
			longitude : 89.853056,
			latitude : 25.667778
		}, {
			longitude : 89.856111,
			latitude : 25.663333
		}, {
			longitude : 89.859167,
			latitude : 25.658889
		}, {
			longitude : 89.861667,
			latitude : 25.653611
		}, {
			longitude : 89.863333,
			latitude : 25.6475
		}, {
			longitude : 89.864444,
			latitude : 25.640556
		}, {
			longitude : 89.864722,
			latitude : 25.634444
		}, {
			longitude : 89.864167,
			latitude : 25.628611
		}, {
			longitude : 89.864167,
			latitude : 25.6225
		}, {
			longitude : 89.863611,
			latitude : 25.616667
		}, {
			longitude : 89.863056,
			latitude : 25.611111
		}, {
			longitude : 89.863333,
			latitude : 25.605
		}, {
			longitude : 89.8625,
			latitude : 25.599167
		}, {
			longitude : 89.861944,
			latitude : 25.593611
		}, {
			longitude : 89.861389,
			latitude : 25.587778
		}, {
			longitude : 89.860556,
			latitude : 25.582222
		}, {
			longitude : 89.86,
			latitude : 25.576667
		}, {
			longitude : 89.858611,
			latitude : 25.571389
		}, {
			longitude : 89.857778,
			latitude : 25.565833
		}, {
			longitude : 89.856389,
			latitude : 25.560833
		}, {
			longitude : 89.854722,
			latitude : 25.555556
		}, {
			longitude : 89.8525,
			latitude : 25.551111
		}, {
			longitude : 89.85,
			latitude : 25.546667
		}, {
			longitude : 89.848611,
			latitude : 25.541667
		}, {
			longitude : 89.848889,
			latitude : 25.535278
		}, {
			longitude : 89.85,
			latitude : 25.528611
		}, {
			longitude : 89.851111,
			latitude : 25.521667
		}, {
			longitude : 89.851389,
			latitude : 25.515556
		}, {
			longitude : 89.850556,
			latitude : 25.509722
		}, {
			longitude : 89.849167,
			latitude : 25.504722
		}, {
			longitude : 89.8475,
			latitude : 25.499722
		}, {
			longitude : 89.846111,
			latitude : 25.494444
		}, {
			longitude : 89.843889,
			latitude : 25.489444
		}, {
			longitude : 89.842222,
			latitude : 25.484167
		}, {
			longitude : 89.840833,
			latitude : 25.479167
		}, {
			longitude : 89.839444,
			latitude : 25.474167
		}, {
			longitude : 89.837778,
			latitude : 25.468889
		}, {
			longitude : 89.836389,
			latitude : 25.463889
		}, {
			longitude : 89.835833,
			latitude : 25.458333
		}, {
			longitude : 89.834167,
			latitude : 25.453056
		}, {
			longitude : 89.833611,
			latitude : 25.4475
		}, {
			longitude : 89.831944,
			latitude : 25.4425
		}, {
			longitude : 89.830556,
			latitude : 25.437222
		}, {
			longitude : 89.83,
			latitude : 25.431667
		}, {
			longitude : 89.8275,
			latitude : 25.427222
		}, {
			longitude : 89.826111,
			latitude : 25.422222
		}, {
			longitude : 89.823611,
			latitude : 25.4175
		}, {
			longitude : 89.822222,
			latitude : 25.4125
		}, {
			longitude : 89.82,
			latitude : 25.406667
		}, {
			longitude : 89.818611,
			latitude : 25.401667
		}, {
			longitude : 89.816944,
			latitude : 25.396667
		}, {
			longitude : 89.816389,
			latitude : 25.390833
		}, {
			longitude : 89.815833,
			latitude : 25.385278
		}, {
			longitude : 89.821817,
			latitude : 25.3854209
		}, {
			longitude : 89.815278,
			latitude : 25.379444
		}, {
			longitude : 89.814444,
			latitude : 25.373889
		}, {
			longitude : 89.815556,
			latitude : 25.366944
		}, {
			longitude : 89.817222,
			latitude : 25.360833
		}, {
			longitude : 89.819722,
			latitude : 25.355833
		}, {
			longitude : 89.822263,
			latitude : 25.3555381
		}, {
			longitude : 89.821389,
			latitude : 25.349722
		}, {
			longitude : 89.8223246,
			latitude : 25.3477468
		}, {
			longitude : 89.8396575,
			latitude : 25.4384963
		}, {
			longitude : 89.8566059,
			latitude : 25.4625809
		}, {
			longitude : 89.8641881,
			latitude : 25.4728391
		}, {
			longitude : 89.8552679,
			latitude : 25.4759612
		}, {
			longitude : 89.8797985,
			latitude : 25.4884495
		}, {
			longitude : 89.8699862,
			latitude : 25.544201
		}, {
			longitude : 89.8864887,
			latitude : 25.5580273
		}, {
			longitude : 89.9663247,
			latitude : 25.5718537
		}, {
			longitude : 89.979259,
			latitude : 25.5905861
		}, {
			longitude : 90.0020056,
			latitude : 25.584342
		}, {
			longitude : 90.01717,
			latitude : 25.6021824
		}, {
			longitude : 90.018508,
			latitude : 25.6084266
		}, {
			longitude : 90.0046817,
			latitude : 25.624037
		}, {
			longitude : 89.9832731,
			latitude : 25.6267131
		}, {
			longitude : 89.9805971,
			latitude : 25.6374173
		}, {
			longitude : 89.9471462,
			latitude : 25.6588259
		}, {
			longitude : 89.936888,
			latitude : 25.6864786
		}, {
			longitude : 89.9212776,
			latitude : 25.6945068
		}, {
			longitude : 89.9194935,
			latitude : 25.6967369
		}, {
			longitude : 89.9217236,
			latitude : 25.739108
		}, {
			longitude : 89.9333199,
			latitude : 25.7444601
		}, {
			longitude : 89.9337659,
			latitude : 25.7524883
		}, {
			longitude : 89.9551744,
			latitude : 25.7743429
		}, {
			longitude : 89.9520523,
			latitude : 25.8109158
		}, {
			longitude : 89.9444702,
			latitude : 25.8242961
		}, {
			longitude : 89.9681088,
			latitude : 25.8260802
		}, {
			longitude : 90.0015596,
			latitude : 25.8421366
		}, {
			longitude : 90.0002216,
			latitude : 25.8483808
		}, {
			longitude : 90.0082498,
			latitude : 25.8470427
		}, {
			longitude : 90.0220761,
			latitude : 25.8653292
		}, {
			longitude : 90.0046817,
			latitude : 25.8787095
		}, {
			longitude : 90.0211841,
			latitude : 25.8929819
		}, {
			longitude : 90.0421467,
			latitude : 25.8907518
		}, {
			longitude : 90.0631092,
			latitude : 25.9157285
		}, {
			longitude : 90.0778276,
			latitude : 25.9175125
		}, {
			longitude : 90.0920999,
			latitude : 25.9286628
		}, {
			longitude : 90.0880858,
			latitude : 25.936245
		}, {
			longitude : 90.1054803,
			latitude : 25.9420432
		}, {
			longitude : 90.1108324,
			latitude : 25.9540855
		}, {
			longitude : 90.1188606,
			latitude : 25.9612216
		}, {
			longitude : 90.1398232,
			latitude : 25.9580996
		}, {
			longitude : 90.1532035,
			latitude : 25.9647897
		}, {
			longitude : 90.1585556,
			latitude : 25.9580996
		}, {
			longitude : 90.1759501,
			latitude : 25.9572075
		}, {
			longitude : 90.1826403,
			latitude : 25.9442732
		}, {
			longitude : 90.1937905,
			latitude : 25.9572075
		}, {
			longitude : 90.2085089,
			latitude : 25.9616677
		}, {
			longitude : 90.212969,
			latitude : 25.9540855
		}, {
			longitude : 90.2272414,
			latitude : 25.9549775
		}, {
			longitude : 90.3244719,
			latitude : 25.974602
		}, {
			longitude : 90.3391903,
			latitude : 25.9969026
		}, {
			longitude : 90.3650589,
			latitude : 26.0102829
		}, {
			longitude : 90.3962797,
			latitude : 26.014297
		}, {
			longitude : 90.4109981,
			latitude : 26.0058228
		}, {
			longitude : 90.4172423,
			latitude : 25.9924424
		}, {
			longitude : 90.4288386,
			latitude : 25.9888744
		}, {
			longitude : 90.4573833,
			latitude : 25.9995786
		}, {
			longitude : 90.4774538,
			latitude : 26.015189
		}, {
			longitude : 90.4979703,
			latitude : 26.0035927
		}, {
			longitude : 90.5002004,
			latitude : 26.0013627
		}, {
			longitude : 90.5345433,
			latitude : 25.9580996
		}, {
			longitude : 90.5336512,
			latitude : 25.936245
		}, {
			longitude : 90.5715622,
			latitude : 25.9389211
		}, {
			longitude : 90.5729003,
			latitude : 25.9482873
		}, {
			longitude : 90.5786984,
			latitude : 25.9580996
		}, {
			longitude : 90.6076891,
			latitude : 25.9197426
		}, {
			longitude : 90.6063511,
			latitude : 25.9121604
		}, {
			longitude : 90.6081352,
			latitude : 25.9081463
		}, {
			longitude : 90.6143793,
			latitude : 25.8996721
		}, {
			longitude : 90.6246376,
			latitude : 25.89878
		}, {
			longitude : 90.6273136,
			latitude : 25.9170665
		}, {
			longitude : 90.6290977,
			latitude : 25.937583
		}, {
			longitude : 90.6754829,
			latitude : 25.936691
		}, {
			longitude : 90.6861872,
			latitude : 25.9509634
		}, {
			longitude : 90.717854,
			latitude : 25.9545315
		}, {
			longitude : 90.7254362,
			latitude : 25.9487333
		}, {
			longitude : 90.7401545,
			latitude : 25.9407051
		}, {
			longitude : 90.7441686,
			latitude : 25.9326769
		}, {
			longitude : 90.7526429,
			latitude : 25.9340149
		}, {
			longitude : 90.758887,
			latitude : 25.9215266
		}, {
			longitude : 90.757549,
			latitude : 25.9112684
		}, {
			longitude : 90.7455067,
			latitude : 25.9121604
		}, {
			longitude : 90.7406006,
			latitude : 25.9152825
		}, {
			longitude : 90.7780655,
			latitude : 25.9081463
		}, {
			longitude : 90.7918919,
			latitude : 25.935799
		}, {
			longitude : 90.8097323,
			latitude : 25.9523014
		}, {
			longitude : 90.8240047,
			latitude : 25.9451652
		}, {
			longitude : 90.836047,
			latitude : 25.9473953
		}, {
			longitude : 90.8431832,
			latitude : 25.9447192
		}, {
			longitude : 90.836939,
			latitude : 25.9380291
		}, {
			longitude : 90.8730659,
			latitude : 25.9429352
		}, {
			longitude : 90.8828782,
			latitude : 25.9518554
		}, {
			longitude : 90.8962585,
			latitude : 25.937583
		}, {
			longitude : 90.8953665,
			latitude : 25.9313389
		}, {
			longitude : 90.915883,
			latitude : 25.9433812
		}, {
			longitude : 90.9319395,
			latitude : 25.9398131
		}, {
			longitude : 90.9426437,
			latitude : 25.9473953
		}, {
			longitude : 90.9604842,
			latitude : 25.9277708
		}, {
			longitude : 90.9190051,
			latitude : 25.9134984
		}, {
			longitude : 90.9676204,
			latitude : 25.8871837
		}, {
			longitude : 91.0131135,
			latitude : 25.857301
		}, {
			longitude : 91.0264939,
			latitude : 25.8666672
		}, {
			longitude : 91.0291699,
			latitude : 25.8880758
		}, {
			longitude : 91.0492405,
			latitude : 25.8488268
		}, {
			longitude : 91.0657429,
			latitude : 25.8465967
		}, {
			longitude : 91.0728791,
			latitude : 25.8381225
		}, {
			longitude : 91.0813533,
			latitude : 25.8292023
		}, {
			longitude : 91.0630668,
			latitude : 25.820282
		}, {
			longitude : 91.0496865,
			latitude : 25.8287563
		}, {
			longitude : 91.0206957,
			latitude : 25.8225121
		}, {
			longitude : 91.0006252,
			latitude : 25.8220661
		}, {
			longitude : 91.0786772,
			latitude : 25.8528409
		}, {
			longitude : 91.1206023,
			latitude : 25.8314323
		}, {
			longitude : 91.1527151,
			latitude : 25.8501648
		}, {
			longitude : 91.1790298,
			latitude : 25.8425826
		}, {
			longitude : 91.1986543,
			latitude : 25.8474887
		}, {
			longitude : 91.2026684,
			latitude : 25.8403525
		}, {
			longitude : 91.1964242,
			latitude : 25.859085
		}, {
			longitude : 91.1897341,
			latitude : 25.820728
		}, {
			longitude : 91.1799218,
			latitude : 25.7761269
		}, {
			longitude : 91.189288,
			latitude : 25.7636386
		}, {
			longitude : 91.1919641,
			latitude : 25.7297417
		}, {
			longitude : 91.2160487,
			latitude : 25.7239436
		}, {
			longitude : 91.2240769,
			latitude : 25.7234976
		}, {
			longitude : 91.2552977,
			latitude : 25.7480282
		}, {
			longitude : 91.2758143,
			latitude : 25.7471362
		}, {
			longitude : 91.3333497,
			latitude : 25.8390145
		}, {
			longitude : 91.34227,
			latitude : 25.8358924
		}, {
			longitude : 91.4189839,
			latitude : 25.8546249
		}, {
			longitude : 91.4444066,
			latitude : 25.8407986
		}, {
			longitude : 91.4689372,
			latitude : 25.859085
		}, {
			longitude : 91.4774114,
			latitude : 25.8688973
		}, {
			longitude : 91.4934678,
			latitude : 25.8653292
		}, {
			longitude : 91.5135384,
			latitude : 25.8711273
		}, {
			longitude : 91.5255807,
			latitude : 25.8729114
		}, {
			longitude : 91.5327168,
			latitude : 25.8840617
		}, {
			longitude : 91.5255807,
			latitude : 25.8903058
		}, {
			longitude : 91.5032801,
			latitude : 25.8920899
		}, {
			longitude : 91.4832096,
			latitude : 25.8911979
		}, {
			longitude : 91.5086322,
			latitude : 25.9099303
		}, {
			longitude : 91.5055102,
			latitude : 25.9130524
		}, {
			longitude : 91.501496,
			latitude : 25.9206346
		}, {
			longitude : 91.5166604,
			latitude : 25.9201886
		}, {
			longitude : 91.5215666,
			latitude : 25.9246487
		}, {
			longitude : 91.5313788,
			latitude : 25.9237567
		}, {
			longitude : 91.5358389,
			latitude : 25.9340149
		}, {
			longitude : 91.5197825,
			latitude : 25.9407051
		}, {
			longitude : 91.5179985,
			latitude : 25.9527474
		}, {
			longitude : 91.5237966,
			latitude : 25.9594376
		}, {
			longitude : 91.537177,
			latitude : 25.9621137
		}, {
			longitude : 91.537177,
			latitude : 25.9683578
		}, {
			longitude : 91.5514493,
			latitude : 25.975048
		}, {
			longitude : 91.5969425,
			latitude : 26.0169731
		}, {
			longitude : 91.5880223,
			latitude : 26.0303534
		}, {
			longitude : 91.57598,
			latitude : 26.0330295
		}, {
			longitude : 91.6201351,
			latitude : 26.0272313
		}, {
			longitude : 91.6259332,
			latitude : 26.0241093
		}, {
			longitude : 91.6321774,
			latitude : 26.0223252
		}, {
			longitude : 91.6330694,
			latitude : 26.0049308
		}, {
			longitude : 91.6245952,
			latitude : 25.9857523
		}, {
			longitude : 91.6379755,
			latitude : 25.9647897
		}, {
			longitude : 91.6299473,
			latitude : 25.9447192
		}, {
			longitude : 91.6107688,
			latitude : 25.9447192
		}, {
			longitude : 91.6112149,
			latitude : 25.9398131
		}, {
			longitude : 91.6513559,
			latitude : 25.9077003
		}, {
			longitude : 91.6691963,
			latitude : 25.9054702
		}, {
			longitude : 91.6865908,
			latitude : 25.9210806
		}, {
			longitude : 91.7017552,
			latitude : 25.9380291
		}, {
			longitude : 91.7137975,
			latitude : 25.9473953
		}, {
			longitude : 91.7200416,
			latitude : 25.9540855
		}, {
			longitude : 91.7231637,
			latitude : 26.0303534
		}, {
			longitude : 91.7311919,
			latitude : 26.0593442
		}, {
			longitude : 91.7592907,
			latitude : 26.0713865
		}, {
			longitude : 91.7784691,
			latitude : 26.091457
		}, {
			longitude : 91.7905115,
			latitude : 26.0869969
		}, {
			longitude : 91.8195022,
			latitude : 26.1186637
		}, {
			longitude : 91.7910265,
			latitude : 26.1409355
		}, {
			longitude : 91.8756996,
			latitude : 26.0977011
		}, {
			longitude : 91.8694555,
			latitude : 26.0566681
		}, {
			longitude : 91.8832818,
			latitude : 26.0299074
		}, {
			longitude : 91.9171787,
			latitude : 26.0214332
		}, {
			longitude : 91.9341271,
			latitude : 26.014743
		}, {
			longitude : 91.9412633,
			latitude : 26.013851
		}, {
			longitude : 91.9256529,
			latitude : 25.9995786
		}, {
			longitude : 91.9194088,
			latitude : 26.0000246
		}, {
			longitude : 91.9782823,
			latitude : 26.0258933
		}, {
			longitude : 91.9912166,
			latitude : 26.0410577
		}, {
			longitude : 92.008165,
			latitude : 26.0392736
		}, {
			longitude : 92.0175313,
			latitude : 26.0397197
		}, {
			longitude : 92.0527662,
			latitude : 26.0330295
		}, {
			longitude : 92.0933532,
			latitude : 26.0486399
		}, {
			longitude : 92.1330482,
			latitude : 26.0459638
		}, {
			longitude : 92.1437525,
			latitude : 26.0575601
		}, {
			longitude : 92.1491046,
			latitude : 26.0615742
		}, {
			longitude : 92.1803254,
			latitude : 26.0687104
		}, {
			longitude : 92.1780954,
			latitude : 26.0794147
		}, {
			longitude : 92.2119923,
			latitude : 26.0709405
		}, {
			longitude : 92.240983,
			latitude : 26.0624662
		}, {
			longitude : 92.2735418,
			latitude : 26.0651423
		}, {
			longitude : 92.2958424,
			latitude : 26.0789687
		}, {
			longitude : 92.3016406,
			latitude : 26.0762926
		}, {
			longitude : 92.2218045,
			latitude : 25.9986866
		}, {
			longitude : 92.1914757,
			latitude : 25.9853063
		}, {
			longitude : 92.1656071,
			latitude : 25.9643437
		}, {
			longitude : 92.1651611,
			latitude : 25.9540855
		}, {
			longitude : 92.1562408,
			latitude : 25.9429352
		}, {
			longitude : 92.1598089,
			latitude : 25.9152825
		}, {
			longitude : 92.1807715,
			latitude : 25.9085923
		}, {
			longitude : 92.1972739,
			latitude : 25.9179585
		}, {
			longitude : 92.200396,
			latitude : 25.9081463
		}, {
			longitude : 92.2128843,
			latitude : 25.8920899
		}, {
			longitude : 92.2249266,
			latitude : 25.9014561
		}, {
			longitude : 92.2228023,
			latitude : 25.9108029
		}, {
			longitude : 92.2226965,
			latitude : 25.9112684
		}, {
			longitude : 92.2219323,
			latitude : 25.9111614
		}, {
			longitude : 92.1950438,
			latitude : 25.8813856
		}, {
			longitude : 92.1812175,
			latitude : 25.8715733
		}, {
			longitude : 92.1798794,
			latitude : 25.8702353
		}, {
			longitude : 92.1807715,
			latitude : 25.8515028
		}, {
			longitude : 92.1531187,
			latitude : 25.8126998
		}, {
			longitude : 92.1508887,
			latitude : 25.7837091
		}, {
			longitude : 92.1656071,
			latitude : 25.7346478
		}, {
			longitude : 92.1495507,
			latitude : 25.7145773
		}, {
			longitude : 92.161593,
			latitude : 25.6958448
		}, {
			longitude : 92.1602549,
			latitude : 25.6909387
		}, {
			longitude : 92.1656071,
			latitude : 25.6784504
		}, {
			longitude : 92.1607009,
			latitude : 25.6730983
		}, {
			longitude : 92.16031,
			latitude : 25.6733244
		}, {
			longitude : 92.1709592,
			latitude : 25.6668541
		}, {
			longitude : 92.2289407,
			latitude : 25.7163614
		}, {
			longitude : 92.2369689,
			latitude : 25.7083332
		}, {
			longitude : 92.2704198,
			latitude : 25.7110092
		}, {
			longitude : 92.3083307,
			latitude : 25.7261736
		}, {
			longitude : 92.3337534,
			latitude : 25.7252816
		}, {
			longitude : 92.3631901,
			latitude : 25.7364319
		}, {
			longitude : 92.3868287,
			latitude : 25.7431221
		}, {
			longitude : 92.3850447,
			latitude : 25.7533803
		}, {
			longitude : 92.4109134,
			latitude : 25.7431221
		}, {
			longitude : 92.4162655,
			latitude : 25.740446
		}, {
			longitude : 92.4122514,
			latitude : 25.7373239
		}, {
			longitude : 92.4171575,
			latitude : 25.7297417
		}, {
			longitude : 92.4332139,
			latitude : 25.7315258
		}, {
			longitude : 92.4421342,
			latitude : 25.7208215
		}, {
			longitude : 92.4274158,
			latitude : 25.7105632
		}, {
			longitude : 92.4323219,
			latitude : 25.6909387
		}, {
			longitude : 92.4653267,
			latitude : 25.6824645
		}, {
			longitude : 92.5018997,
			latitude : 25.623145
		}, {
			longitude : 92.5576511,
			latitude : 25.6119947
		}, {
			longitude : 92.5607732,
			latitude : 25.5740837
		}, {
			longitude : 92.5723695,
			latitude : 25.5602574
		}, {
			longitude : 92.5875339,
			latitude : 25.5531212
		}, {
			longitude : 92.6026983,
			latitude : 25.5575813
		}, {
			longitude : 92.6084964,
			latitude : 25.5656095
		}, {
			longitude : 92.630351,
			latitude : 25.5705156
		}, {
			longitude : 92.6499755,
			latitude : 25.5598114
		}, {
			longitude : 92.6606798,
			latitude : 25.5705156
		}, {
			longitude : 92.6606798,
			latitude : 25.5816659
		}, {
			longitude : 92.6481914,
			latitude : 25.5923702
		}, {
			longitude : 92.6422266,
			latitude : 25.5404401
		}, {
			longitude : 92.6374872,
			latitude : 25.5285906
		}, {
			longitude : 92.5982382,
			latitude : 25.4715011
		}, {
			longitude : 92.5754916,
			latitude : 25.4902336
		}, {
			longitude : 92.5679094,
			latitude : 25.4808673
		}, {
			longitude : 92.5674634,
			latitude : 25.467487
		}, {
			longitude : 92.6089424,
			latitude : 25.4166417
		}, {
			longitude : 92.6285669,
			latitude : 25.4251159
		}, {
			longitude : 92.629459,
			latitude : 25.4344821
		}, {
			longitude : 92.6415013,
			latitude : 25.4193178
		}, {
			longitude : 92.6602337,
			latitude : 25.4103975
		}, {
			longitude : 92.6736141,
			latitude : 25.4170877
		}, {
			longitude : 92.6544356,
			latitude : 25.4353742
		}, {
			longitude : 92.7182152,
			latitude : 25.3751626
		}, {
			longitude : 92.7369477,
			latitude : 25.3814068
		}, {
			longitude : 92.7400698,
			latitude : 25.3644584
		}, {
			longitude : 92.7605863,
			latitude : 25.3354676
		}, {
			longitude : 92.7726286,
			latitude : 25.3394817
		}, {
			longitude : 92.7842249,
			latitude : 25.3323455
		}, {
			longitude : 92.7837789,
			latitude : 25.3078149
		}, {
			longitude : 92.7922531,
			latitude : 25.2850683
		}, {
			longitude : 92.7699526,
			latitude : 25.2690119
		}, {
			longitude : 92.7766427,
			latitude : 25.2605377
		}, {
			longitude : 92.7646004,
			latitude : 25.2493874
		}, {
			longitude : 92.7721826,
			latitude : 25.233331
		}, {
			longitude : 92.7797648,
			latitude : 25.2030022
		}, {
			longitude : 92.8042954,
			latitude : 25.2195046
		}, {
			longitude : 92.747206,
			latitude : 25.2079083
		}, {
			longitude : 92.6941306,
			latitude : 25.1811477
		}, {
			longitude : 92.6669239,
			latitude : 25.1771336
		}, {
			longitude : 92.6593417,
			latitude : 25.1592931
		}, {
			longitude : 92.6379332,
			latitude : 25.1450207
		}, {
			longitude : 92.6214307,
			latitude : 25.117814
		}, {
			longitude : 92.5817357,
			latitude : 25.1320864
		}, {
			longitude : 92.5576511,
			latitude : 25.1298563
		}, {
			longitude : 92.5250923,
			latitude : 25.1253962
		}, {
			longitude : 92.5246463,
			latitude : 25.1401146
		}, {
			longitude : 92.5429327,
			latitude : 25.0995276
		}, {
			longitude : 92.4845052,
			latitude : 25.1080018
		}, {
			longitude : 92.474693,
			latitude : 25.0709828
		}, {
			longitude : 92.4599746,
			latitude : 25.0544804
		}, {
			longitude : 92.4465943,
			latitude : 25.0419921
		}, {
			longitude : 92.4630967,
			latitude : 25.037086
		}, {
			longitude : 92.411389,
			latitude : 25.020556
		}, {
			longitude : 92.4095396,
			latitude : 25.0249482
		}, {
			longitude : 92.4125,
			latitude : 25.013611
		}, {
			longitude : 92.411667,
			latitude : 25.008056
		}, {
			longitude : 92.411667,
			latitude : 25.001944
		}, {
			longitude : 92.4125,
			latitude : 24.996389
		}, {
			longitude : 92.413333,
			latitude : 24.989444
		}, {
			longitude : 92.414167,
			latitude : 24.982778
		}, {
			longitude : 92.416389,
			latitude : 24.9775
		}, {
			longitude : 92.419444,
			latitude : 24.972778
		}, {
			longitude : 92.422778,
			latitude : 24.968889
		}, {
			longitude : 92.427222,
			latitude : 24.966111
		}, {
			longitude : 92.434167,
			latitude : 24.966111
		}, {
			longitude : 92.440833,
			latitude : 24.966111
		}, {
			longitude : 92.447778,
			latitude : 24.966111
		}, {
			longitude : 92.453333,
			latitude : 24.964722
		}, {
			longitude : 92.456944,
			latitude : 24.960833
		}, {
			longitude : 92.454444,
			latitude : 24.956389
		}, {
			longitude : 92.451111,
			latitude : 24.9525
		}, {
			longitude : 92.449444,
			latitude : 24.9475
		}, {
			longitude : 92.453611,
			latitude : 24.944722
		}, {
			longitude : 92.46,
			latitude : 24.943889
		}, {
			longitude : 92.466111,
			latitude : 24.943056
		}, {
			longitude : 92.471667,
			latitude : 24.941667
		}, {
			longitude : 92.477222,
			latitude : 24.940278
		}, {
			longitude : 92.481389,
			latitude : 24.937222
		}, {
			longitude : 92.484444,
			latitude : 24.9325
		}, {
			longitude : 92.486667,
			latitude : 24.927222
		}, {
			longitude : 92.488889,
			latitude : 24.921944
		}, {
			longitude : 92.490278,
			latitude : 24.915833
		}, {
			longitude : 92.491111,
			latitude : 24.908889
		}, {
			longitude : 92.492222,
			latitude : 24.902222
		}, {
			longitude : 92.493056,
			latitude : 24.895278
		}, {
			longitude : 92.495278,
			latitude : 24.89
		}, {
			longitude : 92.496944,
			latitude : 24.889444
		}, {
			longitude : 92.492778,
			latitude : 24.886389
		}, {
			longitude : 92.4920177,
			latitude : 24.8809228
		}, {
			longitude : 92.487865,
			latitude : 24.8769419
		}, {
			longitude : 92.483611,
			latitude : 24.874167
		}, {
			longitude : 92.478611,
			latitude : 24.871667
		}, {
			longitude : 92.473056,
			latitude : 24.873056
		}, {
			longitude : 92.468056,
			latitude : 24.875278
		}, {
			longitude : 92.4625,
			latitude : 24.876667
		}, {
			longitude : 92.455,
			latitude : 24.875833
		}, {
			longitude : 92.450833,
			latitude : 24.872778
		}, {
			longitude : 92.4475,
			latitude : 24.868889
		}, {
			longitude : 92.443333,
			latitude : 24.865
		}, {
			longitude : 92.436667,
			latitude : 24.863611
		}, {
			longitude : 92.429167,
			latitude : 24.862778
		}, {
			longitude : 92.423056,
			latitude : 24.863611
		}, {
			longitude : 92.416111,
			latitude : 24.863333
		}, {
			longitude : 92.409444,
			latitude : 24.861944
		}, {
			longitude : 92.403611,
			latitude : 24.86
		}, {
			longitude : 92.396944,
			latitude : 24.858611
		}, {
			longitude : 92.389444,
			latitude : 24.857778
		}, {
			longitude : 92.383056,
			latitude : 24.858611
		}, {
			longitude : 92.378056,
			latitude : 24.860833
		}, {
			longitude : 92.373333,
			latitude : 24.863056
		}, {
			longitude : 92.369167,
			latitude : 24.865833
		}, {
			longitude : 92.364722,
			latitude : 24.868889
		}, {
			longitude : 92.359444,
			latitude : 24.870556
		}, {
			longitude : 92.354444,
			latitude : 24.872778
		}, {
			longitude : 92.350833,
			latitude : 24.876389
		}, {
			longitude : 92.346667,
			latitude : 24.879444
		}, {
			longitude : 92.3425,
			latitude : 24.8825
		}, {
			longitude : 92.3375,
			latitude : 24.884722
		}, {
			longitude : 92.331944,
			latitude : 24.886111
		}, {
			longitude : 92.327222,
			latitude : 24.888611
		}, {
			longitude : 92.322222,
			latitude : 24.890833
		}, {
			longitude : 92.317222,
			latitude : 24.893056
		}, {
			longitude : 92.311667,
			latitude : 24.894444
		}, {
			longitude : 92.306111,
			latitude : 24.895833
		}, {
			longitude : 92.301944,
			latitude : 24.898889
		}, {
			longitude : 92.297778,
			latitude : 24.901944
		}, {
			longitude : 92.293611,
			latitude : 24.905
		}, {
			longitude : 92.287222,
			latitude : 24.905556
		}, {
			longitude : 92.281667,
			latitude : 24.907222
		}, {
			longitude : 92.275556,
			latitude : 24.907778
		}, {
			longitude : 92.268889,
			latitude : 24.906389
		}, {
			longitude : 92.262222,
			latitude : 24.905
		}, {
			longitude : 92.255278,
			latitude : 24.903611
		}, {
			longitude : 92.251389,
			latitude : 24.900278
		}, {
			longitude : 92.248056,
			latitude : 24.896389
		}, {
			longitude : 92.245556,
			latitude : 24.891944
		}, {
			longitude : 92.244722,
			latitude : 24.886389
		}, {
			longitude : 92.245556,
			latitude : 24.879444
		}, {
			longitude : 92.245556,
			latitude : 24.873333
		}, {
			longitude : 92.245833,
			latitude : 24.867222
		}, {
			longitude : 92.245833,
			latitude : 24.860833
		}, {
			longitude : 92.2475,
			latitude : 24.854722
		}, {
			longitude : 92.248889,
			latitude : 24.848611
		}, {
			longitude : 92.250556,
			latitude : 24.8425
		}, {
			longitude : 92.253333,
			latitude : 24.838056
		}, {
			longitude : 92.256389,
			latitude : 24.833611
		}, {
			longitude : 92.26,
			latitude : 24.829722
		}, {
			longitude : 92.262222,
			latitude : 24.824444
		}, {
			longitude : 92.263611,
			latitude : 24.818333
		}, {
			longitude : 92.263889,
			latitude : 24.812222
		}, {
			longitude : 92.263056,
			latitude : 24.806389
		}, {
			longitude : 92.262222,
			latitude : 24.800833
		}, {
			longitude : 92.261389,
			latitude : 24.795278
		}, {
			longitude : 92.259722,
			latitude : 24.790278
		}, {
			longitude : 92.258889,
			latitude : 24.784444
		}, {
			longitude : 92.2575,
			latitude : 24.779444
		}, {
			longitude : 92.256667,
			latitude : 24.773889
		}, {
			longitude : 92.255,
			latitude : 24.768889
		}, {
			longitude : 92.253333,
			latitude : 24.763889
		}, {
			longitude : 92.2525,
			latitude : 24.758056
		}, {
			longitude : 92.251111,
			latitude : 24.753056
		}, {
			longitude : 92.249444,
			latitude : 24.748056
		}, {
			longitude : 92.248611,
			latitude : 24.7425
		}, {
			longitude : 92.246944,
			latitude : 24.7375
		}, {
			longitude : 92.245278,
			latitude : 24.732222
		}, {
			longitude : 92.242778,
			latitude : 24.728056
		}, {
			longitude : 92.241111,
			latitude : 24.722778
		}, {
			longitude : 92.238611,
			latitude : 24.718333
		}, {
			longitude : 92.236389,
			latitude : 24.713889
		}, {
			longitude : 92.234722,
			latitude : 24.708889
		}, {
			longitude : 92.232222,
			latitude : 24.704444
		}, {
			longitude : 92.229722,
			latitude : 24.7
		}, {
			longitude : 92.228056,
			latitude : 24.695
		}, {
			longitude : 92.225556,
			latitude : 24.690556
		}, {
			longitude : 92.224167,
			latitude : 24.685556
		}, {
			longitude : 92.221667,
			latitude : 24.681111
		}, {
			longitude : 92.22,
			latitude : 24.676111
		}, {
			longitude : 92.2175,
			latitude : 24.671111
		}, {
			longitude : 92.215833,
			latitude : 24.665833
		}, {
			longitude : 92.213611,
			latitude : 24.661667
		}, {
			longitude : 92.211111,
			latitude : 24.657222
		}, {
			longitude : 92.209444,
			latitude : 24.652222
		}, {
			longitude : 92.207778,
			latitude : 24.646944
		}, {
			longitude : 92.206111,
			latitude : 24.641944
		}, {
			longitude : 92.203611,
			latitude : 24.6375
		}, {
			longitude : 92.201944,
			latitude : 24.6325
		}, {
			longitude : 92.201389,
			latitude : 24.626944
		}, {
			longitude : 92.199722,
			latitude : 24.621944
		}, {
			longitude : 92.198889,
			latitude : 24.616111
		}, {
			longitude : 92.198056,
			latitude : 24.610556
		}, {
			longitude : 92.1975,
			latitude : 24.605
		}, {
			longitude : 92.196667,
			latitude : 24.599167
		}, {
			longitude : 92.196667,
			latitude : 24.593056
		}, {
			longitude : 92.195833,
			latitude : 24.5875
		}, {
			longitude : 92.195278,
			latitude : 24.581944
		}, {
			longitude : 92.194444,
			latitude : 24.575556
		}, {
			longitude : 92.192778,
			latitude : 24.570556
		}, {
			longitude : 92.191111,
			latitude : 24.565278
		}, {
			longitude : 92.188056,
			latitude : 24.560833
		}, {
			longitude : 92.185556,
			latitude : 24.556389
		}, {
			longitude : 92.182222,
			latitude : 24.5525
		}, {
			longitude : 92.178056,
			latitude : 24.549444
		}, {
			longitude : 92.173889,
			latitude : 24.546111
		}, {
			longitude : 92.168889,
			latitude : 24.543611
		}, {
			longitude : 92.1785414,
			latitude : 24.5232808
		}, {
			longitude : 92.1928138,
			latitude : 24.5214968
		}, {
			longitude : 92.2070861,
			latitude : 24.5067784
		}, {
			longitude : 92.2311707,
			latitude : 24.5041023
		}, {
			longitude : 92.2307247,
			latitude : 24.4996422
		}, {
			longitude : 92.239199,
			latitude : 24.4898299
		}, {
			longitude : 92.2302787,
			latitude : 24.4800177
		}, {
			longitude : 92.2311707,
			latitude : 24.4603932
		}, {
			longitude : 92.2565934,
			latitude : 24.4363086
		}, {
			longitude : 92.2561474,
			latitude : 24.4189141
		}, {
			longitude : 92.2730958,
			latitude : 24.3885853
		}, {
			longitude : 92.2726498,
			latitude : 24.3792191
		}, {
			longitude : 92.2967344,
			latitude : 24.2516598
		}, {
			longitude : 92.2128843,
			latitude : 24.2494298
		}, {
			longitude : 92.4225096,
			latitude : 24.2529979
		}, {
			longitude : 92.4189416,
			latitude : 24.1945704
		}, {
			longitude : 92.4341059,
			latitude : 24.18119
		}, {
			longitude : 92.4439182,
			latitude : 24.1530913
		}, {
			longitude : 92.437228,
			latitude : 24.1513073
		}, {
			longitude : 92.4657728,
			latitude : 24.1348048
		}, {
			longitude : 92.4809371,
			latitude : 24.141495
		}, {
			longitude : 92.4858433,
			latitude : 24.1620115
		}, {
			longitude : 92.5001156,
			latitude : 24.1606735
		}, {
			longitude : 92.5050218,
			latitude : 24.1673637
		}, {
			longitude : 92.5085899,
			latitude : 24.1691477
		}, {
			longitude : 92.51305,
			latitude : 24.1624576
		}, {
			longitude : 92.51528,
			latitude : 24.1753919
		}, {
			longitude : 92.5255383,
			latitude : 24.1727158
		}, {
			longitude : 92.5326745,
			latitude : 24.180744
		}, {
			longitude : 92.5505149,
			latitude : 24.2458617
		}, {
			longitude : 92.5643413,
			latitude : 24.2498758
		}, {
			longitude : 92.5879799,
			latitude : 24.2449697
		}, {
			longitude : 92.6116185,
			latitude : 24.2534439
		}, {
			longitude : 92.6410552,
			latitude : 24.3288198
		}, {
			longitude : 92.6379332,
			latitude : 24.33551
		}, {
			longitude : 92.6490835,
			latitude : 24.3288198
		}, {
			longitude : 92.6575577,
			latitude : 24.3435382
		}, {
			longitude : 92.6838723,
			latitude : 24.3475523
		}, {
			longitude : 92.6905625,
			latitude : 24.3546885
		}, {
			longitude : 92.6968067,
			latitude : 24.373867
		}, {
			longitude : 92.7039429,
			latitude : 24.376097
		}, {
			longitude : 92.6241068,
			latitude : 24.3328339
		}, {
			longitude : 92.8007273,
			latitude : 24.4189141
		}, {
			longitude : 92.8096476,
			latitude : 24.4193601
		}, {
			longitude : 92.8029574,
			latitude : 24.4273883
		}, {
			longitude : 92.8315021,
			latitude : 24.4006277
		}, {
			longitude : 92.825258,
			latitude : 24.3903694
		}, {
			longitude : 92.8328402,
			latitude : 24.376543
		}, {
			longitude : 92.8444365,
			latitude : 24.3796651
		}, {
			longitude : 92.8627229,
			latitude : 24.3992896
		}, {
			longitude : 92.8908217,
			latitude : 24.4024117
		}, {
			longitude : 92.8961738,
			latitude : 24.3943835
		}, {
			longitude : 92.905986,
			latitude : 24.3952755
		}, {
			longitude : 92.9113382,
			latitude : 24.413116
		}, {
			longitude : 92.9358688,
			latitude : 24.3957215
		}, {
			longitude : 92.9510332,
			latitude : 24.4046418
		}, {
			longitude : 92.9603994,
			latitude : 24.3957215
		}, {
			longitude : 92.9755638,
			latitude : 24.4077638
		}, {
			longitude : 92.9884982,
			latitude : 24.4077638
		}, {
			longitude : 92.9920662,
			latitude : 24.4055338
		}, {
			longitude : 93.0005405,
			latitude : 24.4033037
		}, {
			longitude : 93.0063386,
			latitude : 24.4117779
		}, {
			longitude : 93.0161509,
			latitude : 24.4024117
		}, {
			longitude : 93.0393435,
			latitude : 24.4113319
		}, {
			longitude : 93.0322073,
			latitude : 24.4287264
		}, {
			longitude : 93.0380054,
			latitude : 24.4612852
		}, {
			longitude : 93.0482637,
			latitude : 24.4639613
		}, {
			longitude : 93.0487097,
			latitude : 24.4755576
		}, {
			longitude : 93.0357754,
			latitude : 24.4969661
		}, {
			longitude : 93.0442496,
			latitude : 24.5058864
		}, {
			longitude : 93.0415735,
			latitude : 24.5148066
		}, {
			longitude : 93.0527238,
			latitude : 24.5197127
		}, {
			longitude : 93.0482637,
			latitude : 24.530863
		}, {
			longitude : 93.0527238,
			latitude : 24.5446893
		}, {
			longitude : 93.0656581,
			latitude : 24.5473654
		}, {
			longitude : 93.061198,
			latitude : 24.5549476
		}, {
			longitude : 93.0727943,
			latitude : 24.5611918
		}, {
			longitude : 93.0870667,
			latitude : 24.571004
		}, {
			longitude : 93.0973249,
			latitude : 24.5826003
		}, {
			longitude : 93.1071372,
			latitude : 24.5834923
		}, {
			longitude : 93.098663,
			latitude : 24.5915205
		}, {
			longitude : 93.0754704,
			latitude : 24.5964267
		}, {
			longitude : 93.0866207,
			latitude : 24.611145
		}, {
			longitude : 93.0794845,
			latitude : 24.6214033
		}, {
			longitude : 93.0794845,
			latitude : 24.6263094
		}, {
			longitude : 93.0892967,
			latitude : 24.6276475
		}, {
			longitude : 93.0848366,
			latitude : 24.647718
		}, {
			longitude : 93.0964329,
			latitude : 24.6526241
		}, {
			longitude : 93.1049071,
			latitude : 24.6753707
		}, {
			longitude : 93.1017851,
			latitude : 24.6802768
		}, {
			longitude : 93.0919728,
			latitude : 24.6776008
		}, {
			longitude : 93.0933108,
			latitude : 24.687859
		}, {
			longitude : 93.0888507,
			latitude : 24.7092676
		}, {
			longitude : 93.0785925,
			latitude : 24.7141737
		}, {
			longitude : 93.0768603,
			latitude : 24.7126862
		}, {
			longitude : 93.0759164,
			latitude : 24.7106056
		}, {
			longitude : 93.098663,
			latitude : 24.7445025
		}, {
			longitude : 93.1071372,
			latitude : 24.7418264
		}, {
			longitude : 93.1057992,
			latitude : 24.7694791
		}, {
			longitude : 93.101339,
			latitude : 24.7783993
		}, {
			longitude : 93.1124893,
			latitude : 24.8020379
		}, {
			longitude : 93.1098133,
			latitude : 24.8096201
		}, {
			longitude : 93.1214096,
			latitude : 24.8087281
		}, {
			longitude : 93.1312218,
			latitude : 24.806052
		}, {
			longitude : 93.13702,
			latitude : 24.8109582
		}, {
			longitude : 93.1227476,
			latitude : 24.8198784
		}, {
			longitude : 93.1530764,
			latitude : 24.7899956
		}, {
			longitude : 93.1744849,
			latitude : 24.803822
		}, {
			longitude : 93.1816211,
			latitude : 24.80516
		}, {
			longitude : 93.178945,
			latitude : 24.7962398
		}, {
			longitude : 93.1932174,
			latitude : 24.806052
		}, {
			longitude : 93.1985695,
			latitude : 24.8149723
		}, {
			longitude : 93.1914334,
			latitude : 24.8225545
		}, {
			longitude : 93.1972315,
			latitude : 24.8337048
		}, {
			longitude : 93.1927714,
			latitude : 24.8363808
		}, {
			longitude : 93.1945554,
			latitude : 24.843963
		}, {
			longitude : 93.2016916,
			latitude : 24.843963
		}, {
			longitude : 93.2016916,
			latitude : 24.8399489
		}, {
			longitude : 93.1972315,
			latitude : 24.8564513
		}, {
			longitude : 93.2141799,
			latitude : 24.8618035
		}, {
			longitude : 93.2333584,
			latitude : 24.8849961
		}, {
			longitude : 93.2306824,
			latitude : 24.8948083
		}, {
			longitude : 93.2431707,
			latitude : 24.9037285
		}, {
			longitude : 93.2391566,
			latitude : 24.9148788
		}, {
			longitude : 93.2534289,
			latitude : 24.9188929
		}, {
			longitude : 93.2503069,
			latitude : 24.9300432
		}, {
			longitude : 93.2431707,
			latitude : 24.9313813
		}, {
			longitude : 93.2400486,
			latitude : 24.9389634
		}, {
			longitude : 93.2485228,
			latitude : 24.9403015
		}, {
			longitude : 93.254321,
			latitude : 24.9425315
		}, {
			longitude : 93.2623492,
			latitude : 24.9514518
		}, {
			longitude : 93.2494148,
			latitude : 24.9550199
		}, {
			longitude : 93.2632412,
			latitude : 24.9661701
		}, {
			longitude : 93.2529829,
			latitude : 24.9750904
		}, {
			longitude : 93.255659,
			latitude : 25.0022971
		}, {
			longitude : 93.2632412,
			latitude : 25.0040811
		}, {
			longitude : 93.2467388,
			latitude : 25.0036351
		}, {
			longitude : 93.2489688,
			latitude : 25.0187995
		}, {
			longitude : 93.2578891,
			latitude : 25.0219216
		}, {
			longitude : 93.255659,
			latitude : 25.0286117
		}, {
			longitude : 93.2681473,
			latitude : 25.0495743
		}, {
			longitude : 93.2917859,
			latitude : 25.0468982
		}, {
			longitude : 93.3002601,
			latitude : 25.0526964
		}, {
			longitude : 93.3047203,
			latitude : 25.0477902
		}, {
			longitude : 93.3127485,
			latitude : 25.078119
		}, {
			longitude : 93.3234527,
			latitude : 25.0914994
		}, {
			longitude : 93.3359411,
			latitude : 25.0959595
		}, {
			longitude : 93.3493214,
			latitude : 25.1253962
		}, {
			longitude : 93.3475374,
			latitude : 25.1637532
		}, {
			longitude : 93.3528895,
			latitude : 25.1815937
		}, {
			longitude : 93.3850023,
			latitude : 25.2257488
		}, {
			longitude : 93.3885704,
			latitude : 25.2458193
		}, {
			longitude : 93.4037348,
			latitude : 25.2632138
		}, {
			longitude : 93.4206832,
			latitude : 25.2663358
		}, {
			longitude : 93.4264814,
			latitude : 25.2810542
		}, {
			longitude : 93.4599322,
			latitude : 25.2948806
		}, {
			longitude : 93.4742046,
			latitude : 25.3091529
		}, {
			longitude : 93.4568102,
			latitude : 25.3252093
		}, {
			longitude : 93.4617163,
			latitude : 25.3368056
		}, {
			longitude : 93.451904,
			latitude : 25.3443878
		}, {
			longitude : 93.4773267,
			latitude : 25.3858669
		}, {
			longitude : 93.4630543,
			latitude : 25.4108435
		}, {
			longitude : 93.4652844,
			latitude : 25.4233319
		}, {
			longitude : 93.4568102,
			latitude : 25.4420643
		}, {
			longitude : 93.4273734,
			latitude : 25.4554447
		}, {
			longitude : 93.4220213,
			latitude : 25.4549987
		}, {
			longitude : 93.3903545,
			latitude : 25.469271
		}, {
			longitude : 93.3863403,
			latitude : 25.4933557
		}, {
			longitude : 93.371622,
			latitude : 25.5009379
		}, {
			longitude : 93.3701041,
			latitude : 25.5037842
		}, {
			longitude : 93.368588,
			latitude : 25.5041647
		}, {
			longitude : 93.3674593,
			latitude : 25.5039662
		}, {
			longitude : 93.3657856,
			latitude : 25.5033465
		}, {
			longitude : 93.3647342,
			latitude : 25.5035401
		}, {
			longitude : 93.3641119,
			latitude : 25.5040437
		}, {
			longitude : 93.3641334,
			latitude : 25.5047409
		}, {
			longitude : 93.363833,
			latitude : 25.5053219
		}, {
			longitude : 93.3639188,
			latitude : 25.5064257
		}, {
			longitude : 93.363554,
			latitude : 25.506755
		}, {
			longitude : 93.3627386,
			latitude : 25.5064838
		}, {
			longitude : 93.3623738,
			latitude : 25.5068324
		}, {
			longitude : 93.3626099,
			latitude : 25.5078201
		}, {
			longitude : 93.3623309,
			latitude : 25.5088271
		}, {
			longitude : 93.3614941,
			latitude : 25.5092726
		}, {
			longitude : 93.3613138,
			latitude : 25.5095679
		}, {
			longitude : 93.361979,
			latitude : 25.5102263
		}, {
			longitude : 93.3621164,
			latitude : 25.5107056
		}, {
			longitude : 93.3617301,
			latitude : 25.5116352
		}, {
			longitude : 93.3612151,
			latitude : 25.5120612
		}, {
			longitude : 93.3607645,
			latitude : 25.5131457
		}, {
			longitude : 93.3604212,
			latitude : 25.5133006
		}, {
			longitude : 93.3593483,
			latitude : 25.5132038
		}, {
			longitude : 93.3580609,
			latitude : 25.5132619
		}, {
			longitude : 93.3568163,
			latitude : 25.5138622
		}, {
			longitude : 93.3567519,
			latitude : 25.5142689
		}, {
			longitude : 93.3569451,
			latitude : 25.5147142
		}, {
			longitude : 93.3574386,
			latitude : 25.5149079
		}, {
			longitude : 93.3577175,
			latitude : 25.5151403
		}, {
			longitude : 93.3575673,
			latitude : 25.5153533
		}, {
			longitude : 93.3571382,
			latitude : 25.5155469
		}, {
			longitude : 93.3565374,
			latitude : 25.5155469
		}, {
			longitude : 93.3563013,
			latitude : 25.5158761
		}, {
			longitude : 93.3560438,
			latitude : 25.5170574
		}, {
			longitude : 93.355958,
			latitude : 25.5177739
		}, {
			longitude : 93.3557434,
			latitude : 25.5193424
		}, {
			longitude : 93.3559795,
			latitude : 25.5209109
		}, {
			longitude : 93.3553572,
			latitude : 25.5219178
		}, {
			longitude : 93.3551426,
			latitude : 25.5231765
		}, {
			longitude : 93.3552714,
			latitude : 25.5246094
		}, {
			longitude : 93.3547993,
			latitude : 25.5253839
		}, {
			longitude : 93.3537264,
			latitude : 25.5268361
		}, {
			longitude : 93.3533831,
			latitude : 25.5279205
		}, {
			longitude : 93.3529325,
			latitude : 25.5288305
		}, {
			longitude : 93.3524604,
			latitude : 25.5289854
		}, {
			longitude : 93.3511086,
			latitude : 25.5285788
		}, {
			longitude : 93.3505936,
			latitude : 25.5284239
		}, {
			longitude : 93.3501215,
			latitude : 25.5286369
		}, {
			longitude : 93.3501001,
			latitude : 25.5296437
		}, {
			longitude : 93.3505078,
			latitude : 25.530244
		}, {
			longitude : 93.3505507,
			latitude : 25.5306506
		}, {
			longitude : 93.3487482,
			latitude : 25.5313864
		}, {
			longitude : 93.3489199,
			latitude : 25.5318704
		}, {
			longitude : 93.3496065,
			latitude : 25.5324706
		}, {
			longitude : 93.3500571,
			latitude : 25.5325675
		}, {
			longitude : 93.3502932,
			latitude : 25.5324319
		}, {
			longitude : 93.348598,
			latitude : 25.5303408
		}, {
			longitude : 93.3484264,
			latitude : 25.5301084
		}, {
			longitude : 93.348083,
			latitude : 25.5300891
		}, {
			longitude : 93.3471604,
			latitude : 25.530244
		}, {
			longitude : 93.3465595,
			latitude : 25.5306312
		}, {
			longitude : 93.346345,
			latitude : 25.5310572
		}, {
			longitude : 93.3466153,
			latitude : 25.5314687
		}, {
			longitude : 93.3466454,
			latitude : 25.5319091
		}, {
			longitude : 93.3469587,
			latitude : 25.5328821
		}, {
			longitude : 93.3471174,
			latitude : 25.5333032
		}, {
			longitude : 93.3469672,
			latitude : 25.533613
		}, {
			longitude : 93.3464737,
			latitude : 25.533826
		}, {
			longitude : 93.3455081,
			latitude : 25.5340971
		}, {
			longitude : 93.3449073,
			latitude : 25.5345811
		}, {
			longitude : 93.3421393,
			latitude : 25.5350651
		}, {
			longitude : 93.3411737,
			latitude : 25.5351813
		}, {
			longitude : 93.3406158,
			latitude : 25.5351426
		}, {
			longitude : 93.3402295,
			latitude : 25.5348909
		}, {
			longitude : 93.3401222,
			latitude : 25.5346005
		}, {
			longitude : 93.3400579,
			latitude : 25.5343681
		}, {
			longitude : 93.3404227,
			latitude : 25.5341358
		}, {
			longitude : 93.3409291,
			latitude : 25.5339857
		}, {
			longitude : 93.3410363,
			latitude : 25.5338115
		}, {
			longitude : 93.3407445,
			latitude : 25.5334194
		}, {
			longitude : 93.3398433,
			latitude : 25.533129
		}, {
			longitude : 93.3393712,
			latitude : 25.5332839
		}, {
			longitude : 93.3380623,
			latitude : 25.5340583
		}, {
			longitude : 93.3366676,
			latitude : 25.5347554
		}, {
			longitude : 93.3360024,
			latitude : 25.5345424
		}, {
			longitude : 93.335659,
			latitude : 25.5346198
		}, {
			longitude : 93.3350368,
			latitude : 25.5349103
		}, {
			longitude : 93.3348437,
			latitude : 25.5353749
		}, {
			longitude : 93.3354874,
			latitude : 25.5358977
		}, {
			longitude : 93.3355947,
			latitude : 25.5363236
		}, {
			longitude : 93.3361097,
			latitude : 25.5370981
		}, {
			longitude : 93.3358951,
			latitude : 25.5376005
		}, {
			longitude : 93.3358307,
			latitude : 25.5379684
		}, {
			longitude : 93.3363886,
			latitude : 25.5383943
		}, {
			longitude : 93.336453,
			latitude : 25.5389752
		}, {
			longitude : 93.3361097,
			latitude : 25.5392075
		}, {
			longitude : 93.3354016,
			latitude : 25.5393043
		}, {
			longitude : 93.3346076,
			latitude : 25.5391688
		}, {
			longitude : 93.3341141,
			latitude : 25.539556
		}, {
			longitude : 93.3334704,
			latitude : 25.5405047
		}, {
			longitude : 93.3336764,
			latitude : 25.5416721
		}, {
			longitude : 93.3335777,
			latitude : 25.5425376
		}, {
			longitude : 93.3329554,
			latitude : 25.5426731
		}, {
			longitude : 93.3323117,
			latitude : 25.5425182
		}, {
			longitude : 93.3313461,
			latitude : 25.5420923
		}, {
			longitude : 93.3307023,
			latitude : 25.5419955
		}, {
			longitude : 93.3303375,
			latitude : 25.542402
		}, {
			longitude : 93.3304234,
			latitude : 25.5429441
		}, {
			longitude : 93.3307452,
			latitude : 25.5432926
		}, {
			longitude : 93.3305931,
			latitude : 25.5439736
		}, {
			longitude : 93.3302303,
			latitude : 25.544174
		}, {
			longitude : 93.329844,
			latitude : 25.5442611
		}, {
			longitude : 93.3295114,
			latitude : 25.544203
		}, {
			longitude : 93.3292539,
			latitude : 25.5442998
		}, {
			longitude : 93.3280115,
			latitude : 25.5445181
		}, {
			longitude : 93.3276231,
			latitude : 25.5446193
		}, {
			longitude : 93.326958,
			latitude : 25.5450743
		}, {
			longitude : 93.3267005,
			latitude : 25.5456938
		}, {
			longitude : 93.3268185,
			latitude : 25.5464488
		}, {
			longitude : 93.327194,
			latitude : 25.5471748
		}, {
			longitude : 93.3279128,
			latitude : 25.5482299
		}, {
			longitude : 93.3284171,
			latitude : 25.5485009
		}, {
			longitude : 93.3297367,
			latitude : 25.549043
		}, {
			longitude : 93.3304877,
			latitude : 25.5493431
		}, {
			longitude : 93.3308525,
			latitude : 25.5494302
		}, {
			longitude : 93.3310478,
			latitude : 25.5493484
		}, {
			longitude : 93.3315392,
			latitude : 25.5487913
		}, {
			longitude : 93.3319791,
			latitude : 25.5483848
		}, {
			longitude : 93.3323224,
			latitude : 25.5482493
		}, {
			longitude : 93.3327408,
			latitude : 25.5484622
		}, {
			longitude : 93.3333631,
			latitude : 25.549498
		}, {
			longitude : 93.3337386,
			latitude : 25.5506595
		}, {
			longitude : 93.3340175,
			latitude : 25.550795
		}, {
			longitude : 93.334436,
			latitude : 25.5507079
		}, {
			longitude : 93.3350475,
			latitude : 25.5506789
		}, {
			longitude : 93.335659,
			latitude : 25.5513468
		}, {
			longitude : 93.3361204,
			latitude : 25.5518307
		}, {
			longitude : 93.3373971,
			latitude : 25.5528084
		}, {
			longitude : 93.3373435,
			latitude : 25.5530213
		}, {
			longitude : 93.337204,
			latitude : 25.5533504
		}, {
			longitude : 93.3369572,
			latitude : 25.5535343
		}, {
			longitude : 93.3360024,
			latitude : 25.5536311
		}, {
			longitude : 93.3357985,
			latitude : 25.5537473
		}, {
			longitude : 93.3357127,
			latitude : 25.5538828
		}, {
			longitude : 93.3357508,
			latitude : 25.5541461
		}, {
			longitude : 93.3359595,
			latitude : 25.5543667
		}, {
			longitude : 93.3363672,
			latitude : 25.5547733
		}, {
			longitude : 93.3369787,
			latitude : 25.5558961
		}, {
			longitude : 93.3374937,
			latitude : 25.5567381
		}, {
			longitude : 93.3383949,
			latitude : 25.5573963
		}, {
			longitude : 93.3395343,
			latitude : 25.5583018
		}, {
			longitude : 93.3415277,
			latitude : 25.5594967
		}, {
			longitude : 93.3422573,
			latitude : 25.5596128
		}, {
			longitude : 93.3429547,
			latitude : 25.5602807
		}, {
			longitude : 93.3437379,
			latitude : 25.5603581
		}, {
			longitude : 93.3440833,
			latitude : 25.560015
		}, {
			longitude : 93.3441563,
			latitude : 25.559787
		}, {
			longitude : 93.3444352,
			latitude : 25.5594579
		}, {
			longitude : 93.3448107,
			latitude : 25.5592644
		}, {
			longitude : 93.3453472,
			latitude : 25.5592837
		}, {
			longitude : 93.3464844,
			latitude : 25.5596225
		}, {
			longitude : 93.3479865,
			latitude : 25.5599129
		}, {
			longitude : 93.34951,
			latitude : 25.5600871
		}, {
			longitude : 93.3511086,
			latitude : 25.5607162
		}, {
			longitude : 93.3518381,
			latitude : 25.5608706
		}, {
			longitude : 93.3521815,
			latitude : 25.5605996
		}, {
			longitude : 93.35216,
			latitude : 25.5599995
		}, {
			longitude : 93.3523746,
			latitude : 25.5597091
		}, {
			longitude : 93.3532114,
			latitude : 25.5595736
		}, {
			longitude : 93.3534475,
			latitude : 25.559651
		}, {
			longitude : 93.3537264,
			latitude : 25.5596898
		}, {
			longitude : 93.3542628,
			latitude : 25.5592058
		}, {
			longitude : 93.3543487,
			latitude : 25.5589154
		}, {
			longitude : 93.3542414,
			latitude : 25.5584509
		}, {
			longitude : 93.3540182,
			latitude : 25.5582244
		}, {
			longitude : 93.3537264,
			latitude : 25.5582186
		}, {
			longitude : 93.3531385,
			latitude : 25.5585535
		}, {
			longitude : 93.3526106,
			latitude : 25.5586638
		}, {
			longitude : 93.3522673,
			latitude : 25.558567
		}, {
			longitude : 93.3522887,
			latitude : 25.558296
		}, {
			longitude : 93.3523531,
			latitude : 25.5578895
		}, {
			longitude : 93.3523317,
			latitude : 25.5573474
		}, {
			longitude : 93.3524819,
			latitude : 25.5566893
		}, {
			longitude : 93.3526964,
			latitude : 25.5564376
		}, {
			longitude : 93.3530827,
			latitude : 25.5565925
		}, {
			longitude : 93.3533831,
			latitude : 25.5568829
		}, {
			longitude : 93.3539539,
			latitude : 25.5569854
		}, {
			longitude : 93.3542843,
			latitude : 25.5568248
		}, {
			longitude : 93.354456,
			latitude : 25.5563021
		}, {
			longitude : 93.3550139,
			latitude : 25.5558181
		}, {
			longitude : 93.3558293,
			latitude : 25.5557601
		}, {
			longitude : 93.3561511,
			latitude : 25.5557214
		}, {
			longitude : 93.3566876,
			latitude : 25.5556439
		}, {
			longitude : 93.3572669,
			latitude : 25.5557794
		}, {
			longitude : 93.3573742,
			latitude : 25.5555471
		}, {
			longitude : 93.357224,
			latitude : 25.5550632
		}, {
			longitude : 93.3573098,
			latitude : 25.5547534
		}, {
			longitude : 93.357739,
			latitude : 25.5545405
		}, {
			longitude : 93.358254,
			latitude : 25.5545986
		}, {
			longitude : 93.3585758,
			latitude : 25.5545405
		}, {
			longitude : 93.3588333,
			latitude : 25.5546566
		}, {
			longitude : 93.3589835,
			latitude : 25.5547921
		}, {
			longitude : 93.358975,
			latitude : 25.55534
		}, {
			longitude : 93.3588119,
			latitude : 25.5558181
		}, {
			longitude : 93.3584256,
			latitude : 25.556457
		}, {
			longitude : 93.3584256,
			latitude : 25.5567473
		}, {
			longitude : 93.3585115,
			latitude : 25.5573474
		}, {
			longitude : 93.3588333,
			latitude : 25.5577733
		}, {
			longitude : 93.3604427,
			latitude : 25.5578701
		}, {
			longitude : 93.3607645,
			latitude : 25.5579863
		}, {
			longitude : 93.3610649,
			latitude : 25.5585089
		}, {
			longitude : 93.3610864,
			latitude : 25.5595155
		}, {
			longitude : 93.3613128,
			latitude : 25.5599356
		}, {
			longitude : 93.362347,
			latitude : 25.5603063
		}, {
			longitude : 93.3640398,
			latitude : 25.5607034
		}, {
			longitude : 93.3658238,
			latitude : 25.5633795
		}, {
			longitude : 93.3653778,
			latitude : 25.5696236
		}, {
			longitude : 93.3845563,
			latitude : 25.5780978
		}, {
			longitude : 93.3823262,
			latitude : 25.584788
		}, {
			longitude : 93.3899084,
			latitude : 25.5946003
		}, {
			longitude : 93.4068569,
			latitude : 25.5963843
		}, {
			longitude : 93.4073029,
			latitude : 25.6066426
		}, {
			longitude : 93.4077489,
			latitude : 25.6093186
		}, {
			longitude : 93.412209,
			latitude : 25.6137787
		}, {
			longitude : 93.4148851,
			latitude : 25.6164548
		}, {
			longitude : 93.4273734,
			latitude : 25.6316192
		}, {
			longitude : 93.4416458,
			latitude : 25.6347413
		}, {
			longitude : 93.4443218,
			latitude : 25.6378634
		}, {
			longitude : 93.4572562,
			latitude : 25.6405394
		}, {
			longitude : 93.4621623,
			latitude : 25.6334032
		}, {
			longitude : 93.4835708,
			latitude : 25.6458916
		}, {
			longitude : 93.4835708,
			latitude : 25.6516897
		}, {
			longitude : 93.5000733,
			latitude : 25.6565958
		}, {
			longitude : 93.530402,
			latitude : 25.6927228
		}, {
			longitude : 93.5259419,
			latitude : 25.6998589
		}, {
			longitude : 93.5379842,
			latitude : 25.702981
		}, {
			longitude : 93.5433364,
			latitude : 25.701643
		}, {
			longitude : 93.5495805,
			latitude : 25.7190374
		}, {
			longitude : 93.5469045,
			latitude : 25.7346478
		}, {
			longitude : 93.5656369,
			latitude : 25.741338
		}, {
			longitude : 93.5842166,
			latitude : 25.7576895
		}, {
			longitude : 93.5840625,
			latitude : 25.762877
		}, {
			longitude : 93.5899453,
			latitude : 25.7674905
		}, {
			longitude : 93.5950389,
			latitude : 25.7642901
		}, {
			longitude : 93.6023211,
			latitude : 25.7719553
		}, {
			longitude : 93.6184849,
			latitude : 25.7785715
		}, {
			longitude : 93.6256222,
			latitude : 25.7948269
		}, {
			longitude : 93.634019,
			latitude : 25.8042767
		}, {
			longitude : 93.641996,
			latitude : 25.8129698
		}, {
			longitude : 93.6499729,
			latitude : 25.8201506
		}, {
			longitude : 93.6638277,
			latitude : 25.8209065
		}, {
			longitude : 93.6726443,
			latitude : 25.82752
		}, {
			longitude : 93.6754557,
			latitude : 25.8301769
		}, {
			longitude : 93.6958371,
			latitude : 25.8457692
		}, {
			longitude : 93.7035165,
			latitude : 25.8481492
		}, {
			longitude : 93.7042511,
			latitude : 25.8521797
		}, {
			longitude : 93.7013839,
			latitude : 25.8577454
		}, {
			longitude : 93.6971559,
			latitude : 25.8726062
		}, {
			longitude : 93.6959495,
			latitude : 25.8864757
		}, {
			longitude : 93.6964857,
			latitude : 25.9010671
		}, {
			longitude : 93.6970889,
			latitude : 25.9130042
		}, {
			longitude : 93.6997345,
			latitude : 25.9214956
		}, {
			longitude : 93.7016321,
			latitude : 25.9288762
		}, {
			longitude : 93.7090728,
			latitude : 25.9286631
		}, {
			longitude : 93.7149258,
			latitude : 25.9256369
		}, {
			longitude : 93.7268688,
			latitude : 25.926809
		}, {
			longitude : 93.7312764,
			latitude : 25.9327974
		}, {
			longitude : 93.7348186,
			latitude : 25.9365967
		}, {
			longitude : 93.744106,
			latitude : 25.9401352
		}, {
			longitude : 93.7501972,
			latitude : 25.9395244
		}, {
			longitude : 93.7523557,
			latitude : 25.9442225
		}, {
			longitude : 93.762444,
			latitude : 25.9527754
		}, {
			longitude : 93.7680646,
			latitude : 25.9597728
		}, {
			longitude : 93.7850746,
			latitude : 25.9580996
		}, {
			longitude : 93.7864126,
			latitude : 25.9540855
		}, {
			longitude : 93.7864126,
			latitude : 25.9473953
		}, {
			longitude : 93.7895347,
			latitude : 25.9460573
		}, {
			longitude : 93.7767841,
			latitude : 25.9730813
		}, {
			longitude : 93.7980089,
			latitude : 25.9063622
		}, {
			longitude : 93.7873046,
			latitude : 25.8787095
		}, {
			longitude : 93.7917647,
			latitude : 25.8697893
		}, {
			longitude : 93.7815065,
			latitude : 25.859085
		}, {
			longitude : 93.7808967,
			latitude : 25.8546646
		}, {
			longitude : 93.7797224,
			latitude : 25.8461507
		}, {
			longitude : 93.7957788,
			latitude : 25.8144839
		}, {
			longitude : 93.8189714,
			latitude : 25.8260802
		}, {
			longitude : 93.8243236,
			latitude : 25.8470427
		}, {
			longitude : 93.842164,
			latitude : 25.8626531
		}, {
			longitude : 93.8827511,
			latitude : 25.8457047
		}, {
			longitude : 93.9157559,
			latitude : 25.8876298
		}, {
			longitude : 93.959911,
			latitude : 25.9054702
		}, {
			longitude : 93.9826576,
			latitude : 25.9264328
		}, {
			longitude : 93.9710613,
			latitude : 25.9447192
		}, {
			longitude : 93.9692773,
			latitude : 25.9607756
		}, {
			longitude : 93.9558969,
			latitude : 25.974156
		}, {
			longitude : 93.9608031,
			latitude : 25.9969026
		}, {
			longitude : 93.9550049,
			latitude : 26.0071608
		}, {
			longitude : 93.9657092,
			latitude : 26.0423957
		}, {
			longitude : 93.9911318,
			latitude : 26.0727245
		}, {
			longitude : 93.9862257,
			latitude : 26.0883349
		}, {
			longitude : 94.0022821,
			latitude : 26.1115275
		}, {
			longitude : 93.9911318,
			latitude : 26.1182177
		}, {
			longitude : 93.998268,
			latitude : 26.131152
		}, {
			longitude : 93.9906858,
			latitude : 26.1338281
		}, {
			longitude : 94.0054042,
			latitude : 26.1418563
		}, {
			longitude : 93.9996061,
			latitude : 26.1583587
		}, {
			longitude : 94.0049582,
			latitude : 26.1730771
		}, {
			longitude : 94.035733,
			latitude : 26.2034059
		}, {
			longitude : 94.037963,
			latitude : 26.2297205
		}, {
			longitude : 94.0491133,
			latitude : 26.2502371
		}, {
			longitude : 94.0647237,
			latitude : 26.2618333
		}, {
			longitude : 94.0705219,
			latitude : 26.2600493
		}, {
			longitude : 94.076766,
			latitude : 26.2850259
		}, {
			longitude : 94.1026347,
			latitude : 26.3086645
		}, {
			longitude : 94.1079868,
			latitude : 26.326505
		}, {
			longitude : 94.1195831,
			latitude : 26.3336412
		}, {
			longitude : 94.1285034,
			latitude : 26.3233829
		}, {
			longitude : 94.1467898,
			latitude : 26.3354252
		}, {
			longitude : 94.1427757,
			latitude : 26.3421154
		}, {
			longitude : 94.1646303,
			latitude : 26.3394393
		}, {
			longitude : 94.1753346,
			latitude : 26.3443455
		}, {
			longitude : 94.1797947,
			latitude : 26.3541577
		}, {
			longitude : 94.1677524,
			latitude : 26.3532657
		}, {
			longitude : 94.1646303,
			latitude : 26.3599559
		}, {
			longitude : 94.1735505,
			latitude : 26.3675381
		}, {
			longitude : 94.1789027,
			latitude : 26.3885006
		}, {
			longitude : 94.1757806,
			latitude : 26.4317637
		}, {
			longitude : 94.1864849,
			latitude : 26.4603084
		}, {
			longitude : 94.2400062,
			latitude : 26.5115997
		}, {
			longitude : 94.2850534,
			latitude : 26.5401445
		}, {
			longitude : 94.2823773,
			latitude : 26.5633371
		}, {
			longitude : 94.2899595,
			latitude : 26.5642291
		}, {
			longitude : 94.3510631,
			latitude : 26.5084777
		}, {
			longitude : 94.3555232,
			latitude : 26.5035715
		}, {
			longitude : 94.3519551,
			latitude : 26.4955433
		}, {
			longitude : 94.3778238,
			latitude : 26.5129378
		}, {
			longitude : 94.3782698,
			latitude : 26.5254261
		}, {
			longitude : 94.3800578,
			latitude : 26.5259967
		}, {
			longitude : 94.3992323,
			latitude : 26.5321163
		}, {
			longitude : 94.4081525,
			latitude : 26.5495107
		}, {
			longitude : 94.4045844,
			latitude : 26.5553089
		}, {
			longitude : 94.4077065,
			latitude : 26.561553
		}, {
			longitude : 94.4121666,
			latitude : 26.5584309
		}, {
			longitude : 94.4148427,
			latitude : 26.5834076
		}, {
			longitude : 94.4059225,
			latitude : 26.6021401
		}, {
			longitude : 94.4099366,
			latitude : 26.6164124
		}, {
			longitude : 94.4545377,
			latitude : 26.639159
		}, {
			longitude : 94.4625659,
			latitude : 26.6355909
		}, {
			longitude : 94.4585518,
			latitude : 26.6552154
		}, {
			longitude : 94.46435,
			latitude : 26.6677037
		}, {
			longitude : 94.4982468,
			latitude : 26.6735019
		}, {
			longitude : 94.5156413,
			latitude : 26.6873283
		}, {
			longitude : 94.5276836,
			latitude : 26.7011546
		}, {
			longitude : 94.5227775,
			latitude : 26.7042767
		}, {
			longitude : 94.545078,
			latitude : 26.7109669
		}, {
			longitude : 94.5611345,
			latitude : 26.7082908
		}, {
			longitude : 94.5713927,
			latitude : 26.6962485
		}, {
			longitude : 94.5745148,
			latitude : 26.6908963
		}, {
			longitude : 94.5629185,
			latitude : 26.6904503
		}, {
			longitude : 94.582989,
			latitude : 26.7056147
		}, {
			longitude : 94.5923553,
			latitude : 26.7029387
		}, {
			longitude : 94.5963694,
			latitude : 26.718103
		}, {
			longitude : 94.6048436,
			latitude : 26.717211
		}, {
			longitude : 94.5950313,
			latitude : 26.7296993
		}, {
			longitude : 94.6101957,
			latitude : 26.7399576
		}, {
			longitude : 94.622684,
			latitude : 26.7194411
		}, {
			longitude : 94.6583649,
			latitude : 26.7247932
		}, {
			longitude : 94.6864637,
			latitude : 26.7323754
		}, {
			longitude : 94.737755,
			latitude : 26.7689483
		}, {
			longitude : 94.7457832,
			latitude : 26.7823287
		}, {
			longitude : 94.7564875,
			latitude : 26.7720704
		}, {
			longitude : 94.7729899,
			latitude : 26.794817
		}, {
			longitude : 94.7908303,
			latitude : 26.8015072
		}, {
			longitude : 94.8055487,
			latitude : 26.8122115
		}, {
			longitude : 94.7966285,
			latitude : 26.8184556
		}, {
			longitude : 94.8131309,
			latitude : 26.8246998
		}, {
			longitude : 94.8211591,
			latitude : 26.8545825
		}, {
			longitude : 94.8514879,
			latitude : 26.8813432
		}, {
			longitude : 94.8862768,
			latitude : 26.9326345
		}, {
			longitude : 94.9282019,
			latitude : 26.952259
		}, {
			longitude : 94.933554,
			latitude : 26.9384327
		}, {
			longitude : 94.9571926,
			latitude : 26.9433388
		}, {
			longitude : 94.9857373,
			latitude : 26.9183622
		}, {
			longitude : 94.9919815,
			latitude : 26.9183622
		}, {
			longitude : 94.9928735,
			latitude : 26.9259444
		}, {
			longitude : 95.0214182,
			latitude : 26.9254984
		}, {
			longitude : 95.0379207,
			latitude : 26.9384327
		}, {
			longitude : 95.0869819,
			latitude : 26.9527051
		}, {
			longitude : 95.1101745,
			latitude : 26.9669774
		}, {
			longitude : 95.1168647,
			latitude : 26.9834798
		}, {
			longitude : 95.1494235,
			latitude : 26.9999823
		}, {
			longitude : 95.1953627,
			latitude : 27.0427994
		}, {
			longitude : 95.2136492,
			latitude : 27.0334331
		}, {
			longitude : 95.2310436,
			latitude : 27.0459214
		}, {
			longitude : 95.2484381,
			latitude : 27.030311
		}, {
			longitude : 95.2774288,
			latitude : 27.0499355
		}, {
			longitude : 95.2778748,
			latitude : 27.0566257
		}, {
			longitude : 95.3131097,
			latitude : 27.0869545
		}, {
			longitude : 95.3696596,
			latitude : 27.1055609
		}, {
			longitude : 95.3723357,
			latitude : 27.1095751
		}, {
			longitude : 95.3781339,
			latitude : 27.1002087
		}, {
			longitude : 95.421397,
			latitude : 27.1287539
		}, {
			longitude : 95.4521718,
			latitude : 27.1367823
		}, {
			longitude : 95.4588619,
			latitude : 27.1336601
		}, {
			longitude : 95.4668901,
			latitude : 27.1528389
		}, {
			longitude : 95.4597539,
			latitude : 27.1613133
		}, {
			longitude : 95.4691202,
			latitude : 27.1702337
		}, {
			longitude : 95.4651061,
			latitude : 27.1800461
		}, {
			longitude : 95.4700122,
			latitude : 27.1885204
		}, {
			longitude : 95.461092,
			latitude : 27.2117134
		}, {
			longitude : 95.4704582,
			latitude : 27.2161737
		}, {
			longitude : 95.4923128,
			latitude : 27.2469489
		}, {
			longitude : 95.5062327,
			latitude : 27.2546548
		}, {
			longitude : 95.5106928,
			latitude : 27.2662511
		}, {
			longitude : 95.520505,
			latitude : 27.263575
		}, {
			longitude : 95.5347774,
			latitude : 27.2707112
		}, {
			longitude : 95.5561859,
			latitude : 27.2542088
		}, {
			longitude : 95.5744724,
			latitude : 27.2510867
		}, {
			longitude : 95.5900828,
			latitude : 27.2296781
		}, {
			longitude : 95.636914,
			latitude : 27.2368143
		}, {
			longitude : 95.6846372,
			latitude : 27.2573309
		}, {
			longitude : 95.7212102,
			latitude : 27.2577769
		}, {
			longitude : 95.7399427,
			latitude : 27.2698192
		}, {
			longitude : 95.7845438,
			latitude : 27.2791854
		}, {
			longitude : 95.8104125,
			latitude : 27.2809695
		}, {
			longitude : 95.8063984,
			latitude : 27.2916737
		}, {
			longitude : 95.8603657,
			latitude : 27.2943498
		}, {
			longitude : 95.8608118,
			latitude : 27.2796314
		}, {
			longitude : 95.8724081,
			latitude : 27.2666971
		}, {
			longitude : 95.8982767,
			latitude : 27.264467
		}, {
			longitude : 95.9063049,
			latitude : 27.2916737
		}, {
			longitude : 95.9633944,
			latitude : 27.3170964
		}, {
			longitude : 95.9687465,
			latitude : 27.3318148
		}, {
			longitude : 95.9700846,
			latitude : 27.3371669
		}, {
			longitude : 95.9843569,
			latitude : 27.3344908
		}, {
			longitude : 95.9937232,
			latitude : 27.3514393
		}, {
			longitude : 95.9968452,
			latitude : 27.3634816
		}, {
			longitude : 96.0182538,
			latitude : 27.3679417
		}, {
			longitude : 95.9910471,
			latitude : 27.419233
		}, {
			longitude : 95.9794508,
			latitude : 27.4219091
		}, {
			longitude : 95.9678545,
			latitude : 27.4241391
		}, {
			longitude : 95.9611643,
			latitude : 27.4285992
		}, {
			longitude : 95.9531361,
			latitude : 27.4330594
		}, {
			longitude : 95.950014,
			latitude : 27.4451017
		}, {
			longitude : 95.9669625,
			latitude : 27.4366275
		}, {
			longitude : 95.9732066,
			latitude : 27.4366275
		}, {
			longitude : 95.9776668,
			latitude : 27.4352894
		}, {
			longitude : 95.9170092,
			latitude : 27.4433176
		}, {
			longitude : 95.8884645,
			latitude : 27.4442096
		}, {
			longitude : 95.8639338,
			latitude : 27.4522379
		}, {
			longitude : 95.8527836,
			latitude : 27.4446557
		}, {
			longitude : 95.8492155,
			latitude : 27.4303833
		}, {
			longitude : 95.8648259,
			latitude : 27.4290453
		}, {
			longitude : 95.8675019,
			latitude : 27.4170029
		}, {
			longitude : 95.8929246,
			latitude : 27.4058527
		}, {
			longitude : 95.8764222,
			latitude : 27.4709703
		}, {
			longitude : 95.8612578,
			latitude : 27.4665102
		}, {
			longitude : 95.8790982,
			latitude : 27.4990691
		}, {
			longitude : 95.8898025,
			latitude : 27.5062052
		}, {
			longitude : 95.8786522,
			latitude : 27.5200316
		}, {
			longitude : 95.8813283,
			latitude : 27.5530364
		}, {
			longitude : 95.8621498,
			latitude : 27.5525904
		}, {
			longitude : 95.8518915,
			latitude : 27.5655248
		}, {
			longitude : 95.8398492,
			latitude : 27.5664168
		}, {
			longitude : 95.831821,
			latitude : 27.5789051
		}, {
			longitude : 95.8211167,
			latitude : 27.5815812
		}, {
			longitude : 95.8242388,
			latitude : 27.6029897
		}, {
			longitude : 95.7979241,
			latitude : 27.6078958
		}, {
			longitude : 95.7943561,
			latitude : 27.6221682
		}, {
			longitude : 95.7872199,
			latitude : 27.6235062
		}, {
			longitude : 95.7872199,
			latitude : 27.6324265
		}, {
			longitude : 95.7974781,
			latitude : 27.6359946
		}, {
			longitude : 95.7985282,
			latitude : 27.639375
		}, {
			longitude : 95.8014922,
			latitude : 27.6489289
		}, {
			longitude : 95.7791917,
			latitude : 27.6605252
		}, {
			longitude : 95.7782996,
			latitude : 27.6725675
		}, {
			longitude : 95.7965861,
			latitude : 27.6881779
		}, {
			longitude : 95.7747316,
			latitude : 27.6966521
		}, {
			longitude : 95.7702714,
			latitude : 27.7198447
		}, {
			longitude : 95.7582291,
			latitude : 27.730995
		}, {
			longitude : 95.7876659,
			latitude : 27.7421453
		}, {
			longitude : 95.7805297,
			latitude : 27.7582017
		}, {
			longitude : 95.8233468,
			latitude : 27.809047
		}, {
			longitude : 95.8518915,
			latitude : 27.8340236
		}, {
			longitude : 95.8764222,
			latitude : 27.8416058
		}, {
			longitude : 95.8951546,
			latitude : 27.8670285
		}, {
			longitude : 95.9071969,
			latitude : 27.8688125
		}, {
			longitude : 95.9138871,
			latitude : 27.8746107
		}, {
			longitude : 95.9063049,
			latitude : 27.8772867
		}, {
			longitude : 95.9214693,
			latitude : 27.8906671
		}, {
			longitude : 95.9272675,
			latitude : 27.887099
		}, {
			longitude : 95.9250374,
			latitude : 27.9009253
		}, {
			longitude : 95.9384177,
			latitude : 27.9031554
		}, {
			longitude : 95.9553662,
			latitude : 27.926794
		}, {
			longitude : 95.9575962,
			latitude : 27.9370523
		}, {
			longitude : 95.9522441,
			latitude : 27.9419584
		}, {
			longitude : 95.9776668,
			latitude : 27.9687191
		}, {
			longitude : 95.8260229,
			latitude : 27.9771933
		}, {
			longitude : 95.6065852,
			latitude : 27.9575688
		}, {
			longitude : 95.5887448,
			latitude : 27.9415124
		}, {
			longitude : 95.5713503,
			latitude : 27.9424044
		}, {
			longitude : 95.5651062,
			latitude : 27.9223339
		}, {
			longitude : 95.5436976,
			latitude : 27.9134137
		}, {
			longitude : 95.5436976,
			latitude : 27.9022634
		}, {
			longitude : 95.5263032,
			latitude : 27.8978033
		}, {
			longitude : 95.5160449,
			latitude : 27.8817469
		}, {
			longitude : 95.3844715,
			latitude : 27.8420518
		}, {
			longitude : 95.3166778,
			latitude : 27.8710426
		}, {
			longitude : 95.2990594,
			latitude : 27.8656932
		}, {
			longitude : 95.2340683,
			latitude : 27.8457299
		}, {
			longitude : 95.2213983,
			latitude : 27.8419024
		}, {
			longitude : 95.2210451,
			latitude : 27.8419012
		}, {
			longitude : 95.2040122,
			latitude : 27.8365808
		}, {
			longitude : 95.1971924,
			latitude : 27.8345095
		}, {
			longitude : 95.1769639,
			latitude : 27.8282669
		}, {
			longitude : 95.1654508,
			latitude : 27.8245812
		}, {
			longitude : 95.1466523,
			latitude : 27.818421
		}, {
			longitude : 95.1352852,
			latitude : 27.8136697
		}, {
			longitude : 95.051747,
			latitude : 27.7903145
		}, {
			longitude : 95.0312305,
			latitude : 27.7747041
		}, {
			longitude : 94.9977796,
			latitude : 27.7764882
		}, {
			longitude : 94.8662063,
			latitude : 27.7363471
		}, {
			longitude : 94.8608541,
			latitude : 27.7394692
		}, {
			longitude : 94.8537179,
			latitude : 27.731441
		}, {
			longitude : 94.8488118,
			latitude : 27.7104785
		}, {
			longitude : 94.818037,
			latitude : 27.6966521
		}, {
			longitude : 94.8001966,
			latitude : 27.6970981
		}, {
			longitude : 94.7720979,
			latitude : 27.6841638
		}, {
			longitude : 94.7560414,
			latitude : 27.6663233
		}, {
			longitude : 94.7426611,
			latitude : 27.6632013
		}, {
			longitude : 94.7208065,
			latitude : 27.6698914
		}, {
			longitude : 94.7160347,
			latitude : 27.6588958
		}, {
			longitude : 94.7084111,
			latitude : 27.6565641
		}, {
			longitude : 94.7075999,
			latitude : 27.653586
		}, {
			longitude : 94.6924702,
			latitude : 27.650157
		}, {
			longitude : 94.6824496,
			latitude : 27.6493749
		}, {
			longitude : 94.6690692,
			latitude : 27.6502669
		}, {
			longitude : 94.6454306,
			latitude : 27.6364406
		}, {
			longitude : 94.6396325,
			latitude : 27.6310884
		}, {
			longitude : 94.6039515,
			latitude : 27.6230602
		}, {
			longitude : 94.6008295,
			latitude : 27.6217222
		}, {
			longitude : 94.5861111,
			latitude : 27.6199381
		}, {
			longitude : 94.5736228,
			latitude : 27.6070038
		}, {
			longitude : 94.5263456,
			latitude : 27.5958535
		}, {
			longitude : 94.5000309,
			latitude : 27.5771211
		}, {
			longitude : 94.4790683,
			latitude : 27.5771211
		}, {
			longitude : 94.4598899,
			latitude : 27.5574965
		}, {
			longitude : 94.4424954,
			latitude : 27.5793511
		}, {
			longitude : 94.4362513,
			latitude : 27.5842572
		}, {
			longitude : 94.4308991,
			latitude : 27.6029897
		}, {
			longitude : 94.4032464,
			latitude : 27.5873793
		}, {
			longitude : 94.3760397,
			latitude : 27.5847032
		}, {
			longitude : 94.3724716,
			latitude : 27.5793511
		}, {
			longitude : 94.3555232,
			latitude : 27.5775671
		}, {
			longitude : 94.3452649,
			latitude : 27.5847032
		}, {
			longitude : 94.3381287,
			latitude : 27.5811352
		}, {
			longitude : 94.3292085,
			latitude : 27.5882713
		}, {
			longitude : 94.3122601,
			latitude : 27.5896094
		}, {
			longitude : 94.2979877,
			latitude : 27.6043277
		}, {
			longitude : 94.2877294,
			latitude : 27.5918394
		}, {
			longitude : 94.2761331,
			latitude : 27.5931775
		}, {
			longitude : 94.2725651,
			latitude : 27.6034357
		}, {
			longitude : 94.2542786,
			latitude : 27.613694
		}, {
			longitude : 94.2667669,
			latitude : 27.6324265
		}, {
			longitude : 94.2520485,
			latitude : 27.6409007
		}, {
			longitude : 94.2351001,
			latitude : 27.6324265
		}, {
			longitude : 94.2172596,
			latitude : 27.6087879
		}, {
			longitude : 94.2110155,
			latitude : 27.6110179
		}, {
			longitude : 94.2248418,
			latitude : 27.5985296
		}, {
			longitude : 94.2212737,
			latitude : 27.5878253
		}, {
			longitude : 94.2266259,
			latitude : 27.575783
		}, {
			longitude : 94.2338867,
			latitude : 27.5713401
		}, {
			longitude : 94.2565086,
			latitude : 27.5574965
		}, {
			longitude : 94.2596307,
			latitude : 27.5235997
		}, {
			longitude : 94.2123535,
			latitude : 27.497731
		}, {
			longitude : 94.191391,
			latitude : 27.496393
		}, {
			longitude : 94.1570481,
			latitude : 27.4781065
		}, {
			longitude : 94.1601702,
			latitude : 27.4665102
		}, {
			longitude : 94.1409917,
			latitude : 27.4486698
		}, {
			longitude : 94.1169071,
			latitude : 27.4308293
		}, {
			longitude : 94.1066488,
			latitude : 27.417895
		}, {
			longitude : 94.0861323,
			latitude : 27.4045146
		}, {
			longitude : 94.0607096,
			latitude : 27.3634816
		}, {
			longitude : 94.0000521,
			latitude : 27.3344908
		}, {
			longitude : 93.9010375,
			latitude : 27.2417205
		}, {
			longitude : 93.8675867,
			latitude : 27.1989034
		}, {
			longitude : 93.8073751,
			latitude : 27.1502881
		}, {
			longitude : 93.8055911,
			latitude : 27.1377998
		}, {
			longitude : 93.7980089,
			latitude : 27.1360157
		}, {
			longitude : 93.8136193,
			latitude : 27.1320016
		}, {
			longitude : 93.8131733,
			latitude : 27.1239734
		}, {
			longitude : 93.8256616,
			latitude : 27.1195133
		}, {
			longitude : 93.8350278,
			latitude : 27.0749122
		}, {
			longitude : 93.8189714,
			latitude : 27.0650999
		}, {
			longitude : 93.8127273,
			latitude : 27.0708981
		}, {
			longitude : 93.8046991,
			latitude : 27.0615318
		}, {
			longitude : 93.7971169,
			latitude : 27.0708981
		}, {
			longitude : 93.7832905,
			latitude : 27.06733
		}, {
			longitude : 93.7725862,
			latitude : 27.0624239
		}, {
			longitude : 93.7779384,
			latitude : 27.0526116
		}, {
			longitude : 93.7913187,
			latitude : 27.0543957
		}, {
			longitude : 93.7685721,
			latitude : 27.0432454
		}, {
			longitude : 93.7190649,
			latitude : 27.0191608
		}, {
			longitude : 93.7056845,
			latitude : 27.0084565
		}, {
			longitude : 93.6981023,
			latitude : 26.9946301
		}, {
			longitude : 93.6758018,
			latitude : 26.9709915
		}, {
			longitude : 93.489369,
			latitude : 26.9384327
		}, {
			longitude : 93.4866929,
			latitude : 26.9428928
		}, {
			longitude : 93.4679604,
			latitude : 26.9388787
		}, {
			longitude : 93.4478899,
			latitude : 26.9540431
		}, {
			longitude : 93.3908005,
			latitude : 26.9598412
		}, {
			longitude : 93.3479834,
			latitude : 26.9634093
		}, {
			longitude : 93.2668093,
			latitude : 26.9558271
		}, {
			longitude : 93.1089212,
			latitude : 26.9272824
		}, {
			longitude : 93.0919728,
			latitude : 26.9156861
		}, {
			longitude : 93.0687802,
			latitude : 26.9241603
		}, {
			longitude : 93.0192729,
			latitude : 26.9170241
		}, {
			longitude : 92.9175823,
			latitude : 26.9643013
		}, {
			longitude : 92.9166903,
			latitude : 26.9848179
		}, {
			longitude : 92.8725352,
			latitude : 27.0075645
		}, {
			longitude : 92.7690605,
			latitude : 27.0329871
		}, {
			longitude : 92.7021588,
			latitude : 27.027635
		}, {
			longitude : 92.6588957,
			latitude : 27.0383392
		}, {
			longitude : 92.6392712,
			latitude : 27.0187147
		}, {
			longitude : 92.6455154,
			latitude : 26.9874939
		}, {
			longitude : 92.5853038,
			latitude : 26.9620713
		}, {
			longitude : 92.4595286,
			latitude : 26.9634093
		}, {
			longitude : 92.4461483,
			latitude : 26.9607333
		}, {
			longitude : 92.4256317,
			latitude : 26.9433388
		}, {
			longitude : 92.4118054,
			latitude : 26.9442308
		}, {
			longitude : 92.3997631,
			latitude : 26.9263904
		}, {
			longitude : 92.3645282,
			latitude : 26.9326345
		}, {
			longitude : 92.3529319,
			latitude : 26.9357566
		}, {
			longitude : 92.3029786,
			latitude : 26.9241603
		}, {
			longitude : 92.3038706,
			latitude : 26.9094419
		} ],
		stroke : {
			color : '#f75b46',
			weight : 2,
		},
		editable : true,
		draggable : false,
		geodesic : false,
		visible : true,
		fill : {
			color : 'rgb(242,230,223)',
			opacity : 0.7
		}
	} ];
	$scope.map.markers = [];
	$scope.treeData = [];

	$scope.selectParentSector = function(parentSector) {
		$scope.selectedPushpin = "";
		$scope.lastVisiDataId = 0;
		$scope.isShowChart = true;
		$scope.isShowTable = false;
		$scope.isPushpinClicked = false;
		$scope.selectedParentSector = parentSector;
		// $scope.noOfFacilitiesPlanned = $scope.selectedParentSector.formId ==
		// 43 ? 165
		// : $scope.selectedParentSector.formId == 44 ? 26 : 492;
		$scope.selectedDistrict.areaId = 0;
		$scope.getSectors(parentSector.formXpathScoreId);
		$scope.getSpiderData($scope.selectedParentSector.formId, 0,
				$scope.selectedDistrict.areaId);
		/*
		 * $scope.getPlannedFacilities($scope.selectedParentSector.formId,
		 * $scope.selectedTimePeriod.timePeriod_Nid,
		 * $scope.selectedDistrict.areaId);
		 */

	};
	$scope.selectSector = function(sector) {
		$scope.selectedSector = sector;
		if ($scope.allDistricts.length && !$scope.pushpinDataCallDone) {
			$scope.map.markers = [];
			$scope.getPushpinData($scope.selectedParentSector.formId,
					$scope.selectedSector.formXpathScoreId,
					$scope.selectedDistrict.areaId);
			$scope.pushpinDataCallDone = true;
		}

	};

	$scope.selectDistrict = function(District) {
		$scope.selectedPushpin = "";
		$scope.lastVisiDataId = 0;
		$scope.selectedDistrict = District;
		if ($scope.sectors.length && !$scope.pushpinDataCallDone) {
			$scope.map.markers = [];
			$scope.getPushpinData($scope.selectedParentSector.formId,
					$scope.selectedSector.formXpathScoreId,
					$scope.selectedDistrict.areaId);
			$scope.pushpinDataCallDone = true;
			$scope.getSpiderData($scope.selectedParentSector.formId, 0,
					$scope.selectedDistrict.areaId);
		}

//		$scope.getPlannedFacilities($scope.selectedParentSector.formId,
//				$scope.selectedTimePeriod.timePeriod_Nid,
//				$scope.selectedDistrict.areaId);
	};
	$scope.selectTimePeriod = function(timeperiod) {
		$scope.selectedPushpin = "";
		$scope.lastVisiDataId = 0;
		$scope.selectedTimePeriod = timeperiod;
		if ($scope.sectors.length && !$scope.pushpinDataCallDone) {
			$scope.map.markers = [];
			$scope.getPushpinData($scope.selectedParentSector.formId,
					$scope.selectedSector.formXpathScoreId,
					$scope.selectedDistrict.areaId);
			$scope.pushpinDataCallDone = true;
			$scope.getSpiderData($scope.selectedParentSector.formId, 0,
					$scope.selectedDistrict.areaId);
			
		}


//		$scope.getPlannedFacilities($scope.selectedParentSector.formId,
//				$scope.selectedTimePeriod.timePeriod_Nid,
//				$scope.selectedDistrict.areaId);
	}
	$scope.resetPushpinDataCallDone = function() {
		$scope.pushpinDataCallDone = false;
	}
	/*
	 * $scope.getTreeData = function() { $http.get('getAllData?formId=' +
	 * $scope.selectedSector).success( function(data) { $scope.treeData =
	 * convert(data).children[0];
	 * 
	 * $('html, body').animate({ scrollTop : $('#treeChartDiv').offset().top },
	 * 1000);
	 * 
	 * }); };
	 */

	$scope.getPushpinData = function(selectedParentSectorFormId,
			selectedSectorFormXpathScoreId, areaId) {
		$scope.map.markers = [];
		$scope.mapLoading = false;
		$(".loader").show();
		$http
				.get(
						'googleMapData?formId=' + selectedParentSectorFormId
								+ '&sector=' + selectedSectorFormXpathScoreId
								+ '&areaId=' + areaId + '&timePeriodId='
								+ $scope.selectedTimePeriod.timePeriod_Nid)
				.success(
						function(data) {
							$scope.mapLoading = true;
							$(".loader").fadeOut();
							checkSessionOut(data);
							$scope.noOfFacilities = data.length;
							$scope.tempNoOfFacilities = JSON.parse(JSON
									.stringify($scope.noOfFacilities));

							$scope.map.markers = data;
							$scope.greenMarkers = 0;
							$scope.redMarkers = 0;
							$scope.orangeMarkers = 0;
							$scope.noOfFacilitiesSuccessful = true;
							if ($scope.map.markers.length == 0) {
								$("#noDataModall").modal("show");
							}

//							if ($scope.noOfFacilitiesPlannedSuccessful
//									&& $scope.noOfFacilitiesSuccessful) {
//								$scope.progressBarUpdate();
//								$scope.noOfFacilitiesPlannedSuccessful = false;
//								$scope.noOfFacilitiesSuccessful = false;
//							}
							
							$scope.getPlannedFacilities($scope.selectedParentSector.formId,
									$scope.selectedTimePeriod.timePeriod_Nid,
									$scope.selectedDistrict.areaId);
							
							for (var i = 0; i < $scope.map.markers.length; i++) {
								if (parseFloat($scope.map.markers[i].dataValue) >= 80)
									$scope.greenMarkers++;
								else if (parseFloat($scope.map.markers[i].dataValue) <= 60)
									$scope.redMarkers++;
								else
									$scope.orangeMarkers++;
							}
							if (!$scope.$$phase)
								$scope.$apply();
						});
	};
	$scope.getSpiderData = function(selectedParentSectorFormId,
			lastVisitDataId, districtId) {
		allServices.getSpiderData(selectedParentSectorFormId, lastVisitDataId,
				districtId).then(function(data) {
			$scope.spiderdata = data;
			$scope.tableData = data.tableData
			$scope.columns = [];
			$scope.columns = Object.keys($scope.tableData[0]);
			// //console.log($scope.spiderdata);
			if ($scope.mapLoading)
				$(".loader").fadeOut();
		});
	};
	$scope.getPlannedFacilities = function(selectedParentSectorFormId,
			timePeriodId, districtId) {
		allServices
				.getPlannedFacilities(selectedParentSectorFormId, timePeriodId,
						districtId)
				.then(
						function(data) {
							$scope.facilityMap = data;
							$scope.noOfFacilitiesPlannedSuccessful = true;
							$scope.noOfFacilitiesPlanned = $scope.facilityMap.facilityPlanned;

							$scope.tempNoOfFacilitiesPlanned = JSON.parse(JSON
									.stringify($scope.noOfFacilitiesPlanned));
//							if ($scope.noOfFacilitiesSuccessful
//									&& $scope.noOfFacilitiesPlannedSuccessful) {
								$scope.progressBarUpdate();
//								$scope.noOfFacilitiesPlannedSuccessful = false;
//								$scope.noOfFacilitiesSuccessful = false;
//							}

							// console.log(data);

						});
	};

	$scope.getAllDistricts = function() {
		allServices.getDashboardDistricts().then(function(data) {
			$scope.allDistricts = data;
			$scope.selectDistrict($scope.allDistricts[0]);
			$scope.getAllDistrictsSuccessful = true;
			$scope.checkBasicDataSuccessful();
		});
	};
	$scope.getSectors = function(parentId) {
		allServices.getSectors(parentId).then(function(data) {
			$scope.sectors = data;
			$scope.selectSector($scope.sectors[0]);
			$scope.getAllDistricts();
		});
	};
	$scope.getParentSectors = function() {
		allServices.getParentSectors().then(function(data) {
			$scope.parentSectors = data;
			$scope.selectedParentSector = $scope.parentSectors[1];
			$scope.getSpiderData($scope.selectedParentSector.formId, 0, 0);
			$scope.getSectors($scope.selectedParentSector.formXpathScoreId);
			$scope.getParentSectorSuccessful = true;
			$scope.checkBasicDataSuccessful();
		});
	};
	$scope.getParentSectors();
	$scope.getAllTimePeriods = function() {
		allServices.getAllTimeperiod().then(function(data) {
			$scope.allTimePeriods = data;
			// //console.log($scope.allTimePeriods);
			$scope.selectTimePeriod($scope.allTimePeriods[0]);
			$scope.getAllTimePeriodsSuccessful = true;
			$scope.checkBasicDataSuccessful();
		});
	};
	$scope.getAllTimePeriods();
	$scope.checkBasicDataSuccessful = function() {
		if ($scope.getAllTimePeriodsSuccessful
				&& $scope.getParentSectorSuccessful
				&& $scope.getAllDistrictsSuccessful) {
//			$scope.getPlannedFacilities($scope.selectedParentSector.formId,
//					$scope.selectedTimePeriod.timePeriod_Nid,
//					$scope.selectedDistrict.areaId);
			$scope.getAllTimePeriodsSuccessful = false;
			$scope.getParentSectorSuccessful = false;
			$scope.getAllDistrictsSuccessful = false;
		}
	};

	// /SPECIALIZED FOR VIEW OF PUSHPIN UNIT DATA and AGGREGATE DATA

	var data = [];
	$scope.columns = [];
	$scope.tableParams = new ngTableParams({
		page : 1, // show first page
		count : 10, // count per page
	}, {
		total : data.length ? 0 : data.length, // length of data
		getData : function($defer, params) {
			if (data.length > 0) {
				total = data.length;
				// use build-in angular filter
				// var orderedData = params.sorting() ? $filter('orderBy')(data,
				// params.orderBy()) : data;

				$defer.resolve(data);
			}
		}
	});

	$scope.geoCallback = function() {
		$(".loader").fadeOut();
	}

	$scope.getTableDataValues = function() {
		var columns = [];
		var tabluarData = [];
		for (var x = 0; x < $scope.tableDataValues.length; x++) {
			var areaRecord = $scope.tableDataValues[x];
			var item = {};
			for (var y = 0; y < areaRecord.length; y++) {
				var array_element = $scope.tableDataHeadings[y];
				var str = array_element.replace(/\s/g, "");
				str = str.replace(/\W+/g, "");
				if (x == 0 || columns.indexOffield(str) == -1) {
					columns.push({
						title : array_element,
						field : str,
						visible : true,
					});
				}
				item[str] = areaRecord[y];
			}
			tabluarData.push(item);
		}

		$scope.columns = columns;
		// if (tabluarData.length == 0) {
		// $scope.isTableVisible = true;
		// } else {
		// $scope.isTableVisible = false;
		// }
		data = tabluarData;
	};

	Array.prototype.indexOffield = function(field) {
		for (var i = 0; i < this.length; i++)
			if (this[i].field === field)
				return i;
		return -1;
	};
	$scope.hideDatatable = function() {
		$scope.isShowTable = false;
		$scope.isShowChart = true;
	};

	/*
	 * $scope.getData = function(id) { $.ajax({ url : 'fetchGridData?formId=' +
	 * $scope.selectedSector + '&lastVisitDataId=' + ($scope.isPushpinClicked ==
	 * true ? $scope.lastVisiDataId : 0), type : "GET", success : function(data) {
	 * 
	 * if (data["Score (%)"].length == 0) { // alert("NO DATA AVAILABLE");
	 * $("#datatableDiv").hide(); $("#heightAdjustmentDiv").show();
	 * $('#noDataModall').modal('show'); } else { $scope.tableDataHeadings = [];
	 * $scope.tableDataValues = []; for ( var i in data) {
	 * $scope.tableDataHeadings.push('Indicator', i); } for (i = 0; i <
	 * data["Score (%)"].length; i++) { var tableData = [];
	 * tableData.push(data["Score (%)"][i].name, data["Score
	 * (%)"][i].percentScore); $scope.tableDataValues.push(tableData); }
	 * $scope.getTableDataValues(); $("#datatableDiv").show();
	 * $("#heightAdjustmentDiv").hide(); $scope.showLoaderModal = false;
	 * $scope.isShowTable = true; $scope.isShowChart = false; $('html,
	 * body').animate({ scrollTop : $('#colstatus').offset().top }, 1000); } }
	 * }); };
	 */

	/*
	 * $scope.excelDownload = function(tableId) { var xlsName = "DGA Data" +
	 * ".xls"; $scope.showLoaderModal = true; tableToExcel(tableId, 'data',
	 * xlsName); $scope.showLoaderModal = false; };
	 */

	var tableToExcel = (function() {

		var uri = 'data:application/vnd.ms-excel;base64,', template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>', base64 = function(
				s) {
			return window.btoa(unescape(encodeURIComponent(s)));
		}, format = function(s, c) {
			return s.replace(/{(\w+)}/g, function(m, p) {
				return c[p];
			});
		};
		return function(table, name, filename) {
			if (!table.nodeType)
				table = document.getElementById(table);
			var ctx = {
				worksheet : name || 'Worksheet',
				table : table.innerHTML
			};

			document.getElementById("dlink").href = uri
					+ base64(format(template, ctx));
			document.getElementById("dlink").download = filename;
			document.getElementById("dlink").click();

		};
	})();

	$scope.scrollForChart = function() {
		// $scope.getTreeData();
		$scope.isShowTable = false;
		$scope.isShowChart = true;
		// $('html, body').animate({
		// scrollTop : $('#treeChartDiv').offset().top
		// }, 1000);
	};

	$scope.scrollForTable = function() {
		$scope.getData();
		$scope.isShowTable = true;
		$scope.isShowChart = false;
	};

	$scope.progressBarUpdate = function() {
		var percentage = Math.round($scope.noOfFacilities
				/ $scope.noOfFacilitiesPlanned * 100);

		$(".bar-main-container.emerald .bar-container .bar").width(0);
		$(".bar-main-container.emerald .bar-container .bar")
				.animate(
						{
							"width" : percentage + "%"
						},
						{
							duration : 2000,
							step : function(currentStep) {
								$(".bar-percentage")
										.text(
												Math
														.round($(
																".bar-main-container.emerald .bar-container .bar")
																.width()
																/ $(
																		".bar-container")
																		.width()
																* 100)
														+ "%")
							}
						});
		setTimeout(function() {
			$(".bar-percentage").text(percentage + "%")
		}, 2100)
	};
	/*
	 * $scope.$watch('noOfFacilities', function(newValue, oldValue) {
	 * if(newValue && !$scope.progressBarUpdateCalled){
	 * $scope.progressBarUpdate(); }
	 * 
	 * 
	 * });
	 */

	/**
	 * ************************sdrc export to
	 * pdf**********************************
	 */

	// Please give container Id and export pdf btn ids
	/*
	 * $("#pdfDownloadBtn").on( "click", function(event) {
	 * event.preventDefault(); d3.selectAll("svg").attr("version",
	 * 1.1).attr("xmlns", "http://www.w3.org/2000/svg"); var spiderSvg =
	 * $("sdrc-spider").html(); var columnSvg = $("sdrc-bar-chart").html(); var
	 * chartSvgs = []; chartSvgs.push(spiderSvg); chartSvgs.push(columnSvg);
	 * $(".loader").show();
	 * 
	 * var serverURL = "api/exportToPdf?formId=" +
	 * $scope.selectedParentSector.formId + "&lastVisitDataId=" +
	 * $scope.lastVisiDataId + "&areaId=" + $scope.selectedDistrict.areaId;
	 * 
	 * $.ajax({ url: serverURL, method : 'POST', // contentType :
	 * 'application/json', // data : { // svgs : JSON.stringify(chartSvgs), // }, //
	 * data : JSON.parse(data), success : function(data) { //console.log(data); }
	 * 
	 * }); });
	 */
};

$(document).ready(function() {
	$(".dist-list ul.dropdown-menu input").click(function(e) {
		e.preventDefault();
	});
});