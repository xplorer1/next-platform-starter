'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AppShell, ProtectedRoute } from '@/components'

// Dynamic import to prevent SSR issues
const UserOnboarding = dynamic(() => import('@/components/admin/UserOnboarding').then(mod => ({ default: mod.UserOnboarding })), {
  ssr: false
})
import { useAuth } from '@/hooks/useAuth'
import { MockUserService } from '@/lib/services'
import { User } from '@/types'
import { 
  Users, 
  UserPlus, 
  BarChart3, 
  Settings, 
  Search, 
  Filter,
  Mail,
  CheckCircle,
  XCircle,
  Calendar,
  GraduationCap,
  Building,
  Shield,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react'

type ViewMode = 'dashboard' | 'users' | 'onboarding' | 'analytics'

function AdminUsersContent() {
  const { user } = useAuth()
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'CAREER_OFFICER'>('ALL')
  const [analytics, setAnalytics] = useState<any>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  useEffect(() => {
    if (currentView === 'users') {
      loadUsers()
    } else if (currentView === 'analytics') {
      loadAnalytics()
    }
  }, [currentView])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await MockUserService.getAllUsers()
      if (response.success && response.data) {
        setUsers(response.data)
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAnalytics = async () => {
    setAnalyticsLoading(true)
    try {
      const response = await MockUserService.getSystemAnalytics()
      if (response.success && response.data) {
        setAnalytics(response.data)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const handleUserCreated = (newUser: User) => {
    setUsers(prev => [newUser, ...prev])
    setCurrentView('users')
  }

  const handleUserStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await MockUserService.updateUserStatus(userId, !currentStatus)
      if (response.success && response.data) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? response.data! : user
        ))
      }
    } catch (error) {
      console.error('Failed to update user status:', error)
    }
  }

  const handleEmailVerificationToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await MockUserService.updateEmailVerification(userId, !currentStatus)
      if (response.success && response.data) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? response.data! : user
        ))
      }
    } catch (error) {
      console.error('Failed to update email verification:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.primaryEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    students: users.filter(u => u.role === 'USER').length,
    careerOfficers: users.filter(u => u.role === 'CAREER_OFFICER').length,
    verifiedEmails: users.filter(u => u.emailVerified).length
  }

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h2>
        <p className="text-red-100">
          Manage the JobPlat Job Board platform and user accounts from this admin dashboard.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Students/Alumni</p>
              <p className="text-2xl font-bold text-gray-900">{stats.students}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Building className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Career Officers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.careerOfficers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button
          onClick={() => setCurrentView('onboarding')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-shadow"
          data-tour="user-management"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserPlus className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="ml-3 font-medium text-gray-900">User Onboarding</h3>
          </div>
          <p className="text-sm text-gray-600">Create new user accounts for students, alumni, and staff</p>
        </button>

        <button
          onClick={() => setCurrentView('users')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="ml-3 font-medium text-gray-900">User Management</h3>
          </div>
          <p className="text-sm text-gray-600">View and manage existing user accounts and permissions</p>
        </button>

        <button
          onClick={() => setCurrentView('analytics')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-shadow"
          data-tour="analytics"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="ml-3 font-medium text-gray-900">System Analytics</h3>
          </div>
          <p className="text-sm text-gray-600">View platform metrics and user activity insights</p>
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" data-tour="system-settings">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="ml-3 font-medium text-gray-900">System Settings</h3>
          </div>
          <p className="text-sm text-gray-600">Configure platform settings and preferences</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">New user account created</p>
              <p className="text-xs text-gray-500">Alice Uwimana joined as Student - 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Email verification completed</p>
              <p className="text-xs text-gray-500">Jean Baptiste verified secondary email - 4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-purple-100 rounded-full">
              <Building className="h-4 w-4 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Career Officer account activated</p>
              <p className="text-xs text-gray-500">Dr. Sarah Johnson account activated - 1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUserManagement = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">View and manage all user accounts on the platform</p>
        </div>
        <button
          onClick={() => setCurrentView('onboarding')}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="ALL">All Roles</option>
              <option value="USER">Students/Alumni</option>
              <option value="CAREER_OFFICER">Career Officers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.primaryEmail}</div>
                          {user.secondaryEmail && (
                            <div className="text-xs text-gray-400">{user.secondaryEmail}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.role === 'USER' && <GraduationCap className="h-4 w-4 text-purple-600 mr-2" />}
                        {user.role === 'CAREER_OFFICER' && <Building className="h-4 w-4 text-orange-600 mr-2" />}
                        {user.role === 'ADMIN' && <Shield className="h-4 w-4 text-red-600 mr-2" />}
                        <span className="text-sm text-gray-900">
                          {user.role === 'USER' ? 'Student/Alumni' : 
                           user.role === 'CAREER_OFFICER' ? 'Career Officer' : 'Admin'}
                        </span>
                      </div>
                      {user.role === 'USER' && user.graduationYear && (
                        <div className="text-xs text-gray-500">Class of {user.graduationYear}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.emailVerified 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <Mail className="h-3 w-3 mr-1" />
                          {user.emailVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {user.createdAt.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleUserStatusToggle(user.id, user.isActive)}
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.isActive 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                          title={user.isActive ? 'Deactivate user' : 'Activate user'}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => handleEmailVerificationToggle(user.id, user.emailVerified)}
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.emailVerified 
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                          title={user.emailVerified ? 'Mark as unverified' : 'Mark as verified'}
                        >
                          {user.emailVerified ? 'Unverify' : 'Verify'}
                        </button>
                        <button className="text-blue-600 hover:text-blue-900" title="View details">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No users found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderAnalytics = () => {
    if (analyticsLoading) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Analytics</h2>
            <p className="text-gray-600">Platform metrics and user activity insights</p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="ml-3 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      )
    }

    if (!analytics) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Analytics</h2>
            <p className="text-gray-600">Platform metrics and user activity insights</p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">Failed to load analytics data</p>
            <button 
              onClick={loadAnalytics}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Analytics</h2>
          <p className="text-gray-600">Platform metrics and user activity insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified Emails</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.verifiedUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">+12%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Verification Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Email Verification Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Verified</span>
                <span className="text-sm font-medium text-green-600">{analytics.verifiedUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Verification</span>
                <span className="text-sm font-medium text-yellow-600">{analytics.unverifiedUsers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${(analytics.verifiedUsers / analytics.totalUsers) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {Math.round((analytics.verifiedUsers / analytics.totalUsers) * 100)}% of users have verified their email addresses
              </p>
            </div>
          </div>

          {/* User Distribution by Role */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Distribution by Role</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">Students/Alumni</span>
                </div>
                <span className="text-sm font-medium text-purple-600">{analytics.usersByRole.USER || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-orange-600 mr-2" />
                  <span className="text-sm text-gray-600">Career Officers</span>
                </div>
                <span className="text-sm font-medium text-orange-600">{analytics.usersByRole.CAREER_OFFICER || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm text-gray-600">Administrators</span>
                </div>
                <span className="text-sm font-medium text-red-600">{analytics.usersByRole.ADMIN || 0}</span>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Active Accounts</span>
                </div>
                <span className="text-sm font-medium text-green-600">{analytics.activeUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm text-gray-600">Inactive Accounts</span>
                </div>
                <span className="text-sm font-medium text-red-600">{analytics.inactiveUsers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${(analytics.activeUsers / analytics.totalUsers) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {Math.round((analytics.activeUsers / analytics.totalUsers) * 100)}% of accounts are currently active
              </p>
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth Trend</h3>
            <div className="space-y-3">
              {analytics.userGrowth.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(item.count / 50) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent System Activity</h3>
          <div className="space-y-4">
            {analytics.recentActivity.map((activity: any) => (
              <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  activity.type === 'user_created' ? 'bg-green-100' :
                  activity.type === 'email_verified' ? 'bg-blue-100' :
                  'bg-purple-100'
                }`}>
                  {activity.type === 'user_created' && <UserPlus className="h-4 w-4 text-green-600" />}
                  {activity.type === 'email_verified' && <Mail className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'status_changed' && <Settings className="h-4 w-4 text-purple-600" />}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.type === 'user_created' && 'New user account created'}
                    {activity.type === 'email_verified' && 'Email verification completed'}
                    {activity.type === 'status_changed' && 'Account status changed'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.userName} - {activity.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentView === 'dashboard'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('users')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentView === 'users'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentView === 'analytics'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'users' && renderUserManagement()}
      {currentView === 'onboarding' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">User Onboarding</h2>
              <p className="text-gray-600">Create new user accounts for the JobPlat Job Board platform</p>
            </div>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Back to Dashboard
            </button>
          </div>
          <UserOnboarding 
            onUserCreated={handleUserCreated}
            onCancel={() => setCurrentView('dashboard')}
          />
        </div>
      )}
      {currentView === 'analytics' && renderAnalytics()}
    </div>
  )
}

function AdminUsersPage() {
  return (
    <AppShell>
      <ProtectedRoute requiredRole="ADMIN">
        <AdminUsersContent />
      </ProtectedRoute>
    </AppShell>
  )
}

// Export as dynamic component to prevent SSR issues
export default dynamic(() => Promise.resolve(AdminUsersPage), {
  ssr: false
})