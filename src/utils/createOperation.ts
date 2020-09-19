import { RootState, AppDispatch } from 'store';

export interface Actions {
    startAction?: any;
    successAction?: any;
    failAction?: any;
}

export interface ProcessFunction<T> {
    payload: T;
    dispatch: AppDispatch;
    getState: () => RootState;
}

interface Params<T, K> {
    actions: Actions;
    process: (params: ProcessFunction<K>) => Promise<T>;
}

const createOperation = <K = any, T = any>({ actions = {}, process }: Params<T, K>) => (payload: K) => async (
    dispatch: AppDispatch,
    getState: () => RootState,
) => {
    const { startAction, successAction, failAction } = actions;
    startAction && dispatch(startAction(payload));

    try {
        const result = await process({ payload, dispatch, getState });
        successAction && dispatch(successAction({ result, params: payload }));
        return result;
    } catch (error) {
        failAction && dispatch(failAction(error));
        return Promise.reject(error);
    }
};

export default createOperation;
