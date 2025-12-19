"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { apiCall, getUser } from "@/lib/api";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
    fetchUsers();
  }, [router]);

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const data = await apiCall("/auth/users");
      setUsers(data.filter((u: any) => u.role === "FARMER" || u.role === "COOPERATIVE"));
    } catch (e: any) {
      setError(e.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    setDeleting(userId);
    try {
      await apiCall(`/auth/users/${userId}`, { method: "DELETE" });
      setUsers(users.filter((u) => u.id !== userId));
    } catch (e: any) {
      alert(e.message || "Erreur lors de la suppression");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="min-h-screen py-14 animate-fade-in bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-6 mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-4xl shadow-lg">
              👥
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-emerald-900">Gestion des Utilisateurs</h1>
              <p className="text-gray-500 mt-2 text-lg">Administration des comptes utilisateurs</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <Card className="shadow-lg border border-emerald-100">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto mb-4 animate-spin"></div>
              <p className="text-gray-500 text-lg">Chargement des utilisateurs...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4">
                👥
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun utilisateur</h3>
              <p className="text-gray-500">Il n&apos;y a encore aucun utilisateur enregistré.</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-2xl">📋</span>
                  Liste des utilisateurs ({users.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Nom d&apos;utilisateur</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Rôle</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.username}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'FARMER'
                              ? 'bg-green-100 text-green-800'
                              : user.role === 'COOPERATIVE'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <span>
                              {user.role === 'FARMER' ? '👨‍🌾' : user.role === 'COOPERATIVE' ? '🤝' : '👤'}
                            </span>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="danger"
                            loading={deleting === user.id}
                            onClick={() => handleDelete(user.id)}
                            className="px-4 py-2"
                          >
                            {deleting === user.id ? 'Suppression...' : 'Supprimer'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>
    </div>
  );
}
