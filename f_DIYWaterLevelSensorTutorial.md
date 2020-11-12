### @activities true
### @explicitHints true

# DIY Water Level Sensor

## Making the Sensor
### Introduction Step @unplugged
**Note:** There are two versions of the 'Making the Sensor' instructions - one for the Smart Greenhouse Kit and the other for a separate water container.  
  
This tutorial will demonstrate how to make a water level sensor for the Smart Greenhouse water supply. The sensor will set off an alarm if the water container gets close to being empty, and will also stop the water pump being used until the container is refilled.

As well as the Greenhouse and water pump, or plant pot and water container, the following items will be required to make the sensor:  
* Sticky tape  
  
In addition, for the separate water container:  
* Sticky tape
* Scissors (always take care when using these)
  
![Tin Foil and clips water level sensor in water pump container](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/DIY-water-level-SMALL.png)

### Step 1
**Separate Water Tank Only - Skip if using Smart Greenhouse Kit**  
Cut two lengths of foil. One should reach all the way to the bottom of the container with about 3cm overhang at the top and 2cm flat on the bottom, and they other should finish about 2cm above the bottom of the container, again with about 3cm overhang at the top. Use tape to stick the ends to the outside of the container, and a bit above end on the inside. (**Note:** If the very ends of the foil are taped over inside the container, the sensor will not work correctly).

### Step 2
**Separate Water Tank Only - Skip if using Smart Greenhouse Kit**  
Using two crocodile leads, clipping them over the rim of the container, connect one foil strip to PIN0 on the Environmental Control Board, and the other strip to one of the 3V connections.

### Step 3
**Smart Greenhouse Kit Only - Skip if using separate water tank**  
Take two crocodile leads and place one at each end of the water tank, taping them in place so that they're nearly touching the bottom.  
Connect one lead tp PIN0 on the Environmental Control Board, and the other lead to one of the 3V connections.

### Step 4
The sensor is now complete, so fill the container/tank with water.

## Alarm and Water Pump Control
### Introduction Step @unplugged
Now that the sensor and container are ready, the low water level alarm and water pump control can be programmed.

This stage of the tutorial is going to require the water pump to be connected to the high power output on P13 on the Environmental Control Board (follow the instructions in the Smart Greenhouse booklet to connect the pump and fill the water tank). If using a separate water container, there also needs to be an empty container to pump water into.

### Step 1
The program is going to include an audio alarm, so the buzzer needs to be set up.  
From the top level of the ``||kitronik_smart_greenhouse.Greenhouse||`` category, add the ``||kitronik_smart_greenhouse.set music pin||`` block into the ``||basic:on start||`` section.

#### ~ tutorialhint
```blocks
kitronik_smart_greenhouse.setBuzzerPin()
```

### Step 2
In the ``||basic:forever||`` loop, the program needs to continously check whether the water level has dropped too low.  
To do this, add an ``||logic:if else||`` block from the ``||logic:Logic||`` category. The checking statement should read: ``||logic:if||`` ``||kitronik_smart_greenhouse.Analog read P0||`` ``||logic:< 300||``. (The ``||kitronik_smart_greenhouse.Analog read||`` block can be found in the ``||kitronik_smart_greenhouse.Inputs/Outputs||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category). '300' was chosen as the cut-off value as it was the best value establised for "Empty" through testing.

#### ~ tutorialhint
```blocks
basic.forever(function () {
    if (kitronik_smart_greenhouse.readIOPin(kitronik_smart_greenhouse.PinType.analog, kitronik_smart_greenhouse.IOPins.p0) < 300) {
        
    } else {
        
    }
})
```

### Step 3
To make an alarm sound when the water level drops too low, add a ``||music:play tone||`` block inside the ``||logic:if||`` section. Choose a note to play using the keyboard selector, and keep the length to ``||music:1 beat||``. If the code was left like this, the note would play constantly without a break once the alarm triggered. It would be better if there was a gap between each sound, so add a 1 second ``||basic:pause||`` after the ``||music:play tone||`` block.

#### ~ tutorialhint
```blocks
basic.forever(function () {
    if (kitronik_smart_greenhouse.readIOPin(kitronik_smart_greenhouse.PinType.analog, kitronik_smart_greenhouse.IOPins.p0) < 300) {
        music.playTone(392, music.beat(BeatFraction.Whole))
        basic.pause(1000)
    } else {
        
    }
})
```

### Step 4
The audio alarm is now complete, so the next thing to do is to provide control for the water pump.  
In order for other parts of the program to know that the water level is too low, a variable flag needs to be changed. Create a new variable called ``||variables:waterEmpty||``. At the start of the ``||logic:if||`` section, ``||variables:set waterEmpty to||`` ``||logic:true||``, and in the ``||logic:else||`` section, set it to ``||logic:false||``.

#### ~ tutorialhint
```blocks
basic.forever(function () {
    if (kitronik_smart_greenhouse.readIOPin(kitronik_smart_greenhouse.PinType.analog, kitronik_smart_greenhouse.IOPins.p0) < 300) {
        waterEmpty = true
        music.playTone(392, music.beat(BeatFraction.Whole))
        basic.pause(1000)
    } else {
        waterEmpty = false
    }
})
```

### Step 5
Now add in an ``||input:on button A pressed||`` block from the ``||input:Input||`` category, and inside place an ``||logic:if||`` block.  
Inside this new ``||logic:if||`` section will be the code to actually turn the water pump on, so we only want to stop this running if ``||variables:waterEmpty||`` is false, or in other words, **not** true. Make the ``||logic:if||`` statement read: ``||logic:if not||`` ``||variables:waterEmpty||``. 

#### ~ tutorialhint
```blocks
input.onButtonPressed(Button.A, function () {
    if (!(waterEmpty)) {
        
    }
})
```

### Step 6
Finally, the actual water pump pin control. From the ``||kitronik_smart_greenhouse.Inputs/Outputs||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category add in two ``||kitronik_smart_greenhouse.turn high power P13||`` blocks, the first one should turn the pin **ON** and the second should turn the pin **OFF**. Separate the blocks with a 2 second ``||basic:pause||``.  
Now when ``||input:button A||`` is pressed, as long as there is enough water, the pump will turn on for 2 seconds.

#### ~ tutorialhint
```blocks
input.onButtonPressed(Button.A, function () {
    if (!(waterEmpty)) {
        kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(true))
        basic.pause(2000)
        kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(false))
    }
})
```

### Step 7
CODING COMPLETE! Click ``|Download|`` and transfer the code to the Environmental Control Board.  
Run the pump until the water level drops low enough and check that the alarm sounds, and that the pump will not switch on.