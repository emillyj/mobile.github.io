// Obtém referências aos elementos da interface do usuário
let connectButton = document.getElementById('connect');
let disconnectButton = document.getElementById('disconnect');
/*******************************************************************************
* Aqui começam as modificações do código original!!!!
*******************************************************************************/
let terminalContainer = document.getElementById('saida');
let switchQualquer = document.getElementById('SwitchA');
let medidorQualquer=document.getElementById('BarraA');
// Funções para os controles gráficos
function MudouSwitch()
{
	if(switchQualquer.checked)
	{
		send('#g1');//lá no arduino tem que capturar os valores
		switchQualquer.removeAttr('checked');
		
	}
	else
	{
		send('#g0');//lá no arduino tem que capturar os valores
		switchQualquer.attr('checked')	
		
	}
}
//TROQUEI DE LUGAR A FUNÇÃO EM RELAÇÃO AO CÓDIGO ORIGINAL!!!!
// Processa os dados recebidos
function receive(data) {
	if(data.substr(0, 2)=="#b")
	{
		var valor=parseInt(data.substr(2,data.length));		
		controleMedidor(valor);		
	}
	
}
function controleMedidor(v)
{
	log(v,'in');
	medidorQualquer.value+=v;
	
}

// Conecta-se ao dispositivo ao clicar no botão Conectar
connectButton.addEventListener('click', function() {
  connect();
});

// Desconecta do dispositivo quando o botão Desconectar é clicado
disconnectButton.addEventListener('click', function() {
  disconnect();
});


// Cache de objeto de dispositivo selecionado
let deviceCache = null;

// Cache de objeto de recurso
let characteristicCache = null;

// Buffer intermediário para dados de entrada
let readBuffer = '';

// Inicia a seleção do dispositivo Bluetooth e conecta-se ao
function connect() {
  return (deviceCache ? Promise.resolve(deviceCache) :
      requestBluetoothDevice()).
      then(device => connectDeviceAndCacheCharacteristic(device)).
      then(characteristic => startNotifications(characteristic)).
      catch(error => log(error));
}

// Solicitação para selecionar um dispositivo Bluetooth
function requestBluetoothDevice() {
  log('Buscando dispositivo bluetooth...');

  return navigator.bluetooth.requestDevice({
    filters: [{services: [0xFFE0]}],
  }).
      then(device => {
        log('"' + device.name + '" Dispositivo bluetooth selecionado');
        deviceCache = device;
        deviceCache.addEventListener('gattserverdisconnected',
            handleDisconnection);

        return deviceCache;
      });
}
_________________________________________________________________________________________
// Desconecta o manipulador
function handleDisconnection(event) {
  let device = event.target;

  log('"' + device.name +
      '" Dsipositivo bluetooth desconectado, tentando reconectar...');

  connectDeviceAndCacheCharacteristic(device).
      then(characteristic => startNotifications(characteristic)).
      catch(error => log(error));
}

// Conecte-se a um dispositivo específico, obtenha serviço e características
function connectDeviceAndCacheCharacteristic(device) {
  if (device.gatt.connected && characteristicCache) {
    return Promise.resolve(characteristicCache);
  }

  log('Conectando ao bluetooth...');

  return device.gatt.connect().
      then(server => {
        log('Bluetooth conectado, recebendo dados do "Puppy Care"...');

        return server.getPrimaryService(0xFFE0);
      }).
      then(service => {
        log('Dados encontrados, Atualizando informações...');

        return service.getCharacteristic(0xFFE1);
      }).
      then(characteristic => {
        log('Informações atualizadas');
        characteristicCache = characteristic;

        return characteristicCache;
      });
}
____________________________________________________________________
// Habilitando o recebimento de notificações sobre a mudança da característica
function startNotifications(characteristic) {
  log('Iniciando notificações...');

  return characteristic.startNotifications().
      then(() => {
        log('Notificações iniciadas');
        characteristic.addEventListener('characteristicvaluechanged',
            handleCharacteristicValueChanged);
      });
}

// Obter dados
function handleCharacteristicValueChanged(event) {
  let value = new TextDecoder().decode(event.target.value);

  for (let c of value) {
    if (c === '\n') {
      let data = readBuffer.trim();
      readBuffer = '';

      if (data) {
        receive(data);
      }
    }
    else {
      readBuffer += c;
    }
  }
}

// Saída para o terminal
function log(data, type = '') {
  //terminalContainer.insertAdjacentHTML('beforeend',
  //    '<div' + (type ? ' class="' + type + '"' : '') + '>' + data + '</div>');
  terminalContainer.innerHTML=data;
}
__________________________________________________________________________
// Desconecta do dispositivo conectado
function disconnect() {
  if (deviceCache) {
    log('Disconnecting from "' + deviceCache.name + '" Dispositivo bluetooth...');
    deviceCache.removeEventListener('gattserverdisconnected',
        handleDisconnection);

    if (deviceCache.gatt.connected) {
      deviceCache.gatt.disconnect();
      log('"' + deviceCache.name + '" Dispositivo bluetooth desconectado');
    }

    else {
      log('"' + deviceCache.name +
          '" dispositivo bluetooth já está desconectado');
    }
  }

  if (characteristicCache) {
    characteristicCache.removeEventListener('characteristicvaluechanged',
        handleCharacteristicValueChanged);
    characteristicCache = null;
  }

  deviceCache = null;
}

//Envia dados para o dispositivo conectado
function send(data) {
	log("enviando",'out');
	data = String(data);
	try
	{
	  if (!data || !characteristicCache) {
		log("Você precisa clicar em conectar primeiro",'out');
		return;
	  }

	  data += '\n';

	  if (data.length > 20) {
		let chunks = data.match(/(.|[\r\n]){1,20}/g);

		writeToCharacteristic(characteristicCache, chunks[0]);

		for (let i = 1; i < chunks.length; i++) {
		  setTimeout(() => {
			writeToCharacteristic(characteristicCache, chunks[i]);
		  }, i * 100);
		}
	  }
	  else {
		writeToCharacteristic(characteristicCache, data);
	  }

		log(data, 'out');
	}
	catch(err)
	{
		log('deu erro','out');
	}
}

// Escreve o valor na característica
function writeToCharacteristic(characteristic, data) {
  characteristic.writeValue(new TextEncoder().encode(data));
}