import * as axiosService from "./axios-service"
import {networkErrorMsg, loadingMsg, doneLoadingMsg, sensors} from "../constants";
import {getReport, getAllReports, getWeekSummary} from "./summary-service";

describe('summary service', () => {

    const report = {
        id: 'some-id',
        uuid: 'some-id',
        created: 'some-id',
        closed: 'some-id',
        pageViews: 0,
        count: "0",
        ip: 'some-id',
        username: 'some-id',
        userAgent: 'some-id',
        confirmedBot: 'some-id',
        analyticSelectedBot: 'some-id',
        pageVisits: [],
        confirmedUser: 'some-id',
        analyticSelectedUser: 'some-id',
        isp: 'some-isp',
        trafficType: "BOT",
        aiTrafficType: "BOT",
        origin: 'some-origin',
        referer: 'some-referer'
    }

    const success = {
        status: 200,
        data: {
            reports: [
                {
                    pageFlowReport: {
                        id: 'some-id',
                        uuid: 'some-id',
                        createTime: 'some-id',
                        closeTime: 'some-id',
                        ip: 'some-id',
                        username: 'some-id',
                        userAgent: 'some-id',
                        confirmedBot: 'some-id',
                        analyticSelectedBot: 'some-id',
                        confirmedUser: 'some-id',
                        analyticSelectedUser: 'some-id',
                        isp: 'some-isp',
                        trafficType: "BOT",
                        aiTrafficType: 'BOT',
                        origin: 'some-origin',
                        referer: 'some-referer'
                    },
                    pageVisits: []
                }
                ]
        }

    }

    const summarySuccess = {
        status: 200,
        data: {
            summaries: [
                {
                    type: "all",
                    averageSessionsPerDay: 41.29,
                    averageSessionLength: 17.47,
                    allSessions: 289,
                    averagePageVisitsPerSession: 1.73,
                    mostFrequentLandingPage: "/",
                    ratioOnePageSession: 0.82,
                    rationKnownBots: 0.63
                }
            ]
        }
    }

    describe('getWeekSummary', () => {

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should dispatch proper handler calls when 200 response', async () => {
            const mock = jest.spyOn(axiosService, "getWeeklySummary");
            mock.mockResolvedValue(summarySuccess);
            const msgArray = [];
            const statusArray = [];

            const msgHandlerMock = (msg) => {
                msgArray.push(msg);
            }
            const stsHandlerMock = (msg) => {
                statusArray.push(msg);
            }

            await getWeekSummary(msgHandlerMock, stsHandlerMock);
            expect(msgArray.length).toBe(3);
            expect(statusArray.length).toBe(1);
            expect(statusArray.pop()).toStrictEqual(summarySuccess.data.summaries);
        });

        it('should dispatch proper handler calls when non 200 response', async () => {
            const mock = jest.spyOn(axiosService, "getWeeklySummary");
            mock.mockResolvedValue({...success, status: 400});
            const msgArray = [];
            const statusArray = [];

            const msgHandlerMock = (msg) => {
                msgArray.push(msg);
            }
            const stsHandlerMock = (msg) => {
                statusArray.push(msg);
            }

            await getWeekSummary(msgHandlerMock, stsHandlerMock);
            expect(msgArray.length).toBe(4);
            expect(statusArray.length).toBe(0);
        });

        it('should dispatch proper handler calls when an error is thrown', async () => {
            const mock = jest.spyOn(axiosService, "getWeeklySummary");
            mock.mockImplementation(() => {
                throw new Error();
            })
            const msgArray = [];
            const statusArray = [];

            const msgHandlerMock = (msg) => {
                msgArray.push(msg);
            }
            const stsHandlerMock = (msg) => {
                statusArray.push(msg);
            }

            await getWeekSummary(msgHandlerMock, stsHandlerMock);
            expect(msgArray.length).toBe(4);
            expect(statusArray.length).toBe(0);
        });

    })

    describe('getReport', () => {

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should dispatch proper handler calls when 200 response', async () => {
            const mock = jest.spyOn(axiosService, "getFlowReports");
            mock.mockResolvedValue(success);
            const msgArray = [];
            const statusArray = [];

            const msgHandlerMock = (msg) => {
                msgArray.push(msg);
            }
            const stsHandlerMock = (msg) => {
                statusArray.push(msg);
            }

            await getReport(msgHandlerMock, stsHandlerMock);
            expect(msgArray.length).toBe(0);
            expect(statusArray.length).toBe(1);
            expect(statusArray.pop()).toStrictEqual(report)
        });


        it('should dispatch proper handler calls when not 200 response', async () => {
            const mock = jest.spyOn(axiosService, "getFlowReports");
            mock.mockResolvedValue({...success, status: 400});
            const msgArray = [];
            const statusArray = [];

            const msgHandlerMock = (msg) => {
                msgArray.push(msg);
            }
            const stsHandlerMock = (msg) => {
                statusArray.push(msg);
            }

            await getReport(msgHandlerMock, stsHandlerMock);
            expect(msgArray.length).toBe(1);
            expect(statusArray.length).toBe(0);
            expect(msgArray.pop()).toBe(networkErrorMsg)
        });


        it('should dispatch proper handler calls when error', async () => {
            const mock = jest.spyOn(axiosService, "getFlowReports");
            mock.mockImplementation(() => {
                throw new Error();
            })
            const msgArray = [];
            const statusArray = [];

            const msgHandlerMock = (msg) => {
                msgArray.push(msg);
            }
            const stsHandlerMock = (msg) => {
                statusArray.push(msg);
            }

            await getReport(msgHandlerMock, stsHandlerMock);
            expect(msgArray.length).toBe(1);
            expect(statusArray.length).toBe(0);
            expect(msgArray.pop()).toBe(networkErrorMsg)
        });


    });

    describe('getAllReports', () => {

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should dispatch proper handler calls when 200 response', async () => {
            const mock = jest.spyOn(axiosService, "getFlowReports");
            mock.mockResolvedValue(success);
            const msgArray = [];
            const statusArray = [];

            const msgHandlerMock = (msg) => {
                msgArray.push(msg);
            }
            const stsHandlerMock = (msg) => {
                statusArray.push(msg);
            }

            await getAllReports(msgHandlerMock, stsHandlerMock);
            expect(msgArray.length).toBe(3);
            expect(statusArray.length).toBe(1);
            expect(msgArray.pop()).toBe(doneLoadingMsg)
            expect(msgArray.pop()).toBe(loadingMsg)
            expect(statusArray.pop()).toStrictEqual(report)
        });


        it('should dispatch proper handler calls when not 200 response', async () => {
            const mock = jest.spyOn(axiosService, "getFlowReports");
            mock.mockResolvedValue({...success, status: 400});
            const msgArray = [];
            const statusArray = [];

            const msgHandlerMock = (msg) => {
                msgArray.push(msg);
            }
            const stsHandlerMock = (msg) => {
                statusArray.push(msg);
            }

            await getAllReports(msgHandlerMock, stsHandlerMock);
            expect(msgArray.length).toBe(4);
            expect(statusArray.length).toBe(0);
            expect(msgArray.pop()).toBe(doneLoadingMsg)
            expect(msgArray.pop()).toBe(networkErrorMsg)
            expect(msgArray.pop()).toBe(loadingMsg)
        });


        it('should dispatch proper handler calls when error', async () => {
            const mock = jest.spyOn(axiosService, "getFlowReports");
            mock.mockImplementation(() => {
                throw new Error();
            })
            const msgArray = [];
            const statusArray = [];

            const msgHandlerMock = (msg) => {
                msgArray.push(msg);
            }
            const stsHandlerMock = (msg) => {
                statusArray.push(msg);
            }

            await getAllReports(msgHandlerMock, stsHandlerMock);
            expect(msgArray.length).toBe(4);
            expect(statusArray.length).toBe(0);
            expect(msgArray.pop()).toBe(doneLoadingMsg)
            expect(msgArray.pop()).toBe(networkErrorMsg)
            expect(msgArray.pop()).toBe(loadingMsg)
        });


    });

});
