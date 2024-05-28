import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import DiaryDetail from "./feat_diary/DiaryDetail";
import DiaryCalendar from "./feat_diary/DiaryCalendar";
import AddDiary from "./feat_diary/AddDiary";
import QuestionList from "./question/QuestionList";
import Navbar from "./Navbar";

function App() {
  return (
    <div className="app-wrapper">
    <div className="app-container">
    
    <Routes>
      {/* 일기 */}
      <Route path="/diary" element={<DiaryCalendar />} />
      <Route path="/diary/detail" element={<DiaryDetail />} />
      <Route path="/diary/add" element={<AddDiary />} />

      {/* 1일 1질문 */}
      <Route path="/question" element={<QuestionList />} />

    </Routes>
    </div>
    <Navbar />
    </div>
  );
}

export default App;
