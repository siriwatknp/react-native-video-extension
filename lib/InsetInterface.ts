export interface EdgeInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

let actualUseInsets = (): EdgeInsets | undefined => undefined;
export const connectUseInsets = (hook: typeof actualUseInsets) => {
  actualUseInsets = hook;
};

const useInsets = () => actualUseInsets();

export default useInsets;
