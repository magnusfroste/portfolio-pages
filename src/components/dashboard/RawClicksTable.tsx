
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RawClick } from "@/hooks/useDashboardData";

interface RawClicksTableProps {
  rawClicks: RawClick[];
}

export const RawClicksTable = ({ rawClicks }: RawClicksTableProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Recent Clicks (Development Only)</h2>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Project Title</TableHead>
              <TableHead>Clicked At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rawClicks.map((click) => (
              <TableRow key={click.id}>
                <TableCell>{click.id}</TableCell>
                <TableCell>{click.project_title}</TableCell>
                <TableCell>{format(new Date(click.clicked_at), 'MMM dd, yyyy HH:mm:ss')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
