import axios from "axios";

const TENANT_QUERY_GATEWAY_URL = 'http://192.168.1.241:31004';
const TENANT_FEATURES_ROUTE = '/api/v1/tenant/features';

const REPORT_IDS_VISIBILITY_KEY = 'VIEW_IDS_IN_PAGE_FLOW_ANALYTIC';
const MATERIAL_PAGE_FLOW_REPORT_VISIBILITY_KEY = 'VIEW_PAGE_FLOW_REPORTS';
const APP_METRICS_APP_ALLOWED_KEY = 'APPLICATION_METRICS_APP_ALLOWED';
const ADMIN_APP_ALLOWED_KEY = 'ADMIN_APP_ALLOWED';
const VIEW_VISIT_FLOWS_KEY = 'VIEW_VISIT_FLOWS';
const SHOW_APP_SOURCE_METRICS_KEY = 'SHOW_APP_SOURCE_METRICS';
const SHOW_APP_AD_METRICS_KEY = 'SHOW_APP_AD_METRICS';
const VISIT_FLOW_PAGE_LEGACY_DEFAULT_KEY = 'VISIT_FLOW_PAGE_LEGACY_DEFAULT';
const TOGGLE_LEGACY_VIEW_ENABLED_KEY = 'TOGGLE_LEGACY_VIEW_ENABLED';

const REPORT_IDS_VISIBILITY_DEFAULT_VALUE = 'FALSE';
const MATERIAL_PAGE_FLOW_REPORT_VISIBILITY_DEFAULT_VALUE = 'FALSE';
const APP_METRICS_APP_ALLOWED_DEFAULT_VALUE = 'FALSE';
const ADMIN_APP_ALLOWED_DEFAULT_VALUE = 'FALSE';
const VIEW_VISIT_FLOWS_DEFAULT_VALUE = 'FALSE';
const SHOW_APP_SOURCE_METRICS_DEFAULT_VALUE = 'FALSE';
const SHOW_APP_AD_METRICS_DEFAULT_VALUE = 'FALSE';
const VISIT_FLOW_PAGE_LEGACY_DEFAULT_DEFAULT_VALUE = 'TRUE';
const TOGGLE_LEGACY_VIEW_ENABLED_DEFAULT_VALUE = 'FALSE';

export async function getFeatures(tenantId, setFeatures) {

    const options = {
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            'tenantId': tenantId
        },
        crossDomain: true
    };

    try {
        setFeatures(new TenantFeaturesConfig(await getFeaturesConfig(options)));
    } catch (error) {
        console.error('Error fetching tenant features', error);
    }
}

async function getFeaturesConfig(options) {
    return (await axios.get(TENANT_QUERY_GATEWAY_URL + TENANT_FEATURES_ROUTE, options)).data.features;
}

export class TenantFeaturesConfig {
    constructor(featuresMap) {
        if(featuresMap){
            if(featuresMap[REPORT_IDS_VISIBILITY_KEY]){
                this.REPORT_IDS_VISIBILE = featuresMap[REPORT_IDS_VISIBILITY_KEY];
            } else {
                this.REPORT_IDS_VISIBILE = REPORT_IDS_VISIBILITY_DEFAULT_VALUE;
            }
            if(featuresMap[MATERIAL_PAGE_FLOW_REPORT_VISIBILITY_KEY]){
                this.MATERIAL_PAGE_FLOW_REPORT_VISIBILE = featuresMap[MATERIAL_PAGE_FLOW_REPORT_VISIBILITY_KEY];
            } else {
                this.MATERIAL_PAGE_FLOW_REPORT_VISIBILE = MATERIAL_PAGE_FLOW_REPORT_VISIBILITY_DEFAULT_VALUE;
            }
            if(featuresMap[APP_METRICS_APP_ALLOWED_KEY]){
                this.APP_METRICS_APP_ALLOWED = featuresMap[APP_METRICS_APP_ALLOWED_KEY];
            } else {
                this.APP_METRICS_APP_ALLOWED = APP_METRICS_APP_ALLOWED_DEFAULT_VALUE;
            }
            if(featuresMap[ADMIN_APP_ALLOWED_KEY]){
                this.ADMIN_APP_ALLOWED = featuresMap[ADMIN_APP_ALLOWED_KEY];
            } else {
                this.ADMIN_APP_ALLOWED = ADMIN_APP_ALLOWED_DEFAULT_VALUE;
            }
            if(featuresMap[VIEW_VISIT_FLOWS_KEY]){
                this.VIEW_VISIT_FLOWS = featuresMap[VIEW_VISIT_FLOWS_KEY];
            } else {
                this.VIEW_VISIT_FLOWS = VIEW_VISIT_FLOWS_DEFAULT_VALUE;
            }
            if(featuresMap[SHOW_APP_SOURCE_METRICS_KEY]){
                this.SHOW_APP_SOURCE_METRICS = featuresMap[SHOW_APP_SOURCE_METRICS_KEY];
            } else {
                this.SHOW_APP_SOURCE_METRICS = SHOW_APP_SOURCE_METRICS_DEFAULT_VALUE;
            }
            if(featuresMap[SHOW_APP_SOURCE_METRICS_KEY]){
                this.SHOW_APP_AD_METRICS = featuresMap[SHOW_APP_AD_METRICS_KEY];
            } else {
                this.SHOW_APP_AD_METRICS = SHOW_APP_AD_METRICS_DEFAULT_VALUE;
            }
            if(featuresMap[VISIT_FLOW_PAGE_LEGACY_DEFAULT_KEY]){
                this.VISIT_FLOW_PAGE_LEGACY_DEFAULT = featuresMap[VISIT_FLOW_PAGE_LEGACY_DEFAULT_KEY];
            } else {
                this.VISIT_FLOW_PAGE_LEGACY_DEFAULT = VISIT_FLOW_PAGE_LEGACY_DEFAULT_DEFAULT_VALUE;
            }
            if(featuresMap[TOGGLE_LEGACY_VIEW_ENABLED_KEY]){
                this.TOGGLE_LEGACY_VIEW_ENABLED = featuresMap[TOGGLE_LEGACY_VIEW_ENABLED_KEY];
            } else {
                this.TOGGLE_LEGACY_VIEW_ENABLED = TOGGLE_LEGACY_VIEW_ENABLED_DEFAULT_VALUE;
            }
        } else {
            this.REPORT_IDS_VISIBILE = REPORT_IDS_VISIBILITY_DEFAULT_VALUE;
            this.MATERIAL_PAGE_FLOW_REPORT_VISIBILE = MATERIAL_PAGE_FLOW_REPORT_VISIBILITY_DEFAULT_VALUE;
            this.APP_METRICS_APP_ALLOWED = APP_METRICS_APP_ALLOWED_DEFAULT_VALUE;
            this.ADMIN_APP_ALLOWED = ADMIN_APP_ALLOWED_DEFAULT_VALUE;
            this.VIEW_VISIT_FLOWS = VIEW_VISIT_FLOWS_DEFAULT_VALUE;
            this.SHOW_APP_SOURCE_METRICS = SHOW_APP_SOURCE_METRICS_DEFAULT_VALUE;
            this.SHOW_APP_AD_METRICS = SHOW_APP_AD_METRICS_DEFAULT_VALUE;
            this.TOGGLE_LEGACY_VIEW_ENABLED = TOGGLE_LEGACY_VIEW_ENABLED_DEFAULT_VALUE;
            this.VISIT_FLOW_PAGE_LEGACY_DEFAULT = VISIT_FLOW_PAGE_LEGACY_DEFAULT_DEFAULT_VALUE;
        }
    }
}
