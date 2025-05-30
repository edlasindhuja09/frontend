"use client"

import { useState, useEffect } from "react"

const UserManagement = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  // State management
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [editingUser, setEditingUser] = useState<any>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "",
    status: "",
    schoolName: "",
    schoolAdminName: ""
  })
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedSchool, setSelectedSchool] = useState<string>("")
  const [schools, setSchools] = useState<any[]>([])

  // Fetch users based on filters
  // Update the fetchUsers function
// Fetch users based on filters
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")
      let url = `${backendUrl}/admin/users?search=${searchTerm}`
      
      if (activeTab === "students") {
        url += `&userType=student`
      } else if (activeTab !== "all") {
        const userTypeMap: Record<string, string> = {
          schools: "school",
          admins: "admin",
          sales: "sales"
        }
        url += `&userType=${userTypeMap[activeTab]}`
      } else if (selectedRole) {
        url += `&userType=${selectedRole}`
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`)
      }

      const data = await response.json()
      setUsers(data.users || [])
      setFilteredUsers(data.users || [])
    } catch (error: any) {
      setError(error.message)
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Apply filters whenever search, role, or tab changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, 300) // Debounce the search

    return () => clearTimeout(timer)
  }, [searchTerm, selectedRole, activeTab])
// Update the useEffect for filtering
useEffect(() => {
  if (activeTab === "students") {
    if (selectedSchool) {
      const filtered = users.filter((user) => {
        return user.userType === "student" && 
               (user.schoolId === selectedSchool || 
                user.schoolName?.toLowerCase() === schools.find(s => s._id === selectedSchool)?.schoolName?.toLowerCase());
      });
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users.filter(user => user.userType === "student"));
    }
  } else if (activeTab === "sales") {
    setFilteredUsers(users.filter(user => user.userType === "sales"));
  } else if (activeTab !== "all") {
    const typeMap: Record<string, string> = {
      schools: "school",
      admins: "admin"
    };
    setFilteredUsers(users.filter(user => user.userType === typeMap[activeTab]));
  } else {
    setFilteredUsers(users);
  }
}, [selectedSchool, users, activeTab, schools]);
  // Fetch schools for the filter dropdown
  const fetchSchools = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${backendUrl}/admin/users?userType=school`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch schools")
      }

      const data = await response.json()
      setSchools(data.users)
    } catch (error: any) {
      console.error("Error fetching schools:", error)
    }
  }

  // Apply filters whenever search, role, or tab changes
  useEffect(() => {
    fetchUsers()
    if (activeTab === "students") {
      fetchSchools()
    }
  }, [searchTerm, selectedRole, activeTab])

  // Apply school filter when selected school changes
  useEffect(() => {
  if (activeTab === "students") {
    if (selectedSchool) {
      const schoolObj = schools.find((s) => s._id === selectedSchool);
      const selectedSchoolName = (schoolObj?.schoolName || schoolObj?.name || "")
        .toLowerCase()
        .trim();

      const filtered = users.filter((user) => {
        if (user.userType !== "student") return false;

        const userSchoolName = user.schoolName?.toLowerCase().trim() || "";
        const nestedSchoolName = user.school?.schoolName?.toLowerCase().trim() || "";

        return (
          userSchoolName === selectedSchoolName ||
          nestedSchoolName === selectedSchoolName
        );
      });

      setFilteredUsers(filtered);
    } else {
      // If "All Schools" selected, show all students
      const allStudents = users.filter((user) => user.userType === "student");
      setFilteredUsers(allStudents);
    }
  } else {
    setFilteredUsers(users);
  }
}, [selectedSchool, users, activeTab, schools]);



  // Notification helper
  const showNotification = (message: string) => {
    setSuccessMessage(message)
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  // File upload handlers
  const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0])
    }
  }

  const handleFileSubmit = async () => {
    if (!uploadFile) return

    const formData = new FormData()
    formData.append("file", uploadFile)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${backendUrl}/api/register-sales`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const result = await response.json()
      showNotification("File uploaded and sales members stored successfully!")
      setShowUploadModal(false)
      setUploadFile(null)
      fetchUsers()
    } catch (error: any) {
      console.error("Error uploading file:", error.message)
      setError(error.message)
    }
  }

  // User status management
  const handleActivateDeactivate = async (userId: string, status: string) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${backendUrl}/admin/change-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, status }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`)
      }

      const data = await response.json()
      setUsers(prevUsers =>
        prevUsers.map(user => (user._id === userId ? { ...user, status: data.user.status } : user))
      );
      setFilteredUsers(prevUsers =>
        prevUsers.map(user => (user._id === userId ? { ...user, status: data.user.status } : user))
      );
      showNotification(`User ${status === "active" ? "activated" : "deactivated"} successfully!`);
    } catch (error: any) {
      setError(error.message)
      console.error("Error updating user status:", error)
    }
  }

  // User deletion
  const handleDelete = async (userId: string) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${backendUrl}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      await response.json()
      showNotification("User deleted successfully!")
      fetchUsers()
    } catch (error: any) {
      setError(error.message)
      console.error("Error deleting user:", error)
    }
  }

  // User editing
  const handleEdit = (user: any) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      userType: user.userType,
      status: user.status,
      schoolName: user.schoolName || "",
      schoolAdminName: user.schoolAdminName || ""
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async () => {
    if (!editingUser) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${backendUrl}/admin/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update user")

      const data = await response.json()
      showNotification("User updated successfully!")
      setEditingUser(null)
      fetchUsers()
    } catch (error: any) {
      setError(error.message)
      console.error("Error updating user:", error)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg mx-4">
        Error: {error}
        <button onClick={() => setError(null)} className="ml-4 text-red-700 font-bold">
          &times;
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">User Types</h2>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => {
                  setActiveTab("all")
                  setSelectedSchool("")
                }}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === "all" ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Users
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("schools")
                  setSelectedSchool("")
                }}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === "schools" ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Schools
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("students")
                  setSelectedSchool("")
                }}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === "students" ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Students
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("admins")
                  setSelectedSchool("")
                }}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === "admins" ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Admins
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("sales")
                  setSelectedSchool("")
                }}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === "sales" ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Sales
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-8 md:py-12">
        {/* Success Notification */}
        {showSuccess && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 sm:px-6 py-3 rounded-lg shadow-lg">
              <span className="block sm:inline text-center">{successMessage}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-education-dark">User Management</h2>
        </div>
        
        {activeTab === "sales" && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Sales Members
            </button>
          </div>
        )}

        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white p-6 rounded-xl w-11/12 max-w-md shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Upload Sales Members</h3>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUploadChange}
                className="mb-4"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFileSubmit}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search users..."
            className="border border-gray-300 px-4 py-2 rounded-lg w-full sm:w-1/2 md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full sm:w-1/3 md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="school">School Admin</option>
            <option value="admin">Admin</option>
            <option value="sales">Sales</option>
          </select>
          {activeTab === "students" && schools.length > 0 && (
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg w-full sm:w-1/3 md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">All Schools</option>
              {schools.map((school) => (
                <option key={school._id} value={school._id}>
                  {school.schoolName || school.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Edit Form */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-lg w-full space-y-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Edit User: {editingUser.name}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-sm text-gray-600">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-2 border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Name"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-2 border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Email"
                  />
                </div>
              </div>

              {editingUser.userType === "school" && (
                <>
                  <div className="flex flex-col">
                    <label htmlFor="schoolName" className="text-sm text-gray-600">
                      School Name
                    </label>
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      className="mt-2 border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="School Name"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="schoolAdminName" className="text-sm text-gray-600">
                      School Admin Name
                    </label>
                    <input
                      type="text"
                      name="schoolAdminName"
                      value={formData.schoolAdminName}
                      onChange={handleInputChange}
                      className="mt-2 border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="School Admin Name"
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col">
                <label htmlFor="userType" className="text-sm text-gray-600">
                  User Type
                </label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  className="mt-2 border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="student">Student</option>
                  <option value="school">School Admin</option>
                  <option value="admin">Admin</option>
                  <option value="sales">Sales</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="status" className="text-sm text-gray-600">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-2 border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4">
                <button
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 order-2 sm:order-1"
                  onClick={handleUpdate}
                >
                  Save
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 order-1 sm:order-2"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
{/* Users Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <div className="min-w-full overflow-hidden overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No users found
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
                  <tr>
                    {activeTab === "schools" ? (
                      <>
                        <th className="px-4 sm:px-6 py-3">School Name</th>
                        <th className="px-4 sm:px-6 py-3">Email</th>
                        <th className="px-4 sm:px-6 py-3">Role</th>
                        <th className="px-4 sm:px-6 py-3">School Admin Name</th>
                        <th className="px-4 sm:px-6 py-3">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 sm:px-6 py-3">Name</th>
                        <th className="px-4 sm:px-6 py-3">Email</th>
                        <th className="px-4 sm:px-6 py-3">Role</th>
                        {activeTab === "students" && <th className="px-4 sm:px-6 py-3">School</th>}
                        <th className="px-4 sm:px-6 py-3">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm divide-y">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      {activeTab === "schools" ? (
                        <>
                          <td className="px-4 sm:px-6 py-4 font-medium">{user.schoolName || user.name}</td>
                          <td className="px-4 sm:px-6 py-4 truncate max-w-[150px] sm:max-w-none">{user.email}</td>
                          <td className="px-4 sm:px-6 py-4 capitalize">{user.userType}</td>
                          <td className="px-4 sm:px-6 py-4">{user.name || "-"}</td>
                          <td className="px-4 sm:px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 sm:px-6 py-4 font-medium">{user.name}</td>
                          <td className="px-4 sm:px-6 py-4 truncate max-w-[150px] sm:max-w-none">{user.email}</td>
                          <td className="px-4 sm:px-6 py-4 capitalize">{user.userType}</td>
                          {activeTab === "students" && (
                            <td className="px-4 sm:px-6 py-4">
                              {user.schoolName || 
                               (user.schoolId && schools.find(s => s._id === user.schoolId)?.schoolName) || 
                               (user.school && user.school.schoolName) || "-"}
                            </td>
                          )}
                          <td className="px-4 sm:px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                        </>
                      )}
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex flex-col sm:flex-row gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(user)}
                            className="px-2 sm:px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition text-xs sm:text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="px-2 sm:px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition text-xs sm:text-sm font-medium"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() =>
                              handleActivateDeactivate(user._id, user.status === "active" ? "deactivated" : "active")
                            }
                            className={`px-2 sm:px-3 py-1 rounded-md hover:bg-opacity-80 transition text-xs sm:text-sm font-medium ${
                              user.status === "active"
                                ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                            }`}
                          >
                            {user.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement