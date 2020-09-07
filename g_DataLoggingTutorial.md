### @activities true
### @explicitHints true

# Data Logging

## Simple Data Output
### Introduction Step @unplugged
A really useful feature of the Smart Greenhouse is the data logging functionality - being able to measure, store and then transmit data to a computer. This means that the relationships between environmental factors such as temperature, humidity, soil moisture and light levels can be analysed and the results used to improve plant care and growth. This tutorial will go through the basics of gathering data readings, storing them and then transmitting them to a computer via USB. It will also cover the use of the MakeCode serial console and importing data into Microsoft Excel. 

### Setup @unplugged
For this tutorial, the BBC micro:bit plugged into the Environmental Control Board needs to be connected via USB to a computer all the time, and the micro:bit needs to be 'Paired' within MakeCode (**Note:** To be able to 'Pair' in MakeCode, the micro:bit firmware must be 0249 or higher; click [here](https://microbit.org/get-started/user-guide/firmware/) for more information).  
  
Once the micro:bit is connected via USB, click the three dots to the right of the ``|Download|`` button, then select "Pair device" from the list.  
![GIF showing opening the Pairing window](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/pair-microbit-part-1.gif)  
This will open the Pairing window. From there, click the ``|Pair device|`` button, select the connected micro:bit from the list and click "Connect".  
![GIF showing connecting the micro:bit](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/pair-microbit-part-2.gif)  
The ``|Download|`` button should now have the USB symbol in front of it.

### Step 1
Before the ZIP Stick is programmed, it needs to be plugged in and mounted on the greenhouse correctly.  
The ZIP Stick can either be mounted on the inside or outside of the roof, slotting the folding tabs into the holes on the ZIP Stick. The extension lead is then used to connect the ZIP Stick to the Environmental Control Board. Make sure that the pins are matched correctly, with **OUT** on the Control Board linking to **DIN** on the ZIP Stick.

![Picture of ZIP Stick mounted in greenhouse](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/photosynthesis-vs-wavelength.jpg)

## Changing Colour
### Step 1
The first thing to do in the code is to set up the ZIP LEDs and create the ZIP Stick range.
From the ``||kitronik_smart_greenhouse.ZIP LEDs||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category, add the ``||variables:set zipLEDs to||`` ``||kitronik_smart_greenhouse.Smart Greenhouse with 8 ZIP LEDs||`` block to the ``||basic:on start||`` section, followed by the ``||variables:set zipStick||`` block.

#### ~ tutorialhint
```blocks
let zipLEDs = kitronik_smart_greenhouse.createGreenhouseZIPDisplay(8)
let zipStick = zipLEDs.zipStickRange()
```

### Step 5
CODING COMPLETE! Click ``|Download|`` and transfer the code to the Environmental Control Board and then try out varying the colour and the brightness.