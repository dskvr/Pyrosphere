# What is a Pyrosphere?

A Pyrosphere is a 23ft Geodesic sphere with 91 torches affixed to outside of the sphere, at the vertices. The purpose is for an interactive, night-time visual art installation at NEXUS at Burning Man. 

# How does it work?

The Software side of Pyrosphere in 2013 is composed of 3 components:
- Pyroduino. A microcontroller script that reads patterns from an SD card attached to the controller, receives cammands via serial from the Server (Pyronode) and changes options (current pattern, duration of flame, and interval between frames), as well as manages 'AutoMode' when the remote has been idle. 
- Pyronode. A node.js server that handles client requests and relays to Pyronode. 
- Pyromote. A client-side web-application that allows for human interaction with the sphere. 

All of the patterns for the Pyrosphere are contained within the /Pyromotions folder. 

# Installation

## Pyroduino

### Dependencies
- SDFat

### Setup
- Connect to the Sphere Model
- Bootload.
- The sphere will blink once, this means it is setting up, and has successfully loaded the animations off the SD card. 
- Enjoy!


# Todo 
- Port code to be functional with 2013 shift registers.
- Finish Progressive Mode.
- Implement Progressive/Auto mode limits, so that if the sphere has been idle for more than .... 30 minutes? It just turns off until the remote is active again. 
- Add a new variable "Loop interval" which is similar to 'Frame Interval' but adds a delay at the end of the animation for more interactive control (defaults to FrameInterval)

# Credits
- Visionary: Erin Banwell
- Original Pyrosphere Code and Baller-ass Model: Steve Cronberg
- Shift Registers: Designed & Soldered by Leif
- Fire and Safety: Shannon Stillman
- Pyrosphere Build Crew: James Hall, Shine, Billy Hopkins,
- Programming: Jordan Layman and Sean Mitchell
- Funding: Countless individuals, thanks!

