Attribute VB_Name = "Module1"
Sub alphabetical_testing()

    Dim ws As Worksheet
    
    
    ' loop through all sheets
    
    
    For Each ws In Worksheets
    ws.Activate
    
    ' determine last row
    
    lastrow = ws.Cells(Rows.Count, 1).End(xlUp).Row
    
    'Grab worksheet name
    WorkSheetName = ws.Name
    
    MsgBox "Name of Sheet" + ws.Name
    
    ' Determine the last Column Number
    LastColumn = ws.Cells(1, Columns.Count).End(xlToLeft).Column

   
    ' set variable for ticker symbol
    Dim ticker As String
    
    'set variable for holding total volume each stock had
    Dim volume As Integer
    Total_Volume = 0
    
    'keep track of location of each ticker symbol in summary table
    Dim summary_table_row As Integer
    summary_table_row = 2
    
    'loop through all ticker symbols
    For i = 2 To lastrow
    
    'check if we are still in same ticker brand, if it is not...
    If Cells(i + 1, 1).Value <> Cells(i, 1).Value Then
    
    'set ticker symbol name
    ticker_name = Cells(i, 1).Value
    
    'add to ticker symbol total
    Total_Volume = Total_Volume + Cells(i, 7).Value
    Cells(1, 9).Value = "Ticker"
    
    'print ticker symbol in summary table
    Range("i" & summary_table_row).Value = ticker_name
    
    'print total amount of volume
    Range("j" & summary_table_row).Value = Total_Volume
    
    'add one to summary table row
    summary_table_row = summary_table_row + 1
    
    ' Reset the ticker symbol total
    Total_Volume = 0
    
    'if cell immediately following the row is the same ticker symbol
    Else
    
        'add to total volume
        Total_Volume = Total_Volume + Cells(i, 7).Value
        Cells(1, 10).Value = "Total Volume"
        
    End If
        
    Next i
    
    Next ws

End Sub

