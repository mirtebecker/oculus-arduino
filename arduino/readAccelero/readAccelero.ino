#include <AcceleroMMA7361.h>

AcceleroMMA7361 accelero;
int x;
int y;
int z;

void setup(){
  Serial.begin(9600);
  // sleep, stp, og, gsel, x, y, z
  accelero.begin(13, 12, 11, 10, A1, A2, A3);
  //accelero.setARefVoltage(3.3);
  accelero.setSensitivity(HIGH);
  //accelero.calibrate();
}

void loop(){
  x = accelero.getXAccel();
  y = accelero.getYAccel();
  z = accelero.getZAccel();
  Serial.print("X");
  Serial.println(x);
  Serial.print("Y");
  Serial.println(y);
  Serial.print("Z");
  Serial.println(z);
  delay(500);
}
