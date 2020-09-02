### @activities true
### @explicitHints true

# Automatic Plant Watering

## Soil Moisture Alarm
### Introduction Step @unplugged
In the "Displaying Temperature, Humidity & Soil Moisture" tutorial (click [here](https://makecode.microbit.org/#tutorial:https://github.com/KitronikLtd/pxt-kitronik-ec-board/b_UsingZIPLEDHueTutorial) to view) the ZIP LED colour hue was used to display the sensor values. In this tutorial, soil moisture will be displayed in the same way, but the measurement will also be used to trigger an alarm and control when a plant is watered.  
  
This tutorial is going to require the Prong to be connected to the Environmental Control Board using crocodile clips.  
Connect Prong 3V to one of the 3V pads, Prong GND to one of the GND pads and Prong P1 to the Pin1 pad. Stick it into a plant pot.

![Ticking Halo HD Clock animation](https://KitronikLtd.github.io/pxt-kitronik-halohd/assets/Ticking-Clock-Animation.gif)

### Step 1
The first thing to do is to set up the ZIP LEDs and create the status LEDs range.
From the ``||kitronik_environmental_board.ZIP LEDs||`` section of the ``||kitronik_environmental_board.Environmental||`` category, add the ``||variables:set zipLEDs to||`` ``||kitronik_environmental_board.Environmental Board with 3 ZIP LEDs||`` block to the ``||basic:on start||`` section, followed by the ``||variables:set statusLEDs||`` block.

#### ~ tutorialhint
```blocks
let zipLEDs = kitronik_environmental_board.createECZIPDisplay(3)
let statusLEDs = zipLEDs.statusLedsRange()
```

### Step 2
Next, create a new variable called ``||variables:soilHue||``. This will be used to set and store the ZIP LED colour hue based on the soil moisture reading from the sensor.  
In the ``||basic:forever||`` loop, ``||variables:set tempHue to||`` ``||math:map 0 from low 0 high 1023 to low 0 high 4||`` - this block can be found in the ``||math:Math||`` category.

#### ~ tutorialhint
```blocks
basic.forever(function () {
    soilHue = Math.map(0, 0, 1023, 0, 4)
})
```

### Step 3
In the ``||math:map||`` block, put the ``||kitronik_environmental_board.Analog read P1||`` block in the first slot - this can be found in the ``||kitronik_environmental_board.Inputs/Outputs||`` section of the ``||kitronik_environmental_board.Environmental||`` category. Then, set ``||math:from low 0 high 1023 to low 35 high 150||`` to give a desert sand colour for a low moisture reading and a watery colour for a high moisture reading.

#### ~ tutorialhint
```blocks
basic.forever(function () {
    soilHue = Math.map(kitronik_environmental_board.readIOPin(kitronik_environmental_board.PinType.analog, kitronik_environmental_board.IOPins.p1), 0, 1023, 35, 150)
})
```

### Step 4
Now that the soil moisture hue has been set and stored, the ZIP LED colour can now be set.  
After the ``||variables:set soilHue||`` block, add a  ``||kitronik_environmental_board.ZIP LED 2 to hue||`` ``||variables:soilHue||``. Finally, put a ``||variables:statusLEDs||``  ``||kitronik_environmental_board.show||`` block at the end of the ``||basic:forever||`` loop.

#### ~ tutorialhint
```blocks
let statusLEDs: kitronik_environmental_board.ecZIPLEDs = null
basic.forever(function () {
    soilHue = Math.map(kitronik_environmental_board.readIOPin(kitronik_environmental_board.PinType.analog, kitronik_environmental_board.IOPins.p1), 0, 1023, 35, 150)
    statusLEDs.setZipLedColor(2, kitronik_environmental_board.hueToRGB(soilHue))
    statusLEDs.show()
})
```

### Step 5
Displaying the soil moisture has now been set up, but it isn't being used to control anything yet.  
After the ``||kitronik_environmental_board.show||`` block, add in an ``||logic:if else||`` block from the ``||logic:Logic||`` category. Check whether the measured soil moisture value is less than 400 (this value can be changed depending on how much water particular plants need, a lower value means drier soil).  
The ``||logic:if||`` statement should read: ``||logic:if||`` ``||kitronik_environmental_board.Analog read P1||`` ``||logic:≤ 400 then||``. 

#### ~ tutorialhint
```blocks
let statusLEDs: kitronik_environmental_board.ecZIPLEDs = null
basic.forever(function () {
    soilHue = Math.map(kitronik_environmental_board.readIOPin(kitronik_environmental_board.PinType.analog, kitronik_environmental_board.IOPins.p1), 0, 1023, 35, 150)
    statusLEDs.setZipLedColor(2, kitronik_environmental_board.hueToRGB(soilHue))
    statusLEDs.show()
    if (kitronik_environmental_board.readIOPin(kitronik_environmental_board.PinType.analog, kitronik_environmental_board.IOPins.p1) <= 400) {
        
    } else {
        
    }
})
```

### Step 6
The ``||logic:if||`` statement is set up to check whether the soil is too dry, so now an action needs to be taken if this condition is met.  
Audio is going to be used, so to set this up, add in the ``||kitronik_environmental_board.set music pin for buzzer||`` block to the ``||basic:on start||`` section. This block is in the top level of the ``||kitronik_environmental_board.Environmental||`` cateogry.  
From the ``||music:Music||`` category, add a ``||music:start melody||`` block inside the ``||logic:if||`` statement, select a tune from the drop-down list and set the the repeat to ``||music:forever||``. After this, place a 2 second ``||basic:pause||``, followed by a ``||music:stop melody all||`` block. The audio alarm is now complete.

#### ~ tutorialhint
```blocks
kitronik_environmental_board.setBuzzerPin()
let zipLEDs = kitronik_environmental_board.createECZIPDisplay(3)
let statusLEDs = zipLEDs.statusLedsRange()
basic.forever(function () {
    if (kitronik_environmental_board.readIOPin(kitronik_environmental_board.PinType.analog, kitronik_environmental_board.IOPins.p1) <= 400) {
        music.startMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Forever)
        basic.pause(2000)
        music.stopMelody(MelodyStopOptions.All)
    } else {
        
    }
})
```

### Step 7
The final stage of the alarm is to add some visual indicators as well. Inside the ``||logic:if||`` statement, just before the ``||music:start melody||`` block, add in a ``||basic:show icon||`` block with a sad face selected, and add another of these blocks inside the ``||logic:else||`` sectin, but this time with a happy face.  
Now, the micro:bit will be happy when the plant has enough water and sad when it's too dry.

#### ~ tutorialhint
```blocks
basic.forever(function () {
    if (kitronik_environmental_board.readIOPin(kitronik_environmental_board.PinType.analog, kitronik_environmental_board.IOPins.p1) <= 400) {
        basic.showIcon(IconNames.Sad)
        music.startMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Forever)
        basic.pause(2000)
        music.stopMelody(MelodyStopOptions.All)
    } else {
        basic.showIcon(IconNames.Happy)
    }
})
```

### Step 8
The soil moisture alarm is now complete, so click ``|Download|`` and transfer the code to the Environmental Control Board.  
Try sticking the Prong in soil with different moisture levels to see when the alarm is triggered.

## Adding Automated Watering
### Introduction Step @unplugged
The Environmental Control Board is now able to determine when the soil is too dry, and can even sound the alarm, but it would be great if it could sort out the watering as well!
  
This stage of the tutorial is going to require the Prong as before, and also the water pump to be connected to the high power output on P13 on the Environmental Control Board (follow the instructions in the booklet included .

![Picture of Prong and water pump connected to Environmental Control Board]

### Step 1
Create two more new variables, one called ``||variables:humidHue||`` and the other ``||variables:soilHue||``.  
Directly after the ``||variables:set tempHue||`` block in the ``||basic:forever||`` loop, set both of the new variables to the ``||math:map||`` block (as for ``||variables:tempHue||``).

#### ~ tutorialhint
```blocks
let statusLEDs: kitronik_environmental_board.ecZIPLEDs = null
basic.forever(function () {
    tempHue = Math.map(kitronik_environmental_board.temperature(TemperatureUnitList.C), 0, 40, 210, 0)
    humidHue = Math.map(0, 0, 1023, 0, 4)
    soilHue = Math.map(0, 0, 1023, 0, 4)
    statusLEDs.setZipLedColor(0, kitronik_environmental_board.hueToRGB(tempHue))
    statusLEDs.show()
})
```

### Step 2
Similar to ``||variables:tempHue||``, ``||variables:set humidHue to||`` ``||math:map||`` ``||kitronik_environmental_board.Read Humidity||`` - this block can be found in the ``||kitronik_environmental_board.Sensors||`` section of the ``||kitronik_environmental_board.Environmental||`` category. The mapping values should be: ``||math:from low 0 high 100 to low 35 high 150||``. This will give a desert sand colour for low humidity and a watery colour for high humidity.

#### ~ tutorialhint
```blocks
let statusLEDs: kitronik_environmental_board.ecZIPLEDs = null
basic.forever(function () {
    tempHue = Math.map(kitronik_environmental_board.temperature(TemperatureUnitList.C), 0, 40, 210, 0)
    humidHue = Math.map(kitronik_environmental_board.humidity(), 0, 100, 35, 150)
    soilHue = Math.map(0, 0, 1023, 0, 4)
    statusLEDs.setZipLedColor(0, kitronik_environmental_board.hueToRGB(tempHue))
    statusLEDs.show()
})
```

### Step 3
Now do the same thing for ``||variables:soilHue||``, but this time ``||math:map||`` ``||kitronik_environmental_board.Analog read P1||`` - this block can be found in the ``||kitronik_environmental_board.Inputs/Outputs||`` section of the ``||kitronik_environmental_board.Environmental||`` category. The mapping values should be: ``||math:from low 0 high 1023 to low 35 high 150||``. This will give a desert sand colour for a low moisture reading and a watery colour for a high moisture reading.

#### ~ tutorialhint
```blocks
let statusLEDs: kitronik_environmental_board.ecZIPLEDs = null
basic.forever(function () {
    tempHue = Math.map(kitronik_environmental_board.temperature(TemperatureUnitList.C), 0, 40, 210, 0)
    humidHue = Math.map(kitronik_environmental_board.humidity(), 0, 100, 35, 150)
    soilHue = Math.map(kitronik_environmental_board.readIOPin(kitronik_environmental_board.PinType.analog, kitronik_environmental_board.IOPins.p1), 0, 1023, 35, 150)
    statusLEDs.setZipLedColor(0, kitronik_environmental_board.hueToRGB(tempHue))
    statusLEDs.show()
})
```

### Step 4
There are now hue values linked to each of the sensor readings, so the next thing to do is to link the other status LEDs to the readings.  
Just before the ``||kitronik_environmental_board.show||`` block, add in two more ``||variables:statusLEDs||`` ``||kitronik_environmental_board.set ZIP LED #||`` blocks - one setting ``||kitronik_environmental_board.ZIP LED 1 to hue||`` ``||variables:humidHue||`` and the other setting ``||kitronik_environmental_board.ZIP LED 2 to hue||`` ``||variables:soilHue||``.

#### ~ tutorialhint
```blocks
let statusLEDs: kitronik_environmental_board.ecZIPLEDs = null
basic.forever(function () {
    tempHue = Math.map(kitronik_environmental_board.temperature(TemperatureUnitList.C), 0, 40, 210, 0)
    humidHue = Math.map(kitronik_environmental_board.humidity(), 0, 100, 35, 150)
    soilHue = Math.map(kitronik_environmental_board.readIOPin(kitronik_environmental_board.PinType.analog, kitronik_environmental_board.IOPins.p1), 0, 1023, 35, 150)
    statusLEDs.setZipLedColor(0, kitronik_environmental_board.hueToRGB(tempHue))
    statusLEDs.setZipLedColor(1, kitronik_environmental_board.hueToRGB(humidHue))
    statusLEDs.setZipLedColor(2, kitronik_environmental_board.hueToRGB(soilHue))
    statusLEDs.show()
})
```

### Step 5
The final stage is to add the functionality to display the actual numerical sensor readings on the micro:bit LEDs.  
From the ``||input:Input||`` category, add in three ``||input:on button press||`` blocks - one for ``||input:button A||``, one for ``||input:button B||`` and one for ``||input:button A+B||``. Using the ``||basic:show number||`` block, make ``||input:A||`` show ``||kitronik_environmental_board.Read Temperature||``, ``||input:B||`` show ``||kitronik_environmental_board.Read Humidity||`` and ``||input:A+B||`` show ``||kitronik_environmental_board.Analog read P1||``.

#### ~ tutorialhint
```blocks
input.onButtonPressed(Button.A, function () {
    basic.showNumber(kitronik_environmental_board.temperature(TemperatureUnitList.C))
})
input.onButtonPressed(Button.AB, function () {
    basic.showNumber(kitronik_environmental_board.readIOPin(kitronik_environmental_board.PinType.analog, kitronik_environmental_board.IOPins.p1))
})
input.onButtonPressed(Button.B, function () {
    basic.showNumber(kitronik_environmental_board.humidity())
})
```

### Step 6
CODING COMPLETE! Click ``|Download|`` and transfer the code to the Environmental Control Board.  
Try varying the conditions to see the sensor values displayed on the LEDs.