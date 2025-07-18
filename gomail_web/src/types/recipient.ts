export interface Recipient {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}
  
export interface Pagination {
  page: number;
  pageSize: number;
  total_records: number;
  total_pages: number;
}
  
export interface PaginatedRecipients {
  records: Recipient[];
  pagination: Pagination;
}

export interface RecipientImportTask {
  id: number;
  task_name: string;
  file_name: string;
  file_size: number;
  file_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_records: number;
  processed_records: number;
  success_records: number;
  failed_records: number;
  error_message: string | null;
  created_by_user_id: number;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  completed_at: string | null;
  created_by_user?: { // Assuming this might be optional or expanded
    id: number;
    username: string;
  };
}

export interface PaginatedRecipientImportTasks {
  records: RecipientImportTask[];
  pagination: {
    total_records: number;
    page: number;
    pageSize: number;
    total_pages: number;
  };
} 