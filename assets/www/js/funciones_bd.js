var NOMBRE_USER,ID_USER,ID_OBVII_USER,ESTADO_USER,ID_TIPO_USUARIO,ID_ESTADO_ACTIVO, CLAVE_USUARIO,NUBE_USUARIO,LOCAL_USUARIO;
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
var NUBE_MARCA=Array();
var LOCAL_MARCA=Array();
var FECHA_MARCA=Array();
var LAT_MARCA=Array();
var LON_MARCA=Array();
var TOT_MARCAS=0;
var DSCRIP_MARCA=Array();
var DIR_MARCA=Array();
var TIP_MARCA=Array();
var sync_marca=false;				
var dat=new Date();
var dia=dat.getDate();
var ano=dat.getFullYear();
var mes=dat.getMonth();
mes=mes+1;
var SELECT_USER=false;
var db = openDatabase('MyDB', '1.0', 'My Sample DB', 10000 * 1024);
var tx_db;
var uuid_user=0;
var DEVICE_ONLINE=false;

var dateLocal="";
var dateNube;
var diffHoraria=false;


$(function(){
  setInterval(function(){  
  	
					d = new Date();
					fmes=d.getMonth();
					fmes=fmes+1;
					if(fmes < 10)
					  fmes="0"+fmes;
					
					var fdia=d.getDate();
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
    			var dateLocal_new = new Date(''+d.getFullYear()+'-'+fmes+'-'+fdia+' '+fhora+':'+fmin+':'+fsec+'');
    			if(dateLocal=="")
    			{    				
    				dateNube=new Date(''+NUBE_USUARIO.substr(0, 10)+' '+NUBE_USUARIO.substr(11)+'');    				
    				
    				if(LOCAL_USUARIO=="local" || LOCAL_USUARIO=="")
    				{
    					dateLocal=new Date(''+d.getFullYear()+'-'+fmes+'-'+fdia+' '+fhora+':'+fmin+':'+fsec+'');
    					
    				}else
    					{
    						dateLocal= new Date(''+LOCAL_USUARIO.substr(0, 10)+' '+LOCAL_USUARIO.substr(11)+'');
    					}
    				
    				//alert(''+LOCAL_USUARIO.substr(0, 10)+' '+LOCAL_USUARIO.substr(11)+'');
    			}
    				
    			
    			if(dateLocal_new > dateLocal)
    			{    				
    				dateLocal=dateLocal_new;    				
    				updateLocalDateUser(''+d.getFullYear()+'-'+fmes+'-'+fdia+' '+fhora+':'+fmin+':'+fsec+'');
    				diffHoraria=false; 				
    			}else
    			{
    					diffHoraria=true;
    					//alert("Diferencia horaria");
    			}
    			//alert(dateLocal);
  },5000);
});

function onready()
{	
	
	uuid_user = device.uuid;
	$("#uuid_text").html("ID device: "+uuid_user);
	
	$.mobile.loading( 'show', {
			text: 'Cargando...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
	$("#ll_mapa").hide();
	$("#ll_off").hide(); 
	$("#ll_cerrar").hide(); 
	if(navigator.connection.type == Connection.NONE)
 	{
 		onOffline();
 		
 	}else
 	{
 		onOnline();
 		
	}
  onready2();
}
function onready2()
{
	
	loadBD();      
		
  if(!DEVICE_ONLINE)
  {  
  	
  	selectUserBDlocal();  
  	      			        			
    setTimeout("loadInicioOff();",1000);
        			
  }else
  {
  	
  	/*$.getScript( "http://www.chilemap.cl/OpenLayers/OpenLayers.js", function( data, textStatus, jqxhr ) {

		});*/
  	  	
  	$("#output").load(path_query2, 
			{tipo:1} 
			,function(){
				
				selectMarcaBDlocal();
				$.mobile.loading( 'hide');
			}
		);
  }
  navigator.splashscreen.hide();
}
function loadInicioOff()
{
	
	if(SELECT_USER && ID_ESTADO_ACTIVO==0 && ESTADO_USER==0)
	{
		
		$("#ll_mapa").hide();
		$("#ll_off").hide(); 
		$("#ll_cerrar").show(); 
		                      
		loadMenuOff();
		selectLugarBDlocal();
		
		setTimeout("loadFavOff();",1000);
		$.mobile.loading( 'hide');
		mensaje("No tiene conecci&oacute;n a internet activada.<br>El sistema trabajara de manera Local/Offline<br>Algunas opciones seran limitadas",'Alerta','myPopup');
	}else
	{
		$.mobile.loading( 'hide');
		inicio_ses();
			
		//cambiar("mod_sesion");
		
		if(ID_ESTADO_ACTIVO==1)
		{
			mensaje("Su usuario no esta activado para iniciar sesion en este dispositivo",'ERROR','myPopup');
		}else
		{
			if(ESTADO_USER==1)
			{
				
			}else
			{
				mensaje("No tiene conexion a internet y no tiene una sesion activa.<br>Por favor conectese a una red para continuar",'ERROR','myPopup');
			}
		}
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
	bar +='<li ><a  href="javascript:loadFavOff();" class="ui-btn-active"><img src="images/fav2.png"></a></li>';
	bar +='<li ><a  href="javascript:loadHomeOff();"><img src="images/icon-servicios.png"></a></li>';							
	bar +='<li><a href="javascript:loadHistorialOff();"><img src="images/historial.png"></a></li>';
	bar +='<li><a href=javascript:cambiar("mod_info");><img src="images/icon-info.png"></a></li>';
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
 	
 	 
    tx.executeSql('create table if not exists usuario(id, name, mail, estado, id_obvii, nube,activo,clave,local)');    
    
    tx.executeSql('create table if not exists lugar(id, name, direccion, fecha, fav,tipo,marcacion)');    
    tx.executeSql('create table if not exists marca(id, name,lati,loni,fecha,descripc,tipo,direccion,fec_nube,fec_local)');  
	}, errorCB, successCB);    

}
function addUsuarioBDLocal(id_us,nom_us,mail_us,est_us,id_obvii_us,tipo_us,clave_us)
{
	//alert("paso add usuario");
	 db.transaction(function(tx) {
 			tx.executeSql('DROP TABLE IF EXISTS usuario');
 			tx.executeSql('create table if not exists usuario(id, name, mail, estado, id_obvii, nube, activo,clave,local)');
			tx.executeSql('insert into usuario(id, name, mail, estado,id_obvii,nube,activo,clave,local) values (?,?,?,?,?,?,?,?,?)',[id_us,nom_us,mail_us, est_us,id_obvii_us,'nube',0,clave_us,'local']);
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
 	    	ID_ESTADO_ACTIVO= results.rows.item(i).activo;
 	    	CLAVE_USUARIO= results.rows.item(i).clave;
 	    	ESTADO_USER = results.rows.item(i).estado; 	    	
 	    	NUBE_USUARIO= results.rows.item(i).nube;
 	    	LOCAL_USUARIO= results.rows.item(i).local;
 	    	//alert(ESTADO_USER);
 	    	//alert(MAIL_USER);
 	    	
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
					//alert("id:"+NOM_LUGAR[b]);
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
		selectUserBDlocal();
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
					fmes=fmes+1;
					if(fmes < 10)
					  fmes="0"+fmes;
					
					var fdia=d.getDate();
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
					ffmonth=dateLocal.getMonth();
					ffmonth=ffmonth+1;
					if(ffmonth < 10)
					{
						ffmonth="0"+ffmonth;
					}
					ffmonth2=dateNube.getMonth();
					ffmonth2=ffmonth2+1;
					if(ffmonth2 < 10)
					{
						ffmonth2="0"+ffmonth2;
					}
					
					var ff_nube=''+dateNube.getFullYear()+'-'+ffmonth2+'-'+dateNube.getDate()+' '+dateNube.getHours()+':'+dateNube.getMinutes()+':'+dateNube.getSeconds()+'';
					var ff_local=''+dateLocal.getFullYear()+'-'+ffmonth+'-'+dateLocal.getDate()+' '+dateLocal.getHours()+':'+dateLocal.getMinutes()+':'+dateLocal.getSeconds()+'';

					db.transaction(function(tx) {	 	    
    				tx.executeSql('INSERT INTO marca (id, name,lati,loni,fecha,descripc,tipo,direccion,fec_nube,fec_local) VALUES ("'+id_marca_glob+'","'+nom_marca_glob+'","'+OBVII_LAT+'","'+OBVII_LON+'","'+fecha+'","'+descrip_marca+'","'+marcacion+'","vacio","'+ff_nube+'","'+ff_local+'")');
      		
					}, errorCB, successCB);
					$.mobile.loading( 'hide');
		  		mensaje("Marcacion realizada localmente",'Mensaje','myPopup');
				},function (err){
					$.mobile.loading( 'hide');
		//alert(DEVICE_ONLINE);
	  if(!DEVICE_ONLINE)
	  {
	  	$.mobile.loading( 'show', {
						text: 'Marcando...',
						textVisible: true,
						theme: 'a',
						html: ""
					});
					
					var fecha;
					var d = new Date();
					var fmes=d.getMonth();
					fmes=fmes+1;
					if(fmes < 10)
					  fmes="0"+fmes;
					
					var fdia=d.getDate();
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
					ffmonth=dateLocal.getMonth();
					ffmonth=ffmonth+1;
					if(ffmonth < 10)
					{
						ffmonth="0"+ffmonth;
					}
					ffmonth2=dateNube.getMonth();
					ffmonth2=ffmonth2+1;
					if(ffmonth2 < 10)
					{
						ffmonth2="0"+ffmonth2;
					}
					
					var ff_nube=''+dateNube.getFullYear()+'-'+ffmonth2+'-'+dateNube.getDate()+' '+dateNube.getHours()+':'+dateNube.getMinutes()+':'+dateNube.getSeconds()+'';
					var ff_local=''+dateLocal.getFullYear()+'-'+ffmonth+'-'+dateLocal.getDate()+' '+dateLocal.getHours()+':'+dateLocal.getMinutes()+':'+dateLocal.getSeconds()+'';

					db.transaction(function(tx) {	 	    
    				tx.executeSql('INSERT INTO marca (id, name,lati,loni,fecha,descripc,tipo,direccion,fec_nube,fec_local) VALUES ("'+id_marca_glob+'","'+nom_marca_glob+'","'+OBVII_LAT+'","'+OBVII_LON+'","'+fecha+'","'+descrip_marca+'","'+marcacion+'","vacio","'+ff_nube+'","'+ff_local+'")');
      		
					}, errorCB, successCB);
					$.mobile.loading( 'hide');
		  		mensaje("Marcacion realizada localmente",'Mensaje','myPopup');
	  }else
	  {
			mensaje("Se produjo un error en la lectura de su posici&oacute;n.<br>Esto se puede suceder al no darle permisos al sistema para obtener su ubicacion actual o bien no tiene disponible GPS en el equipo.<br>Por favor revise su configuracion e intentelo nuevamente",'ERROR','myPopup');
		}
					
					},{timeout:6000});
	
}
function noLocationOff(error)
{
		$.mobile.loading( 'hide');
			mensaje("Se produjo un error en la lectura de su posici&oacute;n.<br>Esto se puede suceder al no darle permisos al sistema para obtener su ubicacion actual o bien no tiene disponible GPS en el equipo.<br>Por favor revise su configuracion e intentelo nuevamente",'ERROR','myPopup');
		
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
 	TOT_MARCAS=rs.rows.length;	
 	
 	if(TOT_MARCAS > 0)
 	{
 		$("#id_sync").html("("+TOT_MARCAS+")");		
 		$("#id_sync_wel").html("<strong>("+TOT_MARCAS+")</strong>");		
 		
 	}else
 		{
 			$("#id_sync").html("("+TOT_MARCAS+")");		
 			$("#id_sync_wel").html("");		 		
 		}
 		
 				
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
			DIR_MARCA[i]=rs.rows.item(i).direccion;
			
			NUBE_MARCA[i]=rs.rows.item(i).fec_nube;
			LOCAL_MARCA[i]=rs.rows.item(i).fec_local;
 			//alert(LOCAL_MARCA[i]);    
 	}
    		
  	
}
function cleanMarcaBD()
{
	
	db.transaction(function(tx) {  
 		tx.executeSql('DROP TABLE IF EXISTS marca');
		tx.executeSql('create table if not exists marca(id, name,lati,loni,fecha,descripc,tipo,direccion,fec_nube,fec_local)'); 
	
	}, errorCB, successCB); 

	ID_MARCA=Array();
	NOM_MARCA=Array();  
	FECHA_MARCA=Array();
	LAT_MARCA=Array();
	LON_MARCA=Array();
	DSCRIP_MARCA=Array();
	TIP_MARCA=Array();
	
	DIR_MARCA=Array();
	NUBE_MARCA=Array();
	LOCAL_MARCA=Array();
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
function checkInternet(tip)
{
	
	if(navigator.connection.type == Connection.NONE)
 	{
 		
 		//onOffline();
 		if(DEVICE_ONLINE)
 		{
 			if(tip!=3)
 			{
 				window.location.href="index.html";
 			}
 			if(tip==3)
 			{
 				$.mobile.loading( 'hide');
 				mensaje("El sistema no se puede conectar a internet,<br>por favor revise su conecci&oacute;n e int&eacute;ntelo nuevamente.","ERROR","myPopup");
 			}
 		}else
 			{
 				if(tip==1)
				{
					cambiar("mod_info");
				}	
				if(tip==2)
				{
					loadHistorialOff();
				}	
				if(tip==4)
				{
					loadHomeOff();
				}				
				if(tip==5)
				{
					loadFavOff();
				}				
			}
 	}else
 	{
 		//onOnline();
 		if(!DEVICE_ONLINE)
 		{
 			window.location.href="index.html";s 			
 		}else
 			{
 				if(tip==1)
				{
					loadInfo();					
				}
					if(tip==2)
				{
					syncMarca();
				}				
			}
 		
	}
	
	
}
function syncMarca()
{
	$.mobile.loading( 'show', {
				text: 'Sincronizando...Esto puede tardar algunos minutos.',
				textVisible: true,
				theme: 'a',
				html: ""
			});
	selectMarcaBDlocal();
	setTimeout("processSyc();",2000);
	
}
function processSyc()
{
	var ids_marca="";
	var lats_marca="";
	var lons_marca="";        	
	var fechas_marca="";   
	var descips_marca="";   
	var noms_marca="";  
	var dirs_marca="";
	
	var tips_marca="";   
	var nub_marca="";  
	var loc_marca="";  

	if(ID_MARCA.length > 0)
	{
		
		for (var i = 0; i < ID_MARCA.length; i++)
		{
			ids_marca +="|"+ID_MARCA[i];
			lats_marca+="|"+LAT_MARCA[i];
			lons_marca+="|"+LON_MARCA[i];
			fechas_marca +="|"+FECHA_MARCA[i];
			descips_marca +="|"+DSCRIP_MARCA[i];
			tips_marca+="|"+TIP_MARCA[i];
			noms_marca+="|"+NOM_MARCA[i];
			dirs_marca+="|"+DIR_MARCA[i];			
			nub_marca+="|"+NUBE_MARCA[i];
			loc_marca+="|"+LOCAL_MARCA[i];
		}

		
		sync_marca=true;

					
		$("#output").load(path_query2, 
				{tipo:7,ide:ids_marca,lat:lats_marca,lon:lons_marca,fecha:fechas_marca, decrip:descips_marca,tip:tips_marca,nombre:noms_marca,direc:dirs_marca,nub_marca:nub_marca,loc_marca:loc_marca} 
					,function(){	
						$("#mypanel").panel( "close" );
						$.mobile.loading( 'hide');
						
						if(!sync_marca)
						{
							mensaje("Problemas de conexi&oacute;n, por favor int&eacute;ntelo nuevamente.","ERROR","myPopup_ses");
						}else
						{
							cleanMarcaBD();
							loadHistorial();
							selectMarcaBDlocal();
							mensaje("Marcaciones sincronizadas",'MENSAJE','myPopup');
						}
						//$('#contenido_sesion').trigger('create');
					}
			);
		}else
			{
				$.mobile.loading( 'hide');
				$("#mypanel").panel( "close" );
				mensaje("No hay marcaciones disponibles para sincronizar",'MENSAJE','myPopup');
			}
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
function loadLibreOff()
{
	$.mobile.loading( 'show', {
			text: '...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
	$("#contenido_sesion").load('libre.html', 
			{} 
				,function(){	
					$.mobile.loading( 'hide');
					$('#contenido_sesion').trigger('create');
				}
		);
}
function validaMarcacionOff()
{
	$.mobile.loading( 'show', {
			text: 'Validando datos...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
	var nombre=$.trim(document.getElementById("nom_lug").value);
	
	var calle=$.trim(document.getElementById("calle_lug").value);
	var numero=$.trim(document.getElementById("num_lug").value);
	var comuna=$.trim(document.getElementById("com_lug").value);
	var mail=$.trim(document.getElementById("mail_lug").value);
	var tipo_marca=$.trim(document.getElementById("slider1").value);
	var comenta=$.trim(document.getElementById("coment_lug").value);
	
	var msg="";
	var valida=true;
	if(nombre=="" )//|| calle=="" || mail=="" || numero=="" || comuna==""
	{
		msg +="Nombre de la marcacion es obligatoria<br>";
		valida=false;
	}
	if(!$.isNumeric(numero) && numero!="")
	{
		msg +="N&uacute;mero municipal debe ser numerico <br>";
		valida=false;
	}
	if(!validarEmail(mail) && mail!="")
	{
		msg +="Correo electronico no valido<br>";
		valida=false;
	}

	if(valida)
	{
		
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
					fmes=fmes+1;
					
					if(fmes < 10)
					  fmes="0"+fmes;
					
					var fdia=d.getDate();
					
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
					ffmonth=dateLocal.getMonth();
					ffmonth=ffmonth+1;
					if(ffmonth < 10)
					{
						ffmonth="0"+ffmonth;
					}
					ffmonth2=dateNube.getMonth();
					ffmonth2=ffmonth2+1;
					if(ffmonth2 < 10)
					{
						ffmonth2="0"+ffmonth2;
					}
					var ff_nube=''+dateNube.getFullYear()+'-'+ffmonth2+'-'+dateNube.getDate()+' '+dateNube.getHours()+':'+dateNube.getMinutes()+':'+dateNube.getSeconds()+'';
					var ff_local=''+dateLocal.getFullYear()+'-'+ffmonth+'-'+dateLocal.getDate()+' '+dateLocal.getHours()+':'+dateLocal.getMinutes()+':'+dateLocal.getSeconds()+'';
					
					db.transaction(function(tx) {	 	    
    				tx.executeSql('INSERT INTO marca (id, name,lati,loni,fecha,descripc,tipo,direccion,fec_nube,fec_local) VALUES ("0","'+nombre+'","'+OBVII_LAT+'","'+OBVII_LON+'","'+fecha+'","'+comenta+'","'+tipo_marca+'","'+calle+' #'+numero+', '+comuna+'","'+ff_nube+'","'+ff_local+'")');
      		
					}, errorCB, successCB);
					$.mobile.loading( 'hide');
		  		mensaje("Marcacion realizada localmente",'Mensaje','myPopup');
		
			
		
			
			},function (err){
				
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
					fmes=fmes+1;
					
					if(fmes < 10)
					  fmes="0"+fmes;
					
					var fdia=d.getDate();
					
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
					ffmonth=dateLocal.getMonth();
					ffmonth=ffmonth+1;
					if(ffmonth < 10)
					{
						ffmonth="0"+ffmonth;
					}
					ffmonth2=dateNube.getMonth();
					ffmonth2=ffmonth2+1;
					if(ffmonth2 < 10)
					{
						ffmonth2="0"+ffmonth2;
					}
					var ff_nube=''+dateNube.getFullYear()+'-'+ffmonth2+'-'+dateNube.getDate()+' '+dateNube.getHours()+':'+dateNube.getMinutes()+':'+dateNube.getSeconds()+'';
					var ff_local=''+dateLocal.getFullYear()+'-'+ffmonth+'-'+dateLocal.getDate()+' '+dateLocal.getHours()+':'+dateLocal.getMinutes()+':'+dateLocal.getSeconds()+'';
					
					db.transaction(function(tx) {	 	    
    				tx.executeSql('INSERT INTO marca (id, name,lati,loni,fecha,descripc,tipo,direccion,fec_nube,fec_local) VALUES ("0","'+nombre+'","'+OBVII_LAT+'","'+OBVII_LON+'","'+fecha+'","'+comenta+'","'+tipo_marca+'","'+calle+' #'+numero+', '+comuna+'","'+ff_nube+'","'+ff_local+'")');
      		
					}, errorCB, successCB);
					$.mobile.loading( 'hide');
		  		mensaje("Marcacion realizada localmente",'Mensaje','myPopup');
				},{timeout:6000});
		
		
		
	}else
		{
			$.mobile.loading( 'hide');
			mensaje(msg,'ERROR','myPopup');
		}
}

function deleteUser()
{
	 db.transaction(function(tx) 
 {
 	
 	  tx.executeSql('DROP TABLE IF EXISTS usuario');
    tx.executeSql('create table if not exists usuario(id, name, mail, estado, id_obvii,nube,activo,clave,local)');    
    window.location.href="index.html";
	}, errorCB, successCB);    
	   
}

function refreshSite()
{
	window.location.href="index.html";
}
function userOff()
{
	 db.transaction(function(tx) {
 			tx.executeSql("UPDATE usuario SET estado = 1");
 			window.location.href="index.html"; 
	}, errorCB, successCB);
	
	   
}

function updateEstadoUser(estado)
{
	ESTADO_USER=estado;
	 db.transaction(function(tx) {
 			tx.executeSql("UPDATE usuario SET estado = "+estado+"");
 			
	}, errorCB, successCB);

	   
}
function updateNubeUser(valor)
{
	
	 db.transaction(function(tx) {
 			tx.executeSql("UPDATE usuario SET nube = '"+valor+"'");
 			
	}, errorCB, successCB);
	
	   
}
function updateLocalDateUser(valor)
{
	
	 db.transaction(function(tx) {
 			tx.executeSql("UPDATE usuario SET local = '"+valor+"'");
 			
	}, errorCB, successCB);
	
	   
}

function sendDevice()
{
	var mail=$.trim(document.getElementById("mail_ses").value);
	$("#mypanel").panel( "close" );
	if(mail=="" || !validarEmail(mail))
	{
		//mensaje("Debe ingresar un mail valido para solicitar dispositivo.",'Error','myPopup');
		 $("#msg_error_ses").html("Debe ingresar un mail valido para solicitar dispositivo.");
		 $('#mail_ses').focus();
	}else
		{
			
			$.mobile.loading( 'show', {
				text: 'Enviando...',
				textVisible: true,
				theme: 'a',
				html: ""
			});
		if(DEVICE_ONLINE)
		{
			
			$("#output").load(path_query2, 
				{tipo:8,uuid_user:uuid_user,mail:mail} 
					,function(){
							
								
					}
			);
			
		}else
		{
			$.mobile.loading( 'hide');			
			mensaje("No tiene conecci&oacute;n a internet activada.<br>Para solicitar dispositivo debe estar conectado a internet.",'Alerta','myPopup');			
		}
		$("#msg_error_ses").html("");
	}
}
