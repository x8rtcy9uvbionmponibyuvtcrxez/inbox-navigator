"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Loader2, ArrowRight } from 'lucide-react';

export default function WorkspaceSetup() {
  const [workspaceName, setWorkspaceName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { createWorkspace, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!workspaceName.trim()) {
      setError('Workspace name is required');
      setLoading(false);
      return;
    }

    const { error } = await createWorkspace(workspaceName.trim(), description.trim());

    if (error) {
      setError(error.message || 'Failed to create workspace');
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Workspace</h1>
        <p className="text-muted-foreground">
          Let&apos;s set up your workspace to get started with Inbox Navigator
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="workspaceName" className="block text-sm font-medium text-foreground mb-2">
            Workspace Name *
          </label>
          <input
            id="workspaceName"
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            required
            className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., My Company, Acme Corp"
          />
          <p className="text-xs text-muted-foreground mt-1">
            This will be the name of your workspace. You can change it later.
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Brief description of your workspace..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Workspace...</span>
            </>
          ) : (
            <>
              <span>Create Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h3 className="text-sm font-medium text-foreground mb-2">What&apos;s next?</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Add your first domain</li>
          <li>• Create email inboxes</li>
          <li>• Set up your team</li>
          <li>• Configure billing</li>
        </ul>
      </div>
    </div>
  );
}
