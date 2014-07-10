#include "Arduino.h"
#include <WiFlyHQ.h>
//#include <SoftwareSerial.h>

/* Work around a bug with PROGMEM and PSTR where the compiler always
 * generates warnings.
 */
#undef PROGMEM 
#define PROGMEM __attribute__(( section(".progmem.data") )) 
#undef PSTR 
#define PSTR(s) (__extension__({static prog_char __c[] PROGMEM = (s); &__c[0];})) 

int getMessage(char *buf, int size);
void send(const char *data);
bool connect(const char *hostname, const char *path="/", uint16_t port=80);

//SoftwareSerial wifiSerial(8,9);
WiFly wifly;

const char mySSID[] = "Mirte's iPhone";
//const char mySSID[] = "mechanicalhuman";
const char myPassword[] = "helloworld";
//const char myPassword[] = "jorge2000";

char server[] = "172.20.10.7";
int port = 9001;

boolean handshakeComplete = false;

const static boolean GFORCE = true;
const static boolean METERS = false;

// w/ MMA7361 accelerometer
byte _sleepPin = 16;
byte _xpin = A0;
byte _ypin = A1;
byte _zpin = A2;

// w/ ADXL335 accelerometer
//byte _xpin = A2;
//byte _ypin = A3;
//byte _zpin = A4;

int _gc = 92; // gravity constant (inverted for proper sinage)

int _0z = 660; // defaults to read values (this is how you would hardcode a calibration)
int _0x = 660; // defaults to read values
int _0y = 677; // defaults to reasonable values
boolean _calibrated = false;

void setup(){
  Serial.begin(115200);
  
  pinMode(_sleepPin, OUTPUT); // output mode
  pinMode(_xpin, INPUT); // input mode
  pinMode(_ypin, INPUT); // input mode
  pinMode(_zpin, INPUT); // input mode

  digitalWrite(_sleepPin, HIGH); // turns off sleep mode and activates device
  digitalWrite(_xpin, HIGH); // turn on pull up resistor
  digitalWrite(_ypin, HIGH); // turn on pull up resistor
  digitalWrite(_zpin, HIGH); // turn on pull up resistor
  
  calibrate();

  Serial1.begin(9600);
  if (!wifly.begin(&Serial1)) {
      //Serial.println(F("Failed to start wifly"));
	wifly.terminal();
  }

  /* Join wifi network if not already associated */
  if (!wifly.isAssociated()) {
	Serial.println(F("Joining network"));
      wifly.setSSID(mySSID);
      wifly.setPassphrase(myPassword);
      wifly.setJoin(WIFLY_WLAN_JOIN_AUTO);
      wifly.enableDHCP();
      wifly.setIpProtocol(WIFLY_PROTOCOL_TCP);
      
	if (wifly.join(mySSID, myPassword, true)) {
	    wifly.save();
	    Serial.println(F("Joined wifi network"));
	} else {
	    Serial.println(F("Failed to join wifi network"));
	    wifly.terminal();
	}
  } else {
      Serial.println(F("Already joined network"));
  }

  if (!connect(server, "/", port)) {
	Serial.print(F("Failed to connect to "));
	Serial.println(server);
	wifly.terminal();
  } else {
    handshakeComplete = true;
  }
}

char inBuf[128];
char outBuf[128];
uint8_t outBufInd = 0;

void loop() {
  if (getMessage(inBuf, sizeof(inBuf)) > 0) {
	Serial.print(F("Received response: "));
	Serial.println(inBuf);
  }

  if (Serial.available()) {
      char ch = Serial.read();
      if (ch == '\r') {
	    /* Got a carriage return, send the message */
	    outBuf[outBufInd] = 0;	// null terminate the string
	    send(outBuf);
	    outBufInd = 0;
	    Serial.println();
	} else if (outBufInd < (sizeof(outBuf) - 1)) {
	    outBuf[outBufInd] = ch;
	    outBufInd++;
	    Serial.write(ch);		// echo input back to Serial monitor
	}
  }
  
  if (handshakeComplete){
//     wifly.print("X");
     wifly.print(convert(analogRead(_xpin), _0x), DEC);
//     wifly.print(" Y");
//     wifly.print(convert(analogRead(_ypin), _0y), DEC);
//     wifly.print(" Z");
//     wifly.println(convert(analogRead(_zpin), _0z), DEC);
     delay(500);
  }
}

int getMessage(char *buf, int size){
  int len = 0; 
  
  if (wifly.available() > 0) {
    if (wifly.read() == 0) {
      /* read up to the end of the message (255) */
      len = wifly.getsTerm(buf, size, 255);
    }
  }
  return len;
}

void send(const char *data) {
  wifly.write((uint8_t)0);
  wifly.write(data);
  wifly.write((uint8_t)255);
}

bool connect(const char *hostname, const char *path, uint16_t port){
  if (!wifly.open(hostname, port)) {
      Serial.println(F("connect: failed to open TCP connection"));
	return false;
  }

  wifly.print(F("GET "));
  wifly.print(path);
  wifly.println(F(" HTTP/1.1"));
  wifly.println(F("Upgrade: WebSocket"));
  wifly.println(F("Sec-WebSocket-Key: bWlydGU="));
  wifly.println(F("Sec-WebSocket-Version: 13"));
  wifly.println(F("Connection: Upgrade"));
  wifly.print(F("Host: "));
  wifly.println(hostname);
  wifly.println(F("Origin:"));
  wifly.println();

  /* Wait for the handshake response */
  if (wifly.match(F("HTTP/1.1 101"), 1000)) {
      Serial.println("connect: received handshake from server");
      wifly.println("connect: handshake complete");
	wifly.flushRx(200);
	return true;
  }
  
  Serial.println(F("connect: handshake failed"));
  wifly.close();

  return true;
}

void calibrate(){
  Serial.println("Please place device right-side up on a flat surface.");
  delay(2000); //give user two seconds to comply.
  Serial.println("Calibrating");
  
  _0z = readAverage(_zpin, 10) - _gc; // remove 1 G from the reading to get an accurate 0G
  Serial.print("Z Axis Calibrated:"); Serial.println(_0z);
  _0x = readAverage(_xpin, 10);
  Serial.print("X Axis Calibrated:"); Serial.println(_0x);
  _0y = readAverage(_ypin, 10);
  Serial.print("Y Axis Calibrated:"); Serial.println(_0y);
  
  _calibrated = true;
}

int readAverage(int pin, int samples){
  long readings = 0;
  
  for(int i = 0; i < samples; i++){
    readings += analogRead(pin);
  }

  return (readings/samples);
}

float convert(float myReading, float my0G){
  return convert(myReading, my0G, GFORCE); // defaults to G-Forces
}

float convert(float myReading, float my0G, bool myUnits){
  float myResult=((my0G-myReading)/(_gc));
  
  if(myUnits)
    return myResult; // G-Forces
  else {
    return (myResult * 9.80665);
  }
  
// converts to m/s^2 using conventional value for gravity.
// if you are on a different planet you may need to use a
// value for your conversions.
}

