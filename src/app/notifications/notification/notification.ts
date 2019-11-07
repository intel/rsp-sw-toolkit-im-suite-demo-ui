export interface Notification{
  created: string;
  modified: number;
  id: string;
  slug: string;
  sender: string;
  category: string;
  severity: string;
  content: string;
  status: string;
  labels: string[];
}
