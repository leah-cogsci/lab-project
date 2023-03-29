//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var recorder; 						//WebAudioRecorder object
var input; 							//MediaStreamAudioSourceNode  we'll be recording
var encodingType; 					//holds selected encoding for resulting audio (file)
var encodeAfterRecord = true;       // when to encode

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //new audio context to help us record

//~ var encodingTypeSelect = document.getElementById("encodingTypeSelect");

var recordButton;
var stopButton;
var playbacklist;
var playbacklistname;

var isTrial = false;

function initrecorder(suffix){
	recordButton = document.getElementById("recordButton" + suffix);
	stopButton = document.getElementById("stopButton" + suffix);
	playbacklist = document.getElementById("playback" + suffix);
	playbacklistname = "playback" + suffix;
	//add events to those 2 buttons
	if(suffix === "trial") isTrial = true;
	recordButton.addEventListener("click", startRecording);
	stopButton.addEventListener("click", stopRecording);
}

function startRecording() {
	console.log("startRecording() called");

	/*
		Simple constraints object, for more advanced features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video:false };

    /*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		//~ __log("getUserMedia() success, stream created, initializing WebAudioRecorder...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
		audioContext = new AudioContext();

		//update the format 
		//~ document.getElementById("formats").innerHTML="Format: 2 channel "+encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value+" @ "+audioContext.sampleRate/1000+"kHz"

		//assign to gumStream for later use
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);
		
		//stop the input from playing back through the speakers
		//input.connect(audioContext.destination)

		//get the encoding 
		//~ encodingType = encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value;
		encodingType = "mp3";
		
		//disable the encoding selector
		//~ encodingTypeSelect.disabled = true;

		recorder = new WebAudioRecorder(input, {
		  workerDir: "_shared/js/", // must end with slash
		  encoding: encodingType,
		  numChannels:2, //2 is the default, mp3 encoding supports only 2
		  onEncoderLoading: function(recorder, encoding) {
		    // show "loading encoder..." display
		    //~ __log("Loading "+encoding+" encoder...");
		  },
		  onEncoderLoaded: function(recorder, encoding) {
		    // hide "loading encoder..." display
		    //~ __log(encoding+" encoder loaded");
		  }
		});

		recorder.onComplete = function(recorder, blob) { 
			console.log("Encoding complete");
			if(isTrial) {
				cutBlobByTimes(blob, exp.scene_cut_times).then((blobs)=>{
					for(i = 0; i < blobs.length; i++) {
						jatos.uploadResultFile(blobs[i], jatos.workerId + "_scene" + i + '.mp3');
					}
					$("#trialstatusblock").html("Upload complete! Click continue to proceed!");
					document.getElementById("trialcontinueblock").style.visibility = "visible";
				});
			} else {
				createDownloadLink(blob, recorder.encoding);
			}
		};

		recorder.onEncodingProgress = function (recorder, progress) {
			console.log(progress);
		}
		recorder.onEncodingCanceled = function(recorder) {
			console.log("canceled");
		}

		recorder.setOptions({
		  timeLimit:300,
		  encodeAfterRecord:encodeAfterRecord,
	      ogg: {quality: 0.5},
	      mp3: {bitRate: 160}
	    });

		//start the recording process
		if (isTrial){
			//~ document.getElementById("trialvideo").play();
			document.getElementById("starttrialvideobutton").disabled = false;
			$('#trialstartblock-access').prepend('<font color="green">&#x2713;</font>');
			$("#trialstatusblock").html('Audio recording status: RECORDING  <font color="red">&bull;</font>');
		}
		recorder.startRecording();

		 console.log("Recording started");

	}).catch(function(err) {
	  	//enable the record button if getUSerMedia() fails
    	recordButton.disabled = false;
    	stopButton.disabled = true;

	});

	//disable the record button
    recordButton.disabled = true;
    stopButton.disabled = false;
}

function stopRecording() {
	console.log("stopRecording() called");
	
	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//disable the stop button
	stopButton.disabled = true;
	recordButton.disabled = false;
	
	//tell the recorder to finish the recording (stop recording + encode the recorded audio)
	recorder.finishRecording();
	console.log("encoding finished");

	//~ __log('Recording stopped');
}

function createDownloadLink(blob,encoding) {
	
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('p');
	var link = document.createElement('a');

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//link the a element to the blob
	link.href = url;
	link.download = new Date().toISOString() + '.'+encoding;
	link.innerHTML = link.download;

	//add the new audio and a elements to the li element
	li.appendChild(au);
	//~ li.appendChild(link);

	console.log("link should have been created by now");
	//add the li element to the ordered list
	$("#"+playbacklistname).html(li);
	$("#"+playbacklistname).load();
	//~ $("#"+playbacklistname).onended = function (){
	document.getElementById("miccheckcontinuebutton").disabled = false;
	//~ }
}

async function cutBlobByTimes(blob, times) {
	var cutter = new mp3cutter(libPath = "_shared/js/");
	var blobs = []
	for(let i = 1; i < times.length; i++) {
		blobs.push(await cutter.cut(blob, Math.floor(times[i-1]/1000), Math.ceil(times[i]/1000), 160));
	}
	return blobs;
}

window.onerror = function(msg, url, line) {
	if(encodeURIComponent) {
		$.ajax({
			url :  "logJSerror.php",
			type: 'POST',
			data: {msg: msg, url:url, line:line},
			success: function(data) {
				console.log('logged error to server')
			},
			error: function(data) {
				console.log(data);
			}
		});
	}
	return false;
}

//Modified version of https://github.com/lubenard/simple-mp3-cutter
class mp3cutter {
	//libPath must end with a slash
	constructor(libPath = "./lib/", log = false) {
        self.Mp3LameEncoderConfig = {
			memoryInitializerPrefixURL: libPath,
			TOTAL_MEMORY: 1073741824,
		};
		this.libPath = libPath;
		this.log = log;

		var ref = document.getElementsByTagName("script")[0];
		var script = document.createElement("script");

		script.src = this.libPath + "Mp3LameEncoder.min.js";
		ref.parentNode.insertBefore(script, ref);
	}

	logger(message) {
		if (this.log)
			console.log(message);
	}

	async cut(src, start, end, bitrate = 192) {
		if (!src)
			throw 'Invalid parameters!';

		if (start > end)
			throw 'Start is bigger than end!';
		else if (start < 0 || end < 0)
			throw 'Start or end is negative, cannot process';

		this.start = start;
		this.end = end;
		this.bitrate = bitrate;

		// Convert blob into ArrayBuffer
		let buffer = await new Response(src).arrayBuffer();
		this.audioContext = new AudioContext();

		//Convert ArrayBuffer into AudioBuffer
		return this.computeData(await this.audioContext.decodeAudioData(buffer));
	}

	computeData (decodedData) {
		this.logger(decodedData);
		//Compute start and end values in secondes
		let computedStart = decodedData.length * this.start / decodedData.duration;
		let computedEnd = decodedData.length * this.end / decodedData.duration;

		//Create a new buffer
		const newBuffer = this.audioContext.createBuffer(decodedData.numberOfChannels, computedEnd - computedStart , decodedData.sampleRate)

		// Copy from old buffer to new with the right slice.
		// At this point, the audio has been cut
		for (var i = 0; i < decodedData.numberOfChannels; i++) {
			newBuffer.copyToChannel(decodedData.getChannelData(i).slice(computedStart, computedEnd), i)
		}

		this.logger(newBuffer);

		// Bitrate is  by default 192, but can be whatever you want
		let encoder = new Mp3LameEncoder(newBuffer.sampleRate, this.bitrate);

		//Recreate Object from AudioBuffer
		let formattedArray = {
			channels: Array.apply(null, { length: (newBuffer.numberOfChannels - 1) - 0 + 1 }).map((v, i) => i + 0).map(i => newBuffer.getChannelData(i)),
			sampleRate: newBuffer.sampleRate,
			length: newBuffer.length,
		};

		this.logger(formattedArray);

		//Encode into mp3
		encoder.encode(formattedArray.channels);

		//When encoder has finished
		let compressed_blob = encoder.finish();

		this.logger(compressed_blob);

		this.logger(URL.createObjectURL(compressed_blob));

		return compressed_blob;
	}
}
