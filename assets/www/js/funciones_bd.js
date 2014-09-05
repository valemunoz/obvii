var NOMBRE_USER,ID_USER,ID_OBVII_USER,ESTADO_USER,ID_TIPO_USUARIO;
var MAIL_USER="";
var ID_LUGAR=Array();
var NOM_LUGAR=Array();
var FECHA_LUGAR=Array();
var FAV_LUGAR=Array();
var DIR_LUGAR=Array();
var TIP_LUGAR=Array();
var MARCACION_LUGAR=Array();
var ID_MARCA=Array();
var NOM_MARCA=Array();  
var FECHA_MARCA=Array();
var LAT_MARCA=Array();
var LON_MARCA=Array();
var DSCRIP_MARCA=Array();
var TIP_MARCA=Array();
				
var dat=new Date();
var dia=dat.getDay();
var ano=dat.getFullYear();
var mes=dat.getMonth();

var SELECT_USER=false;

var db = openDatabase('MyDB', '1.0', 'My Sample DB', 10000 * 1024);
var tx_db;
var DEVICE_ONLINE=false;

function onready()
{
	
	if(navigator.network.connection.type == Connection.NONE)
 	{
 		onOffline();
 	}else
 	{
 		onOnline();
	}
  loadBD();        		
  if(!DEVICE_ONLINE)
  {
  	selectUserBDlocal();        			        			
    setTimeout("loadInicioOff();",1000);
        			
  }else
  {
  	$("#output").load(path_query2, 
			{tipo:1} 
			,function(){
			
				loadMenu();	
				loadLugaresON();	
			}
		);
  }
  navigator.splashscreen.hide();
}
function loadInicioOff()
{
	if(SELECT_USER)
	{
		
		$("#ll_mapa").hide();
		$("#ll_off").hide(); 		                      
		                      
		loadMenuOff();
		selectLugarBDlocal();
		
		setTimeout("loadFavOff();",1000);
		mensaje("No tiene conecci&oacute;n a internet activada.<br>El sistema trabajara de manera Local/Offline<br>Algunas opciones seran limitadas",'Alerta','myPopup');
	}else
	{
		cambiar("mod_sesion");
		mensaje("No tiene conexion a internet y no tiene una sesion activa.<br>Por favor conectese a una red para continuar",'ERROR','myPopup_ses');
	}
}
function loadFavOff()
{
		$.mobile.loading( 'show', {
			text: 'Cargando Favoritos...',
			textVisible: true,
			theme: 'a',
			html: ""
		});

		$("#contenido_sesion").load("favoritos.html", 
			{} 
				,function(){	
					$.mobile.loading( 'hide');
					$('#contenido_sesion').trigger('create');
				}
		);
}
function loadMenuOff()
{
	$(".ui-page-active .maintenance_tabs").empty();
	var bar='<div data-role="navbar" id=list_nav class="maintenance_tabs">';
	bar +='<ul id="myNavbar">';
	bar +='<li ><a  href="javascript:checkInternet();loadFavOff();"><img src="images/fav2.png"></a></li>';
	bar +='<li ><a  href="javascript:checkInternet();loadHomeOff();"><img src="images/icon-servicios.png"></a></li>';							
	bar +='<li><a href="javascript:checkInternet();loadHistorialOff();"><img src="images/historial.png"></a></li>';
	bar +='<li><a href="javascript:checkInternet();loadInfoOff();"><img src="images/icon-info.png"></a></li>';
	bar +='</ul>';
	bar +='</div>';				
  $(".ui-page-active .maintenance_tabs").append(bar).trigger('create');
  
  $("#bienvenido_div").html("Bienvenido (offline): "+MAIL_USER);		
  if(MAIL_USER=="")        	
  {
  	setTimeout("loadMenuOff();",1000);
  }
}
function loadBD()
{
	
 db.transaction(function(tx) 
 {
 	tx_db=tx;
 	 // tx.executeSql('DROP TABLE IF EXISTS marca');
    tx.executeSql('create table if not exists usuario(id, name, mail, estado, id_obvii)');    
    tx.executeSql('create table if not exists lugar(id, name, direccion, fecha, fav,tipo,marcacion)');    
    tx.executeSql('create table if not exists marca(id, name,lati,loni,fecha,descripc,tipo)');  
	}, errorCB, successCB);    

}
function addUsuarioBDLocal(id_us,nom_us,mail_us,est_us,id_obvii_us,tipo_us)
{
	//alert("paso add usuario");
	 db.transaction(function(tx) {
 			tx.executeSql('DROP TABLE IF EXISTS usuario');
 			tx.executeSql('create table if not exists usuario(id, name, mail, estado, id_obvii)');
			tx.executeSql('insert into usuario(id, name, mail, estado,id_obvii) values (?,?,?,?,?)',[id_us,nom_us,mail_us, est_us,id_obvii_us]);
	}, errorCB, successCB);
	
}
function selectUserBDlocal()
{
	db.transaction(function(tx) {  
 		tx.executeSql('SELECT * FROM usuario', [], selectUsuario, errorCB);
 		
    
	}, errorCB, successCB); 

}
function selectUsuario(tx, results)
{
	//alert(results.rows.length);
	SELECT_USER=true;
	if (results.rows.length < 1) 
  {
  	//alert("no hay resultados");
  	SELECT_USER=false;
  }  
 	for (var i = 0; i < results.rows.length; i++) 
 	{
 				NOMBRE_USER = results.rows.item(i).name; 				
 	    	MAIL_USER = results.rows.item(i).mail;
 	    	ID_USER = results.rows.item(i).id;
 	    	ID_OBVII_USER = results.rows.item(i).id_obvii;
 	    	ESTADO_USER = results.rows.item(i).estado;
	}
  	
}
function successCB(e)
{
	//alert("exitoso bd");
}
function errorCB(e)
{
	alert("error bd "+e.code);
}
function onOffline() 
{
	DEVICE_ONLINE=false;
}
function onOnline() 
{
	DEVICE_ONLINE=true;
 
}

function addLugarBDLocal(id_us,nom_us,dir_us,fav_us,fecha_us,tipo_lugar,marca_lugar)
{
		 
		 db.transaction(function(tx) {	 	
    
    	tx.executeSql('create table if not exists lugar(id, name, direccion, fecha, fav, tipo,marcacion)');     				
				tx.executeSql('insert into lugar(id, name, direccion, fecha, fav,tipo,marcacion) values (?,?,?,?,?,?,?)',[id_us,nom_us,dir_us,fecha_us,fav_us,tipo_lugar,marca_lugar]);
				
			}, errorCB, successCB);
					    
							
	
}
function selectLugarBDlocal()
{
	
	db.transaction(function(tx) {  
 		tx.executeSql('SELECT * FROM lugar', [], selectLugar, errorCB);
 		
    
	}, errorCB, successCB); 
	
}
function selectLugar(tx, rs)
{		
 				
    		for (var i = 0; i < rs.rows.length; i++) 
    		{
    			b=i;
    			ID_LUGAR[b]=rs.rows.item(i).id;
					NOM_LUGAR[b]=rs.rows.item(i).name;
					//alert("id:"+ID_LUGAR[b]);
					FECHA_LUGAR[b]=rs.rows.item(i).fecha;
					FAV_LUGAR[b]=rs.rows.item(i).fav;
					DIR_LUGAR[b]=rs.rows.item(i).direccion;
					TIP_LUGAR[b]=rs.rows.item(i).tipo;
					MARCACION_LUGAR[b]=rs.rows.item(i).marcacion;
    		}
    		
  	
}
function cleanLugarBD()
{
	//alert("limpia");
	db.transaction(function(tx) {  
 		tx.executeSql('DROP TABLE IF EXISTS lugar');
		tx.executeSql('create table if not exists lugar(id, name, direccion, fecha, fav, tipo,marcacion)');
	
	}, errorCB, successCB); 
	ID_LUGAR=Array();
	NOM_LUGAR=Array();
	FECHA_LUGAR=Array();
	FAV_LUGAR=Array();
	DIR_LUGAR=Array();
	TIP_LUGAR=Array();
	MARCACION_LUGAR=Array();
	
}

function loadLugaresON()
{
	cleanLugarBD();
  $("#output").load(path_query2, 
	{tipo:6} 
	,function(){
						}
	);
}
function loadHomeOff()
{
	$.mobile.loading( 'show', {
			text: 'Cargando Lugares...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
	$("#contenido_sesion").load("lugares.html", 
			{} 
				,function(){	
					$.mobile.loading( 'hide');
					$('#contenido_sesion').trigger('create');
				}
		);
}

function loadInfoOff()
{
	$.mobile.loading( 'show', {
			text: '...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
	$("#contenido_sesion").load("informacion.html", 
			{} 
				,function(){	
					$.mobile.loading( 'hide');
					$('#contenido_sesion').trigger('create');
				}
		);
}
function addMarcaBDLocal(id_marca_glob,nom_marca_glob,tipo,marcacion)
{

		if($.trim(marcacion)=="t" || $.trim(tipo)=='t')
		{
			nom_marca_glob=encodeURIComponent(nom_marca_glob);
		
			if($.trim(marcacion)=="t")
			{
				
				descrip_marca="-";
				if($.trim(tipo)=='t')
				{
					mensaje("<div id='coment_form' name='coment_form'><input type='button' class=bottom_coment value='Entrada' onclick=loadComentarioOff('"+id_marca_glob+"','"+nom_marca_glob+"');><br><input type='button' onclick=addMarcaOff('"+id_marca_glob+"','"+nom_marca_glob+"','"+descrip_marca+"',1); class=bottom_coment value='Salida'></div>",'Seleccione una opci&oacute;n','myPopup');
				}else
				{
						mensaje("<div id='coment_form' name='coment_form'><input type='button' class=bottom_coment value='Entrada' onclick=addMarcaOff('"+id_marca_glob+"','"+nom_marca_glob+"','"+descrip_marca+"',0);><br><input type='button' onclick=addMarcaOff('"+id_marca_glob+"','"+nom_marca_glob+"','"+descrip_marca+"',1); class=bottom_coment value='Salida'></div>",'Seleccione una opci&oacute;n','myPopup');
				}
			}else
			{
				if($.trim(tipo)=='t')
				{
		 	
		  		loadComentarioOff(id_marca_glob,nom_marca_glob);
				}
			}
			
		}else
			{
				descrip_marca="";
				marcacion="0"; //entrada
				addMarcaOff(id_marca_glob,nom_marca_glob,descrip_marca,marcacion);
    	}
}
function loadComentarioOff(id_marca_glob,nom_marca_glob)
{
	mensaje("<div id='coment_form' name='coment_form'><input type='text' id=comentario_lug name=comentario_lug class=input_coment><br><input type='button' class=bottom_coment value='Guardar' onclick=addMarcaOff('"+id_marca_glob+"','"+nom_marca_glob+"','',10); ></div>",'Ingrese un comentario','myPopup');
}
function addMarcaOff(id_marca_glob,nom_marca_glob,descrip_marca,marcacion)
{
	if(marcacion==10)
	{
	   
	   descrip_marca=$.trim(document.getElementById("comentario_lug").value);
	   
	 }
		nom_marca_glob=decodeURIComponent(nom_marca_glob);
		$.mobile.loading( 'show', {
					text: 'Obteniendo Ubicacion...',
					textVisible: true,
					theme: 'a',
					html: ""
		});
				navigator.geolocation.getCurrentPosition (function (pos)
				{
					var lat = pos.coords.latitude;
  				var lng = pos.coords.longitude;
  				var accu=pos.coords.accuracy.toFixed(2);
  				
  				OBVII_LON=lng;
  				OBVII_LAT=lat;
  				OBVII_ACCU=accu;
  	  		
					$.mobile.loading( 'hide');
					$.mobile.loading( 'show', {
						text: 'Marcando...',
						textVisible: true,
						theme: 'a',
						html: ""
					});
					
					var fecha;
					var d = new Date();
					var fmes=d.getMonth();
					if(fmes < 10)
					  fmes="0"+fmes;
					
					var fdia=d.getDay();
					if(fdia < 10)
					  fdia="0"+fdia;
					  
					var fhora=d.getHours();
					if(fhora < 10)
					  fhora="0"+fhora;

					var fmin=d.getMinutes();
					if(fmin < 10)
					  fmin="0"+fmin;  
					
					var fsec=d.getSeconds();
					if(fsec < 10)
					  fsec="0"+fsec;  

					fecha=""+d.getFullYear()+"-"+fmes+"-"+fdia+" "+fhora+":"+fmin+":"+fsec+"";
					//alert(fecha);
					db.transaction(function(tx) {	 	    
    				tx.executeSql('INSERT INTO marca (id, name,lati,loni,fecha,descripc,tipo) VALUES ("'+id_marca_glob+'","'+nom_marca_glob+'","'+OBVII_LAT+'","'+OBVII_LON+'","'+fecha+'","'+descrip_marca+'","'+marcacion+'")');
      		
					}, errorCB, successCB);
					$.mobile.loading( 'hide');
		  		mensaje("Marcacion realizada localmente",'Mensaje','myPopup');
				},noLocation,{timeout:6000});
	
}

function selectMarcaBDlocal()
{
	//alert("paso");
	db.transaction(function(tx) {  
 		tx.executeSql('SELECT * FROM marca', [], selectMarca, errorCB);
 		
    
	}, errorCB, successCB); 
	
}
function selectMarca(tx, rs)
{		
 				
 	for (var i = 0; i < rs.rows.length; i++) 
 	{
 	
 		ID_MARCA[i]=rs.rows.item(i).id;
			NOM_MARCA[i]=rs.rows.item(i).name;				
			FECHA_MARCA[i]=rs.rows.item(i).fecha;
			LAT_MARCA[i]=rs.rows.item(i).lati;
			LON_MARCA[i]=rs.rows.item(i).loni;
			LON_MARCA[i]=rs.rows.item(i).loni;
			DSCRIP_MARCA[i]=rs.rows.item(i).descripc;
			TIP_MARCA[i]=rs.rows.item(i).tipo;
 			//alert(rs.rows.item(i).descripc+" :: "+ID_MARCA[i]);    
 	}
    		
  	
}
function cleanMarcaBD()
{
	
	db.transaction(function(tx) {  
 		tx.executeSql('DROP TABLE IF EXISTS marca');
		tx.executeSql('create table if not exists marca(id, name,lati,loni,fecha,descripc,tipo)'); 
	
	}, errorCB, successCB); 

	ID_MARCA=Array();
	NOM_MARCA=Array();  
	FECHA_MARCA=Array();
	LAT_MARCA=Array();
	LON_MARCA=Array();
	DSCRIP_MARCA=Array();
	TIP_MARCA=Array();
}

function loadHistorialOff()
{
	$.mobile.loading( 'show', {
			text: '...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
	selectMarcaBDlocal();
	setTimeout("loadHistorialRegOff();",2000);
	
}
function loadHistorialRegOff()
{
	
	$("#contenido_sesion").load("historial.html", 
			{} 
				,function(){	
					$.mobile.loading( 'hide');
					$('#contenido_sesion').trigger('create');
				}
		);
}

function loadEditarOff(id_edit)
{
	

	$("#contenido_sesion").load("view.html", 
			{} 
				,function(){	
					for(i=0;i< ID_LUGAR.length;i++)
					{
						if(ID_LUGAR[i]==id_edit)
						{
							$("#nom_l").html(NOM_LUGAR[i]);
							$("#dir_l").html(DIR_LUGAR[i]);
							if(TIP_LUGAR[i]=='t')
								$("#com_l").html("SI");
							else
								$("#com_l").html("NO");	
							  
							if(MARCACION_LUGAR[i]=='t')
								$("#ent_l").html("SI");
							else	
								$("#ent_l").html("NO");
						}
		
					}
					$.mobile.loading( 'hide');
					$('#contenido_sesion').trigger('create');
				}
		);
}
function checkInternet()
{
	if(navigator.network.connection.type == Connection.NONE)
 	{
 		
 		//onOffline();
 		if(DEVICE_ONLINE)
 		{
 			window.location.href="index.html";
 		}
 	}else
 	{
 		//onOnline();
 		if(!DEVICE_ONLINE)
 		{
 			window.location.href="index.html";
 		}
 		
	}
	
}
function syncMarca()
{
	checkInternet();
	selectMarcaBDlocal();
	setTimeout("processSyc();",2000);
	
}
function processSyc()
{
	var ids_marca="";
	var lats_marca="";
	var lons_marca="";        	
	for (var i = 0; i < ID_MARCA.length; i++)
	{
		ids_marca +="|"+ID_MARCA[i];
		lats_marca+="|"+LAT_MARCA[i];
		lons_marca+="|"+LON_MARCA[i];
	}
	
	$.mobile.loading( 'show', {
			text: 'Sincronizando...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
	$("#output").load(path_query2, 
			{tipo:7,ide:ids_marca,lat:lats_marca,lon:lons_marca} 
				,function(){	
					$.mobile.loading( 'hide');
					//$('#contenido_sesion').trigger('create');
				}
		);
}

function checkConnection() {                              
    var networkState = navigator.connection.type;         
                                                          
    var states = {};                                      
    states[Connection.UNKNOWN]  = 'Unknown connection';   
    states[Connection.ETHERNET] = 'Ethernet connection';  
    states[Connection.WIFI]     = 'WiFi connection';      
    states[Connection.CELL_2G]  = 'Cell 2G connection';   
    states[Connection.CELL_3G]  = 'Cell 3G connection';   
    states[Connection.CELL_4G]  = 'Cell 4G connection';   
    states[Connection.NONE]     = 'No network connection';
                                                          
    alert('Connection type: ' + states[networkState]);    
}                                                         
                                                          
