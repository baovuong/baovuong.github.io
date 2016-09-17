
// ==== enums ====
var Size = {
    SMALL: 0,
    MEDIUM: 1,
    LARGE: 2
};

var VehicleType = {
    KART: 0,
    BIKE: 1
};


// ==== Racer class ====
function Racer(name, weight) {
    this.name = name;
    this.weight = weight;
}

Racer.prototype = {
    constructor: Racer,
    drivableVehicles: function(vehicles) {
        var result = new Array();
        for (var i=0; i<vehicles.length; i++) {
            if (this.weight == vehicles[i].weight) {
                result.push(vehicles[i]);
            }
        }
        return result;
    }
}
// =====================


// ==== Track class ====
function Track(name, cup) {
    this.name = name;
    this.cup = cup;
}
// =====================

// ==== Vehicle class ====
function Vehicle(name, type, weight) {
    this.name = name;
    this.vehicleType = type;
    this.weight = weight;
}
// =======================


// ==== functions ====

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function shuffle(array) {
    for (var i=0; i<array.length-1; i++) {
        var j = getRandomInt(0, i);
        if (j != i) {
            // swap
            var temp = array[j];
            array[j] = array[i];
            array[i] = temp;
        }
    }
}
