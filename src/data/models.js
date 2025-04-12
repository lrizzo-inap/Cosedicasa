// src/data/models.js
export const CHORE_STATUS = {
  NEW: "new",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  DENIED_RESET: "denied_reset", 
  DENIED_REMOVE: "denied_remove",
  COMPLETED: "completed"
};

export const initialState = {
  kids: [
    { id: 1, name: "Child 1", xp: 0, avatar: "👦", color: "bg-blue-100" },
    { id: 2, name: "Child 2", xp: 0, avatar: "👧", color: "bg-pink-100" }
  ],
  chores: [],
  rewards: [],
  logs: [],
  settings: {
    gracePeriodHours: 2,
    penaltyMultiplier: 1.5,
    lastEditor: null
  }
};

export const useData = () => {
  const [data, setData] = useState(loadData());
  useEffect(() => saveData(data), [data]);
  return { data, setData };
};