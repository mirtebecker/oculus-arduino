void setup(){
  Serial1.begin(9600); // UART, RX (D0), TX (D1) are connected to WiFly
  Serial.begin(9600);  // USB
}
void loop(){
  if(Serial1.available() > 0){ //if RX pin (digital 0) received a message
    Serial.write(Serial1.read());
  }
  if(Serial.available() > 0){ //if USB has received a message
    Serial1.write(Serial.read());
  }
}
