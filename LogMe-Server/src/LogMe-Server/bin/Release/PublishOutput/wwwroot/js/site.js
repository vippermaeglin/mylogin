// Write your Javascript code.

//EXPAND ADDRESS:
$("#advanced-address a").click(function (e) {
    e.preventDefault();

    $(this).parent().slideUp();
    $(".advanced-address").slideDown();
});
