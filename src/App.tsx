import React, { useState, useEffect } from "react";
import SetupView from "./components/SetupView";
import LotteryView from "./components/LotteryView";
import { defaultNames } from "./data/defaultNames"; // ✅ الأسماء الافتراضية

export enum AppView {
  SETUP = "SETUP",
  LOTTERY = "LOTTERY",
}

export interface Participant {
  name: string;
  center: string;
}

const STORAGE_KEY = "thawab_names_lottery_participants";

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.SETUP);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // ✅ تحميل الأسماء (إما من LocalStorage أو من defaultNames)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    // 1) إذا يوجد بيانات محفوظة استخدمها
    if (saved) {
      try {
        setParticipants(JSON.parse(saved));
        return;
      } catch (e) {
        console.error("Error loading data from localStorage:", e);
      }
    }

    // 2) إذا لا يوجد بيانات محفوظة -> استخدم defaultNames
    const initial: Participant[] = defaultNames.map((name) => ({
      name,
      center: "", // ✅ لا نستخدم المركز الآن، لكن نتركه حتى لا يحدث خطأ TypeScript
    }));

    setParticipants(initial);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  }, []);

  const handleStartLottery = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newParticipants));
    setView(AppView.LOTTERY);
  };

  // ✅ حذف الفائز (اسم واحد فقط)
  const handleRemoveWinner = (winner: Participant) => {
    let removed = false;

    const updated = participants.filter((p) => {
      if (!removed && p.name === winner.name) {
        removed = true;
        return false;
      }
      return true;
    });

    setParticipants(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleBackToSetup = () => {
    setView(AppView.SETUP);
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      {view === AppView.SETUP ? (
        <SetupView
          onStart={handleStartLottery}
          initialParticipants={participants}
        />
      ) : (
        <LotteryView
          participants={participants}
          onBack={handleBackToSetup}
          onRemoveWinnerCenter={handleRemoveWinner}
        />
      )}
    </div>
  );
};

export default App;
