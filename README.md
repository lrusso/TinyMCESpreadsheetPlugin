# TinyMCE Table Calculator Plugin

Table Calculator, Spreadsheet like, plugin for TinyMCE. The plugin stores the math calculation as a class name in the cell tag and inserts the result as the cell value. It only works inside tables. Operators like + - * / ( ) and symbols like " $ . are allowed. This plugin does NOT allow you make references between cells. Position the TinyMCE cursor in a cell, and press the plugin icon to insert/edit the math calculation of that cell.

![alt screenshot](https://raw.githubusercontent.com/lrusso/TinyMCETableCalculatorPlugin/master/tablecalculator.png)

## Demo:

https://lrusso.github.io/TinyMCETableCalculatorPlugin/demo.htm

## Example of math code:

```
"$"+10+20+30
```

## How to add it to TinyMCE

Add the Chart plugin script to your TinyMCE Web:
```
<script src="tablecalculator.js"></script> 
```

Add the plugin references into your TinyMCE configuration:
```
plugins: "tablecalculator",
toolbar1: "tablecalculator",
```
