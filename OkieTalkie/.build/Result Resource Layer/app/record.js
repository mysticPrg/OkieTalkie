define(['jquery'], function ($) {
	var recordExport={};
	
	var fileName = 'rec.mp4',
		MAX_RECORDING_TIME = 10000,
		videoRecordingStartTime = 0,
		VIDEO_LENGTH_CHECK_INTERVAL = 1000,
	    recordingInterval = null,
	    videoLengthCheckInterval,
	    tmpAudio = null,
		totalTime = 0,
		audioControl,
		tempVideo,
		documentsDir,
		testFile,
		testFileStream;
		
	function init() {
		
		 tizen.filesystem.resolve(
		   'documents', 
		   function(dir){
		     documentsDir = dir;
			 
		   }, function(e){
		     console.log("Error" + e.message);
		   }, "rw"
		 );
		
		navigator.webkitGetUserMedia({
			video : false,
			audio : true
			}, onStream, onError
		);
	}	
	
	function setBtns() {
		$('#Test1').click(write);
	
	}
	
	recordExport.recordStart = function() {
		documentsDir.deleteFile('file:///opt/usr/media/Sounds/rec.mp4');
		audioControl.recorder.start(onRecordingStart, onError);
	}
	
	recordExport.recordStop = function() {
		audioControl.recorder.stop(recordingStopSuccess, onError);
	}
	
	recordExport.playVideo = function(){
		$('#video').html('');
		$('#video').html('<video id="video1"><source src="file:///opt/usr/media/Sounds/rec.mp4" type="video/mp4" /></video>');
		var video = $('#video1')[0];
		video.load();
		video.play();
	}
	
	function write() {
		
		documentsDir.deleteFile('file:///opt/usr/media/Documents/receive.mp4');
		testFile = documentsDir.createFile("receive.mp4");
		
		testFile.openStream('w', function(fs) {
			testFileStream = fs;
			
			tizen.filesystem.resolve(
					'file:///opt/usr/media/Sounds/rec.mp4',
					function(file) {
						file.openStream("r", function(fs) {
							
							var bytes;
							do {
								bytes = fs.readBytes(1000);
								testFileStream.writeBytes(bytes);
								console.log(bytes);
							} while(!fs.eof);
							
							console.log("print end!");
							testFileStream.close();
							fs.close();
						});
					},
					function(e) {
						console.log("Error" + e.message);
					},
					"r"
				);
		});
	}
	
	function onError(err) {
		console.log(err);
	}
	
	function onStream(stream) {
		// register stream
		navigator.tizCamera.createCameraControl(stream, onAudioControlCreated, onError);
	}
	
	function onAudioSettingsApplied() {
		
	}
	
	function onRecordingStart() {
		startTracingVideoLength();
	}
	
	function recordingStopSuccess() {
		
	}
	
	function onAudioControlCreated(control) {
		audioControl = control; 
	
		var settings = {};
		settings.fileName = fileName;
		audioControl.recorder.applySettings(settings, onAudioSettingsApplied, onError);
	}
	
	//Check Time (Limit : 10sec)
	function startTracingVideoLength() 
	{
	   videoRecordingStartTime = new Date();
	   videoLengthCheckInterval = window.setTimeout(function(){checkVideoLength();}, 1000);
	}
	
	function checkVideoLength() 
	{
	   var currentTime = new Date();

	   if (currentTime - videoRecordingStartTime > MAX_RECORDING_TIME) 
	   {
	      window.clearInterval(videoLengthCheckInterval);
	      recordExport.recordStop();
	   }
	   else
		   videoLengthCheckInterval = window.setTimeout (function(){checkVideoLength();}, 1000);
	}

	$(document).ready(function() {
		init();
		setBtns();
	});
	
	return recordExport;
});