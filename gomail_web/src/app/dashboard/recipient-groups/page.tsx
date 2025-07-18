import {
  RecipientGroupTable,
} from "./components/recipient-group-table";

export default function RecipientGroupsPage() {
  // TODO: Implement server-side data fetching and pass as fallbackData
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">收件人分群管理</h1>
      <RecipientGroupTable />
    </div>
  );
}
