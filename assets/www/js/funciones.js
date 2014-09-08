var OBVII_LON=0;
var OBVII_LAT=0;
var OBVII_ACCU=0;
var PAIS_LON=-70.656235;
var PAIS_LAT=-33.458943;
var OBVII_PAIS="chile";

var path_query="http://locate.chilemap.cl/obvii/app/query.php";
var path_query2="http://locate.chilemap.cl/obvii/app/query_app.php";
var path_info="http://locate.chilemap.cl/obvii/app/info.php";
 			function loadMenu()
 			{
 				$("#output").load(path_query2, 
				{tipo:2} 
					,function(){
						
					}
				);
 			}
 				

function cambiar(nom_mod)
{
	//$( ":mobile-pagecontainer" ).pagecontainer( "load", pageUrl, { showLoadMsg: false } );
	
	$.mobile.changePage('#'+nom_mod+'');
	//$( "#nom_reg" ).focus();
	
}
function volver()
{
	
	//$.mobile.changePage('#mod_sesion');
	history.go(-1);
}
function validarEmail( email ) {
	  var valido=true;
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if ( !expr.test(email) )
        valido=false;
        
   return valido;     
}
function mensaje(CM_mensaje,titulo,div)
{
	
	var html_msg="";
	if(titulo!="")
	{
		html_msg +="<div class=titulo>"+titulo+"</div>";
	}
  html_msg +="<p>"+CM_mensaje+"</p>";
	$( "#"+div ).html(html_msg); 
  $("#"+div).popup("open");
  
}

function inicioSesion()
{
	var mail=$.trim(document.getElementById("mail_ses").value);
	var clave=$.trim(document.getElementById("clave_ses").value);
	var msg="";
	var valida=true;
	if(mail =="" || clave=="")
	{
		msg +="Todos los campos son obligatorios.<br>";
	  valida=false;
	}
	if(!validarEmail(mail))
	{
		msg +="Correo electronico no valido.";
		valida=false;
	}
	if(valida)
	{
		$.mobile.loading( 'show', {
			text: 'Validando datos...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
		$("#output").load(path_query, 
			{tipo:1, mail:mail, clave:clave} 
				,function(){	
					$.mobile.loading( 'hide');
				}
		);
	}else
	{
		
			mensaje(msg,'ERROR','myPopup_ses');
	}
}

function loadNuevo()
{
	$.mobile.loading( 'show', {
			text: '...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
	$("#contenido_sesion").load(path_query2, 
			{tipo:4} 
				,function(){	
					$.mobile.loading( 'hide');
					$('#contenido_sesion').trigger('create');
				}
		);
}
function loadEditar(id_lugar)
{
	$.mobile.loading( 'show', {
			text: '...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
	$("#contenido_sesion").load(path_query2, 
			{tipo:5,id:id_lugar} 
				,function(){	
					$.mobile.loading( 'hide');
					$('#contenido_sesion').trigger('create');
				}
		);
}
function loadHome()
{
	$.mobile.loading( 'show', {
			text: 'Cargando Lugares...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
	$("#contenido_sesion").load(path_query, 
			{tipo:2} 
				,function(){	
					$.mobile.loading( 'hide');
					$('#contenido_sesion').trigger('create');
				}
		);
}
function loadAsis()
{
	$.mobile.loading( 'show', {
			text: '...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
	$("#contenido_sesion").load(path_query, 
			{tipo:14} 
				,function(){	
					$.mobile.loading( 'hide');
					$('#contenido_sesion').trigger('create');
				}
		);
}
function loadFav()
{
	$.mobile.loading( 'show', {
			text: 'Cargando Favoritos...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
	$("#contenido_sesion").load(path_query, 
			{tipo:11} 
				,function(){	
					$.mobile.loading( 'hide');
					$('#contenido_sesion').trigger('create');
				}
		);
}
function loadHistorial()
{
	$.mobile.loading( 'show', {
			text: '...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
	$("#contenido_sesion").load(path_query2, 
			{tipo:3} 
				,function(){	
					$.mobile.loading( 'hide');
					$('#contenido_sesion').trigger('create');
				}
		);
}
function loadInfo()
{
	$.mobile.loading( 'show', {
			text: '...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
	$("#contenido_sesion").load(path_info, 
			{} 
				,function(){	
					$.mobile.loading( 'hide');
					$('#contenido_sesion').trigger('create');
				}
		);
}

function cerrarSesion()
{
	$("#contenido_sesion").load(path_query, 
			{tipo:3} 
				,function(){	
					window.location.href="index.html";
				}
		);
}
function addUsuario()
{
	var nombre=$.trim(document.getElementById("nom_reg").value);
	var mail=$.trim(document.getElementById("mail_reg").value);
	var clave=$.trim(document.getElementById("clave_reg").value);
	var msg="";
	var valida=true;
	if(mail =="" || clave=="" || nombre=="")
	{
		msg +="Todos los campos son obligatorios.<br>";
	  valida=false;
	}
	if(!validarEmail(mail))
	{
		msg +="Correo electronico no valido.";
		valida=false;
	}
	if(valida)
	{
		$.mobile.loading( 'show', {
			text: 'Validando datos...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
		$("#output").load(path_query, 
			{tipo:4, mail:mail, clave:clave, nombre:nombre} 
				,function(){	
					$.mobile.loading( 'hide');
				}
		);
	}else
	{
		
			mensaje(msg,'ERROR','myPopup_reg');
	}
}

function RecClave()
{
	
	var mail=$.trim(document.getElementById("mail_rec").value);
	var valida=true;
	if(mail =="")
	{
		msg +="Todos los campos son obligatorios.<br>";
	  valida=false;
	}
	if(!validarEmail(mail))
	{
		msg +="Correo electronico no valido.";
		valida=false;
	}
	if(valida)
	{
		$.mobile.loading( 'show', {
			text: 'Validando datos...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
		$("#output").load(path_query, 
			{tipo:5, mail:mail} 
				,function(){	
					$.mobile.loading( 'hide');
				}
		);
	}else
	{
		
			mensaje(msg,'ERROR','myPopup_rec');
	}
}
function validaMarcacion()
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
			

			$("#output").load(path_query, 
			{tipo:13, mail:mail, nom:nombre, calle:calle,numero:numero,com:comuna,lat:lat,lon:lng,accu:accu,coment:comenta,marca:tipo_marca} 
				,function(){	
					$.mobile.loading( 'hide');
				}
		);
		
			
			},noLocation,{timeout:6000});
		
		
		
		
	}else
		{
			$.mobile.loading( 'hide');
			mensaje(msg,'ERROR','myPopup');
		}
}
function validaLugar()
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
	var comentario=$.trim(document.getElementById("slider2").value);
	var marcacion=$.trim(document.getElementById("slider1").value);
	var msg="";
	var valida=true;
	if(nombre=="" || calle=="" || mail=="" || numero=="" || comuna=="")
	{
		msg +="Todos los campos son obligatorios <br>";
		valida=false;
	}
	if(!$.isNumeric(numero))
	{
		msg +="N&uacute;mero municipal debe ser numerico <br>";
		valida=false;
	}
	if(!validarEmail(mail))
	{
		msg +="Correo electronico no valido<br>";
		valida=false;
	}

	if(valida)
	{
		$("#output").load(path_query, 
			{tipo:6, mail:mail, nom:nombre, calle:calle,numero:numero,com:comuna,comen:comentario,marcacion:marcacion} 
				,function(){	
					$.mobile.loading( 'hide');
				}
		);
	}else
		{
			$.mobile.loading( 'hide');
			mensaje(msg,'ERROR','myPopup');
		}
}

function validaUpLugares(id_lugar)
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
	var comentario=$.trim(document.getElementById("slider2").value);
	var marcacion=$.trim(document.getElementById("slider1").value);
	var msg="";
	var valida=true;
	if(nombre=="" || calle=="" || mail=="" || numero=="" || comuna=="")
	{
		msg +="Todos los campos son obligatorios <br>";
		valida=false;
	}
	if(!$.isNumeric(numero))
	{
		msg +="N&uacute;mero municipal debe ser numerico <br>";
		valida=false;
	}
	if(!validarEmail(mail))
	{
		msg +="Correo electronico no valido<br>";
		valida=false;
	}

	if(valida)
	{
		$("#output").load(path_query, 
			{tipo:7, id:id_lugar,mail:mail, nom:nombre, calle:calle,numero:numero,com:comuna,comen:comentario,marca:marcacion} 
				,function(){	
					$.mobile.loading( 'hide');
				}
		);
	}else
		{
			$.mobile.loading( 'hide');
			mensaje(msg,'ERROR','myPopup');
		}
}
function marcar(id_lugar,comenta,marca)
{
	if(marca=='f')
	{
		marcarLugar(id_lugar,comenta);
	}else
	{
		if(comenta=='t')
		  comenta=0;
		else
			comenta=1;  
		mensaje("<div id='coment_form' name='coment_form'><input type='button' onclick='marcarLugar("+id_lugar+","+comenta+");' class=bottom_coment value='Entrada'><br><input type='button' onclick='marcarSalida("+id_lugar+");' class=bottom_coment value='Salida'></div>",'Seleccione una opci&oacute;n','myPopup');
	}
	
}

function marcarSalida(id_lugar)
{
	$.mobile.loading( 'show', {
				text: 'Obteniendo Ubicacion...',
				textVisible: true,
				theme: 'a',
				html: ""
			});
		checkInternet(4);		
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
			var comenta="";
				
				$("#output").load(path_query, 
				{tipo:8, id:id_lugar,coment:comenta,lat:lat,lon:lng,accu:accu,tipo_marca:1} 
					,function(){	
						$.mobile.loading( 'hide');
					}
			);
		
			
			},noLocation,{timeout:6000});
}
function marcarLugar(id_lugar,comenta)
{
	if(comenta=='t' || comenta==0)
	{
		$.mobile.loading( 'hide');
		mensaje("<div id='coment_form' name='coment_form'><input type='text' id=comentario_lug name=comentario_lug class=input_coment><br><input type='button' onclick='marcarLugarCom("+id_lugar+");' class=bottom_coment value='Guardar'></div>",'Ingrese un comentario','myPopup');
		
	}else
	{
		$.mobile.loading( 'show', {
				text: 'Obteniendo Ubicacion...',
				textVisible: true,
				theme: 'a',
				html: ""
			});
		checkInternet(4);
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
			var comenta="";
				
				$("#output").load(path_query, 
				{tipo:8, id:id_lugar,coment:comenta,lat:lat,lon:lng,accu:accu,tipo_marca:0} 
					,function(){	
						$.mobile.loading( 'hide');
					}
			);
		
			
			},noLocation,{timeout:6000});
		
	}
	
}

  function noLocation(err)
{
	$.mobile.loading( 'hide');
	
	mensaje("Se produjo un error en la lectura de su posici&oacute;n.<br>Esto se puede suceder al no darle permisos al sistema para obtener su ubicacion actual.<br>Por favor revise su configuracion e intentelo nuevamente",'ERROR','myPopup');
	
}
function marcarLugarCom(id_lugar)
{
	$("#myPopup").popup("close");
	
			$.mobile.loading( 'show', {
				text: 'Obteniendo Ubicacion...',
				textVisible: true,
				theme: 'a',
				html: ""
			});
			checkInternet(4);
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
			var coment=$.trim(document.getElementById("comentario_lug").value);
			
			$("#output").load(path_query, 
			{tipo:8, id:id_lugar,coment:coment,lat:OBVII_LAT,lon:OBVII_LON,accu:OBVII_ACCU,tipo_marca:0} 
				,function(){	
					$.mobile.loading( 'hide');
				}
		);
		
			
			},noLocation,{timeout:6000});
	
			
}

function deleteLugar(id_lugar)
{
	$.mobile.loading( 'show', {
				text: 'eliminando',
				textVisible: true,
				theme: 'a',
				html: ""
			});
			
			
			$("#output").load(path_query, 
			{tipo:9, id:id_lugar} 
				,function(){	
					$.mobile.loading( 'hide');
					loadHome();
					mensaje("Lugar Eliminado",'MENSAJE','myPopup');
				}
		);
}
function addFav(id_lugar)
{
	$.mobile.loading( 'show', {
				text: 'Agregando a Favoritos',
				textVisible: true,
				theme: 'a',
				html: ""
			});
			
			
			$("#output").load(path_query, 
			{tipo:10, id:id_lugar} 
				,function(){	
					$.mobile.loading( 'hide');
					loadFav();
					mensaje("Agregado a Favoritos",'MENSAJE','myPopup');
				}
		);
	
}
function delFav(id_lugar)
{
	$.mobile.loading( 'show', {
				text: 'Eliminando de Favoritos',
				textVisible: true,
				theme: 'a',
				html: ""
			});
			
			
			$("#output").load(path_query, 
			{tipo:12, id:id_lugar} 
				,function(){	
					$.mobile.loading( 'hide');
					loadFav();
					mensaje("Eliminado de Favoritos",'MENSAJE','myPopup');
				}
		);
	
}
function marcaInt(est,id_usuario,id_lugar,marca)
{
	$("#myPopup").popup("close");
	$.mobile.loading( 'show', {
				text: 'Marcando',
				textVisible: true,
				theme: 'a',
				html: ""
			});
	$("#output").load(path_query, 
			{tipo:15, id:id_usuario,marca:est,lugar:id_lugar,marca_base:marca} 
				,function(){	
					$.mobile.loading( 'hide');
					loadAsis();
					
				}
		);
}
function cancelaMarcaInt(id_marca)
{
	$("#myPopup").popup("close");
	$.mobile.loading( 'show', {
				text: 'Cancelando',
				textVisible: true,
				theme: 'a',
				html: ""
			});
	$("#output").load(path_query, 
			{tipo:16, id:id_marca} 
				,function(){	
					$.mobile.loading( 'hide');
					loadAsis();
					
				}
		);
}

function sendLitsaMail(id_lug,id_base)
{
		$.mobile.loading( 'show', {
				text: 'Enviado mail...',
				textVisible: true,
				theme: 'a',
				html: ""
			});
	$("#output").load(path_query, 
			{tipo:17, id:id_lug,base:id_base} 
				,function(){	
					$.mobile.loading( 'hide');
					//loadAsis();
					
				}
		);
}
function verMapa()
{
	//cambiar("mod_mapa");
	$("#mypanel").panel( "close" );
	
		$.mobile.loading( 'show', {
				text: 'Cargando Mapa',
				textVisible: true,
				theme: 'a',
				html: ""
			});
			$("#contenido_sesion").load(path_query, 
			{tipo:18} 
				,function(){	
					$.mobile.loading( 'hide');
					init(PAIS_LON,PAIS_LAT,10);
					//loadCentroMapa();
					$("#info_pres").html("Para Actualizar su ubicaci&oacute;n actual, haga click aqu&iacute; <img onclick='loadCentroMapa();' src='images/current.png' class=curretn>");
					if(OBVII_LON!=0)
					{
						$("#info_pres").html("Ultima ubicaci&oacute;n registrada con una presici&oacute;n de : "+OBVII_ACCU+"  <img onclick='loadCentroMapa();' src='images/current.png' class=curretn>");
						moverCentro(OBVII_LAT,OBVII_LON,15);
						//point5
						addMarcadores(OBVII_LON,OBVII_LAT,"Ultima ubicaci&oacute;n registrada","images/point.png",40,40);
					}
					
				}
			);
		
			
}

function loadCentroMapa()
{
	$.mobile.loading( 'show', {
				text: 'Obteniendo ubicacion actual',
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
			$("#info_pres").html("La precision de su GPS es de "+OBVII_ACCU+". Si desea mejorarla conectese a una red Wi-Fi.  <img onclick='loadCentroMapa();' src='images/current.png' class=curretn>");
			moverCentro(OBVII_LAT,OBVII_LON,15);
			//point5
			addMarcadores(OBVII_LON,OBVII_LAT,"Ubicaci&oacute;n Actual","images/point.png",40,40);
			$.mobile.loading( 'hide');
			},noLocation,{timeout:6000});
}