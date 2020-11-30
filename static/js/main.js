$(document).ready(function() {

	$(function() {
        $( window ).resize(function() {
            if($(window).width() > 990 && $(".container").first().height()<$(window).height()) {
                $(".container").addClass("center");
            }
            else {
               $(".container").removeClass("center");
           }
       });

        var locale = $(location).attr('href').split('/').pop();
        //locale = 'ru';
        console.log(locale);

        $.ajax({
            url: 'https://alshuriga.pythonanywhere.com/req?id=' + locale,
            type: 'GET',
            dataType: 'json',
            success: function(data, status, xhr)
            {

                var root = 'https://alshuriga.pythonanywhere.com/static/books/';
                var pointer = 0;

                for (i = 0; i < data.length; i++) {
                    $(".book-list-section").append('<button id="' + i + '"class="bookname button w-100">'+ data[i].name + '</button>');
                    $(data[i].name).preload();
                }
                filter(data, pointer);
                navCheck(pointer, data);
                setTitles(data);
                $('.bookname').first().addClass("active");
                set_image(data[$('.active').first().attr('id')].cover);
                $('#bookname').text(data[$('.active').first().attr('id')].name);
                $('.book-controls a:first').attr('href', root + locale + '/'+ data[$('.active').first().attr('id')].group + '/' + data[$('.active').first().attr('id')].filename);
                $(".ziplink").attr('href', root + 'destiny_lore_ebooks_' + locale + '.zip');
                $('.bookname').mouseenter ( function() {

                    updateInfo(data,$(this).attr('id'), root);
                });

                $('.bookname').mouseleave (function () {
                    var id = $('.active').first().attr('id');
                    updateInfo(data, id, root);
                });

                $('.bookname').click( function() {
                    $('.bookname').removeClass("active");
                    $(this).addClass("active");
                })
                ;

                $('.list-section-item').click(function() {
                    $('.list-section-item').removeClass('active-group');
                    $(this).addClass('active-group');
                    pointer = 0;
                    filter(data, pointer);
                    navCheck(pointer, data);
                    $('.bookname').removeClass("active");''
                    $('.bookname:visible').first().addClass("active");
                    var id = $('.bookname:visible').first().attr('id');
                    updateInfo(data, id, root);

                });

                $('.down').click(function() {

                    pointer+=7;
                    filter(data, pointer);
                    navCheck(pointer, data);

                });


                $('.up').click(function() {

                    pointer-=7;
                    filter(data, pointer);
                    navCheck(pointer, data);
                });




            },

            error: function(xhr, status, error)
            {

            }
        });



    });


});



function filter(data, a) {
    var currentGroup = $(".active-group").children().first().attr("id");
    var array = [];
    var pointer = 0;
    $(".bookname").hide();
    $(".bookname").each(function(){
        if (data[$(this).attr("id")].group == currentGroup) {
          pointer++;
          if(pointer<=a+7 && pointer>a ) {
              $(this).show();
          }
      }
  });
}

function numberOfBooks(data) {

  var currentGroup = $(".active-group").children().first().attr("id");
  var number = 0;
  $(".bookname").each(function(){
    if (data[$(this).attr("id")].group == currentGroup) {
      number++;
  }
});
  return number;
}


function set_image(image) {
	//$(".parent").append('<img id = "img" src = "' + image + '" >');
	$(".book-logo").prepend('<img id = "cover-img" src="' + image + '" alt="" width="298px">');
}




function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
        // Alternatively you could use:
        // (new Image()).src = this;
    });
}

function navCheck(pointer, data) {
    $('.down').removeClass("inactive-scroll");
    $('.up').removeClass("inactive-scroll");
    if(pointer+7>=numberOfBooks(data)) {
        $('.down').addClass("inactive-scroll");
    }
    else if (pointer <= 0){
       $('.up').addClass("inactive-scroll");
   }
}

function updateInfo(data, i, dir, root) {
    $('#cover-img').replaceWith('<img id = "cover-img" src="' + data[i].cover + '" alt="" width="298px">');
    $('#bookname').text(data[i].name);
    $('.book-controls a:first').attr('href',dir  + locale + '/' + data[i].group + '/' + data[i].filename);
}

$.fn.preload = function() {
    this.each(function(){
        $('<img/>')[0].src = this;
    });
}

function getGroup(data, id) {
    for (i = 0; i < data.length; i++) {
        if (data[i].group == id) {
            return data[i].groupname;
        }

    }
    return false;
}


function setTitles(data) {
    $(".list-section").find("img").each(function() {
        console.log(getGroup(data, $(this).attr("id")));
        $(this).parent().attr("title", getGroup(data,$(this).attr("id")));
    });

}
// Usage:


