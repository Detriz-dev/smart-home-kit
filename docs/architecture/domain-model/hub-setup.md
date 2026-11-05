# Hub and Module setup

Internal notes, moved from the public [Device lifecycle](../../../kit/apps/docs-site/docs/domain-model/device-lifecycle.mdx) page while the kit focuses on the frontend. They describe the physical steps before a Device is detected. Bring them back to the public docs when the Hub software is built.

## Setting up a Hub

A Hub needs two things before it can be detected: a Wi-Fi network and a Hub Token.

1. **Wi-Fi.** The user enters the Wi-Fi name and password when preparing the Hub's SD card (for a Raspberry Pi, in Raspberry Pi Imager).
2. **Hub Token.** The user creates a Hub Token in their Account and copies it into the Hub's settings.
3. **First start.** The Hub joins the Wi-Fi, connects to the API and sends its Hub Token. The API raises **Device Detected**, and the Hub appears as **Unpaired**, only in the Account the token belongs to.
4. **Pairing.** The user adds it, like any other Device.

## Adding a Module to a Hub

A Module is a sensor board wired to the Hub. The Hub doesn't search for boards by itself: the user lists them.

1. **Wire it.** The user connects the board to the Hub.
2. **List it.** The user adds the board to the Hub's settings, with its model name (for example BME280). The model decides the Module Type and which Sensors it has.
3. **Restart.** When the Hub starts, it raises **Device Detected** for every Module in its settings that isn't Paired yet.
4. **Pairing.** The user adds it, like any other Device.

## Simulated Devices

The API Simulator's Hubs and Modules follow the same lifecycle, statuses and events as real ones, so an app can't tell them apart. (This was rule 9 on the public page.)
