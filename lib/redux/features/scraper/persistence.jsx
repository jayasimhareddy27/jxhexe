"use client";
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateJobData } from './slice'; 

export default function ScraperPersistence() {
  const dispatch = useDispatch();
  const { jobData } = useSelector((state) => state.scraper);
  const isHydrated = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !isHydrated.current) {
      const savedResume = sessionStorage.getItem("selected_resume_id");
      const savedCL = sessionStorage.getItem("selected_cl_id");

      if (savedResume || savedCL) {
        dispatch(updateJobData({
          resumeId: savedResume || "",
          coverLetterId: savedCL || ""
        }));
      }
      isHydrated.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    if (isHydrated.current && typeof window !== "undefined") {
      if (jobData.resumeId) sessionStorage.setItem("selected_resume_id", jobData.resumeId);
      if (jobData.coverLetterId) sessionStorage.setItem("selected_cl_id", jobData.coverLetterId);
    }
  }, [jobData.resumeId, jobData.coverLetterId]);

  return null; 
}