tinymce.PluginManager.add("tablecalculator", function(editor, url)
	{
	var STRING_MENU = "";
	var STRING_TITLE = "";
	var STRING_ERROR = "";

	if (editor.settings.language=="es")
		{
		STRING_MENU = "C\u00E1lculo";
		STRING_TITLE = "Ingresar/editar c\u00E1lculo";
		STRING_ERROR = "ERROR: Debe estar posicionado dentro de una tabla.";
		}
		else
		{
		STRING_MENU = "Calculation";
		STRING_TITLE = "Insert/edit calculation";
		STRING_ERROR = "ERROR: You must be located inside a table.";
		}

	function updateField(inputtedCalc,parentElement,initialClass)
		{
		if (inputtedCalc!="")
			{
			if (checkingErrors(inputtedCalc)==false)
				{
				try
					{
					var result = eval(inputtedCalc);
					if (typeof result === "undefined")
						{
						parentElement.className = "calculatorTinyMCE" + encodeURIComponent(inputtedCalc);
						parentElement.innerHTML = "Error";
						}
						else
						{
						parentElement.className = "calculatorTinyMCE" + encodeURIComponent(inputtedCalc);
						parentElement.innerHTML = result;
						}
					}
					catch(err)
					{
					parentElement.className = "calculatorTinyMCE" + encodeURIComponent(inputtedCalc);
					parentElement.innerHTML = "Error";
					}
				}
				else
				{
				parentElement.className = "calculatorTinyMCE" + encodeURIComponent(inputtedCalc);
				parentElement.innerHTML = "Error";
				}
			}
			else
			{
			if (initialClass.substring(0,17)=="calculatorTinyMCE")
				{
				tinymce.activeEditor.dom.removeClass(parentElement, initialClass);
				}
			}
		}

	function checkingErrors(input)
		{
		for(var i = 0; i < input.length; i++)
			{
			var character = input.charAt(i);
			if (character!="0" &&
				character!="1" &&
				character!="2" &&
				character!="3" &&
				character!="4" &&
				character!="5" &&
				character!="6" &&
				character!="7" &&
				character!="8" &&
				character!="9" &&
				character!="." &&
				character!="+" &&
				character!="-" &&
				character!="*" &&
				character!="/" &&
				character!="%" &&
				character!="(" &&
				character!=")" &&
				character!="$" &&
				character!="\""
				)
				{
				return true;
				}
			}
		return false;
		}

	function createDialog()
		{
		var elementStoredNode = editor.selection.getNode();
		var elementStoredNodeOffsetParent = editor.selection.getNode().offsetParent;
		var elementStoredClassName = elementStoredNode.className;
		var elementStoredNodeName = elementStoredNode.nodeName;

		var tableLocated = false;

		if (elementStoredNodeName=="TD")
			{
			tableLocated = true
			}
		else if(elementStoredNodeOffsetParent!=null)
			{
			if (elementStoredNodeOffsetParent.nodeName=="TD")
				{
				tableLocated = true;
				}
			}

		if (tableLocated==true)
			{
			var defaultCalc = "";

			if (elementStoredClassName!=null)
				{
				try
					{
					if (elementStoredClassName.substring(0,17)=="calculatorTinyMCE")
						{
						var tempValue = decodeURIComponent(elementStoredClassName);
						defaultCalc = tempValue.substring(17,tempValue.length);
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
				onsubmit: function(e)
					{
					if (elementStoredNodeName=="TD")
						{
						updateField(e.data.inputtedCalc,elementStoredNode,elementStoredClassName);
						}
					else if(elementStoredNodeOffsetParent.nodeName=="TD")
						{
						updateField(e.data.inputtedCalc,elementStoredNodeOffsetParent,elementStoredClassName);
						}
					}
				});
			}
			else
			{
			editor.notificationManager.open({text: STRING_ERROR, type: "error", timeout: 5000});
			}
		}

	editor.addButton(  "tablecalculator", {tooltip: STRING_TITLE, icon: false, onclick: function() {createDialog();}, image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEGWlDQ1BrQ0dDb2xvclNwYWNlR2VuZXJpY1JHQgAAOI2NVV1oHFUUPrtzZyMkzlNsNIV0qD8NJQ2TVjShtLp/3d02bpZJNtoi6GT27s6Yyc44M7v9oU9FUHwx6psUxL+3gCAo9Q/bPrQvlQol2tQgKD60+INQ6Ium65k7M5lpurHeZe58853vnnvuuWfvBei5qliWkRQBFpquLRcy4nOHj4g9K5CEh6AXBqFXUR0rXalMAjZPC3e1W99Dwntf2dXd/p+tt0YdFSBxH2Kz5qgLiI8B8KdVy3YBevqRHz/qWh72Yui3MUDEL3q44WPXw3M+fo1pZuQs4tOIBVVTaoiXEI/MxfhGDPsxsNZfoE1q66ro5aJim3XdoLFw72H+n23BaIXzbcOnz5mfPoTvYVz7KzUl5+FRxEuqkp9G/Ajia219thzg25abkRE/BpDc3pqvphHvRFys2weqvp+krbWKIX7nhDbzLOItiM8358pTwdirqpPFnMF2xLc1WvLyOwTAibpbmvHHcvttU57y5+XqNZrLe3lE/Pq8eUj2fXKfOe3pfOjzhJYtB/yll5SDFcSDiH+hRkH25+L+sdxKEAMZahrlSX8ukqMOWy/jXW2m6M9LDBc31B9LFuv6gVKg/0Szi3KAr1kGq1GMjU/aLbnq6/lRxc4XfJ98hTargX++DbMJBSiYMIe9Ck1YAxFkKEAG3xbYaKmDDgYyFK0UGYpfoWYXG+fAPPI6tJnNwb7ClP7IyF+D+bjOtCpkhz6CFrIa/I6sFtNl8auFXGMTP34sNwI/JhkgEtmDz14ySfaRcTIBInmKPE32kxyyE2Tv+thKbEVePDfW/byMM1Kmm0XdObS7oGD/MypMXFPXrCwOtoYjyyn7BV29/MZfsVzpLDdRtuIZnbpXzvlf+ev8MvYr/Gqk4H/kV/G3csdazLuyTMPsbFhzd1UabQbjFvDRmcWJxR3zcfHkVw9GfpbJmeev9F08WW8uDkaslwX6avlWGU6NRKz0g/SHtCy9J30o/ca9zX3Kfc19zn3BXQKRO8ud477hLnAfc1/G9mrzGlrfexZ5GLdn6ZZrrEohI2wVHhZywjbhUWEy8icMCGNCUdiBlq3r+xafL549HQ5jH+an+1y+LlYBifuxAvRN/lVVVOlwlCkdVm9NOL5BE4wkQ2SMlDZU97hX86EilU/lUmkQUztTE6mx1EEPh7OmdqBtAvv8HdWpbrJS6tJj3n0CWdM6busNzRV3S9KTYhqvNiqWmuroiKgYhshMjmhTh9ptWhsF7970j/SbMrsPE1suR5z7DMC+P/Hs+y7ijrQAlhyAgccjbhjPygfeBTjzhNqy28EdkUh8C+DU9+z2v/oyeH791OncxHOs5y2AtTc7nb/f73TWPkD/qwBnjX8BoJ98VQNcC+8AAADXSURBVDgRxVMxDsIwDLShCITUBXXlB+nUHcGKYOxPywwSQ3eabv0H6VLTIEyJ0woEA14cn+8cn5QA/BjI+lipIwGsuR7KreBUaL3x+kqpVv8+JC+QEqXiAwBtJQ4jyPRF7yU+koAVa60xDMP50phZFEUTRFxAAzufC+BtwKQ8z6/3c1VBkiRNXdfccrI3gAjP0qcxhnCMmaN8FJ6FsixWRDR9tVCmadDn3xnIt36aHbEtWOg1BCB5ngUmDGUxrytZ0CH9J8n7/wbPd2A/iVyvz4Tl9eFfYzcgT1cIgY2vowAAAABJRU5ErkJggg=="});
	editor.addMenuItem("tablecalculator", {text: STRING_MENU, context: "insert", onclick: function() {createDialog();} });

	return{getMetadata: function (){return {name: "Table calculator plugin",url: "https://lrusso.com.ar"};}};
	});