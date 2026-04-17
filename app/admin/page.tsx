'use client';

import { useState } from 'react';
// Mock data removed - Admin needs redesign for live API
const movies: any[] = [];
const genres: any[] = [];
import { Settings, Film, Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('movies');

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Settings size={28} className="text-red-600" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-[#141414] rounded-xl border border-gray-800 overflow-hidden">
              <button 
                onClick={() => setActiveTab('movies')}
                className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${activeTab === 'movies' ? 'bg-gray-800 text-white border-l-4 border-red-600' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border-l-4 border-transparent'}`}
              >
                <Film size={18} />
                <span className="font-medium">Manage Movies</span>
              </button>
              <button 
                onClick={() => setActiveTab('genres')}
                className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${activeTab === 'genres' ? 'bg-gray-800 text-white border-l-4 border-red-600' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border-l-4 border-transparent'}`}
              >
                <Film size={18} />
                <span className="font-medium">Manage Genres</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow">
            <div className="bg-[#141414] rounded-xl border border-gray-800 p-6">
              
              {activeTab === 'movies' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Movies ({movies.length})</h2>
                    <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      <Plus size={16} />
                      Add Movie
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-800 text-gray-400 text-sm">
                          <th className="pb-3 font-medium">Title</th>
                          <th className="pb-3 font-medium">Year</th>
                          <th className="pb-3 font-medium">Rating</th>
                          <th className="pb-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movies.map(movie => (
                          <tr key={movie.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                            <td className="py-4 text-gray-200">{movie.title}</td>
                            <td className="py-4 text-gray-400">{movie.year}</td>
                            <td className="py-4 text-gray-400">{movie.rating}</td>
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-md hover:bg-blue-500/10">
                                  <Edit size={16} />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-500/10">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'genres' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Genres ({genres.length})</h2>
                    <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      <Plus size={16} />
                      Add Genre
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {genres.map(genre => (
                      <div key={genre} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                        <span className="text-gray-200">{genre}</span>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 text-gray-500 hover:text-blue-500 transition-colors">
                            <Edit size={14} />
                          </button>
                          <button className="p-1.5 text-gray-500 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
