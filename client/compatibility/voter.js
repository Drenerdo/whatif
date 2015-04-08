$("#vote").val('0');

// Create a click handler for your increment button
$("#increaseButton").click(function () {
    var newValue = 1 + parseInt($("#vote").val());
    $("#vote").val(newValue);
});
// .. and your decrement button
$("#decreaseButton").click(function () {
    var newValue = parseInt($("#vote").val()) - 1;
    $("#vote").val(newValue);
});