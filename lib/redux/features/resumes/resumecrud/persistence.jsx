"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hydrateResumes } from "./slice"; 

export default function ResumesPersistence() {
  const dispatch = useDispatch();
  const resumes = useSelector((state) => state.resumecrud);

  // 1. Hydrate on mount
  useEffect(() => {
    const saved = localStorage.getItem("jxh_resumes",JSON.stringify(resumes));
    if (saved) {
      dispatch(hydrateResumes(JSON.parse(saved)));
    }
  }, [dispatch]);

  // 2. Persist on change
  useEffect(() => {
    if (resumes.allResumes.length > 0) {
      localStorage.setItem("jxh_resumes", JSON.stringify(resumes));
    }
  }, [resumes]);

  return null;
}