### @activities true
### @explicitHints true

# Greenhouse Visual Thermometer

## Simple Temperature Indicator
### Introduction Step @unplugged
Learn how to visually represent temperature using the status ZIP LEDs on the Evironmental Control Board.

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
Next, create a new variable called ``||variables:temperature||``. This will be used to store the temperature reading from the sensor.
In the ``||basic:forever||`` loop, ``||variables:set temperature to||`` ``||kitronik_environmental_board.Read Temperature in °C||`` - this block can be found in the ``||kitronik_environmental_board.Sensors||`` section of the ``||kitronik_environmental_board.Environmental||`` category.

#### ~ tutorialhint
```blocks
basic.forever(function () {
    temperature = kitronik_environmental_board.temperature(TemperatureUnitList.C)
})
```

### Step 3
Now that the temperature reading is stored, it can be used to determine the status LED position and colour.
To do this, an ``||logic:if else if||`` block will be used (from the ``||logic:Logic||`` category) to compare the reading with some preset temperature boundaries.
Add in an ``||logic:if||`` block to the ``||basic:forever||`` loop and press the ``||logic:+||`` icon at the bottom of the block 3 times. This will add 2 ``||logic:else if||`` statements and an ``||logic:else||`` statement - remove the ``||logic:else||`` by pressing the ``||logic:-||``.

#### ~ tutorialhint
![Adding else if statements](https://KitronikLtd.github.io/pxt-kitronik-ec-board/assets/visual-thermometer-adding-if-else.gif)

### Step 4
There are 3 status LEDs, so it makes sense to have 3 temperature 'zones' - cold, ideal and hot. For plants, 20-30°C is a good growing temperature, so that can be the 'Ideal' range. For 'Cold', less than 20°C, an for 'Hot', greater than 30°C.
In the first ``||logic:if||`` statement, check whether ``||variables:temperature||`` is less than 20. In the second statement, check whether ``||variables:temperature||`` is greater than or equal to 20 ``||logic:and||`` less than or equal to 30. Finally, in the third statement, check whether ``||variables:temperature||`` is greater than 30.

#### ~ tutorialhint
```blocks
basic.forever(function () {
    temperature = kitronik_environmental_board.temperature(TemperatureUnitList.C)
    if (temperature < 20) {
        
    } else if (temperature >= 20 && temperature <= 30) {
        
    } else if (temperature > 30) {
        
    }
})
```

### Step 5


## Changing Minutes



### Step 8
CODING COMPLETE! Let's click ``|Download|`` and transfer your code to the Halo HD and enjoy a colourful clock with time setting functionality.
