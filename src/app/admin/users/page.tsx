"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  PlusCircle,
  User,
  Shield,
  Mail,
  Clock,
  Search,
  Edit,
  Lock,
  Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useRequireAuth, createUser, updateUserRole, getAllUsers } from '@/app/admin/auth';
import { AppUser, UserRole, hasPermission, ResourceType, PermissionType } from '@/lib/permissions';

export default function UsersPage() {
  const { user, loading } = useRequireAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState<AppUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // New user dialog state
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>(UserRole.VIEWER);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit user dialog state
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [editUserRole, setEditUserRole] = useState<UserRole>(UserRole.VIEWER);
  const [editUserActive, setEditUserActive] = useState(true);

  // Effect to check if admin and fetch users
  useEffect(() => {
    if (!loading && user) {
      // Check if user has permission to view users
      if (!hasPermission(user, ResourceType.USER, PermissionType.READ)) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view this page.",
          variant: "destructive"
        });
        return;
      }

      fetchUsers();
    }
  }, [loading, user]);

  // Apply filters when search query or role filter changes
  useEffect(() => {
    if (users.length > 0) {
      let filtered = [...users];

      // Apply role filter
      if (roleFilter !== 'all') {
        filtered = filtered.filter(u => u.role === roleFilter);
      }

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(u =>
          u.displayName.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
        );
      }

      setFilteredUsers(filtered);
    }
  }, [users, searchQuery, roleFilter]);

  // Fetch all users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      toast({
        title: "Error fetching users",
        description: "There was a problem loading the users.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle create user
  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserName || !newUserPassword) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createUser(
        newUserEmail,
        newUserPassword,
        newUserName,
        newUserRole
      );

      if (result.success) {
        toast({
          title: "User created",
          description: `User ${newUserName} has been created successfully.`,
          variant: "default"
        });

        // Reset form and close dialog
        setNewUserEmail('');
        setNewUserName('');
        setNewUserPassword('');
        setNewUserRole(UserRole.VIEWER);
        setIsNewUserDialogOpen(false);

        // Refresh user list
        fetchUsers();
      } else {
        toast({
          title: "Error creating user",
          description: result.message || "An unknown error occurred.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error creating user",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit user dialog
  const handleEditUserClick = (user: AppUser) => {
    setSelectedUser(user);
    setEditUserRole(user.role);
    setEditUserActive(user.isActive);
    setIsEditUserDialogOpen(true);
  };

  // Handle update user
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);

    try {
      const result = await updateUserRole(
        selectedUser.id,
        editUserRole,
        editUserActive
      );

      if (result) {
        toast({
          title: "User updated",
          description: `User ${selectedUser.displayName} has been updated successfully.`,
          variant: "default"
        });

        // Close dialog and refresh users
        setIsEditUserDialogOpen(false);
        fetchUsers();
      } else {
        toast({
          title: "Error updating user",
          description: "Failed to update user. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error updating user",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Never";

    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get role badge
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
      case UserRole.EDITOR:
        return <Badge className="bg-blue-100 text-blue-800">Editor</Badge>;
      case UserRole.AUTHOR:
        return <Badge className="bg-green-100 text-green-800">Author</Badge>;
      case UserRole.VIEWER:
        return <Badge className="bg-gray-100 text-gray-800">Viewer</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  // If still loading auth state, show loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user doesn't have permission, show access denied
  if (!user || !hasPermission(user, ResourceType.USER, PermissionType.READ)) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-500">
              You don't have permission to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>

        {hasPermission(user, ResourceType.USER, PermissionType.CREATE) && (
          <Button
            onClick={() => setIsNewUserDialogOpen(true)}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New User
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <Select
                value={roleFilter}
                onValueChange={setRoleFilter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                  <SelectItem value={UserRole.EDITOR}>Editor</SelectItem>
                  <SelectItem value={UserRole.AUTHOR}>Author</SelectItem>
                  <SelectItem value={UserRole.VIEWER}>Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-right text-sm text-gray-500 flex items-center justify-end">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Users Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchQuery || roleFilter !== 'all' ?
                  "No users match your current filters. Try changing your search criteria." :
                  "There are no users in the system. Click 'New User' to add one."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(userItem => (
                    <TableRow key={userItem.id}>
                      <TableCell className="font-medium">{userItem.displayName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {userItem.email}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(userItem.role)}</TableCell>
                      <TableCell>
                        {userItem.isActive ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {formatDate(userItem.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(userItem.lastLogin)}</TableCell>
                      <TableCell className="text-right">
                        {hasPermission(user, ResourceType.USER, PermissionType.UPDATE) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUserClick(userItem)}
                            className="gap-1"
                            disabled={user.id === userItem.id} // Prevent editing self
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New User Dialog */}
      <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. They will receive access based on their assigned role.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={newUserRole}
                onValueChange={(value) => setNewUserRole(value as UserRole)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-red-500" />
                      <span>Admin</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={UserRole.EDITOR}>
                    <div className="flex items-center gap-2">
                      <Edit className="h-4 w-4 text-blue-500" />
                      <span>Editor</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={UserRole.AUTHOR}>
                    <div className="flex items-center gap-2">
                      <Edit className="h-4 w-4 text-green-500" />
                      <span>Author</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={UserRole.VIEWER}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>Viewer</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewUserDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={isSubmitting || !newUserEmail || !newUserName || !newUserPassword}
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user role and status.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="mb-4">
                <h3 className="font-medium">{selectedUser.displayName}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <Select
                  value={editUserRole}
                  onValueChange={(value) => setEditUserRole(value as UserRole)}
                >
                  <SelectTrigger className="col-span-3" id="edit-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-500" />
                        <span>Admin</span>
                      </div>
                    </SelectItem>
                    <SelectItem value={UserRole.EDITOR}>
                      <div className="flex items-center gap-2">
                        <Edit className="h-4 w-4 text-blue-500" />
                        <span>Editor</span>
                      </div>
                    </SelectItem>
                    <SelectItem value={UserRole.AUTHOR}>
                      <div className="flex items-center gap-2">
                        <Edit className="h-4 w-4 text-green-500" />
                        <span>Author</span>
                      </div>
                    </SelectItem>
                    <SelectItem value={UserRole.VIEWER}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>Viewer</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={editUserActive ? "active" : "inactive"}
                  onValueChange={(value) => setEditUserActive(value === "active")}
                >
                  <SelectTrigger className="col-span-3" id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Active</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>Inactive</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditUserDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUser}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
