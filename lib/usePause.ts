import { useVideoCtx } from "./ScreenContainer";
import {useEffect, useRef} from "react";

const usePaused = (initialPaused: boolean = false) => {
  const { paused, setPaused } = useVideoCtx()
  const ref = useRef(false)
  useEffect(() => {
    ref.current = true
    setPaused(initialPaused)
  }, [])
  return !ref.current ? initialPaused : paused
}

export default usePaused