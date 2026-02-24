import { useState } from 'react';
import { Users, Shield, User } from 'lucide-react';
import { useGetAllUsers, useAssignUserRole } from '../../hooks/useQueries';
import { UserRole } from '../../backend';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Principal } from '@icp-sdk/core/principal';

export default function UserManagement() {
  const { data: users, isLoading } = useGetAllUsers();
  const assignRole = useAssignUserRole();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleRoleChange = async (principal: Principal, role: string) => {
    const principalStr = principal.toString();
    setUpdatingId(principalStr);
    try {
      const roleEnum = role === 'admin' ? UserRole.admin : UserRole.user;
      await assignRole.mutateAsync({ user: principal, role: roleEnum });
      toast.success('Role updated successfully');
    } catch {
      toast.error('Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-brand text-3xl font-bold text-foreground">
          User <span className="text-neon-cyan">Management</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {users?.length ?? 0} registered users
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl bg-secondary/50" />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">User</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Principal ID</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {(users ?? []).map(([principal, profile]) => {
                  const principalStr = principal.toString();
                  return (
                    <tr
                      key={principalStr}
                      className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center shrink-0">
                            {profile.role === 'admin' ? (
                              <Shield size={14} className="text-neon-cyan" />
                            ) : (
                              <User size={14} className="text-muted-foreground" />
                            )}
                          </div>
                          <span className="font-medium text-foreground">{profile.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{profile.email}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-muted-foreground truncate max-w-[120px] block">
                          {principalStr.slice(0, 20)}...
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={profile.role}
                          onValueChange={(v) => handleRoleChange(principal, v)}
                          disabled={updatingId === principalStr}
                        >
                          <SelectTrigger className="w-28 h-7 text-xs bg-secondary/50 border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(users ?? []).length === 0 && (
              <div className="py-12 text-center">
                <Users size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No registered users yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
