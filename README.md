# TinyMCE Spreadsheet Plugin

The plugin stores the cell formula as a class name in the cell tag and inserts the result as the cell value.

Operators + - * / % ( ) and cells references are allowed.

![alt screenshot](https://raw.githubusercontent.com/lrusso/TinyMCESpreadsheetPlugin/master/spreadsheet.png)

## Demo:

https://lrusso.github.io/TinyMCESpreadsheetPlugin/demo.htm

## Example of a formula with cell references:

```
"$ "+((B2+B3+B4)/B5)
```

## Example of a formula with range cell references:

```
"$ "+((B2:B4)/B5)
```

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
