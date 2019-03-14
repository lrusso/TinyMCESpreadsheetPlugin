# TinyMCE Spreadsheet Plugin

Spreadsheet plugin for TinyMCE. The plugin stores the cell formula as a class name in the cell tag and inserts the result as the cell value. It only works inside tables. Operators like + - * / % ( ) and symbols like " $ . are allowed. This plugin allows you to make references between cells, but it won't update the cell value automatically if you modify the table. The cell with the formula must be manually updated (just by opening the cell formula and pressing 'Ok').

![alt screenshot](https://raw.githubusercontent.com/lrusso/TinyMCESpreadsheetPlugin/master/spreadsheet.png)

## Demo:

https://lrusso.github.io/TinyMCESpreadsheetPlugin/demo.htm

## Example of formula:

```
"$"+(A1+B2+C3*20/50)
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
