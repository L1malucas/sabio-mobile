Relatório de Análise do APK "sábio"
1. Introdução
O presente documento tem por finalidade apresentar a análise técnica do arquivo sabio.apk,
realizada por meio de técnicas de engenharia reversa. O estudo contemplou a extração de
metadados de compilação, permissões declaradas, bibliotecas embarcadas e inspeção do código
Smali, visando oferecer uma visão clara e estruturada da aplicação, de suas dependências e de seu
comportamento potencial no ambiente Android.
2. Informações Gerais do Aplicativo
Com base nos arquivos extraídos ( apktool.yml e código Smali), foram identificados os seguintes
parâmetros:
Identificador do Pacote (Application ID): com.br.sabio
Versão (VERSION_NAME): 4.0.25
Código da Versão (VERSION_CODE): 40025 (0x9c59 em hexadecimal)
SDK Mínimo Suportado: 21
SDK Alvo: 34
Tipo de Build: release
Modo Debug: Desativado ( false )
3. Permissões Declaradas
A análise do arquivo AndroidManifest.xml revelou as permissões abaixo, que estabelecem os
recursos e dados aos quais o aplicativo pode ter acesso:
Rede:
android.permission.INTERNET
android.permission.ACCESS_NETWORK_STATE
android.permission.BLUETOOTH
Armazenamento:
android.permission.READ_EXTERNAL_STORAGE
android.permission.WRITE_EXTERNAL_STORAGE
Localização:
android.permission.ACCESS_COARSE_LOCATION
android.permission.ACCESS_FINE_LOCATION
Hardware:
android.permission.CAMERA
android.permission.FLASHLIGHT
android.permission.RECORD_AUDIO
android.permission.MODIFY_AUDIO_SETTINGS
android.permission.VIBRATE
android.permission.USE_BIOMETRIC
android.permission.USE_FINGERPRINT
Sistema:
android.permission.WAKE_LOCK
4. Bibliotecas e Plugins Identificados
A inspeção da pasta sabio-assets/assets/public/plugins/ confirmou a utilização de diversos
componentes Cordova/PhoneGap, responsáveis por ampliar as funcionalidades da aplicação. Entre
eles, destacam-se:
cordova-plugin-android-permissions
cordova-plugin-app-version
cordova-plugin-background-mode
cordova-plugin-device
cordova-plugin-filechooser
cordova-plugin-ftp
cordova-plugin-geolocation
cordova-plugin-inappbrowser
cordova-plugin-network-information
cordova-plugin-x-toast
cordova-wheel-selector-plugin
phonegap-plugin-mobile-accessibility
uk.co.workingedge.cordova.plugin.sqliteporter
com.moust.cordova.videoplayer
5. Análise do Código Smali
A investigação do diretório smali/com/br/sabio/ permitiu observar os seguintes aspectos relevantes:
1. Framework Utilizado
A classe MainActivity.smali estende com.getcapacitor.BridgeActivity , evidenciando que o
aplicativo foi desenvolvido com o Capacitor, framework que possibilita a integração de
aplicações web a recursos nativos em múltiplas plataformas (Android, iOS e Web).
2. Configurações de Build
O arquivo BuildConfig.smali confirma os parâmetros de compilação, entre os quais:
APPLICATION_ID : com.br.sabio
BUILD_TYPE : release
DEBUG : false
VERSION_CODE : 40025
VERSION_NAME : 4.0.25
3. Estrutura de Recursos
Foram identificados múltiplos arquivos da série R$ ( R$anim.smali , R$layout.smali ,
R$string.smali , entre outros), os quais são gerados automaticamente pelo processo de build.
Esses arquivos atuam como mapeadores entre identificadores numéricos e recursos da
aplicação (layouts, strings, cores, dimensões etc.), não possuindo lógica de negócio própria.