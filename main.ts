/*
  Kitronik package for use with the Smart Greenhouse (www.kitronik.co.uk/5699)
  This package pulls in other packages to deal with the lower level work for:
    Bit banging the WS2182 protocol
    Setting and reading a Real Time Clock chip
    Reading from a BME280 Temperature, Humidity, Pressure sensor
*/

/**
* Well known colors for ZIP LEDs
*/
enum ZipLedColors {
    //% block=red
    Red = 0xFF0000,
    //% block=orange
    Orange = 0xFFA500,
    //% block=yellow
    Yellow = 0xFFFF00,
    //% block=green
    Green = 0x00FF00,
    //% block=blue
    Blue = 0x0000FF,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=violet
    Violet = 0x8a2be2,
    //% block=purple
    Purple = 0xFF00FF,
    //% block=white
    White = 0xFFFFFF,
    //% block=black
    Black = 0x000000
}

/** 
 * Different time options for the Real Time Clock
 */
enum TimeParameter {
    //% block=hours
    Hours,
    //% block=minutes
    Minutes,
    //% block=seconds
    Seconds
}

/**
 * Different date options for the Real Time Clock
 */
enum DateParameter {
    //% block=day
    Day,
    //% block=month
    Month,
    //% block=year
    Year
}

//List of different temperature units
enum TemperatureUnitList {
    //% block="°C"
    C,
    //% block="°F"
    F
}

//List of different pressure units
enum PressureUnitList {
    //% block="Pa"
    Pa,
    //% block="mBar"
    mBar
}

/**
 * Kitronik Smart Greenhouse MakeCode Package
 */

//% weight=100 color=#00A654 icon="\uf06c" block="Greenhouse"
//% groups='["Set Time", "Set Date", "Read Time", "Read Date", "Alarm", "Servo", "General Inputs/Outputs", "High Power Outputs", "Setup", "Entries", "Transfer"]'
namespace kitronik_smart_greenhouse {
    ////////////////////////////////
    //           MUSIC            //
    ////////////////////////////////

    /**
     * Setup micro:bit to play music through on board buzzer
     */
    //% blockId="kitronik_smart_greenhouse_buzzer_setup" block="set music pin for buzzer"
    //% weight=100 blockGap=8
    export function setBuzzerPin(): void {
        pins.analogSetPitchPin(AnalogPin.P12)
    }

    ////////////////////////////////
    //         ZIP LEDS           //
    ////////////////////////////////

    export class greenhouseZIPLEDs {
    	buf: Buffer;
    	pin: DigitalPin;
    	brightness: number;
    	start: number;
    	_length: number;

        /**
         * Shows a rainbow pattern on all LEDs. 
         * @param startHue the start hue value for the rainbow, eg: 1
         * @param endHue the end hue value for the rainbow, eg: 360
         */
        //% subcategory="ZIP LEDs"
        //% blockId="kitronik_smart_greenhouse_rainbow" block="%zipLEDs|show rainbow from %startHue|to %endHue" 
        //% weight=94 blockGap=8
        showRainbow(startHue: number = 1, endHue: number = 360) {
            if (this._length <= 0) return;

            startHue = startHue >> 0;
            endHue = endHue >> 0;
            const saturation = 100;
            const luminance = 50;
            const steps = this._length;
            const direction = HueInterpolationDirection.Clockwise;

            //hue
            const h1 = startHue;
            const h2 = endHue;
            const hDistCW = ((h2 + 360) - h1) % 360;
            const hStepCW = Math.idiv((hDistCW * 100), steps);
            const hDistCCW = ((h1 + 360) - h2) % 360;
            const hStepCCW = Math.idiv(-(hDistCCW * 100), steps);
            let hStep: number;
            if (direction === HueInterpolationDirection.Clockwise) {
                hStep = hStepCW;
            } else if (direction === HueInterpolationDirection.CounterClockwise) {
                hStep = hStepCCW;
            } else {
                hStep = hDistCW < hDistCCW ? hStepCW : hStepCCW;
            }
            const h1_100 = h1 * 100; //we multiply by 100 so we keep more accurate results while doing interpolation

            //sat
            const s1 = saturation;
            const s2 = saturation;
            const sDist = s2 - s1;
            const sStep = Math.idiv(sDist, steps);
            const s1_100 = s1 * 100;

            //lum
            const l1 = luminance;
            const l2 = luminance;
            const lDist = l2 - l1;
            const lStep = Math.idiv(lDist, steps);
            const l1_100 = l1 * 100

            //interpolate
            if (steps === 1) {
                this.setPixelRGB(0, hsl(h1 + hStep, s1 + sStep, l1 + lStep))
            } else {
                this.setPixelRGB(0, hsl(startHue, saturation, luminance));
                for (let i = 1; i < steps - 1; i++) {
                    const h = Math.idiv((h1_100 + i * hStep), 100) + 360;
                    const s = Math.idiv((s1_100 + i * sStep), 100);
                    const l = Math.idiv((l1_100 + i * lStep), 100);
                    this.setPixelRGB(i, hsl(h, s, l));
                }
                this.setPixelRGB(steps - 1, hsl(endHue, saturation, luminance));
            }
            this.show();
        }

		/** 
         * Create a range of LEDs.
         * @param start offset in the LED strip to start the range
         * @param length number of LEDs in the range. eg: 2
         */
        //% subcategory="ZIP LEDs"
        //% weight=89 blockGap=8
        //% blockId="kitronik_smart_greenhouse_range" block="%zipLEDs|range from %start|with %length|LEDs"
        range(start: number, length: number): greenhouseZIPLEDs {
            start = start >> 0;
            length = length >> 0;
            let zipLEDs = new greenhouseZIPLEDs();
            zipLEDs.buf = this.buf;
            zipLEDs.pin = this.pin;
            zipLEDs.brightness = this.brightness;
            zipLEDs.start = this.start + Math.clamp(0, this._length - 1, start);
            zipLEDs._length = Math.clamp(0, this._length - (zipLEDs.start - this.start), length);
            return zipLEDs;
        }

        /** 
         * Create a range for the on-board Status LEDs.
         */
        //% subcategory="ZIP LEDs"
        //% weight=99 blockGap=8
        //% blockId="kitronik_smart_greenhouse_status_leds_range" block="%zipLEDs|range from 0 with 3 LEDs"
        //% blockSetVariable=statusLEDs
        statusLedsRange(): greenhouseZIPLEDs {
            let statusLEDs = new greenhouseZIPLEDs();
            statusLEDs.buf = this.buf;
            statusLEDs.pin = this.pin;
            statusLEDs.brightness = this.brightness;
            statusLEDs.start = this.start + Math.clamp(0, this._length - 1, 0);
            statusLEDs._length = Math.clamp(0, this._length - (statusLEDs.start - this.start), 3);
            return statusLEDs;
        }

        /** 
         * Create a range for the external ZIP Stick LEDs.
         */
        //% subcategory="ZIP LEDs"
        //% weight=98 blockGap=8
        //% blockId="kitronik_smart_greenhouse_zip_stick_range" block="%zipLEDs|range from 3 with 5 LEDs"
        //% blockSetVariable=zipStick
        zipStickRange(): greenhouseZIPLEDs {
            let zipStick = new greenhouseZIPLEDs();
            zipStick.buf = this.buf;
            zipStick.pin = this.pin;
            zipStick.brightness = this.brightness;
            zipStick.start = this.start + Math.clamp(0, this._length - 1, 3);
            zipStick._length = Math.clamp(0, this._length - (zipStick.start - this.start), 5);
            return zipStick;
        }

        /**
         * Rotate LEDs forward.
         * You need to call ``show`` to make the changes visible.
         * @param offset number of ZIP LEDs to rotate forward, eg: 1
         */
        //% subcategory="ZIP LEDs"
        //% blockId="kitronik_smart_greenhouse_display_rotate" block="%zipLEDs|rotate ZIP LEDs by %offset" blockGap=8
        //% weight=92
        rotate(offset: number = 1): void {
            this.buf.rotate(-offset * 3, this.start * 3, this._length * 3)
        }
    	/**
         * Sets all the ZIP LEDs to a given color (range 0-255 for r, g, b). Call Show to make changes visible 
         * @param rgb RGB color of the LED
         */
        //% subcategory="ZIP LEDs"
        //% blockId="kitronik_smart_greenhouse_display_only_set_strip_color" block="%zipLEDs|set color %rgb=kitronik_smart_greenhouse_colors" 
        //% weight=96 blockGap=8
        setColor(rgb: number) {
        	rgb = rgb >> 0;
            this.setAllRGB(rgb);
        }
    	/**
         * Shows all the ZIP LEDs as a given color (range 0-255 for r, g, b). 
         * @param rgb RGB color of the LED
         */
        //% subcategory="ZIP LEDs"
        //% blockId="kitronik_smart_greenhouse_display_set_strip_color" block="%zipLEDs|show color %rgb=kitronik_smart_greenhouse_colors" 
        //% weight=97 blockGap=8
        showColor(rgb: number) {
        	rgb = rgb >> 0;
            this.setAllRGB(rgb);
            this.show();
        }

        /**
         * Set particular ZIP LED to a given color. 
         * You need to call ``show changes`` to make the changes visible.
         * @param zipLedNum position of the ZIP LED in the string
         * @param rgb RGB color of the ZIP LED
         */
        //% subcategory="ZIP LEDs"
        //% blockId="kitronik_smart_greenhouse_set_zip_color" block="%zipLEDs|set ZIP LED %zipLedNum|to %rgb=kitronik_smart_greenhouse_colors" 
        //% weight=95 blockGap=8
        setZipLedColor(zipLedNum: number, rgb: number): void {
            this.setPixelRGB(zipLedNum >> 0, rgb >> 0);
        }

        /**
         * Send all the changes to the ZIP LEDs.
         */
        //% subcategory="ZIP LEDs"
        //% blockId="kitronik_smart_greenhouse_display_show" block="%zipLEDs|show" blockGap=8
        //% weight=94
        show() {
            //use the Kitronik version which respects brightness for all 
            ws2812b.sendBuffer(this.buf, this.pin, this.brightness);
        }

        /**
         * Turn off all the ZIP LEDs.
         * You need to call ``show`` to make the changes visible.
         */
        //% subcategory="ZIP LEDs"
        //% blockId="kitronik_smart_greenhouse_display_clear" block="%zipLEDs|clear"
        //% weight=93 blockGap=8
        clear(): void {
            this.buf.fill(0, this.start * 3, this._length * 3);
        }

        /**
         * Set the brightness of the ZIP LEDs. This flag only applies to future show operation.
         * @param brightness a measure of LED brightness in 0-255. eg: 255
         */
        //% subcategory="ZIP LEDs"
        //% blockId="kitronik_smart_greenhouse_display_set_brightness" block="%zipLEDs|set brightness %brightness" blockGap=8
        //% weight=91
        //% brightness.min=0 brightness.max=255
        setBrightness(brightness: number): void {
            //Clamp incoming variable at 0-255 as values out of this range cause unexpected brightnesses as the lower level code only expects a byte.
            if(brightness <0)
            {
              brightness = 0
            }
            else if (brightness > 255)
            {
              brightness = 255
            }
            this.brightness = brightness & 0xff;
            basic.pause(1) //add a pause to stop wierdnesses
        }

        //Sets up the buffer for pushing LED control data out to LEDs
        private setBufferRGB(offset: number, red: number, green: number, blue: number): void {
            this.buf[offset + 0] = green;
            this.buf[offset + 1] = red;
            this.buf[offset + 2] = blue;
        }

        //Separates out Red, Green and Blue data and fills the LED control data buffer for all LEDs
        private setAllRGB(rgb: number) {
            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            const end = this.start + this._length;
            for (let i = this.start; i < end; ++i) {
                this.setBufferRGB(i * 3, red, green, blue)
            }
        }

        //Separates out Red, Green and Blue data and fills the LED control data buffer for a single LED
        private setPixelRGB(pixeloffset: number, rgb: number): void {
            if (pixeloffset < 0
                || pixeloffset >= this._length)
                return;

            pixeloffset = (pixeloffset + this.start) * 3;

            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            this.setBufferRGB(pixeloffset, red, green, blue)
        }
    }

    /**
     * Create a new ZIP LED driver for Smart Greenhouse (LEDs on and off board).
     * @param zipNum is the total number of ZIP LEDs eg: 8
     */
    //% subcategory="ZIP LEDs"
    //% blockId="kitronik_smart_greenhouse_display_create" block="Smart Greenhouse with %zipNum|ZIP LEDs"
    //% weight=100 blockGap=8
    //% trackArgs=0,2
    //% blockSetVariable=zipLEDs
    export function createGreenhouseZIPDisplay(zipNum: number): greenhouseZIPLEDs {
        let zipLEDs = new greenhouseZIPLEDs;
        zipLEDs.buf = pins.createBuffer(zipNum * 3);
        zipLEDs.start = 0;
        zipLEDs._length = zipNum;
        zipLEDs.setBrightness(128)
        zipLEDs.pin = DigitalPin.P8;
        pins.digitalWritePin(zipLEDs.pin, 0);
        return zipLEDs;
    }

    /**
     * Converts wavelength value to red, green, blue channels
     * @param wavelength value between 470 and 625. eg: 500
     */
    //% subcategory="ZIP LEDs"
    //% weight=1 blockGap=8
    //% blockId="kitronik_smart_greenhouse_wavelength" block="wavelength %wavelength|nm"
    //% wavelength.min=470 wavelength.max=625
    export function wavelength(wavelength: number): number {
     /*  The LEDs we are using have centre wavelengths of 470nm (Blue) 525nm(Green) and 625nm (Red) 
     * 	 We blend these linearly to give the impression of the other wavelengths. 
     *   as we cant wavelength shift an actual LED... (Ye canna change the laws of physics Capt)*/
		let r = 0;
		let g = 0;
		let b = 0;
		if ((wavelength >= 470) && (wavelength < 525)){
            //We are between Blue and Green so mix those
			g = pins.map(wavelength,470,525,0,255);
			b = pins.map(wavelength,470,525,255,0);
		}
		else if ((wavelength >= 525) && (wavelength <= 625)){
            //we are between Green and Red, so mix those
			r = pins.map(wavelength,525,625,0,255);
			g = pins.map(wavelength,525,625,255,0);
		}
        return packRGB(r, g, b);
    }

    /**
     * Converts hue (0-360) to an RGB value. 
     * Does not attempt to modify luminosity or saturation. 
     * Colours end up fully saturated. 
     * @param hue value between 0 and 360
     */
    //% subcategory="ZIP LEDs"
    //% weight=1 blockGap=8
    //% blockId="kitronik_smart_greenhouse_hue" block="hue %hue"
    //% hue.min=0 hue.max=360
    export function hueToRGB(hue: number): number {
        let redVal = 0
        let greenVal = 0
        let blueVal = 0
        let hueStep = 2.125
        if ((hue >= 0) && (hue < 120)) { //RedGreen section
            greenVal = Math.floor((hue) * hueStep)
            redVal = 255 - greenVal
        }
        else if ((hue >= 120) && (hue < 240)) { //GreenBlueSection
            blueVal = Math.floor((hue - 120) * hueStep)
            greenVal = 255 - blueVal
        }
        else if ((hue >= 240) && (hue < 360)) { //BlueRedSection
            redVal = Math.floor((hue - 240) * hueStep)
            blueVal = 255 - redVal
        }
        return ((redVal & 0xFF) << 16) | ((greenVal & 0xFF) << 8) | (blueVal & 0xFF);
    }

     /*  The LEDs we are using have centre wavelengths of 470nm (Blue) 525nm(Green) and 625nm (Red) 
     * 	 We blend these linearly to give the impression of the other wavelengths. 
     *   as we cant wavelength shift an actual LED... (Ye canna change the laws of physics Capt)*/

    /**
     * Converts value to red, green, blue channels
     * @param red value of the red channel between 0 and 255. eg: 255
     * @param green value of the green channel between 0 and 255. eg: 255
     * @param blue value of the blue channel between 0 and 255. eg: 255
     */
    //% subcategory="ZIP LEDs"
    //% weight=1 blockGap=8
    //% blockId="kitronik_smart_greenhouse_rgb" block="red %red|green %green|blue %blue"
    export function rgb(red: number, green: number, blue: number): number {
        return packRGB(red, green, blue);
    }

    /**
     * Gets the RGB value of a known color
    */
    //% subcategory="ZIP LEDs"
    //% weight=2 blockGap=8
    //% blockId="kitronik_smart_greenhouse_colors" block="%color"
    export function colors(color: ZipLedColors): number {
        return color;
    }

    //Combines individual RGB settings to be a single number
    function packRGB(a: number, b: number, c: number): number {
        return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
    }
    //Separates red value from combined number
    function unpackR(rgb: number): number {
        let r = (rgb >> 16) & 0xFF;
        return r;
    }
    //Separates green value from combined number
    function unpackG(rgb: number): number {
        let g = (rgb >> 8) & 0xFF;
        return g;
    }
    //Separates blue value from combined number
    function unpackB(rgb: number): number {
        let b = (rgb) & 0xFF;
        return b;
    }

    /**
     * Converts a hue saturation luminosity value into a RGB color
     */
    function hsl(h: number, s: number, l: number): number {
        h = Math.round(h);
        s = Math.round(s);
        l = Math.round(l);

        h = h % 360;
        s = Math.clamp(0, 99, s);
        l = Math.clamp(0, 99, l);
        let c = Math.idiv((((100 - Math.abs(2 * l - 100)) * s) << 8), 10000); //chroma, [0,255]
        let h1 = Math.idiv(h, 60);//[0,6]
        let h2 = Math.idiv((h - h1 * 60) * 256, 60);//[0,255]
        let temp = Math.abs((((h1 % 2) << 8) + h2) - 256);
        let x = (c * (256 - (temp))) >> 8;//[0,255], second largest component of this color
        let r$: number;
        let g$: number;
        let b$: number;
        if (h1 == 0) {
            r$ = c; g$ = x; b$ = 0;
        } else if (h1 == 1) {
            r$ = x; g$ = c; b$ = 0;
        } else if (h1 == 2) {
            r$ = 0; g$ = c; b$ = x;
        } else if (h1 == 3) {
            r$ = 0; g$ = x; b$ = c;
        } else if (h1 == 4) {
            r$ = x; g$ = 0; b$ = c;
        } else if (h1 == 5) {
            r$ = c; g$ = 0; b$ = x;
        }
        let m = Math.idiv((Math.idiv((l * 2 << 8), 100) - c), 2);
        let r = r$ + m;
        let g = g$ + m;
        let b = b$ + m;
        return packRGB(r, g, b);
    }

    /**
     * Options for direction hue changes, used by rainbow block (never visible to end user)
     */
    export enum HueInterpolationDirection {
        Clockwise,
        CounterClockwise,
        Shortest
    }    

    ////////////////////////////////
    //            RTC             //
    ////////////////////////////////

    /**
     * Alarm repeat type
     */
    export enum AlarmType {
        //% block="Single"
        Single = 0,
        //% block="Daily Repeating"
        Repeating = 1
    }

    /**
     * Alarm silence type
     */
    export enum AlarmSilence {
        //% block="Auto Silence"
        autoSilence = 1,
        //% block="User Silence"
        userSilence = 2
    }

    let alarmHour = 0       //The hour setting for the alarm
    let alarmMin = 0        //The minute setting for the alarm
    export let alarmSetFlag = 0    //Flag set to '1' when an alarm is set
    let alarmRepeat = 0     //If '1' shows that the alarm should remain set so it triggers at the next time match
    let alarmOff = 0        //If '1' shows that alarm should auto switch off, if '2' the user must switch off 
    let alarmTriggered = 0  //Flag to show if the alarm has been triggered ('1') or not ('0')
    let alarmTriggerHandler: Action
    let alarmHandler: Action

    /**
     * Set time on RTC, as three numbers
     * @param setHours is to set the hours
     * @param setMinutes is to set the minutes
     * @param setSeconds is to set the seconds
    */
    //% subcategory="Clock"
    //% group="Set Time"
    //% blockId=kitronik_smart_greenhouse_set_time 
    //% block="Set Time to %setHours|hrs %setMinutes|mins %setSeconds|secs"
    //% setHours.min=0 setHours.max=23
    //% setMinutes.min=0 setMinutes.max=59
    //% setSeconds.min=0 setSeconds.max=59
    //% weight=100 blockGap=8
    export function setTime(setHours: number, setMinutes: number, setSeconds: number): void {

        if (kitronik_RTC.initalised == false) {
            kitronik_RTC.secretIncantation()
        }

        let bcdHours = kitronik_RTC.decToBcd(setHours)                           //Convert number to binary coded decimal
        let bcdMinutes = kitronik_RTC.decToBcd(setMinutes)                       //Convert number to binary coded decimal
        let bcdSeconds = kitronik_RTC.decToBcd(setSeconds)                       //Convert number to binary coded decimal
        let writeBuf = pins.createBuffer(2)

        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        writeBuf[1] = kitronik_RTC.STOP_RTC                                  //Disable Oscillator
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)

        writeBuf[0] = kitronik_RTC.RTC_HOURS_REG
        writeBuf[1] = bcdHours                                      //Send new Hours value
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)

        writeBuf[0] = kitronik_RTC.RTC_MINUTES_REG
        writeBuf[1] = bcdMinutes                                    //Send new Minutes value
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)

        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        writeBuf[1] = kitronik_RTC.START_RTC | bcdSeconds                            //Send new seconds masked with the Enable Oscillator
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
    }

    /**
     * Read time from RTC as a string
    */
    //% subcategory="Clock"
    //% group="Read Time"
    //% blockId=kitronik_smart_greenhouse_read_time 
    //% block="Read Time as String"
    //% weight=95 blockGap=8
    export function readTime(): string {

        if (kitronik_RTC.initalised == false) {
            kitronik_RTC.secretIncantation()
        }

        //read Values
        kitronik_RTC.readValue()

        let decSeconds = kitronik_RTC.bcdToDec(kitronik_RTC.currentSeconds, kitronik_RTC.RTC_SECONDS_REG)                  //Convert number to Decimal
        let decMinutes = kitronik_RTC.bcdToDec(kitronik_RTC.currentMinutes, kitronik_RTC.RTC_MINUTES_REG)                  //Convert number to Decimal
        let decHours = kitronik_RTC.bcdToDec(kitronik_RTC.currentHours, kitronik_RTC.RTC_HOURS_REG)                        //Convert number to Decimal

        //Combine hours,minutes and seconds in to one string
        let strTime: string = "" + ((decHours / 10)>>0) + decHours % 10 + ":" + ((decMinutes / 10)>>0) + decMinutes % 10 + ":" + ((decSeconds / 10)>>0) + decSeconds % 10

        return strTime
    }

    /**
     * Set date on RTC as three numbers
     * @param setDay is to set the day in terms of numbers 1 to 31
     * @param setMonths is to set the month in terms of numbers 1 to 12
     * @param setYears is to set the years in terms of numbers 0 to 99
    */
    //% subcategory="Clock"
    //% group="Set Date"
    //% blockId=kitronik_smart_greenhouse_set_date 
    //% block="Set Date to %setDays|Day %setMonths|Month %setYear|Year"
    //% setDay.min=1 setDay.max=31
    //% setMonth.min=1 setMonth.max=12
    //% setYear.min=0 setYear.max=99
    //% weight=90 blockGap=8
    export function setDate(setDay: number, setMonth: number, setYear: number): void {

        if (kitronik_RTC.initalised == false) {
            kitronik_RTC.secretIncantation()
        }

        let leapYearCheck = 0
        let writeBuf = pins.createBuffer(2)
        let readBuf = pins.createBuffer(1)
        let bcdDay = 0
        let bcdMonths = 0
        let bcdYears = 0
        let readCurrentSeconds = 0

        //Check day entered does not exceed month that has 30 days in
        if ((setMonth == 4) || (setMonth == 6) || (setMonth == 9) || (setMonth == 11)) {
            if (setDay == 31) {
                setDay = 30
            }
        }

        //Leap year check and does not exceed 30 days
        if ((setMonth == 2) && (setDay >= 29)) {
            leapYearCheck = setYear % 4
            if (leapYearCheck == 0)
                setDay = 29
            else
                setDay = 28
        }

        let weekday = kitronik_RTC.calcWeekday(setDay, setMonth, (setYear+2000))

        bcdDay = kitronik_RTC.decToBcd(setDay)                       //Convert number to binary coded decimal
        bcdMonths = kitronik_RTC.decToBcd(setMonth)                  //Convert number to binary coded decimal
        bcdYears = kitronik_RTC.decToBcd(setYear)                    //Convert number to binary coded decimal

        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)

        readBuf = pins.i2cReadBuffer(kitronik_RTC.CHIP_ADDRESS, 1, false)
        readCurrentSeconds = readBuf[0]

        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        writeBuf[1] = kitronik_RTC.STOP_RTC                                  //Disable Oscillator
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)

        writeBuf[0] = kitronik_RTC.RTC_WEEKDAY_REG
        writeBuf[1] = weekday                                        //Send new Weekday value
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)

        writeBuf[0] = kitronik_RTC.RTC_DAY_REG
        writeBuf[1] = bcdDay                                        //Send new Day value
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)

        writeBuf[0] = kitronik_RTC.RTC_MONTH_REG
        writeBuf[1] = bcdMonths                                     //Send new Months value
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)

        writeBuf[0] = kitronik_RTC.RTC_YEAR_REG
        writeBuf[1] = bcdYears                                      //Send new Year value
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)

        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        writeBuf[1] = kitronik_RTC.START_RTC | readCurrentSeconds                    //Enable Oscillator
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
    }

    /**
     * Read date from RTC as a string
    */
    //% subcategory="Clock"
    //% group="Read Date"
    //% blockId=kitronik_smart_greenhouse_read_date 
    //% block="Read Date as String"
    //% weight=85 blockGap=8
    export function readDate(): string {

        if (kitronik_RTC.initalised == false) {
            kitronik_RTC.secretIncantation()
        }

        //read Values
        kitronik_RTC.readValue()

        let decDay = kitronik_RTC.bcdToDec(kitronik_RTC.currentDay, kitronik_RTC.RTC_DAY_REG)                      //Convert number to Decimal
        let decMonths = kitronik_RTC.bcdToDec(kitronik_RTC.currentMonth, kitronik_RTC.RTC_MONTH_REG)               //Convert number to Decimal
        let decYears = kitronik_RTC.bcdToDec(kitronik_RTC.currentYear, kitronik_RTC.RTC_YEAR_REG)                  //Convert number to Decimal

        //let strDate: string = decDay + "/" + decMonths + "/" + decYears
        let strDate: string = "" + ((decDay / 10)>>0) + (decDay % 10) + "/" + ((decMonths / 10)>>0) + (decMonths % 10) + "/" + ((decYears / 10)>>0) + (decYears % 10)
        return strDate
    }

    /**Read time parameter from RTC*/
    //% subcategory="Clock"
    //% group="Read Time"
    //% blockId=kitronik_smart_greenhouse_read_time_parameter 
    //% block="Read %selectParameter| as Number"
    //% weight=75 blockGap=8
    export function readTimeParameter(selectParameter: TimeParameter): number {

        if (kitronik_RTC.initalised == false) {
            kitronik_RTC.secretIncantation()
        }
        let decParameter = 0
        //read Values
        kitronik_RTC.readValue()

		//from enum convert the required time parameter and return
		if (selectParameter == TimeParameter.Hours){
			decParameter = kitronik_RTC.bcdToDec(kitronik_RTC.currentHours, kitronik_RTC.RTC_HOURS_REG)                   //Convert number to Decimal
		}
		else if (selectParameter == TimeParameter.Minutes){
			decParameter = kitronik_RTC.bcdToDec(kitronik_RTC.currentMinutes, kitronik_RTC.RTC_MINUTES_REG)                  //Convert number to Decimal
		}
		else if (selectParameter == TimeParameter.Seconds){
			decParameter = kitronik_RTC.bcdToDec(kitronik_RTC.currentSeconds, kitronik_RTC.RTC_SECONDS_REG)                  //Convert number to Decimal
		}

        return decParameter
    }

    /**
     * Set the hours on the RTC in 24 hour format
     * @param writeHours is to set the hours in terms of numbers 0 to 23
    */
    //% subcategory="Clock"
    //% group="Set Time"
    //% blockId=kitronik_smart_greenhouse_write_hours 
    //% block="Set Hours to %hours|hrs"
    //% hours.min=0 hours.max=23
    //% weight=80 blockGap=8
    export function writeHours(hours: number): void {
        if (kitronik_RTC.initalised == false) {
            kitronik_RTC.secretIncantation()
        }

        let bcdHours = kitronik_RTC.decToBcd(hours)
        let writeBuf = pins.createBuffer(2)

        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        writeBuf[1] = kitronik_RTC.STOP_RTC                                      //Disable Oscillator
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
        writeBuf[0] = kitronik_RTC.RTC_HOURS_REG
        writeBuf[1] = bcdHours                                      //Send new value
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        writeBuf[1] = kitronik_RTC.START_RTC                                 //Enable Oscillator
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
    }

    /**
     * Set the minutes on the RTC
     * @param writeMinutes is to set the minutes in terms of numbers 0 to 59
    */
    //% subcategory="Clock"
    //% group="Set Time"
    //% blockId=kitronik_smart_greenhouse_write_minutes 
    //% block="Set Minutes to %minutes|mins"
    //% minutes.min=0 minutes.max=59
    //% weight=70 blockGap=8
    export function writeMinutes(minutes: number): void {
        if (kitronik_RTC.initalised == false) {
            kitronik_RTC.secretIncantation()
        }

        let bcdMinutes = kitronik_RTC.decToBcd(minutes)
        let writeBuf = pins.createBuffer(2)

        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        writeBuf[1] = kitronik_RTC.STOP_RTC                                      //Disable Oscillator
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
        writeBuf[0] = kitronik_RTC.RTC_MINUTES_REG
        writeBuf[1] = bcdMinutes                                        //Send new value
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        writeBuf[1] = kitronik_RTC.START_RTC                                 //Enable Oscillator
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
    }

    /**
     * Set the seconds on the RTC
     * @param writeSeconds is to set the seconds in terms of numbers 0 to 59
    */
    //% subcategory="Clock"
    //% group="Set Time"
    //% blockId=kitronik_smart_greenhouse_write_seconds 
    //% block="Set Seconds to %seconds|secs"
    //% seconds.min=0 seconds.max=59
    //% weight=60 blockGap=8
    export function writeSeconds(seconds: number): void {
        if (kitronik_RTC.initalised == false) {
            kitronik_RTC.secretIncantation()
        }

        let bcdSeconds = kitronik_RTC.decToBcd(seconds)
        let writeBuf = pins.createBuffer(2)

        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        writeBuf[1] = kitronik_RTC.STOP_RTC                                      //Disable Oscillator
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        writeBuf[1] = kitronik_RTC.START_RTC | bcdSeconds                        //Enable Oscillator and Send new value
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
    }

    /**Read time parameter from RTC*/
    //% subcategory="Clock"
    //% group="Read Date"
    //% blockId=kitronik_smart_greenhouse_read_date_parameter 
    //% block="Read %selectParameter| as Number"
    //% weight=65 blockGap=8
    export function readDateParameter(selectParameter: DateParameter): number {

        if (kitronik_RTC.initalised == false) {
            kitronik_RTC.secretIncantation()
        }
        let decParameter = 0
        //read Values
        kitronik_RTC.readValue()

		//from enum convert the required time parameter and return
		if (selectParameter == DateParameter.Day){
			decParameter = kitronik_RTC.bcdToDec(kitronik_RTC.currentDay, kitronik_RTC.RTC_DAY_REG)                   //Convert number to Decimal
		}
		else if (selectParameter == DateParameter.Month){
			decParameter = kitronik_RTC.bcdToDec(kitronik_RTC.currentMonth, kitronik_RTC.RTC_MONTH_REG)                  //Convert number to Decimal
		}
		else if (selectParameter == DateParameter.Year){
			decParameter = kitronik_RTC.bcdToDec(kitronik_RTC.currentYear, kitronik_RTC.RTC_YEAR_REG)                   //Convert number to Decimal
		}

        return decParameter
    }

    /**
     * Set the day on the RTC
     * @param writeDay is to set the day in terms of numbers 0 to 31
    */
    //% subcategory="Clock"
    //% group="Set Date"
    //% blockId=kitronik_smart_greenhouse_write_day
    //% block="Set Day to %day|day"
    //% day.min=1 day.max=31
    //% weight=50 blockGap=8
    export function writeDay(day: number): void {
        if (kitronik_RTC.initalised == false) {
            kitronik_RTC.secretIncantation()
        }

        let bcdDay = kitronik_RTC.decToBcd(day)
        let writeBuf = pins.createBuffer(2)

        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        writeBuf[1] = kitronik_RTC.STOP_RTC                                      //Disable Oscillator
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
        writeBuf[0] = kitronik_RTC.RTC_DAY_REG
        writeBuf[1] = bcdDay                                        //Send new value
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        writeBuf[1] = kitronik_RTC.START_RTC                         //Enable Oscillator
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
    }

    /**
     * set the month on the RTC
     * @param writeMonth is to set the month in terms of numbers 1 to 12
    */
    //% subcategory="Clock"
    //% group="Set Date"
    //% blockId=kitronik_smart_greenhouse_write_month 
    //% block="Set Month to %month|month"
    //% month.min=1 month.max=12
    //% weight=40 blockGap=8
    export function writeMonth(month: number): void {
        if (kitronik_RTC.initalised == false) {
            kitronik_RTC.secretIncantation()
        }

        let bcdMonth = kitronik_RTC.decToBcd(month)
        let writeBuf = pins.createBuffer(2)

        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        writeBuf[1] = kitronik_RTC.STOP_RTC                                      //Disable Oscillator
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
        writeBuf[0] = kitronik_RTC.RTC_MONTH_REG
        writeBuf[1] = bcdMonth                                      //Send new value
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        writeBuf[1] = kitronik_RTC.START_RTC                                     //Enable Oscillator
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
    }

    /**
     * set the year on the RTC
     * @param writeYear is to set the year in terms of numbers 0 to 99
    */
    //% subcategory="Clock"
    //% group="Set Date"
    //% blockId=kitronik_smart_greenhouse_write_year 
    //% block="Set Year to %year|year"
    //% year.min=0 year.max=99
    //% weight=30 blockGap=8
    export function writeYear(year: number): void {
        if (kitronik_RTC.initalised == false) {
            kitronik_RTC.secretIncantation()
        }

        let bcdYear = kitronik_RTC.decToBcd(year)                                //Convert number to BCD
        let writeBuf = pins.createBuffer(2)

        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        writeBuf[1] = kitronik_RTC.STOP_RTC                                      //Disable Oscillator
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
        writeBuf[0] = kitronik_RTC.RTC_YEAR_REG
        writeBuf[1] = bcdYear                                       //Send new value
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
        writeBuf[0] = kitronik_RTC.RTC_SECONDS_REG
        writeBuf[1] = kitronik_RTC.START_RTC                                 //Enable Oscillator
        pins.i2cWriteBuffer(kitronik_RTC.CHIP_ADDRESS, writeBuf, false)
    }

    /**
     * Set simple alarm
     * @param alarmType determines whether the alarm repeats
     * @param hour is the alarm hour setting (24 hour)
     * @param min is the alarm minute setting
     * @param alarmSilence determines whether the alarm turns off automatically or the user turns it off
    */
    //% subcategory="Clock"
    //% group=Alarm
    //% blockId=kitronik_smart_greenhouse_simple_set_alarm 
    //% block="set %alarmType|alarm to %hour|:%min|with %alarmSilence"
    //% hour.min=0 hour.max=23
    //% min.min=0 min.max=59
    //% sec.min=0 sec.max=59
    //% inlineInputMode=inline
    //% weight=26 blockGap=8
    export function simpleAlarmSet(alarmType: AlarmType, hour: number, min: number, alarmSilence: AlarmSilence): void {
        if (kitronik_RTC.initalised == false) {
            kitronik_RTC.secretIncantation()
        }

        if (alarmType == 1) {
            alarmRepeat = 1     //Daily Repeating Alarm
        }
        else {
            alarmRepeat = 0     //Single Alarm
        }

        if (alarmSilence == 1) {    
            alarmOff = 1                //Auto Silence
        }
        else if (alarmSilence == 2) {   
            alarmOff = 2                //User Silence
        }

        alarmHour = hour
        alarmMin = min

        alarmSetFlag = 1

        //Set background alarm trigger check running
        control.inBackground(() => {
            while (alarmSetFlag == 1) {
                backgroundAlarmCheck()
                basic.pause(1000)
            }
        })
    }

    //Function to check if an alarm is triggered and raises the trigger event if true
    //Runs in background once an alarm is set, but only if alarmSetFlag = 1
    function backgroundAlarmCheck(): void {
		let checkHour = readTimeParameter(TimeParameter.Hours)
        let checkMin = readTimeParameter(TimeParameter.Minutes)
        if (alarmTriggered == 1 && alarmRepeat == 1) {
            if (checkMin != alarmMin) {
                alarmSetFlag = 0
                alarmTriggered = 0
                simpleAlarmSet(AlarmType.Repeating, alarmHour, alarmMin, alarmOff) //Reset the alarm after the current minute has changed
            }
        }
        if (checkHour == alarmHour && checkMin == alarmMin) {
            alarmHandler()
            alarmTriggered = 1
            if (alarmOff == 1) {
                basic.pause(2500)
                alarmSetFlag = 0
                if (alarmRepeat == 1) {
                    control.inBackground(() => {
                        checkMin = readTimeParameter(TimeParameter.Minutes)
                        while (checkMin == alarmMin) {
                            basic.pause(1000)
                            checkMin = readTimeParameter(TimeParameter.Minutes)
                        }
                        alarmTriggered = 0
                        simpleAlarmSet(AlarmType.Repeating, alarmHour, alarmMin, alarmOff) //Reset the alarm after the current minute has changed
                    })
                }
            }
        }
        if (alarmTriggered == 1 && alarmOff == 2 && checkMin != alarmMin) {
            alarmSetFlag = 0
            alarmTriggered = 0
        }
    }

    /**
     * Do something if the alarm is triggered
     */
    //% subcategory="Clock"
    //% group=Alarm
    //% blockId=kitronik_smart_greenhouse_on_alarm block="on alarm trigger"
    //% weight=25 blockGap=8
    export function onAlarmTrigger(alarmTriggerHandler: Action): void {
        alarmHandler = alarmTriggerHandler
    }

    /**
     * Determine if the alarm is triggered and return a boolean
    */
    //% subcategory="Clock"
    //% group=Alarm
    //% blockId=kitronik_smart_greenhouse_simple_check_alarm 
    //% block="alarm triggered"
    //% weight=24 blockGap=8
    export function simpleAlarmCheck(): boolean {
        let checkHour = readTimeParameter(TimeParameter.Hours)
        let checkMin = readTimeParameter(TimeParameter.Minutes)
        if (alarmSetFlag == 1 && checkHour == alarmHour && checkMin == alarmMin) {
            if (alarmOff == 1) {
                control.inBackground(() => {
                    basic.pause(2500)
                    alarmSetFlag = 0
                })
            }
            return true
        }
        else {
            return false
        }
    }

    /**
     * Turn off the alarm
    */
    //% subcategory="Clock"
    //% group=Alarm
    //% blockId=kitronik_smart_greenhouse_alarm_off 
    //% block="turn off alarm"
    //% weight=23 blockGap=8
    export function simpleAlarmOff(): void {
        alarmSetFlag = 0
        if (alarmTriggered == 1 && alarmRepeat == 1) {
            control.inBackground(() => {
                let checkMin = readTimeParameter(TimeParameter.Minutes)
                while (checkMin == alarmMin) {
                    basic.pause(1000)
                    checkMin = readTimeParameter(TimeParameter.Minutes)
                }
                alarmTriggered = 0
                simpleAlarmSet(AlarmType.Repeating, alarmHour, alarmMin, alarmOff) //Reset the alarm after the current minute has changed
            })
        }
    }    

    ////////////////////////////////
    //          BME280            //
    ////////////////////////////////
    /**
	* Read Pressure from sensor as Number.
	* Units for pressure are in Pa (Pascals) or mBar (millibar) according to selection
	*/
    //% subcategory="Sensors"
    //% blockId=kitronik_smart_greenhouse_read_pressure
    //% block="Read Pressure in %pressure_unit"
    //% weight=85 blockGap=8
    export function pressure(pressure_unit: PressureUnitList): number {
        if (kitronik_BME280.initalised == false)
            kitronik_BME280.secretIncantation()

        kitronik_BME280.readRawReadings();
        kitronik_BME280.convertReadings();

		//Change pressure from Pascals to millibar
        if (pressure_unit == PressureUnitList.mBar)
            kitronik_BME280.pressureReading = + kitronik_BME280.pressureReading / 100

		kitronik_BME280.pressureReading = Math.round(kitronik_BME280.pressureReading)
		
        return kitronik_BME280.pressureReading;
    }

	/**
	* Read Temperature from sensor as Number.
	* Units for temperature are in °C (Celsius) or °F (Fahrenheit) according to selection
	*/
    //% subcategory="Sensors"
    //% blockId="kitronik_smart_greenhouse_read_temperature"
    //% block="Read Temperature in %temperature_unit"
    //% weight=80 blockGap=8
    export function temperature(temperature_unit: TemperatureUnitList): number {
        if (kitronik_BME280.initalised == false)
            kitronik_BME280.secretIncantation()

        kitronik_BME280.readRawReadings();
        kitronik_BME280.convertReadings();

		//Change temperature from degrees C to degrees F
        if (temperature_unit == TemperatureUnitList.F)
            kitronik_BME280.temperatureReading = + ((kitronik_BME280.temperatureReading * 18) + 320) / 10
		
		kitronik_BME280.temperatureReading = Math.round(kitronik_BME280.temperatureReading)

        return kitronik_BME280.temperatureReading;
    }

    /**
	* Read Humidity from sensor as Number.
	* Units for humidity are as a percentage
	*/
    //% subcategory="Sensors"
    //% blockId=kitronik_smart_greenhouse_read_humidity
    //% block="Read Humidity"
    //% weight=75 blockGap=8
    export function humidity(): number {
        if (kitronik_BME280.initalised == false)
            kitronik_BME280.secretIncantation()

        kitronik_BME280.readRawReadings();
        kitronik_BME280.convertReadings();
		kitronik_BME280.humidityReading = Math.round(kitronik_BME280.humidityReading)
        return kitronik_BME280.humidityReading;
    }    

    ////////////////////////////////
    //     PIN INPUT/OUTPUTS      //
    ////////////////////////////////

    /**
     * General IO pin type
     */
    export enum PinType {
        //% block=Analog
        analog = 0,
        //% block=Digital
        digital = 1
    }

    /**
     * General IO pins
     */
    export enum IOPins {
        //% block=P0
        p0 = 0,
        //% block=P1
        p1 = 1,
        //% block=P2
        p2 = 2
    }

    /**
     * High Power Output pin options
     */
    export enum HighPowerPins {
        //% block=P13
        pin13 = 13,
        //% block=P14
        pin14 = 14
    }

    /**
     * Control the servo output
     * @param angle to set the servo
     */
    //% subcategory="Inputs/Outputs"
    //% group=Servo
    //% blockId=kitronik_smart_greenhouse_servo_write 
    //% block="set servo to $angle|degrees"
    //% angle.shadow="protractorPicker"
    //% weight=100 blockGap=8
    export function servoWrite(angle: number): void {
        pins.servoWritePin(AnalogPin.P15, angle)
    }

    /**
     * Read value from IO pins, either Digital or Analog
     * @param readType is either Digital or Analog
     * @param pin which IO pin to read
     */
    //% subcategory="Inputs/Outputs"
    //% group="General Inputs/Outputs"
    //% blockId=kitronik_smart_greenhouse_read_io_pins 
    //% block="%readType|read %pin"
    //% weight=95 blockGap=8
    export function readIOPin(readType: kitronik_smart_greenhouse.PinType, pin: kitronik_smart_greenhouse.IOPins): number {
        let readValue = 0
        if (pin == 0) {
            if (readType == 0) {
                readValue = pins.analogReadPin(AnalogPin.P0)
            }
            else if (readType == 1) {
                readValue = pins.digitalReadPin(DigitalPin.P0)
            }
        }
        else if (pin == 1) {
            if (readType == 0) {
                readValue = pins.analogReadPin(AnalogPin.P1)
            }
            else if (readType == 1) {
                readValue = pins.digitalReadPin(DigitalPin.P1)
            }
        }
        else if (pin == 2) {
            if (readType == 0) {
                readValue = pins.analogReadPin(AnalogPin.P2)
            }
            else if (readType == 1) {
                readValue = pins.digitalReadPin(DigitalPin.P2)
            }
        }

        return readValue
    }

    /**
     * Digital write value to IO pins
     * @param pin which IO pin to read
     * @param value to write to the pin, eg: 0
     */
    //% subcategory="Inputs/Outputs"
    //% group="General Inputs/Outputs"
    //% blockId=kitronik_smart_greenhouse_digital_write_io_pins 
    //% block="digital write pin %pin|to %value"
    //% value.min=0 value.max=1
    //% weight=90 blockGap=8
    export function digitalWriteIOPin(pin: kitronik_smart_greenhouse.IOPins, value: number): void {
        if (pin == 0) {
            pins.digitalWritePin(DigitalPin.P0, value)
        }
        else if (pin == 1) {
            pins.digitalWritePin(DigitalPin.P1, value)
        }
        else if (pin == 2) {
            pins.digitalWritePin(DigitalPin.P2, value)
        }
    }

    /**
     * Analog write value to IO pins
     * @param pin which IO pin to read
     * @param value to write to the pin, eg: 1023
     */
    //% subcategory="Inputs/Outputs"
    //% group="General Inputs/Outputs"
    //% blockId=kitronik_smart_greenhouse_analog_write_io_pins 
    //% block="analog write pin %pin|to %value"
    //% value.min=0 value.max=1023
    //% weight=85 blockGap=8
    export function analogWriteIOPin(pin: kitronik_smart_greenhouse.IOPins, value: number): void {
        if (pin == 0) {
            pins.analogWritePin(AnalogPin.P0, value)
        }
        else if (pin == 1) {
            pins.analogWritePin(AnalogPin.P1, value)
        }
        else if (pin == 2) {
            pins.analogWritePin(AnalogPin.P2, value)
        }
    }

    /**
     * Turn high power outputs on and off
     * @param pin which high power output pin to control
     * @param output is the boolean output of the pin, either ON or OFF
     * @param dutyCycle is an optional parameter to set the duty cycle for the pin eg: 100
     */
    //% subcategory="Inputs/Outputs"
    //% group="High Power Outputs"
    //% blockId=kitronik_environmental_board_high_power_on_off 
    //% block="turn high power %pin|%output=on_off_toggle||with duty cycle %dutyCycle"
    //% dutyCycle.min=0 dutyCycle.max=100
    //% expandableArgumentMode="toggle"
    //% weight=80 blockGap=8
    export function controlHighPowerPin(pin: kitronik_smart_greenhouse.HighPowerPins, output: boolean, dutyCycle: number = 100): void {
        if (pin == 13) {
            if (output == true) {
                if (dutyCycle != 100) {
                    let pin13Analog = dutyCycle * (1023/100)
                    pins.analogWritePin(AnalogPin.P13, pin13Analog)
                }
                else {
                    pins.digitalWritePin(DigitalPin.P13, 1)
                }
            }
            else {
                pins.digitalWritePin(DigitalPin.P13, 0)
            }
        }
        else if (pin == 14) {
            if (output == true) {
                if (dutyCycle != 100) {
                    let pin14Analog = dutyCycle * (1023/100)
                    pins.analogWritePin(AnalogPin.P14, pin14Analog)
                }
                else {
                    pins.digitalWritePin(DigitalPin.P14, 1)
                }
                
            }
            else {
                pins.digitalWritePin(DigitalPin.P14, 0)
            }
        }
    }

    /**
     * Render a boolean as an on/off toggle
     */
    //% blockId=on_off_toggle
    //% block="$on"
    //% on.shadow="toggleOnOff"
    //% blockHidden=true
    export function onOff(on: boolean): boolean {
        return on;
    }

    ////////////////////////////////
    //       DATA LOGGING         //
    ////////////////////////////////

    let NONE = 0
    let USB = 1

    let storedList: string[] = []
    let delimiter = " "
    let entryNumber = false
    let listLimit = 100
    let comms = NONE
    let entryBuild = ""
    let titleBuild = ""
    let kitronikHeader = " Kitronik Data Logger\r\n----------------------\r\n  www.kitronik.co.uk\r\n\r\n"

    export enum ListNumber{
        //% block="Send"
        Send,
        //% block="Don't Send"
        DontSend
    };
    
    export enum Separator {
      //% block="Tab"
      tab,
      //% block="Semicolon"
      semicolon,
      //% block="Comma"
      comma,
      //% block="Space"
      space
    };

    function checkAndAdd(addText: any, stringBuild: string): void{
        if (addText){
            let anyText = convertToText(addText)
            let build = ""
            if (stringBuild == "entry")
                build = entryBuild
            else if (stringBuild == "title")
                build = titleBuild

            if (anyText.length >= 10)
                build = build + anyText.substr(0, 10) + delimiter
            else {
                let numberSpace = 10 - anyText.length
                for (let whitespace=0; whitespace < numberSpace; whitespace++){
                    anyText = anyText + " "
                }
                build = build + anyText + delimiter
            }
            
            if (stringBuild == "entry")
                entryBuild = build
            else if (stringBuild == "title")
                titleBuild = build
        }
    }
    
    function sendTitle(): void{
        if (titleBuild){
            if (entryNumber == true){
                serial.writeString("   " + delimiter + titleBuild)
            }
            else {
                serial.writeString(titleBuild)
            }
            serial.writeString("\r\n")
        }
    }

    /**
     * Set the output of logged data to the USB, default baudrate is 115200
     */
    //% subcategory="Data Logging"
    //% group=Setup
    //% weight=100 blockGap=8
    //% blockId=kitronik_smart_greenhouse_output_to_usb
    //% block="set data output to USB"
    export function setDataForUSB() {
        comms = USB
        serial.redirectToUSB()
    }
    
    /**
     * Choice of which character to put between each data entry (the default is a space)
     * @param charSelect is the choice of character to separate each entry in the log
     */
    //% subcategory="Data Logging"
    //% group=Setup
    //% weight=90 blockGap=8
    //% blockId=kitronik_smart_greenhouse_select_separator
    //% block="separate entries with %charSelect"
    export function selectSeparator(charSelect: Separator): void{
        if (charSelect == Separator.tab)
            delimiter = "\t"
        else if (charSelect == Separator.semicolon)
            delimiter = ";"
        else if (charSelect == Separator.comma)
            delimiter = ","
        else if (charSelect == Separator.space)
            delimiter = " "
    }
    
    /**
     * Choice whether or not to send the data entry position number in the log
     * @param sendSelection is the choice of "Send" or "Don't Send" from the enum
     */
    //% subcategory="Data Logging"
    //% group=Setup
    //% weight=85 blockGap=8
    //% blockId=kitronik_smart_greenhouse_entry_numbers
    //% block="%sendSelection|entry positions with data"
    export function optionSendEntryNumber(sendSelection: ListNumber): void{
        if (sendSelection == ListNumber.Send)
            entryNumber = true
        else if (sendSelection == ListNumber.DontSend)
            entryNumber = false
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////                                                                                                           ////
    ////         CLICKING THE PLUS AND MINUS ICONS WORK COMPLETELY FINE FOR THE BLOCK FUNCTIONALITY,               ////
    ////              BUT AFTER CLICKING THE MINUS ICON, THE MAKECODE EDITOR COMPLETELY BREAKS.                    ////
    ////                     NO BLOCKS ARE ABLE TO BE MOVED, ADDED, DELETED OR ANYTHING.                           ////
    ////     REQUIRES THE TAB TO BE CLOSED AND A NEW WINDOW OF MAKECODE OPENED TO GET THINGS WORKING AGAIN.        ////
    ////                                           THIS MUST BE FIXED!!!                                           ////
    ////                          IT'S SOMETHING TO DO WITH THE 'checkAndAdd' FUNCTION...                          ////
    ////                          SEEMS TO HAVE GONE AWAY BY ITSELF, BUT BE SUSPICIOUS                             ////
    ////                                                                                                           ////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Input title of saved data as a column header, logged in string format. Titles will only output the first 10 characters of the string.
     * Maximum of 100 entries stored
     * @param title1 of any title to save eg: " "
     * @param title2 of any title to save eg: " "
     * @param title3 of any title to save eg: " "
     * @param title4 of any title to save eg: " "
     * @param title5 of any title to save eg: " "
     * @param title6 of any title to save eg: " "
     * @param title7 of any title to save eg: " "
     * @param title8 of any title to save eg: " "
     * @param title9 of any title to save eg: " "
     * @param title10 of any title to save eg: " "
     */
    //% subcategory="Data Logging"
    //% group=Setup
    //% weight=83 blockGap=8
    //% blockId=kitronik_smart_greenhouse_entry_title
    //% block="add data entry headings: %title1|| %title2 %title3 %title4 %title5 %title6 %title7 %title8 %title9 %title10"
    //% expandableArgumentMode="enabled" inlineInputMode=inline
    export function addTitle(title1: string, title2?: string, title3?: string, title4?: string, title5?: string, title6?: string, title7?: string, title8?: string, title9?: string, title10?: string): void{
        checkAndAdd(title1, "title")
        checkAndAdd(title2, "title")
        checkAndAdd(title3, "title")
        checkAndAdd(title4, "title")
        checkAndAdd(title5, "title")
        checkAndAdd(title6, "title")
        checkAndAdd(title7, "title")
        checkAndAdd(title8, "title")
        checkAndAdd(title9, "title")
        checkAndAdd(title10, "title")
    }

    /**
     * Input data to be saved to the logger in string format. To save numbers, convert numbers to a string.
     * @param entry1 of any data to save
     * @param entry2 of any data to save
     * @param entry3 of any data to save
     * @param entry4 of any data to save
     * @param entry5 of any data to save
     * @param entry6 of any data to save
     * @param entry7 of any data to save
     * @param entry8 of any data to save
     * @param entry9 of any data to save
     * @param entry10 of any data to save
     */
    //% subcategory="Data Logging"
    //% group=Entries
    //% weight=80 blockGap=8
    //% blockId=kitronik_smart_greenhouse_add_entry
    //% block="add data %entry1 || %entry2 %entry3 %entry4 %entry5 %entry6 %entry7 %entry8 %entry9 %entry10"
    //% expandableArgumentMode="toggle" inlineInputMode=inline
    export function addData(entry1: any, entry2?: any, entry3?: any, entry4?: any, entry5?: any, entry6?: any, entry7?: any, entry8?: any, entry9?: any, entry10?: any): void{
        if (comms == NONE)
            setDataForUSB()
        entryBuild = ""

        checkAndAdd(entry1, "entry")
        checkAndAdd(entry2, "entry")
        checkAndAdd(entry3, "entry")
        checkAndAdd(entry4, "entry")
        checkAndAdd(entry5, "entry")
        checkAndAdd(entry6, "entry")
        checkAndAdd(entry7, "entry")
        checkAndAdd(entry8, "entry")
        checkAndAdd(entry9, "entry")
        checkAndAdd(entry10, "entry")

        if (entryBuild != " ")
        {
            entryBuild = entryBuild + "\r\n"
            if (storedList.length < listLimit){
                storedList.push(entryBuild)
            }
            else if (storedList.length == listLimit){
                let remove = storedList.shift()
                storedList.push(entryBuild)
            }
        }
    }

    /**
     * Clears all data in the list.
     */
    //% subcategory="Data Logging"
    //% group=Entries
    //% weight=70 blockGap=8
    //% blockId=kitronik_smart_greenhouse_clear_data
    //% block="clear all data"
    export function clearData(): void{
        storedList = []
    }

    /**
     * Send all the stored data via comms selected
     * Maximum of 100 positions stored
     */
    //% subcategory="Data Logging"
    //% group=Transfer
    //% weight=65 blockGap=8
    //% blockId=kitronik_smart_greenhouse_send_all
    //% block="transmit all data"
    export function sendAllData(): void{
        if (comms == NONE)
            setDataForUSB()
        
        serial.writeString(kitronikHeader)
        sendTitle()
        
        let position = 0
        for (position = 0; position <= (storedList.length-1); position++)
        {
            if (entryNumber == true){
                let positionString = convertToText(position+1)
                if (positionString.length == 1)
                    positionString = "  " + positionString
                else if (positionString.length == 2)
                    positionString = " " + positionString
                serial.writeString(positionString + delimiter)
            }
            serial.writeString(storedList[position])
        }
        serial.writeString("\r\n")
    }

    /**
     * Send selected position the stored data via comms selected.
     * If entered position is greater than the total number of enteries, the max entry position is outputted.
     * @param position is the location of required data to be sent
     */
    //% subcategory="Data Logging"
    //% group=Transfer
    //% weight=60 blockGap=8
    //% blockId=kitronik_smart_greenhouse_send_selected
    //% block="transmit data at entry %position"
    //% position.min=1 position.max=100 position.defl=1
    export function sendSelectedData(position: number): void{
        if (comms == NONE)
            setDataForUSB()
        if (storedList.length < position){
            position = storedList.length
        }
        let dataEntry = storedList[position-1]
        
        serial.writeString(kitronikHeader)
        sendTitle()
        
        if (entryNumber == true){
            let positionString = convertToText(position+1)
            if (positionString.length == 1)
                positionString = "  " + positionString
            else if (positionString.length == 2)
                positionString = " " + positionString
            serial.writeString(positionString + delimiter)
        }

        serial.writeString(dataEntry)
        serial.writeString("\r\n")
    }

} 