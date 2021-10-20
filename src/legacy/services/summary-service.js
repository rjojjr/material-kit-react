import {
    getFlowReports,
    postConfirmBot,
    getFlowReport,
    getWeeklySummary,
    postConfirmUser,
    getCustomSummary,
    getMaterialRequestMetrics, calculateMetrics
} from "./axios-service"
import {getLatencyMetrics as getMetrics} from "./axios-service";
import {networkErrorMsg, loadingMsg, doneLoadingMsg, sensors, statsCalcStartedMsg} from "../constants";

export async function getAllReports(
    handleMsg,
    handleStatus,
    page,
    status,
    urlFilter,
    ipFilter,
    userAgentFilter,
    ispFilter,
    aiStatus,
    refererFilter,
    originFilter,
    visitNumberFilter,
    visitNumberEndFilter,
    tenantId
) {
    handleMsg({});
    handleMsg(loadingMsg);
    await getReport(
        handleMsg,
        handleStatus,
        page,
        status,
        urlFilter,
        ipFilter,
        userAgentFilter,
        ispFilter,
        aiStatus,
        refererFilter,
        originFilter,
        visitNumberFilter,
        visitNumberEndFilter,
        tenantId
    );

    handleMsg(doneLoadingMsg);
}

export async function getMoreReports(handleMsg, handleStatus, page, status, urlFilter, ipFilter, userAgentFilter, ispFilter, aiStatus, refererFilter, originFilter, visitNumberFilter, visitNumberEndFilter, tenantId) {
    await getReport(handleMsg, handleStatus, page, status, urlFilter, ipFilter, userAgentFilter, ispFilter, aiStatus, refererFilter, originFilter, visitNumberFilter, visitNumberEndFilter, tenantId);
}

export async function getReport(handleMsg, handleStatus, page, status, urlFilter, ipFilter, userAgentFilter, ispFilter, aiStatus, refererFilter, originFilter, visitNumberFilter, visitNumberEndFilter, tenantId) {
    try {
        const apiResponse = await getFlowReports(page, status, urlFilter, ipFilter, userAgentFilter, ispFilter, aiStatus, refererFilter, originFilter, visitNumberFilter, visitNumberEndFilter, tenantId);
        if (apiResponse.status === 200) {
            if (apiResponse.data.totalResults == 0) {
                handleStatus(null, 0);
            }
            for (var index in apiResponse.data.reports) {
                handleStatus(formReport(apiResponse.data.reports[index], index), apiResponse.data.totalResults);
            }
        } else {
            handleMsg(networkErrorMsg);
        }
    } catch (error) {
        handleMsg(networkErrorMsg);
    }
}

export async function getWeekSummary(handleMsg, handleSummaries) {
    handleMsg({});
    handleMsg(loadingMsg);
    try {
        const apiResponse = await getWeeklySummary();
        if (apiResponse.status === 200) {
            handleSummaries(apiResponse.data.summaries);
        } else {
            handleMsg(networkErrorMsg);
        }
    } catch (error) {
        handleMsg(networkErrorMsg);
    }
    handleMsg(doneLoadingMsg);
}

export async function getCustomSummaries(handleMsg, handleSummaries, start, end, tenantId) {
    handleMsg({});
    handleMsg(loadingMsg);
    try {
        const apiResponse = await getCustomSummary(parseDate(start), parseDate(end), tenantId);
        if (apiResponse.status === 200) {
            handleSummaries(apiResponse.data.summaries);
        } else {
            handleMsg(networkErrorMsg);
        }
    } catch (error) {
        handleMsg(networkErrorMsg);
    }
    handleMsg(doneLoadingMsg);
}

export async function postConfirmedBot(handleMsg, handleStatus, page, reportUuid) {
    try {
        let apiResponse = await postConfirmBot(reportUuid);
        if (apiResponse.status === 200) {
            apiResponse = await getFlowReport(reportUuid);
            for (var index in apiResponse.data.reports) {
                handleStatus(formReport(apiResponse.data.reports[index], index));
            }
        } else {
            handleMsg(networkErrorMsg);
        }
    } catch (error) {
        handleMsg(networkErrorMsg);
    }
}

export async function postConfirmedUser(handleMsg, handleStatus, page, reportUuid) {
    try {
        let apiResponse = await postConfirmUser(reportUuid);
        if (apiResponse.status === 200) {
            apiResponse = await getFlowReport(reportUuid);
            for (var index in apiResponse.data.reports) {
                handleStatus(formReport(apiResponse.data.reports[index], index));
            }
        } else {
            handleMsg(networkErrorMsg);
        }
    } catch (error) {
        handleMsg(networkErrorMsg);
    }
}

function formReport(report, index) {
    return {
        count: index,
        id: report.pageFlowReport.id,
        uuid: report.pageFlowReport.uuid,
        created: report.pageFlowReport.createTime,
        closed: report.pageFlowReport.closeTime,
        pageViews: report.pageVisits.length,
        ip: report.pageFlowReport.ip,
        username: report.pageFlowReport.username,
        userAgent: report.pageFlowReport.userAgent,
        confirmedBot: report.pageFlowReport.confirmedBot,
        analyticSelectedBot: report.pageFlowReport.analyticSelectedBot,
        confirmedUser: report.pageFlowReport.confirmedUser,
        analyticSelectedUser: report.pageFlowReport.analyticSelectedUser,
        pageVisits: report.pageVisits,
        isp: report.pageFlowReport.isp,
        trafficType: report.pageFlowReport.trafficType,
        aiTrafficType: report.pageFlowReport.aiTrafficType,
        referer: report.pageFlowReport.referer,
        origin: report.pageFlowReport.origin,
        returnUser: report.pageFlowReport.returnUser
    };
}

export async function getLatencyMetrics(handleMsg, handleLatencyMetricsChange) {
    handleMsg({});
    handleMsg(loadingMsg);
    try {
        let apiResponse = await getMetrics();
        if (apiResponse.status === 200) {
            handleLatencyMetricsChange(apiResponse.data.requestMetrics);
        } else {
            handleMsg(networkErrorMsg);
        }
    } catch (error) {
        handleMsg(networkErrorMsg);
    }
    handleMsg(doneLoadingMsg);
}

export async function getRequestMetrics(handleMsg, handleRequestMetricsChange, start, end, status) {
    handleMsg({});
    handleMsg(loadingMsg);
    try {
        let apiResponse = await getMaterialRequestMetrics(parseDate(start), parseDate(end), status);
        if (apiResponse.status === 200) {
            handleRequestMetricsChange(apiResponse.data.requestMetricList, apiResponse.data.results);
        } else {
            handleMsg(networkErrorMsg);
        }
    } catch (error) {
        handleMsg(networkErrorMsg);
    }
    handleMsg(doneLoadingMsg);
}

export async function calculateStats(handleMsg, start, end, tenantId) {
    handleMsg({});
    try {
        await calculateMetrics(parseDate(start), parseDate(end), tenantId);
    } catch (error) {
        handleMsg(networkErrorMsg);
    }
    handleMsg(statsCalcStartedMsg);
}

export const parseDate = (date) => {
    const today = date;
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
}
