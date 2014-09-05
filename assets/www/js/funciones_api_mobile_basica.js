var map,selectControl,selectControl_ondemand,styleMapDis;
var CM_servicios=Array();
var CM_servicios_estado=Array();
var CM_servicios_icono=Array();

//var ptos_vector_ondemand=[];
var ptos_vector_ondemand2;
var ptos_vector_ondemand=Array();

var sprintersLayer;
var ptos_vector=[];
var CM_vector_current;
var MX_lon="";
var MX_lat="";
var MX_accuracy="";
function init(lon_locate,lat_locate,zoom_locate) {
	
    map = new OpenLayers.Map({
        div: "map",
        theme: null,
        projection: new OpenLayers.Projection("EPSG:900913"),
        numZoomLevels: 18,
        controls: [
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            new OpenLayers.Control.Zoom()
        ],
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize'
            })
        ]
    });
    map.setCenter(new OpenLayers.LonLat(lon_locate,lat_locate).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
      ), zoom_locate);
    map.events.register("moveend", null, loadMovimiento);  
      
      /*Marcadores*/
      styleMapDis= new OpenLayers.StyleMap({
            externalGraphic: "img/servicio.png",
            graphicOpacity: 1.0,
            graphicWidth: 26,
            graphicHeight: 26,
            graphicYOffset: -26
        });
     
     sprintersLayer = new OpenLayers.Layer.Vector("Sprinters", {styleMap:styleMapDis});
     
   
    selectControl = new OpenLayers.Control.SelectFeature(sprintersLayer, {
        autoActivate:true,
        onSelect: onSelectFeatureFunction});
        
   map.addLayer(sprintersLayer);
   map.addControl(selectControl);
   
   
   /*Geolocaliczacion*/
   
		var style_current = {
    	fillColor: '#000',
    	fillOpacity: 0.1,
    	strokeWidth: 0
		};
		CM_vector_current = new OpenLayers.Layer.Vector("vector_current", {styleMap: style_current});
		map.addLayer(CM_vector_current);

		var pulsate = function(feature) 
		{
    	var point = feature.geometry.getCentroid(),
    	    bounds = feature.geometry.getBounds(),
    	    radius = Math.abs((bounds.right - bounds.left)/2),
    	    count = 0,
    	    grow = 'up';
    	
    	var resize = function(){
    		if (count>16) {
    		        clearInterval(window.resizeInterval);
    		}
    		var interval = radius * 0.03;
    		var ratio = interval/radius;
    		switch(count) {
    		  case 4:
    		  case 12:
    		  grow = 'down'; break;
    		  case 8:
    		  grow = 'up'; break;
    		}
    		if (grow!=='up') {
    			ratio = - Math.abs(ratio);
    		}
    		feature.geometry.resize(1+ratio, point);
    		CM_vector_current.drawFeature(feature);
    		count++;
    	};
    	window.resizeInterval = window.setInterval(resize, 50, point, radius);
		};

		geolocate = new OpenLayers.Control.Geolocate({
    	bind: false,
    	geolocationOptions: {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: 7000
    	}
		});
		map.addControl(geolocate);

		var firstGeolocation = true;
		geolocate.events.register("locationupdated",geolocate,function(e) 
		{
			
    	CM_vector_current.removeAllFeatures();
    	//alert(e.point.x);
    	var circle = new OpenLayers.Feature.Vector(
        OpenLayers.Geometry.Polygon.createRegularPolygon(
            new OpenLayers.Geometry.Point(e.point.x, e.point.y),
            e.position.coords.accuracy/2,
            40,
            0
        ),
        {},
        style_current
    	);
    	CM_vector_current.addFeatures([
        new OpenLayers.Feature.Vector(
            e.point,
            {},
            {
                graphicName: 'cross',
                strokeColor: '#f00',
                strokeWidth: 2,
                fillOpacity: 0,
                pointRadius: 10
            }
        ),
        circle
    	]);
    	if (firstGeolocation) {
    		
        map.zoomToExtent(CM_vector_current.getDataExtent());
        pulsate(circle);
        firstGeolocation = false;
        this.bind = false;
    	}
    	
		});
		geolocate.events.register("locationfailed",this,function() 
		{
    	OpenLayers.Console.log('Location detection failed');
		});


		/*Fin  geolocalizacion*/
}
function addMarcadores(CM_lon,CM_lat,CM_texto,CM_icono,CM_width,CM_height)
{
	
var CM_style ={
			externalGraphic: ""+CM_icono+"",
            graphicOpacity: 1.0,
            graphicWidth: CM_width,
            graphicHeight: CM_height,
            graphicYOffset: -26
		};        
	var points_vector = new OpenLayers.Geometry.Point(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
  );
	var ptos_vector_ = new OpenLayers.Feature.Vector(points_vector,{'data':CM_texto},CM_style);
	ptos_vector.push(ptos_vector_);
  sprintersLayer.addFeatures(ptos_vector_);
  
}
function addMarcadoresOndemand(CM_lon,CM_lat,CM_texto,CM_icono,CM_width,CM_height,CM_id)
{
	
var CM_style ={
			externalGraphic: ""+CM_icono+"",
            graphicOpacity: 1.0,
            graphicWidth: CM_width,
            graphicHeight: CM_height,
            graphicYOffset: -26
		};        
	var points_vector = new OpenLayers.Geometry.Point(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
  );
	//ptos_vector_ondemand[CM_id] = new OpenLayers.Feature.Vector(points_vector,{'data':CM_texto},CM_style);
	ptos_vector_ondemand2= new OpenLayers.Feature.Vector(points_vector,{'data':CM_texto},CM_style);
	//ptos_vector_ondemand.push(ptos_vector_ondemand2);
	//ptos_vector_ondemand2.fid = ""+CM_id+"";
  //sprintersLayer.addFeatures(ptos_vector_ondemand[CM_id]);
  ptos_vector_ondemand[CM_id].push(ptos_vector_ondemand2);
  sprintersLayer.addFeatures(ptos_vector_ondemand2);
  
}


function addMarcadoresOtros(CM_lon,CM_lat,CM_texto,CM_icono,CM_width,CM_height)
{
	
var CM_style ={
			externalGraphic: ""+CM_icono+"",
            graphicOpacity: 1.0,
            graphicWidth: CM_width,
            graphicHeight: CM_height,
            graphicYOffset: -26
		};        
	var points_vector = new OpenLayers.Geometry.Point(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
  );

  
}
function onSelectFeatureFunction(feature)
{
	
	var datas;
		 for (var key in feature.attributes) {
                        
                        if(feature.attributes[key]!="undefined")
                        {
                        	datas =feature.attributes[key];
                        }
                        
                     
                    }
                    if(datas!="")
                    {
                    	$( "#myPopup" ).html("<p>"+ datas+"</p>" );
                  		$("#myPopup").popup("close");
                  		$("#myPopup").popup("open");
                  	}
            	      
            	
        
}

function verMarcadores()
{
	map.zoomToExtent(sprintersLayer.getDataExtent(),false);
}
function moverCentro(CM_lat,CM_lon,CM_zoom)
{
	map.setCenter(new OpenLayers.LonLat(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
      ), CM_zoom);

}
function checkServ(CM_id_servicio_gis,CM_icono,CM_id)
{
	
	if(getEstadoServicio(CM_id)==0)
	{
		desactivarServicio(CM_id);
		deleteServicioMapa(CM_id);
	}else
	{
		if(getEstadoServicio(CM_id)==1)
		{
			if(CM_id_servicio_gis== CM_id_antena)
			{
				if(map.getZoom()  >= MIN_ZOOM_ANTENAS)
				{
					activarServicio(CM_id);
					loadServEsp(CM_id_servicio_gis,CM_icono,CM_id);
				}else
					{
						mensaje("El servicio de antenas solo esta disponible desde un zoom "+MIN_ZOOM_ANTENAS+". Si desea acercarse a ese zoom haga click <a href=javascript:map.zoomTo("+MIN_ZOOM_ANTENAS+");>aqui</a>");
					}
			}else
			{
				activarServicio(CM_id);
				loadServEsp(CM_id_servicio_gis,CM_icono,CM_id);
			}
		}
	}
	
}

function loadServEsp(CM_id_servicio_gis,CM_icono,CM_id)
{
	
	activarServicio(CM_id);
	//deleteServicioMapa(CM_id);
		
	var AM_exten = getExtencion();
	
	var body = document.getElementsByTagName("body")[0];
	var scr = document.createElement("script");
	scr.setAttribute("type","text/javascript");
	scr.setAttribute("src","query_mapa.php?tipo=6&loni="+AM_exten.left+"&lati="+AM_exten.bottom+"&lond="+AM_exten.right+"&lats="+AM_exten.top+"&id="+CM_id_servicio_gis+"&icono="+CM_icono+"&id_serv="+CM_id+"");
	scr.setAttribute("id","scriptTemporal");
	body.appendChild(scr);
	
}


function addServicios(CM_nombre,CM_id,CM_id_serv,CM_icono)
{
	 CM_servicios[CM_id]=CM_id_serv; //id original servicios BD
	 CM_servicios_estado[CM_id]=1; //inactivo
	 CM_servicios_icono[CM_id]=CM_icono; //inactivo
	 ptos_vector_ondemand[CM_id]=[];
	 
	 
	 /*markers_ondemand[CM_id] = new OpenLayers.Layer.Vector( ""+CM_nombre+"" , {styleMap:styleMapDis});
     
   
    selectControl_ondemand = new OpenLayers.Control.SelectFeature(markers_ondemand[CM_id], {
        autoActivate:true,
        onSelect: onSelectFeatureFunction});
        
   map.addLayer(markers_ondemand[CM_id]);
   map.addControl(selectControl_ondemand);*/
  
}


function activarServicio(CM_id)
{
	 CM_servicios_estado[CM_id]=0;
}
function desactivarServicio(CM_id)
{
	
	 CM_servicios_estado[CM_id]=1;
}
function getEstadoServicio(CM_id)
{
	 return CM_servicios_estado[CM_id];
}


function getExtencion()
{
	var AM_exten=map.getExtent().transform(
        new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
      );
	return AM_exten;
}

function loadMovimiento()
{
			for(i=0;i<CM_servicios.length;i++)
			{
				
		
				if(CM_servicios_estado[i]==0)
				{
					if(CM_servicios[i]== CM_id_antena)
					{
						if(map.getZoom()  >= MIN_ZOOM_ANTENAS)
						{
							deleteServicioMapa(i);
							loadServEsp(CM_servicios[i],CM_servicios_icono[i],i);
						}else
							{
								deleteServicioMapa(i);
								mensaje("<p>El servicio de antenas solo esta disponible desde un zoom "+MIN_ZOOM_ANTENAS+". Si desea acercarse a ese zoom haga click <a href=javascript:map.zoomTo("+MIN_ZOOM_ANTENAS+");>aqui</a></p>");
							}
					}else
					{
						
						deleteServicioMapa(i);
						loadServEsp(CM_servicios[i],CM_servicios_icono[i],i);
					}
				}
			}
			
}


/*Eliminar limpiar*/
function deleteServicioMapa(CM_id)
{	
	
	try{
	
   
		sprintersLayer.removeFeatures(ptos_vector_ondemand[CM_id]);	
		ptos_vector_ondemand[CM_id]=[];			
			/*for(i=0;i<CM_servicios.length;i++)
			{
		
				if(CM_servicios_estado[i]==0)
				{
					//deleteServicioMapa(i);
					loadServEsp(CM_servicios[i],CM_servicios_icono[i],i);
				}
			}*/
		  
}catch(e){}
}


function deleteTodos()
{
	try
	{
			//sprintersLayer.destroyFeatures(ptos_vector.features);		
			sprintersLayer.removeFeatures(ptos_vector);	
			ptos_vector=[];
			
	}catch(e){}   
		try
		{
			CM_vector_current.removeAllFeatures();  
		}catch(e){}   
}

function deleteMarcadores()
{
	//try
	//{
			//sprintersLayer.destroyFeatures(ptos_vector.features);		
			sprintersLayer.removeFeatures(ptos_vector);	
			ptos_vector=[];
			
	//}catch(e){}   
}
/**/
function replaceAll( text, busca, reemplaza ){

  while (text.toString().indexOf(busca) != -1)

      text = text.toString().replace(busca,reemplaza);

  return text;

}

function currentLocation()
{
	 CM_vector_current.removeAllFeatures();
    geolocate.deactivate();
    var style_current = {
    	fillColor: '#000',
    	fillOpacity: 0.1,
    	strokeWidth: 0
		};
		CM_vector_current = new OpenLayers.Layer.Vector("vector_current", {styleMap: style_current});
		map.addLayer(CM_vector_current);

		var pulsate = function(feature) 
		{
    	var point = feature.geometry.getCentroid(),
    	    bounds = feature.geometry.getBounds(),
    	    radius = Math.abs((bounds.right - bounds.left)/2),
    	    count = 0,
    	    grow = 'up';
    	
    	var resize = function(){
    		if (count>16) {
    		        clearInterval(window.resizeInterval);
    		}
    		var interval = radius * 0.03;
    		var ratio = interval/radius;
    		switch(count) {
    		  case 4:
    		  case 12:
    		  grow = 'down'; break;
    		  case 8:
    		  grow = 'up'; break;
    		}
    		if (grow!=='up') {
    			ratio = - Math.abs(ratio);
    		}
    		feature.geometry.resize(1+ratio, point);
    		CM_vector_current.drawFeature(feature);
    		count++;
    	};
    	window.resizeInterval = window.setInterval(resize, 50, point, radius);
		};

		geolocate = new OpenLayers.Control.Geolocate({
    	bind: false,
    	geolocationOptions: {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: 7000
    	}
		});
		map.addControl(geolocate);

		var firstGeolocation = true;
		geolocate.events.register("locationupdated",geolocate,function(e) 
		{
			
    	CM_vector_current.removeAllFeatures();   	
    	MX_accuracy=e.position.coords.accuracy;
    	var MX_lonlat=new OpenLayers.LonLat(e.point.x,e.point.y).transform(
        new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
      );
    	MX_lat=MX_lonlat.lat;
    	MX_lon=MX_lonlat.lon;
      
    	var circle = new OpenLayers.Feature.Vector(
        OpenLayers.Geometry.Polygon.createRegularPolygon(
            new OpenLayers.Geometry.Point(e.point.x, e.point.y),
            e.position.coords.accuracy,
            40,
            0
        ),
        {},
        style_current
    	);
    	CM_vector_current.addFeatures([
        new OpenLayers.Feature.Vector(
            e.point,
            {},
            {
                graphicName: 'cross',
                strokeColor: '#f00',
                strokeWidth: 2,
                fillOpacity: 0,
                pointRadius: 10
            }
        ),
        circle
    	]);
    	if (firstGeolocation) {
    		
        map.zoomToExtent(CM_vector_current.getDataExtent());
 
        pulsate(circle);
        firstGeolocation = false;
        this.bind = false;
    	}
    	
		});
		geolocate.events.register("locationfailed",this,function() 
		{
    	OpenLayers.Console.log('Location detection failed');
		});

        //geolocate.watch = true;
       // firstGeolocation = true;
        geolocate.activate();
  
}

function DibujarCirculoAdap(color,linea_color,radio,lon_circulo,lat_circulo,opc)
{
	
	var points = new OpenLayers.Geometry.Point(lon_circulo,lat_circulo).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
      );
	var style_blue = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
  style_blue.strokeColor = linea_color; 
  style_blue.fillColor = color;
  if(opc>0)
  	style_blue.fillOpacity=opc;
  else
  	style_blue.fillOpacity=0.4;	 
  style_blue.stroke=false;
//  radius = radio * map.getExtent().getHeight();

	var pointFeature = new OpenLayers.Feature.Vector( 
 	OpenLayers.Geometry.Polygon.createRegularPolygon( points, radio, 40, 0 ), null,  style_blue ); 

/*circleFeature.geometry.transform( new 
OpenLayers.Projection("EPSG:4326"), new 
OpenLayers.Projection("EPSG:900913") ); */
CM_vector_current.addFeatures( [pointFeature] );
//addMarcador("img/iconos/circle.png","10,10",lat_circulo,lon_circulo,""); 
}