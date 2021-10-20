import axios from "axios";
import {DEFAULT_TENANT_ID} from "../constants";

const REPORT_API_DOMAIN = 'http://192.168.1.242:31008/reports/api/v1';

//const {ROOT_API_DOMAIN, ADMIN_API_TOKEN } = process.env;
const {ROOT_API_DOMAIN} = process.env;
export const ADMIN_API_TOKEN = 'DEiKoNamafwSl1BdDGpBqxTR3Eckjw5SdAP0sv2yjLAOraufbLqKaCDQrVIEHegDT8uSvzCeK3fy4QpA+6j9QA';

export const QUERY_GATEWAY_API_DOMAIN = 'http://192.168.1.239:31008';

const DEFAULT_REPORT_PAGE_SIZE = '15';

export const getFlowReports = (page, status, urlFilter, ipFilter, userAgentFilter, ispFilter, aiStatus, refererFilter, originFilter, visitNumberFilter, visitNumberEndFilter, tenantId) => {

    const options = buildHeaders(ADMIN_API_TOKEN);

    !visitNumberFilter && (
        visitNumberFilter = 0
    );

    !visitNumberEndFilter && (
        visitNumberEndFilter = 0
    );

    !ipFilter && (
        ipFilter = ""
    );

    !ispFilter && (
        ispFilter = ""
    );

    !refererFilter && (
        refererFilter = ""
    );

    !originFilter && (
        originFilter = ""
    );

    !userAgentFilter && (userAgentFilter = '');

    const populateUrlFilter = () => {
        if(urlFilter === '' || urlFilter === '/'){
            return `${ipFilter ? `&ipFilter=${ipFilter}` : ''}${userAgentFilter ? `&userAgentFilter=${userAgentFilter.replaceAll('/', '%2F')}`: ''}${ispFilter ? `&ispFilter=${ispFilter}` : ''}${aiStatus ? `&aiStatus=${aiStatus}` : ''}`;
        } else {
            return `${urlFilter ? `&urlFilter=${urlFilter.replace('/', '').replaceAll('/', '%2F')}` : ''}${ipFilter ? `&ipFilter=${ipFilter}` : ''}${userAgentFilter ? `&userAgentFilter=${userAgentFilter.replaceAll('/', '%2F')}`: ''}${ispFilter ? `&ispFilter=${ispFilter}` : ''}${aiStatus ? `&aiStatus=${aiStatus}` : ''}`;
        }
    }

    if(status){
        return  axios.get(`${REPORT_API_DOMAIN}/page-flow-reports/material?count=${DEFAULT_REPORT_PAGE_SIZE}&page=${page}` + `&status=${status}` + populateUrlFilter() + `${refererFilter ? `&refererFilter=${refererFilter}` : ''}${originFilter ? `&originFilter=${originFilter}` : ''}${visitNumberFilter ? `&visitNumberStartFilter=${visitNumberFilter}` : ''}${visitNumberEndFilter ? `&visitNumberEndFilter=${visitNumberEndFilter}` : ''}&tenantId=${tenantId ? tenantId : DEFAULT_TENANT_ID}`, options);
    } else {
        return axios.get(`${REPORT_API_DOMAIN}/page-flow-reports/material?count=${DEFAULT_REPORT_PAGE_SIZE}&page=${page}` + populateUrlFilter() + `${refererFilter ? `&refererFilter=${refererFilter}` : ''}${originFilter ? `&originFilter=${originFilter}` : ''}${visitNumberFilter ? `&visitNumberStartFilter=${visitNumberFilter}` : ''}${visitNumberEndFilter ? `&visitNumberEndFilter=${visitNumberEndFilter}` : ''}&tenantId=${tenantId ? tenantId : DEFAULT_TENANT_ID}`, options);
    }
};

export const getFlowReport = (uuid) => {

    const options = buildHeaders(ADMIN_API_TOKEN);

    return axios.get(`${REPORT_API_DOMAIN}/page-flow-reports/material?uuid=${uuid}`, options);
};

export const postConfirmBot = (reportUuid) => {

    const options = buildHeaders(ADMIN_API_TOKEN);

    const body = {
        reportUuids: [reportUuid]
    }

    return axios.post(`${ROOT_API_DOMAIN}/bot/confirm`, body, options);
};

export const postConfirmUser = (reportUuid) => {

    const options = buildHeaders(ADMIN_API_TOKEN);

    const body = {
        reportUuids: [reportUuid]
    }

    return axios.post(`${ROOT_API_DOMAIN}/user/confirm`, body, options);
};

export const getWeeklySummary = () => {

    const options = buildHeaders(ADMIN_API_TOKEN);

    return axios.get(`${REPORT_API_DOMAIN}/summaries/week`, options);
};

export const getCustomSummary = (start, end, tenantId) => {

    const options = buildHeaders(ADMIN_API_TOKEN);

    return axios.get(
        `${REPORT_API_DOMAIN}/summaries?start=${start}&end=${end}&tenantId=${tenantId 
            ? tenantId 
            : DEFAULT_TENANT_ID}`,
        options);
};

export const getLatencyMetrics = () => {

    const options = buildHeaders(ADMIN_API_TOKEN);

    return axios.get(`${REPORT_API_DOMAIN}/metrics/request`, options);
};

export const getMaterialRequestMetrics = (start, end, status) => {

    const options = buildHeaders(ADMIN_API_TOKEN);;

    if(!status){
        status = 'All';
    }

    return axios.get(`${REPORT_API_DOMAIN}/metrics/request/material?start=${start}&end=${end}&status=${status}`, options);
};

export const calculateMetrics = (start, end, tenantId) => {

    const calculateUrl = `${REPORT_API_DOMAIN}/admin/api/v1/stats/calc`;
    const parameterizedUrl = `${calculateUrl}?start=${start}&end=${end}&tenantId=${tenantId}`

    const options = buildHeaders(ADMIN_API_TOKEN);

    return axios.get(parameterizedUrl, options);
};

export const getPageVisitsPerUserChartData = (start, end, tenantId) => {
    const chartUrl = `${QUERY_GATEWAY_API_DOMAIN}/charts/api/v1/page-visits/user`;
    const parameterizedUrl = `${chartUrl}?start=${start}&end=${end}&tenantId=${tenantId}`

    const options = buildHeaders(ADMIN_API_TOKEN);

    return axios.get(parameterizedUrl, options);
};

export const getSessionsPerUserChartData = (start, end, tenantId) => {
    const chartUrl = `${QUERY_GATEWAY_API_DOMAIN}/charts/api/v1/sessions/user`;
    const parameterizedUrl = `${chartUrl}?start=${start}&end=${end}&tenantId=${tenantId}`

    const options = buildHeaders(ADMIN_API_TOKEN);

    return axios.get(parameterizedUrl, options);
};

export const getUsersPerDayChartData = (start, end, tenantId, userType) => {
    const chartUrl = `${QUERY_GATEWAY_API_DOMAIN}/charts/api/v1/users/day`;
    const parameterizedUrl = `${chartUrl}?start=${start}&end=${end}&tenantId=${tenantId}&userType=${userType}`

    const options = buildHeaders(ADMIN_API_TOKEN);

    return axios.get(parameterizedUrl, options);
};

export const getChartData = (url) => {
    const chartsApi = `${QUERY_GATEWAY_API_DOMAIN}/charts/api/v1`;
    const parameterizedUrl = `${chartsApi}${url}`

    const options = buildHeaders(ADMIN_API_TOKEN);

    return axios.get(parameterizedUrl, options);
};

const buildHeaders = (token) => {

    const options = {
        headers: {
            contentType: 'application/json',
            token: token
        }
    };

    return options;
};
