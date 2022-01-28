const moment = require("moment");
const { Op, fn, QueryTypes, col, literal } = require("sequelize");
const models = require("../models");
const { SQL: { database } } = require("../config")

exports.GET_ATTENDANCE_SUMMARY = async function (req, res) {
    try {
        const { id, year } = req.query;
        const totalAttandance = await models.sequelize.query(
            `
            SELECT 
            count(distinct DATE_FORMAT(attendence_date,'%d')) as days,
            DATE_FORMAT(attendence_date, '%m') as month,
            DATE_FORMAT(attendence_date, '%Y') as years
            from ${database}.attendence WHERE DATE_FORMAT(attendence_date, '%Y') = '${year}'
            GROUP BY DATE_FORMAT(attendence_date, '%Y'), DATE_FORMAT(attendence_date, '%m')
            `, { raw: true, type: QueryTypes.SELECT });
    
        const studentAttendence = await models.sequelize.query(
                `
                SELECT 
                count(distinct DATE_FORMAT(attendence_date,'%d')) as presentDays,
                DATE_FORMAT(attendence_date, '%m') as month,
                DATE_FORMAT(attendence_date, '%Y') as years
                from ${database}.attendence 
                WHERE user_id = ${id} AND DATE_FORMAT(attendence_date, '%Y') = '${year}' 
                GROUP BY DATE_FORMAT(attendence_date, '%Y'), DATE_FORMAT(attendence_date, '%m')
                `, { raw: true, type: QueryTypes.SELECT });    
    
            totalAttandance.forEach(element => {
            let found = studentAttendence.find(i => i.month == element.month && i.years == element.years);
            if(found) {
                element['presentDays'] = found.presentDays;
            } else {
                element['presentDays'] = 0;
            }
        });
        
       return res.status(200).send(totalAttandance);
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.GET_SUTRA_SUMMARY = async function (req,res) {
    try {
        const { id, year } = req.query;
        const query = `SELECT 
        us.id AS id, 
        su.name as sutraName,
        su.gatha_count as sutraGatha,
        datediff(us.end_date, us.start_date) as days,
        us.start_date as sutraStartDate,
        us.end_date as sutraEndDate,
        case when us.end_date > us.start_date then 'true'
        else 'false' END AS completed
    FROM
        ${database}.user_sutra us
        LEFT JOIN ${database}.sutra su ON su.id = us.sutra_id
    WHERE
        user_id = ${id} AND ( DATE_FORMAT(us.createdAt,'%Y') = '${year}' OR us.start_date = us.end_date)`;

        let result = await models.sequelize.query(query, { raw: true, type: QueryTypes.SELECT });
        result = result.sort((a,b) => b.id - a.id);
        return res.status(200).send(result);
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.GET_USER_SUTRA_HISTORY = async function(req, res) {
    try {
        const { id, year } = req.query;
        const query = `
        SELECT DISTINCT
        DATE_FORMAT(attendence_date,'%Y-%m-%d') as dates
        FROM
        ${database}.attendence where date_format(attendence_date,'%Y') = '${year}'
        `;

        const attendanceQuery = `
        SELECT DISTINCT
            DATE_FORMAT(attendence_date,'%Y-%m-%d') as dates
        FROM
            PATHSHALA.attendence
        WHERE
            user_id = ${id} AND 
        DATE_FORMAT(attendence_date, '%Y') = '${year}'
        `
        const summaryQuery = `
        SELECT 
        DATE_FORMAT(us.createdAt, '%Y-%m-%d') as dates,
            su.name,
            us.current_gatha_count,
            us.status as status,
            concat(teacher.first_name, ' ',teacher.last_name) as teacher
        FROM
            PATHSHALA.user_sutra_history us 
            LEFT JOIN PATHSHALA.sutra su ON su.id = us.sutra_id
            LEFT JOIN PATHSHALA.user teacher ON teacher.id = us.approved_by
        WHERE
            user_id = ${id}
                AND DATE_FORMAT(us.createdAt, '%Y') = '${year}' order by us.id desc
        `;
        const dateData = await models.sequelize.query(query, { raw: true, type: QueryTypes.SELECT });
        const attendenceData = await models.sequelize.query(attendanceQuery, { raw: true, type: QueryTypes.SELECT });
        const summaryData = await models.sequelize.query(summaryQuery, { raw: true, type: QueryTypes.SELECT });
        let result = [];
        let updatedResults = [];
        result = dateData;
        result.forEach(i => {
            let findIndex = attendenceData.findIndex(it => it.dates == i.dates);
            i['isPresent'] = findIndex > -1;
        });
        dateData.forEach(i => {
            let found = summaryData.filter(ri => ri.dates == i.dates);
            let idx = result.findIndex(it => it['dates'] == i['dates']);
            if(found && found.length) {
                // result.splice(idx, 1);
                found.forEach(i => i['isPresent'] = true);
                // result.push(...found);
                updatedResults.push(...found);
            } else {
                updatedResults.push(result[idx])
            }
        });
        updatedResults = updatedResults.sort((a,b) => new Date(b.dates) - new Date(a.dates));
        return res.status(200).send(updatedResults);
    } catch (e) {
        return res.status(500).send(e.message);
    }
}
