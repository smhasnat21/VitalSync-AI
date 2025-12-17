import React, { useState } from 'react';
import { KnowledgeDoc } from '../types';
import { Plus, Trash2, FileText, Activity, Utensils, Dumbbell, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface KnowledgeBaseProps {
  docs: KnowledgeDoc[];
  addDoc: (doc: KnowledgeDoc) => void;
  removeDoc: (id: string) => void;
}

const CATEGORIES = ['Lab Report', 'Diet Plan', 'Workout Routine', 'Medical History', 'Other'];

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ docs, addDoc, removeDoc }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [newContent, setNewContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newDoc: KnowledgeDoc = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      category: newCategory as any,
      dateAdded: Date.now(),
    };

    addDoc(newDoc);
    setNewTitle('');
    setNewContent('');
    setIsFormOpen(false);
  };

  const getIcon = (category: string) => {
      switch(category) {
          case 'Lab Report': return Activity;
          case 'Diet Plan': return Utensils;
          case 'Workout Routine': return Dumbbell;
          default: return FileText;
      }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Knowledge Base (RAG)</h2>
            <p className="text-slate-500 mt-1">
                Upload your health context here. The AI uses these documents to personalize your advice.
            </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Record
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Blood Test Results 2024"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Paste the full text of your report, plan, or notes here..."
                rows={6}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Save Document
              </button>
            </div>
          </form>
        </div>
      )}

      {docs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No records found</p>
              <p className="text-sm text-slate-400">Add documents to enable personalized AI responses.</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docs.map((doc) => {
              const Icon = getIcon(doc.category);
              return (
                <div key={doc.id} className="group bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-teal-300 transition-colors relative">
                    <button 
                        onClick={() => removeDoc(doc.id)}
                        className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-start space-x-4">
                        <div className={clsx("p-3 rounded-lg bg-slate-50", 
                            doc.category === 'Lab Report' && "text-blue-600 bg-blue-50",
                            doc.category === 'Diet Plan' && "text-green-600 bg-green-50",
                            doc.category === 'Workout Routine' && "text-orange-600 bg-orange-50",
                        )}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-800 truncate pr-6">{doc.title}</h3>
                            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-medium">{doc.category}</p>
                            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                {doc.content}
                            </p>
                        </div>
                    </div>
                </div>
              );
            })}
          </div>
      )}
    </div>
  );
};

export default KnowledgeBase;