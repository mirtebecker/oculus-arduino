// with help from https://www.virtuabotix.com/guide/advanced-accellerometer-guide-converting-analog-readings-to-g-forces/

const static boolean GFORCE = true;
const static boolean METERS = false;

byte _sleepPin= 11;
byte _GS= 9;
byte _xpin= A0;
byte _ypin = A1;
byte _zpin = A2;

int _gc = 92; //gravity constant (inverted for proper sinage)

int _0z = 660; //defaults to read values (this is how you would hardcode a calibration)
int _0x = 660; //defaults to read values
int _0y = 677; //defaults to reasonable values
boolean _calibrated = false;

void setup(){
  Serial.begin(9600);
  
  pinMode(_sleepPin,OUTPUT); //output mode
  pinMode(_GS,OUTPUT); //output mode
  pinMode(_xpin, INPUT); //input mode
  pinMode(_ypin, INPUT); //input mode
  pinMode(_zpin, INPUT); //input mode

  digitalWrite(_GS, LOW); //sets GS mode
  digitalWrite(_sleepPin, HIGH); //turns off sleep mode and activates device
  digitalWrite(_xpin, HIGH); //turn on pull up resistor
  digitalWrite(_ypin, HIGH); //turn on pull up resistor
  digitalWrite(_zpin, HIGH); //turn on pull up resistor
  
  calibrate();
}

void loop(){
  delay(2000); //Delay for readability
  
  //Serial.println("In G-FORCES:");
  Serial.print(convert(analogRead(_xpin), _0x), DEC);
  Serial.print(" | ");
  Serial.print(convert(analogRead(_ypin), _0y), DEC);
  Serial.print(" | ");
  Serial.println(convert(analogRead(_zpin), _0z), DEC);
  
  //Serial.println();
  
//  Serial.println("In Meters Per Second-Squared:");
//  Serial.print(convert(analogRead(_xpin), _0x, METERS), DEC);
//  Serial.print(convert(analogRead(_ypin), _0y, METERS), DEC);
//  Serial.println(convert(analogRead(_zpin), _0z, METERS), DEC);
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
  return convert(myReading, my0G, GFORCE);//defaults to G-Forces
}

float convert(float myReading, float my0G, bool myUnits){
  float myResult=((my0G-myReading)/(_gc));
  
  if(myUnits)
    return myResult; //G-Forces
  else {
    return (myResult * 9.80665);
  }
  
// converts to m/s^2 using conventional value for gravity.
// if you are on a different planet you may need to use a
// value for your conversions.
}
