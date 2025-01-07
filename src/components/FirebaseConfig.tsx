import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { setFirebaseConfig } from '@/lib/firebase';
import { toast } from 'sonner';

export const FirebaseConfig = () => {
  const [config, setConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFirebaseConfig(config);
    toast.success('Firebase configuration saved');
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Firebase Configuration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <Input
            type="password"
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Auth Domain</label>
          <Input
            type="text"
            value={config.authDomain}
            onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Project ID</label>
          <Input
            type="text"
            value={config.projectId}
            onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Storage Bucket</label>
          <Input
            type="text"
            value={config.storageBucket}
            onChange={(e) => setConfig({ ...config, storageBucket: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Messaging Sender ID</label>
          <Input
            type="text"
            value={config.messagingSenderId}
            onChange={(e) => setConfig({ ...config, messagingSenderId: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">App ID</label>
          <Input
            type="text"
            value={config.appId}
            onChange={(e) => setConfig({ ...config, appId: e.target.value })}
            required
          />
        </div>
        <Button type="submit" className="w-full">Save Configuration</Button>
      </form>
    </Card>
  );
};