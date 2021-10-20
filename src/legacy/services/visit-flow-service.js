import axios from "axios";
import {
    ADMIN_API_TOKEN,
    QUERY_GATEWAY_API_DOMAIN
} from "./axios-service";
import {
    buildRequestOptions,
    JSON_CONTENT_TYPE
} from "../utils/request-utils";

//FIXME - Why am I undefined?
// const {
//     ADMIN_API_TOKEN
// } = process.env;

const buildFetchVisitFlowsUrl = (start, end, tenantId, stepNumber) => {
    const flowsUrl = '/reports/api/v1/flows';

    const dateTenantParams = `start=${start}&end=${end}${tenantId ? `&tenantId=${tenantId}` : ''}`;
    const stepNumberParam = `stepNumber=${stepNumber ? stepNumber : 0}`;
    const queryParams = `${dateTenantParams}&${stepNumberParam}`;
    const queryUrl = `${QUERY_GATEWAY_API_DOMAIN}${flowsUrl}`;

    return `${queryUrl}?${queryParams}`;
};

const fetchVisitFlows = (start, end, tenantId, stepNumber) => {
    const options = buildRequestOptions(JSON_CONTENT_TYPE, ADMIN_API_TOKEN);
    const fetchUrl = buildFetchVisitFlowsUrl(start, end, tenantId, stepNumber);

    return axios.get(fetchUrl, options);
};

const processFlowMap = (flowMap) => {
    const parseFlowFromEntry = (key, value) => {
        return {
            page: key,
            count: value.visitFlows.length,
            flows: value.visitFlows,
            currentStep: value.currentFlowStep,
            continuedVisits: getNextStepCount(value.visitFlows)
        };
    };

    const convertMap = (flowMap) => {
        const flows = [];
        flowMap.forEach((value, key) => {
            flows.push(parseFlowFromEntry(key, value));
        });
        return flows;
    }

    return convertMap(flowMap);
};

const getNextStepCount = (flow, stepNumber) => {
    return flow.filter(visit => {
        return visit.visits.length > (stepNumber ? (stepNumber + 1) : 1);
    }).length;
};

export const convertFlows = (flow) => {
    const stepNumber = flow.currentStep;
    const flows = flow.flows;

    const visitFlowsMap = new Map();
    flows.forEach(f => {
        if(f.visits.length > stepNumber + 1){
            const pageName = f.visits[stepNumber + 1];
            const maybeValue = visitFlowsMap.get(pageName);
            if(maybeValue){
                visitFlowsMap.set(pageName, {
                    visitFlows: [f].concat(maybeValue.visitFlows),
                    currentFlowStep: stepNumber + 1
                });
            } else {
                visitFlowsMap.set(pageName, {
                    visitFlows: [f],
                    currentFlowStep: stepNumber + 1
                });
            }
        }
    });
    return processVisitFlows(visitFlowsMap);
};

const processVisitFlows = (visitFlowsMap) => {

    const processFlows = (visitFlowMap) => {
        const visitFlows = processFlowMap(visitFlowMap);
        return filterEmptyPages(visitFlows);
    };

    return processFlows(visitFlowsMap);
};

const processVisitFlowsFromAPI = (rawFlowMap) => {

    const visitFlowsMap = new Map(Object.entries(rawFlowMap));
    return processVisitFlows(visitFlowsMap);
};

export const hasNextStep = (visitFlow) => {
    const nextStep = visitFlow.currentStep + 1;
    return getNextStepCount(visitFlow.flows, visitFlow.currentStep);
    // const flowsThatAreLongEnough = visitFlow.flows.filter(fl => {
    //     return fl.length > (nextStep) && !!fl[nextStep];
    // });
    // if(flowsThatAreLongEnough.length > 0){
    //     return getNextStepCount(flowsThatAreLongEnough, visitFlow.currentStep).length > 0;
    // }
    // return false;
};

export const computeVisitFlowStep = (visitFlows, stepNumber, firstPage, currentPage) => {

    const parseStep = (step, stepNumber) => {
        const flowsThatAreLongEnough = step.flows.filter(fl => {
            return fl.visits.length > stepNumber && !!fl.visits[stepNumber];
        });
        return {
            page: flowsThatAreLongEnough[0].visits[stepNumber],
            count: flowsThatAreLongEnough.length,
            flows: flowsThatAreLongEnough,
            currentStep: stepNumber,
            continuedVisits: getNextStepCount(flowsThatAreLongEnough, stepNumber)
        };
    };

    const matching = visitFlows.filter((visitFlow) => {
        return visitFlow.flows.filter(f => {
            return f.length >= stepNumber
                && (visitFlow.flows && visitFlow.flows.length > 0)
                && !!firstPage ? visitFlow.flows[0] === firstPage : true
                && !!currentPage ? visitFlow.flows[stepNumber] === currentPage : true
        }).length > 0;
    });

    return matching.map((match) => {
        return parseStep(match, stepNumber);
    });
};

export const getVisitFlows = async (start, end, tenantId, stepNumber) => {
    try {
        const apiResponse = await fetchVisitFlows(start, end, tenantId, stepNumber);
        return processVisitFlowsFromAPI(apiResponse.status === 200 ? apiResponse.data.result : []);
    } catch (error) {
        console.error('Error fetching visit flows', error);
    }
    return [];
};

const filterEmptyPages = (visitFlows) => {
    return visitFlows.filter(flow => {
        return !!flow.page;
    });
};
