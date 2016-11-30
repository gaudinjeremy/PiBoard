var myApp = new Framework7({
    //swipePanel: 'left'
});

var $$ = Dom7;
var PingLoop ;
var WidgetLoop ;

var mainView = myApp.addView('.view-main', {

    dynamicNavbar: true
});

var refreshMain = $$('.pull-to-refresh-content');

refreshMain.on('refresh', function (e) {

    setTimeout(function () {

        listePi();
        myApp.pullToRefreshDone();
    }, 1000);
});

function ping(id, ip, port) {

    if (port != '') {

        port = ':'+port ;
    }

    var ws = new WebSocket("ws://" + ip + port);

    ws.onerror = function(e){

        ws = null;
        $('.pingPi-'+id).html('ON');
        $('.pingPi-'+id).css('color', '#4cd964');
    };

    setTimeout(function() {

        if(ws != null) {

            ws.close();
            ws = null;
            $('.pingPi-'+id).html('OFF');
            $('.pingPi-'+id).css('color', '#ff3b30');
        }
    },
    2000);
};

function pingTest(ip, port, isUp, isDown) {

    if (port != '') {

        port = ':'+port ;
    }

    var ws = new WebSocket("ws://" + ip + port);

    ws.onerror = function(e){

        ws = null;
        isUp();
    };

    setTimeout(function() {

        if(ws != null) {

            ws.close();
            ws = null;
            isDown();
        }
    },
    2000);
};

function listePi() {

    $('.listePi').empty();

    total = 0 ;
    for (var i in localStorage) {

        iSplit = i.split('-');
        if (iSplit[0] === 'pi') {

            pi = JSON.parse(localStorage[i]);

            $('.listePi').append(
                '<li class="swipeout">' +
                '   <a href="#" class="item-link swipeout-content" onclick="showPi('+pi.id+')">'+
                '       <div class="item-content">'+
                '           <div class="item-media"><img src="'+pi.image+'" style="height:50px" /></div>'+
                '           <div class="item-inner">'+
                '               <div class="item-title label">'+pi.nom+'</div>'+
                '               <div class="item-after pingPi-'+pi.id+'"><i class="fa fa-spin fa-spinner"></i></div>'+
                '           </div>'+
                '       </div>'+
                '   </a>'+
                ''+
                '   <div class="swipeout-actions-right">'+
                '       <a href="#" class="bg-red" onclick="deletePi('+pi.id+')">Supprimer</a>'+
                '   </div>'+
                ''+
                '</li>'
           );

           ping(pi.id, pi.ip, pi.port);
           total++;
        }
    }

    if (total === 0) {

         $('.listePi').append(
             '<li>' +
             '  <a href="#">'+
             '      <div class="item-content">'+
             '          <div class="item-media"><img src="img/oupsss.png" style="height:50px" /></div>'+
             '          <div class="item-inner">'+
             '              <div class="item-title label">Oupss Aucun Pi...</div>'+
             '          </div>'+
             '      </div>'+
             '   </a>'+
             '</li>'
        );
    }
};
listePi();

function deletePi(id) {

    myApp.confirm('Êtes-vous sur ?', 'Suppression du Pi', function () {

        for (var i in localStorage) {

            iSplit = i.split('-');
            if (iSplit[0] === 'action') {

                piAction = JSON.parse(localStorage[i]);

                if (piAction.refPi == id) {

                    localStorage.removeItem(i);
                }
            }

            if (iSplit[0] === 'tools') {

                piTool = JSON.parse(localStorage[i]);

                if (piTool.refPi == id) {

                    localStorage.removeItem(i);
                }
            }
        }

        localStorage.removeItem('pi-'+id);
        listePi();
    });
};

$$('.clearAll').on('click', function () {

    myApp.confirm('Êtes-vous sur ?', 'Tout supprimer', function () {

        localStorage.clear();
        myApp.closePanel();
        listePi();
    });
});

function updatePi(id) {

    if (id != '') {

        query = 'update';

        pi = localStorage.getItem('pi-'+id);
        pi = JSON.parse(pi);

        valId = pi.id ;
        valType = pi.type ;
        valImage = pi.image ;
        valNom = pi.nom ;
        valDescription = pi.description ;
        valHost = pi.host ;
        valIp = pi.ip ;
        valPort = pi.port ;
        valUser = pi.user ;
        valPass = pi.pass ;
    }
    else {

        query = 'create';

        valId = '';
        valType = '';
        valImage = 'img/oupsss.png' ;
        valNom = '';
        valDescription = '';
        valHost = '';
        valIp = '';
        valPort = '';
        valUser = '';
        valPass = '';
    }

    var popupHTML = '<div class="popup layout-white">'+
                    '   <div class="content-block-title">Dispositif Pi</div>'+
                    ''+
                    '   <div class="list-block">'+
                    '       <ul>'+
                    ''+
                    '           <li>'+
                    '               <div class="item-content">'+
                    '                   <div class="item-media"><i class="fa fa-minus-square-o"></i></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title label">Id</div>'+
                    '                       <div class="item-input">'+
                    '                           <input type="text" id="IdPi" placeholder="Id du Pi" value="'+valId+'">'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </div>'+
                    '           </li>'+
                    ''+
                    '           <li>'+
                    '               <div class="item-content">'+
                    '                   <div class="item-media"><i class="fa fa-clone"></i></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title label">Type</div>'+
                    '                       <div class="item-input">'+
                    '                           <select id="TypePi">'+
                    '                               <option>'+valType+'</option>'+
                    '                               <option>Raspberry Pi 3 B</option>'+
                    '                               <option>Raspberry Pi 2 B</option>'+
                    '                               <option>Raspberry Pi 1 B+</option>'+
                    '                               <option>Raspberry Pi 1 A+</option>'+
                    '                               <option>Raspberry Pi Zero</option>'+
                    '                           </select>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </div>'+
                    '           </li>'+
                    ''+
                    '           <li>'+
                    '               <div class="item-content">'+
                    '                   <div class="item-media"><i class="fa fa-picture-o"></i></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title label">Image</div>'+
                    '                       <div class="item-input">'+
                    '                           <img id="imagePi" src="'+valImage+'" height="35px"/>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </div>'+
                    '           </li>'+
                    ''+
                    '           <li>'+
                    '               <div class="item-content">'+
                    '                   <div class="item-media"><i class="fa fa-address-card-o"></i></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title label">nom</div>'+
                    '                       <div class="item-input">'+
                    '                           <input type="text" id="NomPi" placeholder="Nom du Pi" value="'+valNom+'">'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </div>'+
                    '           </li>'+
                    ''+
                    '           <li class="align-top">'+
                    '               <div class="item-content">'+
                    '                   <div class="item-media"><i class="fa fa-newspaper-o"></i></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title label">Description</div>'+
                    '                       <div class="item-input">'+
                    '                           <textarea id="DescriptionPi" placeholder="Description">'+valDescription+'</textarea>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </div>'+
                    '           </li>'+
                    ''+
                    '           <li>'+
                    '               <div class="item-content">'+
                    '                   <div class="item-media"><i class="fa fa-feed"></i></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title label">Host</div>'+
                    '                       <div class="item-input">'+
                    '                           <select id="HostPi">'+
                    '                               <option>'+valHost+'</option>'+
                    '                               <option>http://</option>'+
                    '                               <option>https://</option>'+
                    '                           </select>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </div>'+
                    '           </li>'+
                    ''+
                    '           <li>'+
                    '               <div class="item-content">'+
                    '                   <div class="item-media"><i class="fa fa-code-fork"></i></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title label">IP</div>'+
                    '                       <div class="item-input">'+
                    '                           <input type="text" id="IpPi" placeholder="Ip du Pi" value="'+valIp+'">'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </div>'+
                    '           </li>'+
                    ''+
                    '           <li>'+
                    '               <div class="item-content">'+
                    '                   <div class="item-media"><i class="fa fa-level-up"></i></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title label">Port</div>'+
                    '                       <div class="item-input">'+
                    '                           <input type="text" id="PortPi" placeholder="Port du Pi" value="'+valPort+'">'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </div>'+
                    '           </li>'+
                    ''+
                    '           <li>'+
                    '               <div class="item-content">'+
                    '                   <div class="item-media"><i class="fa fa-user"></i></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title label">User</div>'+
                    '                       <div class="item-input">'+
                    '                           <input type="text" id="UserPi" placeholder="User" value="'+valUser+'">'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </div>'+
                    '           </li>'+
                    ''+
                    '           <li>'+
                    '               <div class="item-content">'+
                    '                   <div class="item-media"><i class="fa fa-lock"></i></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title label">Pass</div>'+
                    '                       <div class="item-input">'+
                    '                           <input type="password" id="PassPi" placeholder="Pass" value="'+valPass+'">'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </div>'+
                    '           </li>'+
                    ''+
                    '       </ul>'+
                    '   </div>'+
                    ''+
                    '   <div class="content-block-title">Choix de l\'image</div>'+
                    '   <div class="content-block">'+
                    '       <div class="row">'+
                    '           <div class="col-33" style="text-align: center;"><img id="img_pi3" class="imgPi" src="img/pi3.png" name="img/pi3.png" onclick="addImage(this.id, this.name)" width="80"></div>'+
                    '           <div class="col-33" style="text-align: center;"><img id="img_pi1a" class="imgPi" src="img/pi1a.png" name="img/pi1a.png" onclick="addImage(this.id, this.name)" width="80"></div>'+
                    '           <div class="col-33" style="text-align: center;"><img id="img_pizero" class="imgPi" src="img/pizero.png" name="img/pizero.png" onclick="addImage(this.id, this.name)" width="80"></div>'+
                    '       </div>'+
                    '       <div class="row">'+
                    '           <div class="col-33" style="text-align: center;"><img id="img_picamera" class="imgPi" src="img/picamera.png" name="img/picamera.png" onclick="addImage(this.id, this.name)" width="80"></div>'+
                    '           <div class="col-33" style="text-align: center;"><img id="img_picameranoir" class="imgPi" src="img/picameranoir.png" name="img/picameranoir.png" onclick="addImage(this.id, this.name)" width="80"></div>'+
                    '           <div class="col-33" style="text-align: center;"><img id="img_pidisplay" class="imgPi" src="img/pidisplay.png" name="img/pidisplay.png" onclick="addImage(this.id, this.name)" width="80"></div>'+
                    '       </div>'+
                    '       <div class="row">'+
                    '           <div class="col-33" style="text-align: center;"><img id="img_picase" class="imgPi" src="img/picase.png" name="img/picase.png" onclick="addImage(this.id, this.name)" width="80"></div>'+
                    '           <div class="col-33" style="text-align: center;"><img id="img_pisensehat" class="imgPi" src="img/pisensehat.png" name="img/pisensehat.png" onclick="addImage(this.id, this.name)" width="80"></div>'+
                    '           <div class="col-33" style="text-align: center;"><img id="img_gopigo" class="imgPi" src="img/gopigo.png" name="img/gopigo.png" onclick="addImage(this.id, this.name)" width="80"></div>'+
                    '       </div>'+
                    '   </div>'+
                    ''+
                    '   <div class="content-block">'+
                    '       <div class="row">'+
                    '           <div class="col-50">'+
                    '               <a href="#" class="button button-big close-popup">Annuler</a>'+
                    '           </div>'+
                    '           <div class="col-50">'+
                    '               <a href="#" class="button button-big active" name="'+query+'" onclick="createPi(this.name)">Valider</a>'+
                    '           </div>'+
                    '       </div> '+
                    '   </div>'+
                    ''+
                    '</div>'
        myApp.popup(popupHTML);
};

function addImage(id, src){

    $('.imgPi').css('border', '');
    $('#imagePi').attr('src', src);
    $('#'+id).css('border', '1px solid grey');
};

function existPi(id){

    total = 0 ;
    for (var i in localStorage) {

        iSplit = i.split('-');
        if (iSplit[0] === 'pi') {

            pi = JSON.parse(localStorage[i]);

            if (pi.id == id) {

                total++
            }
        }
    }

    if (total != 0) {

        return 'false';
    }
    else {

        return 'true';
    }
};

function createPi(query) {

    if ($('#IdPi').val() === '') {

        myApp.alert('Il faut un id unique à votre Pi', 'Information manquante');
    }
    else {

        if (isNaN($('#IdPi').val()) == true ) {

            myApp.alert('l\'id doit être un nombre entier', 'Oupsss');
        }
        else {

            if (query === 'create') {

                if (existPi($('#IdPi').val()) === 'false') {

                    myApp.alert('Cet id est déja attribué à un autre Pi', 'Oupsss');
                }
                else {

                    myApp.closePanel();
                    changePi();
                    listePi();
                    myApp.closeModal();
                }
            }
            else {

                myApp.showPreloader('Chargement');
                changePi();
                mainView.router.back();
                listePi();

                function loader(){

                    showPi($('#IdPi').val());
                }
                setTimeout(loader, 750);

                function loader2(){

                    myApp.hidePreloader();
                    myApp.closeModal();
                }
                setTimeout(loader2, 1000);
            }
        }
    }

    function changePi() {

        pi = {
            id : $('#IdPi').val(),
            type : $('#TypePi').val(),
            image : $('#imagePi').attr('src'),
            nom : $('#NomPi').val(),
            description : $('#DescriptionPi').val(),
            host : $('#HostPi').val(),
            ip : $('#IpPi').val(),
            port : $('#PortPi').val(),
            user : $('#UserPi').val(),
            pass : $('#PassPi').val()
        };

        jsonPi = JSON.stringify(pi);
        localStorage.setItem('pi-'+$('#IdPi').val(), jsonPi);
    }
};

function showPi(id) {

    pi = localStorage.getItem('pi-'+id);
    pi = JSON.parse(pi);

    mainView.router.loadContent(
        '<div class="navbar">' +
        '   <div class="navbar-inner">' +
        '       <div class="left"><a href="#" class="back link" onclick="stopInterval();"><i class="icon icon-back"></i><span>Retour</span></a></div>' +
        '       <div class="center sliding">'+pi.nom+'</div>' +
        '       <div class="right">'+
        '           <a href="#" class="link icon-only" onclick="updatePi('+pi.id+');"> <i class="fa fa-gears"></i></a>'+
        '       </div>'+
        '   </div>' +
        '</div>' +
        ''+
        '<div class="pages">' +
        '   <div data-page="dynamic-pages" class="page">' +
        '       <div class="page-content">' +
        '           <div class="content-block">' +
        '               <div class="content-block-inner">' +
        '                   <div class="row">'+
        '                       <div class="col-33"><img src="'+pi.image+'" width="80px"/></div>'+
        '                       <div class="col-66">'+pi.type+'<br /><span class="pingPi-'+pi.id+'"><i class="fa fa-spin fa-spinner"></i></span><br /><br />'+pi.description+'</div>'+
        '                   </div>'+
        '                   <div class="row widgetsActions"></div>'+
        '               </div>' +
        '           </div>'+
        ''+
        '           <div class="content-block row buttonsActions"></div>'+
        ''+
        '           <div class="content-block row streamActions"></div>'+
        ''+
        '           <div class="content-block-title">Actions</div>'+
        '           <div class="list-block">'+
        '               <ul class="listeActions"></ul>'+
        ''+
        '               <ul>'+
        '                   <li>'+
        '                       <a href="#" class="item-content" onclick="addAction('+pi.id+');">'+
        '                           <div class="item-media"><i class="fa fa-plus"></i></div>'+
        '                           <div class="item-inner">'+
        '                               <div class="item-title">Nouvelle action</div>'+
        '                           </div>'+
        '                       </a>'+
        '                   </li>'+
        '               </ul>'+
        '           </div>'+
        ''+
        '           <div class="content-block-title">Accessoires</div>'+
        '           <div class="list-block">'+
        '               <ul class="listeTools"></ul>'+
        ''+
        '               <ul>'+
        '                   <li>'+
        '                       <a href="#" class="item-content" onclick="updateTool('+pi.id+');">'+
        '                           <div class="item-media"><i class="fa fa-plus"></i></div>'+
        '                           <div class="item-inner">'+
        '                               <div class="item-title">Nouvel accessoire</div>'+
        '                           </div>'+
        '                       </a>'+
        '                   </li>'+
        '               </ul>'+
        '           </div>'+
        ''+
        '       </div>' +
        '   </div>' +
        '</div>'
    );

    ping(pi.id, pi.ip, pi.port);

    listeActions(pi.id);
    listeTools(pi.id);
    PingLoop = setInterval(function(){ ping(pi.id, pi.ip, pi.port) }, 5000);
    WidgetLoop = setInterval(function(){ refreshWidget(pi.id) }, 5000);
};

function stopInterval(){

    clearInterval(PingLoop);
    clearInterval(WidgetLoop);
};

function listeActions(id) {

    $('.listeActions').empty();
    $('.widgetsActions').empty();
    $('.buttonsActions').empty();
    $('.streamActions').empty();

    for (var i in localStorage) {

        iSplit = i.split('-');
        if (iSplit[0] === 'action') {

            piAction = JSON.parse(localStorage[i]);

            if (piAction.refPi == id) {

                $('.listeActions').append(
                    '<li class="swipeout">'+
                    '   <div class="swipeout-content item-content">'+
                    '       <div class="item-media"><i class="fa '+piAction.icone+'"></i></div>'+
                    '       <div class="item-inner">'+
                    '           <div class="item-title">'+piAction.nom+'</div>'+
                    '       </div>'+
                    '   </div>'+
                    ''+
                    '   <div class="swipeout-actions-left">'+
                    '       <a href="#" class="bg-red" onclick="deleteAction('+id+', '+piAction.id+')">Supprimer</a>'+
                    '   </div>'+
                    ''+
                    '   <div class="swipeout-actions-right">'+
                    '       <a href="#" class="bg-orange" onclick="updateAction('+id+', '+piAction.id+')">Modifier</a>'+
                    '   </div>'+
                    '</li>'
               );

               if (piAction.type === 'Widget') {

                   showWidget(piAction);
               }

               if (piAction.type === 'Bouton') {

                   showButton(piAction);
               }

               if (piAction.type === 'Stream') {

                   showStream(piAction);

               }
           }
        }
    }
};

function showWidget(piAction) {

    $('.widgetsActions').append(
        '<div id="'+piAction.id+'" class="col-'+piAction.affichage+'" style="text-align:center">'+
        '   <p> <span id="nom-'+piAction.id+'">'+piAction.nom+'</span>'+
        '       <br />'+
        '       <span id="icone-'+piAction.id+'"><i class="fa '+piAction.icone+'"></i></span> <i class="fa fa-spin fa-spinner"></i>'+
        '   </p>'+
        '</div>'
    );
    removeStyleWidget(piAction);

    pi = localStorage.getItem('pi-'+piAction.refPi);
    pi = JSON.parse(pi);

    pingTest(pi.ip, pi.port, isUp, isDown);

    function isUp(){

        if (pi.port != '') {

            port = ':'+pi.port;
        }
        else {

            port = '';
        }

        $.ajax ({
            type: piAction.query,
            url: pi.host+pi.ip+port+piAction.chemin,
            data: 'query1='+piAction.arg1+'&query2='+piAction.arg2,

            success : function(retour){

                $('#'+piAction.id).html(
                    '<p> <span id="nom-'+piAction.id+'">'+piAction.nom+'</span>'+
                    '   <br />'+
                    '   <span id="icone-'+piAction.id+'"><i class="fa '+piAction.icone+'"></i></span> '+retour+' '+piAction.texte+''+
                    '</p>'
                );
                removeStyleWidget(piAction);
            },
            error : function(){

                $('#'+piAction.id).html(
                    '<p> <span id="nom-'+piAction.id+'">'+piAction.nom+'</span>'+
                    '   <br />'+
                    '   <span id="icone-'+piAction.id+'"><i class="fa '+piAction.icone+'"></i></span> <span style="color:#ff9500">Time out</span>'+
                    '</p>'
                );
                removeStyleWidget(piAction);
            },
            timeout: 3000
        });
    }

    function isDown() {

        $('#'+piAction.id).html(
            '<p> <span id="nom-'+piAction.id+'">'+piAction.nom+'</span>'+
            '   <br />'+
            '   <span id="icone-'+piAction.id+'"><i class="fa '+piAction.icone+'"></i></span> <span style="color:#ff3b30">Off</span>'+
            '</p>'
        );
        removeStyleWidget(piAction);
    }
};

function removeStyleWidget(piAction) {

    if (piAction.afficheNom === 'Non') {

        $('#nom-'+piAction.id).remove();
    }
    if (piAction.afficheIcone === 'Non') {

        $('#icone-'+piAction.id).remove();
    }
};

function refreshWidget(id) {

    $('.widgetsActions').empty();

    for (var i in localStorage) {

        iSplit = i.split('-');
        if (iSplit[0] === 'action') {

            piAction = JSON.parse(localStorage[i]);

            if (piAction.refPi == id) {

                if (piAction.type === 'Widget') {

                    showWidget(piAction);
                }
            }
        }
    }
};

function showButton(piAction) {

    $('.buttonsActions').append(
        '<div class="col-'+piAction.affichage+'">'+
        '   <a href="#" onclick="clickButton('+piAction.id+')" id="'+piAction.id+'" class="button" style="color:#fff; background-color:'+piAction.couleur+'; border-color:'+piAction.couleur+'"><i class="fa '+piAction.icone+'"></i> '+piAction.nom+'</a>'+
        '</div>'
   );

    pi = localStorage.getItem('pi-'+piAction.refPi);
    pi = JSON.parse(pi);

    pingTest(pi.ip, pi.port, isUp, isDown);

    function isUp(){


    }

    function isDown(){

        $('#'+piAction.id).attr('disabled', 'disabled');
    }
};

function clickButton(id){

    myApp.showPreloader('Action en cours');

    piAction = localStorage.getItem('action-'+id);
    piAction = JSON.parse(piAction);

    pi = localStorage.getItem('pi-'+piAction.refPi);
    pi = JSON.parse(pi);

    if (pi.port != '') {

        port = ':'+pi.port;
    }
    else {

        port = '';
    }

    $.ajax ({
        type: piAction.query,
        url: pi.host+pi.ip+port+piAction.chemin,
        data: 'query1='+piAction.arg1+'&query2='+piAction.arg2,

        success : function(retour){

            myApp.hidePreloader();
            myApp.alert('Action effectuée ' +retour, 'Succès');
        },
        error : function(){

            myApp.hidePreloader();
            myApp.alert('Echec de l\'action', 'Oupsss');
        },
        timeout: 3000
    });
};

function showStream(piAction) {

    pingTest(piAction.ip, piAction.port, isUp, isDown);

    function isUp(){

        if (piAction.port != '') {

            port = ':'+piAction.port;
        }
        else {

            port = '';
        }

        url = piAction.host+piAction.ip+port;

        if (piAction.user != '') {

            if (piAction.pass != '') {

                url = piAction.host+piAction.user+':'+piAction.pass+'@'+piAction.ip+port;
            }
        }

        $('.streamActions').append(
            '<div id="'+piAction.id+'" class="col-'+piAction.affichage+'" style="text-align:center">'+
            '   <img src="'+url+'" style="width:100%" />'+
            '</div>'
        );
    }

    function isDown(){

        $('#'+piAction.id).html(
            '<p>Echec du Stream</p>'+
            '<i class="fa fa-eye-slash fa-3x" aria-hidden="true"></i>'
        );

    }
};

function addAction(refPi) {

    var buttons = [
        {
            text: 'Widget',
            onClick: function () {

                updateAction(refPi, '', 'Widget');
            }
        },
        {
            text: 'Bouton',
            onClick: function () {

                updateAction(refPi, '', 'Bouton');
            }
        },
        {
            text: 'Stream',
            onClick: function () {

                updateAction(refPi, '', 'Stream');
            }
        },
        {
            text: 'Annuler',
            color: 'red',
            onClick: function () {

            }
        },
    ];
    myApp.actions(buttons);
};

function updateAction(refPi, id, type) {

    var popupHTML = '   <div class="popup layout-white">'+
                    '       <div class="content-block-title">Action</div>'+
                    '       <div class="list-block">'+
                    '           <ul>'+
                    ''+
                    '               <li>'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-address-card-o"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                           <div class="item-title label">Nom</div>'+
                    '                           <div class="item-input">'+
                    '                               <input type="text" id="nomAction" placeholder="Nom de l\'action">'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '               <li class="showAfficheNomAction" style="display:none">'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-eye"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                           <div class="item-title label">Nom visible</div>'+
                    '                           <div class="item-input">'+
                    '                               <select id="afficheNomAction"></select>'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '               <li>'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-clone"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                           <div class="item-title label">Type</div>'+
                    '                           <div class="item-input">'+
                    '                               <select id="typeAction"></select>'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '               <li>'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-th"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                           <div class="item-title label">Affichage</div>'+
                    '                           <div class="item-input">'+
                    '                               <select id="affichageAction"></select>'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '               <li>'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-flag"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                           <div class="item-title label">Icone</div>'+
                    '                           <div class="item-input">'+
                    '                               <input type="text" id="iconeAction" placeholder="fa-spin">'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '               <li class="showAfficheIconeAction" style="display:none">'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-eye"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                           <div class="item-title label">Icone visible</div>'+
                    '                           <div class="item-input">'+
                    '                               <select id="afficheIconeAction"></select>'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '               <li class="showCouleurAction" style="display:none">'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-tint"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                           <div class="item-title label">Couleur</div>'+
                    '                           <div class="item-input">'+
                    '                               <input type="text" id="couleurAction" placeholder="#fff">'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '               <li class="showQueryAction" style="display:none">'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-question-circle-o"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                           <div class="item-title label">Requete</div>'+
                    '                           <div class="item-input">'+
                    '                               <select id="queryAction"></select>'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '               <li class="showCheminAction" style="display:none">'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-exchange"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                           <div class="item-title label">Chemin d\'accès</div>'+
                    '                           <div class="item-input">'+
                    '                               <input type="text" id="cheminAction" placeholder="/path/to/the/file">'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '               <li class="showArg1Action" style="display:none">'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-tag"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                           <div class="item-title label">Argument 1</div>'+
                    '                           <div class="item-input">'+
                    '                               <input type="text" id="arg1Action" placeholder="Argument n°1">'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '               <li class="showArg2Action" style="display:none">'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-tags"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                           <div class="item-title label">Argument 2</div>'+
                    '                           <div class="item-input">'+
                    '                               <input type="text" id="arg2Action" placeholder="Argument n°2">'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '               <li class="showTexteAction" style="display:none">'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-font"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                           <div class="item-title label">Texte</div>'+
                    '                           <div class="item-input">'+
                    '                               <input type="text" id="texteAction" placeholder="Texte accompagnant la réponse">'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '               <li class="showHostAction" style="display:none">'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-feed"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                           <div class="item-title label">Host</div>'+
                    '                           <div class="item-input">'+
                    '                               <select id="hostAction"></select>'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '               <li class="showIpAction" style="display:none">'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-code-fork"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                           <div class="item-title label">Ip</div>'+
                    '                           <div class="item-input">'+
                    '                               <input type="text" id="ipAction" placeholder="ip">'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '               <li class="showPortAction" style="display:none">'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-level-up"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                           <div class="item-title label">Port</div>'+
                    '                           <div class="item-input">'+
                    '                               <input type="text" id="portAction" placeholder="port">'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '               <li class="showUserAction" style="display:none">'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-user"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                           <div class="item-title label">User</div>'+
                    '                           <div class="item-input">'+
                    '                               <input type="text" id="userAction" placeholder="User">'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '               <li class="showPassAction" style="display:none">'+
                    '                   <div class="item-content">'+
                    '                       <div class="item-media"><i class="fa fa-lock"></i></div>'+
                    '                       <div class="item-inner">'+
                    '                            <div class="item-title label">Pass</div>'+
                    '                           <div class="item-input">'+
                    '                               <input type="password" id="passAction" placeholder="Password">'+
                    '                           </div>'+
                    '                       </div>'+
                    '                   </div>'+
                    '               </li>'+
                    ''+
                    '           </ul>'+
                    '       </div>'+
                    ''+
                    '       <img id="testSteam" src="" style="width:100%; display:none"/>'+
                    ''+
                    '       <div class="content-block">'+
                    '           <div class="row">'+
                    '               <div class="col-33">'+
                    '                   <a href="#" class="button button-big close-popup">Annuler</a>'+
                    '               </div>'+
                    '               <div class="col-33">'+
                    '                   <a href="#" class="button button-big" style="color:#fff; background-color:#ff9500; border-color:#ff9500;" onclick="testAction('+refPi+');">Tester</a>'+
                    '               </div>'+
                    '               <div class="col-33">'+
                    '                   <a href="#" class="button button-big active" onclick="createAction('+refPi+', '+id+');">Valider</a>'+
                    '               </div>'+
                    '           </div>'+
                    '       </div>'+
                    ''+
                    '   </div>'

    myApp.popup(popupHTML);

    if (id != '') {

        actionPi = localStorage.getItem('action-'+id);
        actionPi = JSON.parse(actionPi);

        type = actionPi.type;
    }

    $('#affichageAction').append('<option>25</option>');
    $('#affichageAction').append('<option>33</option>');
    $('#affichageAction').append('<option>50</option>');
    $('#affichageAction').append('<option>66</option>');
    $('#affichageAction').append('<option>100</option>');

    $('#typeAction').append('<option>'+type+'</option>');

    if (type === 'Stream') {

        $('#queryAction').append('<option>STREAM</option>');

        $('.showHostAction').show('slow');
        $('#hostAction').append('<option>http://</option>');
        $('#hostAction').append('<option>https://</option>');

        $('.showIpAction').show('slow');
        $('.showPortAction').show('slow');
        $('.showUserAction').show('slow');
        $('.showPassAction').show('slow');
    }
    else if (type === 'Widget') {

        $('.showQueryAction').show('slow')
        $('#queryAction').append('<option>POST</option>');
        $('#queryAction').append('<option>GET</option>');

        $('.showCheminAction').show('slow');
        $('.showArg1Action').show('slow');
        $('.showArg2Action').show('slow');
        $('.showAfficheNomAction').show('slow');
        $('#afficheNomAction').append('<option>Oui</option>');
        $('#afficheNomAction').append('<option>Non</option>');
        $('.showAfficheIconeAction').show('slow');
        $('#afficheIconeAction').append('<option>Oui</option>');
        $('#afficheIconeAction').append('<option>Non</option>');
        $('.showTexteAction').show('slow');
    }
    else {

        $('.showCouleurAction').show('slow');

        $('.showQueryAction').show('slow')
        $('#queryAction').append('<option>POST</option>');
        $('#queryAction').append('<option>GET</option>');

        $('.showCheminAction').show('slow');
        $('.showArg1Action').show('slow');
        $('.showArg2Action').show('slow');
        $('.showTexteAction').show('slow');
    }

    if (id != '') {

        $('#nomAction').val(actionPi.nom) ;
        $('#typeAction').val(actionPi.type) ;
        $('#affichageAction').val(actionPi.affichage) ;
        $('#iconeAction').val(actionPi.icone) ;
        $('#couleurAction').val(actionPi.couleur) ;
        $('#queryAction').val(actionPi.query) ;
        $('#cheminAction').val(actionPi.chemin) ;
        $('#arg1Action').val(actionPi.arg1) ;
        $('#arg2Action').val(actionPi.arg2) ;
        $('#afficheNomAction').val(actionPi.afficheNom) ;
        $('#afficheIconeAction').val(actionPi.afficheIcone) ;
        $('#texteAction').val(actionPi.texte) ;
        $('#hostAction').val(actionPi.host) ;
        $('#ipAction').val(actionPi.ip) ;
        $('#portAction').val(actionPi.port) ;
        $('#userAction').val(actionPi.user) ;
        $('#passAction').val(actionPi.pass) ;
    }

};

function testAction(refPi) {

    myApp.showPreloader('Vérification');

    query = $('#queryAction').val() ;
    chemin = $('#cheminAction').val() ;
    arg1 = $('#arg1Action').val() ;
    arg2 = $('#arg2Action').val() ;
    texte = $('#texteAction').val() ;
    host = $('#hostAction').val() ;
    ip = $('#ipAction').val() ;
    port = $('#portAction').val() ;
    user = $('#userAction').val() ;
    pass = $('#passAction').val() ;

    if (query === 'STREAM') {

        pingTest(ip, port, isUp, isDown);

        function isUp(){

            if (port != '') {

                port = ':'+port;
            }
            else {

                port = '';
            }

            url = host+ip+port;

            if (user != '') {

                if (pass != '') {

                    url = host+user+':'+pass+'@'+ip+port;
                }
            }

    	    img = new Image();
    	    img.src = url;

        	img.onload = function() {

                myApp.hidePreloader();
                myApp.alert('Le stream est opérationnel', 'Succès');
                $('#testSteam').attr('src', url);
                $('#testSteam').show();
        	}

        	img.onerror = function() {

                myApp.hidePreloader();
                myApp.alert('Echec du stream', 'Oupsss');
        	}
        }

        function isDown(){

            myApp.hidePreloader();
            myApp.alert('Le serveur est inaccessible', 'Oupsss');
        }
    }
    else {

        pi = localStorage.getItem('pi-'+refPi);
        pi = JSON.parse(pi);

        pingTest(pi.ip, pi.port, isUp, isDown);

        function isUp(){

            if (pi.port != '') {

                port = ':'+pi.port;
            }
            else {

                port = '';
            }

            $.ajax ({
                type: query,
                url: pi.host+pi.ip+port+chemin,
                data: 'query1='+arg1+'&query2='+arg2,

                success : function(retour){

                    myApp.hidePreloader();
                    myApp.alert(retour+' '+texte, 'Succès');
                },
                error : function(){

                    myApp.hidePreloader();
                    myApp.alert('Echec de l\'action', 'Oupsss');
                }
            });
        }

        function isDown(){

            myApp.hidePreloader();
            myApp.alert('Le serveur est inaccessible', 'Oupsss');
        }

    }
};

function createAction(refPi, id) {

    if (id === undefined) {

        timeStamp = Math.floor(Date.now() / 1000);
    }
    else {

        timeStamp = id ;
    }

    piAction = {
        id : timeStamp,
        nom : $('#nomAction').val(),
        type : $('#typeAction').val(),
        query : $('#queryAction').val(),
        chemin : $('#cheminAction').val(),
        arg1 : $('#arg1Action').val(),
        arg2 : $('#arg2Action').val(),
        icone : $('#iconeAction').val(),
        couleur : $('#couleurAction').val(),
        afficheNom : $('#afficheNomAction').val(),
        afficheIcone : $('#afficheIconeAction').val(),
        texte : $('#texteAction').val(),
        host : $('#hostAction').val(),
        ip : $('#ipAction').val(),
        port : $('#portAction').val(),
        user : $('#userAction').val(),
        pass : $('#passAction').val(),
        affichage : $('#affichageAction').val(),
        refPi : refPi
    };

    jsonPiAction = JSON.stringify(piAction);
    localStorage.setItem('action-'+timeStamp, jsonPiAction);

    listeActions(refPi);
    myApp.closeModal();
};

function deleteAction(refPi, id) {

    localStorage.removeItem('action-'+id);
    listeActions(refPi);
};

function listeTools(id) {

    $('.listeTools').empty();

    for (var i in localStorage) {

        iSplit = i.split('-');
        if (iSplit[0] === 'tools') {

            piTool = JSON.parse(localStorage[i]);

            if (piTool.refPi == id) {

                $('.listeTools').append(
                    '<li class="swipeout">'+
                    '   <div class="swipeout-content item-content">'+
                    '       <div class="item-media"><img src="'+piTool.image+'" height="30px" /></div>'+
                    '       <div class="item-inner">'+
                    '       <div class="item-title">'+piTool.type+'</div>'+
                    '   </div>'+
                    ''+
                    '   <div class="swipeout-actions-right">'+
                    '       <a href="#" class="bg-red" onclick="deleteTool('+piTool.id+', '+id+')">Supprimer</a>'+
                    '   </div>'+
                    '</li>'
               );
           }
        }
    }
};

function updateTool(id) {

    var popupHTML = '<div class="popup layout-white">'+
                    '   <div class="content-block-title">Accessoires possibles</div>'+
                    ''+
                    '   <div class="list-block media-list">'+
                    '       <ul>'+
                    ''+
                    '           <li>'+
                    '               <a href="#" class="item-link item-content" name="Pi Case" rel="img/picase.png" onclick="createTool('+id+', this.name, this.rel)">'+
                    '                   <div class="item-media"><img src="img/picase.png" width="80"></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title-row">'+
                    '                           <div class="item-title">Pi Case</div>'+
                    '                       </div>'+
                    '                       <div class="item-subtitle"></div>'+
                    '                       <div class="item-text"></div>'+
                    '                   </div>'+
                    '               </a>'+
                    '           </li>'+
                    ''+
                    '           <li>'+
                    '               <a href="#" class="item-link item-content" name="Pi Camera" rel="img/picamera.png" onclick="createTool('+id+', this.name, this.rel)">'+
                    '                   <div class="item-media"><img src="img/picamera.png" width="80"></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title-row">'+
                    '                           <div class="item-title">Pi Camera</div>'+
                    '                       </div>'+
                    '                       <div class="item-subtitle"></div>'+
                    '                       <div class="item-text"></div>'+
                    '                   </div>'+
                    '               </a>'+
                    '           </li>'+
                    ''+
                    '           <li>'+
                    '               <a href="#" class="item-link item-content" name="Pi Noir Camera" rel="img/picameranoir.png" onclick="createTool('+id+', this.name, this.rel)">'+
                    '                   <div class="item-media"><img src="img/picameranoir.png" width="80"></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title-row">'+
                    '                           <div class="item-title">Pi Noir Camera</div>'+
                    '                       </div>'+
                    '                       <div class="item-subtitle"></div>'+
                    '                       <div class="item-text"></div>'+
                    '                   </div>'+
                    '               </a>'+
                    '           </li>'+
                    ''+
                    '           <li>'+
                    '               <a href="#" class="item-link item-content" name="Pi Sense Hat" rel="img/pisensehat.png" onclick="createTool('+id+', this.name, this.rel)">'+
                    '                   <div class="item-media"><img src="img/pisensehat.png" width="80"></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title-row">'+
                    '                           <div class="item-title">Sense Hat</div>'+
                    '                       </div>'+
                    '                       <div class="item-subtitle"></div>'+
                    '                       <div class="item-text"></div>'+
                    '                   </div>'+
                    '               </a>'+
                    '           </li>'+
                    ''+
                    '           <li>'+
                    '               <a href="#" class="item-link item-content" name="Pi Touch Display" rel="img/pidisplay.png" onclick="createTool('+id+', this.name, this.rel)">'+
                    '                   <div class="item-media"><img src="img/pidisplay.png" width="80"></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title-row">'+
                    '                           <div class="item-title">Pi Touch Display</div>'+
                    '                       </div>'+
                    '                       <div class="item-subtitle"></div>'+
                    '                       <div class="item-text"></div>'+
                    '                   </div>'+
                    '               </a>'+
                    '           </li>'+
                    ''+
                    '           <li>'+
                    '               <a href="#" class="item-link item-content" name="Pi USB Wifi Dongle" rel="img/piwifi.png" onclick="createTool('+id+', this.name, this.rel)">'+
                    '                   <div class="item-media"><img src="img/piwifi.png" width="80"></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title-row">'+
                    '                           <div class="item-title">Pi USB Wifi Dongle</div>'+
                    '                       </div>'+
                    '                       <div class="item-subtitle"></div>'+
                    '                       <div class="item-text"></div>'+
                    '                   </div>'+
                    '               </a>'+
                    '           </li>'+
                    ''+
                    '           <li>'+
                    '               <a href="#" class="item-link item-content" name="Ultrasonic Ranger" rel="img/ultrasonic.png" onclick="createTool('+id+', this.name, this.rel)">'+
                    '                   <div class="item-media"><img src="img/ultrasonic.png" width="80"></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title-row">'+
                    '                           <div class="item-title">Ultrasonic Ranger</div>'+
                    '                       </div>'+
                    '                       <div class="item-subtitle"></div>'+
                    '                       <div class="item-text"></div>'+
                    '                   </div>'+
                    '               </a>'+
                    '           </li>'+
                    ''+
                    '           <li>'+
                    '               <a href="#" class="item-link item-content" name="Servo" rel="img/servo.png" onclick="createTool('+id+', this.name, this.rel)">'+
                    '                   <div class="item-media"><img src="img/servo.png" width="80"></div>'+
                    '                   <div class="item-inner">'+
                    '                       <div class="item-title-row">'+
                    '                           <div class="item-title">Servo</div>'+
                    '                       </div>'+
                    '                       <div class="item-subtitle"></div>'+
                    '                       <div class="item-text"></div>'+
                    '                   </div>'+
                    '               </a>'+
                    '           </li>'+
                    ''+
                    '       </ul'+
                    '   </div>'+
                    ''+
                    '   <div class="content-block">'+
                    '       <a href="#" class="button button-big active close-popup">Annuler</a>'+
                    '   </div>'+
                    ''+
                    '</div>'
    myApp.popup(popupHTML);
};

function createTool(id, name, image) {

    timeStamp = Math.floor(Date.now() / 1000);

    piTool = {
        id : timeStamp,
        type : name,
        image : image,
        refPi : id
    };

    jsonPiTool = JSON.stringify(piTool);
    localStorage.setItem('tools-'+timeStamp, jsonPiTool);

    listeTools(id)
    myApp.closeModal();
};

function deleteTool(id, refPi) {

    localStorage.removeItem('tools-'+id);
    listeTools(refPi)
};
