### @activities true
### @explicitHints true

# Data Logging

## Setup and Simple Data Collection
### Introduction Step @unplugged
A really useful feature of the Smart Greenhouse is the data logging functionality - being able to measure, store and then transmit data to a computer. This means that the relationships between environmental factors such as temperature, humidity, soil moisture and light levels can be analysed and the results used to improve plant care and growth. This tutorial will go through the basics of gathering data readings, storing them and then transmitting them to a computer via USB. It will also cover the use of the MakeCode serial console and importing data into Microsoft Excel. 

### micro:bit Setup @unplugged
For this tutorial, the BBC micro:bit plugged into the Environmental Control Board needs to be connected via USB to a computer all the time, and the micro:bit needs to be 'Paired' within MakeCode (**Note:** To be able to 'Pair' in MakeCode, the micro:bit firmware must be 0249 or higher; click [here](https://microbit.org/get-started/user-guide/firmware/) for more information).  
  
Once the micro:bit is connected via USB, click the three dots to the right of the ``|Download|`` button, then select "Pair device" from the list.  
![GIF showing opening the Pairing window](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/pair-microbit-part-1.gif)  
This will open the Pairing window. From there, click the ``|Pair device|`` button, select the connected micro:bit from the list and click "Connect".  
![GIF showing connecting the micro:bit](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/pair-microbit-part-2.gif)  
The ``|Download|`` button should now have the USB symbol in front of it. The micro:bit is now paired and the rest of the tutorial can be completed.

### Step 1
To set the micro:bit up for data logging and transmission, a few blocks need to be added to the ``||basic:on start||`` section.  
The first of these is the ``||kitronik_smart_greenhouse.set data output to USB||`` block which can be found in the ``||kitronik_smart_greenhouse.Data Logging||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category. This sets up everything in the background to enable any data collected by the program to be sent to the computer using the connecting USB cable.

#### ~ tutorialhint
```blocks
kitronik_smart_greenhouse.setDataForUSB()
```

### Step 2
The next two blocks deal with the data format. First, add in a ``||kitronik_smart_greenhouse.separate entries||`` block at the end of the ``||basic:on start||`` section. This block determines what will come inbetween each data entry when it is transmitted, which then helps with importing the data to a spreadsheet. For this tutorial, select ``||kitronik_smart_greenhouse.Semicolon||`` from the drop-down list.  
Finally, include an ``||kitronik_smart_greenhouse.add data entry headings||`` block and type in the title "Light".

#### ~ tutorialhint
```blocks
kitronik_smart_greenhouse.setDataForUSB()
kitronik_smart_greenhouse.selectSeparator(kitronik_smart_greenhouse.Separator.semicolon)
kitronik_smart_greenhouse.addTitle("Light")
```

### Step 3
Now that things are set up, the data measurement process can be sorted. As the data title might suggest, the program is going to use the micro:bit to mmeasure the light level (the LED display can be used to do this if all the LEDs are turned off.).  
Add an ``||input:on button A pressed||`` block from the ``||input:Input||`` category. Inside this, add a ``||loops:repeat||`` loop from the ``||loops:Loops||`` category, and change the number so that it repeats **25** times.

#### ~ tutorialhint
```blocks
input.onButtonPressed(Button.A, function () {
    for (let index = 0; index < 25; index++) {
        
    }
})
```

### Step 4
Within the ``||loops:repeat||`` loop, the light level will be measured and added to a data store. **Note:** There is a limit of 100 entries in the data store.  
Inside the loop, add an ``||kitronik_smart_greenhouse.add data||`` block from the ``||kitronik_smart_greenhouse.Data Logging||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category. The block can only use strings, so where values measured as numbers are needed, a ``||text:convert to text||`` is required (from the ``||text:Text||`` category under **Advanced**). Insert one inside the slot in the ``||kitronik_smart_greenhouse.add data||`` block. The value to be converted to text is ``||input:light level||`` which can be found in the ``||input:Input||`` category.

#### ~ tutorialhint
```blocks
input.onButtonPressed(Button.A, function () {
    for (let index = 0; index < 25; index++) {
        kitronik_smart_greenhouse.addData(convertToText(input.lightLevel()))
    }
})
```

### Step 5
Currently, when ``||input:button A||`` is pressed, the program will measure the light level 25 times, with each measurement coming immediately after the previous one. This doesn't leave much time for changes to be identified, so add a 2 second ``||basic:pause||`` after the ``||kitronik_smart_greenhouse.add data||`` block. Another slight issue is that there is no way to know when the data collection has finished. After the ``||loops:repeat||`` loop, add a ``||basic:show icon ✓||``, and before the loop, a ``||basic:clear screen||`` block - both of these can be found in the ``||basic:Basic||`` category.

#### ~ tutorialhint
```blocks
input.onButtonPressed(Button.A, function () {
    basic.clearScreen()
    for (let index = 0; index < 25; index++) {
        kitronik_smart_greenhouse.addData(convertToText(input.lightLevel()))
        basic.pause(2000)
    }
    basic.showIcon(IconNames.Yes)
})
```

### Step 6
The data logging functionality has been set up and the data measurement process has been organised, the next thing is triggering the transmission of the collected data.  
From the ``||input:Input||`` category, add an ``||input:on button B pressed||`` block, and inside, put a ``||kitronik_smart_greenhouse.transmit all data||`` block from the ``||kitronik_smart_greenhouse.Data Logging||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category. 

#### ~ tutorialhint
```blocks
input.onButtonPressed(Button.B, function () {
    kitronik_smart_greenhouse.sendAllData()
})
```

### Step 7
Finally, it would be good to have a way to delete the data to make space for more.  
Add an ``||input:on button A+B pressed||`` block and inside, place a ``||kitronik_smart_greenhouse.clear all data||`` block from the ``||kitronik_smart_greenhouse.Data Logging||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category.

#### ~ tutorialhint
```blocks
input.onButtonPressed(Button.AB, function () {
    kitronik_smart_greenhouse.clearData()
})
```

### Step 8
Click ``|Download|`` and transfer the code to the Environmental Control Board.  
Press ``||input:Button A||`` and then vary the brightness of light visible to the micro:bit LED display (for example, shine a torch, then cover the screen, or tilt it up towards ceiling lights). A tick will be displayed when the data collection is complete.  
Keep the micro:bit plugged in through the data collection, and once complete, move onto the next stage of the tutorial.

## Simple Data Transmission
### Step 1
Some light level measurements will now be stored on the micro:bit, ready to be transferred to the computer via the USB cable.  
Press ``||input:Button B||`` on the micro:bit. This will will make the "**Show console** Device" button appear under the micro:bit simulation image. Click on the new button.

#### ~ tutorialhint
![Click on Show console button](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/show-console-button.gif)

### Step 2
After clicking the console button, the code editor window will disappear and be replaced with either a white screen (in which case, press ``||input:Button B||`` again) or a screen with a scrolling chart at the top and the transmitted data text at the bottom - this is the console display.  
In the top right corner of the window there are three buttons. To export and download the data as a text file, click the button furthest to the right.

#### ~ tutorialhint
![Export data as text file](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/export-data-text-file.gif)

### Step 3
Now open a new spreadsheet in Microsoft Excel (this has also been tested in Google Sheets and LibreOffice Calc, although they have a slightly different import process).  
Select a cell in the spreadsheet, and then go to the "Data" tab in the top bar. Click on "From Text" to begin the data import process.

#### ~ tutorialhint
![Export data as text file](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/excel-data-from-text.gif)

### Step 4
A File Explorer window will have now opened. Go the folder where the text file from MakeCode was downloaded (probably "Downloads") and select the file. Click the "Import" button at the bottom of the window. This will start the "Text Import Wizard".

### Step 5
Make sure the "Delimited" box is checked, as the data is separated by semicolons. Click "Next".
Check the "Semicolon" box and uncheck the "Tab" box this will make sure that the correct separator between data entries is identfied. Click "Next" and then "Finish".  
In the final window, make sure "Existing worksheet" is checked as the import location and then click "OK". The data will now have been imported to the spreadsheet and is ready to be analysed, manipulated and understood. 

#### ~ tutorialhint
![Export data as text file](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/excel-text-import-wizard.gif)

## Adding More Data
### Introduction Step @unplugged
The tutorial so far has just looked at collecting and transmitting a single type of data, but the ``||kitronik_smart_greenhouse.Data Logging||`` blocks are able to do lots more. In fact, there can be 10 different measurements or pieces of data in each data entry, and 100 data entries can be stored and transmitted. This final section of the tutorial will look at adding some more measurements and some extra information to the data entries. The structure of the code written so far is going to stay almost exactly the same, just a few new blocks will be added and some others expanded.

### Step 1
When collecting data, it can be very useful to know **when** the measurements were taken, so the first addition will be setting the date and time on the Environmental Control Board.  
From the ``||kitronik_smart_greenhouse.Clock||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category, add in the ``||kitronik_smart_greenhouse.Set Date||`` and ``||kitronik_smart_greenhouse.Set Time||`` blocks to the beginning of the ``||basic:on start||`` section. Set the date to today's date, and the time can be set the current time just before the program is downloaded to the micro:bit.

#### ~ tutorialhint
```blocks
kitronik_smart_greenhouse.setDate(8, 9, 20)
kitronik_smart_greenhouse.setTime(8, 30, 0)
kitronik_smart_greenhouse.setDataForUSB()
kitronik_smart_greenhouse.selectSeparator(kitronik_smart_greenhouse.Separator.semicolon)
kitronik_smart_greenhouse.addTitle("Light")
```

### Step 2
Next, as there are going to be more pieces of data in each data entry, there need to be more data entry titles.  
Click the ``||kitronik_smart_greenhouse.+||`` icon on the ``||kitronik_smart_greenhouse.data entry headings||`` block **3** times so that there are four text boxes available. Type these titles in (replacing "Light"): "Date", "Time", "Temp" and "Humidity". (**Note:** Titles are limited to 10 characters in length, which is why "Temperature" has been shortened).

#### ~ tutorialhint
```blocks
kitronik_smart_greenhouse.setDate(8, 9, 20)
kitronik_smart_greenhouse.setTime(8, 30, 0)
kitronik_smart_greenhouse.setDataForUSB()
kitronik_smart_greenhouse.selectSeparator(kitronik_smart_greenhouse.Separator.semicolon)
kitronik_smart_greenhouse.addTitle("Date", "Time", "Temp", "Humidity")
```

### Step 3
The only other block to be changed is the ``||kitronik_smart_greenhouse.add data||`` block in the ``||input:button A||`` section.  
Begin by dragging the ``||text:convert||`` ``||input:light level||`` ``||text:to text||`` block out and deleting it. Then, just like for the titles, click the ``||kitronik_smart_greenhouse.+||`` icon  **3** times so that there are four text boxes available. Now, making sure that the order matches the titles, insert the ``||kitronik_smart_greenhouse.Read Date as String||`` and ``||kitronik_smart_greenhouse.Read Time as String||`` blocks from the ``||kitronik_smart_greenhouse.Clock||`` section. (**Note:** These values are already strings, so there is no need to convert them to text).

#### ~ tutorialhint
```blocks
input.onButtonPressed(Button.A, function () {
    basic.clearScreen()
    for (let index = 0; index < 25; index++) {
        kitronik_smart_greenhouse.addData(kitronik_smart_greenhouse.readDate(), kitronik_smart_greenhouse.readTime(), "", "")
        basic.pause(2000)
    }
    basic.showIcon(IconNames.Yes)
})
```

### Step 4
Finally, in the third and fourth text boxes, insert the ``||kitronik_smart_greenhouse.Read Temperature||`` and ``||kitronik_smart_greenhouse.Read Humidity||`` blocks from the ``||kitronik_smart_greenhouse.Sensors||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category. These blocks **must** be inside ``||text:convert to text||`` blocks as they are measured as numbers. 

#### ~ tutorialhint
```blocks
input.onButtonPressed(Button.A, function () {
    basic.clearScreen()
    for (let index = 0; index < 25; index++) {
        kitronik_smart_greenhouse.addData(kitronik_smart_greenhouse.readDate(), kitronik_smart_greenhouse.readTime(), convertToText(kitronik_smart_greenhouse.temperature(TemperatureUnitList.C)), convertToText(kitronik_smart_greenhouse.humidity()))
        basic.pause(2000)
    }
    basic.showIcon(IconNames.Yes)
})
```

### Step 5
CODING COMPLETE! Click ``|Download|`` and transfer the code to the Environmental Control Board.  
Run through the same steps as covered earlier to take measurement readings, transfer the the code via USB, download and import the data to a spreadsheet, and then start using it!