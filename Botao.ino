#include <Botao.h>


void Botao::setupBot(int p) 
{
  buttonPin=p;
  pinMode(buttonPin, INPUT);
}
//Novas funcionalidades do botão
int Botao::ButtonDown()//no momento que pressiona, uma vez
{
  leituraBotao(); 
  if(Down)
  {    
    Down=false;
    return true;
  }
  else
  {
    return false;
  }
}
int Botao::ButtonUp()//no momento que solta, uma vez
{
  leituraBotao();
  if(Up)
  {
    Up=false;
    return true;
  }
  else
  {
    return false;
  }
}
int Botao::ButtonPressed()//botão pressionado direto
{
  leituraBotao();
  if(Pressed)
  {
    return true;
  }
  else
  {
    return false; 
  }
  
}
void Botao::leituraBotao() 
{
  // read the state of the switch into a local variable:
  int reading = digitalRead(buttonPin);

  // check to see if you just pressed the button
  // (i.e. the input went from LOW to HIGH), and you've waited long enough
  // since the last press to ignore any noise:

  // If the switch changed, due to noise or pressing:
  if (reading != lastButtonState) 
  {
    // reset the debouncing timer
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) 
  {
    // whatever the reading is at, it's been there for longer than the debounce
    // delay, so take it as the actual current state:

    // if the button state has changed:
    if (reading != buttonState) 
    {
      buttonState = reading;

      // only toggle the LED if the new button state is HIGH
      if (buttonState == HIGH) 
      {
        Pressed=true;
        Down = true;
      }
      else
      {
        Pressed=false;
        Up=true;
      }
    }
  }
  // save the reading. Next time through the loop, it'll be the lastButtonState:
  lastButtonState = reading;
}