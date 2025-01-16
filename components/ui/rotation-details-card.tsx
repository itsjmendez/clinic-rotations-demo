import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Clinic {
  id: string;
  name: string;
  address: string;
  shift: string;
  capacity: number;
  spotsAvailable: number;
  criteria: 'D3' | 'D4' | 'Both';
}

interface Rotation {
  studentId: string;
  studentName: string;
  studentEmail: string;
  fallClinic: Clinic;
  springClinic: Clinic;
}

interface RotationDetailsCardProps {
  rotation: Rotation;
}

export function RotationDetailsCard({ rotation }: RotationDetailsCardProps) {
  const downloadDetails = () => {
    const details = `
Student ID: ${rotation.studentId}
Student Name: ${rotation.studentName}
Student Email: ${rotation.studentEmail}

Fall Rotation:
Clinic: ${rotation.fallClinic.name}
Clinic ID: ${rotation.fallClinic.id}
Address: ${rotation.fallClinic.address}
Shift: ${rotation.fallClinic.shift}

Spring Rotation:
Clinic: ${rotation.springClinic.name}
Clinic ID: ${rotation.springClinic.id}
Address: ${rotation.springClinic.address}
Shift: ${rotation.springClinic.shift}
    `.trim();

    const blob = new Blob([details], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rotation.studentName.replace(' ', '_')}_rotation_details.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{rotation.studentName}'s Rotation Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Student ID:</strong> {rotation.studentId}
        </p>
        <p>
          <strong>Email:</strong> {rotation.studentEmail}
        </p>
        <h3 className="font-semibold mt-4">Fall Rotation</h3>
        <p>
          <strong>Clinic:</strong> {rotation.fallClinic.name}
        </p>
        <p>
          <strong>Clinic ID:</strong> {rotation.fallClinic.id}
        </p>
        <p>
          <strong>Address:</strong> {rotation.fallClinic.address}
        </p>
        <p>
          <strong>Shift:</strong> {rotation.fallClinic.shift}
        </p>
        <h3 className="font-semibold mt-4">Spring Rotation</h3>
        <p>
          <strong>Clinic:</strong> {rotation.springClinic.name}
        </p>
        <p>
          <strong>Clinic ID:</strong> {rotation.springClinic.id}
        </p>
        <p>
          <strong>Address:</strong> {rotation.springClinic.address}
        </p>
        <p>
          <strong>Shift:</strong> {rotation.springClinic.shift}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={downloadDetails}>Download Details</Button>
      </CardFooter>
    </Card>
  );
}
