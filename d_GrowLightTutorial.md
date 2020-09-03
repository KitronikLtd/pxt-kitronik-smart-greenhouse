### @activities true
### @explicitHints true

# ZIP Stick Grow Lamp

## Installing the ZIP Stick
### Introduction Step @unplugged
Light is one of the three ingredients - along with carbon dioxide and water - required for photosynthesis, the process by which plants produce their food. So. plants need light to grow - this is as well known fact. However, what might be less well known is that the colour of the light affects how well the photosynthesis is carried out. The red line on the graph below shows how the rate of photosynthesis is impacted by different colours of light.  
  
![Photosynthesis Rate vs Light Wavelenght graph](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/photosynthesis-vs-wavelength.jpg)
*Photosynthetic Rate and Light Absorption, chart, viewed 3 September 2020, <https://kids.britannica.com/students/assembly/view/217902>.*
  
As the graph shows, blue and red light are much more effective for photosynthesis, although green/yellow light does still play a part. This is something indoor plant growers have to think about very carfeully as they will need to provide artifical light for their plants, and the correct mix of colours will produce the best plants.  
  
The ZIP Stick provided with the Smart Greenhouse Kit has fully controllable RGB LEDs and is intended to be used as a grow lamp for the greenhouse. This tutorial will go through installing the ZIP Stick in the greenhouse, and then controlling both the colour and the brightness of the LEDs.

### Step 1 @unplugged
Before the ZIP Stick is programmed, it needs to be plugged in and mounted on the greenhouse correctly.  
The ZIP Stick can either be mounted on the inside or outside of the roof, slotting the folding tabs into the holes on the ZIP Stick. The extension lead is then used to connect the ZIP Stick to the Environmental Control Board. Make sure that the pins are matched correctly, with **OUT** on the Control Board linking to **DIN** on the ZIP Stick.

![Picture of ZIP Stick mounted in greenhouse](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/photosynthesis-vs-wavelength.jpg)

## Changing Colour
### Step 1
The first thing to do is to set up the ZIP LEDs and create the status LEDs range.
From the ``||kitronik_smart_greenhouse.ZIP LEDs||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category, add the ``||variables:set zipLEDs to||`` ``||kitronik_smart_greenhouse.Smart Greenhouse with 8 ZIP LEDs||`` block to the ``||basic:on start||`` section, followed by the ``||variables:set statusLEDs||`` block.

#### ~ tutorialhint
```blocks
let zipLEDs = kitronik_smart_greenhouse.createGreenhouseZIPDisplay(8)
let statusLEDs = zipLEDs.statusLedsRange()
```



### Step 4
CODING COMPLETE! Click ``|Download|`` and transfer the code to the Environmental Control Board to see a better representation of the temperature.