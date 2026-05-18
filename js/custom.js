// Custom JS for the Sitio Do-Re-Mi site

// Toggle Header / Nav size on scroll
//-------------------------------------------------------------
$(document).on("scroll", function () {
  if ($(document).scrollTop() > 39) {
    $("header").removeClass("large").addClass("small");
  } else {
    $("header").removeClass("small").addClass("large");
  }
});


// Vehicles (rental options) Tabs / Slider
//-------------------------------------------------------------
$(".vehicle-data").hide();
var activeVehicleData = $(".vehicle-nav .active a").attr("href");
$(activeVehicleData).show();

$('.vehicle-nav-scroll').click(function () {
  var direction = $(this).data('direction');
  var scrollHeight = $('.vehicle-nav li').height() + 1;
  var navHeight = $('#vehicle-nav-container').height() + 1;
  var actTopPos = $(".vehicle-nav").position().top;
  var navChildHeight = $('#vehicle-nav-container').find('.vehicle-nav').height();
  var x = -(navChildHeight - navHeight);

  var fullHeight = 0;
  $('.vehicle-nav li').each(function () {
    fullHeight += scrollHeight;
  });

  navHeight = fullHeight - navHeight + scrollHeight;

  if ((direction == 'down') && (actTopPos > x) && (-navHeight <= (actTopPos - (scrollHeight * 2)))) {
    topPos = actTopPos - scrollHeight;
    $(".vehicle-nav").css('top', topPos);
  }

  if (direction == 'up' && 0 > actTopPos) {
    topPos = actTopPos + scrollHeight;
    $(".vehicle-nav").css('top', topPos);
  }

  return false;
});


$(".vehicle-nav li").on("click", function () {
  $(".vehicle-nav .active").removeClass("active");
  $(this).addClass('active');

  $(activeVehicleData).fadeOut("slow", function () {
    activeVehicleData = $(".vehicle-nav .active a").attr("href");
    $(activeVehicleData).fadeIn("slow", function () { });
  });

  return false;
});


// Vehicles Responsive Nav (mobile dropdown)
//-------------------------------------------------------------
$("<div />").appendTo("#vehicle-nav-container").addClass("styled-select-vehicle-data");
$("<select />").appendTo(".styled-select-vehicle-data").addClass("vehicle-data-select");
$("#vehicle-nav-container a").each(function () {
  var el = $(this);
  $("<option />", {
    "value": el.attr("href"),
    "text": el.text()
  }).appendTo("#vehicle-nav-container select");
});

$(".vehicle-data-select").change(function () {
  $(activeVehicleData).fadeOut("slow", function () {
    activeVehicleData = $(".vehicle-data-select").val();
    $(activeVehicleData).fadeIn("slow", function () { });
  });

  return false;
});


// Scroll to Top Button
//-------------------------------------------------------------
$(window).scroll(function () {
  if ($(this).scrollTop() > 100) {
    $('.scrollup').removeClass("animated fadeOutRight");
    $('.scrollup').fadeIn().addClass("animated fadeInRight");
  } else {
    $('.scrollup').removeClass("animated fadeInRight");
    $('.scrollup').fadeOut().addClass("animated fadeOutRight");
  }
});

$('.scrollup, .navbar-brand').click(function () {
  $("html, body").animate({ scrollTop: 0 }, 'slow', function () {
    $("nav li a").removeClass('active');
  });
  return false;
});


// Smooth Scroll for in-page anchors (.scroll-to)
//-------------------------------------------------------------
var scrollTo = $(".scroll-to");

scrollTo.click(function (event) {
  $('.modal').modal('hide');
  var position = $(document).scrollTop();
  var scrollOffset = 110;

  if (position < 39) {
    scrollOffset = 260;
  }

  var marker = $(this).attr('href');
  $('html, body').animate({ scrollTop: $(marker).offset().top - scrollOffset }, 'slow');

  return false;
});
