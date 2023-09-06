#include <avr/pgmspace.h>
#include <SdFat.h>

#define VERSION 2

// Pin values for talking to shift registers
#define DATA_PIN1 7
#define LATCH_PIN1 2
#define CLOCK_PIN1 6

// General Definitions
#define NUM_REGISTERS 12
#define LINE1 47
#define LINE2 44
#define TOTAL_NODES 96
#define FILE_NAME_SIZE 12

// Interval Limits
#define MIN_FRAME_INTERVAL 35
#define DEFAULT_FRAME_INTERVAL 100
#define MAX_FRAME_INTERVAL 10000

// Duration Limits
#define MIN_FRAME_DURATION 10
#define DEFAULT_FRAME_DURATION 75
#define MAX_FRAME_DURATION 750

typedef struct _frame {
    int8_t frameChunk[NUM_REGISTERS];
} Frame;

// Macros
#define nodeOnMacro(FRAME, FLAMENUM) ((FRAME).frameChunk[((uint8_t)(FLAMENUM)) >> 3] |= _BV((FLAMENUM & 0x07)))
#define nodeOffMacro(FRAME, FLAMENUM) ((FRAME).frameChunk[((uint8_t)(FLAMENUM)) >> 3] &= ~_BV((FLAMENUM & 0x07)))
#define isFlameOn(FRAME, FLAMENUM) ((FRAME).frameChunk[((uint8_t)(FLAMENUM)) >> 3] & _BV((FLAMENUM & 0x07)))

// SD library interfacing
Sd2Card card;
SdVolume volume;
SdFile root;
SdFile animation;

uint8_t partition = 1;
uint8_t chipSelect = 8;
dir_t directory;

int totalFiles;
char* currentPattern;
char currentFile[13];

// Runtime Variables
long nodeTimeStamps[TOTAL_NODES];
long nodeDurations[TOTAL_NODES];
long frameInterval = DEFAULT_FRAME_INTERVAL;
long frameDuration = DEFAULT_FRAME_DURATION;

// Control Mode
int controlMode = 0;

// Frame
Frame frameBuffer;
char messageBuffer[8];
int bufferIndex = 0;

boolean active = true;
boolean status = false;
boolean debug = true;
boolean verbose = false;

const prog_int8_t mappingArray_P[TOTAL_NODES] PROGMEM = {95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60,59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0};

boolean updateFrame() {
    int8_t index = 0;
    int8_t data_size = 98;
    byte fileContents[data_size];
    
    index = animation.read(fileContents, data_size);
    if(index == data_size) {
        for(int i = 0; i < data_size - 2; i++) {
            if(fileContents[i] == '1') {
                int j = i;
                if(i >= 32) {
                    j--;
                }
                if(i >= 64) {
                    j -= 2;
                }
                nodeOn(j);
            }
        }
        return 0;
    } else {
        animation.rewind();
        index = animation.read(fileContents, data_size);
        for(int i = 0; i < data_size - 1; i++) {
            if(fileContents[i] == '1') {
                nodeOn(i);
            }
        }
        return 1;
    }
}

boolean getTotalFiles() {
    totalFiles = 0;
    while(root.readDir(&directory) > 0) {
        totalFiles++;
    }
    root.rewind();
    return true;
}

void randomAnimation() {
    Serial.print("Selecting Random Animation: ");
    int randNum = random(totalFiles);
    root.rewind();

    for(int i = 0; i < randNum; i++) {
        if(!root.readDir(&directory)) {
            Serial.print("root.Readdir: ");
            Serial.println(i, DEC);
        }
    }

    SdFile::dirName(directory, currentFile);
    Serial.println(currentFile);
    animation.close();

    if(!animation.open(&root, root.curPosition() / 32 - 1, O_READ)) {
        for(int i = 0; i < 5; i++) {
            for(int j = 0; j < randNum; j++) {
                if(!root.readDir(&directory)) {
                    Serial.print("root.Readdir: ");
                    Serial.println(i, DEC);
                } else {
                    break;
                }
            }
            animation.close();
            if(animation.open(&root, root.curPosition() / 32 - 1, O_READ)) {
                break;
                Serial.println("Open failed");
            }
        }
    }
    animation.rewind();
}

/*

 #####  ####### ####### #     # ######  
#     # #          #    #     # #     # 
#       #          #    #     # #     # 
 #####  #####      #    #     # ######  
      # #          #    #     # #       
#     # #          #    #     # #       
 #####  #######    #     #####  #

*/

//There is some super weird stuff going on in here. We need to figure out why, and how to fix it.
//DEBUGGING: Pyrosphere won't respond? Wait 5 seconds after bootloading, and then open the Serial Monitor.

void setup() {
  pinMode(DATA_PIN1, OUTPUT);
  pinMode(LATCH_PIN1, OUTPUT);
  pinMode(CLOCK_PIN1, OUTPUT);

  delay(1000);
  Serial.begin(115200);
  Serial.println("One Sec");
  delay(1000);
  Serial.println("Setup");
  flash();
  status = mount();
  Serial.print("Mode: ");
  Serial.println(controlMode);
}

/*

#     # ####### #     # #     # ####### 
##   ## #     # #     # ##    #    #    
# # # # #     # #     # # #   #    #    
#  #  # #     # #     # #  #  #    #    
#     # #     # #     # #   # #    #    
#     # #     # #     # #    ##    #    
#     # #######  #####  #     #    #

*/

boolean mount() {
  bool error = false;
  Serial.print("Initializing Card. ");

  if (VERSION != 1) {
    chipSelect = 4;
    int sdpin = 54;
    pinMode(sdpin, OUTPUT);
    digitalWrite(sdpin, HIGH);
  }

  if (!card.init(SPI_FULL_SPEED, chipSelect)) {
    Serial.println("ERROR: card.init");
    error = true;
  } else {
    Serial.println("SUCCESS SD2Card Init");
  }
  delay(500);

  Serial.print("Mounting Volume. ");
  if (!volume.init(&card)) {
    Serial.println("ERROR: volume.init");
    error = true;
  }
  delay(500);

  Serial.print("Setting Root. ");
  if (!root.openRoot(&volume)) {
    Serial.println("ERROR: openRoot");
    error = true;
  }
  delay(500);

  Serial.print("Status: ");
  Serial.println(status);

  root.readDir(&directory);
  if (!animation.open(&root, root.curPosition() / 32 - 1, O_READ)) {
    Serial.println("ERROR: Initial open file");
  }

  delay(500);
  root.rewind();
  delay(2000);

  while (!getTotalFiles()) {}

  Serial.print("Total Files: ");
  Serial.println(totalFiles);

  if (error) {
    Serial.println("FAIL. Trying again soon...");
    return false;
  } else {
    return true;
  }
}

/*

#       ####### ####### ######  
#       #     # #     # #     # 
#       #     # #     # #     # 
#       #     # #     # ######  
#       #     # #     # #       
#       #     # #     # #       
####### ####### ####### #       

*/

static long then = 0;
static long now = 0;

static int8_t loopThresh = 3;
static int8_t loopCount = loopThresh + 1;

static boolean autoPilot = true;
static uint16_t serialTimeout = 20000;
static long lastSerialCMD = 0;
uint8_t readMode = 0;

void loop() {
  if (!status) {
    Serial.println("ReMounting...");
    flash();
    status = mount();
    delay(5000);
    return;
  }

  now = millis();
  flameSustain();
  modeSelektor();

  if (!active) {
    ceaseFire();
  }
  ignite();

  while (Serial.available() > 0) {
    char x = Serial.read();
    serialRouting(x);
  }
}

void statusUpdate() {
  Serial.println("<=== Pyrosphere Status Update ===>");
  Serial.print("Frame Interval: ");
  Serial.println(frameInterval);
  Serial.print("Frame Duration: ");
  Serial.println(frameDuration);
  Serial.print("System Mode: ");
  Serial.println(controlMode);
  Serial.print("Loaded Pattern: ");
  Serial.println(currentFile);
  Serial.print("Current Loop Count: ");
  Serial.println(loopCount);
  Serial.println("===>");
  resetMessageBuffer();
}

void serialRouting(char x) {
  if (x == '!') {
    readMode = 1;
  } else if (x == '@') {
    readMode = 2;
  } else if (x == '#') {
    readMode = 3;
  } else if (x == '+') {
    readMode = 4;
  } else if (x == '-') {
    readMode = 5;
  } else if (x == '~') {
    readMode = 6;
  } else if (x == '*') {
    readMode = 7;
  } else if (x == '/') {
    getFiles();
  } else if (x == '?') {
    statusUpdate();
  } else if (x == '.') {
    switch (readMode) {
      case 1:
        setPattern();
        break;
      case 2:
        setDuration();
        break;
      case 3:
        setInterval();
        break;
      case 4:
        setValveOn();
        break;
      case 5:
        setValveOff();
        break;
      case 6:
        setMode();
        break;
      case 7:
        setActive();
        break;
      default:
        break;
    }

    lastSerialCMD = now;
    readMode = 0;
    autoPilot = false;
    bufferIndex = 0;

  } else {
    messageBuffer[bufferIndex++] = x;
  }
}

/*
 ###### #        ##   #    # ###### 
 #      #       #  #  ##  ## #      
 #####  #      #    # # ## # #####  
 #      #      ###### #    # #      
 #      #      #    # #    # #      
 #      ###### #    # #    # ###### 

  ####   ####  #    # ##### #####   ####  #      
 #    # #    # ##   #   #   #    # #    # #      
 #      #    # # #  #   #   #    # #    # #      
 #      #    # #  # #   #   #####  #    # #      
 #    # #    # #   ##   #   #   #  #    # #      
  ####   ####  #    #   #   #    #  ####  ######

flame control
*/

/*************************************************************************************
 * Serial Polling
 * Checks for last successful serial request.
 *************************************************************************************/
/*
void serialPolling() {
    if (!active) {
        ceaseFire();
    } else {
        if(now - lastSerialCMD > serialTimeout) {
            if(!autoPilot) {
                Serial.println("Automatic love generation.");
            }
            autoPilot = true;
            controlMode = 1;
        }
    }
}
*/

/*************************************************************************************
 * Mode Selector
 * Switches behavior based on the current mode.
 *************************************************************************************/
void modeSelektor() {
    long since = now - then;

    if (!active) {
        ceaseFire();
    } else if(now - lastSerialCMD > serialTimeout) {
        if(controlMode != 0) {
            // Serial.println("Automatic love generation.");
            // autoPilot = true;
            // setMode(0);
        }
    }

    if(controlMode != 2 && (since > frameInterval || since > MAX_FRAME_INTERVAL)) {
        nextFrame();
    }
}

void nextFrame() {
    if(updateFrame()) {
        if(loopCount > loopThresh) {
            // Serial.println("<=== Repeating! ===>");
            // delay(1000); flash(); delay(100); flash(); delay(100); flash(); delay(1000);

            if (controlMode == 0) {
                randomAnimation();
            } else if (controlMode == 1) {
                nextPattern();
            }

            loopCount = 0;
        } else {
            loopCount++;
        }
    }

    then = now;
}

/*************************************************************************************
 * Safety + Sustain
 * Checks for last successful serial request.
 *************************************************************************************/
void flameSustain() {
    for(int i = 0; i < TOTAL_NODES; i++) {
        long onFor = now - nodeTimeStamps[i];

        if(nodeTimeStamps[i] <= 0) continue;

        if (controlMode == 2 && (onFor > nodeDurations[i] || onFor > MAX_FRAME_DURATION)) {
            nodeOff(i);
            nodeDurations[i] = 0;
        } else if (onFor > frameDuration || onFor > MAX_FRAME_DURATION) {
            nodeOff(i);
        }
    }
}

/*************************************************************************************
 * Pattern management and other controls
 *************************************************************************************/

void setPattern() {
    char *patternName = messageBuffer;
    strcat(patternName, ".dat");
    setMode(1);
    changePattern(patternName);
    resetMessageBuffer();
}

void setInterval() {
    frameInterval = atoi(messageBuffer);
    resetMessageBuffer();
}

void setDuration() {
    frameDuration = atoi(messageBuffer);
    resetMessageBuffer();
}

void setValveOn() {
    int valveID = atoi(messageBuffer);

    if (valveID < TOTAL_NODES) {
        if (controlMode != 2) {
            setMode(2);
        }

        nodeOn(valveID);
        nodeDurations[valveID] = frameDuration;
    }

    resetMessageBuffer();
}

void setValveOff() {
    int valveID = atoi(messageBuffer);

    if (valveID < TOTAL_NODES) {
        nodeOff(valveID);
    }

    resetMessageBuffer();
}

void setMode() {
    char *modeSig = messageBuffer;
    uint8_t mode = atoi(modeSig);
    setMode(mode);
    resetMessageBuffer();
}

void setMode(uint8_t m) {
    Serial.print("Setting Mode: ");
    Serial.println(m);

    switch(m) {
        case 0:
            controlMode = 0;
            loopCount = 0;
            break;
        case 1:
            controlMode = 1;
            loopCount = 0;
            break;
        case 2:
            controlMode = 2;
            break;
        case 3:
            controlMode = 3;
            break;
        case 4:
            controlMode = 4;
            break;
        case 5:
            controlMode = 5;
            break;
        default:
            break;
    }
}

void setActive() {
    char *activeSig = messageBuffer;
    int sig = atoi(activeSig);

    switch(sig) {
        case 0:
            active = false;
            break;
        case 1:
            active = true;
            break;
        case 2:
            resetPattern();
            break;
        default:
            break;
    }

    resetMessageBuffer();
}

void resetPattern() {
    animation.rewind();
    loopCount = 0;
}

void getFiles() {
    // while(root.readDir(&directory)) {}
}

void ceaseFire() {
    initFrameBuffer();
}

void resetMessageBuffer() {
    memset(messageBuffer, '\0', sizeof(messageBuffer));
}

/*

	######     #    #######    #    
	#     #   # #      #      # #   
	#     #  #   #     #     #   #  
	#     # #     #    #    #     # 
	#     # #######    #    ####### 
	#     # #     #    #    #     # 
	######  #     #    #    #     # 

*/

/*************************************************************************************
 * Data Functions:
 * ignite() - sends the contents of frameBuffer to the shift registers
 * initFrameBuffer() - sets every node to off
 *************************************************************************************/

// Send the frameBuffer (buffer) to the shift registers
void ignite(){
	volatile int foo;
	digitalWrite(LATCH_PIN1, LOW);
	for(int i = 0; i < NUM_REGISTERS; i++){
		shiftOut(DATA_PIN1, CLOCK_PIN1, MSBFIRST, frameBuffer.frameChunk[i]);
	}
	for (foo = 0; foo < 3000; foo++);
	digitalWrite(LATCH_PIN1, HIGH);
	for (foo = 0; foo < 3000; foo++);
}

void initFrameBuffer(){
	for(int i = 0; i < NUM_REGISTERS; i++){
		frameBuffer.frameChunk[i] = B00000000;
	}
}

void nextPattern() {
	if(root.readDir(&directory) <= 0){
		root.rewind();
		root.readDir(&directory);
	}

	SdFile::dirName(directory, currentFile);
	Serial.print("Next Pattern..."); 
	Serial.println(currentFile);    
	changePattern(currentFile);
}

void prevPattern(){
	//Stub 
}

void changePattern(char *fileName){
	animation.close();    // Close the file
	Serial.print("Opening Pattern: "); 
	Serial.println(fileName);

	if(!animation.open(&root, fileName, O_READ)){
		Serial.print("Couldn't open pattern:"); 
		Serial.print(fileName); 
	}
}

void toggleDebug(char *val){
	if (atoi(val) == 0) {
		debug = false;
		Serial.println("goodbye");
	} else {
		debug = true;
		Serial.println("hello");
	}
}

void flash(){
	digitalWrite(LATCH_PIN1, LOW);
	for(int i = 0; i < NUM_REGISTERS; i++){
		shiftOut(DATA_PIN1, CLOCK_PIN1, MSBFIRST, B11111111);
	}
	digitalWrite(LATCH_PIN1, HIGH);
	delay(400);
	digitalWrite(LATCH_PIN1, LOW);
	for(int i = 0; i < NUM_REGISTERS; i++){
		shiftOut(DATA_PIN1, CLOCK_PIN1, MSBFIRST, B00000000);
	}
	digitalWrite(LATCH_PIN1, HIGH);
}

void nodeOn(int8_t nodeNum){
	int8_t mappedValue = pgm_read_byte(&mappingArray_P[nodeNum]);
	nodeTimeStamps[nodeNum] = millis();
	nodeOnMacro(frameBuffer, mappedValue);
}

void nodeOff(int8_t nodeNum){
	int8_t mappedValue = pgm_read_byte(&mappingArray_P[nodeNum]);
	nodeTimeStamps[nodeNum] = -1;
	nodeOffMacro(frameBuffer, mappedValue);
}

void shiftOut(uint8_t dataPin, uint8_t clockPin, uint8_t bitOrder, uint8_t val){
	uint8_t i;
	volatile int foo;
	
	for (i = 0; i < 8; i++){
		if (bitOrder == LSBFIRST)
			digitalWrite(dataPin, !!(val & (1 << i)));
		else	
			digitalWrite(dataPin, !!(val & (1 << (7 - i))));
			
		for (foo = 0; foo < 3000; foo++);
		
		digitalWrite(clockPin, HIGH);
		digitalWrite(clockPin, LOW);		
	}
}

