/*
 Created by Christopher Sefcik, 7/18/2019

 Thank you for your consideration!

 Code begins by getting the json file from the referenced URL. 
 The program treats jsonRequest.onLoad() as the 'Main()' function for setting up the page. 
*/

//GET JSON DATA
var jsonRequestURL = "https://raw.githubusercontent.com/czechmate48/CBHT-Coding-Challenge/master/seed_data.json"; //The URL of the json file
var jsonRequest = new XMLHttpRequest();
jsonRequest.open("GET", jsonRequestURL); //Create a new 'GET' request
jsonRequest.responseType = "json"; //Set the request to be for a 'json' format
jsonRequest.send(); //Send the request

 jsonRequest.onload = function() { //Wait for the response to return before loading data into variable
 	
 	//Store the data in separate variables 
 	var userData = jsonRequest.response.users; //User data
 	var scoreData = jsonRequest.response.scores; //Score data

 	//Combine data into unified object
 	var combinedData = combineJsonData(userData, scoreData);
 	combinedData = addAverageScoreProperty(combinedData);

 	//Create the default table
 	createDefaultTable(combinedData);

 	//Add button listeners
 	addButtonListeners(combinedData);

 }

 /********************************************************************************
 DATA SET COMBINATION FUNCTIONS	
 ********************************************************************************/
 function combineJsonData(userData, scoreData){
 	
 	/*	This function takes in both the userData and scoreData objects and combines
 		them one data object called 'combinedJsonData'. This complete data object is then
 		returned. The funtion is in two steps:

 		1) Load userData into combinedJsonData without any changes
 		2) Load scoreData into combinedJsonData by adding a new property corresponding to each score (score 1, score 2, etc...)
 	*/

	//1) Load userData into combinedJsonData
 	var combinedJsonData = [];

 	for (var i = 0; i<userData.length; i++){
 		combinedJsonData[i] = new Object();
 		Object.assign(combinedJsonData[i], userData[i]);
 	}

 	//2) Load scoreData into combinedJsonData
 	for (var i = 0; i<scoreData.length; i++){ //iterate through the array

 		switch (scoreData[i].user_id){ //Use the scoreData's 'user_id' to it's corresponding 'id' match in the combinedJsonData

 			//A new property is added each time a new score is added. This property is created in the addNewScoreProperty function()
 			case 1: combinedJsonData[0][createScorePropertyName(combinedJsonData[0])] = scoreData[i].score; break;
 			case 2: combinedJsonData[1][createScorePropertyName(combinedJsonData[1])] = scoreData[i].score; break;
 			case 3: combinedJsonData[2][createScorePropertyName(combinedJsonData[2])] = scoreData[i].score; break;
 			case 4: combinedJsonData[3][createScorePropertyName(combinedJsonData[3])] = scoreData[i].score; break;
 			case 5: combinedJsonData[4][createScorePropertyName(combinedJsonData[4])] = scoreData[i].score; break;
 			case 6: combinedJsonData[5][createScorePropertyName(combinedJsonData[5])] = scoreData[i].score; break;
 			case 7: combinedJsonData[6][createScorePropertyName(combinedJsonData[6])] = scoreData[i].score; break;
 			case 8: combinedJsonData[7][createScorePropertyName(combinedJsonData[7])] = scoreData[i].score; break;
 			case 9: combinedJsonData[8][createScorePropertyName(combinedJsonData[8])] = scoreData[i].score; break;
 			case 10: combinedJsonData[9][createScorePropertyName(combinedJsonData[9])] = scoreData[i].score; break;

 		}
 	}

 	return combinedJsonData;

 }

 function createScorePropertyName(object){

 	/* Find the current iteration by taking the total number of properties in the object and subtracting three (to make the score count start at 1 -> score 1)
 	   Place a string 'score' in front of the current iteration
 	   Concatenate the two strings to form the property name
 	   Return the new score property name
 	*/

 	var propertyIteration = Object.keys(object).length - 3;
 	var propertyScore = "score ";
 	return propertyScore.concat(propertyIteration);
 }

 /********************************************************************************
 AVERAGE SCORE PROPERTY FUNCTIONS
 ********************************************************************************/

  function addAverageScoreProperty(combinedData){
  	/* 	Adds a new property to each combinedData object, Average_score. Works by:
  		1) Create array to hold all properties from each combinedData object
  		2) Determine which properties start with "score"
  		3) Add properties that start with "score" to an array called "scores"
  		4) Get an average score based on totalScore/scores.length
  		5) Add new property 'Average_Score' to the combinedData object and set float length to 2 decimals
  		6) Return new combinedData object
  	*/

  	for (var i = 0; i<combinedData.length; i++){

  		var properties = Object.keys(combinedData[i]); //Get all of the properties from each data object
  		var scores = []; //Will hold all of the scores
  		
  		for (var j = 0; j<properties.length; j++){
  			if (properties[j].substr(0, 5) === "score"){
  				scores.push(combinedData[i][properties[j]]);
  			}
  		}

  		var totalScore = 0;

  		for (var k = 0; k<scores.length; k++){
  			totalScore+=scores[k];
  		}

  		combinedData[i].Average_Score = (totalScore/scores.length).toFixed(2);

  	}

  	return combinedData;
 }

/********************************************************************************
 DATA SET MANIPULATION FUNCTIONS
 ********************************************************************************/

 function sort(combinedData, propertyName, direction){

 	/*  This function takes in a data set (combinedData) as an array, a property Name, and a direction. The data set
		is sorted in ascending or descending order based on the 'direction' value (either "ascending" or "descending").
		The function returns a new, sorted data set.

 		1) Sort propertyArray based on the 'direction' using the 'insertion sort' algorithm
 	*/

 	//1) Sort the 'propertyArray' using 'insertion sort'
	for (var i = 1; i < combinedData.length; i++){

		var tmpData = combinedData[i];
		var key = combinedData[i][propertyName];
		var j = i - 1;

		if (direction.toLowerCase() == "ascending"){ //Determine whether the ascii value is greater than previous term

			while (j >= 0 && combinedData[j][propertyName] > key){
				combinedData[j+1] = combinedData[j];
				j--;
			}

		} else if (direction.toLowerCase() == "descending"){ //Determine whether the ascii value is less than previous term
			while (j >= 0 && combinedData[j][propertyName] < key){
				combinedData[j+1] = combinedData[j];
				j--;
			}
		}

		combinedData[j+1] = tmpData;
	}

	return combinedData;

}

function removePropertiesByKey(originalData, propertyName){

	/* 	This function can be used to remove any property in the data set. The 'propertyName' can either be a full
		name, such as 'user', or a parial name, such as 'use' or 'u'. The algorithm will detect which properties in the 
		'originalData' start with the 'propertyName' and remove them. It returns a new data set called 'alteredData'
		
		1) 	Loop through originalData & get all 'propertyKeys' in original data
		2)	Loop through these 'propertyKeys' and if they don't match the passed in 'propertyName', load them into 'alteredData'
		3)	return 'alteredData'
	*/

	propertyName = propertyName.toString();
	var alteredData = []; //Will hold the new set of data

	//1) Loop through originalData, get 'propertyKeys'
	for (var i = 0; i<originalData.length; i++){

		alteredData[i] = new Object();
  		var propertyKeys = Object.keys(originalData[i]); //Get all of the properties from each data object

  		//2) Loop through 'propertyKeys', load matches into 'propertiesToRemove'
  		for (var j = 0; j<propertyKeys.length; j++){

  			propertyKeys[j] = propertyKeys[j].toString();

  			if (propertyKeys[j].substr(0, propertyName.length) != propertyName){
  				alteredData[i][propertyKeys[j]] = originalData[i][propertyKeys[j]];
  			}
  		}
  	}

  	//3) Return alteredData
  	return alteredData;
}

function removeObjectsByValue(originalData, propertyValue){

	/*	WARNING: 	If an object has more than one property that holds the same
					value and you are trying to target objects with a specific [key, value] pair, this function might result in unintended behavior. You need to 
					create a function that allows for [key, value] pair removal. 
	*/

	/* This funciton can be used ot remove all Objects that hold a certain value. For example, if you want to remove an object from the 
		'originalData' that contains a value of 'false', this function will accomplish the task. 

		1) Loop through the 'originalData' 'propertyValues' and compare to the 'propertyValue' passed into the function
		2) If there is not a match, load the object into the 'alteredData' array
		3) If there is a match, remove the object from the originalData and continue to check remaining objects
		4) Return an 'alteredData' set with only the remaining objects
	*/

	propertyValue = propertyValue.toString(); //Convert to a string to avoid typeError issues
	var alteredData = []; //Will hold the new set of data


	//1) Loop through 'propertyValues'
	for (var i = 0; i<originalData.length; i++){

		alteredData[i] = new Object();
		var propertyKeys = Object.keys(originalData[i]);
  		var propertyValues = Object.values(originalData[i]); //Get all of the properties from each data object
  		var propertyMatches = false;

  		for (var j = 0; j<propertyValues.length; j++){

  			propertyValues[j] = propertyValues[j].toString(); //Convert to a string to avoid typeError issues
  			if (propertyValues[j].substr(0, propertyValue.length) == propertyValue){
  				propertyMatches = true;
  				break;
  			}
  		}

  		//2) No match - add to 'alteredData'
  		if (propertyMatches === false){
  			alteredData[i] = originalData[i];
  		}

  		//3) Match - remove from 'orignialData'
  		else {
  			originalData.splice(i--, 1);
  		}
  	}

  	alteredData.pop(alteredData.length);	//FIXME - 	For some reason getting an extra blank value at the end. This is a quick solution, but might cause 
  											//			unintended bugs. Likely a problem with the loop iteration. I think this is causing an unintended bug
  											//			where one of the data Objects doesn't load after and unknown pattern of user interaction with the table. 

  	//4) Return alteredData
  	return alteredData;
}

/********************************************************************************
 TABLE FUNCTIONS
 ********************************************************************************/

function createDefaultTable(combinedData){

	/* This function creates a default view of the table. It is the first table loaded on instantiation. It alters the data to remove
		the extra "score" categories as well as user marked 'active = false.'

		1) Get the table using DOM
		2) Remove any properties with key = "score..."
		3) Remove any objects with 'active = false'
		4) Create table headers
		5) Create table rows
	*/

	//1) Get table using DOM
	var table = document.getElementsByTagName("table")[0]; //Get the first, and only, table
	//2) Remove any properties with key = "score..."
	var alteredTableData = removePropertiesByKey(combinedData, "score"); //remove the score property
	//3) Remove any objects with 'active = false'
	var finalTableData = removeObjectsByValue(alteredTableData, false); //remove all the properties with the value of false

	//4) Create table headers - *listeners are added in 'addListenerCell' function*
	for (var i = 0; i<finalTableData.length; i++){
		if (i == 0) {
			var propertyNames = Object.keys(finalTableData[i]);
			addHeader(table, propertyNames, true, finalTableData, "ascending", "default"); //Data is originally arranged in the 'original' order 
			addRow(table, Object.values(finalTableData[i]));
			continue;
		}

		//5) Create table Rows
		addRow(table, Object.values(finalTableData[i]));
		
	}
}

function updateDefaultTable(sortedData, dataOrder){

	/* This function updates the default view of the table. It deletes the current headers and rows and rebuilds the table using the new, sorted
		data set.

		1) Get the table, table rows, and table headers using DOM
		2) Delete table headers and rows
		3) Create table headers
		4) Create table rows
	*/

    //1)Get the table, rows, and headers
    deleteCurrentTable();
	var table = document.getElementsByTagName("table")[0]; //Get the first, and only, table

	//3) Create new table headers
	for (var i = 0; i<sortedData.length; i++){
		if (i == 0) {
			var propertyNames = Object.keys(sortedData[i]);
			addHeader(table, propertyNames, true, sortedData, dataOrder, "default"); //Data is originally arranged in the 'original' order 
			addRow(table, Object.values(sortedData[i]));
			continue;
		}

		//4) Create new table rows
		addRow(table, Object.values(sortedData[i]));
	}
}

function updateExtendedTable(combinedData, dataOrder) {

	/* 	Use this function to update the Extended Table. The function takes in a set of data as well as a 'data order' (original, ascending, or descending).
		It identifies which data object is the largest and uses the property names (keys) to determine how many columns are needed. It then creates an 
		extended table view
	*/

	deleteCurrentTable();
	var table = document.getElementsByTagName("table")[0]; //Get the first, and only, table
	var largestDataObject; //Find out which data object holds the most properties. This object will be used to create the headers

	for (var i = 1; i<combinedData.length; i++){

		if (i == 1){
			if (Object.keys(combinedData[i-1]).length > Object.keys(combinedData[i]).length){
				largestDataObject = combinedData[i-1];
			}
			else {
				largestDataObject = combinedData[i];
			}
		}

		if (Object.keys(combinedData[i]).length > Object.keys(largestDataObject).length){
			largestDataObject = combinedData[i];
		}
	}

	for (var i = 0; i<combinedData.length; i++){
		if (i == 0) {
			var propertyNames = Object.keys(largestDataObject);
			addHeader(table, propertyNames, true, combinedData, dataOrder, "extended"); //Data is originally arranged in the 'original' order 
			addExtendedRow(table, Object.values(combinedData[i]), Object.keys(combinedData[i]), Object.keys(largestDataObject));
			continue;
		}

		addExtendedRow(table, Object.values(combinedData[i]), Object.keys(combinedData[i]), Object.keys(largestDataObject));
		
	}
}

function deleteCurrentTable(){

	/* Use this function to delete the current table from the screen. Works with either view (extended or default)
	*/

	var table = document.getElementsByTagName("table")[0]; //Get the first, and only, table
	var tableRows = document.getElementsByTagName("tr");
	var tableHeader = document.getElementsByTagName("tHead")[0];

	//2) Delete the table headers and rows
	table.deleteTHead(0);

	var rowLength = tableRows.length;

	for (var i = 0; i<rowLength; i++){
		table.deleteRow(0);
	}

}

function addHeader(table, values, sortListener, dataSet, dataOrder, tableView){
	/* 	table = Table referenced in the DOM
		values = Property keys 
		sortListener = Used to determine if this function should have listeners for sorting functionality (boolean value)
		dataSet = Set of data to use to create the headers
		dataOrder = Whether the data is in "original" sorting, "ascending" sorting, or "descending" sorting
		tableView = The current view (default or extended)
	*/

	var tableHeader = document.createElement("tHead");
	var tableRow = document.createElement("tr");

	for (var i = 0; i < values.length; i++) {
		if (sortListener){
			addListenerCell(tableRow, values[i], dataSet, dataOrder, tableView);
		}
		else {
			addCell(tableRow, value[i]);
		}
	}

	tableHeader.appendChild(tableRow);
	table.appendChild(tableHeader);
	
}

function addRow(table, values){

	var tableRow = document.createElement("tr");

	for (var i = 0; i<values.length; i++){
		addCell(tableRow, values[i]); //Send in false by default because no listeners are added to an individual row
	}

	table.appendChild(tableRow);
	
}

function addExtendedRow(table, values, keys, possibleColumns){
	/* Used to build the rows for the extended view.
	*/

	var tmpValues = []; //Used to store "null" values in the columns that have no values
	var tableRow = document.createElement("tr");

	for (var i = 0; i<possibleColumns.length; i++){

		var match = false;

		for (var j = 0; j<keys.length; j++){
			if (possibleColumns[i] == keys[j]){
				tmpValues.push(values[j]);
				match = true;
			}
		}

		if (match == false){ //If there is no match, load a 'null' placeholder
			tmpValues.push("-");
		}
	}

	for (var i = 0; i<tmpValues.length; i++){
		addCell(tableRow, tmpValues[i]); //Send in false by default because no listeners are added to an individual row
	}

	table.appendChild(tableRow);

}

function addCell(tableRow, value){
	var tableData = document.createElement("td");
	tableData.innerHTML = value;
	tableRow.appendChild(tableData);
	
}

function addListenerCell(tableRow, value, dataSet, dataOrder, tableView){
	/* Use this function to add listeners to the headers that will be used for sorting
	*/

	var tableData = document.createElement("td");

	//Used for styling headers
	switch (value){
		case "id": tableData.innerHTML = "ID"; break;
		case "name": tableData.innerHTML =  "Name"; break;
		case "created_at": tableData.innerHTML = "Created"; break;
		case "active": tableData.innerHTML =  "Active"; break;
		case "Average_Score": tableData.innerHTML =  "Average Score"; break;
		default: tableData.innerHTML = value; break;
	}
	
	tableData.addEventListener("click", function(){

		var sortedData;

		if (dataOrder == "original"){
			sortedData = sort (dataSet, value, "ascending");
			dataOrder = "ascending"
		}
		else if (dataOrder == "ascending"){
			sortedData = sort (dataSet, value, "descending");
			dataOrder = "descending"
		}
		else if (dataOrder == "descending"){
			sortedData = sort (dataSet, value, "ascending");
			dataOrder = "ascending";
		}

		if (tableView == "default"){
			updateDefaultTable(sortedData, dataOrder);
		}
		else if (tableView == "extended"){
			updateExtendedTable(sortedData, dataOrder);
		}
	
	});

	tableRow.appendChild(tableData);
}

function addButtonListeners(combinedData){

	//This method adds listeners and functionality to the buttons. 

	var defaultViewBtn = document.getElementsByTagName("button")[0]; //The default button
	var extendedViewBtn = document.getElementsByTagName("button")[1]; //The extended view

	defaultViewBtn.addEventListener("click", function(){
		deleteCurrentTable(); //Make sure to delete the current table
		createDefaultTable(combinedData, "ascending");
	});

	extendedViewBtn.addEventListener("click", function(){
		updateExtendedTable(combinedData, "ascending");
	});


}



