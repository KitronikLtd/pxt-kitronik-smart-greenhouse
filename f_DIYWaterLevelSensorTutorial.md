### @activities true
### @explicitHints true

# DIY Water Level Sensor

## Making the Sensor
### Introduction Step @unplugged
In this tutorial, common household items will be used to make a water level sensor for the water pump container. The sensor will set off an alarm if the water container gets close to being empty, and will also stop the water pump being used until the container is refilled.

In addition to the normal container for the water pump, the following items will be required to make the sensor:  
* Kitchen foil
* Sticky tape
* Scissors (always take care when using these)

### Step 1
Cut two lengths of foil. One should reach all the way to the bottom of the container with about 3cm overhang at the top and 2cm flat on the bottom, and they other should finish about 2cm above the bottom of the container, again with about 3cm overhang at the top. Use tape to stick the ends to the outside of the container, and a bit above end on the inside. (**Note:** If the very ends of the foil are taped over inside the container, the sensor will not work correctly).

### Step 2
Using two crocodile leads, clipping them over the rim of the container, connect one foil strip to PIN0 on the Environmental Control Board, and the other strip to one of the 3V onnections.

### Step 3
The sensor is now complete, so fill the container with water.

## Alarm and Water Pump Control
### Introduction Step @unplugged
Now that the sensor and container are ready, the low water level alarm and water pump control can be programmed.

This stage of the tutorial is going to require the water pump to be connected to the high power output on P13 on the Environmental Control Board (follow the instructions Smart Greenhouse booklet to connect and prime the water pump). There also needs to be an empty container to pump water into.

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
To make an alarm sound when the water level drops too low, add a ``||music:play tone||`` block 