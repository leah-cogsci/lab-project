// VARIABLES AND FUNCTIONS 

var tuple_list = [['The election results are great.', 'The election results are amazing.'], ['The election results are pretty good.', 'The election results are decent.'], ['The election results are okay.', 'The election results are interesting.'], ['The election results are poor.', 'The election results are rather bad.'], ['The election results are terrible.', 'The election results are awful.'], ["The city's climate policies are great.", "The city's climate policies are amazing."], ["The city's climate policies are pretty good.", "The city's climate policies are decent."], ["The city's climate policies are okay.", "The city's climate policies are interesting."], ["The city's climate policies are poor.", "The city's climate policies are rather bad."], ["The city's climate policies are terrible.", "The city's climate policies are awful."], ["The mayor's decision about the housing crisis is great.", "The mayor's decision about the housing crisis is amazing."], ["The mayor's decision about the housing crisis is pretty good.", "The mayor's decision about the housing crisis is decent."], ["The mayor's decision about the housing crisis is okay.", "The mayor's decision about the housing crisis is interesting."], ["The mayor's decision about the housing crisis is poor.", "The mayor's decision about the housing crisis is rather bad."], ["The mayor's decision about the housing crisis is terrible.", "The mayor's decision about the housing crisis is awful."], ['The jurisdiction in our district is great.', 'The jurisdiction in our district is amazing.'], ['The jurisdiction in our district is pretty good.', 'The jurisdiction in our district is decent.'], ['The jurisdiction in our district is okay.', 'The jurisdiction in our district is interesting.'], ['The jurisdiction in our district is poor.', 'The jurisdiction in our district is rather bad.'], ['The jurisdiction in our district is terrible.', 'The jurisdiction in our district is awful.'], ['Our public transport system is great.', 'Our public transport system is amazing.'], ['Our public transport system is pretty good.', 'Our public transport system is decent.'], ['Our public transport system is okay.', 'Our public transport system is interesting.'], ['Our public transport system is poor.', 'Our public transport system is rather bad.'], ['Our public transport system is terrible.', 'Our public transport system is awful.'], ['The way our country counteracts school shootings is great.', 'The way our country counteracts school shootings is amazing.'], ['The way our country counteracts school shootings is pretty good.', 'The way our country counteracts school shootings is decent.'], ['The way our country counteracts school shootings is okay.', 'The way our country counteracts school shootings is interesting.'], ['The way our country counteracts school shootings is poor.', 'The way our country counteracts school shootings is rather bad.'], ['The way our country counteracts school shootings is terrible.', 'The way our country counteracts school shootings is awful.'], ["Women's access to reproductive rights is great.", "Women's access to reproductive rights is amazing."], ["Women's access to reproductive rights is pretty good.", "Women's access to reproductive rights is decent."], ["Women's access to reproductive rights is okay.", "Women's access to reproductive rights is interesting."], ["Women's access to reproductive rights is poor.", "Women's access to reproductive rights is rather bad."], ["Women's access to reproductive rights is terrible.", "Women's access to reproductive rights is awful."], ['The way the farmers treat their animals is great.', 'The way the farmers treat their animals is amazing.'], ['The way the farmers treat their animals is pretty good.', 'The way the farmers treat their animals is decent.'], ['The way the farmers treat their animals is okay.', 'The way the farmers treat their animals is interesting.'], ['The way the farmers treat their animals is poor.', 'The way the farmers treat their animals is rather bad.'], ['The way the farmers treat their animals is terrible.', 'The way the farmers treat their animals is awful.'], ['Free speech policies on Twitter are great.', 'Free speech policies on Twitter are amazing.'], ['Free speech policies on Twitter are pretty good.', 'Free speech policies on Twitter are decent.'], ['Free speech policies on Twitter are okay.', 'Free speech policies on Twitter are interesting.'], ['Free speech policies on Twitter are poor.', 'Free speech policies on Twitter are rather bad.'], ['Free speech policies on Twitter are terrible.', 'Free speech policies on Twitter are awful.'], ['Our immigration laws are great.', 'Our immigration laws are amazing.'], ['Our immigration laws are pretty good.', 'Our immigration laws are decent.'], ['Our immigration laws are okay.', 'Our immigration laws are interesting.'], ['Our immigration laws are poor.', 'Our immigration laws are rather bad.'], ['Our immigration laws are terrible.', 'Our immigration laws are awful.']]

var tList = tuple_list.slice(); //we have 50 tuples of 2 in our list, so tList will be 50 and not 100
var radioMem = []; //array for radiobutton values
var sentence_mem =[];
var index;
var sentence;
var container;

function uncheckRadio(){ //uncheck radio buttons after each experimental run
	document.getElementById("radio1").checked=false;
	document.getElementById("radio2").checked=false;
	document.getElementById("radio3").checked=false;
	document.getElementById("radio4").checked=false;
	document.getElementById("radio5").checked=false;
}

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

function randomIndex(l) { //get a random index for a list
	return Math.floor(Math.random() * l.length)
}

function displayRandomSentence() {
	//choose random tuple
	 index = Math.floor(Math.random()*tuple_list.length);
	 sentence_tuple = tuple_list[index];
	// choose random sentence
	 tuple_index = randomIndex(sentence_tuple);
	 sentence = sentence_tuple[tuple_index];
	//select element on page to display it
	 container = document.getElementById('sentence-box'); 
	 console.log("INDEX: "+index);
	//update text
	container.textContent = sentence;
	console.log("SELECTED SENTENCE:" +sentence);
	tuple_list.splice(index,1); //remove current entry from array
	sentence_mem.push(sentence); //add current element to memory array
	// for functionality control, you can delete this it won't affect the functionality of the code at all
	console.log("Sätze Memory: " +sentence_mem);
	console.log("Sätze im Array: " + tuple_list);
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
			//this doesn't refer to the slide in this case because it's called as event listener handler
			_s.participate_checked = event.currentTarget.checked;
			_s.manage_continue_button();
		},
		change_collection_checkbox: function(event) {
			//this doesn't refer to the slide in this case because it's called as event listener handler
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
				var newWidth = (1/(4+tList.length)*100)   +"%"; //adjust width of progress bar dynamically
				myProgress.style.width = newWidth;
				

			}
		}
		
	});
	

	slides.instructions = slide({
		
		name : "instructions",
		
		button : function() {
			var newWidth = parseFloat(document.getElementById("progressBar").style.width) + (1/(4+tList.length)*100)   +"%"; 
				myProgress.style.width = newWidth;
				
			exp.go();	//this gets you to the next stage of the experiment
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
			
			displayRandomSentence(); //this needs to be initialised here to get a sentence for the first experimental run
			exp.go();
			document.getElementById("continueButton").disabled=true;
			var newWidth = parseFloat(document.getElementById("progressBar").style.width) + (1/(4+tList.length)*100)   +"%"; //I'm using 4+tList.length because other than the trial runs there are 4 pages to be displayed, if you have more, adjust this number :)
				myProgress.style.width = newWidth;
		
		}

	})
	
	
	slides.experiment = slide({
		name: "experiment",
		
		button: function(){
			console.log(tList.length);
			checkRadioValue();
			uncheckRadio();
			console.log("Value MEMORY: " + radioMem);
			// check if there are sentences left in tuple array
			if(tuple_list.length>=1){
				
				displayRandomSentence();
			}
			else{
				checkRadioValue();
				exp.go();
				
			}
			
			var newWidth = parseFloat(document.getElementById("progressBar").style.width) + (1/(4+tList.length)*100)   +"%"; 
				myProgress.style.width = newWidth;
				
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
			"subject_information" : exp.subj_data, //subject info is added here, you don't need to concatenate it manually
			"data_sharing_choice": exp.data_sharing_choice,
			"time_in_minutes" : (Date.now() - exp.startT)/60000
		};
		//Upload data to jatos server
		//there is appendResultData and submitResultData, the latter OVERWRITES anything that was written previously so if you use it make sure to use it first and use only append after that 
		},
		end_exp : function(){
			
			const trialdata = sentence_mem.concat(radioMem); // concatenation of sentence_mem and radioMem  
			jatos.appendResultData(trialdata); //here you could also use submit, but you can also always use append
			jatos.appendResultData(exp.data); // THIS NEEDS TO BE APPEND OR IT WILL DELETE THE PREVIOUS DATA
			console.log("end_exp called");
			jatos.endStudy();    
		}
		
	});
	
	return slides;
}

/// init ///
// See exp.structure if you add more slides or want to remove some of them
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