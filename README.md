# pxt-kitronik-smart-greenhouse


> Open this page at [https://kitronikltd.github.io/pxt-kitronik-smart-greenhouse/](https://kitronikltd.github.io/pxt-kitronik-smart-greenhouse/)

Custom blocks for the Smart Greenhouse for BBC micro:bit (www.kitronik.co.uk/5699).  
The blocks in this extension are in five main groups: ZIP LEDs, Clock, Sensors, Inputs/Outputs and Data Logging.

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **smart greenhouse** and import

## ZIP LEDs
  
The ZIP LEDs section contains blocks for controlling the 3 onboard status LEDs and any others connected to the ZIP LED OUT port (such as the supplied ZIP Stick).  
**Note:** Any block which does not have "show" in the name needs to be followed by a ``||kitronik_smart_greenhouse.show||`` block to make the changes visible.  
  
The first block sets up the ZIP LEDs as a variable, enabling them to be controlled in the program. The default number is "8", as this covers the onboard LEDs and the external ZIP Stick.  
The next two blocks create ranges for each of these, ``||variables:statusLEDs||`` and ``||variables:zipStick||``, so that they can be controlled separately.    
```blocks
let zipLEDs = kitronik_smart_greenhouse.createGreenhouseZIPDisplay(8)
let statusLEDs = zipLEDs.statusLedsRange()
let zipStick = zipLEDs.zipStickRange()
```
  
To set the colour of all the ZIP LEDs (or a whole range), use the ``||kitronik_smart_greenhouse.set color||`` block. To view the changes there needs to be a ``||kitronik_smart_greenhouse.show||`` block after this block.  
```blocks
let zipLEDs: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
zipLEDs.setColor(kitronik_smart_greenhouse.colors(ZipLedColors.Red))
```
  
To set the colour of all the ZIP LEDs (or a whole range) **and** then show the change, use the ``||kitronik_smart_greenhouse.show color||`` block.  
```blocks
let zipLEDs: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
zipLEDs.showColor(kitronik_smart_greenhouse.colors(ZipLedColors.Red))
```
  
To set the colour of an individual LED, use the ``||kitronik_smart_greenhouse.set ZIP LED||`` block. To view the changes there needs to be a ``||kitronik_smart_greenhouse.show||`` block after this block.  
```blocks
let zipLEDs: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
zipLEDs.setZipLedColor(1, kitronik_smart_greenhouse.colors(ZipLedColors.Green))
```
  
The ``||kitronik_smart_greenhouse.show||`` block makes visible the changes made since the last ``||kitronik_smart_greenhouse.show||``.  
```blocks
let zipLEDs: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
zipLEDs.show()
```
  
``||kitronik_smart_greenhouse.show rainbow||`` displays a rainbow pattern across the LEDs **and** makes the changes visible straight away.  
```blocks
let zipLEDs: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
zipLEDs.showRainbow(1, 360)
```
  
To turn the LEDs off, use the ``||kitronik_smart_greenhouse.clear||`` block. To view the changes there needs to be a ``||kitronik_smart_greenhouse.show||`` block after this block.  
```blocks
let zipLEDs: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
zipLEDs.clear()
```
  
``||kitronik_smart_greenhouse.rotate||`` moves each LED colour setting along the chain, and then takes the end one back to the first. To view the changes there needs to be a ``||kitronik_smart_greenhouse.show||`` block after this block.  
```blocks
let zipLEDs: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
zipLEDs.rotate(1)
```
  
The brightness of the LEDs can be controlled with the ``||kitronik_smart_greenhouse.set brightness||`` block. To view the changes there needs to be a ``||kitronik_smart_greenhouse.show||`` block after this block.  
```blocks
let zipLEDs: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
zipLEDs.setBrightness(180)
```
  
The ``||kitronik_smart_greenhouse.range||`` block allows a variable to be created which represents a selection of the LEDs.  
```blocks
let zipLEDs: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
let range1 = zipLEDs.range(0, 6)
```
  
The final four blocks in the ZIP LEDs section are all different ways of choosing or setting a colour for the LEDs.  
* The first is a handy drop-down list of preset colours.
* The second allows the individual Red, Green and Blue components of the colour to be manually set.
* The third changes the Hue, moving round a colour wheel (0-360, red through green and blue and then back to red).
* The fourth allows the wavelength of light to be set (470-625nm, blue to red).
```blocks
let zipLEDs: kitronik_smart_greenhouse.greenhouseZIPLEDs = null
zipLEDs.setZipLedColor(0, kitronik_smart_greenhouse.colors(ZipLedColors.Purple))
zipLEDs.setZipLedColor(1, kitronik_smart_greenhouse.rgb(160, 240, 50))
zipLEDs.setZipLedColor(2, kitronik_smart_greenhouse.hueToRGB(157))
zipLEDs.setZipLedColor(3, kitronik_smart_greenhouse.wavelength(579))
```
  
## Clock
  
These blocks are laid out in groups of linked functionality.  
  
### Set Time
  
These blocks are used to set the time on the Real Time Clock (RTC) chip. This can either be done with one block covering hours, minutes and seconds, or individually for each element.  
```blocks
kitronik_smart_greenhouse.setTime(11, 45, 30)
kitronik_smart_greenhouse.writeHours(11)
kitronik_smart_greenhouse.writeMinutes(45)
kitronik_smart_greenhouse.writeSeconds(30)
```
  
### Set Date
  
These blocks are used to set the date on the RTC chip. This can either be done with one block covering day, month and year (DD/MM/YY), or individually for each element.  
```blocks
kitronik_smart_greenhouse.setDate(10, 9, 20)
kitronik_smart_greenhouse.writeDay(10)
kitronik_smart_greenhouse.writeMonth(9)
kitronik_smart_greenhouse.writeYear(20)
```
  
### Read Time
  
These blocks are used to read the current time as either a string of the complete time, or the individual elements as numbers.  
```blocks
basic.showString(kitronik_smart_greenhouse.readTime())
basic.showNumber(kitronik_smart_greenhouse.readTimeParameter(TimeParameter.Hours))
basic.showNumber(kitronik_smart_greenhouse.readTimeParameter(TimeParameter.Minutes))
basic.showNumber(kitronik_smart_greenhouse.readTimeParameter(TimeParameter.Seconds))
```
  
### Read Date
  
These blocks are used to read the current date as either a string of the complete date, or the individual elements as numbers.  
```blocks
basic.showString(kitronik_smart_greenhouse.readDate())
basic.showNumber(kitronik_smart_greenhouse.readDateParameter(DateParameter.Day))
basic.showNumber(kitronik_smart_greenhouse.readDateParameter(DateParameter.Month))
basic.showNumber(kitronik_smart_greenhouse.readDateParameter(DateParameter.Year))
```
  
### Alarm
  
The ``||kitronik_smart_greenhouse.set alarm||`` block allows the user to input a time for an alarm to trigger either once, or repeating daily. The alarm can either be silenced by the user, or silenced automatically.  
```blocks
kitronik_smart_greenhouse.simpleAlarmSet(kitronik_smart_greenhouse.AlarmType.Single, 9, 30, kitronik_smart_greenhouse.AlarmSilence.autoSilence)
```
  
The ``||kitronik_smart_greenhouse.on alarm trigger||`` bracket block and ``||kitronik_smart_greenhouse.alarm triggered||`` block both allow actions to be carried out when the alarm goes off.  
```blocks
kitronik_smart_greenhouse.onAlarmTrigger(function () {
    music.startMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)
})
basic.forever(function () {
    if (kitronik_smart_greenhouse.simpleAlarmCheck()) {
        music.startMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)
    }
})
```
  
The ``||kitronik_smart_greenhouse.turn off alarm||`` block allows the alarm to be silenced by the user.  
```blocks
input.onButtonPressed(Button.A, function () {
    kitronik_smart_greenhouse.simpleAlarmOff()
})
```
  
## Sensors
  
These blocks are used to take Pressure (Pa or mBar), Temperature (°C or °F) and Humidity (%) readings, which output as numbers.  
```blocks
basic.showNumber(kitronik_smart_greenhouse.pressure(PressureUnitList.Pa))
basic.showNumber(kitronik_smart_greenhouse.temperature(TemperatureUnitList.C))
basic.showNumber(kitronik_smart_greenhouse.humidity())
```
  
## Inputs/Outputs
  
These blocks are laid out in groups of linked functionality.  
  
### General Inputs/Outputs
  
These block are used to carry out reads and writes (both analogue and digital) for Pins 0, 1 and 2.  
```blocks
basic.showNumber(kitronik_smart_greenhouse.readIOPin(kitronik_smart_greenhouse.PinType.analog, kitronik_smart_greenhouse.IOPins.p1))
basic.showNumber(kitronik_smart_greenhouse.readIOPin(kitronik_smart_greenhouse.PinType.digital, kitronik_smart_greenhouse.IOPins.p0))
kitronik_smart_greenhouse.digitalWriteIOPin(kitronik_smart_greenhouse.IOPins.p2, 0)
kitronik_smart_greenhouse.analogWriteIOPin(kitronik_smart_greenhouse.IOPins.p1, 545)
```
  
### High Power Outputs
  
This block is used to control the high power outputs linked to Pins 13 and 14. Their default mode is to just switch the output ON or OFF.
```blocks
input.onButtonPressed(Button.A, function () {
    kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(true))
    kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin14, kitronik_smart_greenhouse.onOff(false))
})
```
They also have another mode, where the duty cycle (0-100%) of the output can be adjusted (for example, to provide speed control to a motor).
```blocks
input.onButtonPressed(Button.B, function () {
    kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(true), 25)
    kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin14, kitronik_smart_greenhouse.onOff(true), 50)
})
```
  
### Servo
  
This block is used to control a servo connected to the output on Pin 15, setting the angle between 0° and 180°.  
```blocks
kitronik_smart_greenhouse.servoWrite(90)
```
  
## Data Logging
  
The Data Logging blocks are used to organise and format measured information, and then transfer this information to a computer connected to the micro:bit via USB.  
The blocks are laid out in groups of linked functionality.  
  
### Setup
  
This group of blocks is used to prepare the data formatting and transfer options.  
As shown in the example below, the first block is used to set the data transfer to be via USB; then the separation between pieces of data can be selected from four different options:  
* A tab
* A semicolon ("**;**")
* A comma ("**,**")
* A space  
The third block allows the user to choose whether or not to send the data entry line number, and the fourth block allows data entry column headings to be added (up to 10 in total). **Note:** Only the first 10 characters of a title will be transferred.  
```blocks
kitronik_smart_greenhouse.setDataForUSB()
kitronik_smart_greenhouse.selectSeparator(kitronik_smart_greenhouse.Separator.semicolon)
kitronik_smart_greenhouse.optionSendEntryNumber(kitronik_smart_greenhouse.ListNumber.Send)
kitronik_smart_greenhouse.addTitle("Time", "Temper", "Light")
```
  
### Entries
  
The ``||kitronik_smart_greenhouse.add data||`` block is used add a data entry to the data store (there is a maximum of 100 data entries, each able to include 10 pieces of information). **Note:** The information must be in a string format. If it is a numerical measurement, use a ``||text:convert to text||`` block from the ``||text:Text||`` category.  
```blocks
input.onButtonPressed(Button.A, function () {
    kitronik_smart_greenhouse.addData(kitronik_smart_greenhouse.readTime(), convertToText(kitronik_smart_greenhouse.temperature(TemperatureUnitList.C)), convertToText(input.lightLevel()))
})
```
The ``||kitronik_smart_greenhouse.clear all data||`` block does exactly what it says: it removes all the previously stored data entries.  
```blocks
input.onButtonPressed(Button.B, function () {
    kitronik_smart_greenhouse.clearData()
})
```
  
### Transfer
  
Once data has been collected, it will need to be transferred to a connected computer.  
All the data entries can be transmitted at once:  
```blocks
input.onButtonPressed(Button.A, function () {
    kitronik_smart_greenhouse.sendAllData()
})
```
Or an individual data entry can be sent:  
```blocks
input.onButtonPressed(Button.B, function () {
    kitronik_smart_greenhouse.sendSelectedData(15)
})
```
  
## License

MIT

## Supported targets

* for PXT/microbit