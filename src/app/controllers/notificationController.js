const db = require('../../../modules/pool');
const { logger } = require('../../../config/winston');
const utils = require('../../../modules/resModule')
var FCM = require('fcm-node');
var serverKey = 'AAAAwHw0vRg:APA91bEqsDFMmvLWu-vlS4RkSrBtRa3aBi4bWXfQSG7KXzoe5wJ5jYX_ZJQa-DYH4EnVF4HvcS5gekRAOyRCwHUxhv_Q0PSKRn0tn3Y6jlWtXYpg8SDrb3Uj0342AadH7t7XWajYptWl'; //put your server key here
var fcm = new FCM(serverKey);


/**
 create : 2019.11.20
notification API = 알림
 */
exports.notification = async function (req, res) {


    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: 'registration_token', 
        collapse_key: 'your_collapse_key',
        
        notification: {
            title: 'Title of your push notification', 
            body: 'Body of your push notification' 
        },
        
        data: {  //you can send only notification or only data(or include both)
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    };
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });


    try {
        const pushQuery = `
                SELECT *
                FROM category;
                `;
        const categoryResult = await db.query(selectCategoryQuery);
        res.send(utils.successTrue(200, "카테고리조회 성공", categoryResult));
    } catch (err) {
        logger.error(`App - Query error\n: ${err.message}`);
        return res.send(utils.successFalse(500, `Error: ${err.message}`));
    }
}
