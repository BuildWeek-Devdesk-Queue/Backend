const db = require('../data/db-config');

module.exports = {
    findBy,
    add,
    update,
    remove,
    addProfilePic,
    updateProfilePic
}

function findBy(value){
    return db('users')
        .where(value)
        .first();
}

function add(user){
    return db('users')
    .insert(user, 'id');
}

function update(id, user){
    return db('users')
    .where({id})
    .update({...user});
}

async function remove(id){
    await db.transaction(async trx => {
        try{
            const [user] = await trx('users')
            .where({id});

            const userDeleted = await trx('users')
            .where({id})
            .del();
            
            if(!userDeleted){
                throw 'Error deleting user'
            }
            if(user.helper){
                await trx('resolved_tickets')
                .where({helper_id: id})
                .update({helper_id: null});
            }
            if(user.student){
                await trx('resolved_tickets')
                .where({student_id: id})
                .update({student_id: null});
            }

            return true;
        }catch(err){
            throw err;
        }
    });
}

function addProfilePic(image){
    return db('profile_pictures')
        .insert(image);
}

function updateProfilePic(image){
    return db.transaction(async trx => {
        try{
            const deleted = await trx('profile_pictures')
            .where({user_id: image.user_id})
            .del()

            if(deleted){
                await trx('profile_pictures')
                    .insert(image);
                return 'success';
            }else{
                throw 'Profile picture could not be deleted'
            }
        }catch(err){
            throw err
        }
    })
}