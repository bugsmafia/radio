function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
	document.addEventListener("backbutton", onBackKeyDown, false);
}


function onBackKeyDown() {
	$my_media.stop();
	ons.notification.confirm('Закрыть радио?').then(
		function(answer) {
		  if (answer === 1) {
				console.log('закрывается');
		  }
		}
	);
}
function onPause() {
	
}

function onResume() {

} 

function modals(name) {
	switch (name) {
		case "config":
			document.querySelector("#Modal_Config").toggle();
		break;
		case "about":
			document.querySelector("#Modal_About").toggle();
		break;
		case "share":
			document.querySelector("#Modal_Share").toggle();
		break;
	};
} 


var streamChanel = "http://plau.radio13.ru/aac";

// Тянем информацию об альбоме
function infoAlbum(type, id, md, artist, song) {
	var api = '88571316d4e244f24172ea9a9bf602fe';
	jQuery.ajax({
		url: "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=" + artist + "&album=" + song + "&api_key=" + api,
		type: "GET",
		dataType: "xml",
		success: function(xml) {
			jQuery(xml).find('album').each(function() {
				jQuery(this).find('image').each(function() {
					var img = jQuery(this).attr('size');
					if (img == "small") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'S', $himg);
						}
					};
					if (img == "medium") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'M', $himg);
						}
					};
					if (img == "large") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							jQuery('#' + type + ' #' + id + ' img').attr('src', jQuery(this).text());
							jQuery('#' + type + ' #' + id + ' .alb').css('background-image', 'url(' + $himg + ')');
							localStorage.setItem(md+'L', $himg);
						} else {
							infoArtist(type, id, md, artist, song);
						}
					};
					if (img == "extralarge") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'E', $himg);
						}
					}
					if (img == "mega") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'M', $himg);
						}
					}
				})
			});
		},
		statusCode: {
			400: function() {
				infoArtist(type, id, md, artist, song);
			}
		}
	});
}
// Тянем информацию об артисте
function infoArtist(type, id, md, artist, song) {
	var api = '88571316d4e244f24172ea9a9bf602fe';
	jQuery.ajax({
		url: "http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=" + artist + "&api_key=" + api,
		type: "GET",
		dataType: "xml",
		success: function(xml) {
			jQuery(xml).find('artist').each(function() {
				jQuery(this).find('image').each(function() {
					var img = jQuery(this).attr('size');
					if (img == "small") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'S', $himg);
						}
					};
					if (img == "medium") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'M', $himg);
						}
					};
					if (img == "large") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							jQuery('#' + type + ' #' + id + ' img').attr('src', jQuery(this).text());
							jQuery('#' + type + ' #' + id + ' .alb').css('background-image', 'url(' + $himg + ')');
							localStorage.setItem(md+'L', $himg);
						} else {
							infoArtist(type, id, md, artist, song);
						}
					};
					if (img == "extralarge") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'E', $himg);
						}
					}
					if (img == "mega") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'M', $himg);
						}
					}
				})
			});
		},
		statusCode: {
			400: function() {}
		}
	});
}

// Загружаем статус эфира
function LoadStatus() {
	jQuery.getJSON("http://app.radio13.ru/status/json.php?i=i", function(data) {
		UpdateStatus(data.i);
	});
}
// Обновляем статус эфира
function UpdateStatus(now) {
	if (localStorage.TrackIdNow == now) {} else {
		jQuery.getJSON("http://app.radio13.ru/status/json.php?i=l", function(data) {
			setTimeout(function() {
				jQuery("#playinfo").addClass("show");
				// название трека
				jQuery('.songinfo').text(data.s);
				jQuery('.song').text(data.s);
				// артист
				jQuery('.titleinfo').text(data.a);
				jQuery('.artist').text(data.a);
				// Обновляет куки
				localStorage.setItem('NowSong', data.s);
				localStorage.setItem('NowArtist', data.a);
				statusBar();
			}, 2000);
			localStorage.setItem('TrackIdNow', data.id);
			infoAlbum('playinfo', 'playinfoimg', 'TrackIdNowImg', data.a, data.s);
		});
	}
}

var Playing = false;
function statusBar(){
	if(streamer == "1"){
		Playing = false;
	} else {
		Playing = true;
	};
	MusicControls.create({
		track: localStorage.NowSong,
		artist: localStorage.NowArtist,
		cover: localStorage.TrackIdNowImgE,
		isPlaying: Playing,
		
		dismissable : true,
		hasPrev: false,
		hasNext: false,
		hasClose: false, 
		ticker: 'Now playing "Time is Running Out"'
	}, onSuccess, onError);
}

var onSuccess = function(result) {
	cancelled (result.completed=false)
}
var onError = function(msg) {}
function ShareTrack() {
	modals('share');
	var ShareData = {
		message: 'На "Радио13" сейчас играет: '+localStorage.NowSong+' '+localStorage.NowArtist,
		subject: 'Мне нравится!',
		files: [localStorage.TrackIdNowImgM],
		url: 'https://radio13.ru',
		chooserTitle: 'Поделись треком!'
	}
	var onSuccess = function(result) {
	  modals('share');
	}

	var onError = function(msg) {
	  console.log("Sharing failed with message: " + msg);
	}
	
	window.plugins.socialsharing.shareWithOptions(ShareData, onSuccess, onError);
}


// Устанавливаем первоначальное значение куки о треке
localStorage.setItem('TrackIdNow', '');
LoadStatus();
setInterval(function(){
	LoadStatus();
	$('#trace').html(window.location.pathname+' '+localStorage.TrackIdNow);
	
	checkConnection();
}, 15000);



	
	var volume = 100;
	jQuery("#volume").val(volume);
	jQuery("#volume").on('input', function () {
		var volume = jQuery("#volume").val();
		volume = volume / 100;
		player.Volume(volume);
	});
	
	
	var streamer = 1;
	var OneclickPlay = 1;
	function streamplay() {
		OneclickPlay = 2;
		
		if (streamer == "1") {
			$my_media.play();
		} else if (streamer == "2") {
			$my_media.stop();
		} else if (streamer == "3") {
			$my_media.stop();
		} else if (streamer == "4") {
			$my_media.play();
		};
	}
    
	
	LoadStream();
	function LoadStream() {
		setTimeout(function() {
			$my_media = new PlayStream(localStorage.streamChanel, function (status){
					console.log("status - "+status);
					if(status === PlayStream.MEDIA_STOPPED){
						console.log('stopped');
						MusicControls.updateIsPlaying(false);
						streamer = 1;
						$('#play i').attr('class', 'zmdi zmdi-play');
						$('#play').removeClass('active');
					}
					if(status === PlayStream.MEDIA_STARTING){
						console.log('starting');
						MusicControls.updateIsPlaying(true);
						streamer = 2;
						$('#play i').attr('class', 'zmdi zmdi-play');
						$('#play').addClass('active');
					}
					if(status === PlayStream.MEDIA_RUNNING){
						console.log('running');
						MusicControls.updateIsPlaying(true);
						streamer = 3;
						$('#play i').attr('class', 'zmdi zmdi-stop');
						$('#play').addClass('active');
					}
				}, 
				function (err) {
					alert(err);
				} 
			);
			var callmemabe = '1';
			PhoneCallTrap.onCall(function(state) {
				
				console.log("CHANGE STATE: " + state+" "+callmemabe);
				switch (state) {
					case "RINGING":
						console.log("Звонят");
						if (streamer == "2") {
							$('#play i').attr('class', 'zmdi zmdi-play');
							$('#play').removeClass('active');
							$my_media.stop();
						} else if (streamer == "3") {

							$('#play i').attr('class', 'zmdi zmdi-play');
							$('#play').removeClass('active');
							$my_media.stop();
						}
						callmemabe = '2';

						break;
					case "OFFHOOK":
						console.log("Phone is off-hook");
						 if (streamer == "2") {
							$('#play i').attr('class', 'zmdi zmdi-play');
							$('#play').removeClass('active');
							$my_media.stop();
						} else if (streamer == "3") {

							$('#play i').attr('class', 'zmdi zmdi-play');
							$('#play').removeClass('active');
							$my_media.stop();
						}
						callmemabe = '2';
						break;

					case "IDLE":
						console.log("Телефон свободен: "+streamer+ " "+callmemabe+ " "+OneclickPlay);
						if (streamer == "1" && callmemabe == '2' && OneclickPlay == "2") {
							console.log("Восстанавливаем стрим через 3 секунды");
							setTimeout(function() {
								console.log("Восстанавливаем стрим");
								$('#play i').attr('class', 'zmdi zmdi-play');
								$('#play').addClass('active');
								$my_media.play();
							}, 3000);
						};
						break;
				}
			});
			$my_media.stop();
		}, 2000);
	}


// Sharing

ons.ready(function() {
function events(action) {
    switch(action) {
        case 'music-controls-next':
            console.log('Следующая');
            break;
        case 'music-controls-previous':
            console.log('Предыдущая');
            break;
        case 'music-controls-pause':
            console.log('Пауза');
			$my_media.stop();
            break;
        case 'music-controls-play':
            console.log('Плей');
			$my_media.play();
            break;
        case 'music-controls-destroy':
            console.log('Удалено');
			$my_media.stop();
            break;

        // Headset events (Android only)
        case 'music-controls-media-button' :
            console.log('music-controls-media-button');
            break;
        case 'music-controls-headset-unplugged':
            console.log('unplugged');
            break;
        case 'music-controls-headset-plugged':
            console.log('plugged');
            break;
        default:
            break;
    }
} 
MusicControls.subscribe(events);
MusicControls.listen();

}); 
$( document ).ready(function() {
	
$('.page__background').html('<div class="bg"><div id="vcpolygonsurface_1444343625_661661291" data-theid="vcpolygonsurface_1444343625_661661291" data-mesh-ambient="#555555" data-mesh-diffuse="#ffffff" data-mesh-width="1.2" data-mesh-height="1.2" data-mesh-depth="20" data-mesh-segments="15" data-mesh-slices="8" data-mesh-xrange="0.3" data-mesh-yrange="0.3" data-mesh-speed="0.0002" data-light-autopilot="true" data-light-ambient="#0060dd" data-light-diffuse="#ff0044" data-light-count="1" data-light-zoffset="200" data-light-speed="0.0010" class="vc-polygonsurface-background" style="display:none;"></div></div>');
	$(function () {
    'use strict';
    jQuery(function ($) {
        $.fn.vcPolygonSurface = function (Options, Callback) {
            var CreateElement = $(this);
            var ElementId = CreateElement.attr("id");
            var parentRow = getParentRow(CreateElement);
            parentRow.css("position", "relative");
            var Element = parentRow.prepend('<div id="' + ElementId + '" class="vc-polygonsurface-background-bg"><div id="' + ElementId + '-output"></div></div>');

            // Mesh Properties
            var MESH = {
                width: (CreateElement.attr("data-mesh-width") ? CreateElement.attr("data-mesh-width") : '1.2'),
                height: (CreateElement.attr("data-mesh-height") ? CreateElement.attr("data-mesh-height") : '1.2'),
                depth: (CreateElement.attr("data-mesh-depth") ? CreateElement.attr("data-mesh-depth") : '20'),
                segments: (CreateElement.attr("data-mesh-segments") ? CreateElement.attr("data-mesh-segments") : '15'),
                slices: (CreateElement.attr("data-mesh-slices") ? CreateElement.attr("data-mesh-slices") : '8'),
                xRange: (CreateElement.attr("data-mesh-xrange") ? CreateElement.attr("data-mesh-xrange") : '0.3'),
                yRange: (CreateElement.attr("data-mesh-yrange") ? CreateElement.attr("data-mesh-yrange") : '0.3'),
                zRange: 1.0,
                ambient: (CreateElement.attr("data-mesh-ambient") ? CreateElement.attr("data-mesh-ambient") : '#555555'),
                diffuse: (CreateElement.attr("data-mesh-diffuse") ? CreateElement.attr("data-mesh-diffuse") : '#FFFFFF'),
                speed: (CreateElement.attr("data-mesh-speed") ? CreateElement.attr("data-mesh-speed") : '0.0002')
            };
            // Light Properties
            var LIGHT = {
                count: (CreateElement.attr("data-light-count") ? CreateElement.attr("data-light-count") : '2'),
                xyScalar: 1,
                zOffset: (CreateElement.attr("data-light-zoffset") ? CreateElement.attr("data-light-zoffset") : '200'),
                ambient: (CreateElement.attr("data-light-ambient") ? CreateElement.attr("data-light-ambient") : '#880066'),
                diffuse: (CreateElement.attr("data-light-diffuse") ? CreateElement.attr("data-light-diffuse") : '#FF8800'),
                speed: (CreateElement.attr("data-light-speed") ? CreateElement.attr("data-light-speed") : '0.0010'),
                gravity: 500,
                dampening: 0.95,
                minLimit: 10,
                maxLimit: null,
                minDistance: 20,
                maxDistance: 400,
                autopilot: (CreateElement.attr("data-light-autopilot") == "true"),
                draw: false,
                bounds: FSS.Vector3.create(),
                step: FSS.Vector3.create(
                    Math.randomInRange(0.2, 1.0),
                    Math.randomInRange(0.2, 1.0),
                    Math.randomInRange(0.2, 1.0)
                )
            };
            // Render Properties
            var RENDER = {
                renderer: 'canvas'
            };
            // Global Properties
            var now, start = Date.now();
            var center = FSS.Vector3.create();
            var attractor = FSS.Vector3.create();
            var container = document.getElementById(ElementId);
            var output = document.getElementById(ElementId + '-output');
            var renderer, scene, mesh, geometry, material;
            var canvasRenderer;
            var gui, autopilotController;
            // Methods
            function initialise() {
                createRenderer();
                createScene();
                createMesh();
                createLights();
                addEventListeners();
                resize(container.offsetWidth, container.offsetHeight);
                animate();
            }
            function createRenderer() {
                canvasRenderer = new FSS.CanvasRenderer();
                setRenderer(RENDER.renderer);
            }
            function setRenderer(index) {
                if (renderer) {
                    output.removeChild(renderer.element);
                }
                renderer = canvasRenderer;
                renderer.setSize(container.offsetWidth, container.offsetHeight);
                output.appendChild(renderer.element);
            }
            function createScene() {
                scene = new FSS.Scene();
            }
            function createMesh() {
                scene.remove(mesh);
                renderer.clear();
                geometry = new FSS.Plane(MESH.width * renderer.width, MESH.height * renderer.height, MESH.segments, MESH.slices);
                material = new FSS.Material(MESH.ambient, MESH.diffuse);
                mesh = new FSS.Mesh(geometry, material);
                scene.add(mesh);
                // Augment vertices for animation

                var v, vertex;

                for (v = geometry.vertices.length - 1; v >= 0; v--) {

                    vertex = geometry.vertices[v];

                    vertex.anchor = FSS.Vector3.clone(vertex.position);

                    vertex.step = FSS.Vector3.create(

                        Math.randomInRange(0.2, 1.0),

                        Math.randomInRange(0.2, 1.0),

                        Math.randomInRange(0.2, 1.0)

                    );

                    vertex.time = Math.randomInRange(0, Math.PIM2);

                }

            }



            function createLights() {

                var l, light;

                for (l = scene.lights.length - 1; l >= 0; l--) {

                    light = scene.lights[l];

                    scene.remove(light);

                }

                renderer.clear();

                for (l = 0; l < LIGHT.count; l++) {
                    light = new FSS.Light(LIGHT.ambient, LIGHT.diffuse);
                    light.ambientHex = light.ambient.format();
                    light.diffuseHex = light.diffuse.format();
                    scene.add(light);
                    light.mass = Math.randomInRange(0.5, 1);
                    light.velocity = FSS.Vector3.create();
                    light.acceleration = FSS.Vector3.create();
                    light.force = FSS.Vector3.create();



                    // Ring SVG Circle

                    light.ring = document.createElementNS(FSS.SVGNS, 'circle');

                    light.ring.setAttributeNS(null, 'stroke', light.ambientHex);

                    light.ring.setAttributeNS(null, 'stroke-width', '0.5');

                    light.ring.setAttributeNS(null, 'fill', 'none');

                    light.ring.setAttributeNS(null, 'r', '10');



                    // Core SVG Circle

                    light.core = document.createElementNS(FSS.SVGNS, 'circle');

                    light.core.setAttributeNS(null, 'fill', light.diffuseHex);

                    light.core.setAttributeNS(null, 'r', '4');

                }

            }



            function resize(width, height) {

                renderer.setSize(width, height);

                FSS.Vector3.set(center, renderer.halfWidth, renderer.halfHeight);

                createMesh();

            }



            function animate() {

                now = Date.now() - start;

                update();

                render();

                requestAnimationFrame(animate);

            }



            function update() {

                var ox, oy, oz, l, light, v, vertex, offset = MESH.depth / 2;



                // Update Bounds

                FSS.Vector3.copy(LIGHT.bounds, center);

                FSS.Vector3.multiplyScalar(LIGHT.bounds, LIGHT.xyScalar);



                // Update Attractor

                FSS.Vector3.setZ(attractor, LIGHT.zOffset);



                // Overwrite the Attractor position

                if (LIGHT.autopilot) {

                    ox = Math.sin(LIGHT.step[0] * now * LIGHT.speed);

                    oy = Math.cos(LIGHT.step[1] * now * LIGHT.speed);

                    FSS.Vector3.set(attractor,

                        LIGHT.bounds[0] * ox,

                        LIGHT.bounds[1] * oy,

                        LIGHT.zOffset);

                }



                // Animate Lights

                for (l = scene.lights.length - 1; l >= 0; l--) {

                    light = scene.lights[l];



                    // Reset the z position of the light

                    FSS.Vector3.setZ(light.position, LIGHT.zOffset);



                    // Calculate the force Luke!

                    var D = Math.clamp(FSS.Vector3.distanceSquared(light.position, attractor), LIGHT.minDistance, LIGHT.maxDistance);

                    var F = LIGHT.gravity * light.mass / D;

                    FSS.Vector3.subtractVectors(light.force, attractor, light.position);

                    FSS.Vector3.normalise(light.force);

                    FSS.Vector3.multiplyScalar(light.force, F);



                    // Update the light position

                    FSS.Vector3.set(light.acceleration);

                    FSS.Vector3.add(light.acceleration, light.force);

                    FSS.Vector3.add(light.velocity, light.acceleration);

                    FSS.Vector3.multiplyScalar(light.velocity, LIGHT.dampening);

                    FSS.Vector3.limit(light.velocity, LIGHT.minLimit, LIGHT.maxLimit);

                    FSS.Vector3.add(light.position, light.velocity);

                }



                // Animate Vertices

                for (v = geometry.vertices.length - 1; v >= 0; v--) {

                    vertex = geometry.vertices[v];

                    ox = Math.sin(vertex.time + vertex.step[0] * now * MESH.speed);

                    oy = Math.cos(vertex.time + vertex.step[1] * now * MESH.speed);

                    oz = Math.sin(vertex.time + vertex.step[2] * now * MESH.speed);

                    FSS.Vector3.set(vertex.position,

                        MESH.xRange * geometry.segmentWidth * ox,

                        MESH.yRange * geometry.sliceHeight * oy,

                        MESH.zRange * offset * oz - offset);

                    FSS.Vector3.add(vertex.position, vertex.anchor);

                }
                geometry.dirty = true;

            }



            function render() {

                renderer.render(scene);



                // Draw Lights

                if (LIGHT.draw) {

                    var l, lx, ly, light;

                    for (l = scene.lights.length - 1; l >= 0; l--) {

                        light = scene.lights[l];

                        lx = light.position[0];

                        ly = light.position[1];

                        renderer.context.lineWidth = 0.5;
                        renderer.context.beginPath();
                        renderer.context.arc(lx, ly, 10, 0, Math.PIM2);
                        renderer.context.strokeStyle = light.ambientHex;
                        renderer.context.stroke();
                        renderer.context.beginPath();
                        renderer.context.arc(lx, ly, 4, 0, Math.PIM2);
                        renderer.context.fillStyle = light.diffuseHex;
                        renderer.context.fill();
                    }
                }
            }

            function addEventListeners() {

                window.addEventListener('resize', onWindowResize);

                //container.addEventListener('mousemove', onMouseMove);

            }
            function onMouseMove(event) {

                FSS.Vector3.set(attractor, event.x, renderer.height - event.y);

                FSS.Vector3.subtract(attractor, center);

            }
            function onWindowResize(event) {

                resize(container.offsetWidth, container.offsetHeight);

                render();

            }
            initialise();
            CreateElement.remove();
            function getParentRow(Element) {
                return Element.parent().eq(0);
            }

        }
        $(".vc-polygonsurface-background")
            .each(function () {
                $(this).vcPolygonSurface();
            });
    });

    $(window)
        .resize(Resize);

    function Resize() {
        $(".bg")
            .height($(window)
                .height());
        $(".startmessage ")
            .css("padding-top", ($(window)
                .height() / 2 - 200) + "px");
    }

    Resize();


});