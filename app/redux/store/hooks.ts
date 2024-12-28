import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

import { AppDispatch, RootState } from "./store";

type DispatchFuntion = () => AppDispatch;

export const useCommentDispatch: DispatchFuntion = useDispatch;
export const useSeeCommentsDispatch: DispatchFuntion = useDispatch;

export const useCommentsSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useSeeCommentsSelector: TypedUseSelectorHook<RootState> = useSelector;