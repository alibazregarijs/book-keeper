import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

import { AppDispatch, RootState } from "./store";

type DispatchFuntion = () => AppDispatch;

export const useCommentDispatch: DispatchFuntion = useDispatch;

export const useCommentSelector: TypedUseSelectorHook<RootState> = useSelector;
