import React from "react";

export interface ExamCardProps {
  eid: string;
  title: string;
  date: string;
  onClick: () => void;
  selected?: boolean;
}

export default function ExamCard({
  eid,
  title,
  date,
  onClick,
  selected,
}: ExamCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        borderRadius: 15,
        padding: "15px",
        background: selected ? "#f6f4f2" : "#f6f4f2",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-2px)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "translateY(0px)")
      }
    >
      <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem", color: "#000000" }}>
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: "0.9rem", color: "#3f3f3fff" }}>
        <strong>تاریخ:</strong> {date}
      </p>
    </div>
  );
}
