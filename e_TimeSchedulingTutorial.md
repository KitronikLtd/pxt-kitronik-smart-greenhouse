### @activities true
### @explicitHints true

# Setting the Time and Water Scheduling

## Setting the Time and a Single Alarm
### Introduction Step @unplugged
In this tutorial, the Real Time Clock (RTC) on the Environmental Control Board will be used to create a watering schedule for plants.

This stage of the tutorial is going to require the water pump to be connected to the high power output on P13 on the Environmental Control Board (follow the instructions Smart Greenhouse booklet to connect and prime the water pump).

![Day/Night clock face with watering at set times](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/time-scheduling-SMALL.png)

### Step 1
In order for the clock to be used effectively, the time first needs to be set.  
From the ``||kitronik_smart_greenhouse.Clock||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category, add the ``||kitronik_smart_greenhouse.Set Time||`` block to the ``||basic:on start||`` section. Set the time to be a few mins in the future (this should give enough time to complete the tutorial and download the code; alternatively, complete the rest of the tutorial and set the current time just before downloading the code).  
**Note:** The time is set in 24 hour mode.  
To check that the time has set correctly, add an ``||input:on button A pressed||`` block, and inside, ``||basic:show string||`` ``||kitronik_smart_greenhouse.Read Time as String||`` (this block is also in the ``||kitronik_smart_greenhouse.Clock||`` section).

#### ~ tutorialhint
```blocks
kitronik_smart_greenhouse.setTime(12, 0, 0)
input.onButtonPressed(Button.A, function () {
    basic.showString(kitronik_smart_greenhouse.readTime())
})
```

### Step 2
Now that the time is set and the RTC is running, an alarm can be set to trigger the plants being watered.  
Again from the ``||kitronik_smart_greenhouse.Clock||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category, place a ``||kitronik_smart_greenhouse.set Single alarm||`` block at the end of the ``||basic:on start||`` section. Set the alarm time to be a short time after the initial clock setting - this will make it quicker and easier to check whether it's working! Make sure the alarm is in the ``||kitronik_smart_greenhouse.Auto Silence||`` mode.

#### ~ tutorialhint
```blocks
kitronik_smart_greenhouse.setTime(12, 0, 0)
kitronik_smart_greenhouse.simpleAlarmSet(kitronik_smart_greenhouse.AlarmType.Single, 12, 2, kitronik_smart_greenhouse.AlarmSilence.autoSilence)
```

### Step 3
The clock is running and an alarm has been set - now something needs to happen when the alarm goes off.  
There are two ways carrying out actions when an alarm has been triggered, the first of which makes use of an ``||logic:if||`` statement. Add a single ``||logic:if||`` statement to the ``||basic:forever||`` loop, and then, from the ``||kitronik_smart_greenhouse.Clock||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category, insert an ``||kitronik_smart_greenhouse.alarm triggered||`` block into the space which says ``||logic:true||`` in the ``||logic:if||`` statement (the alarm returns a **true** value when it triggers, which is what this statement looks for).

#### ~ tutorialhint
```blocks
basic.forever(function () {
    if (kitronik_smart_greenhouse.simpleAlarmCheck()) {
        
    }
})
```

### Step 4
Inside the ``||logic:if||`` section, add a ``||loops:repeat||`` loop, with the number of repeats set to **5**.  
Inside the loop, add a ``||kitronik_smart_greenhouse.turn high power P13 ON||`` block from the ``||kitronik_smart_greenhouse.Inputs/Outputs||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category. After this, add a 1 second ``||basic:pause||``, then turn **OFF** ``||kitronik_smart_greenhouse.high power P13||``, and finally add a 2 second ``||basic:pause||`` at the end. This section of code will now turn the water pump on for 1 second, turn it off for 2 seconds, and repeat this 5 times.

#### ~ tutorialhint
```blocks
basic.forever(function () {
    if (kitronik_smart_greenhouse.simpleAlarmCheck()) {
        for (let index = 0; index < 5; index++) {
            kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(true))
            basic.pause(1000)
            kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(false))
            basic.pause(2000)
        }
    }
})
```

### Step 5
Click ``|Download|`` and transfer the code to the Environmental Control Board.  
Leave the program running and check that the alarm triggers at the set time and turns the water pump on.

## Continuous Schedule
### Introduction Step @unplugged
Great! The water pump will now turn on when the alarm has been set. However, watering the plants just once won't be very good for their health, so the schedule needs to be continuous.

### Step 1
To make a continous schedule, a new alarm needs to be set everytime the current alarm is triggered. In this tutorial, there will always be a 1 hour gap between alarms, but gap could be any time value.  
To start with, create two new variables: ``||variables:alarmHour||`` and ``||variables:alarmMin||``. After the ``||kitronik_smart_greenhouse.Set Time||`` block in ``||basic:on start||``, ``||variables:set alarmHour to||`` the hour number in the ``||kitronik_smart_greenhouse.set alarm||`` block, and ``||variables:set alarmMin to||`` the minute number in the ``||kitronik_smart_greenhouse.set alarm||`` block. Then, replace the numbers in the ``||kitronik_smart_greenhouse.set alarm||`` block with the ``||variables:alarmHour||`` and ``||variables:alarmMin||`` varaibles.

#### ~ tutorialhint
```blocks
let alarmMin = 0
let alarmHour = 0
kitronik_smart_greenhouse.setTime(12, 0, 0)
alarmHour = 12
alarmMin = 30
kitronik_smart_greenhouse.simpleAlarmSet(kitronik_smart_greenhouse.AlarmType.Single, alarmHour, alarmMin, kitronik_smart_greenhouse.AlarmSilence.autoSilence)
```

### Step 2
The second method for carrying out actions when an alarm is triggered will now be used to set another alarm in an hours time.  
From the ``||kitronik_smart_greenhouse.Clock||`` section of the ``||kitronik_smart_greenhouse.Greenhouse||`` category, add in an ``||kitronik_smart_greenhouse.on alarm trigger||`` block section. Inside this, add an ``||logic:if else||`` statement. 

#### ~ tutorialhint
```blocks
kitronik_smart_greenhouse.onAlarmTrigger(function () {
    if (true) {
        
    } else {
        
    }
})
```

### Step 3
In the ``||logic:else||`` section, add in a ``||variables:change alarmHour by 1||`` block. This will be the default action, incrementing the alarm time by 1 hour throughout the day. However, when the time needs to change from 23:00 to 0:00, the ``||variables:alarmHour||`` needs to reset back to 0. To do this, insert an ``||logic:if||`` statement checking whether ``||variables:alarmHour||`` ``||logic:= 23||``. Then, inside the ``||logic:if||`` section, ``||variables:set alarmHour to 0||``.

#### ~ tutorialhint
```blocks
kitronik_smart_greenhouse.onAlarmTrigger(function () {
    if (alarmHour == 23) {
        alarmHour = 0
    } else {
        alarmHour += 1
    }
})
```

### Step 4
Finally, for this section, duplicate the ``||kitronik_smart_greenhouse.set Single alarm||`` block from the ``||basic:on start section||`` and add it to the end of the ``||kitronik_smart_greenhouse.on alarm trigger||`` block.

#### ~ tutorialhint
```blocks
kitronik_smart_greenhouse.onAlarmTrigger(function () {
    if (alarmHour == 23) {
        alarmHour = 0
    } else {
        alarmHour += 1
    }
    kitronik_smart_greenhouse.simpleAlarmSet(kitronik_smart_greenhouse.AlarmType.Single, alarmHour, alarmMin, kitronik_smart_greenhouse.AlarmSilence.autoSilence)
})
```

### Step 5
Click ``|Download|`` and transfer the code to the Environmental Control Board.  
Leave the program running and see the alarm trigger multiple times during the day.  
(To avoid waiting so long between each alarm, the code could be changed to set a new alarmm every minute instead).

## Schedule with Moisture Check
### Introduction Step @unplugged
The plants now have a continous watering schedule which will keep them growing nicely. However, depending on the external environmental conditions, the plants might not need watering every time the alarm comes round. Checking the soil moisture level first will mean they are only watered when they need it.  
  
This stage of the tutorial is going to require the water pump as before, and also the Prong connected to the Environmental Control Board using crocodile clips.  
Connect Prong 3V to one of the 3V pads, Prong GND to one of the GND pads and Prong P1 to the Pin1 pad. Stick it into a plant pot.

### Step 1
The inside of the ``||logic:if||`` statement in the ``||basic:forever||`` loop is going to be changing slightly, so to start with, temporarily drag the ``||loops:repeat||`` loop out and put it to one side.

#### ~ tutorialhint
![Drag repeat loop out and leave to one side](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/drag-repeat-loop-out.gif)

### Step 2
Next, place another ``||logic:if||`` statement inside the first one in the ``||basic:forever||`` loop. This second ``||logic:if||`` statement will check the soil moisture measurement. The checking statement should read: ``||logic:if||`` ``||kitronik_smart_greenhouse.Analog read P1||`` ``||logic:≤ 500 then||``. 

#### ~ tutorialhint
```block
basic.forever(function () {
    if (kitronik_smart_greenhouse.simpleAlarmCheck()) {
        if (kitronik_smart_greenhouse.readIOPin(kitronik_smart_greenhouse.PinType.analog, kitronik_smart_greenhouse.IOPins.p1) <= 500) {
            
        }
    }
})
```

### Step 3
Drag the ``||loops:repeat||`` loop back inside the second ``||logic:if||`` section. The program is now set up to only water the plant on an alarm trigger if it has got too dry.

#### ~ tutorialhint
```blocks
basic.forever(function () {
    if (kitronik_smart_greenhouse.simpleAlarmCheck()) {
        if (kitronik_smart_greenhouse.readIOPin(kitronik_smart_greenhouse.PinType.analog, kitronik_smart_greenhouse.IOPins.p1) <= 500) {
            for (let index = 0; index < 5; index++) {
                kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(true))
                basic.pause(1000)
                kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(false))
                basic.pause(2000)
            }
        }
    }
})
```

### Step 4
There is one last thing to do to improve the watering system. What happens if the plant gets too dry inbetween alarms? There needs to be another option for triggering the automatic watering.  
At the **end** of the ``||basic:forever||`` loop, add in another ``||logic:if||`` block. This time, the statement should read ``||logic:if||`` ``||kitronik_smart_greenhouse.Analog read P1||`` ``||logic:≤ 300 then||``, which means that the watering will only occur outside the alarm times if the plants becomes really dry.

#### ~ tutorialhint
```blocks
 basic.forever(function () {
    if (kitronik_smart_greenhouse.simpleAlarmCheck()) {
        if (kitronik_smart_greenhouse.readIOPin(kitronik_smart_greenhouse.PinType.analog, kitronik_smart_greenhouse.IOPins.p1) <= 500) {
            for (let index = 0; index < 5; index++) {
                kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(true))
                basic.pause(1000)
                kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(false))
                basic.pause(2000)
            }
        }
    }
    if (kitronik_smart_greenhouse.readIOPin(kitronik_smart_greenhouse.PinType.analog, kitronik_smart_greenhouse.IOPins.p1) <= 300) {
        
    }
})
```

### Step 5
The same watering code from the second ``||logic:if||`` section needs to be inside the third ``||logic:if||`` section, however, it can make the code very long to repeat the same blocks of code. A good way to avoid this problem is to make use of functions.  
To begin creating a function, click on the **Advanced** drop-down in the category list, open the ``||functions:Functions||`` category and click the **Make a Function...** button. This will open the function creation window.

### Step 6
In the function creation window, rename the function to ``waterPlants`` and then click **Done**.  
A new block, ``||functions:function waterPlants||``, will now have been added to the editing window. Drag the ``||loops:repeat||`` loop out of the ``||logic:if||`` statement and inside the function block.

#### ~ tutorialhint
![Create the waterPlants function](https://KitronikLtd.github.io/pxt-kitronik-smart-greenhouse/assets/create-function.gif)

### Step 7
Finally, from the ``||functions:Functions||`` category, add a ``||functions:call waterPlants||`` block to the second ``||logic:if||`` statement in place of the ``||loops:repeat||`` loop, and another ``||functions:call waterPlants||`` inside the third ``||logic:if||`` statement.

#### ~ tutorialhint
```blocks
function waterPlants () {
    for (let index = 0; index < 5; index++) {
        kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(true))
        basic.pause(1000)
        kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(false))
        basic.pause(2000)
    }
}
basic.forever(function () {
    if (kitronik_smart_greenhouse.simpleAlarmCheck()) {
        if (kitronik_smart_greenhouse.readIOPin(kitronik_smart_greenhouse.PinType.analog, kitronik_smart_greenhouse.IOPins.p1) <= 500) {
            waterPlants()
        }
    }
    if (kitronik_smart_greenhouse.readIOPin(kitronik_smart_greenhouse.PinType.analog, kitronik_smart_greenhouse.IOPins.p1) <= 300) {
        waterPlants()
    }
})
```

### Step 8
CODING COMPLETE! Click ``|Download|`` and transfer the code to the Environmental Control Board.  
Leave the program running and see the plants watered when they're too dry or when the alarm is triggered.
