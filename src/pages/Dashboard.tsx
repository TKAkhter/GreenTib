import React from "react";
import { FileList } from "../components/FileUpload/FileList";
import { FileUpload } from "../components/FileUpload/FileUpload";

const Dashboard: React.FC = () => {
  return (
    <>
      <FileUpload />
      <div className="my-10">
        <div className="divider"></div>
        <FileList />
      </div>
    </>
  );
};

export default Dashboard;