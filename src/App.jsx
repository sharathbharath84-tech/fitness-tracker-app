import { useEffect, useState } from "react"; import { Card, CardContent } from "@/components/ui/card"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function App() { const [entries, setEntries] = useState([]); const [goalWeight, setGoalWeight] = useState(65); const [form, setForm] = useState({ weight: "", calories: "", protein: "", water: "", sleep: "", workout: "" });

useEffect(() => { const data = localStorage.getItem("fitness_entries"); if (data) setEntries(JSON.parse(data));

const goal = localStorage.getItem("goal_weight");
if (goal) setGoalWeight(goal);

}, []);

useEffect(() => { localStorage.setItem("fitness_entries", JSON.stringify(entries)); }, [entries]);

useEffect(() => { localStorage.setItem("goal_weight", goalWeight); }, [goalWeight]);

const addEntry = () => { if (!form.weight) return;

const newEntry = {
  ...form,
  date: new Date().toISOString().slice(0, 10)
};

setEntries([newEntry, ...entries]);
setForm({ weight: "", calories: "", protein: "", water: "", sleep: "", workout: "" });

};

const avgWeight = () => { if (entries.length === 0) return 0; const total = entries.reduce((sum, e) => sum + parseFloat(e.weight || 0), 0); return (total / entries.length).toFixed(1); };

const chartData = entries.slice().reverse().map(e => ({ date: e.date, weight: parseFloat(e.weight) }));

return ( <div className="p-4 max-w-3xl mx-auto space-y-4"> <h1 className="text-2xl font-bold">Fitness Tracker Pro</h1>

<Card>
    <CardContent className="pt-4 space-y-2">
      <Input
        placeholder="Set Goal Weight (kg)"
        value={goalWeight}
        onChange={(e) => setGoalWeight(e.target.value)}
      />
      <div>Goal: {goalWeight} kg | Current Avg: {avgWeight()} kg</div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="pt-4 space-y-2">
      <Input placeholder="Weight (kg)" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
      <Input placeholder="Calories" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} />
      <Input placeholder="Protein (g)" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} />
      <Input placeholder="Water (L)" value={form.water} onChange={(e) => setForm({ ...form, water: e.target.value })} />
      <Input placeholder="Sleep (hrs)" value={form.sleep} onChange={(e) => setForm({ ...form, sleep: e.target.value })} />
      <Input placeholder="Workout Notes" value={form.workout} onChange={(e) => setForm({ ...form, workout: e.target.value })} />
      <Button onClick={addEntry}>Add Entry</Button>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="pt-4" style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="weight" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>

  <div className="space-y-2">
    {entries.map((e, i) => (
      <Card key={i}>
        <CardContent className="pt-4 text-sm">
          <div><strong>Date:</strong> {e.date}</div>
          <div><strong>Weight:</strong> {e.weight} kg</div>
          <div><strong>Calories:</strong> {e.calories}</div>
          <div><strong>Protein:</strong> {e.protein} g</div>
          <div><strong>Water:</strong> {e.water} L</div>
          <div><strong>Sleep:</strong> {e.sleep} hrs</div>
          <div><strong>Workout:</strong> {e.workout}</div>
        </CardContent>
      </Card>
    ))}
  </div>
</div>

); }
