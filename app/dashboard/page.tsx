'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Modal } from '@/components/modal';
import { RotationDetailsCard } from '@/components/rotation-details-card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Users, Building, Calendar, LayoutDashboard } from 'lucide-react';

// Mock data (replace with Supabase data fetching in the future)
const initialStudents: Student[] = [
  {
    id: 'S001',
    name: 'John Doe',
    email: 'john@example.com',
    year: 'D3',
    rotationStatus: 'Pending',
  },
  {
    id: 'S002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    year: 'D4',
    rotationStatus: 'Scheduled',
  },
  {
    id: 'S003',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    year: 'D3',
    rotationStatus: 'In Progress',
  },
  {
    id: 'S004',
    name: 'Bob Williams',
    email: 'bob@example.com',
    year: 'D4',
    rotationStatus: 'Completed',
  },
  {
    id: 'S005',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    year: 'D3',
    rotationStatus: 'Pending',
  },
];

const initialClinics: Clinic[] = [
  {
    id: 'C001',
    name: 'City Hospital',
    address: '123 Main St, Cityville',
    shift: '9AM-5PM',
    capacity: 10,
    spotsAvailable: 10,
    criteria: 'Both',
  },
  {
    id: 'C002',
    name: 'Rural Health Center',
    address: '456 Country Rd, Ruraltown',
    shift: '8AM-4PM',
    capacity: 5,
    spotsAvailable: 5,
    criteria: 'D3',
  },
  {
    id: 'C003',
    name: 'Suburban Clinic',
    address: '789 Suburb Ave, Suburbville',
    shift: '10AM-6PM',
    capacity: 8,
    spotsAvailable: 8,
    criteria: 'D4',
  },
  {
    id: 'C004',
    name: 'Downtown Medical Center',
    address: '101 Central Blvd, Downtown',
    shift: '7AM-3PM',
    capacity: 12,
    spotsAvailable: 12,
    criteria: 'Both',
  },
  {
    id: 'C005',
    name: 'Seaside Health Clinic',
    address: '202 Beach Rd, Coastville',
    shift: '11AM-7PM',
    capacity: 6,
    spotsAvailable: 6,
    criteria: 'D3',
  },
];

// Types
interface Student {
  id: string;
  name: string;
  email: string;
  year: 'D3' | 'D4';
  rotationStatus: 'Pending' | 'Scheduled' | 'In Progress' | 'Completed';
}

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

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<
    'dashboard' | 'students' | 'clinics' | 'rotations'
  >('dashboard');
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [clinics, setClinics] = useState<Clinic[]>(initialClinics);
  const [rotations, setRotations] = useState<Rotation[]>([]);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [isAddClinicModalOpen, setIsAddClinicModalOpen] = useState(false);
  const [isEditClinicModalOpen, setIsEditClinicModalOpen] = useState(false);
  const [currentClinic, setCurrentClinic] = useState<Clinic | null>(null);
  const [selectedRotation, setSelectedRotation] = useState<Rotation | null>(
    null
  );
  const [isRotationDetailsModalOpen, setIsRotationDetailsModalOpen] =
    useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [clinicSearchTerm, setClinicSearchTerm] = useState('');
  const [rotationSearchTerm, setRotationSearchTerm] = useState('');

  // Dashboard stats
  const stats = {
    totalStudents: students.length,
    totalClinics: clinics.length,
    totalRotations: rotations.length,
    scheduledStudents: students.filter(
      (s) =>
        s.rotationStatus === 'Scheduled' || s.rotationStatus === 'In Progress'
    ).length,
    availableSpots: clinics.reduce(
      (total, clinic) => total + clinic.spotsAvailable,
      0
    ),
  };

  // Student functions
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: `S00${students.length + 1}` };
    setStudents([...students, newStudent]);
    setIsAddStudentModalOpen(false);
    // TODO: Add Supabase integration to insert new student
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(
      students.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
    setIsEditStudentModalOpen(false);
    // TODO: Add Supabase integration to update student
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter((student) => student.id !== id));
    // TODO: Add Supabase integration to delete student
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  // Clinic functions
  const addClinic = (clinic: Omit<Clinic, 'id'>) => {
    const newClinic = { ...clinic, id: `C00${clinics.length + 1}` };
    setClinics([...clinics, newClinic]);
    setIsAddClinicModalOpen(false);
    // TODO: Add Supabase integration to insert new clinic
  };

  const updateClinic = (updatedClinic: Clinic) => {
    setClinics(
      clinics.map((clinic) =>
        clinic.id === updatedClinic.id ? updatedClinic : clinic
      )
    );
    setIsEditClinicModalOpen(false);
    // TODO: Add Supabase integration to update clinic
  };

  const deleteClinic = (id: string) => {
    setClinics(clinics.filter((clinic) => clinic.id !== id));
    // TODO: Add Supabase integration to delete clinic
  };

  const filteredClinics = clinics.filter(
    (clinic) =>
      clinic.name.toLowerCase().includes(clinicSearchTerm.toLowerCase()) ||
      clinic.id.toLowerCase().includes(clinicSearchTerm.toLowerCase())
  );

  // Rotation functions
  const generateSchedule = () => {
    const newRotations: Rotation[] = [];
    const updatedStudents = [...students];
    const updatedClinics = [...clinics];

    updatedStudents.forEach((student) => {
      const eligibleClinics = updatedClinics.filter(
        (clinic) =>
          clinic.spotsAvailable > 0 &&
          (clinic.criteria === 'Both' || clinic.criteria === student.year)
      );

      if (eligibleClinics.length >= 2) {
        const [fallClinic, springClinic] = eligibleClinics
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);

        newRotations.push({
          studentId: student.id,
          studentName: student.name,
          studentEmail: student.email,
          fallClinic,
          springClinic,
        });

        fallClinic.spotsAvailable--;
        springClinic.spotsAvailable--;
        student.rotationStatus = 'Scheduled';
      }
    });

    setRotations(newRotations);
    setStudents(updatedStudents);
    setClinics(updatedClinics);

    toast({
      title: 'Rotations Scheduled',
      description: `Successfully scheduled ${newRotations.length} out of ${students.length} students.`,
    });

    // TODO: Add Supabase integration to update rotations, students, and clinics
  };

  const filteredRotations = rotations.filter(
    (rotation) =>
      rotation.studentName
        .toLowerCase()
        .includes(rotationSearchTerm.toLowerCase()) ||
      rotation.studentId
        .toLowerCase()
        .includes(rotationSearchTerm.toLowerCase()) ||
      rotation.fallClinic.name
        .toLowerCase()
        .includes(rotationSearchTerm.toLowerCase()) ||
      rotation.springClinic.name
        .toLowerCase()
        .includes(rotationSearchTerm.toLowerCase())
  );

  const openRotationDetails = (rotation: Rotation) => {
    setSelectedRotation(rotation);
    setIsRotationDetailsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4 py-20">
      <h1 className="text-3xl font-bold mb-8">Clinical Rotation Admin Panel</h1>

      {/* Navigation */}
      <div className="flex space-x-2 mb-8">
        <Button
          variant={activeSection === 'dashboard' ? 'default' : 'outline'}
          onClick={() => setActiveSection('dashboard')}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button
          variant={activeSection === 'students' ? 'default' : 'outline'}
          onClick={() => setActiveSection('students')}
        >
          <Users className="mr-2 h-4 w-4" />
          Students
        </Button>
        <Button
          variant={activeSection === 'clinics' ? 'default' : 'outline'}
          onClick={() => setActiveSection('clinics')}
        >
          <Building className="mr-2 h-4 w-4" />
          Clinics
        </Button>
        <Button
          variant={activeSection === 'rotations' ? 'default' : 'outline'}
          onClick={() => setActiveSection('rotations')}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Rotations
        </Button>
      </div>

      {/* Dashboard Section */}
      {activeSection === 'dashboard' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                {stats.scheduledStudents} scheduled for rotation
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clinics
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClinics}</div>
              <p className="text-xs text-muted-foreground">
                {stats.availableSpots} spots available
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Rotations
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRotations}</div>
              <p className="text-xs text-muted-foreground">
                Across Fall and Spring semesters
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Students Section */}
      {activeSection === 'students' && (
        <div>
          <div className="flex justify-between mb-4">
            <Input
              placeholder="Search students..."
              value={studentSearchTerm}
              onChange={(e) => setStudentSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={() => setIsAddStudentModalOpen(true)}>
              Add Student
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Rotation Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>
                    <Badge
                      className={`
                      ${
                        student.rotationStatus === 'Pending'
                          ? 'bg-yellow-500'
                          : student.rotationStatus === 'Scheduled'
                            ? 'bg-blue-500'
                            : student.rotationStatus === 'In Progress'
                              ? 'bg-green-500'
                              : 'bg-purple-500'
                      } text-white`}
                    >
                      {student.rotationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentStudent(student);
                        setIsEditStudentModalOpen(true);
                      }}
                      className="mr-2"
                    >
                      Update
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteStudent(student.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Clinics Section */}
      {activeSection === 'clinics' && (
        <div>
          <div className="flex justify-between mb-4">
            <Input
              placeholder="Search clinics..."
              value={clinicSearchTerm}
              onChange={(e) => setClinicSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={() => setIsAddClinicModalOpen(true)}>
              Add Clinic
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Spots Available</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClinics.map((clinic) => (
                <TableRow key={clinic.id}>
                  <TableCell>{clinic.id}</TableCell>
                  <TableCell>{clinic.name}</TableCell>
                  <TableCell>{clinic.address}</TableCell>
                  <TableCell>{clinic.shift}</TableCell>
                  <TableCell>{clinic.capacity}</TableCell>
                  <TableCell>{clinic.spotsAvailable}</TableCell>
                  <TableCell>{clinic.criteria}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentClinic(clinic);
                        setIsEditClinicModalOpen(true);
                      }}
                      className="mr-2"
                    >
                      Update
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteClinic(clinic.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Rotations Section */}
      {activeSection === 'rotations' && (
        <div>
          <div className="flex justify-between mb-4">
            <Input
              placeholder="Filter rotations..."
              value={rotationSearchTerm}
              onChange={(e) => setRotationSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={generateSchedule}>Generate Schedule</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Fall Clinic</TableHead>
                <TableHead>Spring Clinic</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRotations.map((rotation) => (
                <TableRow key={rotation.studentId}>
                  <TableCell>{rotation.studentId}</TableCell>
                  <TableCell>{rotation.studentName}</TableCell>
                  <TableCell>{rotation.fallClinic.name}</TableCell>
                  <TableCell>{rotation.springClinic.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openRotationDetails(rotation)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        title="Add Student"
      >
        <StudentForm onSubmit={addStudent} />
      </Modal>

      <Modal
        isOpen={isEditStudentModalOpen}
        onClose={() => setIsEditStudentModalOpen(false)}
        title="Edit Student"
      >
        {currentStudent && (
          <StudentForm onSubmit={updateStudent} initialData={currentStudent} />
        )}
      </Modal>

      <Modal
        isOpen={isAddClinicModalOpen}
        onClose={() => setIsAddClinicModalOpen(false)}
        title="Add Clinic"
      >
        <ClinicForm onSubmit={addClinic} />
      </Modal>

      <Modal
        isOpen={isEditClinicModalOpen}
        onClose={() => setIsEditClinicModalOpen(false)}
        title="Edit Clinic"
      >
        {currentClinic && (
          <ClinicForm onSubmit={updateClinic} initialData={currentClinic} />
        )}
      </Modal>

      <Modal
        isOpen={isRotationDetailsModalOpen}
        onClose={() => setIsRotationDetailsModalOpen(false)}
        title="Rotation Details"
      >
        {selectedRotation && (
          <RotationDetailsCard rotation={selectedRotation} />
        )}
      </Modal>
    </div>
  );
}

// Student Form Component
function StudentForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (student: Omit<Student, 'id'>) => void;
  initialData?: Student;
}) {
  const [formData, setFormData] = useState<Omit<Student, 'id'>>(
    initialData || {
      name: '',
      email: '',
      year: 'D3',
      rotationStatus: 'Pending',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="year">Year</Label>
        <select
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="D3">D3</option>
          <option value="D4">D4</option>
        </select>
      </div>
      <div>
        <Label htmlFor="rotationStatus">Rotation Status</Label>
        <select
          id="rotationStatus"
          name="rotationStatus"
          value={formData.rotationStatus}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="Pending">Pending</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}

// Clinic Form Component
function ClinicForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (clinic: Omit<Clinic, 'id'>) => void;
  initialData?: Clinic;
}) {
  const [formData, setFormData] = useState<Omit<Clinic, 'id'>>(
    initialData || {
      name: '',
      address: '',
      shift: '',
      capacity: 0,
      spotsAvailable: 0,
      criteria: 'Both',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'capacity' || name === 'spotsAvailable'
          ? parseInt(value)
          : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="shift">Shift</Label>
        <Input
          id="shift"
          name="shift"
          value={formData.shift}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="capacity">Capacity</Label>
        <Input
          id="capacity"
          name="capacity"
          type="number"
          value={formData.capacity}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="spotsAvailable">Spots Available</Label>
        <Input
          id="spotsAvailable"
          name="spotsAvailable"
          type="number"
          value={formData.spotsAvailable}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="criteria">Criteria</Label>
        <select
          id="criteria"
          name="criteria"
          value={formData.criteria}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="D3">D3 students only</option>
          <option value="D4">D4 students only</option>
          <option value="Both">Both D3 and D4 students</option>
        </select>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
