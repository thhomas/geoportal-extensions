!function(a,b){if("function"==typeof define&&define.amd)define(["leaflet","proj4"],b);else if("object"==typeof module&&"object"==typeof module.exports)L=require("leaflet"),proj4=require("proj4"),module.exports=b(L,proj4);else{if("undefined"==typeof a.L||"undefined"==typeof a.proj4)throw"Leaflet and proj4 must be loaded first";b(a.L,a.proj4)}}(this,function(a,b){return a.Proj={},a.Proj._isProj4Obj=function(a){return"undefined"!=typeof a.inverse&&"undefined"!=typeof a.forward},a.Proj.ScaleDependantTransformation=function(a){this.scaleTransforms=a},a.Proj.ScaleDependantTransformation.prototype.transform=function(a,b){return this.scaleTransforms[b].transform(a,b)},a.Proj.ScaleDependantTransformation.prototype.untransform=function(a,b){return this.scaleTransforms[b].untransform(a,b)},a.Proj.Projection=a.Class.extend({initialize:function(c,d){if(a.Proj._isProj4Obj(c))this._proj=c;else{var e=c;if(d)b.defs(e,d);else if(void 0===b.defs[e]){var f=e.split(":");if(f.length>3&&(e=f[f.length-3]+":"+f[f.length-1]),void 0===b.defs[e])throw"No projection definition for code "+e}this._proj=b(e)}},project:function(b){var c=this._proj.forward([b.lng,b.lat]);return new a.Point(c[0],c[1])},unproject:function(b,c){var d=this._proj.inverse([b.x,b.y]);return new a.LatLng(d[1],d[0],c)}}),a.Proj.CRS=a.Class.extend({includes:a.CRS,options:{transformation:new a.Transformation(1,0,-1,0)},initialize:function(b,c,d){var e,f,g,h;if(a.Proj._isProj4Obj(b)?(f=b,e=f.srsCode,h=c||{},this.projection=new a.Proj.Projection(f)):(e=b,g=c,h=d||{},this.projection=new a.Proj.Projection(e,g)),a.Util.setOptions(this,h),this.code=e,this.transformation=this.options.transformation,this.options.origin&&(this.transformation=new a.Transformation(1,-this.options.origin[0],-1,this.options.origin[1])),this.options.scales)this._scales=this.options.scales;else if(this.options.resolutions){this._scales=[];for(var i=this.options.resolutions.length-1;i>=0;i--)this.options.resolutions[i]&&(this._scales[i]=1/this.options.resolutions[i])}},scale:function(a){var c,d,e,f,b=Math.floor(a);return a===b?this._scales[a]:(c=this._scales[b],d=this._scales[b+1],e=d-c,f=a-b,c+e*f)},getSize:function(b){var d,e,f,c=this.options.bounds;return c?(d=this.scale(b),e=this.transformation.transform(c.min,d),f=this.transformation.transform(c.max,d),a.point(Math.abs(f.x-e.x),Math.abs(f.y-e.y))):(d=256*Math.pow(2,b),a.point(d,d))}}),a.Proj.CRS.TMS=a.Proj.CRS.extend({options:{tileSize:256},initialize:function(b,c,d,e){var f,g,h,i,j;a.Proj._isProj4Obj(b)?(h=b,i=c,j=d||{},j.origin=[i[0],i[3]],a.Proj.CRS.prototype.initialize.call(this,h,j)):(f=b,g=c,i=d,j=e||{},j.origin=[i[0],i[3]],a.Proj.CRS.prototype.initialize.call(this,f,g,j)),this.projectedBounds=i,this._sizes=this._calculateSizes()},_calculateSizes:function(){var d,e,f,g,b=[],c=this.projectedBounds;for(e=this._scales.length-1;e>=0;e--)this._scales[e]&&(d=this.options.tileSize/this._scales[e],f=Math.ceil(parseFloat((c[2]-c[0])/d).toPrecision(3))*d*this._scales[e],g=Math.ceil(parseFloat((c[3]-c[1])/d).toPrecision(3))*d*this._scales[e],b[e]=a.point(f,g));return b},getSize:function(a){return this._sizes[a]}}),a.Proj.TileLayer={},a.Proj.TileLayer.TMS=a.TileLayer.extend({options:{continuousWorld:!0},initialize:function(b,c,d){var f,g,h,i,e=!0;if(!(c instanceof a.Proj.CRS.TMS))throw"CRS is not L.Proj.CRS.TMS.";for(a.TileLayer.prototype.initialize.call(this,b,d),this.options.tms=!1,this.crs=c,h=this.crs.projectedBounds,i=this.options.minZoom;i<this.options.maxZoom&&e;i++){var j=(h[3]-h[1])/this._projectedTileSize(i);e=Math.abs(j-Math.round(j))>.001}if(!e){for(f={},i=this.options.minZoom;i<this.options.maxZoom;i++)g=h[1]+Math.ceil((h[3]-h[1])/this._projectedTileSize(i))*this._projectedTileSize(i),f[this.crs.scale(i)]=new a.Transformation(1,-h[0],-1,g);this.crs=new a.Proj.CRS.TMS(this.crs.projection._proj,h,this.crs.options),this.crs.transformation=new a.Proj.ScaleDependantTransformation(f)}},getTileUrl:function(b){var c=this._map.getZoom(),d=Math.ceil((this.crs.projectedBounds[3]-this.crs.projectedBounds[1])/this._projectedTileSize(c));return a.Util.template(this._url,a.Util.extend({s:this._getSubdomain(b),z:this._getZoomForUrl(),x:b.x,y:d-b.y-1},this.options))},_projectedTileSize:function(a){return this.options.tileSize/this.crs.scale(a)}}),a.Proj.GeoJSON=a.GeoJSON.extend({initialize:function(b,c){this._callLevel=0,a.GeoJSON.prototype.initialize.call(this,null,c),b&&this.addData(b)},addData:function(b){var c;b&&(b.crs&&"name"===b.crs.type?c=new a.Proj.CRS(b.crs.properties.name):b.crs&&b.crs.type&&(c=new a.Proj.CRS(b.crs.type+":"+b.crs.properties.code)),void 0!==c&&(this.options.coordsToLatLng=function(b){var d=a.point(b[0],b[1]);return c.projection.unproject(d)})),this._callLevel++;try{a.GeoJSON.prototype.addData.call(this,b)}finally{this._callLevel--,0===this._callLevel&&delete this.options.coordsToLatLng}}}),a.Proj.geoJson=function(b,c){return new a.Proj.GeoJSON(b,c)},a.Proj.ImageOverlay=a.ImageOverlay.extend({initialize:function(b,c,d){a.ImageOverlay.prototype.initialize.call(this,b,null,d),this._projBounds=c},_animateZoom:function(b){var c=a.point(this._projBounds.min.x,this._projBounds.max.y),d=a.point(this._projBounds.max.x,this._projBounds.min.y),e=this._projectedToNewLayerPoint(c,b.zoom,b.center),f=this._projectedToNewLayerPoint(d,b.zoom,b.center).subtract(e),g=e.add(f._multiplyBy((1-1/b.scale)/2));this._image.style[a.DomUtil.TRANSFORM]=a.DomUtil.getTranslateString(g)+" scale("+this._map.getZoomScale(b.zoom)+") "},_reset:function(){var b=this._map.getZoom(),c=this._map.getPixelOrigin(),d=a.bounds(this._transform(this._projBounds.min,b)._subtract(c),this._transform(this._projBounds.max,b)._subtract(c)),e=d.getSize(),f=this._image;a.DomUtil.setPosition(f,d.min),f.style.width=e.x+"px",f.style.height=e.y+"px"},_projectedToNewLayerPoint:function(a,b,c){var d=this._map._getNewTopLeftPoint(c,b).add(this._map._getMapPanePos());return this._transform(a,b)._subtract(d)},_transform:function(a,b){var c=this._map.options.crs,d=c.transformation,e=c.scale(b);return d.transform(a,e)}}),a.Proj.imageOverlay=function(b,c,d){return new a.Proj.ImageOverlay(b,c,d)},"undefined"!=typeof a.CRS&&(a.CRS.proj4js=function(){return function(b,c,d,e){return e=e||{},d&&(e.transformation=d),new a.Proj.CRS(b,c,e)}}()),a.Proj});