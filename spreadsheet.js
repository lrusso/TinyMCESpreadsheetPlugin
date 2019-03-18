tinymce.PluginManager.add("spreadsheet", function(editor, url)
	{
	var toolbarIcon;
	var STRING_MENU = "";
	var STRING_TITLE = "";
	var STRING_DECIMALS = "";
	var STRING_THOUSANDS = "";
	var STRING_ERROR = "";

	if (editor.settings.language=="es")
		{
		STRING_MENU = "F\u00F3rmula";
		STRING_TITLE = "Insertar/editar f\u00F3rmula";
		STRING_DECIMALS = "Mostrar decimales";
		STRING_THOUSANDS = "Separador de miles";
		STRING_ERROR = "ERROR: Debe estar posicionado dentro de una tabla.";
		}
		else
		{
		STRING_MENU = "Formula";
		STRING_TITLE = "Insert/edit formula";
		STRING_DECIMALS = "Show decimals";
		STRING_THOUSANDS = "Thousands separator";
		STRING_ERROR = "ERROR: You must be located inside a table.";
		}

	function updateField(inputtedCalc,parentElement,initialClass,decimalsUsed,thousandsSeparatorValue,setDirty)
		{
		var tableAsArray = tableToArray(parentElement.offsetParent);
		var inputtedCalcTemp = inputtedCalc;
		var thousandsSeparator = "0";
		if (thousandsSeparatorValue==true)
			{
			thousandsSeparator="1";
			}

		inputtedCalcTemp = replaceRangeCellsReferences(inputtedCalcTemp,tableAsArray,initialClass);
		inputtedCalcTemp = replaceSingleCellsReferences(inputtedCalcTemp,tableAsArray,initialClass);

		if (inputtedCalcTemp!="")
			{
			try
				{
				if (inputtedCalcTemp.toLowerCase().indexOf("alert(")==-1 && inputtedCalcTemp.toLowerCase().indexOf("document.")==-1 && inputtedCalcTemp.toLowerCase().indexOf("window.")==-1)
					{
					var result = eval(inputtedCalcTemp);

					if (typeof result === "undefined")
						{
						updateCell("Error", decimalsUsed + "" +  thousandsSeparator + encodeURIComponent(inputtedCalc),parentElement,setDirty);
						}
						else
						{
						result = String(result);

						var pattern = /[0-9-]*[{0,1}[\d]*[\.]{0,1}[\d]+/gm;
						var match = pattern.exec(result);
						var resultNumber = match[0];
						var resultNumberFinal = parseFloat(resultNumber).toFixed(decimalsUsed);

						if (isNaN(resultNumberFinal)===false)
							{
							if (thousandsSeparator=="1")
								{
								resultNumberFinal = formatNumber(resultNumberFinal);
								}
							result = replaceAll(result,resultNumber,resultNumberFinal);

							updateCell(result, decimalsUsed + "" +  thousandsSeparator + encodeURIComponent(inputtedCalc),parentElement,setDirty);
							}
							else
							{
							updateCell("Error", decimalsUsed + "" +  thousandsSeparator + encodeURIComponent(inputtedCalc),parentElement,setDirty);
							}
						}
					}
					else
					{
					updateCell("Error", decimalsUsed + "" +  thousandsSeparator + encodeURIComponent(inputtedCalc),parentElement,setDirty);
					}
				}
				catch(err)
				{
				updateCell("Error", decimalsUsed + "" +  thousandsSeparator + encodeURIComponent(inputtedCalc),parentElement,setDirty);
				}
			}
			else
			{
			if (initialClass.substring(0,18)=="spreadsheetTinyMCE")
				{
				tinymce.activeEditor.dom.removeClass(parentElement, initialClass);
				if (setDirty==true)
					{
					editor.insertContent("");
					}
				}
			}
		}

	function tableToArray(a)
		{
		var tableEl = a;
		var cells2D = [];
		var rows = tableEl.rows;
		var rowsLength = rows.length;

		for (var r = 0; r < rowsLength; ++r)
			{
			cells2D[r] = [];
			}

		for (var r = 0; r < rowsLength; ++r)
			{
			var cells = rows[r].cells;
			var x = 0;

			for (var c = 0, cellsLength = cells.length; c < cellsLength; ++c)
				{
				var cell = cells[c];
				while (cells2D[r][x])
					{
					++x;
					}

				var x3 = x + (cell.colSpan || 1);
				var y3 = r + (cell.rowSpan || 1);

				for (var y2 = r; y2 < y3; ++y2)
					{
					for (var x2 = x; x2 < x3; ++x2)
						{
						cells2D[y2][x2] = cell;
						}
					}
				x = x3;
				}
			}

		return cells2D;
		}

	function getColumnNumber(val)
		{
		var base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", i, j, result = 0;
		for (i = 0, j = val.length - 1; i < val.length; i += 1, j -= 1)
			{
			result += Math.pow(base.length, j) * (base.indexOf(val[i]) + 1);
			}
		return result;
		}

	function replaceAll(str, find, replace)
		{
		return str.replace(new RegExp(find, "g"), replace);
		}

	function formatNumber (num)
		{
		var str = num.toString().split(".");
		if (str[0].length >= 3)
			{
			str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
			}
		return str.join(".");
		}

	function replaceRangeCellsReferences(inputtedCalcTemp,tableAsArray,initialClass)
		{
		var pattern = /[A-Z]{1}.:[A-Z]{1}\d+/gm;
		var match;
		while (match = pattern.exec(inputtedCalcTemp))
			{
			try
				{
				var location = match[0];
				var pattern2 = /[A-Z]{1}\d+/gm;
				var match2;

				var rangeFrom = null;
				var rangeTo = null;
				var columnStart = null;
				var columnEnd = null;
				var rowStart = null;
				var rowEnd = null;

				while (match2 = pattern2.exec(location))
					{
					if (rangeFrom==null)
						{
						rangeFrom= match2[0];
						}
					else if (rangeTo==null)
						{
						rangeTo = match2[0];
						}
					}

				var pattern3 = /([a-zA-Z]*)([0-9]*)/;
				var match3 = pattern3.exec(rangeFrom);
				columnStart = getColumnNumber(match3[1]) - 1;
				rowStart = match3[2] - 1;

				var match4 = pattern3.exec(rangeTo);
				columnEnd = getColumnNumber(match4[1]) - 1;
				rowEnd = match4[2] - 1;

				if (columnStart>columnEnd)
					{
					inputtedCalcTemp = replaceAll(inputtedCalcTemp,location,"Error");
					}
					else
					{
					var finalResult = 0;
					for (var i = rowStart; i <= rowEnd; i++)
						{
						for (var j = columnStart; j <= columnEnd; j++)
							{
							var cellValue = getCellValue(tableAsArray,i,j,initialClass);
							if (cellValue=="Error")
								{
								finalResult = "Error";
								}
								else
								{
								finalResult = finalResult + "+" + cellValue;
								}
							}
						}
					finalResult = eval(finalResult);
					inputtedCalcTemp = replaceAll(inputtedCalcTemp,location,finalResult);
					}

				return inputtedCalcTemp;
				}
				catch(err)
				{
				}
			}
		return inputtedCalcTemp;
		}

	function replaceSingleCellsReferences(inputtedCalcTemp,tableAsArray,initialClass)
		{
		var pattern = /[A-Z]{1}\d+/gm;
		var match;
		while (match = pattern.exec(inputtedCalcTemp))
			{
			try
				{
				var location = match[0];
				var pattern2 = /([a-zA-Z]*)([0-9]*)/;
				var match2 = pattern2.exec(location);
				var column = getColumnNumber(match2[1]) - 1;
				var row = match2[2] - 1;

				var cellValue = getCellValue(tableAsArray,row,column,initialClass);
				if (cellValue=="Error")
					{
					inputtedCalcTemp = "Error";
					}
					else
					{
					inputtedCalcTemp = replaceAll(inputtedCalcTemp,location,cellValue);
					}
				}
				catch(err)
				{
				}
			}
		return inputtedCalcTemp;
		}

	function updateCell(value, className,parentElement,setDirty)
		{
		parentElement.className = "spreadsheetTinyMCE" + className;

		var latestChildNode = parentElement;
		while (latestChildNode.firstChild!=null){latestChildNode = latestChildNode.firstChild;}
		if (latestChildNode.nodeName=="BR"){latestChildNode = parentElement;}
		try{latestChildNode.innerHTML = value;}catch(err){}
		try{latestChildNode.textContent = value;}catch(err){}

		if (setDirty==true)
			{
			editor.insertContent("");
			}
		}

	function getCellValue(tableAsArray,row,column,initialClass)
		{
		var cellObject = tableAsArray[row][column];
		var cellClass = cellObject.className;
		var cellValue = cellObject.textContent;
		if (cellClass===initialClass)
			{
			return "Error";
			}
			else
			{
			var pattern = /[0-9-]*[{0,1}[\d]*[\.]{0,1}[\d]+/gm;
			var match;
			var counter = 0;

			var cellValueNumber = "0";
			while (match = pattern.exec(cellValue))
				{
				counter = counter +1;
				if (counter==1)
					{
					if (match[0]!=null)
						{
						cellValueNumber = match[0];
						cellValueNumber = replaceAll(cellValueNumber,",","");
						cellValueNumber = parseFloat(cellValueNumber).toFixed(2);
						}
					}
				}
			cellValueNumber = "(" + cellValueNumber + ")";

			if (counter==1 || cellValue=="")
				{
				return cellValueNumber;
				}
			}

		return "Error";
		}

	function updateTable(revalidate)
		{
		var toolbarBarIconActive = false;

		try
			{
			var elementStoredNode = editor.selection.getNode();
			var elementStoredNodeOffsetParent = editor.selection.getNode().offsetParent;
			if (elementStoredNode.nodeName=="TD")
				{
				if (elementStoredNode.className.substring(0,18)=="spreadsheetTinyMCE")
					{
					toolbarBarIconActive = true;
					}
				if (revalidate==true && editor.selection.getContent().length==0)
					{
					getTextNodesValues(editor, getTextNodesValues(editor,elementStoredNode.offsetParent));
					}
				}
			else if(elementStoredNodeOffsetParent!=null)
				{
				if (elementStoredNodeOffsetParent.nodeName=="TD")
					{
					if (elementStoredNodeOffsetParent.className.substring(0,18)=="spreadsheetTinyMCE")
						{
						toolbarBarIconActive = true;
						}
					if (revalidate==true && editor.selection.getContent().length==0)
						{
						getTextNodesValues(editor, getTextNodesValues(editor,elementStoredNodeOffsetParent.offsetParent));
						}
					}
				}
			}
			catch(err)
			{
			}

		if (toolbarBarIconActive==true)
			{
			toolbarIcon.active(true);
			}
			else
			{
			toolbarIcon.active(false);
			}
		}

	function getTextNodesValues(tinymce,node)
		{
		if (typeof node != "undefined")
			{
			for (var i = 0; i < node.childNodes.length; i++)
				{
				if (node.className.substring(0,18)=="spreadsheetTinyMCE")
					{
					var elementStoredClassName = node.className;
					var tempValue = decodeURIComponent(elementStoredClassName);
					var decimalsUsed = getDecimalsUsed(tempValue,"2");
					var thousandsSeparator = getThousandsSeparator(tempValue);
					var defaultCalc = tempValue.substring(20,tempValue.length);

					updateField(defaultCalc,node,elementStoredClassName,decimalsUsed,thousandsSeparator,false);
					}

				var el = node.childNodes[i];
				if (el.childNodes.length > 0)
					{
					getTextNodesValues(tinymce,el);
					}
				}
			}
		}

	function getDecimalsUsed(inputted,defaultValue)
		{
		var tempDecimals = inputted.substring(18,19);
		if (isNumber(tempDecimals))
			{
			return tempDecimals;
			}
		return defaultValue;
		}

	function getThousandsSeparator(inputted)
		{
		var tempSeparator = inputted.substring(19,20);
		if (isNumber(tempSeparator) && tempSeparator=="1")
			{
			return true;
			}
		return false;
		}

	function isNumber(input)
		{
		for(var i = 0; i < input.length; i++)
			{
			var character = input.charAt(i);
			if (character!="0" && character!="1" && character!="2" && character!="3" && character!="4" && character!="5" && character!="6" && character!="7" && character!="8" && character!="9" && character!="-" && character!=".")
				{
				return false;
				}
			}
		return true;
		}

	function createDialog()
		{
		var elementStoredNode = editor.selection.getNode();
		var elementStoredNodeOffsetParent = editor.selection.getNode().offsetParent;
		var elementStoredClassName = "";
		var elementStoredNodeName = elementStoredNode.nodeName;
		var decimalsUsed = "2";
		var thousandsSeparator = false;

		var tableLocated = false;

		if (elementStoredNodeName=="TD")
			{
			tableLocated = true;
			elementStoredClassName = elementStoredNode.className;
			}
		else if(elementStoredNodeOffsetParent!=null)
			{
			if (elementStoredNodeOffsetParent.nodeName=="TD")
				{
				tableLocated = true;
				elementStoredClassName = elementStoredNodeOffsetParent.className;
				}
			}

		if (tableLocated==true)
			{
			var defaultCalc = "";

			if (elementStoredClassName!=null)
				{
				try
					{
					if (elementStoredClassName.substring(0,18)=="spreadsheetTinyMCE")
						{
						var tempValue = decodeURIComponent(elementStoredClassName);
						var decimalsUsed = getDecimalsUsed(tempValue,"2");
						var thousandsSeparator = getThousandsSeparator(tempValue);

						defaultCalc = tempValue.substring(20,tempValue.length);
						}
					}
					catch(err)
					{
					}
				}

			editor.windowManager.open(
				{
				title: STRING_TITLE,
				body:
					{
					type: "form",
					layout: "grid",
					columns: 1,
					padding: 0,
					items:
						[
							{
							type: "textbox",
							name: "inputtedCalc",
							spellcheck: false,
							flex: 1,
							size: 40,
							style: "direction: ltr; text-align: left",
							classes: "monospace",
							value: defaultCalc,
							autofocus: true
							},
							{
							type: "listbox",
							label: STRING_DECIMALS,
							name: "decimals",
							value: decimalsUsed,
							values:
								[
									{text: "0", value: "0"},
									{text: "1", value: "1"},
									{text: "2", value: "2"},
									{text: "3", value: "3"},
									{text: "4", value: "4"},
									{text: "5", value: "5"},
									{text: "6", value: "6"},
									{text: "7", value: "7"},
									{text: "8", value: "8"},
									{text: "9", value: "9"}
								]
							},
							{
							type: "checkbox",
							label: STRING_THOUSANDS,
							name: "thousandsSeparator",
							checked: thousandsSeparator
							}
						]
					},
				onsubmit: function(e)
					{
					if (elementStoredNodeName=="TD")
						{
						updateField(e.data.inputtedCalc,elementStoredNode,elementStoredClassName,e.data.decimals,e.data.thousandsSeparator, true);
						}
					else if(elementStoredNodeOffsetParent.nodeName=="TD")
						{
						updateField(e.data.inputtedCalc,elementStoredNodeOffsetParent,elementStoredClassName,e.data.decimals,e.data.thousandsSeparator,true);
						}
					}
				});
			}
			else
			{
			editor.notificationManager.open({text: STRING_ERROR, type: "error", timeout: 5000});
			}
		}

	editor.on("nodechange",function(e){updateTable(false);});
	editor.on("change",function(e){updateTable(true);});
	editor.on("paste",function(e){updateTable(true);});
	editor.on("keyup",function(e){if(e.shiftKey==false && e.metaKey==false && e.ctrlKey==false && e.keyCode!=37 && e.keyCode!=38 && e.keyCode!=37 && e.keyCode!=39 && e.keyCode!=40){updateTable(true);}});
	editor.addButton("spreadsheet",{tooltip:STRING_TITLE,icon:false,onPostRender:function(){toolbarIcon=this;},onclick:function(){createDialog();},image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEGWlDQ1BrQ0dDb2xvclNwYWNlR2VuZXJpY1JHQgAAOI2NVV1oHFUUPrtzZyMkzlNsNIV0qD8NJQ2TVjShtLp/3d02bpZJNtoi6GT27s6Yyc44M7v9oU9FUHwx6psUxL+3gCAo9Q/bPrQvlQol2tQgKD60+INQ6Ium65k7M5lpurHeZe58853vnnvuuWfvBei5qliWkRQBFpquLRcy4nOHj4g9K5CEh6AXBqFXUR0rXalMAjZPC3e1W99Dwntf2dXd/p+tt0YdFSBxH2Kz5qgLiI8B8KdVy3YBevqRHz/qWh72Yui3MUDEL3q44WPXw3M+fo1pZuQs4tOIBVVTaoiXEI/MxfhGDPsxsNZfoE1q66ro5aJim3XdoLFw72H+n23BaIXzbcOnz5mfPoTvYVz7KzUl5+FRxEuqkp9G/Ajia219thzg25abkRE/BpDc3pqvphHvRFys2weqvp+krbWKIX7nhDbzLOItiM8358pTwdirqpPFnMF2xLc1WvLyOwTAibpbmvHHcvttU57y5+XqNZrLe3lE/Pq8eUj2fXKfOe3pfOjzhJYtB/yll5SDFcSDiH+hRkH25+L+sdxKEAMZahrlSX8ukqMOWy/jXW2m6M9LDBc31B9LFuv6gVKg/0Szi3KAr1kGq1GMjU/aLbnq6/lRxc4XfJ98hTargX++DbMJBSiYMIe9Ck1YAxFkKEAG3xbYaKmDDgYyFK0UGYpfoWYXG+fAPPI6tJnNwb7ClP7IyF+D+bjOtCpkhz6CFrIa/I6sFtNl8auFXGMTP34sNwI/JhkgEtmDz14ySfaRcTIBInmKPE32kxyyE2Tv+thKbEVePDfW/byMM1Kmm0XdObS7oGD/MypMXFPXrCwOtoYjyyn7BV29/MZfsVzpLDdRtuIZnbpXzvlf+ev8MvYr/Gqk4H/kV/G3csdazLuyTMPsbFhzd1UabQbjFvDRmcWJxR3zcfHkVw9GfpbJmeev9F08WW8uDkaslwX6avlWGU6NRKz0g/SHtCy9J30o/ca9zX3Kfc19zn3BXQKRO8ud477hLnAfc1/G9mrzGlrfexZ5GLdn6ZZrrEohI2wVHhZywjbhUWEy8icMCGNCUdiBlq3r+xafL549HQ5jH+an+1y+LlYBifuxAvRN/lVVVOlwlCkdVm9NOL5BE4wkQ2SMlDZU97hX86EilU/lUmkQUztTE6mx1EEPh7OmdqBtAvv8HdWpbrJS6tJj3n0CWdM6busNzRV3S9KTYhqvNiqWmuroiKgYhshMjmhTh9ptWhsF7970j/SbMrsPE1suR5z7DMC+P/Hs+y7ijrQAlhyAgccjbhjPygfeBTjzhNqy28EdkUh8C+DU9+z2v/oyeH791OncxHOs5y2AtTc7nb/f73TWPkD/qwBnjX8BoJ98VQNcC+8AAADXSURBVDgRxVMxDsIwDLShCITUBXXlB+nUHcGKYOxPywwSQ3eabv0H6VLTIEyJ0woEA14cn+8cn5QA/BjI+lipIwGsuR7KreBUaL3x+kqpVv8+JC+QEqXiAwBtJQ4jyPRF7yU+koAVa60xDMP50phZFEUTRFxAAzufC+BtwKQ8z6/3c1VBkiRNXdfccrI3gAjP0qcxhnCMmaN8FJ6FsixWRDR9tVCmadDn3xnIt36aHbEtWOg1BCB5ngUmDGUxrytZ0CH9J8n7/wbPd2A/iVyvz4Tl9eFfYzcgT1cIgY2vowAAAABJRU5ErkJggg=="});
	editor.addMenuItem("spreadsheet",{text:STRING_MENU,context:"insert",onclick:function(){createDialog();}});
	return{getMetadata:function(){return{name:"Spreadsheet plugin",url:"https://lrusso.com.ar"};}};
	});