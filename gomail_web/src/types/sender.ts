import { Account } from "@/types/account";

export interface Sender {
  id: number;
  name: string;
  role: string;
  contact_info: string;
  created_at: string;
  updated_at: string;
}

export interface AccountSender {
  id: number;
  account_id: number;
  sender_id: number;
  email_address: string;
  weight: number;
  daily_send_limit: number;
  status: string;
  created_at: string;
  updated_at: string;
  account: Account;
  sender: Sender;
}

export interface AccountSendersResponse {
  account_senders: AccountSender[];
  total_count: number;
  page: number;
  page_size: number;
} 