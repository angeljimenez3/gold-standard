/* Program data — transcribed faithfully from Hannah's program docs. No invented content. */

export const FAT_LOSS = {
  slug: "fat-loss-program",
  title: "Fat Loss Foundation",
  subtitle: "The 12-Week Training Program",
  intro: "The goal of this program is sustainable fat loss through structured training, improved conditioning, and consistent habits. Consistency is the most important factor — the results come from showing up and putting in the work week after week.",
  split: ["Monday — Lower Body Strength + Conditioning", "Wednesday — Upper Body Strength + Conditioning", "Friday — Full Body Strength + Metabolic Training", "Saturday (Optional) — Cardio / Conditioning"],
  howTo: [
    "Exercises are written as: Exercise — Sets x Reps. Example: Goblet Squat — 3 x 10 means 3 sets of 10 repetitions.",
    "A superset means two exercises done back-to-back with no rest in between, then rest after both are done.",
    "A circuit means a series of exercises done one after another, then rest, then repeat.",
    "Strength exercises: rest 60–90 seconds. Conditioning circuits: rest as little as possible while maintaining good form.",
  ],
  phases: [
    {
      name: "Phase 1 — Build the Foundation", weeks: "Weeks 1–4",
      goal: "Build foundation, improve movement quality, establish consistency. Moderate weights, controlled tempo.",
      days: [
        { day: "Monday", label: "Lower Body + Conditioning", blocks: [
          { h: "Warm-Up", items: ["5–10 minutes light cardio (walking, cycling, stairs)"] },
          { h: "Superset", items: ["Goblet Squats — 3 x 10", "Romanian Deadlifts — 3 x 10"] },
          { h: "Superset", items: ["Walking Lunges — 3 x 12 each leg", "Single Leg Glute Bridges — 3 x 12 each leg"] },
          { h: "Core", items: ["Plank — 3 x 30 sec"] },
          { h: "Conditioning", items: ["Incline treadmill walk or stair master — 15 minutes, moderate pace"] },
        ]},
        { day: "Wednesday", label: "Upper Body", blocks: [
          { h: "Warm-Up", items: ["Band pull aparts: low, front, high — x12 each", "Arm circles: forward, backward — x10 each way", "Pushups — x10"] },
          { h: "Superset", items: ["Dumbbell Bench Press — 3 x 10", "Dumbbell Shoulder Press — 3 x 10"] },
          { h: "Superset", items: ["Seated Cable Row — 3 x 12", "Lat Pulldowns — 3 x 12"] },
          { h: "Superset", items: ["Bicep Curls — 3 x 12", "Tricep Pushdowns — 3 x 12"] },
          { h: "Conditioning", items: ["Row or bike intervals — 30 sec hard / 90 sec easy, 8 rounds"] },
        ]},
        { day: "Friday", label: "Full Body", blocks: [
          { h: "Warm-Up", items: ["10 minute cardio of your choice"] },
          { h: "Circuit", items: ["Deadlifts — 3 x 8", "Step Ups — 3 x 10 each leg", "Pushups — 3 x 10–12", "Medicine Ball Slams — 3 x 10"] },
          { h: "Core", items: ["Hanging Knee Raises — 3 x 12", "Dead Bug — 3 x 12 each side"] },
          { h: "Finisher — 3 rounds", items: ["Jump Rope — 60 sec", "Bodyweight Jump Squats — 15", "Mountain Climbers — 30 sec"] },
        ]},
        { day: "Saturday", label: "Optional", blocks: [
          { h: "Steady State Cardio", items: ["30–45 minutes: walking, hiking, cycling, or light jog", "Heart rate moderate or in fat-burn zone (typically 60–70% of your maximum heart rate)"] },
        ]},
      ],
    },
    {
      name: "Phase 2 — Build Momentum", weeks: "Weeks 5–8",
      goal: "Increase intensity and calorie expenditure. Increase weight slightly, shorten rest periods, more metabolic work designed to boost metabolism and maximize calorie burn.",
      days: [
        { day: "Monday", label: "Lower Body", blocks: [
          { h: "Warm-Up", items: ["10 minutes incline walk or stairs"] },
          { h: "Superset", items: ["Back Squats — 4 x 8", "Romanian Deadlifts — 4 x 8"] },
          { h: "Superset", items: ["Bulgarian Split Squats — 3 x 10 each", "Hip Thrusts — 3 x 10"] },
          { h: "Core", items: ["Hanging Leg Raises — 3 x 12", "Weighted Russian Twists — 3 x 20"] },
          { h: "Conditioning", items: ["Sled pushes or air bike intervals — 15 sec on / 45 sec active rest, 20 minutes", "Sled: push hard 15 sec, then jump rope or toe taps 45 sec. Air bike: hard 15, easy 45."] },
        ]},
        { day: "Wednesday", label: "Upper Body", blocks: [
          { h: "Warm-Up", items: ["Band pull aparts: 2x low, front, high — x12 each", "Arm circles: forward, backward — x10 each way", "Pushups — 2 x 10"] },
          { h: "Superset", items: ["Bench Press — 4 x 8", "Pull Ups (band assisted) or Lat Pulldowns — 4 x 8–10"] },
          { h: "Superset", items: ["Dumbbell Shoulder Press — 3 x 10", "Single Arm Bent Over Dumbbell Rows — 3 x 10"] },
          { h: "Superset", items: ["Bicep Curl — 3 x 12", "Tricep Rope Extension — 3 x 12"] },
          { h: "Burnout (light weight)", items: ["Lateral Raises — 3 x 10", "Front Raises — 3 x 10"] },
          { h: "Conditioning", items: ["Treadmill intervals — 40 sec hard / 80 sec easy, 10 rounds", "Hard can be increased incline or speed; easy can be reduced speed or incline."] },
        ]},
        { day: "Friday", label: "Full Body Metabolic", blocks: [
          { h: "Strength", items: ["Deadlifts — 4 x 6"] },
          { h: "Circuit", items: ["Dumbbell Thrusters — 3 x 10", "Walking Lunges — 3 x 12 each leg", "Pushups — 3 x max reps", "Weighted Russian Twists — 3 x 20"] },
          { h: "Finisher — 4 rounds", items: ["Kettlebell Swings — 20", "Burpees — 10", "Jump Rope — 60 sec"] },
        ]},
        { day: "Saturday", label: "Optional — choose one", blocks: [
          { h: "Option A", items: ["45–60 minute walk, moderate pace, moderate incline"] },
          { h: "Option B", items: ["20 minute cardio intervals — 30 sec hard / 60 sec light"] },
        ]},
      ],
    },
    {
      name: "Phase 3 — Peak Performance", weeks: "Weeks 9–12",
      goal: "Peak fat loss, higher intensity, metabolic conditioning. Workouts become more athletic and calorie demanding.",
      days: [
        { day: "Monday", label: "Lower Body Power", blocks: [
          { h: "Warm-Up", items: ["15 minutes cardio of your choice"] },
          { h: "Strength", items: ["Back Squats — 5 x 5", "Romanian Deadlifts — 4 x 8"] },
          { h: "Circuit", items: ["Split Jump Lunges — 3 x 12 each", "Box Jumps — 3 x 10", "Weighted Plank — 3 x 45 sec"] },
          { h: "Conditioning", items: ["Incline treadmill or stairmaster intervals — 30 sec hard / 60 sec walk, 15 rounds"] },
        ]},
        { day: "Wednesday", label: "Upper Body Strength", blocks: [
          { h: "Warm-Up", items: ["Band pull aparts: 3x low, front, high — x12 each", "Arm circles: forward, backward — x10 each way", "Pushups — 3 x 10"] },
          { h: "Strength", items: ["Bench Press — 5 x 5"] },
          { h: "Superset", items: ["Pull Ups — 4 x 8", "Dumbbell Shoulder Press — 4 x 8"] },
          { h: "Row", items: ["Renegade Rows — 3 x 10"] },
          { h: "Superset", items: ["Curls and Hammer Curls — 3 x 12", "Dips — 3 x 10"] },
          { h: "Burnout", items: ["Lateral Raises — 3 x 15", "Front Raises — 3 x 15"] },
          { h: "Conditioning", items: ["Row intervals — 500m row, rest 90 sec, 6 rounds"] },
        ]},
        { day: "Friday", label: "Full Body Fat Loss Circuit", blocks: [
          { h: "Warm-Up", items: ["10 minute cardio warm-up of your choice"] },
          { h: "Circuit — 4–5 rounds, rest 2 minutes between rounds", items: ["Kettlebell Swings — 20", "Dumbbell Thrusters — 12", "Weighted Jump Split Lunges — 15 each leg", "Pushups — 15", "Mountain Climbers — 40", "Jump Rope — 60 sec"] },
        ]},
        { day: "Saturday", label: "Optional", blocks: [
          { h: "Long Cardio Session", items: ["45–60 minutes: hiking, jogging, cycling, stair machine", "Goal: increase calorie expenditure without over-fatiguing the body."] },
        ]},
      ],
    },
  ],
  outro: [
    { h: "Program Progression", body: "Each week aim to: increase weight slightly, improve conditioning pace, and complete workouts consistently. Fat loss is driven by nutrition and training consistency." },
    { h: "Choosing Weight", body: "Select a weight that is challenging but still allows you to complete the prescribed repetitions with proper form. A good rule: the last 2 reps should feel difficult, and you should still maintain good technique." },
  ],
};

export const LEAN_MUSCLE = {
  slug: "lean-muscle-program",
  title: "Lean Muscle Development",
  subtitle: "The 12-Week Training Program",
  intro: "The Goldy Standard Lean Muscle Program: progressive overload, strength development, hypertrophy training, and muscle recovery. Rest periods are longer to allow heavier lifting.",
  split: ["Monday — Lower Body Strength", "Wednesday — Upper Body Strength", "Friday — Hypertrophy + Accessories", "Saturday — Optional recovery cardio"],
  howTo: [
    "Rep ranges: Strength 4–6 reps · Hypertrophy 8–12 reps · Accessories 12–15 reps.",
    "Strength sets: rest 2–3 minutes. Hypertrophy sets: rest 60–90 seconds.",
    "Tempo numbers like 3-1-1 mean: 3 seconds lowering, 1 second pause at the bottom, 1 second up.",
  ],
  phases: [
    {
      name: "Phase 1 — Muscle Foundation", weeks: "Weeks 1–4",
      goal: "Build strength base and movement quality.",
      days: [
        { day: "Monday", label: "Lower Body Strength", blocks: [
          { h: "Strength", items: ["Back Squat — 4 x 6", "Romanian Deadlift — 3 x 8", "Weighted Walking Lunges — 3 x 10 each leg", "Leg Press — 3 x 10", "Weighted Standing Calf Raises — 4 x 12"] },
          { h: "Core", items: ["Plank — 3 x 40 sec", "Hanging Knee Raises — 3 x 15"] },
          { h: "Conditioning", items: ["15 minute stair master or incline walk"] },
        ]},
        { day: "Wednesday", label: "Upper Body Strength", blocks: [
          { h: "Warm-Up", items: ["Band pull aparts: low, front, high — x12 each", "Arm circles: forward, backward — x10 each way", "Pushups — x10"] },
          { h: "Strength", items: ["Bench Press — 4 x 6", "Pull Ups or Lat Pulldown — 4 x 8", "Dumbbell Shoulder Press — 3 x 8", "Seated Cable Row — 3 x 10", "Bicep Curl — 3 x 12", "Tricep Pushdown — 3 x 12"] },
          { h: "Conditioning", items: ["15 minute row or air bike, low to moderate pace"] },
        ]},
        { day: "Friday", label: "Hypertrophy Day", blocks: [
          { h: "Strength", items: ["Deadlift — 3 x 8 (warm up to a good weight)"] },
          { h: "Leg Superset", items: ["Leg Curl — 3 x 10", "Leg Extension — 3 x 10", "Leg Press — 3 x 10"] },
          { h: "Upper Superset", items: ["Incline Dumbbell Press — 3 x 12", "Single Arm Bent Over Dumbbell Rows — 3 x 10"] },
          { h: "Shoulder Superset", items: ["Lateral Raises — 3 x 12", "Front Raises — 3 x 12"] },
          { h: "Core Superset", items: ["Hanging Leg Raises — 3 x 12", "Plank — 3 x 30 sec"] },
          { h: "Conditioning", items: ["8–10 rounds: 30 seconds moderate pace / 60 seconds easy pace — cardio of your choice"] },
        ]},
        { day: "Saturday", label: "Optional", blocks: [
          { h: "Recovery", items: ["30 min steady state cardio of your choice"] },
        ]},
      ],
    },
    {
      name: "Phase 2 — Progressive Overload", weeks: "Weeks 5–8",
      goal: "Increase strength and training volume.",
      days: [
        { day: "Monday", label: "Lower Body Strength", blocks: [
          { h: "Strength", items: ["Tempo Back Squat (3-1-1: 3 sec down, 1 sec pause, 1 sec up) — 5 x 5 (warm up to a working weight)", "Romanian Deadlift — 4 x 8"] },
          { h: "Superset", items: ["Bulgarian Split Squat — 3 x 10 each leg", "Leg Press — 3 x 12"] },
          { h: "Carry", items: ["Farmers Carry on your toes — 4 x 40 yards"] },
          { h: "Conditioning", items: ["20 minute stairmaster or incline walk"] },
        ]},
        { day: "Wednesday", label: "Upper Body Strength", blocks: [
          { h: "Warm-Up", items: ["Band pull aparts: 2x low, front, high — x12 each", "Arm circles: forward, backward — x10 each way", "Pushups — 2 x 10"] },
          { h: "Strength", items: ["Bench Press — 5 x 5"] },
          { h: "Superset", items: ["Pull Ups (band assisted) — 4 x 8", "Dumbbell Shoulder Press — 4 x 10"] },
          { h: "Row", items: ["Bent Over Barbell Row — 3 x 10"] },
          { h: "Superset", items: ["Bicep Curl / Hammer Curl — 3 x 12", "Tricep Extension — 3 x 12"] },
          { h: "Shoulder Finisher — 3 rounds", items: ["Lateral Raises — 10", "Rear Delt Fly — 10", "Front Raises — 10"] },
          { h: "Conditioning", items: ["15 minute row or air bike"] },
        ]},
        { day: "Friday", label: "Hypertrophy Builder", blocks: [
          { h: "Power", items: ["Hanging Squat Clean — 4 x 5"] },
          { h: "Superset", items: ["Single Leg Curl — 3 x 10 each leg", "Single Leg Extension — 3 x 10 each leg", "Weighted Walking Lunges — 3 x 12 each leg"] },
          { h: "Superset", items: ["Incline Dumbbell Bench — 4 x 10", "Renegade Rows — 4 x 10"] },
          { h: "Shoulder Pump Superset", items: ["Lateral Raises — 3 x 15", "Front Raises — 3 x 15", "Rear Delt Fly — 3 x 15"] },
          { h: "Core Superset", items: ["Hanging Leg Raises — 3 x 12", "Weighted Plank — 3 x 45 seconds"] },
          { h: "Conditioning", items: ["45 sec moderate pace / 60 sec active recovery — 10 rounds, cardio machine of your choice"] },
        ]},
        { day: "Saturday", label: "Optional", blocks: [
          { h: "Recovery", items: ["30 minutes steady state conditioning of your choice"] },
        ]},
      ],
    },
    {
      name: "Phase 3 — Strength & Muscle Peak", weeks: "Weeks 9–12",
      goal: "Maximize strength stimulus and muscle growth.",
      days: [
        { day: "Monday", label: "Lower Body Strength", blocks: [
          { h: "Strength", items: ["Tempo 3-1-1 Back Squat — 5 x 4"] },
          { h: "Superset", items: ["Single Leg RDL — 4 x 12", "Bulgarian Split Squats — 4 x 12 each leg"] },
          { h: "Press + Push", items: ["Leg Press — 4 x 12", "Sled Push — 4 x 40 yards"] },
          { h: "Conditioning", items: ["20 minute incline walk or stairmaster: 5 min warm up, 10 min of 30 sec hard / 30 sec active rest, 5 min cool down"] },
        ]},
        { day: "Wednesday", label: "Upper Body Strength", blocks: [
          { h: "Warm-Up", items: ["Band pull aparts: 2x low, front, high — x12 each", "Arm circles: forward, backward — x10 each way", "Pushups — 3 x 15"] },
          { h: "Strength", items: ["Bench Press — work up to a 4-rep max, then 5 x 4", "Weighted Pull Ups — 4 x 8"] },
          { h: "Superset", items: ["Single Arm Dumbbell Shoulder Press — 4 x 10 each arm", "Renegade Row — 4 x 10"] },
          { h: "Superset", items: ["Hammer Curl — 3 x 12", "Dips — 3 x 10"] },
          { h: "Shoulder Finisher — 3 rounds, rest 1 minute", items: ["Lateral Raises — 20", "Rear Delt Fly — 15", "Front Raises — 15", "Overhead Press — 15", "Front Raises — to failure"] },
          { h: "Conditioning", items: ["20 minute air bike or rower — 15 seconds hard / 45 seconds active rest"] },
        ]},
        { day: "Friday", label: "Hypertrophy Volume", blocks: [
          { h: "Warm-Up", items: ["10 minute stair master"] },
          { h: "Power", items: ["Squat Clean from Floor — 5 x 5"] },
          { h: "Push / Pull", items: ["Incline Bench — 3 x 10", "Pull Ups — 3 x 10", "Hand Release Push Ups — 3 x 12"] },
          { h: "Legs", items: ["Single Leg Curl (slow release: 1–2 sec curl, 3–4 sec release) — 3 x 12", "Single Leg Extension — 3 x 12, plus 1 set of leg extensions to failure"] },
          { h: "Superset", items: ["Lateral Raises — 4 x 15", "Front Raises — 4 x 15"] },
          { h: "Chest", items: ["Cable Fly — 3 x 12"] },
          { h: "Core Circuit — 3 rounds", items: ["Weighted Plank — 60 seconds", "Weighted Russian Twist — 20", "Hanging Leg Raises — 15"] },
          { h: "Cool Down", items: ["10 minute incline walk"] },
        ]},
        { day: "Saturday", label: "Optional", blocks: [
          { h: "Recovery", items: ["45 minutes steady state cardio"] },
        ]},
      ],
    },
  ],
  outro: [
    { h: "Training Focus", body: "Progressive overload, strength development, hypertrophy training, and muscle recovery. To continue seeing results your training must gradually become more challenging: increase weight, increase repetitions, increase sets, or improve exercise technique and control." },
  ],
};

export const FIGHTER = {
  slug: "fighter-conditioning-program",
  title: "Fighter Conditioning",
  subtitle: "The 12-Week Training Program",
  intro: "Fighters train differently than traditional athletes. The goal is not just to build muscle or lose fat — it's to develop a body that is strong, explosive, well-conditioned, and capable of performing under pressure. This program combines strength training, explosive power movements, high-intensity conditioning, core stability, and athletic endurance.",
  split: ["Monday — Strength & Power", "Wednesday — Conditioning Rounds", "Friday — Fighter Circuit", "Saturday (Optional) — Conditioning"],
  howTo: [
    "Rounds mean a series of exercises done back-to-back, then rest, then repeat.",
    "Intervals are time-based: \"30 seconds hard, 60 seconds easy\" means alternating those two intensities.",
    "Strength sets: 90 seconds to 2 minutes between heavy lifts. Conditioning rounds: rest as prescribed (usually 60 to 120 seconds between rounds).",
  ],
  phases: [
    {
      name: "Phase 1 — Conditioning Foundation", weeks: "Weeks 1–4",
      goal: "Build baseline endurance and learn fighter-style conditioning.",
      days: [
        { day: "Monday", label: "Strength & Power", blocks: [
          { h: "Warm-Up", items: ["Jump rope — 5–10 minutes"] },
          { h: "Strength", items: ["Front Squats — 4 x 6 (warm up to a weight where the last two reps feel tough)"] },
          { h: "Circuit", items: ["Dumbbell Push Press — 3 x 10", "Pull Ups or Lat Pulldowns — 3 x 10–12", "Weighted Walking Lunges — 3 x 15 each leg"] },
          { h: "Core", items: ["Plank — 3 x 45 sec", "Hanging Leg Raise — 3 x 15"] },
          { h: "Finisher", items: ["Battle ropes — 20 sec on / 40 sec rest, 8 rounds"] },
        ]},
        { day: "Wednesday", label: "Conditioning Rounds", blocks: [
          { h: "Warm-Up", items: ["10 minutes cardio of your choice"] },
          { h: "5 Rounds — rest 90 seconds between rounds", items: ["Row Machine — 400m", "Kettlebell Swings — 20", "Push Up Sit Outs — 15", "Mountain Climbers — 40"] },
        ]},
        { day: "Friday", label: "Fighter Circuit", blocks: [
          { h: "Warm-Up", items: ["Assault Bike — 10 seconds @ 500 watts / 50 seconds @ 100 watts, 10 rounds"] },
          { h: "4 Rounds — rest 2 minutes between rounds", items: ["Sled Push — 40 yards", "Burpees — 12", "Dumbbell Thrusters — 12", "Jump Rope — 60 sec", "Medicine Ball Slams — 15"] },
        ]},
        { day: "Saturday", label: "Optional", blocks: [
          { h: "Conditioning", items: ["4 rounds — Air Bike or Rower: 2:30 minutes moderate-hard pace (heart rate zones 3–4), 1:30 minute rest"] },
        ]},
      ],
    },
    {
      name: "Phase 2 — Power & Endurance", weeks: "Weeks 5–8",
      goal: "Increase explosiveness and work capacity.",
      days: [
        { day: "Monday", label: "Strength & Explosive Power", blocks: [
          { h: "Warm-Up", items: ["10 minutes jump rope"] },
          { h: "Strength", items: ["Back Squats — 5 x 5 (warm up to a weight where the last two reps feel tough)"] },
          { h: "Circuit", items: ["Barbell Push Press — 4 x 8", "Weighted Pull Ups — 4 x 8", "Box Jumps — 4 x 8", "Medicine Ball Slams — 4 x 8"] },
          { h: "Core (as circuit)", items: ["Weighted Plank — 3 x 60 sec", "Hanging Leg Raises — 3 x 20"] },
          { h: "Finisher", items: ["Sled Push Intervals — 30 sec push / 60 sec rest, 8 rounds"] },
        ]},
        { day: "Wednesday", label: "Fight Conditioning", blocks: [
          { h: "Warm-Up", items: ["15 minutes cardio of your choice"] },
          { h: "6 Rounds — rest 60 seconds between rounds", items: ["Assault Bike — 40 sec HARD", "Kettlebell Swings — 20", "Pushup Sit Outs — 15", "Jump Rope — 60 sec", "Rotational Medball Throws — 8 each side"] },
        ]},
        { day: "Friday", label: "Fighter Metabolic Circuit", blocks: [
          { h: "Warm-Up", items: ["Assault Bike — 10 sec @ 550 watts / 50 seconds @ 100 watts, 20 rounds"] },
          { h: "5 Rounds — rest 2 minutes between rounds", items: ["Farmers Carry — 40 yards", "Burpees — 15", "Dumbbell Snatch — 10 each arm", "Jump Lunges — 20", "Battle Ropes — 20–30 seconds"] },
        ]},
        { day: "Saturday", label: "Optional", blocks: [
          { h: "Conditioning", items: ["Long conditioning session — 40–50 minutes", "OR 5 rounds — Air Bike/Rower: 3 minutes moderate to high pace (zone 3–4), 1.5 minute rest"] },
        ]},
      ],
    },
    {
      name: "Phase 3 — Elite Fighter Conditioning", weeks: "Weeks 9–12",
      goal: "Maximize endurance, explosiveness, and conditioning.",
      days: [
        { day: "Monday", label: "Explosive Strength", blocks: [
          { h: "Warm-Up", items: ["20 minute treadmill: 5 minutes walk on incline, 5 minutes jog, 10 minutes alternating 30 second sprint / 30 second active recovery"] },
          { h: "Strength", items: ["Front Squat — 5 x 5 (warm up to a weight that feels tough to finish the last rep)"] },
          { h: "Circuit", items: ["Barbell Hanging Clean and Press — 4 x 10", "Weighted Pull Ups — 4 x 10", "Seated Box Jumps — 4 x 12", "Kettlebell Swings — 4 x 15"] },
          { h: "Core (as circuit)", items: ["Hanging Leg Raises — 3 x 20", "Weighted Plank — 3 x 60 secs", "Med Ball Slams — 3 x 15"] },
          { h: "Finisher", items: ["Battle ropes — 30 sec on / 30 sec rest, 10 rounds"] },
        ]},
        { day: "Wednesday", label: "Fight Simulation Rounds", blocks: [
          { h: "Warm-Up", items: ["5 minutes jump rope"] },
          { h: "5 Rounds HARD — rest 1 minute between rounds (perform like fight rounds)", items: ["Assault Bike — 60 sec", "Landmine Rotation — 10 each side", "Hand Release Push Ups — 15", "Kettlebell Swings — 25", "Burpees — 20", "Mountain Climbers — 50"] },
          { h: "Cool Down", items: ["20 minute steady state cardio"] },
        ]},
        { day: "Friday", label: "Conditioning Gauntlet", blocks: [
          { h: "Warm-Up", items: ["Assault bike — 15 seconds @ 550 watts / 45 seconds @ 100 watts, 20 rounds"] },
          { h: "5 Rounds — rest 2 minutes between rounds", items: ["Sled Push — 40 yards", "Barbell Thrusters — 15", "Jump Rope — 90 sec", "Burpee Push Ups — 15", "Farmers Carry — 40 yards"] },
        ]},
        { day: "Saturday", label: "Optional", blocks: [
          { h: "Recovery", items: ["Recovery cardio — 45–60 minutes", "OR 6 rounds — Air Bike/Rower: 3.5 minutes moderate to high pace (zone 3–4), 1 minute rest"] },
        ]},
      ],
    },
  ],
  outro: [
    { h: "The Fighter's Mindset", body: "Training like a fighter requires discipline and mental toughness. Most of these workouts will feel challenging — that's part of the process. The goal is not just to finish the workout, it's to develop the resilience and conditioning that comes from pushing your limits and getting comfortable being uncomfortable." },
  ],
};
