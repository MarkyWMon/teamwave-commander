export type TeamPersonnel = {
  id: string;
  name: string;
  role: 'manager' | 'coach' | 'fixtures_secretary' | 'administrator';
  email: string;
  phone?: string;
};

export type TeamColors = {
  primary: string;
  alternate: string;
};

export type WeeklySchedule = {
  dayOfWeek: string;
  time: string;
  location?: string;
};

export type Team = {
  id: string;
  name: string;
  isOpponent: boolean;
  ageGroup: string;
  gender: 'boys' | 'girls' | 'mixed';
  division?: string;
  colors: TeamColors;
  weeklySchedule: WeeklySchedule;
  personnel: TeamPersonnel[];
  createdAt: Date;
  updatedAt: Date;
};