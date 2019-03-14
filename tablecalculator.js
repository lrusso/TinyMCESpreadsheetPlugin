tinymce.PluginManager.add("tablecalculator", function(editor, url)
	{
	var STRING_INSERTCALC = "";
	var STRING_WRONGLOCATION = "";

	if (editor.settings.language=="es")
		{
		STRING_INSERTCALC = "Ingresar/editar c\u00E1lculo";
		STRING_WRONGLOCATION = "ERROR: Debe estar posicionado dentro de una tabla.";
		}
		else
		{
		STRING_INSERTCALC = "Insert/edit calculation";
		STRING_WRONGLOCATION = "ERROR: You must be placed inside a table.";
		}

	function updateField(e)
		{
		var elementStoredNode = editor.selection.getNode();
		var elementStoredClassName = elementStoredNode.className;
		var elementStoredNodeName = elementStoredNode.nodeName;

		if (elementStoredNodeName=="TD")
			{
			if (checkingErrors(e)==false)
				{
				try
					{
					elementStoredNode.className = "calculatorTinyMCE" + encodeURIComponent(e);
					elementStoredNode.innerHTML = eval(e);
					}
					catch(err)
					{
					elementStoredNode.className = "calculatorTinyMCE" + encodeURIComponent(e);
					elementStoredNode.innerHTML = "Error";
					}
				}
				else
				{
				elementStoredNode.className = "calculatorTinyMCE" + encodeURIComponent(e);
				elementStoredNode.innerHTML = "Error";
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
		var elementStoredClassName = elementStoredNode.className;
		var elementStoredNodeName = elementStoredNode.nodeName;

		if (elementStoredNodeName=="TD")
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
				title: STRING_INSERTCALC,
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
					updateField(e.data.inputtedCalc);
					}
				});
			}
			else
			{
			editor.notificationManager.open({text: STRING_WRONGLOCATION, type: "error", timeout: 5000});
			}
		}

	editor.addButton(  "tablecalculator", {tooltip: STRING_INSERTCALC, icon: false, stateSelector: "td", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAFBJREFUOI1jYICAkwwMDP9JxCcYGBgYGKEG/GcgDzCyoAsQqRFuIROZNsMBugtI9grFLkA3gJEBNRwI8Sl3AcXROOqFweSFk2RoPsbAwMAAAIXIFUTBEfO7AAAAAElFTkSuQmCC", onclick: function() {createDialog();}});
	editor.addMenuItem("tablecalculator", {text: STRING_INSERTCALC, context: "insert", onclick: function() {createDialog();} });

	return{getMetadata: function (){return {name: "Table calculator plugin",url: "https://lrusso.com.ar"};}};
	});