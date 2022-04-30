importScripts('js/sw-toolbox.js');

toolbox.precache([
  'css/normalize.css',
  'css/styles.css',
  'js/BluetoothConnection.js',
  'js/companion.js',
  'js/main.js',
  
  'css/adicionarpet.css',
  'css/atividades.css',
  'css/batimentos.css',
  'css/batimentos02.html'
  'css/bluetooth.css',
  'css/cadastro.css',
  'css/editar.css',
  'css/home.css',
  'css/index.css',
  'css/inicio.css',
  'css/login.css',
  'css/perfildopet.css',
  'css/perfildopet02.css',
  'css/termos.css',
  'css/tutorial1.css',
  'css/tutorial2.css',
  'css/tutorial4.css',
  'css/tutorial5.css',
  'css/tutorialfinal.css',


  'adicionarpet.html',
  'atividades.html',
  'batimentos.html.',
  'batimentos02.html',
  'bluetooth.html.',
  'cadastro.html.',
  'editar.html.',
  'editar02.html'
  'home.html.',
  'index.html.',
  'inicio.html.',
  'login.html',
  'perfildopet.html',
  'perfildopet02.html',
  'termos.html',
  'tutorial1.html',
  'tutorial2.html',
  'tutorial4.html',
  'tutorial5.html',
  'tutorialfinal.html',


]);

toolbox.router.default = toolbox.networkFirst;
toolbox.options.networkTimeoutSeconds = 5;

toolbox.router.get('icons/*', toolbox.fastest);
