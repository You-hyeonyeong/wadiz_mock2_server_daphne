const db = require('../../../modules/pool');
const { logger } = require('../../../config/winston');

const utils = require('../../../modules/resModule')
var urlencode = require('urlencode');

/**
 create : 2019.11.05
 05.project API = 전체 프로젝트 조회
 - 추천순 :  관리자가 추천하는 것
 - 인기순 : 모금액순
 - 펀딩순 : 달성률순
 - 마감임박순 : 일수 오름차순
 - 최신순 : 등록일자순
 - 응원참여자수 : 서포터스수
 - 오픈예정 : 
 */
// 사진 타이틀 카테고리 메이커이름 달성률 모은금액 남은일수
exports.getProject = async function (req, res) {
    //쿼리빌더 ORM 
    const orderby = req.query.orderby;
console.log(orderby)
    const selectRecoQuery = `SELECT p.projectIdx, p.thumnail, p.title, c.category, m.makerName,
                            round(((SELECT SUM(r.rewardPrice) FROM wadiz.account a, wadiz.reward r
                            WHERE a.rewardIdx = r.rewardIdx)/p.goal) * 100) as ahievement,
                            (SELECT SUM(r.rewardPrice) FROM wadiz.account a, wadiz.reward r
                            WHERE a.rewardIdx = r.rewardIdx) as amount,
                            CONCAT(TIMESTAMPDIFF(DAY, p.startDate, CURRENT_TIMESTAMP),"일 남음") as remaining
                            FROM wadiz.project p
                            JOIN wadiz.category c ON p.categoryIdx = c.categoryIdx
                            JOIN wadiz.maker m ON p.projectIdx = m.projectIdx
                            WHERE p.star = 0;` //추천순 조회

    const selectFamousQuery = `SELECT * FROM project ORDER BY createdAt;`; //인기순 조회
    const selectFundingQuery = `SELECT * FROM project ORDER BY createdAt;`; //펀딩순
    const selectDeadlineQuery = `SELECT *FROM project ORDER BY createdAt;`; //마감임박순
    const selectNewQuery = `SELECT * FROM project ORDER BY endDate;`; //최신순
    const selectSuporterQuery = `SELECT *, count(*) as surportCnt FROM project ORDER BY surportCnt;`; //응원참여자순
    const selectUnopendQuery = `SELECT * FROM project ORDER BY endDate;`; //오픈예정
    const selectFinishedQuery = `SELECT * FROM project ORDER BY endDate;`; //종료된
    const selectDoingQuery = `SELECT * FROM project ORDER BY endDate;`; //진행중인

    // switch (orderby) {
    //     case recommend:
    //         const projectResult = await db.query(selectRecoQuery);
    //         res.send(utils.successTrue(200, "추천순 프로젝트 조회 성공", projectResult));
    //         break;
    //     case famous:
    //         const projectResult = await db.query(selectFamousQuery);
    //         res.send(utils.successTrue(200, "인기순 프로젝트 조회 성공", projectResult));
    //         break;

    // };
    //switch case
    console.log()
    try {
        if (orderby === "recommend") {
            const projectResult = await db.query(selectRecoQuery);
            res.send(utils.successTrue(200, "추천순 프로젝트 조회 성공", projectResult));
        } else if (orderby == famous) {
            const projectResult = await db.query(selectFamousQuery);
            res.send(utils.successTrue(200, "인기순 프로젝트 조회 성공", projectResult));
        } else if (orderby == funding) {
            const projectResult = await db.query(selectFamousQuery);
            res.send(utils.successTrue(200, " 펀딩순 프로젝트 조회 성공", projectResult));
        } else if (orderby == deadline) {
            const projectResult = await db.query(selectFamousQuery);
            res.send(utils.successTrue(200, "마감임박순 프로젝트 조회 성공", projectResult));
        }
        else if (orderby == newp) {
            const projectResult = await db.query(selectFamousQuery);
            res.send(utils.successTrue(200, "최신순 프로젝트 조회 성공", projectResult));
        } else if (orderby == support) {
            const projectResult = await db.query(selectFamousQuery);
            res.send(utils.successTrue(200, "응원참여자순 프로젝트 조회 성공", projectResult));
        } else if (orderby == doing) {
            const projectResult = await db.query(selectFamousQuery);
            res.send(utils.successTrue(200, " 진행중 프로젝트 조회 성공", projectResult));
        }
    } catch (err) {
        logger.error(`App - Query error\n: ${err.message}`);
        return res.send(utils.successFalse(500, `Error: ${err.message}`));
    }
}

/** create : 2019.11.10
 05.project API = 프로젝트 검색
 **/
exports.searchProject = async function (req, res) {
    const search = req.query.search
    console.log(search)
    const searchQuery = `SELECT p.projectIdx, p.thumnail, p.title, c.category, m.makerName,
                        round(((SELECT SUM(r.rewardPrice) FROM wadiz.account a, wadiz.reward r
                        WHERE a.rewardIdx = r.rewardIdx)/p.goal) * 100) as ahievement,
                        (SELECT SUM(r.rewardPrice) FROM wadiz.account a, wadiz.reward r
                        WHERE a.rewardIdx = r.rewardIdx) as amount,
                        CONCAT(TIMESTAMPDIFF(DAY, p.startDate, CURRENT_TIMESTAMP),"일 남음") as remaining
                        FROM wadiz.project p
                        JOIN wadiz.category c ON p.categoryIdx = c.categoryIdx
                        JOIN wadiz.maker m ON p.projectIdx = m.projectIdx
                        WHERE p.title LIKE ?;`

    const decodeKeyword = urlencode.decode(search)
    const searchWordResult = await db.query(searchQuery, ['%' + decodeKeyword + '%']);
    const projectCntResult = {
        projectResult : searchWordResult,
        cnt : searchWordResult.length
    };
    try {
        if (projectCntResult.length == 0) {
            res.send(utils.successFalse(404, "검색결과 없습니다."));
        } else {
            res.send(utils.successTrue(200, "검색성공", projectCntResult));
        }
    } catch (err) {
        logger.error(`App - Query error\n: ${err.message}`);
        return res.send(utils.successFalse(500, `Error: ${err.message}`));
    }

}