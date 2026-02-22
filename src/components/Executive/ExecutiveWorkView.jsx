import React, { useState, useMemo } from "react";
import HeaderSection from '../Executive/HeaderSection';
import FilterSection from '../Executive/FilterSection';
import StatsCards from '../Executive/StatsCards';
import FormsTable from '../Executive/FormsTable';

import LocationForm from "../Executive/LocationForm";
// import "./ExecutiveWorkView.css";

const ExecutiveWorkView = ({ executive, onBack, onRefresh }) => {
  const [viewMode, setViewMode] = useState("list");
  const [selectedForm, setSelectedForm] = useState(null);
  const [customDate, setCustomDate] = useState("");

  const getTodayDate = () => new Date().toISOString().split("T")[0];

 
  const filteredForms = useMemo(() => {
  if (!executive.forms) return [];

  // If no date selected → show all data
  if (!customDate) return executive.forms;

  const filterDate = new Date(customDate);
  filterDate.setHours(0, 0, 0, 0);

  return executive.forms.filter((form) => {
    const formDate = new Date(form.createdAt);
    formDate.setHours(0, 0, 0, 0);

    return formDate.getTime() === filterDate.getTime();
  });
}, [executive.forms, customDate]);

  const stats = {
    total: filteredForms.length,
    interested: filteredForms.filter(f => f.status === "INTERESTED").length,
    onboarded: filteredForms.filter(f => f.status === "ONBOARDED").length,
    notInterested: filteredForms.filter(f => f.status === "NOT_INTERESTED").length,
  };

  return (
    <div className="executive-work-view">
      <HeaderSection executive={executive} onBack={onBack} />

      {viewMode === "list" ? (
        <>
          <FilterSection
            customDate={customDate}
            setCustomDate={setCustomDate}
            filteredCount={filteredForms.length}
            getTodayDate={getTodayDate}
        />

          <StatsCards stats={stats} />

          <FormsTable forms={filteredForms} />
        </>
      ) : (
        <LocationForm
          initialData={selectedForm}
          readOnly={!!selectedForm}
          onSubmit={() => {
            setViewMode("list");
            onRefresh();
          }}
        />
      )}
    </div>
  );
};

export default ExecutiveWorkView;