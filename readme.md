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


### Notes
- Pyroduino Was coded with Tab Size set as 2... You will thank me later.
- This code is a mess. Here's what's going on in the loop, since it's not directly obvious...
	- Configuring application parameters
	- Mounting SD and directory. 
	- Checking for Connection "is there serial"
		- *if there is... we're reading the data
			- applying the data in realtime to the global scope after routing
	- otherwise we are running 'Auto Pilot'
		- loading the pattern/animation
	- running conditions on timing to determine whether or not to...
		- Check valves against pinmap timestamps.
	- turn on the valves.
	- next frame (update frame buffer)
			
		serialRouting is called at the wrong point in the scope to work with set valves.
		
## Pyromote 
- Edit socket URI to match your own in ./lib/js/pyro/pyro.config ... see examples
- Edit index.html and change host to match your own (if you have a good way to configure this, let me know!)
		
## Pyronode 
- Install dependencies
	cd Pyronode && sudo npm install

- Start app
	sudo node app.js
	 
	
## Test! 
- Load up localhost:8080/ in your browser (or whatever host you have set)
- Open console
- Click the XY
	
# Hack! 
- !00. = Pattern Number
- @100. = duration
- #100. = Interval.
- Send these parameters to the server via event 'pyro.pipe' to alter interval variables.
- Coming soon! "^1,1." ... Turn valve one on (safety feature will turn itself off.)

# Todo 
- Port code to be functional with 2013 shift registers. (Leif!!!)
- Finish Progressive Mode.
- Implement Progressive/Auto mode limits, so that if the sphere has been idle for more than .... 30 minutes? It just turns off until the remote is active again. 
- Add a new variable "Loop interval" which is similar to 'Frame Interval' but adds a delay at the end of the animation for more interactive control (defaults to FrameInterval)
- Create repositories for each component, include as submodules within this repo.
- Create session manager for Pyrosphere to eliminate potential issues with multiple clients.
- Preload assets and application before allowing interaction.
- Get feedback from UI (This branch is not yet published! view demo.html for the Ported Prototype!)

# Credits
- Visionary: Erin Banwell
- Original Pyrosphere Code and Baller-ass Model: Steve Cronberg
- Shift Registers: Designed & Soldered by Leif
- Fire and Safety: Shannon Stillman
- Pyrosphere Build Crew: James Hall, Shine, Billy Hopkins,
- Programming: Jordan Layman and Sean Mitchell
- Funding: Countless individuals, thanks!

