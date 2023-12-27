import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../../../../Services/operations/courseDetailsApi";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";
import RenderSteps from "../AddCourses/RenderSteps";

function EditCourse() {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await getFullDetailsOfCourse(courseId, token);
      console.log("Bro check kro", result);
      if (result?.courseDetails) {
        dispatch(setEditCourse(true));
        dispatch(setCourse(result?.courseDetails));
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <div>
      <h2 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Course
      </h2>
      <div className="mx-auto max-w-[600px]">
        {course ? (
          <RenderSteps />
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Course not found
          </p>
        )}
      </div>
    </div>
  );
}

export default EditCourse;
