const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean
    }
});

/*Не использую стрелочные функции из-за их привязки к лексической области видмости */
Schema.pre('save', async function(next) { 
        try{   
            if(this.isModified ('password') || this.isNew) {        
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(this.password, salt);
                this.password = hash;
                next();         
            } else {
                return next();            
            }
        } catch (err) {            
            next(err);
        }    
});

Schema.methods.comparePassword =  async function (password) {                         
        try {
            const compare = await bcrypt.compare(password, this.password);
            return compare;
        } catch (err) {
            return err;
        }    
};

mongoose.model('User', Schema);