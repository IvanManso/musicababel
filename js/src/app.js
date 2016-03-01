$(document).ready(function() { //Cuando la página se ha cargado por completo

	console.log("Document ready");

	// Funcionalidad tipo SPA
	function showIndex() {
		console.log("Pintamos el listado de items guardados en la db"); 
		$(".loading").addClass( "hidden" );
		$("#addItemButton").removeClass( "hidden" );
		$("#cancelItemButton").addClass( "hidden" );		
		$("form").addClass( "hidden" );
		$("main").removeClass( "hidden" );
	}

	function showForm() {
		console.log("Pintamos el formulario");
		$(".loading").addClass( "hidden" );
		$("#addItemButton").addClass( "hidden" );
		$("#cancelItemButton").removeClass( "hidden" );		
		$("form").removeClass( "hidden" );
		$("main").addClass( "hidden" );
  		$("#artist").focus(); //ponemos el foco en el primer input
	}

	$("#addItemButton").on("click", function(){
		console.log("Click en añadir, mostramos formulario");
		showForm();
	});
	$("#cancelItemButton").on("click", function(){
		console.log("Click en cancelar, mostramos lista");
		showIndex();
	});

	// Funcionalidad del formulario
    $("form").on("submit", function() { //cuando se intente enviar
        
        var artist = $.trim($("#artist").val());
        var title = $.trim($("#song").val());

        if (artist == "") { //validación del artista
            alert("El artista no puede ser vacío");
            return false;
        }

        if (title == "") { //validación del título
            alert("El título no puede ser vacío");
            return false;
        }

        var url_audio = $.trim($("#audio").val());
        var url_image = $.trim($("#image").val());

        // RegEx para validar urls
        var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ig;

        if (url_audio == "" || pattern.test(url_audio) == false) { //validación de la url de la canción
            alert("La url del audio no es válida");
            return false;
        }

        if (url_image == "" && pattern.test(url_image) == false) { //validación de la url de la imagen
            alert("La url de la imagen no es válida");
            return false;
        }

        // Guardar item
        console.log("Petición de guardado iniciada");
        $.ajax({ //preparación de la petición de añadir canción
            method: 'post',
            url: "/api/playlist",
            data: JSON.stringify({
                artist: artist,
                url_image: url_image,
                url_audio: url_audio,
                title: title
            }),
            contentType: 'application/json',
            success: function() {
                alert("Guardado con éxito");
            },
            error: function() {
                alert("Se ha producido un error");
            }
        });

        return false;

    });

    // Pintar lista de items guardados en la db
    $.ajax({ //realizo una peticón ajax para mostrar en .audio.media.list los datos almacenados
        url: "/api/playlist/",
        success: function(data) {
            console.log("Lista de items", data);
            var html = "";
            for (var i in data) {
                var id = data[i].id;
                var title = data[i].title;
                var artist = data[i].artist;
                var image = data[i].url_image;
                var audio = data[i].url_audio;
                html += "<article>";
                html += "<li>";
                html += title;
                html += artist;
                html += "<img src=\"" + image + "\"></img>";
                console.log("La URL de la imagen es ", image);
                html += "<audio controls><source src= \" " + audio + " \" type=audio/mpeg ></audio>";
                html += "<button class=\"edit song button\" data-songid=" + id + ">Editar</button>";
                html += "<button class=\"delete song button\" data-songid=" + id + ">Eliminar</button>";
                html += "</li>";
                html += "</article>";
            }
            $(".audio.media.list").html(html); // innerHTML = html
        }
    });

    // Eliminar item
    $(".audio.media.list").on("click", ".delete.song.button", function() { //elimino la canción mediante el botón delete, cuando exista un botón dentro de .audio.media.list
        console.log("Elimino la serie");
        var self = this;
        var id = $(self).data("songid");

        $.ajax({
            url: "/api/playlist/" + id,
            method: "delete",
            success: function() {
                $(self).parent().parent().remove();
            }
        });

	});

	showIndex();

});


    /*
        $(".audio.media.list").on("click", ".edit.song.button", function(){ //elimino la canción mediante el botón delete, cuando exista un botón dentro de .audio.media.list
                console.log("Edito la serie");
                var self = this;
                var id = $(self).data("songid");

            $.ajax({
                        url: "/api/playlist/" + id,
                        method: "put",
                        success: function(){
                            $(self).parent().parent().edit();
                        }
                    });
    });
        */


/*

    $(".audio.media.list").on(".edit.song.button", "click", function(){
        var $li = $(this).closest("li");
        $li.find(".item.artist").val($li.find("input.artist").html());
        $li.find(".item.title").val($li.find("input.title").html());
    })
*/










//}
/*

        $("#reloadSeriesButton").on("click", reloadSeries);

        reloadSeries();

        $("#seriesList").on("click", "button", function(){
            console.log("Elimino la serie");
            var self = this;
            var id = $(self).data("serieid"); // cojo el valor del atributo data-serieid del botón

            $.ajax({
                url: "/api/series/" + id,
                method: "delete",
                success: function(){
                    $(self).parent().remove();
                }
            });

        });
});

*/
