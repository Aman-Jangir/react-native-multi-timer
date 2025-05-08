# Timer App

This is a React Native Timer Application that allows users to create, start, pause, and reset timers for different categories such as **Workout**, **Study**, and **Break**. The app saves timer history locally using `AsyncStorage` and provides real-time progress tracking with `ProgressBar`.

## 🛠️ Setup Instructions
1. **Clone the repository:**  
   `git clone https://github.com/Aman-Jangir/react-native-multi-timer.git`  
   `cd timerApp`  

2. **Install dependencies:**  
   Ensure you have **Node.js** and **npm** installed, then run:  
   `npm install`  

3. **Run the app:**  
   `npx expo start`  


## 🌟 Assumptions
- State management is handled using `useState` and `useEffect`.  
- Each timer functions independently and updates are handled with `setInterval` on a 1-second interval.  
- Timers are grouped by category (Workout, Study, Break), and bulk actions are limited to timers within the same category.  
- Timer data is stored and retrieved using `AsyncStorage`.  
- `react-native-paper` is used for consistent UI and theming.  
- `useRef` is used to manage `setInterval` IDs to prevent memory leaks.  
- State updates are batched to improve performance and minimize re-renders.  

## ✅ Troubleshooting
- If the app doesn't build, try clearing the cache:  
`npx react-native start --reset-cache`  

