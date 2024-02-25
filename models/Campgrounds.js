const mongoose = require('mongoose')

const Campgrounds = new mongoose.Schema({
    name : {
    type : String,
    require : [true, 'Please add name']
    },
    tel : {
        type : String,
        minLength : 10,
        maxLength : 20,
        pattern : "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
    },
    address :{
        type : {
            house_number: {
                type : String,
                require : [true, 'Please add your house number']
            },
            lane : {
                type : String,
                require : [true, 'Please add lane']
            },
            road : {
                type : String,
                require : [true, 'Please add road']
            },
            sub_district : {
                type : String,
                require : [true, 'Please add sub_district']
            },
            district : {
                type : String,
                require : [true, 'Please add district']
            },
            postal_code : {
                type : internal,
                require : [true, 'Please add postal code']
            },
            link : {
                type : String,
                require : [true, 'Please add link']
            }
        },
        required: [true, 'Please add address details']
    },
    website : {
        type : String,
        require : [true , 'Please add website']
    },
    pictue : {
        type : [String],
        require : [true, 'Please add picture']
    },
    facilities : {
        type : [String],
        require : [true, 'Please add facilities']
    },
    tentForRent : {
        type : Boolean,
        require : [true, 'Please add tentF for rent']
    },
    amount : {
        type : number,
        require : [true , "Please add amount"]
    },
    sites: [
        {
            zone: {
                type: String,
                required: false // ไม่บังคับต้องมี
            },
            number: {
                type: Number,
                unique: true, 
                required: [true, 'Please add unique number']
            },
            size: {
                type: {
                    width: {
                        type: Number,
                        required: [true, 'Please add width']
                    },
                    length: {
                        type: Number,
                        required: [true, 'Please add length']
                    }
                },
                required: [true, 'Please add sites']
            }
        }
    ]
});

module.exports = Campgrounds;