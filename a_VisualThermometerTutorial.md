### @activities true
### @explicitHints true

# Greenhouse Visual Thermometer

## Simple Temperature Indicator
### Introduction Step @unplugged
Learn how to visually represent temperature using the status ZIP LEDs on the Evironmental Control Board.

![Environmental Control Board with status LEDs on](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/status-leds-SMALL.png)

### Step 1
The first thing to do is to set up the ZIP LEDs and create the status LEDs range.
From the ``||kitronik_smart_greenhouse.ZIP LEDs||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category, add the ``||variables:set zipLEDs to||`` ``||kitronik_smart_greenhouse.Smart Greenhouse with 8 ZIP LEDs||`` block to the ``||basic:on start||`` section, followed by the ``||variables:set statusLEDs||`` block.  
Also, to show that temperature is being displayed, add a ``||basic:show string "T"||`` block at the end of the ``||basic:on start||`` section.

#### ~ tutorialhint
```blocks
let zipLEDs = kitronik_smart_greenhouse.createGreenhouseZIPDisplay(8)
let statusLEDs = zipLEDs.statusLedsRange()
basic.showString("T")
```

### Step 2
Next, create a new variable called ``||variables:temperature||``. This will be used to store the temperature reading from the sensor.  
In the ``||basic:forever||`` loop, ``||variables:set temperature to||`` ``||kitronik_smart_greenhouse.Read Temperature in °C||`` - this block can be found in the ``||kitronik_smart_greenhouse.Sensors||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category.

#### ~ tutorialhint
```blocks
basic.forever(function () {
    temperature = kitronik_smart_greenhouse.temperature(TemperatureUnitList.C)
})
```

### Step 3
Now that the temperature reading is stored, it can be used to determine the status LED position and colour.  
To do this, an ``||logic:if else if||`` block will be used (from the ``||logic:Logic||`` category) to compare the reading with some preset temperature boundaries.
Add in an ``||logic:if||`` block to the ``||basic:forever||`` loop and press the ``||logic:+||`` icon at the bottom of the block 3 times. This will add 2 ``||logic:else if||`` statements and an ``||logic:else||`` statement - remove the ``||logic:else||`` by pressing the ``||logic:-||``.

#### ~ tutorialhint
![Adding else if statements](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/visual-thermometer-adding-if-else.gif)

### Step 4
There are 3 status LEDs, so it makes sense to have 3 temperature 'zones' - cold, ideal and hot. For plants, 20-30°C is a good growing temperature, so that can be the 'Ideal' range. For 'Cold', less than 20°C, and for 'Hot', greater than 30°C.  
In the first ``||logic:if||`` statement, check whether ``||variables:temperature||`` is less than 20. In the second statement, check whether ``||variables:temperature||`` is greater than or equal to 20 ``||logic:and||`` less than or equal to 30. Finally, in the third statement, check whether ``||variables:temperature||`` is greater than 30.

#### ~ tutorialhint
```blocks
basic.forever(function () {
    temperature = kitronik_smart_greenhouse.temperature(TemperatureUnitList.C)
    if (temperature < 20) {
        
    } else if (temperature >= 20 && temperature <= 30) {
        
    } else if (temperature > 30) {
        
    }
})
```

### Step 5
Having set up the temperature zone boundaries, different LEDs can now be set to particular colours inside the ``||logic:if||`` statements.  
For ``||variables:temperature||`` ``||logic:< 20||``, ``||kitronik_smart_greenhouse.set ZIP LED 0 to blue||`` (make sure to change the first drop-down to ``||variables:statusLEDs||``).
For ``||variables:temperature||`` ``||logic:≥ 20 and ≤ 30||``, ``||kitronik_smart_greenhouse.set ZIP LED 1 to green||``, and for ``||variables:temperature||`` ``||logic:> 30||``, ``||kitronik_smart_greenhouse.set ZIP LED 2 to red||``.

#### ~ tutorialhint
```blocks
let statusLEDs: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
basic.forever(function () {
    temperature = kitronik_smart_greenhouse.temperature(TemperatureUnitList.C)
    if (temperature < 20) {
        statusLEDs.setZipLedColor(0, kitronik_smart_greenhouse.colors(ZipLedColors.Blue))
    } else if (temperature >= 20 && temperature <= 30) {
        statusLEDs.setZipLedColor(1, kitronik_smart_greenhouse.colors(ZipLedColors.Green))
    } else if (temperature > 30) {
        statusLEDs.setZipLedColor(2, kitronik_smart_greenhouse.colors(ZipLedColors.Red))
    }
})
```

### Step 6
The last step is to make the ZIP LED settings actually display. From the ``||kitronik_smart_greenhouse.ZIP LEDs||`` section, add a ``||variables:statusLEDs||`` ``||kitronik_smart_greenhouse.show||`` block **after** the ``||logic:if else if||`` block in the ``||basic:forever||`` loop. To make sure only one LED turns on at once, add a ``||variables:statusLEDs||`` ``||kitronik_smart_greenhouse.clear||`` block just **before** the ``||logic:if else if||`` block.  
Finally, from the ``||basic:Basic||`` category, add a 1 second ``||basic:pause||`` at the end of the ``||basic:forever||`` loop - this will make the program check the temperature once a second, rather than all the time.

#### ~ tutorialhint
```blocks
let statusLEDs: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
basic.forever(function () {
    temperature = kitronik_smart_greenhouse.temperature(TemperatureUnitList.C)
    statusLEDs.clear()
    if (temperature < 20) {
        statusLEDs.setZipLedColor(0, kitronik_smart_greenhouse.colors(ZipLedColors.Blue))
    } else if (temperature >= 20 && temperature <= 30) {
        statusLEDs.setZipLedColor(1, kitronik_smart_greenhouse.colors(ZipLedColors.Green))
    } else if (temperature > 30) {
        statusLEDs.setZipLedColor(2, kitronik_smart_greenhouse.colors(ZipLedColors.Red))
    }
    statusLEDs.show()
    basic.pause(1000)
})
```

### Step 7
Click ``|Download|`` and transfer the code to the Environmental Control Board.  
Try putting the board in locations with different temperatures to see the ZIP LEDs change.

## Full Visual Thermometer
### Introduction Step @unplugged
Now that a basic temperature indicator is working, more detail can be added to show small variations in temperature.

### Step 1
The ``||basic:on start||`` block will stay the same, as will the structure of the ``||basic:forever||`` loop, there will just be a few more ``||logic:else if||`` statements.  
Start by adding 6 more ``||logic:else if||`` statements using the ``||logic:+||`` (and ``||logic:-||``) icons, and then delete the 3 ``||kitronik_smart_greenhouse.set ZIP LED||`` blocks from inside the original statements.

### Step 2
Make sure that every ``||logic:if||`` statement section has a ``||variables:temperature||`` comparison statement (don't worry about the actual values yet). The first ``||logic:if||`` should just check for **less than**, the final ``||logic:else if||`` should just check for **greater than**, and all the statements inbetween should have two comparisons with an ``||logic:and||`` inbetween.

#### ~ tutorialhint
Right click and duplicate the ``||logic:and||`` statements from first program to make things easier.

### Step 3
Set the ``||variables:temperature||`` comparison ranges and the status ZIP LED colour patterns as shown in the table below:  

|  Temperature  |     ZIP LEDs    | ¦ ¦ |  Temperature |    ZIP LEDs    |
|:-------------:|:---------------:|:---:|:------------:|:--------------:|
| <0            | 3 Blue          | ¦ ¦ | >30 and <33  | 1 Red, 2 Green |
| >=0 and <10   | 2 Blue          | ¦ ¦ | >=33 and <35 | 1 Red          |
| >=10 and <20  | 1 Blue          | ¦ ¦ | >=35 and <40 | 2 Red          |
| >=20 and <25  | 1 Blue, 2 Green | ¦ ¦ | >40          | 3 Red          |
| >=25 and <=30 | 3 Green         | ¦ ¦ |              |                |

#### ~ tutorialhint
For the instances where all 3 ZIP LEDs are the same colour, use the single ``||kitronik_smart_greenhouse.set color||`` block:  
```blocks
let statusLEDs: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
statusLEDs.setColor(kitronik_smart_greenhouse.colors(ZipLedColors.Blue))
```

### Step 4
CODING COMPLETE! Click ``|Download|`` and transfer the code to the Environmental Control Board to see a better representation of the temperature.
