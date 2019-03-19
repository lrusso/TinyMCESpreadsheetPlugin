# TinyMCE Spreadsheet Plugin

The plugin stores the cell formula as a class name in the cell tag and inserts the result as the cell value.

Operators + - * / % ( ) and cells references are allowed.

![alt screenshot](https://raw.githubusercontent.com/lrusso/TinyMCESpreadsheetPlugin/master/spreadsheet.png)

## Demo

https://lrusso.github.io/TinyMCESpreadsheetPlugin/demo.htm

## Formulas examples

| FORMULA  | DETAILS |
| :------------ |:--------------- |
| 1+2+3 | Simple formula |
| A1+A2+A3 | Cell referenced formula |
| (A1+A2+A3)+100 | Cell referenced formula with additional math |
| "$ "+((A1+A2+A3)+100) | Cell referenced formula with additional math and text |
| "$ "+((A1:A3)+100) | Cell range formula with additional math and text |
| "$ "+((A1:B3)+100) | Cell range formula with additional math and text |

## How to add it to TinyMCE

Add the Spreadsheet plugin script to your TinyMCE Web:
```
<script src="spreadsheet.js"></script> 
```

Add the plugin references into your TinyMCE configuration:
```
plugins: "spreadsheet",
toolbar1: "spreadsheet",
```
