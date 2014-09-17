require([
		'jquery',
		'G2NSystem',
		'G2NLifeCycle',
		'app/connect',
		'app/record',
		'tau'
	], function (
		$,
		G2NSystem,
		G2NLifeCycle,
		connect,
		record
	) {
	
	$(document).ready(function() {
		
		var isConnected = false;
		var isMain = false;
		var isInit = false;
		
		var connectNumber = 916;
		
		var channels;
		/*
		 * resume -> connected to bridge app 
		 */
		function onResume() {
			isConnected = true;				
			tau.changePage('#page_main');
			isMain = true;
		}
		
		/*
		 * pause -> disconnect to bridge app
		 */
		function onPause() {
			tau.changePage('#page_disconnect');
			isConnected = false;
		}
		
		function backOrExit() {
			if ( isMain || (isConnected === false) ) {
				connect.sendClose(function() {
					G2NLifeCycle.exit();
				});
			}  else {
				connect.sendExit(connectNumber, function(chan, allLength) {
					channels = chan;
					$('#page_main #totalConnector').text(allLength + '명');
					tau.back();
				});
			}
		}
		
		G2NLifeCycle.setOnResumeCallback(onResume);
		G2NLifeCycle.setOnPauseCallback(onPause);
		window.addEventListener('tizenhwkey', backOrExit);
		
		$('#page_main').on('pageshow', function() {
			isMain = true;
			
			if ( isInit === false ) {
				connect.connect(function(chan, allLength) {
					channels = chan;
					$('#page_main #totalConnector').text(allLength + '명');
					isInit = true;
				});
			}
		});
		
		$('#page_main').on('pagehide', function() {
			isMain = false;
		});
		
		//=============================================================================
		
//		$('#page_main #channelConnector').text(channelConnectorCounter + '명');
		
		$('#page_main #MHzUnit').text('MHz');
		
		
		var firstFloatNumber = 9;
		$('#page_main #firstNumber').text(firstFloatNumber);
		
		var secondFloatNumber = 1;
		$('#page_main #secondNumber').text(secondFloatNumber);
		
		var thirdFloatNumber = 6;
		$('#page_main #thirdNumber').text(thirdFloatNumber);
		
		$('#page_main #dot').text('.');
		
		$('#page_main #firstNumberUpImg').click(function(){
			if(firstFloatNumber < 9) {
				firstFloatNumber++;
				$('#page_main #firstNumber').text(firstFloatNumber);
				connectNumber += 100;
				console.log(connectNumber);
			}
			
			else if(firstFloatNumber == 9){
				firstFloatNumber = 0;
				$('#page_main #firstNumber').text(firstFloatNumber);
				connectNumber -= 900;
				console.log(connectNumber);
			}
				
		});
		
		$('#page_main #secondNumberUpImg').click(function(){
			if(secondFloatNumber < 9){
				secondFloatNumber++;
				$('#page_main #secondNumber').text(secondFloatNumber);
				connectNumber += 10;
				console.log(connectNumber);
			}
			
			else if(secondFloatNumber == 9){
				secondFloatNumber = 0;
				$('#page_main #secondNumber').text(secondFloatNumber);
				connectNumber -= 90;
				console.log(connectNumber);
			}
		});
		
		$('#page_main #thirdNumberUpImg').click(function(){
			if(thirdFloatNumber < 9){
				thirdFloatNumber++;
				$('#page_main #thirdNumber').text(thirdFloatNumber);
				connectNumber += 1;
				console.log(connectNumber);
			}
			
			else if(thirdFloatNumber == 9){
				thirdFloatNumber = 0;
				$('#page_main #thirdNumber').text(thirdFloatNumber);
				connectNumber -= 9;
				console.log(connectNumber);
			}
		});
		
		
		
		$('#page_main #firstNumberDownImg').click(function(){
			if(firstFloatNumber > 0) {
				firstFloatNumber--;
				$('#page_main #firstNumber').text(firstFloatNumber);
				connectNumber -= 100;
				console.log(connectNumber);
			}
			
			else if(firstFloatNumber == 0){
				firstFloatNumber = 9;
				$('#page_main #firstNumber').text(firstFloatNumber);
				connectNumber += 900;
				console.log(connectNumber);
			}
		});
		
		$('#page_main #secondNumberDownImg').click(function(){
			if(secondFloatNumber > 0){
				secondFloatNumber--;
				$('#page_main #secondNumber').text(secondFloatNumber);
				connectNumber -= 10;
				console.log(connectNumber);
			}
			
			else if(secondFloatNumber == 0){
				secondFloatNumber = 9;
				$('#page_main #secondNumber').text(secondFloatNumber);
				connectNumber += 90;
				console.log(connectNumber);
			}
		});
		
		$('#page_main #thirdNumberDownImg').click(function(){
			if(thirdFloatNumber > 0){
				thirdFloatNumber--;
				$('#page_main #thirdNumber').text(thirdFloatNumber);
				connectNumber -= 1;
				console.log(connectNumber);
			}		
			
			else if(thirdFloatNumber == 0){
				thirdFloatNumber = 9;
				$('#page_main #thirdNumber').text(thirdFloatNumber);
				connectNumber += 9;
				console.log(connectNumber);
			}
		});
		
		$('#connectChannel').click(function() {
			console.log('click!');
			connect.sendJoin(connectNumber, function(length, port) {
				tau.changePage('#page_room');
			});
		});
		
		//===========================================================================
		
//		$('#page_room #hertz').text(hertzNumber + 'MHz');
		
//		$('#page_room #channelConnector').text(channelConnectorCounter + '명');
		
		$('#page_room #recordVoice').click(function(){
			connect.sendRequestMic(function(result) {
				if ( result === true ) {
					// record start
					record.recordStart();
				}
				else {
					//record stop
					record.recordStop();
				}
			});
		});
	});
	
});