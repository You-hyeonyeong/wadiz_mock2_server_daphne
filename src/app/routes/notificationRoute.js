module.exports = function(app){
    const notification = require('../controllers/notificationController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.route('/noti').post(notification.notification);
    app.get('/noti', jwtMiddleware, notification.getNotification);

};