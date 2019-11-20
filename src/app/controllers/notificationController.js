const db = require('../../../modules/pool');
const { logger } = require('../../../config/winston');
const utils = require('../../../modules/resModule')
var FCM = require('fcm-node');
var fcmKey = require('../../../config/firebase')
var fcm = new FCM(fcmKey.serverKey);

/**
 create : 2019.11.20
notification API = 알림
 */
exports.notification = async function (req, res) {

    const title = req.body.title
    const contents = req.body.contents

    /** 발송할 Push 메시지 내용 */
    var push_data = {

        // 수신대상
        to: fcmKey.client_token,
        // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
        notification: {
            title: title,
            body: contents,
            sound: "default",
            click_action: "FCM_PLUGIN_ACTIVITY",
            icon: "fcm_push_icon"
        }
    };

    fcm.send(push_data, function (err, response) {
        if (err) {
            console.error('Push메시지 발송에 실패했습니다.');
            console.error(err);
            res.send(utils.successTrue(500, "알림 발송 실패"));
            return;
        }
        console.log('Push메시지가 발송되었습니다.');
        res.send(utils.successTrue(200, "알림 발송 성공"));

    });

}

/**
 create : 2019.11.20
notification API = 알림 조회
 */
exports.getNotification = async function (req, res) {
    /** 발송할 Push 메시지 내용 */
    var push_data = {
        // 수신대상
        to: fcmKey.client_token,
        // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
        notification: {
            title: title,
            body: contents,
            sound: "default",
            click_action: "FCM_PLUGIN_ACTIVITY",
            icon: "fcm_push_icon"
        }
    };
    fcm.send(push_data, function (err, response) {
        if (err) {
            console.error('Push메시지 발송에 실패했습니다.');
            console.error(err);
            res.send(utils.successTrue(500, "알림 발송 실패"));
            return;
        }
        console.log('Push메시지가 발송되었습니다.');
        res.send(utils.successTrue(200, "알림 발송 성공"));
    });
}


