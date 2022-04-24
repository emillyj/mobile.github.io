//obter referências aos elementos da interface do usuário
let connectButton = document.getElementById('conectar');
let disconnectButton = document.getElementById('desconectar');
let terminalContainer = document.getElementById('terminal');
let sendForm = document.getElementById('envio-formulario');
let inputField = document.getElementById('enviar');


// Conecte-se ao dispositivo ao clicar no botão Conectar
connectButton.addEventListener('click', function() {
  connect();

 });

// Desconectar ao dispositivo ao clicar no botão Desconectar
disconnectButton.addEventListener('click', function() {
  disconnect();
});

// Manipula o evento de envio do formulário
sendForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form sending
  send(inputField.value); // Send text field contents
  inputField.value = '';  // Zero text field
  inputField.focus();     // Focus on text field
});

// Inicia o seletor de dispositivos Bluetooth e conecta ao selecionado
function connect() {
  //
}

// Desconecta do dispositivo conectado
function disconnect() {
  //
}
// Cache de objeto de dispositivo selecionado
let deviceCache = null;

// Inicia o seletor de dispositivos Bluetooth e conecta ao selecionado

function connect() {
  return (deviceCache ? Promise.resolve(deviceCache) :
      requestBluetoothDevice()).
      then(device => connectDeviceAndCacheCharacteristic(device)).
      then(characteristic => startNotifications(characteristic)).
      catch(error => log(error));
      }

function requestBluetoothDevice() {
}

// Conecte-se ao dispositivo especificado, obtenha serviço e característica
function connectDeviceAndCacheCharacteristic(device) {
}

// Habilita a notificação de mudanças de características
function startNotifications(characteristic) {
}

// Saída para o terminal
function log(data, type = '') {
}

//
function requestBluetoothDevice() {
  log('Requesting bluetooth device...');

return navigator.bluetooth.requestDevice({
    filters: [{services: [0xFFE0]}],
  }).
      then(device => {
        log('"' + device.name + '" bluetooth device selected');
        deviceCache = device;

        return deviceCache;
      });
}

// Cache de objeto característico
let characteristicCache = null;


// Conecte-se ao dispositivo especificado, obtenha serviço e característica
function connectDeviceAndCacheCharacteristic(device) {
  if (device.gatt.connected && characteristicCache) {
    return Promise.resolve(characteristicCache);
  }

 log('Connecting to GATT server...');

  return device.gatt.connect().
      then(server => {
        log('GATT server connected, getting service...');

        return server.getPrimaryService(0xFFE0);
      }).
      then(service => {
        log('Service found, getting characteristic...');

        return service.getCharacteristic(0xFFE1);
      }).
      then(characteristic => {
        log('Characteristic found');
        characteristicCache = characteristic;

         return characteristicCache;
      });
}


// Habilita a notificação de mudanças de características
function startNotifications(characteristic) {
  log('Starting notifications...');

  return characteristic.startNotifications().
      then(() => {
        log('Notifications started');
      });
}

//saída para o terminal
function log(data, type = '') {
  terminalContainer.insertAdjacentHTML('beforeend',
      '<div' + (type ? ' class="' + type + '"' : '') + '>' + data + '</div>');
}