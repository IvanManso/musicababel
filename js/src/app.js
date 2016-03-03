var idPlay = $(".item.meta.image").data("songid");
var arrayId = new Array();
var indexArray = 0;
$(document).ready(function() { //Cuando la página se ha cargado por completo

    console.log("Document ready");

    // Funcionalidad tipo SPA
    function showLoading() {
    	console.log("Lanzamos capa loading para evitar problemas con el servidor");
    	$(".loading").removeClass("hidden");
    }

    function showIndex() {
        console.log("Pintamos el listado de items guardados en la db");
        $(".loading").addClass("hidden");
        $("#addItemButton").removeClass("hidden");
        $("#cancelItemButton").addClass("hidden");
        $("form").addClass("hidden");
        $("main").removeClass("hidden");
        reloadItems();
    }

    function showForm() {
        console.log("Pintamos el formulario");
        $(".loading").addClass("hidden");
        $("#addItemButton").addClass("hidden");
        $("#cancelItemButton").removeClass("hidden");
        $("form").trigger("reset");
        $("form").removeClass("hidden");
        $("main").addClass("hidden");
        $("#song").focus(); //ponemos el foco en el primer input
    }

    $("#addItemButton").on("click", function() {
        console.log("Click en añadir, mostramos formulario");
        showForm();
    });

    $("#cancelItemButton").on("click", function() {
        console.log("Click en cancelar, mostramos lista");
        showIndex();
    });

    // Funcionalidad del formulario
    $("form").on("submit", function() { //cuando se intente enviar
    	showLoading();
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
        console.log("Antes de entrar en la condición", $("#idElem").val());
        if ($("#idElem").val()) {
            console.log("Petición de edición iniciada");
            $.ajax({ //preparación de la petición de añadir canción
                method: 'put',
                url: "/api/playlist/" + ($("#idElem").val()),
                data: JSON.stringify({
                    artist: $("#artist").val(),
                    url_image: $("#image").val(),
                    url_audio: $("#audio").val(),
                    title: $("#song").val()
                }),
                contentType: 'application/json',
                success: function(data) {
                    showIndex();
                    alert("Guardado con éxito");
                },
                error: function() {
                    showIndex();
                    alert("Se ha producido un error");
                }
            });

        } else {
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
                    showIndex();
                    alert("Guardado con éxito");
                },
                error: function() {
                	showIndex();
                    alert("Se ha producido un error");
                }
            });

        }
        return false;
    });

    // Pintar lista de items guardados en la db
    function reloadItems() {
        $.ajax({ //realizo una peticón ajax para mostrar en .audio.media.list los datos almacenados
           url: "/api/playlist/",
            success: function(data) {
                console.log("Cargando lista de items", data);
                var html = "";
                for (var i in data) {
                    var id = data[i].id;
                    var title = data[i].title;
                    var artist = data[i].artist;
                    var image = data[i].url_image;
                    var audio = data[i].url_audio;
                    html += "<tr>";
                    html += "<div  class=\"item meta cont\" data-songid=" + id + ">";
                    html += "<td>";
                    html += "<img src=\"" + image + "\" class=\"item meta image\" data-songid=" + id + "></img>";
                    html += "</td>";
                    html += "<td>";
                    html += "<div class=\"item meta title\" data-songid=" + id + ">";
                    html += "<h3>" + title + "</h3>";
                    html += "<h4>" + artist + "</h4>";
                    html += "</div>";
                    html += "</td>";
                    html += "<td>";
                    html += "</div>";
                    html += "<div class=\"item buttons\">";
                    html += "<button class=\"edit song button\" id=\"editItemButton\" data-songid=" + id + ">Editar</button>";
                    html += "<button class=\"delete song button\" id=\"deleteItemButton\" data-songid=" + id + ">Eliminar</button></div>";
                    html += "</div>";
                    html += "</td>";
                    html += "</tr>";
                    html += "<tr>";
                    html += "<audio controls><source src= \" " + audio + " \" type=audio/mpeg ></audio>";
                    html += "</tr>";
                }
                $(".audio.media.list").html(html); // innerHTML = html
            }
        });

    }

    // Eliminar item
    $(".audio.media.list").on("click", "#deleteItemButton", function() { //elimino la canción mediante el botón delete, cuando exista un botón dentro de .audio.media.list
        showLoading();
        console.log("Elimino la canción");
        var self = this;
        var id = $(self).data("songid");

        $.ajax({
            url: "/api/playlist/" + id,
            method: "delete",
            success: function() {
                $(self).parent().parent().parent().remove();
                showIndex();
            },
            error: function() {
                alert("Se ha producido un error al eliminar");
                showIndex();
            }
        });
    });

    $(".audio.media.list").on("click", "#editItemButton", function() { //elimino la canción mediante el botón delete, cuando exista un botón dentro de .audio.media.list
        console.log("Traigo los campos de la canción y pinto formulario");
        showForm();
        var self = this;
        var id = $(self).data("songid");

        $.ajax({
            method: "GET",
            url: "/api/playlist/" + id,
            success: function(data) {
                console.log("Los datos son: ", data);
                $("#artist").val(data.artist);
                $("#song").val(data.title);
                $("#audio").val(data.url_audio);
                $("#image").val(data.url_image);
                $("#idElem").val(id);
                console.log("El id es", id);
            },
            error: function() {
                alert("Se ha producido un error al editar");
            }
        });
        //si el id está vacío está creando, si el ID está creado está editando
    });

    function playItem(id) {

        $.ajax({
            method: "GET",
            url: "/api/playlist/" + id,
            success: function(data) {
                console.log("Los datos son: ", data);
                $("audio").attr("src", data.url_audio);
                $("audio").attr("id", data.id)
                console.log("El titulo y autor es", data.title, data.artist);
                $(".item.title.footer").html(data.title);
                $(".item.author.footer").html(data.artist);
                $(".item.meta.image").data("songid", data.id);

            },
            error: function() {
                alert("Se ha producido un error al intentar añadir al reproductor");
            }

        });
    }

    $("body").on("click", ".item.meta.title", function() { //añade al reproductor la canción seleccionada
        console.log("Voy a añadir una canción al reproductor");
        var self = this;
        var id = $(self).data("songid"); //sólo coloca ese id en songid con el primer click
        playItem(id);

    });


    $(".item.output.audio").on("ended", function() { //controlamos cuando acaba la canción
         console.log("El idPlay antes de la asignación es", idPlay);
        console.log("La canción ha terminado");
        idPlay = $(".item.meta.image").data("songid");
        console.log("El idPlay después de la asignación es", idPlay);
        if(idPlay > 1){
            indexArray++;
            nextItem(idPlay);
            previousItem(idPlay);
        }
        else{
            nextItem(idPlay);
            previousItem(idPlay);
        }
    });


    function nextItem(idPlay) {
      //  $("#forwardItemButton").on("click", function() {
        console.log("Se va a reproducir la canción siguiente");
        console.log("El id de la canción que ha terminado es ", idPlay); //sigue sin actualizarse
             $.ajax({
            method: "GET",
            url: "/api/playlist/",
            success: function(data) {
                console.log("Los datos son ", data);
                for (var i in data) {
                    arrayId[i] = data[i].id;
                    i++;
                    if(arrayId[i] == idPlay){
                    indexArray = i;
                    }
                }
                    console.log("El indexArray y el arrayId es", indexArray, arrayId); //al comenzar por 2, i o indexArray están mal
                    console.log("La siguiente canción a reproducir es ", arrayId[indexArray+1]);
                    if(!(arrayId[indexArray+1])){
                        return false;
                    }
                    playItem(arrayId[indexArray+1]);

            },
            error: function() {
                alert("Se ha producido un error al forward");
            }
      //  });
        });
    }

    $("#forwardItemButton").click({idPlay}, nextItem);
    $("#backwardItemButton").click({idPlay}, nextItem);





    function previousItem(idPlay) {
        $("#backwardItemButton").on("click", function() {

        console.log("El idPlay es", idPlay);
        console.log("Se va a reproducir la canción siguiente");
        console.log("El id de la canción que ha terminado es ", idPlay);
             $.ajax({
            method: "GET",
            url: "/api/playlist/",
            success: function(data) {
                console.log("Los datos son ", data);
                for (var i in data) {
                    arrayId[i] = data[i].id;
                    i--;
                    if(arrayId[i] == idPlay){
                    arrayId[indexArray] = arrayId[i];
                    }
                }

                    console.log("El indexArray y el arrayId es", indexArray, arrayId);
                    console.log("La siguiente canción a reproducir es ", arrayId[indexArray-1]);
                    if(!(arrayId[indexArray-1])){
                        return false;
                    }
                    playItem(arrayId[indexArray-1]);

            },
            error: function() {
                alert("Se ha producido un error al hacer backward");
            }
        });
    });
    }

    showIndex();
    //showLoading();

});
