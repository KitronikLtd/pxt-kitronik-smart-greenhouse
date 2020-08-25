### @activities true
### @explicitHints true

# Greenhouse Visual Thermometer

## Introduction 
### Introduction Step @unplugged
Learn how to visually represent temperature using the status ZIP LEDs on the Evironmental Control Board.

![Ticking Halo HD Clock animation](https://KitronikLtd.github.io/pxt-kitronik-halohd/assets/Ticking-Clock-Animation.gif)

### Step 1
From the first tutorial, we had the code for displaying the time. 
Start by recreating that program, but remove the ``||kitronik_halo_hd.Set Time||`` block from the ``||input:on button pressed||`` block.

#### ~ tutorialhint
```blocks
let temperature = 0
let zipLEDs = kitronik_ec_board.createECZIPDisplay(3)
let statusLEDs = zipLEDs.statusLedsRange()
basic.showString("T")
basic.forever(function () {
    temperature = kitronik_ec_board.temperature(TemperatureUnitList.C)
    zipLEDs.clear()
    if (temperature < 20) {
        statusLEDs.setZipLedColor(0, kitronik_ec_board.colors(ZipLedColors.Blue))
    } else if (temperature >= 20 && temperature <= 30) {
        statusLEDs.setZipLedColor(1, kitronik_ec_board.colors(ZipLedColors.Green))
    } else if (temperature > 30) {
        statusLEDs.setZipLedColor(2, kitronik_ec_board.colors(ZipLedColors.Red))
    }
    zipLEDs.show()
    basic.pause(1000)
})
```