<script setup>
import { ref, onMounted } from 'vue';

// 1. Configuration - Pointing to your LIVE Render Backend
// Change this:
// const API_URL = "http://localhost:3000/api/moods";

// To this:
const API_URL = "https://se2-lab6-backend-q2vx.onrender.com/api/moods";

// 2. Reactive State
const formData = ref({
  user_id: '',     // Maps to 'Your Name' in the UI
  mood_label: '',  // The emoji/text string
  mood_level: 5,   // Default intensity (Scale 1-10)
  note: ''         // Optional additional text
});

const moodLogs = ref([]);
const loading = ref(false);

// 3. Fetch existing moods from Railway via Render
const fetchMoods = async () => {
  try {
    const res = await fetch(`${API_URL}/moods`);
    if (!res.ok) throw new Error("Could not fetch data");
    moodLogs.value = await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

// Load data when page opens
onMounted(fetchMoods);

// 4. Submit New Mood Entry
const submitMood = async () => {
  if (!formData.value.user_id || !formData.value.mood_label) {
    alert("Please enter your name and select a mood!");
    return;
  }

  loading.value = true;
  try {
    const res = await fetch(`${API_URL}/moods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value)
    });
    
    if (!res.ok) throw new Error("Server error");
    
    // Success feedback
    alert(`Entry saved for ${formData.value.user_id}!`);
    
    // Reset inputs but keep the name for convenience
    formData.value.mood_label = '';
    formData.value.note = '';
    
    // Refresh the list automatically
    await fetchMoods(); 
    
  } catch (err) {
    console.error(err);
    alert("Connection error! Ensure your Render service is 'Active'.");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main>
    <div class="container">
      <header>
        <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="50" height="50" />
        <h1>Mood Tracker</h1>
      </header>
      
      <p class="subtitle">SE2 Lab 6 - Full Stack Deployment</p>

      <div class="card">
        <div class="input-group">
          <label for="name">Your Name</label>
          <input v-model="formData.user_id" id="name" type="text" placeholder="e.g. Edward">
        </div>

        <div class="input-group">
          <label for="mood">Current Mood</label>
          <select v-model="formData.mood_label" id="mood">
            <option disabled value="">Select your mood</option>
            <option>Happy 😊</option>
            <option>Anxious 😟</option>
            <option>Productive 🚀</option>
            <option>Tired 😴</option>
            <option>Excited ✨</option>
          </select>
        </div>

        <div class="input-group">
          <label>Mood Intensity (1-10)</label>
          <input type="range" v-model="formData.mood_level" min="1" max="10">
          <span class="intensity-val">{{ formData.mood_level }}</span>
        </div>

        <button @click="submitMood" :disabled="loading" class="submit-btn">
          {{ loading ? 'Saving to Railway...' : 'Submit Entry' }}
        </button>
      </div>

      <div v-if="moodLogs.length > 0" class="history-section">
        <h3>Recent Check-ins</h3>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Mood</th>
                <th>Level</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in moodLogs" :key="log.id">
                <td>{{ log.user_id }}</td>
                <td>{{ log.mood_label }}</td>
                <td>{{ log.mood_level }}/10</td>
                <td class="time-cell">{{ new Date(log.logged_at).toLocaleTimeString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container { 
  max-width: 500px; 
  margin: 40px auto; 
  font-family: 'Inter', sans-serif; 
  text-align: center; 
  padding: 0 20px;
}

header { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 0.5rem; }
.subtitle { color: #666; margin-bottom: 2rem; font-size: 0.85rem; }

.card { 
  background: white; 
  padding: 25px; 
  border-radius: 16px; 
  box-shadow: 0 10px 25px rgba(0,0,0,0.05); 
  border: 1px solid #eaeaea;
  margin-bottom: 30px;
}

.input-group { margin-bottom: 18px; text-align: left; }
label { display: block; font-weight: 600; margin-bottom: 6px; color: #2c3e50; font-size: 0.9rem;}
input, select { width: 100%; padding: 10px; border: 1px solid #dcdfe6; border-radius: 8px; font-size: 1rem; }
.intensity-val { font-weight: bold; color: #42b883; display: block; margin-top: 5px;}

.submit-btn { 
  width: 100%; padding: 12px; background: #42b883; color: white; border: none; 
  border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.2s;
}
.submit-btn:hover { background: #3aa876; }
.submit-btn:disabled { background: #ccc; }

/* History Table Styling */
.history-section { margin-top: 20px; text-align: left; }
.history-section h3 { font-size: 1.1rem; color: #2c3e50; border-bottom: 2px solid #42b883; display: inline-block; padding-bottom: 4px;}
.table-wrapper { overflow-x: auto; background: white; border-radius: 12px; margin-top: 10px; border: 1px solid #eee; }
table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
th { background: #f9fafb; padding: 10px; text-align: left; color: #6b7280; }
td { padding: 10px; border-top: 1px solid #f3f4f6; }
.time-cell { color: #9ca3af; font-size: 0.75rem; }
</style>