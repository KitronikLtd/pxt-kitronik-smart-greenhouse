### @activities true
### @explicitHints true

# ZIP Stick Grow Lamp

## Installing the ZIP Stick
### Introduction Step @unplugged
Light is one of the three ingredients - along with carbon dioxide and water - required for photosynthesis, the process by which plants produce their food. So, plants need light to grow - this is as well known fact. However, what might be less well known is that the colour of the light affects how well the photosynthesis is carried out. The red line on the graph below shows how the rate of photosynthesis is impacted by different colours of light.  
  
![Photosynthesis Rate vs Light Wavelenght graph](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/photosynthesis-vs-wavelength.jpg)
*Photosynthetic Rate and Light Absorption, chart, viewed 3 September 2020, <https://kids.britannica.com/students/assembly/view/217902>.*
  
As the graph shows, blue and red light are much more effective for photosynthesis, although green/yellow light does still play a part. This is something indoor plant growers have to think about very carefully as they will need to provide artificial light for their plants, and the correct mix of colours will produce the best plants.  
  
The ZIP Stick provided with the Smart Greenhouse Kit has fully controllable RGB LEDs and is intended to be used as a grow lamp for the greenhouse. This tutorial will go through installing the ZIP Stick in the greenhouse, and then controlling both the colour and the brightness of the LEDs.

### Step 1 @unplugged
Before the ZIP Stick is programmed, it needs to be plugged in and mounted on the greenhouse correctly.  
The ZIP Stick fits into the slot on the greenhouse roof - it can be held in place with some sticky tape. The extension lead is then used to connect the ZIP Stick to the Environmental Control Board. Make sure that the pins are matched correctly, with **DOUT** on the Control Board linking to **DIN** on the ZIP Stick.

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

### Step 2
In order to see how well plants grow under different colour lights, there needs to be a way to switch between the colours displayed on the ZIP Stick.  
To get started, create a new variables called ``||variables:colourSetting||``, and, in the ``||basic:on start||`` section, set it to be 0.

#### ~ tutorialhint
```blocks
let colourSetting = 0
let zipLEDs = kitronik_smart_greenhouse.createGreenhouseZIPDisplay(8)
let zipStick = zipLEDs.zipStickRange()
colourSetting = 0
```

### Step 3
Next, add an ``||logic:if else||`` block to the ``||basic:forever|||`` loop, use the ``||logic:+||`` icon to add **5** ``||logic:else if||`` statements, and then use the ``||logic:-||`` icon to remove the ``||logic:else||`` statement.

#### ~ tutorialhint
```blocks
basic.forever(function () {
    if (true) {
        
    } else if (false) {
        
    } else if (false) {
        
    } else if (false) {
        
    } else if (false) {
        
    } else if (false) {
        
    }
})
```

### Step 4
Each ``||logic:if||`` condition statement will be very similar. Starting with the first ``||logic:if||`` statement, make it check whether ``||variables:colourSetting||`` ``||logic:= 0||``, then, for each ``||logic:else if||`` statement going down, check whether ``||variables:colourSetting||`` is any of the numbers **1, 2, 3, 4 or 5**.

#### ~ tutorialhint
```blocks
basic.forever(function () {
    if (colourSetting == 0) {
        
    } else if (colourSetting == 1) {
        
    } else if (colourSetting == 2) {
        
    } else if (colourSetting == 3) {
        
    } else if (colourSetting == 4) {
        
    } else if (colourSetting == 5) {
        
    }
})
```

### Step 5
The program now has 6 spaces for ZIP Stick grow lamp colour settings, so the next thing to do is provide some setting options.  
In the first four ``||logic:if||`` statement sections, use the ``||kitronik_smart_greenhouse.show colour||`` block from the ``||kitronik_smart_greenhouse.ZIP LEDs||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category to display the colours: **white**, ``||variables:red||``, ``||kitronik_smart_greenhouse.green||`` and ``||basic:blue||``. Remember to change the variable drop-down to ``||variables:zipStick||``.

#### ~ tutorialhint
```blocks
let zipStick: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
basic.forever(function () {
    if (colourSetting == 0) {
        zipStick.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.White))
    } else if (colourSetting == 1) {
        zipStick.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.Red))
    } else if (colourSetting == 2) {
        zipStick.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.Green))
    } else if (colourSetting == 3) {
        zipStick.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.Blue))
    } else if (colourSetting == 4) {
        
    } else if (colourSetting == 5) {
        
    }
})
```

### Explanation @unplugged
To achieve the most effective photosynthesis, the light shining on the plants should match the colour blend best suited for photosynthesis (the graph in the introduction). That means quite a lot of red, quite a lot of blue, and a bit of green - which ends up as a purple colour. This is going to be the colour for ``||variables:colourSetting|`` option **4**.

### Step 6
Add a ``||kitronik_smart_greenhouse.show colour||`` block to the option 4 ``||logic:else if||`` section, but this time, rather than selecting a colour from the drop-down list, insert a ``||kitronik_smart_greenhouse.red 255 green 255 blue 255||`` block in it's place. This allows the individual colour settings to be customised.  
Set the colours to: **red** = 255, **green** = 75 and **blue** = 200.

#### ~ tutorialhint
```blocks
let zipStick: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
basic.forever(function () {
    if (colourSetting == 0) {
        zipStick.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.White))
    } else if (colourSetting == 1) {
        zipStick.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.Red))
    } else if (colourSetting == 2) {
        zipStick.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.Green))
    } else if (colourSetting == 3) {
        zipStick.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.Blue))
    } else if (colourSetting == 4) {
        zipStick.showColor(kitronik_smart_greenhouse.rgb(220, 75, 200))
    } else if (colourSetting == 5) {
        
    }
})
```

### Step 7
It would be good to have the option to turn off the lights, so add a ``||kitronik_smart_greenhouse.clear||`` followed by a ``||kitronik_smart_greenhouse.show||`` to the ``||variables:colourSetting||`` option **5** ``||logic:else if||`` section.

#### ~ tutorialhint
```blocks
let zipStick: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
basic.forever(function () {
    if (colourSetting == 0) {
        zipStick.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.White))
    } else if (colourSetting == 1) {
        zipStick.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.Red))
    } else if (colourSetting == 2) {
        zipStick.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.Green))
    } else if (colourSetting == 3) {
        zipStick.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.Blue))
    } else if (colourSetting == 4) {
        zipStick.showColor(kitronik_smart_greenhouse.rgb(220, 75, 200))
    } else if (colourSetting == 5) {
        zipStick.clear()
        zipStick.show()
    }
})
```

### Step 8
Finally, for this stage, now that all the colour options are available, there needs to be a way of switching between them.  
From the ``||input:Input||`` category, add an ``||input:on button pressed||`` block and changed the drop-down to be ``||input:A+B||``. Inside that, add an ``||logic:if else||`` statement. Pressing ``||input:buttons A+B||`` needs to cycle through the ``||variables:colourSetting||`` options, so in the ``||logic:else||`` section, add a ``||variables:change colourSetting by 1||`` block - this will be the default action. As it needs to cycle through, make the ``||logic:if||`` statement read ``||variables:colourSetting = 5||``, and add a ``||variables:set colourSetting to 0||`` block (also add one of these to the end of the ``||basic:on start||`` section - this will make the lights start as white).

#### ~ tutorialhint
```blocks
let colourSetting = 0
let zipLEDs = kitronik_smart_greenhouse.createGreenhouseZIPDisplay(8)
let zipStick = zipLEDs.zipStickRange()
colourSetting = 0
input.onButtonPressed(Button.AB, function () {
    if (colourSetting == 5) {
        colourSetting = 0
    } else {
        colourSetting += 1
    }
})
```

### Step 9
Click ``|Download|`` and transfer the code to the Environmental Control Board, and then try changing the colour by pressing ``||input:buttons A+B||`` together.

## Changing Brightness
### Introduction Step @unplugged
The program is able to change the colour of the light shining on the plants in the greenhouse, but they are always the same brightness at the moment. It would be good to have control of that as well.

### Step 1
Start by creating a new variable called ``||variables:brightness||`` and set it **128** at the end of the ``||basic:on start||`` section. After that block, add a ``||kitronik_smart_greenhouse.set brightness||`` block and insert the ``||variables:brightness||`` variable block in place of the number. Remember to change the drop-down to be ``||variables:zipStick||``. 

#### ~ tutorialhint
```blocks
let brightness = 0
let colourSetting = 0
let zipLEDs = kitronik_smart_greenhouse.createGreenhouseZIPDisplay(8)
let zipStick = zipLEDs.zipStickRange()
colourSetting = 0
brightness = 128
zipStick.setBrightness(brightness)
```

### Step 2
Just as ``||input:buttons A+B||`` together change the colour settings, ``||input:A||`` individually will reduce the brightness and ``||input:B||`` individually will increase the brightness.  
Add in an ``||input:on button A pressed||`` block and inside it put an ``||logic:if else||`` block. Similar to the ``||variables:colourSetting||``, there will be a default action to decrease brightness, and another action to stop it going below 0 (which is impossible). In the ``||logic:else||`` section, add a ``||variables:change brightness by -16||`` block, and make the ``||logic:if||`` statement check whether ``||variables:brightness||`` ``||logic:≤ 0||``. The action in the second case should ``||variables:set brightness to 0||``.

#### ~ tutorialhint
```blocks
input.onButtonPressed(Button.A, function () {
    if (brightness <= 0) {
        brightness = 0
    } else {
        brightness += -16
    }
})
```

### Step 3
Repeat the previous step with an ``||input:on button B pressed||`` block, but with a few alterations. The ``||logic:if||`` statement needs to check whether ``||variables:brightness||`` ``||logic:≥ 255||``, then ``||variables:set brightness to 255||`` if this is true, and finally, the ``||logic:else||`` action should ``||variables:change brightness by 16||``. 

#### ~ tutorialhint
```blocks
input.onButtonPressed(Button.B, function () {
    if (brightness >= 255) {
        brightness = 255
    } else {
        brightness += 16
    }
})
```

### Step 4
The ``||variables:brightness||`` variable can now be changed, but currently this has no impact on the actual ZIP LED brightness.  
At the start of the ``||basic:forever||`` loop, add a ``||kitronik_smart_greenhouse.set brightness||`` block with a ``||variables:brightness||`` variable block in place of the number. Follow this with a ``||kitronik_smart_greenhouse.show||`` block. Remember to change both of the variable drop-downs to ``||variables:zipStick||``.

#### ~ tutorialhint
```blocks
let zipStick: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
basic.forever(function () {
    zipStick.setBrightness(brightness)
    zipStick.show()
    if (colourSetting == 0) {
        zipStick.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.White))
    } else if (colourSetting == 1) {
        zipStick.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.Red))
    } else if (colourSetting == 2) {
        zipStick.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.Green))
    } else if (colourSetting == 3) {
        zipStick.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.Blue))
    } else if (colourSetting == 4) {
        zipStick.showColor(kitronik_smart_greenhouse.rgb(220, 75, 200))
    } else if (colourSetting == 5) {
        zipStick.clear()
        zipStick.show()
    }
})
```

### Step 5
CODING COMPLETE! Click ``|Download|`` and transfer the code to the Environmental Control Board and then try out varying the colour and the brightness.