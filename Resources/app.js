//
//  app.js
//  whats-today
//
//  Created by amith.mk on 2013-07-31.
//  Copyright 2013 amith.mk. All rights reserved.
//

// Include Scule Library
var scule = require('com.scule');
scule.debug(false);

//Instantiating facebook module
var fb = require('facebook');
fb.appid = '1406202192928906';
fb.permissions = ['publish_stream'];
// create collection
var scollection = scule.factoryCollection('scule+dummy://titanium');

//Global variables
var jsonData;
var selectedDate;
var collection = "info_birth";
var category = "entertainment";

//TabGroup intialization
var self = Titanium.UI.createTabGroup();

//Date picker Intialization
var picker = Ti.UI.createPicker({
	type : Ti.UI.PICKER_TYPE_DATE,
	minDate : new Date(2009, 0, 1),
	maxDate : new Date(2014, 11, 31),
	value : new Date()
});

//table view search bar

var searchBar = Ti.UI.createSearchBar({
	showCancel : true,
	hintText : 'type name to search'
});

//Intialization of table view

var myTable = Ti.UI.createTableView({
	search : searchBar, //here will set search bar
	filterCaseInsensitive : true,
	filterAttribute : 'filter', //here is the search filter which appears in TableViewRow as an attribute(you can define it in other name)
});

//No Content label Initialization
var nocontent_label = Ti.UI.createLabel({
	color : '#000',
	font : {
		fontFamily : 'Trebuchet MS',
		fontSize : 18
	},
	shadowColor : '#aaa',
	shadowOffset : {
		x : 5,
		y : 5
	},
	text : 'Nothing to Display. Choose another',
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	top : 30,
	//width: Ti.UI.SIZE, height: Ti.UI.SIZE
});

// Ajax progess indicator Initilization

var actInd = Titanium.UI.createActivityIndicator({
	bottom : Ti.Platform.displayCaps.platformHeight / 2,
	left : Ti.Platform.displayCaps.platformWidth / 2,
	height : Ti.Platform.displayCaps.platformHeight / 2,
	width : 50
});

actInd.font = {
	fontFamily : 'Trebuchet MS',
	fontSize : 18
};
actInd.color = '#000';
actInd.message = 'Fetching Content...please wait';
actInd.height = Ti.Platform.displayCaps.platformHeight / 2;

// Date manipulation to display Month and date in the Action Bar title
var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var d = new Date();
var day = d.getDate();
var month = d.getMonth();
var year = d.getYear();
var customDate = monthNames[month] + " " + day;
// adding zero before month if month is less than 9
if ((month + 1) > 9) {
	selectedDate = day + "-" + (month + 1);

} else {
	selectedDate = day + "-0" + (month + 1);

}

//var jsonData = JSON.parse('{"nationality":[{"nation":"American","items":[{"_id":{"$id":"51e7897d5e24cfc00e00563d"},"name":"Derrick Thomas","nationality":"American","category":"sports","profession":"football player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e00563e"},"name":"Mike Mitchell","nationality":"American","category":"sports","profession":"basketball player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e005643"},"name":"Jackie Parker","nationality":"American","category":"sports","profession":"football player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e005649"},"name":"Leonard Thompson","nationality":"American","category":"sports","profession":"golfer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e005657"},"name":"Don Nehlen","nationality":"American","category":"sports","profession":"football player and coach","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e005667"},"name":"Hank Greenberg","nationality":"American","category":"sports","profession":"baseball player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e005671"},"name":"Rocky Graziano","nationality":"American","category":"sports","profession":"boxer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e005674"},"name":"Joe Cannon","nationality":"American","category":"sports","profession":"soccer player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e005688"},"name":"James Davis","nationality":"American","category":"sports","profession":"football player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e00568e"},"name":"Lynn Jones","nationality":"American","category":"sports","profession":"baseball player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056b9"},"name":"Andrew Valmon","nationality":"American","category":"sports","profession":"runner","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056e9"},"name":"Andy Andrews","nationality":"American","category":"sports","profession":"tennis player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056ef"},"name":"Sammie Henson","nationality":"American","category":"sports","profession":"wrestler","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056f9"},"name":"Rodney Leinhardt","nationality":"American","category":"sports","profession":"wrestler","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056ff"},"name":"Dave Silk","nationality":"American","category":"sports","profession":"ice hockey player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e005700"},"name":"Glen Davis","nationality":"American","category":"sports","profession":"basketball player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e005708"},"name":"Grady Allen","nationality":"American","category":"sports","profession":"football player","month":"January_","date":1}]},{"nation":"Argentinian","items":[{"_id":{"$id":"51e7897d5e24cfc00e005712"},"name":"David Nalbandian","nationality":"Argentinian","category":"sports","profession":"tennis player","month":"January_","date":1}]},{"nation":"Bangladeshi","items":[{"_id":{"$id":"51e7897d5e24cfc00e005640"},"name":"Alok Kapali","nationality":"Bangladeshi","category":"sports","profession":"cricketer","month":"January_","date":1}]},{"nation":"Brazilian","items":[{"_id":{"$id":"51e7897d5e24cfc00e00561b"},"name":"Tiago Splitter","nationality":"Brazilian","category":"sports","profession":"basketball player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e005620"},"name":"Roberto Rivelino","nationality":"Brazilian","category":"sports","profession":"footballer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056df"},"name":"Shelda Bede","nationality":"Brazilian","category":"sports","profession":"volleyball player","month":"January_","date":1}]},{"nation":"British","items":[{"_id":{"$id":"51e7897d5e24cfc00e005648"},"name":"Jack Wilshere","nationality":"British","category":"sports","profession":"footballer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e00566a"},"name":"Montagu Toller","nationality":"British","category":"sports","profession":"cricketer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056ca"},"name":"Luke Rodgers","nationality":"British","category":"sports","profession":"footballer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056cb"},"name":"Morgan Fisher","nationality":"British","category":"sports","profession":"keyboard player and songwriter","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e005707"},"name":"Calum Davenport","nationality":"British","category":"sports","profession":"footballer","month":"January_","date":1}]},{"nation":"Canadian","items":[{"_id":{"$id":"51e7897d5e24cfc00e005624"},"name":"Devin Setoguchi","nationality":"Canadian","category":"sports","profession":"ice hockey player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e00567f"},"name":"Jeff Carter","nationality":"Canadian","category":"sports","profession":"ice hockey player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e005683"},"name":"Barron Miles","nationality":"Canadian","category":"sports","profession":"American- football player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e00569e"},"name":"Gilbert Brulé","nationality":"Canadian","category":"sports","profession":"ice hockey player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056d4"},"name":"Bobby Roode","nationality":"Canadian","category":"sports","profession":"wrestler","month":"January_","date":1}]},{"nation":"Chinese","items":[{"_id":{"$id":"51e7897d5e24cfc00e005677"},"name":"Li Fang","nationality":"Chinese","category":"sports","profession":"tennis player","month":"January_","date":1}]},{"nation":"Colombian","items":[{"_id":{"$id":"51e7897d5e24cfc00e005617"},"name":"Hamilton Ricard","nationality":"Colombian","category":"sports","profession":"footballer","month":"January_","date":1}]},{"nation":"Croatian","items":[{"_id":{"$id":"51e7897d5e24cfc00e005636"},"name":"Davor Šuker","nationality":"Croatian","category":"sports","profession":"footballer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056bd"},"name":"Mladen Petrić","nationality":"Croatian","category":"sports","profession":"footballer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056c8"},"name":"Dražen Ladić","nationality":"Croatian","category":"sports","profession":"footballer","month":"January_","date":1}]},{"nation":"Cypriot","items":[{"_id":{"$id":"51e7897d5e24cfc00e005632"},"name":"Giorgos Theodotou","nationality":"Cypriot","category":"sports","profession":"footballer","month":"January_","date":1}]},{"nation":"Czech","items":[{"_id":{"$id":"51e7897d5e24cfc00e00561a"},"name":"Leoš Friedl","nationality":"Czech","category":"sports","profession":"tennis player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056a4"},"name":"Bobby Holík","nationality":"Czech","category":"sports","profession":"ice hockey player","month":"January_","date":1}]},{"nation":"Dominican","items":[{"_id":{"$id":"51e7897d5e24cfc00e0056b1"},"name":"Fernando Tatís","nationality":"Dominican","category":"sports","profession":"baseball player","month":"January_","date":1}]},{"nation":"French","items":[{"_id":{"$id":"51e7897d5e24cfc00e00570c"},"name":"Lilian Thuram","nationality":"French","category":"sports","profession":"footballer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e005725"},"name":"Lionel Kieseritzky","nationality":"French","category":"sports","profession":"Russian- chess player","month":"January_","date":1}]},{"nation":"German","items":[{"_id":{"$id":"51e7897d5e24cfc00e005646"},"name":"Christian Eigler","nationality":"German","category":"sports","profession":"footballer","month":"January_","date":1}]},{"nation":"Ghanaian","items":[{"_id":{"$id":"51e7897d5e24cfc00e005673"},"name":"Daniel Kofi Agyei","nationality":"Ghanaian","category":"sports","profession":"footballer","month":"January_","date":1}]},{"nation":"Greek","items":[{"_id":{"$id":"51e7897d5e24cfc00e0056ec"},"name":"Panagiotis Giannakis","nationality":"Greek","category":"sports","profession":"basketball player and coach","month":"January_","date":1}]},{"nation":"Guatemalan","items":[{"_id":{"$id":"51e7897d5e24cfc00e0056a6"},"name":"Juan Carlos Plata","nationality":"Guatemalan","category":"sports","profession":"footballer","month":"January_","date":1}]},{"nation":"Hungarian","items":[{"_id":{"$id":"51e7897d5e24cfc00e0056ad"},"name":"Béla Balogh","nationality":"Hungarian","category":"sports","profession":"director","month":"January_","date":1}]},{"nation":"Icelandic","items":[{"_id":{"$id":"51e7897d5e24cfc00e005628"},"name":"Eyjólfur Héðinsson","nationality":"Icelandic","category":"sports","profession":"footballer and model","month":"January_","date":1}]},{"nation":"Irish","items":[{"_id":{"$id":"51e7897d5e24cfc00e0056ba"},"name":"Steven Davis","nationality":"Irish","category":"sports","profession":"footballer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056e1"},"name":"Philip Mulryne","nationality":"Irish","category":"sports","profession":"footballer","month":"January_","date":1}]},{"nation":"Italian","items":[{"_id":{"$id":"51e7897d5e24cfc00e005610"},"name":"Stefano Pastrello","nationality":"Italian","category":"sports","profession":"footballer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e005681"},"name":"Alberigo Evani","nationality":"Italian","category":"sports","profession":"footballer","month":"January_","date":1}]},{"nation":"Kazachi","items":[{"_id":{"$id":"51e7897d5e24cfc00e00566f"},"name":"Yermakhan Ibraimov","nationality":"Kazachi","category":"sports","profession":"boxer","month":"January_","date":1}]},{"nation":"Lebanese","items":[{"_id":{"$id":"51e7897d5e24cfc00e005691"},"name":"Mohammed Ghaddar","nationality":"Lebanese","category":"sports","profession":"footballer","month":"January_","date":1}]},{"nation":"Mexican","items":[{"_id":{"$id":"51e7897d5e24cfc00e0056ce"},"name":"Rayo de Jalisco , Jr","nationality":"Mexican","category":"sports","profession":"wrestler","month":"January_","date":1}]},{"nation":"N/A","items":[{"_id":{"$id":"51e7897d5e24cfc00e005656"},"name":"Sam Backo","nationality":"N/A","category":"sports","profession":"rugby player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e00569b"},"name":"Hasan Salihamidžić","nationality":"N/A","category":"sports","profession":"footballer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056a1"},"name":"Wayne Bennett","nationality":"N/A","category":"sports","profession":"rugby player and coach","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056b0"},"name":"Michael Witt","nationality":"N/A","category":"sports","profession":"rugby player","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056cf"},"name":"Ian Lister","nationality":"N/A","category":"sports","profession":"footballer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056dc"},"name":"Kin Fung","nationality":"N/A","category":"sports","profession":"footballer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056fd"},"name":"Chris Anstey","nationality":"N/A","category":"sports","profession":"basketball player","month":"January_","date":1}]},{"nation":"Nigerian","items":[{"_id":{"$id":"51e7897d5e24cfc00e005704"},"name":"Michael Olaitan","nationality":"Nigerian","category":"sports","profession":"footballer","month":"January_","date":1}]},{"nation":"Norwegian","items":[{"_id":{"$id":"51e7897d5e24cfc00e00563a"},"name":"Bengt Sæternes","nationality":"Norwegian","category":"sports","profession":"footballer","month":"January_","date":1}]},{"nation":"Peruvian","items":[{"_id":{"$id":"51e7897d5e24cfc00e00561c"},"name":"Paolo Guerrero","nationality":"Peruvian","category":"sports","profession":"footballer","month":"January_","date":1}]},{"nation":"Polish","items":[{"_id":{"$id":"51e7897d5e24cfc00e00570b"},"name":"Grzegorz Panfil","nationality":"Polish","category":"sports","profession":"tennis player","month":"January_","date":1}]},{"nation":"Russian","items":[{"_id":{"$id":"51e7897d5e24cfc00e005612"},"name":"Sergei Kiriakov","nationality":"Russian","category":"sports","profession":"footballer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e00562b"},"name":"Gennady Lyachin","nationality":"Russian","category":"sports","profession":"Captain","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056be"},"name":"Andrei Stoliarov","nationality":"Russian","category":"sports","profession":"tennis player","month":"January_","date":1}]},{"nation":"South african","items":[{"_id":{"$id":"51e7897d5e24cfc00e005618"},"name":"Buster Nupen","nationality":"South african","category":"sports","profession":"cricketer","month":"January_","date":1}]},{"nation":"South korean","items":[{"_id":{"$id":"51e7897d5e24cfc00e005634"},"name":"Park Sung-Hyun","nationality":"South korean","category":"sports","profession":"archer","month":"January_","date":1}]},{"nation":"Turkish","items":[{"_id":{"$id":"51e7897d5e24cfc00e00568a"},"name":"Abdülkadir Koçak","nationality":"Turkish","category":"sports","profession":"boxer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e0056c4"},"name":"Serkan Kurtuluş","nationality":"Turkish","category":"sports","profession":"footballer","month":"January_","date":1},{"_id":{"$id":"51e7897d5e24cfc00e005703"},"name":"Berat Çetinkaya","nationality":"Turkish","category":"sports","profession":"footballer","month":"January_","date":1}]}]}');var self = Titanium.UI.createTabGroup();

// Setup Windows
var birthWindow = Titanium.UI.createWindow({
	layout : 'vertical'
});
var deathWindow = Titanium.UI.createWindow({
	layout : 'vertical'
});
// var otherWindow = Titanium.UI.createWindow({
// layout : 'vertical'
// });

// Setup Tabs
var birthTab = Titanium.UI.createTab({
	title : ' BIRTH EVENT',
	icon : "images/ic_action_emo_laugh.png",
	window : birthWindow
});
var deathTab = Titanium.UI.createTab({
	title : ' DEATH EVENT',
	icon : "images/ic_action_emo_cry.png",
	window : deathWindow
});
// var otherTab = Titanium.UI.createTab({
// title : 'OTHERS',
// icon : "images/ic_action_emo_cool.png",
// window : otherWindow
// });

// Add Tabs
self.addTab(birthTab);
self.addTab(deathTab);
//self.addTab(otherTab);

//open tab group
self.open();

//Events when opening tab group
self.addEventListener('open', function(e) {
	var actionBar = self.getActivity().actionBar;
	if (actionBar) {
		actionBar.title = customDate;
		// set action bar title as customized todays date
	}
	// creating action bar menu items
	self.activity.onCreateOptionsMenu = function(e) {
		var menu = e.menu;
		// date picker menu item
		var dateMenuItem = menu.add({
			title : "Search Date",
			icon : "images/datepicker.png",
			showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
		});
		dateMenuItem.addEventListener("click", function(e) {
			searchBar.value = "";
			// clear search box value
			searchBar.blur();
			// blur search box
			picker.showDatePickerDialog({
				value : new Date(),
				callback : function(e) {
					if (e.cancel) {
						//Ti.API.info('User canceled dialog');
					} else {
						actionBar.title = monthNames[e.value.getMonth()] + " " + e.value.getDate();
						//set action bar title to user selected date
						// set selectedDate variable value
						if ((e.value.getMonth() + 1) > 9) {
							selectedDate = e.value.getDate() + "-" + (e.value.getMonth() + 1);

						} else {
							selectedDate = e.value.getDate() + "-0" + (e.value.getMonth() + 1);

						}
						// call to data fetching method
						getLocalData(selectedDate, collection, category);
					}
				}
			});
		});
		// entertainment menu item
		var entertainment = menu.add({
			title : "Entertainment",
			//icon : "images/choosecategory.png",
			showAsAction : Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
		});
		entertainment.addEventListener("click", function(e) {
			category = "entertainment";
			// set category global variable value
			// call to data fetching method
			getLocalData(selectedDate, collection, category);
		});
		// military menu item
		var military = menu.add({
			title : "Military",
			//icon : "images/choosecategory.png",
			showAsAction : Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
		});
		military.addEventListener("click", function(e) {
			category = "military";
			// set category global variable value
			// call to data fetching method
			getLocalData(selectedDate, collection, category);
		});
		// political menu item
		var political = menu.add({
			title : "Political",
			//icon : "images/choosecategory.png",
			showAsAction : Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
		});
		political.addEventListener("click", function(e) {
			category = "political";
			// set category global variable value
			// call to data fetching method
			getLocalData(selectedDate, collection, category);
		});
		// sports menu item
		var sports = menu.add({
			title : "Sports",
			//icon : "images/choosecategory.png",
			showAsAction : Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
		});
		sports.addEventListener("click", function(e) {
			category = "sports";
			// set category global variable value
			// call to data fetching method
			getLocalData(selectedDate, collection, category);
		});
		// economics menu item
		var economics = menu.add({
			title : "Economics",
			//icon : "images/choosecategory.png",
			showAsAction : Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
		});
		economics.addEventListener("click", function(e) {
			category = "economic";
			// set category global variable value
			// call to data fetching method
			getLocalData(selectedDate, collection, category);
		});
		// others menu item
		var others = menu.add({
			title : "Others",
			//icon : "images/choosecategory.png",
			showAsAction : Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
		});
		others.addEventListener("click", function(e) {
			category = "N/A";
			// set category global variable value
			// call to data fetching method
			getLocalData(selectedDate, collection, category);
		});

	}
});

// birth tab focussed
birthTab.addEventListener("focus", function(e) {
	// set collection global variable value
	collection = "info_birth";
	// call to data fetching method
	getLocalData(selectedDate, collection, category);
});

// death tab focussed
deathTab.addEventListener("focus", function(e) {
	// set collection global variable value
	collection = "info_death";
	// call to data fetching method
	getLocalData(selectedDate, collection, category);
});

// other tab focussed
// otherTab.addEventListener("focus", function(e) {
// collection = "";
// // set collection global variable value
// // call to data fetching method
// getDataByDate(selectedDate, collection, category);
// });

// Storing AjaxData Locally
function getLocalData(selectedDate, collection, category) {

	var keyFind = scollection.find({
		key : selectedDate + collection + category
	});
	if (keyFind.length > 0) {
		showData(JSON.parse(keyFind[0]['value'].text));
		Ti.API.info('not inside ajax');
	} else {
			Ti.API.info('inside ajax');
			getDataByDate(selectedDate, collection, category);
		
	}

	//jsonData = JSON.parse(o[0]['value'].text);
}

function showData(jsonValue) {
	//remove nocontent label
	self.remove(nocontent_label);
	self.remove(myTable);
	self.remove(actInd);
	searchBar.show();
	var tableData = [];
	//adding ajax progress indicator
	self.add(actInd);
	actInd.show();
	// if no data then show no content label
	if (jsonValue.nationality.length == 0) {
		self.add(nocontent_label);
		searchBar.hide();
	}
	for (var i = 0; i < jsonValue.nationality.length; i++) {
		var section = Titanium.UI.createTableViewSection({
			headerTitle : jsonValue.nationality[i].nation,
		});
		for (var j = 0; j < jsonValue.nationality[i].items.length; j++) {
			var row = Titanium.UI.createTableViewRow({
				filter : jsonValue.nationality[i].items[j].name, // here you will set the filter content which will be searched.
				backgroundColor : j % 2 == 0 ? '#EEE' : '#FFF'
			});
			var pic = Ti.UI.createImageView({
				image : 'http://upload.wikimedia.org/wikipedia/en/thumb/7/75/Vaali_%28poet%29.jpg/90px-Vaali_%28poet%29.jpg',
				defaultImage : 'images/6_social_person.png',
				width : 90,
				height : 90,
				left : 4,
				top : 2,
				borderRadius : 10,
				//borderColor:"#2B547E",
				borderWidth : 1
			});
			var name = Titanium.UI.createLabel({
				text : jsonValue.nationality[i].items[j].name,
				font : {
					fontFamily : 'Trebuchet MS',
					fontSize : 22,
					fontWeight : 'bold'
				},
				width : 'auto',
				textAlign : 'left',
				top : 2,
				left : 100,
				height : 32
			});

			var profession = Titanium.UI.createLabel({
				text : jsonValue.nationality[i].items[j].profession,
				font : {
					fontFamily : 'Trebuchet MS',
					fontSize : 16,
				},
				width : 150,
				textAlign : 'left',
				top : 35,
				left : 100,
				height : 40
			});
			var dob = Titanium.UI.createLabel({
				text : '11 June 1990',
				font : {
					fontSize : 16,
				},
				width : 120,
				textAlign : 'left',
				top : 35,
				bottom : 0,
				left : 250,
				height : 40
			});
			var fbShare = Ti.UI.createImageView({
				image : 'images/facebook-32.png',
				width : 32,
				height : 32,
				left : 380,
				top : 35
			});
			fbShare.addEventListener('click', function(e) {
				clickedPicLink = e.source.parent.children[0].image;
				clickedName = e.source.parent.children[1].text;
				clickedDOB = e.source.parent.children[3].text;
				clickedWikiLink = e.source.parent.children[5].lnk;
				professoinDetails = e.source.parent.children[2].text;
				// call to facebook authorize method
				fb_share(clickedName, clickedDOB, clickedWikiLink, clickedPicLink, professoinDetails);
			});
			var link = "http://www.wikipedia.org/amith";
			var wikiLnk = Ti.UI.createImageView({
				lnk : link,
				image : 'images/Wikipedia-icon.png',
				width : 32,
				height : 32,
				left : 420,
				top : 35
			});
			wikiLnk.addEventListener('click', function(e) {
				Titanium.Platform.openURL(link);
			});
			row.add(pic);
			row.add(name);
			row.add(profession);
			row.add(dob);
			row.add(fbShare);
			row.add(wikiLnk);
			row.className = 'coutry_row';
			section.add(row);
		}
		tableData.push(section);
	}
	myTable.setData(tableData);
	self.add(myTable);
	actInd.hide();
}

// data fetching method
function getDataByDate(selectedDate, collection, category) {

	//remove nocontent label
	self.remove(nocontent_label);
	self.remove(myTable);
	self.remove(actInd);
	searchBar.show();
	var tableData = [];
	//adding ajax progress indicator
	self.add(actInd);
	actInd.show();
	// ajax
	var xhr = Ti.Network.createHTTPClient({
		onload : function(e) {
			// success!  json is an object of the returned JSON data
			Ti.API.info('success, HTTP status = ' + this.status);
			jsonData = JSON.parse(this.responseData);
			showData(jsonData);
			scollection.save({
				key : selectedDate + collection + category,
				value : this.responseData
			});
			scollection.commit();
			actInd.hide();
		},
		onerror : function(e) {
			Ti.API.info('error, HTTP status = ' + this.status);
			alert("Sorry...we lost connectivity..Please connect to internet");
		},
		timeout : 5000 /* in milliseconds */
	});
	xhr.open("GET", 'http://todayinhistory.ap01.aws.af.cm/getdata/index.php?category=' + category + '&collection=' + collection + '&day=' + selectedDate);
	xhr.send();
	// request is actually sent with this statement
}

// clear search bar value when cancelled
searchBar.addEventListener('cancel', function(e) {
	searchBar.value = "";
});

//method to authorize facebook login
function fb_share(name, dob, wikilnk, piclink, professiondet) {
	if (collection == "info_birth") {
		eventText = "Birthday of";
		eventDesctext = "born on";
	} else {
		eventText = "Demise of";
		eventDesctext = "passed away on";
	}
	if (fb.loggedIn) {
		var data = {
			link : wikilnk,
			name : dob + " - " + eventText + " " + name,
			message : eventText + " - " + name,
			caption : "Wikipedia link of " + name,
			picture : piclink,
			description : name + " is a " + professiondet + " ," + eventDesctext + " " + dob + ".This is information is from www.wats2day.com. To get daily updates on your android mobile download Whats Today app from play store. ",
		};
		fb.requestWithGraphPath('me/feed?access_token=' + fb.accessToken, data, 'POST', showRequestResult);
	} else {
		fb.forceDialogAuth = true;
		fb.addEventListener('login', function(e) {
			if (e.success) {
				var data = {
					link : wikilnk,
					name : dob + " - " + eventText + " " + name,
					message : eventText + " - " + name,
					caption : "Wikipedia link of " + name,
					picture : piclink,
					description : name + " is a " + professiondet + " ," + eventDesctext + " " + dob + ".This is information is from www.whats2day.com. To get daily updates on your android mobile download Whats Today app from play store. ",
				};
				fb.requestWithGraphPath('me/feed?access_token=' + fb.accessToken, data, 'POST', showRequestResult);
			}
			if (e.error) {
				Ti.API.info('login error' + e.error);
			}
		});
		fb.authorize();
	}

}

// method to show facebook wall post status
function showRequestResult(e) {
	var s = '';
	if (e.success) {
		s = 'Event Shared on your Facebook Wall..!!';

	} else if (e.error) {
		s = 'Something Went Wrong. We will come back soon';
	}
	alert(s);
}

if (Ti.Android.isServiceRunning(Ti.Android.createServiceIntent({url: 'EventNotificatoinService.js'}))) {
		Ti.API.info('Service IS running');
	} else {
		Ti.API.info('Service is NOT running');
		Ti.API.info('Starting via startService');
	var intent = Ti.Android.createServiceIntent({
		url: 'EventNotificatoinService.js'
	});
	intent.putExtra('interval',  1000);
	intent.putExtra('message', 'Hi from started service');
	Ti.Android.startService(intent);
	}
//Import our module into our Titanium App
// var alarmModule = require('bencoding.alarmmanager');
// var alarmManager = alarmModule.createAlarmManager();
// //Below is an example on how you can provide a full date to schedule your alarm
// //Set an Alarm to publish a notification in about two minutes and repeat each minute
// //Create a date variable to be used later 
// var now = new Date();
// Ti.API.info(''+now.getTime());
// 
// alarmManager.addAlarmNotification({		
		// requestCode: 64, //Request ID used to identify a specific alarm. Provide the same requestCode twice to update 
		// // year: now.getFullYear(),
		// // month: now.getMonth(),
		// // day: now.getDate(),
		// hour: "08",
		// minute: "00" , //Set the number of minutes until the alarm should go off
		// contentTitle:'Alarm #4', //Set the title of the Notification that will appear
		// contentText:'Alarm & Notify Scheduled Repeat', //Set the body of the notification that will apear
		// icon: Ti.App.Android.R.drawable.appicon,
		// tickerText: 'Whats Today Event Notification!',
		// repeat:'daily' //You can use the words hourly,daily,weekly,monthly,yearly or you can provide milliseconds.
	// });	
   