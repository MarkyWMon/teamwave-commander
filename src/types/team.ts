export type TeamPersonnel = {
  id: string;
  name: string;
  role: 'manager' | 'coach' | 'assistant_manager' | 'other';
  email?: string;
  phone?: string;
};

export type Team = {
  id: string;
  name: string;
  age_group: string;
  created_at: string;
  created_by: string;
  is_opponent: boolean;
  gender: 'boys' | 'girls' | 'mixed';
  team_officials: TeamOfficial[];
};

export type TeamOfficial = {
  id: string;
  team_id: string;
  full_name: string;
  role: 'manager' | 'coach' | 'assistant_manager' | 'other';
  email?: string;
  phone?: string;
  created_at: string;
};