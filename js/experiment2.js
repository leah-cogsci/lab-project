//VARS AND FUNCTIONS

var speaker_one = _.shuffle([['The election results are great.', 'The election results are pretty good.', 'The election results are okay.', 'The election results are poor.', 'The election results are terrible.'], ["The city's climate policies are great.", "The city's climate policies are pretty good.", "The city's climate policies are okay.", "The city's climate policies are poor.", "The city's climate policies are terrible."], ["The mayor's decision about the housing crisis is great.", "The mayor's decision about the housing crisis is pretty good.", "The mayor's decision about the housing crisis is okay.", "The mayor's decision about the housing crisis is poor.", "The mayor's decision about the housing crisis is terrible."], ['The jurisdiction in our district is great.', 'The jurisdiction in our district is pretty good.', 'The jurisdiction in our district is okay.', 'The jurisdiction in our district is poor.', 'The jurisdiction in our district is terrible.'], ['Our public transport system is great.', 'Our public transport system is pretty good.', 'Our public transport system is okay.', 'Our public transport system is poor.', 'Our public transport system is terrible.'], ['The way our country counteracts school shootings is great.', 'The way our country counteracts school shootings is pretty good.', 'The way our country counteracts school shootings is okay.', 'The way our country counteracts school shootings is poor.', 'The way our country counteracts school shootings is terrible.'], ["Women's access to reproductive rights is great.", "Women's access to reproductive rights is pretty good.", "Women's access to reproductive rights is okay.", "Women's access to reproductive rights is poor.", "Women's access to reproductive rights is terrible."], ['The way the farmers treat their animals is great.', 'The way the farmers treat their animals is pretty good.', 'The way the farmers treat their animals is okay.', 'The way the farmers treat their animals is poor.', 'The way the farmers treat their animals is terrible.'], ['Free speech policies on Twitter are great.', 'Free speech policies on Twitter are pretty good.', 'Free speech policies on Twitter are okay.', 'Free speech policies on Twitter are poor.', 'Free speech policies on Twitter are terrible.'], ['Our immigration laws are great.', 'Our immigration laws are pretty good.', 'Our immigration laws are okay.', 'Our immigration laws are poor.', 'Our immigration laws are terrible.']]);
// case distinction plural/singular for response based on topic
var speaker_two_sg = _.shuffle(["I find it amazing.", "I find it decent.", "I find it interesting.", "I find it rather bad.", "I find it awful."]);
var speaker_two_pl = _.shuffle(["I find them amazing.", "I find them decent.", "I find them interesting.", "I find them rather bad.", "I find them awful."]);

var tList = speaker_one.slice(); //needed for progress bar

function uncheckRadio(){
	document.getElementById("radio1").checked=false;
	document.getElementById("radio2").checked=false;
	document.getElementById("radio3").checked=false;
	document.getElementById("radio4").checked=false;
	document.getElementById("radio5").checked=false;
}
var radioMem = []; //array for radiobutton values
var sentence_mem =[]; // array for speaker one sentences
var response_mem = []; //array for responses
var index;
var sentence;
var container;
var speaker_name;
var gender;


function checkRadioValue(){ //function that checks for radio button values
	document.getElementById("continueButton").disabled=false;
	if(document.getElementById("radio1").checked){
		radioMem.push(document.getElementById("radio1").value);
	}
	if(document.getElementById("radio2").checked){
		radioMem.push(document.getElementById("radio2").value);
	}
	if(document.getElementById("radio3").checked){
		radioMem.push(document.getElementById("radio3").value);
	}
	if(document.getElementById("radio4").checked){
		radioMem.push(document.getElementById("radio4").value);
	}
	if(document.getElementById("radio5").checked){
		radioMem.push(document.getElementById("radio5").value);
	}
}

function randomIndex(l) { //get random index for a list
	return Math.floor(Math.random() * l.length)
}

function randomGender() { //with a 50/50 split, choose either male or female array (defined in names.js)
	return Math.random() < 0.5 ? maleNames : femaleNames;
} 

function getRandomName(array, prevname) {
	let index = randomIndex(array);
	
	// check if the index corresponds to the previous name
	if (array[index] === prevname) {
	  // if so, add 1 to the index (wrapping around if necessary)
	  index = (index + 1) % array.length;
	}
	
	return array[index];
  }

  function removevaluefromfeaturelist(l, v){ //splicing function
	var index = l.indexOf(v);
	if (index > -1) {
	  l.splice(index, 1)
	}
	return l;
}

function displayRandomSentence() {
	//choose random topic tuple
	index = randomIndex(speaker_one);
	topic_tuple = speaker_one[index];
	//choose random sentence
	topic_index = randomIndex(topic_tuple);
	sentence = topic_tuple[topic_index];
	//display speaker one
	container = document.getElementById('sentence-box'); 
	console.log("INDEX: "+index);
	// get random gender + name
	gender = randomGender();
	speaker_name = getRandomName(gender,""); //initialised with empty string because we have no risk of duplicate names here
	//update text
	container.innerHTML = `<b>${speaker_name}:</b> ${sentence}`; //formatted string
	console.log("SELECTED SENTENCE:" + sentence);
	//remove topic_tuple from speaker_one so we get each topic only once
	removevaluefromfeaturelist(speaker_one, topic_tuple);
	sentence_mem.push(sentence); //add current element to memory array

	console.log("Sentence Memory: " +sentence_mem);
	// we need the gender to make sure we draw from the same array and the speaker_name to make sure there's not 2x the same name
	return [gender, speaker_name];	
}

function displayRandomResponse(gender, prevname) {
	// get sentence from page as reference
	sentence = document.getElementById('sentence-box').textContent;
	// make sure grammar aligns based on topic
	response_list = sentence.includes('housing') || sentence.includes('jurisdiction') || sentence.includes('transport') || sentence.includes('school') || sentence.includes('reproductive') || sentence.includes('animals')
	  ? speaker_two_sg
	  : speaker_two_pl;
	//choose random response
	const index = randomIndex(response_list);
	const response = response_list[index];
	// for displaying response and question
	const responseContainer = document.getElementById('response-box');
	const attitudeContainer = document.getElementById("attitude-text");
	// get random name based on gender of speaker and speaker's name
	const response_name = getRandomName(gender,prevname);
	responseContainer.innerHTML =`<b>${response_name}:</b> ${response}`;
	//only response speaker is rated
	attitudeContainer.textContent = `${response_name}'s actual attitude is:`;
	console.log("SELECTED RESPONSE:" + response);
	response_mem.push(response);
	console.log("Reponse Memory:" + response_mem);
  }

function make_slides(f) {
	var slides = {};

	var myProgress=document.getElementById("progressBar");	
	
	slides.i0 = slide({
		name : "i0",
		start : function() {
			exp.startT = Date.now();
			const participate_checkbox = document.getElementById('confirm_participate')
			participate_checkbox.addEventListener('change', this.change_participate_checkbox);
			const collection_checkbox = document.getElementById('data_collection_agreement')
			collection_checkbox.addEventListener('change', this.change_collection_checkbox);
			
			this.participate_checked = false;
			this.collection_checked = false;
			
			this.sharing_choice_given = false;
		},
		change_participate_checkbox: function(event) {
			_s.participate_checked = event.currentTarget.checked;
			_s.manage_continue_button();
		},
		change_collection_checkbox: function(event) {
			_s.collection_checked = event.currentTarget.checked;
			_s.manage_continue_button();
		},
		
		change_sharing_radio_button: function(selectedRadio) {
			exp.data_sharing_choice = selectedRadio.value;
			this.sharing_choice_given = true;
			this.manage_continue_button();
		},
		manage_continue_button: function() {
			const enable = this.participate_checked && this.collection_checked && this.sharing_choice_given;
			document.getElementById("start_button").disabled = !enable;
			if(this.participate_checked && this.collection_checked && this.sharing_choice_given){
				var newWidth = (1/(5+tList.length)*100)   +"%"; 
				myProgress.style.width = newWidth;
			}
		}
		
	});
	

	slides.instructions = slide({
		
		name : "instructions",
		
		button : function() {
			var newWidth = parseFloat(document.getElementById("progressBar").style.width) + (1/(5+tList.length)*100)   +"%"; 
				myProgress.style.width = newWidth;
				
			exp.go(); //
		
		
		}
	});


	slides.example = slide({
		name : "example",
		
		start: function(){
			//set to false
			this.rate_choice_given = false;
		}
		,
		change_rate_radio_button: function(selectedRadio) {
			exp.data_like = selectedRadio.value;
			
			this.rate_choice_given = true;
			this.manage_continue_button();
		}
		,
		
		manage_continue_button: function() {
			// enable continue only when participant has selected a value
			const enable = this.rate_choice_given;
			document.getElementById("example_button").disabled = !enable;
		}
		,
		button: function(){
			
			
			exp.go();
			document.getElementById("continueButton").disabled=true;
			var newWidth = parseFloat(document.getElementById("progressBar").style.width) + (1/(5+tList.length)*100)   +"%"; //100
				myProgress.style.width = newWidth;
		
		}

	})

	slides.move_on = slide({
		name: "move_on",
		button: function () {
			gender_start=displayRandomSentence(); // get first speaker 1
			displayRandomResponse(gender_start[0],gender_start[1]); // get speaker 2 based on speaker 1
			exp.go();
			var newWidth = parseFloat(document.getElementById("progressBar").style.width) + (1/(5+tList.length)*100)   +"%"; //100
			myProgress.style.width = newWidth;
		}
	});
	
	
	slides.experiment = slide({
		name: "experiment",
		
		button: function(){
			console.log(tList.length);
			checkRadioValue();
			uncheckRadio();
			console.log("Value MEMORY: " + radioMem);
			//check if there are topics left
			if(speaker_one.length>=1){
				
				gender = displayRandomSentence();
				displayRandomResponse(gender[0],gender[1]);
			}
			else{
				checkRadioValue();
				exp.go();
				
			}
			
			
			var newWidth = parseFloat(document.getElementById("progressBar").style.width) + (1/(4+tList.length)*100)   +"%"; 
				myProgress.style.width = newWidth;
				//alert(newWidth);
			document.getElementById("continueButton").disabled=true;
			
		}
	})
  
  	
	slides.subj_info =  slide({
		name : "subj_info",
		submit : function(e){
			
				myProgress.style.width = 100+"%";
				
		exp.subj_data = {
			language : $("#language").val(),
			enjoyment : $("#enjoyment").val(),
			assess : $('input[name="assess"]:checked').val(),
			age : $("#age").val(),
			gender : $("#gender").val(),
			education : $("#education").val(),
			comments : $("#comments").val()
		};
		
		exp.go(); 
		}
	});

	slides.thanks = slide({
		
		
		name : "thanks",
		start : function() {
			
		exp.data= {
			"subject_id": jatos.workerId,
			"variation_id": exp.variation_id,
			"system" : exp.system,
			"subject_information" : exp.subj_data,
			"data_sharing_choice": exp.data_sharing_choice,
			"time_in_minutes" : (Date.now() - exp.startT)/60000
		};
		//Upload data to jatos server
		
		},
		end_exp : function(){
			
			const trialdata = sentence_mem.concat(response_mem).concat(radioMem);  //sentences, responses, ratings
			jatos.appendResultData(expdata);
			
			jatos.appendResultData(exp.data);
			console.log("end_exp called");
			jatos.endStudy();    //button end_exp ends study 
		}
		
	});
	
	return slides;
}


/// init ///
function init() {
	repeatWorker = false;
	(function(){
		var ut_id = "pronouneventmatch-fixed";
		if (UTWorkerLimitReached(ut_id)) {
		$('.slide').empty();
		repeatWorker = true;
		alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
		}
	})();


	exp.system = {
		Browser : BrowserDetect.browser,
		OS : BrowserDetect.OS,
		screenH: screen.height,
		screenUH: exp.height,
		screenW: screen.width,
		screenUW: exp.width,
	};
	//blocks of the experiment:
	exp.structure=[
				
				"i0",
				
				"instructions",
				"example",
				"move_on",
				"experiment",
				'subj_info', 
				'thanks'
				];
	
	//make corresponding slides:
	exp.slides = make_slides(exp);

	

	$('.slide').hide(); //hide everything

	//make sure turkers have accepted HIT (or you're not in mturk)
	$("#start_button").click(function() {
	if (turk.previewMode) {
		$("#mustaccept").show();
	} else {
		$("#start_button").click(function() {$("#mustaccept").show();});
		exp.go();
	}
	});
	
	exp.go(); //show first slide
	
}

//JATOS

jatos.onLoad(function(){
	init();
})