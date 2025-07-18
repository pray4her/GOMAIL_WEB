export interface Account {
  id: number;
  name: string;
  domain: string;
  access_key_id: string;
  access_key_secret?: string; // Secret is often write-only
  daily_send_limit: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
} 