var locale = 'en';
$(document).ready(function() {
    $(function() {
        $( window ).resize(function() {
           centerApp();
       });

        $.ajax({
            url: 'https://www.destinylib.xyz/get_locale',
            type: 'GET',
            dataType: 'json',
            success: function(data, status, xhr)
            {

                locale = data.locale;

                console.log(data);
                if (locale == "") {
                    locale = 'en';
                }


                main(locale);

                $('.dropdown-content').children().click( function() {

                    locale = $(this).attr('locale');
                    main(locale);

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
        if (data[$(this).attr("id")].group_id == currentGroup) {
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
        if (data[$(this).attr("id")].group_id == currentGroup) {
          number++;
      }
  });
    return number;
}


function set_image(image) {
    if ($(".book-logo").children().length){
        $(".book-logo").children().first().attr('src', image);
    }
    else {
        $(".book-logo").append('<img id = "cover-img" src="' + image + '" alt="" width="298px">');

    }

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
    $('#bookname').text(data[i].name.replace('[ap]',"'").replace('[dot]',".").replace("[dd]",":"));
    $('.book-controls a:first').attr('href',dir  + locale + '/' + data[i].group + '/' + data[i].filename);

    if($("#bookname").height() > 21) {
        console.log($("#bookname").height()>21)
        $(".book-controls").css("margin-top",'70px');
    }
    else {
     $(".book-controls").css("margin-top",'90px');
 }
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
        $(this).parent().attr("title", getGroup(data,$(this).attr("id")));
    });

}

function centerApp() {
    if($(window).width() > 990 && $(".container").first().height()<$(window).height()) {
        $(".container").addClass("center");
    }
    else {
        $(".container").removeClass("center");
    }
}


function translate(locale) { 

    if (locale != 'ru') {
        $('#desc span:first').text("DESTINY LORE IN E-BOOK FORMAT");
        $('#language').text("../LANGUAGE: ");
        $('.ziplink').first().text("DOWNLOAD ALL (*.ZIP)");
        $('#dontext').text("WANNA SUPPORT DESTINYLIB?");
        $('#donate').text("DONATE <3");
    }
    else {
        $('#desc span:first').text("лор destiny в e-book формате");
        $('#language').text("../язык: ");
        $('.ziplink').first().text("СКАЧАТЬ ВСЕ КНИГИ (ZIP-АРХИВ)");
        $('#dontext').text("Хочешь поддержать destinylib? ");
        $('#donate').text("ДОНАТ <3");
    }
    
}

function loadlist(data) {

    for (i = 0; i < data.length; i++) {
        var str = data[i].name.replace('[ap]',"'").replace('[dot]',".").replace("[dd]",":");
        if (str.length > 30) {
         str = str.slice(0, 27) + '...';           
     }
     $(".book-list-section").append('<button id="' + i + '"class="bookname button w-100">'+ str + '</button>');
     $(data[i].name).preload();
 }
}


function main(locale) {
    $.ajax({
        url: 'https://www.destinylib.xyz/req?id=' + locale,
        type: 'GET',
        dataType: 'json',
        success: function(data, status, xhr)
        {
            $(".bookname").remove();
            var root = 'https://www.destinylib.xyz/static/books/';
            var pointer = 0;
            loadlist(data);
            filter(data, pointer);
            navCheck(pointer, data);
            setTitles(data);
            centerApp();
            translate(locale);
            $('#ddlang').text(locale);
            $('.list-section-item').removeClass('active-group');
            $('.list-section-item').first().addClass("active-group");
            $('.bookname').first().addClass("active");

            set_image(data[$('.active').first().attr('id')].cover);
            $('#bookname').text(data[$('.active').first().attr('id')].name);
            $('.book-controls a:first').attr('href', root + locale + '/'+ data[$('.active').first().attr('id')].group + '/' + data[$('.active').first().attr('id')].filename);
            $(".ziplink").attr('href', root + 'zip/destinylib_books_' + locale + '.zip');
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
                if($(window).width() < 990) {
                    $('html, body').animate({
                        scrollTop: $(".book-info").first().offset().top
                    }, 500);
                }
            });

            $(".dropbtn").click( function() {
                $(".dropdown-content").show();

            });

            $(".dropbtn").mouseenter( function() {
                $(".dropdown-content").show();

            });

            $(".dropdown-content").click ( function() {
                    $(".dropdown-content").hide();

            });



          

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

console.log('done');


},

error: function(xhr, status, error)
{

}



});
}