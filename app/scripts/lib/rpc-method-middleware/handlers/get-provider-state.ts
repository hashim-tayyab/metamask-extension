import type {
  JsonRpcEngineNextCallback,
  JsonRpcEngineEndCallback,
} from '@metamask/json-rpc-engine';
import type {
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcParams,
  Json,
} from '@metamask/utils';
import { MESSAGE_TYPE } from '../../../../../shared/constants/app';
import {
  HandlerWrapperType,
  getProviderStateType,
  ProviderStateHandlerResult,
} from './handlers-helper';

type getProviderStateImplementationType<
  Params extends JsonRpcParams = JsonRpcParams,
  Result extends Json = Json,
> = {
  implementation: (
    _req: JsonRpcRequest<Params>,
    res: JsonRpcResponse<Result>,
    _next: JsonRpcEngineNextCallback,
    end: JsonRpcEngineEndCallback,
    { _getProviderState }: Record<string, getProviderStateType>,
  ) => Promise<void>;
} & HandlerWrapperType;

/**
 * This RPC method gets background state relevant to the provider.
 * The background sends RPC notifications on state changes, but the provider
 * first requests state on initialization.
 */

const getProviderState: getProviderStateImplementationType = {
  methodNames: [MESSAGE_TYPE.GET_PROVIDER_STATE],
  implementation: getProviderStateHandler,
  hookNames: {
    getProviderState: true,
  },
};
export default getProviderState;

/**
 * @typedef {object} ProviderStateHandlerOptions
 * @property {() => ProviderStateHandlerResult} getProviderState - A function that
 * gets the current provider state.
 */

/**
 * @param _req - The JSON-RPC request object.
 * @param res - The JSON-RPC response object.
 * @param _next - The json-rpc-engine 'next' callback.
 * @param end - The json-rpc-engine 'end' callback.
 * @param options
 * @param options.getProviderState
 */
async function getProviderStateHandler<
  Params extends JsonRpcParams = JsonRpcParams,
  Result extends Json = Json,
>(
  _req: JsonRpcRequest<Params>,
  res: JsonRpcResponse<Result>,
  _next: JsonRpcEngineNextCallback,
  end: JsonRpcEngineEndCallback,
  {
    getProviderState: _getProviderState,
  }: Record<string, (origin: string) => Promise<ProviderStateHandlerResult>>,
): Promise<void> {
  res.result = {
    ...(await _getProviderState((origin = _req.origin))),
  };
  return end();
}
