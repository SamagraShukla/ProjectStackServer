function coupongenerator() {
    var coupon = "";
    
    var charsused = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 36; i++) {
    coupon += charsused.charAt(Math.floor(Math.random() * charsused.length));
    }
    return coupon;
    }
    module.exports = coupongenerator;