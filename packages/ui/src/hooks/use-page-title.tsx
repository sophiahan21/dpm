import { useEffect } from "react";

interface IUseHeadParams {
  title?: string;
}

export const useHead = ({ title }: IUseHeadParams) => {
  useEffect(() => {
    if (title) {
      document.title = title ?? "DPM |  Deveoplment project management.";
    }
  }, [title]);
};
