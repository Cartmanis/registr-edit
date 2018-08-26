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
    }
});

/*middleware */
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

//тут ошибка 
Schema.methods.comparePassword = async function(password) {                         
        try {
            const matches = await bcrypt.compare(password, this.password);
            return matches;
        } catch (err) {
            return err;
        }    
};

mongoose.model('User', Schema);